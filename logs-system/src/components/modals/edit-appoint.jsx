// ...existing code...
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Clock } from "lucide-react";

export default function EditAppointmentDialog({ open, onOpenChange, initialData = null, onSubmit }) {
  const [formData, setFormData] = useState({
    scheduleDate: "",
    purpose: "",
    street: "",
    barangay: "",
    city: "",
    province: "",
    timeSlot: "",
  });

  const [selectedPeriod, setSelectedPeriod] = useState("morning");

  const morningSlots = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
  ];

  const afternoonSlots = [
    "01:00 PM",
    "01:30 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
  ];

  useEffect(() => {
    if (open && initialData) {
      setFormData({
        scheduleDate: initialData.date || "",
        purpose: initialData.purpose || "",
        // put full address into street for now
        street: initialData.address || "",
        barangay: "",
        city: "",
        province: "",
        timeSlot: initialData.timeSlot || "",
      });
    }
    if (!open && !initialData) {
      setFormData({
        scheduleDate: "",
        purpose: "",
        street: "",
        barangay: "",
        city: "",
        province: "",
        timeSlot: "",
      });
    }
  }, [open, initialData]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (onSubmit) onSubmit(formData);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[95vh] w-[95vw] max-w-2xl overflow-y-auto rounded-2xl p-0 lg:max-w-4xl xl:max-w-5xl sm:rounded-3xl">
        <DialogHeader className="border-b p-4 sm:p-6 lg:p-8">
          <DialogTitle className="text-xl font-bold text-slate-800 sm:text-2xl lg:text-3xl">
            Edit Appointment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 p-4 sm:space-y-6 sm:p-6 lg:space-y-8 lg:p-8">
          {/* Schedule Date & Purpose */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700 lg:text-base">
                Schedule Date
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 sm:top-3 lg:h-6 lg:w-6 lg:top-3.5" />
                <Input
                  type="date"
                  value={formData.scheduleDate}
                  onChange={(e) => handleInputChange("scheduleDate", e.target.value)}
                  className="h-10 rounded-lg border-2 pl-11 text-sm sm:h-12 sm:rounded-xl sm:text-base lg:h-14 lg:pl-14 lg:text-lg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700 lg:text-base">
                Purpose for Appointment
              </Label>
              <Select
                value={formData.purpose}
                onValueChange={(value) => handleInputChange("purpose", value)}
              >
                <SelectTrigger className="h-10 rounded-lg border-2 text-sm sm:h-12 sm:rounded-xl sm:text-base lg:h-14 lg:text-lg">
                  <SelectValue placeholder="Select purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ID Validation">ID Validation</SelectItem>
                  <SelectItem value="scholarship">Scholarship</SelectItem>
                  <SelectItem value="Good Moral">Good Moral</SelectItem>
                  <SelectItem value="Assistance in Scholarship">Assistance in Scholarship</SelectItem>
                  <SelectItem value="ID Request Form">ID Request Form</SelectItem>
                  <SelectItem value="Student Clearance">Student Clearance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Residential Address */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base font-semibold text-slate-800 sm:text-lg lg:text-xl">
              Residential Address
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:gap-6">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-slate-600 sm:text-sm lg:text-base">
                  Street / House No.
                </Label>
                <Input
                  placeholder="Unit 123 Blk 4"
                  value={formData.street}
                  onChange={(e) => handleInputChange("street", e.target.value)}
                  className="h-10 rounded-lg border-2 text-sm sm:h-11 sm:rounded-xl sm:text-base lg:h-12 lg:text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium text-slate-600 sm:text-sm lg:text-base">
                  Barangay
                </Label>
                <Input
                  placeholder="Brgy. Quezon"
                  value={formData.barangay}
                  onChange={(e) => handleInputChange("barangay", e.target.value)}
                  className="h-10 rounded-lg border-2 text-sm sm:h-11 sm:rounded-xl sm:text-base lg:h-12 lg:text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium text-slate-600 sm:text-sm lg:text-base">
                  City / Municipality
                </Label>
                <Input
                  placeholder="San Jorge"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className="h-10 rounded-lg border-2 text-sm sm:h-11 sm:rounded-xl sm:text-base lg:h-12 lg:text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium text-slate-600 sm:text-sm lg:text-base">
                  Province
                </Label>
                <Input
                  placeholder="Samar"
                  value={formData.province}
                  onChange={(e) => handleInputChange("province", e.target.value)}
                  className="h-10 rounded-lg border-2 text-sm sm:h-11 sm:rounded-xl sm:text-base lg:h-12 lg:text-lg"
                />
              </div>
            </div>
          </div>

          {/* Time Slot Selection */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base font-semibold text-slate-800 sm:text-lg lg:text-xl">
              Select Time Slot
            </h3>

            <div className="flex gap-2 sm:gap-4 lg:gap-6">
              <button
                type="button"
                onClick={() => setSelectedPeriod("morning")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors sm:flex-none sm:rounded-xl sm:px-4 sm:text-base lg:px-6 lg:py-3 lg:text-lg ${
                  selectedPeriod === "morning"
                    ? "bg-green-700 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Clock className="h-4 w-4 lg:h-5 lg:w-5" />
                Morning
              </button>
              <button
                type="button"
                onClick={() => setSelectedPeriod("afternoon")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors sm:flex-none sm:rounded-xl sm:px-4 sm:text-base lg:px-6 lg:py-3 lg:text-lg ${
                  selectedPeriod === "afternoon"
                    ? "bg-green-700 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Clock className="h-4 w-4 lg:h-5 lg:w-5" />
                Afternoon
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-6 lg:gap-4">
              {(selectedPeriod === "morning" ? morningSlots : afternoonSlots).map(
                (slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => handleInputChange("timeSlot", slot)}
                    className={`rounded-lg border-2 px-3 py-2.5 text-sm font-medium transition-all sm:rounded-xl sm:px-4 sm:py-3 sm:text-base lg:py-4 lg:text-lg ${
                      formData.timeSlot === slot
                        ? "border-green-700 bg-green-700 text-white shadow-lg"
                        : "border-gray-200 bg-white text-gray-700 hover:border-green-700 hover:bg-green-50 hover:shadow-md"
                    }`}
                  >
                    {slot}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2 sm:gap-3 sm:pt-4 lg:gap-4 lg:pt-6">
            <Button
              type="button"
              onClick={handleCancel}
              variant="outline"
              className="h-11 flex-1 rounded-xl border-2 text-sm font-semibold hover:bg-gray-50 sm:h-12 sm:text-base lg:h-14 lg:text-lg"
            >
              CANCEL
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              className="h-11 flex-1 rounded-xl bg-green-700 text-sm font-semibold hover:bg-green-800 sm:h-12 sm:text-base lg:h-14 lg:text-lg"
            >
              VIEW SUMMARY
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}