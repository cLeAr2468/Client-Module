import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Star, Calendar, MessageSquare, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ViewFeedbackDialog({ open, onOpenChange, transactionId }) {
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://logs-server-system-production.up.railway.app/api';

  useEffect(() => {
    if (open && transactionId) {
      fetchFeedback();
    }
  }, [open, transactionId]);

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/transaction/${transactionId}/feedback-status`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      if (response.ok && data.feedback) {
        setFeedback(data.feedback);
      }
    } catch (err) {
      console.error("Error fetching feedback:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-transparent text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const getRatingLabel = (rating) => {
    const labels = {
      1: "Poor",
      2: "Fair",
      3: "Good",
      4: "Very Good",
      5: "Excellent",
    };
    return labels[rating] || "";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Your Feedback
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="py-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-green-800 mb-2" />
            <p className="text-sm text-gray-500">Loading feedback...</p>
          </div>
        ) : feedback ? (
          <div className="space-y-4">
            {/* Rating Section */}
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Your Rating</span>
                <Badge className="bg-green-100 text-green-800">
                  {getRatingLabel(feedback.rating)}
                </Badge>
              </div>
              {renderStars(feedback.rating)}
            </div>

            {/* Message Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <MessageSquare className="w-4 h-4" />
                <span>Your Message</span>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap">{feedback.message}</p>
              </div>
            </div>

            {/* Submitted Date */}
            <div className="flex items-center gap-2 text-sm text-gray-500 pt-2 border-t">
              <Calendar className="w-4 h-4" />
              <span>Submitted on {formatDate(feedback.created_at)}</span>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">No feedback found for this transaction</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
