import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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

const Transactions = () => {
  const transactions = [
    {
      RequestDate: "Jun 30, 2025",
      purpose: "Good Moral Certificate",
      address: "Brgy. Quezon, San Jorge",
      course: "BSIT",
      ScheduleDate: "2025-07-02",
      status: "Completed",
    },
    {
      RequestDate: "May 1, 2026",
      purpose: "Student Clearance",
      address: "Brgy. Quezon, San Jorge",
      course: "BSIT",
      ScheduleDate: "2026-05-10",
      status: "Rejected",
    },
    {
      RequestDate: "Jun 30, 2025",
      purpose: "TES Scholarship",
      address: "Brgy. Quezon, San Jorge",
      course: "BSIT",
      ScheduleDate: "2025-07-9",
      status: "Completed",
    },
    {
      RequestDate: "May 1, 2026",
      purpose: "Student Clearance",
      address: "Brgy. Quezon, San Jorge",
      course: "BSIT",
      ScheduleDate: "2026-05-15",
      status: "Completed",
    },
    {
      RequestDate: "Jun 28, 2025",
      purpose: "ID Validation",
      address: "Brgy. Quezon, San Jorge",
      course: "BSIT",
      ScheduleDate: "2025-06-30",
      status: "Rejected",
    },
    {
      RequestDate: "Jun 30, 2025",
      purpose: "TES Scholarship",
      address: "Brgy. Quezon, San Jorge",
      course: "BSIT",
      ScheduleDate: "2025-06-31",
      status: "Completed",
    },
    {
      RequestDate: "May 12, 2026",
      purpose: "Request ID Form",
      address: "Brgy. Quezon, San Jorge",
      course: "BSIT",
      ScheduleDate: "2026-05-16",
      status: "Completed",
    },
    {
      RequestDate: "Jun 30, 2025",
      purpose: "Affidavit of Loss",
      address: "Brgy. Quezon, San Jorge",
      course: "BSIT",
      ScheduleDate: "2025-06-31",
      status: "Rejected",
    },
  ];

  const [filter, setFilter] = useState("All");
  const [searchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const filteredTransactions = transactions.filter((item) => {
    const statusMatch = filter === "All" || item.status === filter;

    const searchMatch =
      searchQuery === "" ||
      item.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.date.toLowerCase().includes(searchQuery.toLowerCase());

    const dateMatch = selectedDate === "" || item.dateValue === selectedDate;

    return statusMatch && searchMatch && dateMatch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700 hover:bg-green-100";
      case "Rejected":
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
      case "Completed":
        return "bg-green-600 hover:bg-green-700 text-white";
      case "Rejected":
        return "bg-red-600 hover:bg-red-700 text-white";
      default:
        return "bg-[#15592F] hover:bg-[#124b28] text-white";
    }
  };

  const renderFilterButtons = () =>
    ["All", "Completed", "Rejected"].map((status) => (
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
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">

                <div className="w-full sm:w-[220px]">
                  <label className="text-xl font-medium text-white mb-1 block">
                    Filter by Date
                  </label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="h-11 bg-white border-gray-200"
                  />
                </div>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="flex flex-col gap-4 mb-6">
                <h2 className="text-2xl font-semibold text-white">
                  Transaction History
                </h2>

                <div className="flex gap-2 flex-wrap">
                  {renderFilterButtons()}
                </div>
              </div>

              <Card className="border-0 shadow-sm rounded-2xl">
                <CardContent className="p-6">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Purpose</TableHead>
                          <TableHead>Address</TableHead>
                          <TableHead>Course</TableHead>
                          <TableHead>Schedule Date</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {filteredTransactions.length > 0 ? (
                          filteredTransactions.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{item.date}</TableCell>
                              <TableCell>{item.purpose}</TableCell>
                              <TableCell>{item.address}</TableCell>
                              <TableCell>{item.course}</TableCell>
                              <TableCell>{item.ScheduleDate}</TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(item.status)}>
                                  {item.status}
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
                              {searchQuery || selectedDate
                                ? `No transactions found matching your search.`
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
                  Transaction Records
                </h2>

                <div className="flex gap-2 flex-wrap">
                  {renderFilterButtons()}
                </div>
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
                          <div>
                            <p className="text-xs text-gray-500 uppercase">
                              Schedule Date
                            </p>
                            <p>{item.ScheduleDate}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="py-10 text-center text-gray-500">
                      No transaction found.
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </BackgroundLayout>
  );
};

export default Transactions;