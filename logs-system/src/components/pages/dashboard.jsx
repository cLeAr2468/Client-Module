import BackgroundLayout from "@/components/layout/background-layout";
import DashboardHeader from "@/components/layout/dashboard-header";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  UserCheck,
  FileText,
  Activity,
  Clock
} from "lucide-react";
export default function Dashboard() {
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
                    <p className="mt-2 text-3xl font-bold text-green-800">1,234</p>
                  </div>
                  <div className="rounded-full bg-green-100 p-3">
                    <Users className="h-8 w-8 text-green-800" />
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
                    <p className="mt-2 text-3xl font-bold text-purple-600">856</p>
                  </div>
                  <div className="rounded-full bg-purple-100 p-3">
                    <UserCheck className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-white/40 bg-white/90 backdrop-blur-sm shadow-lg transition-transform hover:scale-105">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600">
                      Processing Appointments
                    </h3>
                    <p className="mt-2 text-3xl font-bold text-blue-600">856</p>
                  </div>
                  <div className="rounded-full bg-purple-100 p-3">
                    <UserCheck className="h-8 w-8 text-blue-600" />
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
                    <p className="mt-2 text-3xl font-bold text-orange-600">23</p>
                    <div className="mt-1 flex items-center gap-1 text-xs text-orange-600">
                      <Clock className="h-3 w-3" />
                      <span>Needs attention</span>
                    </div>
                  </div>
                  <div className="rounded-full bg-orange-100 p-3">
                    <FileText className="h-8 w-8 text-orange-600" />
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
              <div className="space-y-2 text-sm text-gray-600">
                <p>• New Appointment Request</p>
                <p>• User profile updated</p>
              </div>
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
                    <p className="mt-3 text-4xl font-bold text-green-800">1,234</p>
                  </div>
                  <div className="rounded-full bg-green-100 p-4">
                    <Users className="h-12 w-12 text-green-800" />
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
                    <p className="mt-3 text-4xl font-bold text-purple-600">856</p>
                  </div>
                  <div className="rounded-full bg-purple-100 p-4">
                    <UserCheck className="h-12 w-12 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-white/40 bg-white/90 backdrop-blur-sm shadow-lg transition-all hover:scale-105 hover:shadow-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600">
                      Processing Appointments
                    </h3>
                    <p className="mt-3 text-4xl font-bold text-blue-600">856</p>
                  </div>
                  <div className="rounded-full bg-purple-100 p-4">
                    <UserCheck className="h-12 w-12 text-blue-600" />
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
                    <p className="mt-3 text-4xl font-bold text-orange-600">23</p>
                    <div className="mt-2 flex items-center gap-1 text-sm text-orange-600">
                      <Clock className="h-4 w-4" />
                      <span>Needs attention</span>
                    </div>
                  </div>
                  <div className="rounded-full bg-orange-100 p-4">
                    <FileText className="h-12 w-12 text-orange-600" />
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
             <div className="space-y-2 text-sm text-gray-600">
                <p>• New Appointment Request</p>
                <p>• User profile updated</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </BackgroundLayout>
  );
}
