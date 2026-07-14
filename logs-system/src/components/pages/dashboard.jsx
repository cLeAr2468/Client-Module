import { useState, useEffect } from "react";
import BackgroundLayout from "@/components/layout/background-layout";
import DashboardHeader from "@/components/layout/dashboard-header";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  CheckCircle2,
  RefreshCw,
  ClockAlert,
  Activity,
  Clock,
  XCircle,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { getDashboardStatistics, getRecentActivity } from "@/api/dashboardApi";

export default function Dashboard() {
  const [stats, setStats] = useState({
    total_appointments: 0,
    completed_appointments: 0,
    approved_appointments: 0,
    pending_appointments: 0,
  });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch statistics and activities in parallel
      const [statsResponse, activityResponse] = await Promise.all([
        getDashboardStatistics(),
        getRecentActivity(),
      ]);

      setStats(statsResponse.statistics);
      setActivities(activityResponse.activities);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Format relative time without date-fns
  const formatRelativeTime = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    if (seconds < 2592000) return `${Math.floor(seconds / 604800)} weeks ago`;
    return `${Math.floor(seconds / 2592000)} months ago`;
  };

  const getActivityIcon = (iconName) => {
    const iconMap = {
      Clock: <Clock className="h-4 w-4" />,
      RefreshCw: <RefreshCw className="h-4 w-4" />,
      CheckCircle: <CheckCircle2 className="h-4 w-4" />,
      XCircle: <XCircle className="h-4 w-4" />,
      Calendar: <Calendar className="h-4 w-4" />,
      MessageSquare: <MessageSquare className="h-4 w-4" />,
    };
    return iconMap[iconName] || <Activity className="h-4 w-4" />;
  };

  const getActivityColor = (type, status) => {
    if (type === 'appointment') {
      switch (status) {
        case 'pending': return 'text-orange-600 bg-orange-100';
        case 'approved': return 'text-blue-600 bg-blue-100';
        case 'completed': return 'text-green-600 bg-green-100';
        case 'cancelled': return 'text-red-600 bg-red-100';
        default: return 'text-gray-600 bg-gray-100';
      }
    }
    return 'text-purple-600 bg-purple-100';
  };

  if (loading) {
    return (
      <BackgroundLayout overlayColor="bg-green-950/70">
        <DashboardHeader />
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
        </div>
      </BackgroundLayout>
    );
  }
  return (
    <BackgroundLayout overlayColor="bg-green-950/70">
      {/* Dashboard Header */}
      <DashboardHeader />

      {/* MOBILE VIEW */}
      <div className="block min-h-screen p-4 md:hidden">
        <div className="flex flex-col gap-4">
          <h1 className="text-center text-2xl font-bold text-white">
            Dashboard Overview
          </h1>

          {/* Stats Cards - Mobile */}
          <div className="grid grid-cols-1 gap-4">
            <Card className="border border-white/40 bg-white/90 backdrop-blur-sm shadow-lg transition-transform hover:scale-105">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600">
                      Total Appointment Requests
                    </h3>
                    <p className="mt-2 text-3xl font-bold text-green-800">
                      {stats.total_appointments}
                    </p>
                  </div>
                  <div className="rounded-full bg-green-100 p-3">
                    <Calendar className="h-8 w-8 text-green-800" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-white/40 bg-white/90 backdrop-blur-sm shadow-lg transition-transform hover:scale-105">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600">
                      Complete Appointments
                    </h3>
                    <p className="mt-2 text-3xl font-bold text-purple-600">
                      {stats.completed_appointments}
                    </p>
                  </div>
                  <div className="rounded-full bg-purple-100 p-3">
                    <CheckCircle2 className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-white/40 bg-white/90 backdrop-blur-sm shadow-lg transition-transform hover:scale-105">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600">
                      Approved Appointments
                    </h3>
                    <p className="mt-2 text-3xl font-bold text-blue-600">
                      {stats.approved_appointments}
                    </p>
                  </div>
                  <div className="rounded-full bg-blue-100 p-3">
                    <RefreshCw className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-white/40 bg-white/90 backdrop-blur-sm shadow-lg transition-transform hover:scale-105">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600">
                      Pending Appointment Requests
                    </h3>
                    <p className="mt-2 text-3xl font-bold text-orange-600">
                      {stats.pending_appointments}
                    </p>
                    {stats.pending_appointments > 0 && (
                      <div className="mt-1 flex items-center gap-1 text-xs text-orange-600">
                        <Clock className="h-3 w-3" />
                        <span>Needs attention</span>
                      </div>
                    )}
                  </div>
                  <div className="rounded-full bg-orange-100 p-3">
                    <ClockAlert className="h-8 w-8 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity - Mobile */}
          <Card className="border border-white/40 bg-white/90 backdrop-blur-sm shadow-lg">
            <CardContent className="p-4">
              <div className="mb-3 flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-800" />
                <h3 className="text-lg font-bold text-gray-800">
                  Recent Activity
                </h3>
              </div>
              {activities.length > 0 ? (
                <div className="space-y-3">
                  {activities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 text-sm">
                      <div className={`rounded-full p-2 ${getActivityColor(activity.type, activity.status)}`}>
                        {getActivityIcon(activity.icon)}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{activity.action}</p>
                        <p className="text-gray-600">{activity.description}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatRelativeTime(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No recent activity</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* DESKTOP VIEW */}
      <div className="hidden min-h-screen p-8 md:block">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-8 text-center text-4xl font-bold text-white">
            Dashboard Overview
          </h1>

          {/* Stats Cards - Desktop */}
          <div className="mb-8 grid lg:grid-cols-4 md:grid-cols-2 gap-6">
            <Card className="border border-white/40 bg-white/90 backdrop-blur-sm shadow-lg transition-all hover:scale-105 hover:shadow-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600">
                      Total Appointment Requests
                    </h3>
                    <p className="mt-3 text-4xl font-bold text-green-800">
                      {stats.total_appointments}
                    </p>
                  </div>
                  <div className="rounded-full bg-green-100 p-4">
                    <Calendar className="h-12 w-12 text-green-800" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-white/40 bg-white/90 backdrop-blur-sm shadow-lg transition-all hover:scale-105 hover:shadow-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600">
                      Complete Appointments
                    </h3>
                    <p className="mt-3 text-4xl font-bold text-purple-600">
                      {stats.completed_appointments}
                    </p>
                  </div>
                  <div className="rounded-full bg-purple-100 p-4">
                    <CheckCircle2 className="h-12 w-12 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-white/40 bg-white/90 backdrop-blur-sm shadow-lg transition-all hover:scale-105 hover:shadow-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600">
                      Approved Appointments
                    </h3>
                    <p className="mt-3 text-4xl font-bold text-blue-600">
                      {stats.approved_appointments}
                    </p>
                  </div>
                  <div className="rounded-full bg-blue-100 p-4">
                    <RefreshCw className="h-12 w-12 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-white/40 bg-white/90 backdrop-blur-sm shadow-lg transition-all hover:scale-105 hover:shadow-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600">
                      Pending Appointment Requests
                    </h3>
                    <p className="mt-3 text-4xl font-bold text-orange-600">
                      {stats.pending_appointments}
                    </p>
                    {stats.pending_appointments > 0 && (
                      <div className="mt-2 flex items-center gap-1 text-sm text-orange-600">
                        <Clock className="h-4 w-4" />
                        <span>Needs attention</span>
                      </div>
                    )}
                  </div>
                  <div className="rounded-full bg-orange-100 p-4">
                    <ClockAlert className="h-12 w-12 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity - Desktop */}
          <Card className="border border-white/40 bg-white/90 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center gap-2">
                <Activity className="h-6 w-6 text-green-800" />
                <h3 className="text-2xl font-bold text-gray-800">
                  Recent Activity
                </h3>
              </div>
              {activities.length > 0 ? (
                <div className="space-y-4">
                  {activities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className={`rounded-full p-2 ${getActivityColor(activity.type, activity.status)}`}>
                        {getActivityIcon(activity.icon)}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{activity.action}</p>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatRelativeTime(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No recent activity</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </BackgroundLayout>
  );
}
