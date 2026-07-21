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
import { Calendar, Clock, MapPin } from "lucide-react";
import { createAppointment } from "@/api/appointmentApi";
import { getProfile } from "@/api/profileApi";
import { getUser } from "@/utils/auth";
import { toast } from "sonner";

export default function NewAppointmentDialog({ open, onOpenChange, onSubmit }) {
  const [formData, setFormData] = useState({
    scheduleDate: "",
    purpose: "",
    timeSlot: "",
  });

  const [userAddress, setUserAddress] = useState({
    barangay: "",
    municipality: "",
    province: "",
  });

  const [selectedPeriod, setSelectedPeriod] = useState("morning");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch user address data when dialog opens
  useEffect(() => {
    if (open) {
      fetchUserAddress();
    }
  }, [open]);

  const fetchUserAddress = async () => {
    try {
      // First try to get from localStorage
      const localUser = getUser();
      if (localUser && localUser.barangay && localUser.municipality && localUser.province) {
        setUserAddress({
          barangay: localUser.barangay || "",
          municipality: localUser.municipality || "",
          province: localUser.province || "",
        });
      } else {
        // If not in localStorage or incomplete, fetch from backend
        const response = await getProfile();
        const user = response.user;
        setUserAddress({
          barangay: user.barangay || "",
          municipality: user.municipality || "",
          province: user.province || "",
        });
      }
    } catch (error) {
      console.error("Error fetching user address:", error);
      toast.error("Failed to load user address information");
    }
  };

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0];

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

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(""); // Clear error when user types
  };

  const handleSubmit = async () => {
    // Validate all required fields
    if (!formData.scheduleDate) {
      setError("Please select a schedule date");
      return;
    }
    if (!formData.purpose) {
      setError("Please select a purpose for appointment");
      return;
    }
    if (!formData.timeSlot) {
      setError("Please select a time slot");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Include user address in the submission with correct field names for backend
      const appointmentData = {
        purpose: formData.purpose,
        barangay: userAddress.barangay,
        city: userAddress.municipality,
        province: userAddress.province,
        schedule_date: formData.scheduleDate,  // Changed from scheduleDate to schedule_date
        time_slot: formData.timeSlot,          // Changed from timeSlot to time_slot
      };

      console.log("Submitting appointment data:", appointmentData); // Debug log

      const response = await createAppointment(appointmentData);
      console.log("✅ Appointment created:", response);

      // Show success message
      toast.success(response.message || "Appointment created successfully!");

      // Call parent onSubmit if provided
      if (onSubmit) {
        onSubmit(response.transaction);
      }

      // Reset form and close dialog
      setFormData({
        scheduleDate: "",
        purpose: "",
        timeSlot: "",
      });
      onOpenChange(false);
    } catch (err) {
      console.error("❌ Error creating appointment:", err);
      toast.error(err.message || "Failed to create appointment. Please try again.");
      setError(err.message || "Failed to create appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      scheduleDate: "",
      purpose: "",
      timeSlot: "",
    });
    setError("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[95vh] w-[95vw] max-w-2xl overflow-y-auto rounded-2xl p-0 lg:max-w-4xl xl:max-w-5xl sm:rounded-3xl">
        <DialogHeader className="border-b p-4 sm:p-6 lg:p-8">
          <DialogTitle className="text-xl font-bold text-slate-800 sm:text-2xl lg:text-3xl">
            New Appointment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 p-4 sm:space-y-6 sm:p-6 lg:space-y-8 lg:p-8">
          {/* Error Message */}
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3">
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}

          {/* Schedule Date & Purpose - Side by side on desktop */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            {/* Schedule Date */}
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
                  min={today}
                  className="h-10 rounded-lg border-2 pl-11 text-sm sm:h-12 sm:rounded-xl sm:text-base lg:h-14 lg:pl-14 lg:text-lg"
                />
              </div>
            </div>

            {/* Purpose for Appointment */}
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

          {/* Residential Address - Display Only */}
          <div className="space-y-3 sm:space-y-4 rounded-lg bg-gray-50 p-4 border-2 border-gray-200">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-700" />
              <h3 className="text-base font-semibold text-slate-800 sm:text-lg lg:text-xl">
                Residential Address
              </h3>
            </div>

            <div className="space-y-2 text-sm sm:text-base">
              <div className="flex">
                <span className="font-medium text-slate-600 w-32">Barangay:</span>
                <span className="text-slate-800">{userAddress.barangay || "Not provided"}</span>
              </div>
              <div className="flex">
                <span className="font-medium text-slate-600 w-32">Municipality:</span>
                <span className="text-slate-800">{userAddress.municipality || "Not provided"}</span>
              </div>
              <div className="flex">
                <span className="font-medium text-slate-600 w-32">Province:</span>
                <span className="text-slate-800">{userAddress.province || "Not provided"}</span>
              </div>
            </div>

            <p className="text-xs text-gray-500 italic sm:text-sm">
              This address is from your profile. To update it, please contact the administrator.
            </p>
          </div>

          {/* Time Slot Selection */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base font-semibold text-slate-800 sm:text-lg lg:text-xl">
              Select Time Slot
            </h3>

            {/* Period Selector */}
            <div className="flex gap-2 sm:gap-4 lg:gap-6">
              <button
                type="button"
                onClick={() => setSelectedPeriod("morning")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors sm:flex-none sm:rounded-xl sm:px-4 sm:text-base lg:px-6 lg:py-3 lg:text-lg ${selectedPeriod === "morning"
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
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors sm:flex-none sm:rounded-xl sm:px-4 sm:text-base lg:px-6 lg:py-3 lg:text-lg ${selectedPeriod === "afternoon"
                    ? "bg-green-700 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                <Clock className="h-4 w-4 lg:h-5 lg:w-5" />
                Afternoon
              </button>
            </div>

            {/* Time Slots Grid */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-6 lg:gap-4">
              {(selectedPeriod === "morning" ? morningSlots : afternoonSlots).map(
                (slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => handleInputChange("timeSlot", slot)}
                    className={`rounded-lg border-2 px-3 py-2.5 text-sm font-medium transition-all sm:rounded-xl sm:px-4 sm:py-3 sm:text-base lg:py-4 lg:text-lg ${formData.timeSlot === slot
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
              disabled={loading}
            >
              CANCEL
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              className="h-11 flex-1 rounded-xl bg-green-700 text-sm font-semibold hover:bg-green-800 sm:h-12 sm:text-base lg:h-14 lg:text-lg"
              disabled={loading}
            >
              {loading ? "CREATING..." : "CREATE APPOINTMENT"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
