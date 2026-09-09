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
import { Calendar, Clock, MapPin, Loader2 } from "lucide-react";
import { createAppointment } from "@/api/appointmentApi";
import { getProfile } from "@/api/profileApi";
import { getAllPurposes } from "@/api/purposeApi";
import { getUser } from "@/utils/auth";
import { toast } from "sonner";
import { showErrorToast, getErrorMessage } from "@/utils/errorHandler";

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

  const [purposes, setPurposes] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("morning");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [availableSlots, setAvailableSlots] = useState({ morning: [], afternoon: [] });
  const [fullSlots, setFullSlots] = useState([]);
  const [slotDetails, setSlotDetails] = useState({});
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Fetch user address data when dialog opens
  useEffect(() => {
    if (open) {
      fetchUserAddress();
      fetchPurposes();
    }
  }, [open]);

  // Fetch available slots when date changes
  useEffect(() => {
    if (formData.scheduleDate) {
      fetchAvailableSlots();
    }
  }, [formData.scheduleDate]);

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

  const fetchPurposes = async () => {
    try {
      const response = await getAllPurposes();
      setPurposes(response.purposes || []);
    } catch (error) {
      console.error("Error fetching purposes:", error);
      toast.error("Failed to load appointment purposes");
    }
  };

  const fetchAvailableSlots = async () => {
    setLoadingSlots(true);
    try {
      const token = localStorage.getItem('auth_token');
      
      const url = `${import.meta.env.VITE_API_URL}/appointments/available-slots?date=${formData.scheduleDate}`;
      console.log('🔍 Fetching slots from:', url);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📡 Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('📊 Slot data received:', data);
        console.log('🔴 Full slots:', data.full_slots);
        console.log('✅ Available slots:', data.available_slots);
        console.log('📈 Slot details:', data.slot_details);
        
        setAvailableSlots(data.available_slots || { morning: [], afternoon: [] });
        setFullSlots(data.full_slots || []);
        setSlotDetails(data.slot_details || {});
        
        // Clear selected time slot if it's now full
        if (formData.timeSlot && data.full_slots?.includes(formData.timeSlot)) {
          setFormData(prev => ({ ...prev, timeSlot: '' }));
          toast.warning("Selected time slot is now full. Please choose another slot.");
        }
      } else {
        const errorData = await response.json();
        console.error('❌ Failed to fetch slots:', response.status, errorData);
        toast.error('Failed to fetch available time slots');
      }
    } catch (error) {
      console.error('💥 Error fetching available slots:', error);
      toast.error('Failed to load available time slots');
    } finally {
      setLoadingSlots(false);
    }
  };

  // Check if a time slot is available
  const isSlotAvailable = (timeSlot) => {
    return !fullSlots.includes(timeSlot);
  };

  // Get slot availability info
  const getSlotInfo = (timeSlot) => {
    return slotDetails[timeSlot] || { total: 5, booked: 0, available: 5 };
  };

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0];

  const morningSlots = [
      
    "08:00 AM",
    "08:30 AM",
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
    "04:00 PM",
    "04:30 PM",
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(""); // Clear error when user types
  };

  const handleSubmit = async () => {
    // Validate all required fields
    if (!formData.scheduleDate) {
      setError("Please select a schedule date");
      toast.error("Please select a schedule date");
      return;
    }
    if (!formData.purpose) {
      setError("Please select a purpose for appointment");
      toast.error("Please select a purpose for appointment");
      return;
    }
    if (!formData.timeSlot) {
      setError("Please select a time slot");
      toast.error("Please select a time slot");
      return;
    }

    // Validate date is not in the past
    const selectedDate = new Date(formData.scheduleDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      setError("Cannot schedule appointments in the past");
      toast.error("Cannot schedule appointments in the past");
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
        schedule_date: formData.scheduleDate,
        time_slot: formData.timeSlot,
      };

      console.log("Submitting appointment data:", appointmentData);

      const response = await createAppointment(appointmentData);
      console.log("✅ Appointment created:", response);

      // Show success message
      toast.success(
        <div>
          <p className="font-semibold">✅ Appointment Created!</p>
          <p className="text-sm mt-1">Your appointment request has been submitted successfully.</p>
        </div>,
        { duration: 5000 }
      );

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
      setAvailableSlots({ morning: [], afternoon: [] });
      setFullSlots([]);
      setSlotDetails({});
      onOpenChange(false);
    } catch (err) {
      console.error("❌ Error creating appointment:", err);
      
      // Handle 409 conflict errors specially (duplicate appointment)
      if (err.response?.status === 409) {
        const errorMsg = getErrorMessage(err);
        setError(errorMsg);
        toast.error(
          <div>
            <p className="font-semibold">⚠️ Appointment Conflict</p>
            <p className="text-sm mt-1">{errorMsg}</p>
          </div>,
          { duration: 7000 }
        );
      } else {
        const errorMsg = getErrorMessage(err);
        setError(errorMsg);
        showErrorToast(err, "Failed to create appointment");
      }
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
                  {purposes.length === 0 ? (
                    <SelectItem value="" disabled>
                      No purposes available
                    </SelectItem>
                  ) : (
                    purposes.map((purpose) => (
                      <SelectItem key={purpose.id} value={purpose.name}>
                        {purpose.name}
                      </SelectItem>
                    ))
                  )}
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
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-800 sm:text-lg lg:text-xl">
                Select Time Slot
              </h3>
              {loadingSlots && (
                <span className="text-xs text-gray-500 flex items-center gap-1 sm:text-sm">
                  <Loader2 className="h-3 w-3 animate-spin sm:h-4 sm:w-4" />
                  Loading slots...
                </span>
              )}
            </div>

            {/* Period Selector */}
            <div className="flex gap-2 sm:gap-4 lg:gap-4">
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
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:gap-4">
              {(selectedPeriod === "morning" ? morningSlots : afternoonSlots).map(
                (slot) => {
                  const slotInfo = getSlotInfo(slot);
                  const isAvailable = isSlotAvailable(slot);
                  const isSelected = formData.timeSlot === slot;
                  
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => isAvailable && handleInputChange("timeSlot", slot)}
                      disabled={!isAvailable || loadingSlots}
                      className={`rounded-lg border-2 px-3 py-2.5 text-sm font-medium transition-all sm:rounded-xl sm:px-4 sm:py-3 sm:text-base lg:py-4 lg:text-lg ${
                        isSelected
                          ? "border-green-700 bg-green-700 text-white shadow-lg"
                          : isAvailable
                          ? "border-gray-200 bg-white text-gray-700 hover:border-green-700 hover:bg-green-50 hover:shadow-md"
                          : "border-red-200 bg-red-50 text-red-400 cursor-not-allowed opacity-75"
                      } ${loadingSlots ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div>{slot}</div>
                      {formData.scheduleDate && (
                        <div className="text-xs mt-1 font-normal">
                          {isAvailable ? (
                            <span className={slotInfo.available <= 2 ? 'text-orange-500 font-semibold' : isSelected ? 'text-white' : 'text-gray-500'}>
                              {slotInfo.available}/5
                            </span>
                          ) : (
                            <span className="text-red-600 font-semibold">Full</span>
                          )}
                        </div>
                      )}
                    </button>
                  );
                }
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
