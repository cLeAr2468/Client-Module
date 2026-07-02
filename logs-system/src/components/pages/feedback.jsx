import { useState } from "react";
import { Star } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import BackgroundLayout from "@/components/layout/background-layout";
import DashboardHeader from "@/components/layout/dashboard-header";
export default function Feedback() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [message, setMessage] = useState("");

  const labels = {
    0: "Tap a star to rate",
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Excellent",
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (rating === 0) {
      alert("Please select a rating.");
      return;
    }

    if (!message.trim()) {
      alert("Please enter your feedback.");
      return;
    }

    const feedback = {
      rating,
      message,
    };

    console.log(feedback);

    // TODO: Send to your API here

    alert("Feedback submitted successfully!");

    setRating(0);
    setHover(0);
    setMessage("");
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
          {/* Rating */}
          <div className="space-y-3">
            <Label className="text-base sm:text-lg font-semibold">
              Overall Rating
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

          {/* Message */}
          <div className="space-y-2">
            <Label
              htmlFor="message"
              className="text-base sm:text-lg font-semibold"
            >
              Message
            </Label>

            <Textarea
              id="message"
              rows={5}
              maxLength={500}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us about your experience..."
              className="resize-none min-h-[130px] rounded-lg text-sm sm:text-base"
            />

            <div className="flex justify-end">
              <span className="text-xs text-muted-foreground">
                {message.length}/500
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            className="w-full h-11 sm:h-12 rounded-lg bg-green-800 hover:bg-green-900 text-sm sm:text-base font-semibold"
          >
            Submit Feedback
          </Button>
        </CardContent>
      </Card>
    </div>
    </BackgroundLayout>
  );
}