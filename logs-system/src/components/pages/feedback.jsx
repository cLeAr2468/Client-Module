import { useState, useEffect } from "react";
import { Star, Loader2, CheckCircle } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BackgroundLayout from "@/components/layout/background-layout";
import DashboardHeader from "@/components/layout/dashboard-header";
import { submitFeedback } from "@/api/feedbackApi";
import { toast } from "sonner";

export default function Feedback() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [completedTransactions, setCompletedTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState("");
  const [loadingTransactions, setLoadingTransactions] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://logs-server-system-production.up.railway.app/api';

  const labels = {
    0: "Tap a star to rate",
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Excellent",
  };

  useEffect(() => {
    fetchCompletedTransactions();
  }, []);

  const fetchCompletedTransactions = async () => {
    setLoadingTransactions(true);
    try {
      const token = localStorage.getItem('token');
      console.log('🔑 Token:', token ? 'EXISTS' : 'MISSING');
      
      const response = await fetch(`${API_BASE_URL}/completed-transactions-without-feedback`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      console.log('📡 Response status:', response.status);
      const data = await response.json();
      console.log('✅ Completed transactions response:', data);
      
      if (response.ok) {
        setCompletedTransactions(data.transactions || []);
        console.log('✅ Set transactions:', data.transactions?.length || 0);
        if (data.transactions && data.transactions.length > 0) {
          console.log('📋 Transactions:', data.transactions);
        }
      } else {
        console.error('❌ Failed to fetch completed transactions:', data);
        toast.error(data.message || 'Failed to load transactions');
      }
    } catch (err) {
      console.error("❌ Error fetching completed transactions:", err);
      toast.error('Network error: ' + err.message);
    } finally {
      setLoadingTransactions(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!selectedTransaction) {
      setError("Please select a transaction.");
      return;
    }

    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }

    if (!message.trim()) {
      setError("Please enter your feedback.");
      return;
    }

    try {
      setLoading(true);

      // Submit feedback to backend with transaction_id
      const response = await submitFeedback(selectedTransaction, rating, message.trim());

      // Show success message
      toast.success(response.message || "Feedback submitted successfully!");

      // Reset form
      setRating(0);
      setHover(0);
      setMessage("");
      setSelectedTransaction("");
      
      // Refresh completed transactions list
      fetchCompletedTransactions();
    } catch (err) {
      console.error("Failed to submit feedback:", err);
      const errorMessage = err.message || "Failed to submit feedback. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackgroundLayout overlayColor="bg-green-950/70">
      <DashboardHeader />
    <div className="min-h-screen flex justify-center items-center p-2 sm:p-4">
      <Card className="w-full max-w-xl overflow-hidden rounded-xl shadow-lg border">
        {/* Header */}
        <div className="bg-green-800 px-4 py-5 sm:px-6 sm:py-6">
          <h1 className="text-white font-bold text-2xl sm:text-3xl leading-tight">
            Share Your Feedback
          </h1>

          <p className="text-green-100 text-sm sm:text-base mt-2">
            Your input helps us improve our services.
          </p>
        </div>

        {/* Body */}
        <CardContent className="p-4 sm:p-6 space-y-6">
          {/* Transaction Selection - FIRST */}
          {loadingTransactions ? (
            <div className="text-center py-4">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-green-800" />
              <p className="text-sm text-gray-500 mt-2">Loading transactions...</p>
            </div>
          ) : completedTransactions.length === 0 ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-blue-800 font-medium">No completed transactions available</p>
              <p className="text-xs text-blue-600 mt-1">Complete a transaction first before submitting feedback</p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label className="text-base sm:text-lg font-semibold">
                  Select Transaction <span className="text-red-500">*</span>
                </Label>
                <Select value={selectedTransaction} onValueChange={setSelectedTransaction}>
                  <SelectTrigger className="w-full h-12 text-base">
                    <SelectValue placeholder="Choose a completed transaction" />
                  </SelectTrigger>
                  <SelectContent>
                    {completedTransactions.map((transaction) => (
                      <SelectItem key={transaction.id} value={transaction.id.toString()}>
                        <div className="flex flex-col">
                          <span className="font-medium">{transaction.purpose}</span>
                          <span className="text-xs text-gray-500">
                            {formatDate(transaction.schedule_date)} at {transaction.time_slot}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  {completedTransactions.length} completed transaction{completedTransactions.length !== 1 ? 's' : ''} available for feedback
                </p>
              </div>

              {/* Rating - SECOND */}
              <div className="space-y-3">
                <Label className="text-base sm:text-lg font-semibold">
                  Overall Rating <span className="text-red-500">*</span>
                </Label>

                <div className="flex justify-center">
                  <div className="flex justify-between w-full max-w-[220px] sm:max-w-[260px]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                        onClick={() =>
                          setRating((current) => (current === star ? 0 : star))
                        }
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                        className="transition-transform duration-200 hover:scale-110 active:scale-95"
                      >
                        <Star
                          className={`w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 transition-colors duration-200 ${
                            star <= (hover || rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-transparent text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <p className="text-center text-sm text-muted-foreground">
                  {labels[rating]}
                </p>
              </div>

              {/* Message - THIRD */}
              <div className="space-y-2">
                <Label
                  htmlFor="message"
                  className="text-base sm:text-lg font-semibold"
                >
                  Message <span className="text-red-500">*</span>
                </Label>

                <Textarea
                  id="message"
                  rows={5}
                  maxLength={500}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your experience..."
                  className="resize-none min-h-[130px] rounded-lg text-sm sm:text-base"
                  disabled={loading}
                />

                <div className="flex justify-end">
                  <span className="text-xs text-muted-foreground">
                    {message.length}/500
                  </span>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                className="w-full h-11 sm:h-12 rounded-lg bg-green-800 hover:bg-green-900 text-sm sm:text-base font-semibold"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Feedback"
                )}
              </Button>
            </>
          )}
          
          {completedTransactions.length === 0 && !loadingTransactions && (
            <p className="text-xs text-center text-gray-500">
              You need at least one completed transaction to submit feedback
            </p>
          )}
        </CardContent>
      </Card>
    </div>
    </BackgroundLayout>
  );
}