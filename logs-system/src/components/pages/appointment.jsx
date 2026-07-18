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
import Pagination from "@/components/ui/pagination";
import { Plus, Edit, RefreshCw } from "lucide-react";
import { getUserAppointments, cancelAppointment } from "@/api/appointmentApi";
import { getUser } from "@/utils/auth";

export default function Appointments() {
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [isEditAppointmentOpen, setIsEditAppointmentOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const [searchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch appointments
  const fetchAppointments = async () => {
    setLoading(true);
    setError("");
    
    try {
      const response = await getUserAppointments();
      console.log("✅ Appointments fetched:", response);
      setTransactions(response.transactions || []);
    } catch (err) {
      console.error("❌ Error fetching appointments:", err);
      setError(err.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  // Fetch on component mount
  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleNewAppointment = (appointmentData) => {
    console.log("New appointment created:", appointmentData);
    // Refresh appointments list
    fetchAppointments();
  };

  const handleEditAppointment = (updatedData) => {
    console.log("Edited appointment:", updatedData);
    setIsEditAppointmentOpen(false);
    setSelectedAppointment(null);
    // Refresh appointments list
    fetchAppointments();
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      const response = await cancelAppointment(appointmentId);
      console.log("✅ Appointment cancelled:", response);
      alert(response.message || "Appointment cancelled successfully");
      // Refresh appointments list
      fetchAppointments();
    } catch (err) {
      console.error("❌ Error cancelling appointment:", err);
      alert(err.message || "Failed to cancel appointment");
    }
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
      case "rejected":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getFilterButtonClass = (status) => {
    if (filter !== status) return "";
    switch (status) {
      case "Pending":
        return "bg-red-600 hover:bg-red-700 text-white";
      case "Approved":
        return "bg-blue-600 hover:bg-blue-700 text-white";
      case "Completed":
        return "bg-green-600 hover:bg-green-700 text-white";
      default:
        return "bg-[#15592F] hover:bg-[#124b28] text-white";
    }
  };

  const filteredTransactions = transactions.filter((item) => {
    // Map backend status to display status
    const displayStatus = getDisplayStatus(item.status);
    const statusMatch = filter === "All" || displayStatus === filter;
    
    const searchMatch =
      searchQuery === "" ||
      item.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.street_house_no && item.street_house_no.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.brgy && item.brgy.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.municipality && item.municipality.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return statusMatch && searchMatch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderFilterButtons = () =>
    ["All", "Pending", "Approved", "Completed"].map((status) => (
      <Button
        key={status}
        variant={filter === status ? "default" : "outline"}
        onClick={() => setFilter(status)}
        className={getFilterButtonClass(status)}
      >
        {status}
      </Button>
    ));

  return (
    <BackgroundLayout overlayColor="bg-green-950/70">
      <DashboardHeader />
      <div className="flex min-h-screen w-full">
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between mb-8" />

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
                <div className="flex gap-2 flex-wrap">{renderFilterButtons()}</div>
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
                            <TableHead>Request Date</TableHead>
                            <TableHead>Purpose</TableHead>
                            <TableHead>Address</TableHead>
                            <TableHead>Schedule Date</TableHead>
                            <TableHead>Time Slot</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>

                        <TableBody>
                          {currentTransactions.length > 0 ? (
                            currentTransactions.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell>{formatDate(item.created_at)}</TableCell>
                                <TableCell>{item.purpose}</TableCell>
                                <TableCell>
                                  {item.brgy}, {item.municipality}
                                </TableCell>
                                <TableCell>{formatDate(item.schedule_date)}</TableCell>
                                <TableCell>{item.time_slot}</TableCell>
                                <TableCell>
                                  <Badge className={getStatusColor(item.status)}>
                                    {getDisplayStatus(item.status)}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end items-center gap-2">
                                    {item.status === "pending" && (
                                      <>
                                        <Button
                                          onClick={() => {
                                            setSelectedAppointment(item);
                                            setIsEditAppointmentOpen(true);
                                          }}
                                          aria-label="Edit appointment"
                                          className="h-8 w-8 p-0 rounded-full bg-white hover:bg-[#15592F] hover:text-white flex text-[#15592F] items-center justify-center"
                                        >
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button 
                                          variant="destructive" 
                                          className="h-9 px-3" 
                                          title="Cancel"
                                          onClick={() => handleCancelAppointment(item.id)}
                                        >
                                          Cancel
                                        </Button>
                                      </>
                                    )}
                                    {item.status !== "pending" && (
                                      <span className="text-sm text-gray-500">-</span>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                {searchQuery 
                                  ? `No transactions found matching "${searchQuery}" in ${filter} status.` 
                                  : filter === "All"
                                  ? "No appointments found. Create your first appointment!"
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

            <div className="block md:hidden">
              <div className="flex flex-col gap-4 mb-6 items-center">
                <h2 className="text-2xl font-semibold text-white">Appointment Records</h2>
                
                {/* Error Message */}
                {error && (
                  <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
                
                <div className="flex gap-2 flex-wrap">{renderFilterButtons()}</div>
                
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
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-[#15592F] text-lg">
                                {formatDate(item.created_at)}
                              </h3>
                              <p className="text-xs text-gray-500 mt-1">Request Date</p>
                            </div>
                            <Badge className={getStatusColor(item.status)}>
                              {getDisplayStatus(item.status)}
                            </Badge>
                          </div>

                          <div className="border-t my-4"></div>

                          <div className="space-y-3">
                            <div>
                              <p className="text-xs text-gray-500 uppercase">Purpose</p>
                              <p className="font-medium">{item.purpose}</p>
                            </div>

                            <div>
                              <p className="text-xs text-gray-500 uppercase">Address</p>
                              <p>{item.street_house_no}, {item.brgy}, {item.municipality}, {item.province}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <p className="text-xs text-gray-500 uppercase">Schedule Date</p>
                                <p>{formatDate(item.schedule_date)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 uppercase">Time Slot</p>
                                <p>{item.time_slot}</p>
                              </div>
                            </div>
                          </div>

                          {item.status === "pending" && (
                            <div className="flex justify-end gap-2 mt-4">
                              <Button
                                onClick={() => {
                                  setSelectedAppointment(item);
                                  setIsEditAppointmentOpen(true);
                                }}
                                aria-label="Edit appointment"
                                className="h-9 w-9 p-0 rounded-full border-[#15592F] text-[#15592F] flex 
                                bg-white hover:bg-[#15592F] hover:text-white items-center justify-center"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>

                              <Button 
                                variant="destructive" 
                                className="h-9 px-3" 
                                title="Cancel"
                                onClick={() => handleCancelAppointment(item.id)}
                              >
                                Cancel
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="py-10 text-center text-gray-500">
                        {filter === "All" 
                          ? "No appointments found. Create your first appointment!" 
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
    </BackgroundLayout>
  );
}