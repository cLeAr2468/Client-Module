import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BackgroundLayout from "@/components/layout/background-layout";
import DashboardHeader from "@/components/layout/dashboard-header";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Mail,
  MapPin,
  BookOpen,
  FileText,
  Loader2,
  Globe,
  MapPinIcon,
} from "lucide-react";
import { toast } from "sonner";
import api from "@/api/api";
import { getUser } from "@/utils/auth";

export default function AppointmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = getUser();

  useEffect(() => {
    fetchTransactionDetails();
  }, [id]);

  const fetchTransactionDetails = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/my-appointments/${id}`);
      setTransaction(response.data.transaction);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        navigate('/login');
      } else if (error.response?.status === 404) {
        toast.error('Appointment not found.');
        navigate('/appointment');
      } else {
        console.error('Fetch error:', error);
        toast.error('Failed to load appointment details.');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-red-100 text-red-700';
      case 'approved':
        return 'bg-blue-100 text-blue-700';
      case 'rejected':
        return 'bg-gray-100 text-gray-700';
      case 'cancelled':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <BackgroundLayout overlayColor="bg-green-950/70">
        <DashboardHeader />
        <div className="flex min-h-screen w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      </BackgroundLayout>
    );
  }

  if (!transaction) {
    return null;
  }

  return (
    <BackgroundLayout overlayColor="bg-green-950/70">
      <DashboardHeader />
      <div className="flex min-h-screen w-full">
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <Link to="/appointments">
                  <Button variant="ghost" className="mb-2 -ml-4 text-white hover:bg-white/20">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Appointments
                  </Button>
                </Link>
                <h1 className="text-3xl font-bold text-white">
                  Appointment Details
                </h1>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          
              {/* Right Column - Appointment Details */}
              <div className="space-y-6">
                {/* Appointment Information Card */}
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-green-700" />
                      Appointment Details
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center text-gray-600 mb-1">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span className="font-medium">Appointment Date</span>
                        </div>
                        <p className="text-gray-900 ml-6">{formatDate(transaction.schedule_date)}</p>
                      </div>
                      <div>
                        <div className="flex items-center text-gray-600 mb-1">
                          <Clock className="h-4 w-4 mr-2" />
                          <span className="font-medium">Time Slot</span>
                        </div>
                        <p className="text-gray-900 ml-6">{transaction.time_slot || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Purpose:</span>
                        <p className="text-gray-900 mt-1">{transaction.purpose?.name || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Request Type:</span>
                        <p className="mt-1">
                          <Badge className={transaction.request_type === 'online' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}>
                            {transaction.request_type === 'online' ? (
                              <><Globe className="h-3 w-3 mr-1 inline" />Online</>
                            ) : (
                              <><MapPinIcon className="h-3 w-3 mr-1 inline" />Walk-in</>
                            )}
                          </Badge>
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Date Requested:</span>
                        <p className="text-gray-900 mt-1 text-sm">
                          {formatDate(transaction.date_requested || transaction.created_at)}
                        </p>
                      </div>
                      {transaction.approved_at && (
                        <div>
                          <span className="font-medium text-blue-600">Approved:</span>
                          <p className="text-gray-900 mt-1 text-sm">
                            {formatDate(transaction.approved_at)}
                          </p>
                        </div>
                      )}
                      {transaction.status === 'rejected' && transaction.rejected_at && (
                        <div>
                          <span className="font-medium text-red-600">Rejected:</span>
                          <p className="text-gray-900 mt-1 text-sm">
                            {formatDate(transaction.rejected_at)}
                          </p>
                        </div>
                      )}
                      {transaction.status === 'cancelled' && transaction.cancelled_at && (
                        <div>
                          <span className="font-medium text-orange-600">Cancelled:</span>
                          <p className="text-gray-900 mt-1 text-sm">
                            {formatDate(transaction.cancelled_at)}
                          </p>
                        </div>
                      )}
                      {transaction.status === 'completed' && transaction.release_date && (
                        <div>
                          <span className="font-medium text-green-600">Released/Completed:</span>
                          <p className="text-gray-900 mt-1 text-sm">
                            {formatDate(transaction.release_date)}
                          </p>
                        </div>
                      )}
                      {transaction.status === 'rejected' && transaction.rejection_reason && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <span className="font-medium text-red-600">Rejection Reason:</span>
                          <p className="text-gray-900 mt-2 p-3 bg-red-50 border border-red-200 rounded-md text-sm">
                            {transaction.rejection_reason}
                          </p>
                        </div>
                      )}
                      {transaction.status === 'cancelled' && transaction.rejection_reason && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <span className="font-medium text-orange-600">Cancellation Reason:</span>
                          <p className="text-gray-900 mt-2 p-3 bg-orange-50 border border-orange-200 rounded-md text-sm">
                            {transaction.rejection_reason}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Status Info Card */}
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Status Information</h2>
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium text-gray-600">Current Status:</span>
                        <div className="mt-2">
                          <Badge className={getStatusColor(transaction.status)}>
                            {transaction.status?.charAt(0).toUpperCase() + transaction.status?.slice(1)}
                          </Badge>
                        </div>
                      </div>
                      {transaction.status === 'pending' && (
                        <p className="text-sm text-gray-600 mt-3">
                          Your appointment is pending approval. You will receive an email notification once it's reviewed.
                        </p>
                      )}
                      {transaction.status === 'approved' && (
                        <p className="text-sm text-blue-600 mt-3">
                          Your appointment has been approved! Please arrive on time on your scheduled date.
                        </p>
                      )}
                      {transaction.status === 'completed' && (
                        <p className="text-sm text-green-600 mt-3">
                          Your appointment has been completed. Thank you for using our service!
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </BackgroundLayout>
  );
}
