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
import { Calendar, Clock, Loader2 } from "lucide-react";
import { updateAppointment } from "@/api/appointmentApi";
import { getAllPurposes } from "@/api/purposeApi";
import { getApiBaseUrl } from "@/utils/apiConfig";
import { toast } from "sonner";

export default function EditAppointmentDialog({ open, onOpenChange, initialData = null, onSubmit }) {
  const [formData, setFormData] = useState({
    id: null,
    scheduleDate: "",
    purposeId: "",
    currentTimeSlot: "", // Display only - original time slot
    timeSlot: "",        // New time slot selection
  });

  const [purposes, setPurposes] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("morning");
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState("");
  const [serverTime, setServerTime] = useState(null);
  const [isMorningPast, setIsMorningPast] = useState(false);
  const [pastTimeSlots, setPastTimeSlots] = useState([]);
  const [availableSlots, setAvailableSlots] = useState({ morning: [], afternoon: [] });
  const [fullSlots, setFullSlots] = useState([]);
  const [slotDetails, setSlotDetails] = useState({});

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0];

  const morningSlots = [
    "08:00 AM",
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
  ];

  const afternoonSlots = [
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
  ];

  useEffect(() => {
    if (open) {
      fetchPurposes();
      if (initialData) {
        // Format the schedule_date for input[type="date"]
        const scheduleDate = initialData.schedule_date 
          ? new Date(initialData.schedule_date).toISOString().split('T')[0]
          : "";

        setFormData({
          id: initialData.id,
          scheduleDate: scheduleDate,
          purposeId: initialData.purpose?.id?.toString() || "",
          currentTimeSlot: initialData.time_slot || "", // Store original
          timeSlot: "",                                   // Leave new selection empty
        });

        // Set selected period based on time slot
        if (initialData.time_slot) {
          const isPM = initialData.time_slot.includes('PM');
          const hour = parseInt(initialData.time_slot.split(':')[0]);
          if (isPM && hour >= 1 && hour <= 4) {
            setSelectedPeriod("afternoon");
          } else {
            setSelectedPeriod("morning");
          }
        }
      }
    } else if (!open) {
      // Reset form when dialog closes
      setFormData({
        id: null,
        scheduleDate: "",
        purposeId: "",
        currentTimeSlot: "",
        timeSlot: "",
      });
      setSelectedPeriod("morning");
      setError("");
      setAvailableSlots({ morning: [], afternoon: [] });
      setFullSlots([]);
      setSlotDetails({});
      setPastTimeSlots([]);
    }
  }, [open, initialData]);

  // Fetch available slots when date changes
  useEffect(() => {
    if (formData.scheduleDate && open) {
      fetchAvailableSlots();
    }
  }, [formData.scheduleDate, open]);

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
      const API_BASE_URL = getApiBaseUrl();
      const url = `${API_BASE_URL}/appointments/available-slots?date=${formData.scheduleDate}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        console.log('📊 Available slots data:', data);
        console.log('⏰ Server time:', data.server_time);
        console.log('📅 Selected date:', formData.scheduleDate);
        
        // Handle server time and past slots
        if (data.server_time) {
          setServerTime(data.server_time);
          const serverDate = new Date(data.server_time);
          const serverHour = serverDate.getHours();
          const serverMinute = serverDate.getMinutes();
          
          const selectedDate = new Date(formData.scheduleDate + 'T00:00:00');
          const todayDate = new Date(data.server_time);
          todayDate.setHours(0, 0, 0, 0);
          selectedDate.setHours(0, 0, 0, 0);
          
          const isToday = selectedDate.getTime() === todayDate.getTime();
          const isPastNoon = serverHour >= 12;
          
          console.log('🔍 Date check:', {
            isToday,
            isPastNoon,
            selectedDateTime: selectedDate.getTime(),
            todayDateTime: todayDate.getTime(),
            serverHour,
            serverMinute
          });
          
          setIsMorningPast(isToday && isPastNoon);
          
          // Calculate past time slots - ONLY FOR TODAY
          const pastSlots = [];
          if (isToday) {
            const allTimeSlots = [...morningSlots, ...afternoonSlots];
            allTimeSlots.forEach(slot => {
              const [time, period] = slot.split(' ');
              const [hours, minutes] = time.split(':').map(Number);
              
              let slot24Hour = hours;
              if (period === 'PM' && hours !== 12) {
                slot24Hour = hours + 12;
              } else if (period === 'AM' && hours === 12) {
                slot24Hour = 0;
              }
              
              if (slot24Hour < serverHour || (slot24Hour === serverHour && minutes <= serverMinute)) {
                pastSlots.push(slot);
              }
            });
            
            console.log('⏰ Past time slots (TODAY only):', pastSlots);
            setPastTimeSlots(pastSlots);
            
            // Clear selected time slot if it's now in the past
            if (formData.timeSlot && pastSlots.includes(formData.timeSlot)) {
              setFormData(prev => ({ ...prev, timeSlot: '' }));
              toast.warning('The selected time slot has passed. Please choose another slot.');
            }
          } else {
            console.log('✅ Future date selected - all slots available');
            setPastTimeSlots([]);
          }
          
          // Switch to afternoon if morning is past
          if (isToday && isPastNoon && selectedPeriod === 'morning') {
            setSelectedPeriod('afternoon');
            toast.info('Morning time slots are no longer available for today');
          }
        }
        
        setAvailableSlots(data.available_slots || { morning: [], afternoon: [] });
        setFullSlots(data.full_slots || []);
        setSlotDetails(data.slot_details || {});
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Failed to fetch slots:', response.status, errorData);
        toast.error('Failed to fetch available time slots');
      }
    } catch (error) {
      console.error('Error fetching available slots:', error);
    } finally {
      setLoadingSlots(false);
    }
  };

  const isSlotAvailable = (timeSlot) => {
    if (pastTimeSlots.includes(timeSlot)) {
      return false;
    }
    return !fullSlots.includes(timeSlot);
  };

  const getSlotInfo = (timeSlot) => {
    const info = slotDetails[timeSlot] || { 
      total_user_slots: 5, 
      booked_users: 0, 
      available_user_slots: 5,
      user_transactions: 0,
      user_can_book: true,
      max_transactions_per_user: 3
    };
    return {
      total: info.total_user_slots || info.total || 5,
      booked: info.booked_users || info.booked || 0,
      available: info.available_user_slots || info.available || 5,
      userTransactions: info.user_transactions || 0,
      userCanBook: info.user_can_book !== undefined ? info.user_can_book : true,
      maxPerUser: info.max_transactions_per_user || 3
    };
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(""); // Clear error when user types
  };

  const handleSubmit = async () => {
    // Validate all required fields
    if (!formData.scheduleDate) {
      setError("Please select an appointment date");
      toast.error("Please select an appointment date");
      return;
    }
    if (!formData.purposeId) {
      setError("Please select a purpose for appointment");
      toast.error("Please select a purpose for appointment");
      return;
    }
    if (!formData.timeSlot) {
      setError("Please select a new time slot");
      toast.error("Please select a new time slot");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const updateData = {
        schedule_date: formData.scheduleDate,
        purpose_id: parseInt(formData.purposeId),
        time_slot: formData.timeSlot, // Send the NEW time slot
      };

      console.log('📤 Updating appointment with data:', updateData);

      const response = await updateAppointment(formData.id, updateData);
      console.log("✅ Appointment updated:", response);

      toast.success(response.message || "Appointment updated successfully!");

      if (onSubmit) {
        onSubmit(response.transaction);
      }

      onOpenChange(false);
    } catch (err) {
      console.error("❌ Error updating appointment:", err);
      console.error("Error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      // Better error handling
      let errorMessage = "Failed to update appointment. Please try again.";
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setError("");
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
          {/* Error Message */}
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3">
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}

          {/* Appointment Date & Purpose */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700 lg:text-base">
                Appointment Date
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

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700 lg:text-base">
                Purpose for Appointment
              </Label>
              <Select
                value={formData.purposeId}
                onValueChange={(value) => handleInputChange("purposeId", value)}
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
                      <SelectItem key={purpose.id} value={purpose.id.toString()}>
                        {purpose.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Current Time Slot - Display Only */}
          <div className="space-y-2 rounded-lg bg-blue-50 border-2 border-blue-200 p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-700" />
              <Label className="text-sm font-semibold text-slate-700 lg:text-base">
                Current Time Slot
              </Label>
            </div>
            <div className="text-lg font-bold text-blue-700">
              {formData.currentTimeSlot || "No time slot selected"}
            </div>
            <p className="text-xs text-slate-600 italic">
              This is your currently booked time slot
            </p>
          </div>

          {/* New Time Slot Selection */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-800 sm:text-lg lg:text-xl">
                Select New Time Slot
              </h3>
              {loadingSlots && (
                <span className="text-xs text-gray-500 flex items-center gap-1 sm:text-sm">
                  <Loader2 className="h-3 w-3 animate-spin sm:h-4 sm:w-4" />
                  Loading slots...
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 italic sm:text-sm">
              Choose a new time slot for your appointment
            </p>

            <div className="flex gap-2 sm:gap-4 lg:gap-6">
              {!isMorningPast && (
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
              )}
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

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:gap-4">
              {(selectedPeriod === "morning" ? morningSlots : afternoonSlots).map(
                (slot) => {
                  const slotInfo = getSlotInfo(slot);
                  const isAvailable = isSlotAvailable(slot);
                  const isSelected = formData.timeSlot === slot;
                  const isPast = pastTimeSlots.includes(slot);
                  
                  // Don't render past time slots
                  if (isPast) {
                    return null;
                  }
                  
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => {
                        if (isAvailable && !loadingSlots) {
                          handleInputChange("timeSlot", slot);
                        }
                      }}
                      disabled={!isAvailable || loadingSlots}
                      className={`rounded-lg border-2 px-3 py-2.5 text-sm font-medium transition-all sm:rounded-xl sm:px-4 sm:py-3 sm:text-base lg:py-4 lg:text-lg ${
                        isSelected
                          ? "border-green-700 bg-green-700 text-white shadow-lg"
                          : isAvailable
                          ? "border-gray-200 bg-white text-gray-700 hover:border-green-700 hover:bg-green-50 hover:shadow-md"
                          : "border-red-200 bg-red-50 text-red-400 cursor-not-allowed opacity-75"
                      } ${loadingSlots ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="font-semibold">{slot}</div>
                      {formData.scheduleDate && (
                        <div className="text-xs mt-1 font-normal">
                          {isAvailable ? (
                            <>
                              <span className={slotInfo.available <= 2 ? 'text-orange-500 font-semibold' : isSelected ? 'text-white' : 'text-gray-500'}>
                                {slotInfo.available}/{slotInfo.total} users
                              </span>
                              {slotInfo.userTransactions > 0 && (
                                <div className={isSelected ? 'text-white opacity-90' : 'text-blue-600'}>
                                  You: {slotInfo.userTransactions}/{slotInfo.maxPerUser}
                                </div>
                              )}
                            </>
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
              {loading ? "UPDATING..." : "UPDATE APPOINTMENT"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
