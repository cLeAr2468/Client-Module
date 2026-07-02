import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ChangePass({ open = false, onOpenChange, onSubmit }) {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    onSubmit?.({
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
    });

    onOpenChange?.(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-1rem)] max-w-[425px] rounded-2xl border-0 p-0 shadow-2xl sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="space-y-2 px-4 pt-5 sm:px-6 sm:pt-6">
            <DialogTitle className="text-lg font-semibold text-slate-900">
              Change password
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              Enter your current password and choose a new secure one.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 px-4 py-4 sm:px-6">
            <div className="grid gap-2">
              <Label htmlFor="currentPassword" className="text-sm font-medium text-slate-700">
                Current password
              </Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="Enter current password"
                value={formData.currentPassword}
                onChange={handleChange}
                className="h-11 rounded-xl border-slate-200 bg-slate-50 px-3 text-sm focus-visible:ring-2 focus-visible:ring-green-600"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="newPassword" className="text-sm font-medium text-slate-700">
                New password
              </Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Enter new password"
                value={formData.newPassword}
                onChange={handleChange}
                className="h-11 rounded-xl border-slate-200 bg-slate-50 px-3 text-sm focus-visible:ring-2 focus-visible:ring-green-600"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
                Confirm password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="h-11 rounded-xl border-slate-200 bg-slate-50 px-3 text-sm focus-visible:ring-2 focus-visible:ring-green-600"
              />
            </div>

            {error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </div>
            ) : null}
          </div>

          <DialogFooter className="flex flex-col-reverse gap-2 px-4 pb-5 pt-2 sm:flex-row sm:justify-end sm:px-6 sm:pb-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange?.(false)}
              className="h-11 w-full rounded-xl sm:w-auto"
            >
              Cancel
            </Button>
            <Button type="submit" className="h-11 w-full rounded-xl bg-green-700 hover:bg-green-800 sm:w-auto">
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ChangePass;