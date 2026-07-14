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
import Pagination from "@/components/ui/pagination";
import { RefreshCw } from "lucide-react";
import { getUserAppointments } from "@/api/appointmentApi";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch appointments/transactions
  const fetchTransactions = async () => {
    setLoading(true);
    setError("");
    
    try {
      const response = await getUserAppointments();
      console.log("✅ Transactions fetched:", response);
      setTransactions(response.transactions || []);
    } catch (err) {
      console.error("❌ Error fetching transactions:", err);
      setError(err.message || "Failed to load transaction history");
    } finally {
      setLoading(false);
    }
  };

  // Fetch on component mount
  useEffect(() => {
    fetchTransactions();
  }, []);

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
        return "Processing";
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

  const filteredTransactions = transactions.filter((item) => {
    // Only show completed, cancelled, and rejected statuses
    const allowedStatuses = ['completed', 'cancelled', 'rejected'];
    
    // Filter out pending and approved (processing)
    if (!allowedStatuses.includes(item.status)) {
      return false;
    }

    // Map backend status to display status
    const displayStatus = getDisplayStatus(item.status);
    const statusMatch = filter === "All" || displayStatus === filter;

    return statusMatch;
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

  const getStatusColor = (status) => {
    const displayStatus = getDisplayStatus(status);
    switch (displayStatus) {
      case "Completed":
        return "bg-green-100 text-green-700 hover:bg-green-100";
      case "Cancelled":
        return "bg-gray-100 text-gray-700 hover:bg-gray-100";
      case "Rejected":
        return "bg-red-100 text-red-700 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getFilterButtonClass = (status) => {
    if (filter !== status) return "";

    switch (status) {
      case "Completed":
        return "bg-green-600 hover:bg-green-700 text-white";
      case "Cancelled":
        return "bg-gray-600 hover:bg-gray-700 text-white";
      case "Rejected":
        return "bg-red-600 hover:bg-red-700 text-white";
      default:
        return "bg-[#15592F] hover:bg-[#124b28] text-white";
    }
  };

  const renderFilterButtons = () =>
    ["All", "Completed", "Cancelled", "Rejected"].map((status) => (
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
            <div className="hidden md:block">
              <div className="flex flex-col gap-4 mb-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold text-white">
                    Transaction History
                  </h2>
                  <Button
                    onClick={fetchTransactions}
                    className="bg-gray-700 hover:bg-gray-800 text-white shadow-md h-10 rounded-md"
                    disabled={loading}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600">{error}</p>
                  </div>
                )}

                <div className="flex gap-2 flex-wrap">
                  {renderFilterButtons()}
                </div>
              </div>

              <Card className="border-0 shadow-sm rounded-2xl">
                <CardContent className="p-6">
                  {loading ? (
                    <div className="text-center py-10">
                      <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-500">Loading transaction history...</p>
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
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell
                                colSpan={6}
                                className="text-center py-8 text-gray-500"
                              >
                                {filter === "All"
                                  ? "No transaction history found."
                                  : `No ${filter} transactions found.`}
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
                <h2 className="text-2xl font-semibold text-white">
                  Transaction History
                </h2>

                {/* Error Message */}
                {error && (
                  <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <div className="flex gap-2 flex-wrap justify-center">
                  {renderFilterButtons()}
                </div>

                <Button
                  onClick={fetchTransactions}
                  className="bg-gray-700 hover:bg-gray-800 text-white shadow-md h-10 w-full rounded-md"
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>

              {loading ? (
                <Card className="rounded-2xl">
                  <CardContent className="py-10 text-center">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">Loading transaction history...</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {currentTransactions.length > 0 ? (
                    currentTransactions.map((item) => (
                      <Card
                        key={item.id}
                        className="rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all"
                      >
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
                              <p className="text-xs text-gray-500 uppercase">
                                Purpose
                              </p>
                              <p className="font-medium">{item.purpose}</p>
                            </div>

                            <div>
                              <p className="text-xs text-gray-500 uppercase">
                                Address
                              </p>
                              <p>{item.street_house_no}, {item.brgy}, {item.municipality}, {item.province}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <p className="text-xs text-gray-500 uppercase">
                                  Schedule Date
                                </p>
                                <p>{formatDate(item.schedule_date)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 uppercase">
                                  Time Slot
                                </p>
                                <p>{item.time_slot}</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="py-10 text-center text-gray-500">
                        {filter === "All" 
                          ? "No transaction history found." 
                          : `No ${filter} transactions found.`
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
    </BackgroundLayout>
  );
};

export default Transactions;