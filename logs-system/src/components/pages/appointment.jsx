import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import BackgroundLayout from "@/components/layout/background-layout";
import DashboardHeader from "@/components/layout/dashboard-header";
import NewAppointmentDialog from "@/components/modals/new-appointment";
import EditAppointmentDialog from "@/components/modals/edit-appoint";
import ViewFeedbackDialog from "@/components/modals/view-feedback";
import GiveFeedbackDialog from "@/components/modals/give-feedback";
import CancelAppointmentDialog from "@/components/modals/cancel-appointment";
import Pagination from "@/components/ui/pagination";
import { 
  Plus, 
  RefreshCw, 
  Filter, 
  MoreVertical,
  Eye,
  Edit,
  XCircle,
  MessageSquare,
  Star,
  Globe,
  MapPinIcon
} from "lucide-react";
import { Link } from "react-router-dom";
import { getUserAppointments, cancelAppointment } from "@/api/appointmentApi";
import { getAllPurposes } from "@/api/purposeApi";
import { ActivityLogger } from "@/api/activityLogApi";
import { getApiBaseUrl } from "@/utils/apiConfig";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Appointments() {
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [isEditAppointmentOpen, setIsEditAppointmentOpen] = useState(false);
  const [isViewFeedbackOpen, setIsViewFeedbackOpen] = useState(false);
  const [isGiveFeedbackOpen, setIsGiveFeedbackOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [transactionFeedbacks, setTransactionFeedbacks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const [searchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [purposeFilter, setPurposeFilter] = useState("All Purposes");
  const [purposes, setPurposes] = useState([]);

  // Fetch appointments
  const fetchAppointments = async () => {
    setLoading(true);
    setError("");
    
    try {
      console.log('📥 Fetching appointments...');
      const response = await getUserAppointments();
      console.log("✅ Appointments fetched:", response);
      const fetchedTransactions = response.transactions || [];
      setTransactions(fetchedTransactions);
      
      // Fetch feedback status for completed transactions
      fetchFeedbackStatuses(fetchedTransactions);
    } catch (err) {
      console.error("❌ Error fetching appointments:", err);
      console.error("Error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setError(err.message || "Failed to load appointments");
      toast.error(err.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  // Fetch feedback status for all completed transactions
  const fetchFeedbackStatuses = async (transactions) => {
    const completedTransactions = transactions.filter(t => t.status === 'completed');
    const feedbackMap = {};

    // Process in batches to avoid overwhelming the server
    for (const transaction of completedTransactions) {
      try {
        const token = localStorage.getItem('auth_token');
        const API_BASE_URL = getApiBaseUrl();
        const url = `${API_BASE_URL}/transaction/${transaction.id}/feedback-status`;
        
        console.log(`Fetching feedback status for transaction ${transaction.id}...`);
        
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        });
        
        if (!response.ok) {
          console.warn(`Failed to fetch feedback status for transaction ${transaction.id}: ${response.status}`);
          feedbackMap[transaction.id] = false;
          continue;
        }
        
        const data = await response.json();
        feedbackMap[transaction.id] = data.has_feedback;
        console.log(`Transaction ${transaction.id} feedback status:`, data.has_feedback);
      } catch (err) {
        console.error(`Error checking feedback for transaction ${transaction.id}:`, err);
        feedbackMap[transaction.id] = false;
      }
    }

    console.log('All feedback statuses:', feedbackMap);
    setTransactionFeedbacks(feedbackMap);
  };

  // Fetch on component mount
  useEffect(() => {
    fetchAppointments();
    fetchPurposes();
    // Log page view
    ActivityLogger.appointmentViewed();
  }, []);

  const fetchPurposes = async () => {
    try {
      const response = await getAllPurposes();
      setPurposes(response.purposes || []);
    } catch (err) {
      console.error("❌ Error fetching purposes:", err);
    }
  };

  const handleNewAppointment = (appointmentData) => {
    console.log("New appointment created:", appointmentData);
    // Log appointment creation
    ActivityLogger.appointmentCreated(appointmentData);
    // Refresh appointments list
    fetchAppointments();
  };

  const handleEditAppointment = (updatedData) => {
    console.log("Edited appointment:", updatedData);
    // Log appointment update
    ActivityLogger.appointmentUpdated(updatedData.id, updatedData);
    setIsEditAppointmentOpen(false);
    setSelectedAppointment(null);
    // Refresh appointments list to show updated data
    fetchAppointments();
  };

  const handleCancelAppointment = async (appointmentId, reason) => {
    try {
      // Call API with cancellation reason
      const response = await cancelAppointment(appointmentId, reason);
      console.log("✅ Appointment cancelled:", response);
      toast.success(response.message || "Appointment cancelled successfully");
      // Log appointment cancellation
      ActivityLogger.appointmentCancelled(appointmentId);
      // Refresh appointments list
      fetchAppointments();
    } catch (err) {
      console.error("❌ Error cancelling appointment:", err);
      throw err; // Re-throw so dialog can handle it
    }
  };

  const openCancelDialog = (appointment) => {
    setAppointmentToCancel(appointment);
    setIsCancelDialogOpen(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Map backend status to display status
  const getDisplayStatus = (status) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "approved":
        return "Approved";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      case "rejected":
        return "Rejected";
      default:
        return "Pending";
    }
  };

  const getStatusColor = (status) => {
    const displayStatus = getDisplayStatus(status);
    switch (displayStatus) {
      case "Pending":
        return "bg-red-100 text-red-700 hover:bg-red-100";
      case "Approved":
        return "bg-blue-100 text-blue-700 hover:bg-blue-100";
      case "Completed":
        return "bg-green-100 text-green-700 hover:bg-green-100";
      case "Cancelled":
        return "bg-gray-100 text-gray-700 hover:bg-gray-100";
      case "Rejected":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredTransactions = transactions.filter((item) => {
    // Map backend status to display status
    const displayStatus = getDisplayStatus(item.status);
    
    // Filter by status
    const statusMatch = filter === "All" || displayStatus === filter;
    
    // Purpose filter - PURE RELATIONSHIP: item.purpose.name
    const purposeName = item.purpose?.name || '';
    const purposeMatch = purposeFilter === "All Purposes" || purposeName === purposeFilter;
    
    const searchMatch =
      searchQuery === "" ||
      purposeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.brgy && item.brgy.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.municipality && item.municipality.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return statusMatch && searchMatch && purposeMatch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, purposeFilter]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <BackgroundLayout overlayColor="bg-green-950/70">
      <DashboardHeader />
      <div className="flex min-h-screen w-full">
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {/* Desktop View */}
            <div className="hidden md:block">
              <h2 className="text-2xl font-semibold text-white mb-6">
                Appointment Records
              </h2>
              
              {/* Error Message */}
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600">{error}</p>
                </div>
              )}

              <div className="flex gap-4 mb-6 justify-between">
                <div className="flex gap-2 flex-wrap items-center">
                  {/* Status Filter as Select */}
                  <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-[160px] h-10 bg-white">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Status</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {/* Purpose Filter Dropdown */}
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-white" />
                    <Select value={purposeFilter} onValueChange={setPurposeFilter}>
                      <SelectTrigger className="w-[200px] h-10 bg-white">
                        <SelectValue placeholder="Filter by purpose" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All Purposes">All Purposes</SelectItem>
                        {purposes.map((purpose) => (
                          <SelectItem key={purpose.id} value={purpose.name}>
                            {purpose.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={fetchAppointments}
                    className="bg-gray-700 hover:bg-gray-800 text-white shadow-md h-10 rounded-md"
                    disabled={loading}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedAppointment(null);
                      setIsNewAppointmentOpen(true);
                    }}
                    className="bg-[#124b28] hover:bg-[#186335] text-white shadow-md h-10 rounded-md"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    REQUEST APPOINTMENT
                  </Button>
                </div>
              </div>

              <Card className="border-0 shadow-sm rounded-2xl">
                <CardContent className="p-6">
                  {loading ? (
                    <div className="text-center py-10">
                      <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-500">Loading appointments...</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Transaction #</TableHead>
                            <TableHead>Date Requested</TableHead>
                            <TableHead>Purpose</TableHead>
                            <TableHead>Appointment Date</TableHead>
                            <TableHead>Time Slot</TableHead>
                            <TableHead>Request Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>

                        <TableBody>
                          {currentTransactions.length > 0 ? (
                            currentTransactions.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell className="font-medium">#{item.id}</TableCell>
                                <TableCell>{formatDate(item.date_requested || item.created_at)}</TableCell>
                                <TableCell>{item.purpose?.name || 'N/A'}</TableCell>
                                <TableCell>{formatDate(item.schedule_date)}</TableCell>
                                <TableCell>{item.time_slot || 'N/A'}</TableCell>
                                <TableCell>
                                  <Badge className={item.request_type === 'online' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}>
                                    {item.request_type === 'online' ? (
                                      <>Online</>
                                    ) : (
                                      <>Walk-in</>
                                    )}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge className={getStatusColor(item.status)}>
                                    {getDisplayStatus(item.status)}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <MoreVertical className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem asChild>
                                        <Link
                                          to={`/appointment/${item.id}`}
                                          className="flex items-center cursor-pointer"
                                        >
                                          <Eye className="h-4 w-4 mr-2" />
                                          View Details
                                        </Link>
                                      </DropdownMenuItem>
                                      
                                      {item.status === "pending" && (
                                        <>
                                          <DropdownMenuItem
                                            onClick={() => {
                                              setSelectedAppointment(item);
                                              setIsEditAppointmentOpen(true);
                                            }}
                                            className="cursor-pointer"
                                          >
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit
                                          </DropdownMenuItem>
                                          <DropdownMenuItem
                                            onClick={() => openCancelDialog(item)}
                                            className="cursor-pointer text-red-600"
                                          >
                                            <XCircle className="h-4 w-4 mr-2" />
                                            Cancel
                                          </DropdownMenuItem>
                                        </>
                                      )}
                                      
                                      {item.status === "completed" && (
                                        <>
                                          {transactionFeedbacks[item.id] ? (
                                            <DropdownMenuItem
                                              onClick={() => {
                                                setSelectedTransactionId(item.id);
                                                setIsViewFeedbackOpen(true);
                                              }}
                                              className="cursor-pointer text-green-600"
                                            >
                                              <MessageSquare className="h-4 w-4 mr-2" />
                                              View Feedback
                                            </DropdownMenuItem>
                                          ) : (
                                            <DropdownMenuItem
                                              onClick={() => {
                                                setSelectedTransaction(item);
                                                setIsGiveFeedbackOpen(true);
                                              }}
                                              className="cursor-pointer text-blue-600"
                                            >
                                              <Star className="h-4 w-4 mr-2" />
                                              Give Feedback
                                            </DropdownMenuItem>
                                          )}
                                        </>
                                      )}
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                                {searchQuery 
                                  ? `No transactions found matching "${searchQuery}".` 
                                  : filter === "All" 
                                    ? "No appointments found."
                                    : `No ${filter} appointments found.`
                                }
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  )}

                  {/* Pagination for Desktop */}
                  {!loading && filteredTransactions.length > itemsPerPage && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Mobile View */}
            <div className="block md:hidden">
              <div className="flex flex-col gap-4 mb-6 items-center">
                <h2 className="text-2xl font-semibold text-white">Appointment Records</h2>
                
                {/* Error Message */}
                {error && (
                  <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
                
                {/* Status Filter */}
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-full h-10 bg-white">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Status</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                
                {/* Purpose Filter Dropdown for Mobile */}
                <div className="flex items-center gap-2 w-full">
                  <Filter className="h-4 w-4 text-white" />
                  <Select value={purposeFilter} onValueChange={setPurposeFilter}>
                    <SelectTrigger className="flex-1 h-10 bg-white">
                      <SelectValue placeholder="Filter by purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Purposes">All Purposes</SelectItem>
                      {purposes.map((purpose) => (
                        <SelectItem key={purpose.id} value={purpose.name}>
                          {purpose.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex gap-2 w-full">
                  <Button
                    onClick={fetchAppointments}
                    className="bg-gray-700 hover:bg-gray-800 text-white shadow-md h-10 flex-1 rounded-md"
                    disabled={loading}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedAppointment(null);
                      setIsNewAppointmentOpen(true);
                    }}
                    className="bg-[#124b28] hover:bg-[#186335] text-white shadow-md h-10 flex-1 rounded-md"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    NEW
                  </Button>
                </div>
              </div>

              {loading ? (
                <Card className="rounded-2xl">
                  <CardContent className="py-10 text-center">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">Loading appointments...</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {currentTransactions.length > 0 ? (
                    currentTransactions.map((item) => (
                      <Card key={item.id} className="rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-semibold text-[#15592F] text-base">
                                #{item.id} - {formatDate(item.date_requested || item.created_at)}
                              </h3>
                              <p className="text-xs text-gray-500 mt-1">Date Requested</p>
                            </div>
                            <div className="flex gap-2 items-center">
                              <Badge className={getStatusColor(item.status)}>
                                {getDisplayStatus(item.status)}
                              </Badge>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem asChild>
                                    <Link
                                      to={`/appointment/${item.id}`}
                                      className="flex items-center cursor-pointer"
                                    >
                                      <Eye className="h-4 w-4 mr-2" />
                                      View Details
                                    </Link>
                                  </DropdownMenuItem>
                                  
                                  {item.status === "pending" && (
                                    <>
                                      <DropdownMenuItem
                                        onClick={() => {
                                          setSelectedAppointment(item);
                                          setIsEditAppointmentOpen(true);
                                        }}
                                        className="cursor-pointer"
                                      >
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => handleCancelAppointment(item.id)}
                                        className="cursor-pointer text-red-600"
                                      >
                                        <XCircle className="h-4 w-4 mr-2" />
                                        Cancel
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                  
                                  {item.status === "completed" && (
                                    <>
                                      {transactionFeedbacks[item.id] ? (
                                        <DropdownMenuItem
                                          onClick={() => {
                                            setSelectedTransactionId(item.id);
                                            setIsViewFeedbackOpen(true);
                                          }}
                                          className="cursor-pointer text-green-600"
                                        >
                                          <MessageSquare className="h-4 w-4 mr-2" />
                                          View Feedback
                                        </DropdownMenuItem>
                                      ) : (
                                        <DropdownMenuItem
                                          onClick={() => {
                                            setSelectedTransaction(item);
                                            setIsGiveFeedbackOpen(true);
                                          }}
                                          className="cursor-pointer text-blue-600"
                                        >
                                          <Star className="h-4 w-4 mr-2" />
                                          Give Feedback
                                        </DropdownMenuItem>
                                      )}
                                    </>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>

                          <div className="border-t my-3"></div>

                          <div className="space-y-2">
                            <div>
                              <p className="text-xs text-gray-500 uppercase">Purpose</p>
                              <p className="font-medium text-sm">{item.purpose?.name || 'N/A'}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <p className="text-xs text-gray-500 uppercase">Appointment Date</p>
                                <p className="text-sm">{formatDate(item.schedule_date)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 uppercase">Time Slot</p>
                                <p className="text-sm">{item.time_slot || 'N/A'}</p>
                              </div>
                            </div>

                            <div>
                              <p className="text-xs text-gray-500 uppercase">Request Type</p>
                              <Badge className={`mt-1 ${item.request_type === 'online' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                                {item.request_type === 'online' ? (
                                  <>Online</>
                                ) : (
                                  <>Walk-in</>
                                )}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="py-10 text-center text-gray-500">
                        {filter === "All" 
                          ? "No appointments found."
                          : `No ${filter} appointments found.`
                        }
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* Pagination for Mobile */}
              {!loading && filteredTransactions.length > itemsPerPage && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          </div>
        </main>
      </div>

      {/* New Appointment Modal */}
      <NewAppointmentDialog
        open={isNewAppointmentOpen}
        onOpenChange={setIsNewAppointmentOpen}
        onSubmit={handleNewAppointment}
      />

      {/* Edit Appointment Modal */}
      <EditAppointmentDialog
        open={isEditAppointmentOpen}
        onOpenChange={(val) => {
          setIsEditAppointmentOpen(val);
          if (!val) setSelectedAppointment(null);
        }}
        initialData={selectedAppointment}
        onSubmit={handleEditAppointment}
      />

      {/* View Feedback Modal */}
      <ViewFeedbackDialog
        open={isViewFeedbackOpen}
        onOpenChange={setIsViewFeedbackOpen}
        transactionId={selectedTransactionId}
      />

      {/* Give Feedback Modal */}
      <GiveFeedbackDialog
        open={isGiveFeedbackOpen}
        onOpenChange={setIsGiveFeedbackOpen}
        transaction={selectedTransaction}
        onSubmitSuccess={() => {
          fetchAppointments();
          setIsGiveFeedbackOpen(false);
        }}
      />
      {/* Cancel Appointment Modal */}
      <CancelAppointmentDialog
        open={isCancelDialogOpen}
        onOpenChange={setIsCancelDialogOpen}
        appointment={appointmentToCancel}
        onConfirm={async (reason) => {
          await handleCancelAppointment(appointmentToCancel.id, reason);
        }}
      />
    </BackgroundLayout>
  );
}
