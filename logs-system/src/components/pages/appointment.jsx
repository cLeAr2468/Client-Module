import { useState } from "react";
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
import { Plus } from "lucide-react";

const Appointments = () => {
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  
  const transactions = [
    {
      date: "Jun 30, 2025",
      student: "Criscel Jane",
      purpose: "Good Moral Certificate",
      address: "Brgy. Quezon, San Jorge",
      course: "BSA",
      status: "Pending",
    },
    {
      date: "Jun 30, 2025",
      student: "Lean Cabarles",
      purpose: "TES Scholarship",
      address: "Brgy. Erenas, San Jorge",
      course: "BEED",
      status: "Pending",
    },
    {
      date: "May 1, 2026",
      student: "Kyla Aliman",
      purpose: "Student Clearance",
      address: "Gandara Samar",
      course: "BSIT",
      status: "Processing",
    },
    {
      date: "Jun 28, 2025",
      student: "Renato Bordallo",
      purpose: "ID Validation",
      address: "Pagsanghan Samar",
      course: "BSCRIM",
      status: "Processing",
    },
    {
      date: "Jun 30, 2025",
      student: "Kathy Acera",
      purpose: "TES Scholarship",
      address: "Brgy. Aurora, San Jorge",
      course: "BTLED",
      status: "Pending",
    },
    {
      date: "May 12, 2026",
      student: "Miguel Manozo",
      purpose: "Request ID Form",
      address: "Brgy. Catores, Gandara",
      course: "BSF",
      status: "Processing",
    },
    {
      date: "Jun 30, 2025",
      student: "Edriel Gabuya",
      purpose: "Affidavit of Loss",
      address: "Brgy. Blanca, San Jorge",
      course: "BSABE",
      status: "Processing",
    },
  ];

  const [filter, setFilter] = useState("All");
  const [searchQuery] = useState("");

  const handleNewAppointment = (appointmentData) => {
    console.log("New appointment created:", appointmentData);
    // Here you can add logic to save the appointment
    // For example, add to transactions array or send to API
  };

  const filteredTransactions = transactions.filter((item) => {
    const statusMatch = filter === "All" || item.status === filter;

    const searchMatch =
      searchQuery === "" ||
      item.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.date.toLowerCase().includes(searchQuery.toLowerCase());

    return statusMatch && searchMatch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-red-100 text-red-700 hover:bg-red-100";
      case "Processing":
        return "bg-blue-100 text-blue-700 hover:bg-blue-100";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getFilterButtonClass = (status) => {
    if (filter !== status) return "";

    switch (status) {
      case "Pending":
        return "bg-red-600 hover:bg-red-700 text-white";
      case "Processing":
        return "bg-blue-600 hover:bg-blue-700 text-white";
      default:
        return "bg-[#15592F] hover:bg-[#124b28] text-white";
    }
  };

  const renderFilterButtons = () =>
    ["All", "Pending", "Processing"].map((status) => (
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
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between mb-8">

            </div>

            <div className="hidden md:block">
              <h2 className="text-2xl font-semibold text-white mb-6">
                Appointment Records
              </h2>
              <div className="flex gap-4 mb-6 justify-between">
                <div className="flex gap-2 flex-wrap">
                  {renderFilterButtons()}
                </div>
                <Button 
                  onClick={() => setIsNewAppointmentOpen(true)}
                  className="bg-[#124b28] hover:bg-[#186335] text-white shadow-md h-8 w-full rounded-md md:w-auto"
                >
                  <Plus className="h-2 w-2 mr-2" />
                  REQUEST APPOINTMENT
                </Button>
              </div>

              <Card className="border-0 shadow-sm rounded-2xl">
                <CardContent className="p-6">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Student</TableHead>
                          <TableHead>Purpose</TableHead>
                          <TableHead>Address</TableHead>
                          <TableHead>Course</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {filteredTransactions.length > 0 ? (
                          filteredTransactions.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{item.date}</TableCell>
                              <TableCell className="font-medium">
                                {item.student}
                              </TableCell>
                              <TableCell>{item.purpose}</TableCell>
                              <TableCell>{item.address}</TableCell>
                              <TableCell>{item.course}</TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(item.status)}>
                                  {item.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="outline"
                                    className="h-9 px-3 border-[#15592F] text-[#15592F] hover:bg-green-50"
                                    title="View"
                                    aria-label="View appointment"
                                  >
                                    View
                                  </Button>

                                  {item.status !== "Processing" && (
                                    <Button
                                      variant="destructive"
                                      className="h-9 px-3"
                                      title="Cancel"
                                      aria-label="Cancel appointment"
                                    >
                                      Cancel
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={7}
                              className="text-center py-8 text-gray-500"
                            >
                              {searchQuery
                                ? `No transactions found matching "${searchQuery}" in ${filter} status.`
                                : `No ${filter} transactions found.`}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="block md:hidden">
              <div className="flex flex-col gap-4 mb-6 items-center">
                <h2 className="text-2xl font-semibold text-white">
                  Appointment Records
                </h2>

                <div className="flex gap-2 flex-wrap">
                  {renderFilterButtons()}
                </div>
                <Button 
                  onClick={() => setIsNewAppointmentOpen(true)}
                  className="bg-[#124b28] hover:bg-[#186335] text-white shadow-md h-8 w-full rounded-md md:w-auto"
                >
                  <Plus className="h-2 w-2 mr-2" />
                  REQUEST APPOINTMENT
                </Button>
              </div>

              <div className="space-y-4">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((item, index) => (
                    <Card
                      key={index}
                      className="rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all"
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-[#15592F] text-lg">
                              {item.student}
                            </h3>

                            <p className="text-xs text-gray-500 mt-1">
                              {item.date}
                            </p>
                          </div>

                          <Badge className={getStatusColor(item.status)}>
                            {item.status}
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

                            <p>{item.address}</p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-500 uppercase">
                              Course
                            </p>

                            <p>{item.course}</p>
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-4">
                          <Button
                            variant="outline"
                            className="h-9 px-3 border-[#15592F] text-[#15592F] hover:bg-green-50"
                            title="View"
                            aria-label="View appointment"
                          >
                            View
                          </Button>

                          {item.status !== "Processing" && (
                            <Button
                              variant="destructive"
                              className="h-9 px-3"
                              title="Cancel"
                              aria-label="Cancel appointment"
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="py-10 text-center text-gray-500">
                      No appointment found.
                    </CardContent>
                  </Card>
                )}
              </div>
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
    </BackgroundLayout>
  );
};

export default Appointments;  