import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { XCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export default function CancelAppointmentDialog({ 
  open, 
  onOpenChange, 
  appointment, 
  onConfirm 
}) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    if (!reason.trim()) {
      toast.error("Please provide a reason for cancellation");
      return;
    }

    if (reason.trim().length < 10) {
      toast.error("Cancellation reason must be at least 10 characters");
      return;
    }

    try {
      setLoading(true);
      await onConfirm(reason.trim());
      
      // Reset and close
      setReason("");
      onOpenChange(false);
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      toast.error(error.message || "Failed to cancel appointment");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setReason("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Cancel Appointment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Warning Message */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-800">
              ⚠️ You are about to cancel your appointment. This action cannot be undone.
            </p>
          </div>

          {/* Appointment Details */}
          {appointment && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <h3 className="font-semibold text-sm text-gray-700 uppercase">
                Appointment Details
              </h3>
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Purpose:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {appointment.purpose?.name || appointment.purpose || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Schedule:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {new Date(appointment.schedule_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                    {' at '}
                    {appointment.time_slot}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Cancellation Reason */}
          <div className="space-y-2">
            <Label htmlFor="cancel-reason" className="text-sm font-medium text-gray-700">
              Reason for Cancellation <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="cancel-reason"
              placeholder="Please provide a clear reason for cancelling this appointment..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[120px] resize-none"
              maxLength={500}
              disabled={loading}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Minimum 10 characters</span>
              <span>{reason.length}/500</span>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            Keep Appointment
          </Button>
          <Button
            type="button"
            onClick={handleCancel}
            disabled={loading || !reason.trim() || reason.trim().length < 10}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Cancelling...
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 mr-2" />
                Cancel Appointment
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
