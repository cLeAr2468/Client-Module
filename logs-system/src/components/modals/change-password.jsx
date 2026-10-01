import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Lock, CheckCircle2, XCircle } from "lucide-react";
import { changePassword } from "@/api/profileApi";
import { toast } from "sonner";
import { showErrorToast, getErrorMessage } from "@/utils/errorHandler";
import { validatePassword, getPasswordStrengthColor } from "@/utils/validation";

export default function ChangePasswordDialog({ open, onOpenChange }) {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Password validation
  const passwordValidation = useMemo(() => {
    if (!formData.newPassword) return null;
    return validatePassword(formData.newPassword);
  }, [formData.newPassword]);

  const passwordsMatch = formData.newPassword && formData.confirmPassword && 
    formData.newPassword === formData.confirmPassword;

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (!passwordValidation || !passwordValidation.isValid) {
      newErrors.newPassword = "Password does not meet all requirements";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (formData.currentPassword && formData.newPassword && 
        formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = "New password must be different from current password";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await changePassword({
        current_password: formData.currentPassword,
        new_password: formData.newPassword,
        new_password_confirmation: formData.confirmPassword,
      });

      console.log("✅ Password changed:", response);

      toast.success(
        <div>
          <p className="font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Password Changed Successfully!
          </p>
          <p className="text-sm mt-1">Your password has been updated.</p>
        </div>,
        { duration: 5000 }
      );

      // Reset form and close dialog
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setErrors({});
      onOpenChange(false);
    } catch (err) {
      console.error("❌ Password change failed:", err);
      
      // Handle specific error for incorrect current password
      if (err.response?.status === 400) {
        setErrors({ currentPassword: getErrorMessage(err) });
        toast.error("Current password is incorrect");
      } else {
        showErrorToast(err, "Failed to change password");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setErrors({});
    setShowPasswords({
      current: false,
      new: false,
      confirm: false,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Lock className="w-5 h-5 text-[#15592F]" />
            Change Password
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Password */}
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showPasswords.current ? "text" : "password"}
                value={formData.currentPassword}
                onChange={(e) => handleInputChange("currentPassword", e.target.value)}
                className={`pr-10 ${errors.currentPassword ? 'border-red-500' : ''}`}
                placeholder="Enter current password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("current")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={loading}
              >
                {showPasswords.current ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-sm text-red-600">{errors.currentPassword}</p>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPasswords.new ? "text" : "password"}
                value={formData.newPassword}
                onChange={(e) => handleInputChange("newPassword", e.target.value)}
                className={`pr-10 ${errors.newPassword ? 'border-red-500' : ''}`}
                placeholder="Enter new password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={loading}
              >
                {showPasswords.new ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            
            {/* Password strength indicator */}
            {passwordValidation && formData.newPassword && (
              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex flex-1 gap-1">
                    {[1, 2, 3, 4, 5].map((item) => (
                      <div
                        key={item}
                        className={`h-1.5 flex-1 rounded-full transition-colors ${
                          passwordValidation.score >= item
                            ? getPasswordStrengthColor(passwordValidation.strength).split(" ")[1]
                            : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`text-xs font-semibold ${getPasswordStrengthColor(passwordValidation.strength).split(" ")[0]}`}>
                    {passwordValidation.strength}
                  </span>
                </div>

                {/* Password requirements checklist */}
                <div className="text-xs space-y-1 bg-gray-50 p-2 rounded border">
                  <div className={`flex items-center gap-1.5 ${passwordValidation.rules.hasMinLength ? "text-green-700" : "text-gray-500"}`}>
                    {passwordValidation.rules.hasMinLength ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                    <span>At least 8 characters</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${passwordValidation.rules.hasUppercase ? "text-green-700" : "text-gray-500"}`}>
                    {passwordValidation.rules.hasUppercase ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                    <span>One uppercase letter</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${passwordValidation.rules.hasLowercase ? "text-green-700" : "text-gray-500"}`}>
                    {passwordValidation.rules.hasLowercase ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                    <span>One lowercase letter</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${passwordValidation.rules.hasNumber ? "text-green-700" : "text-gray-500"}`}>
                    {passwordValidation.rules.hasNumber ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                    <span>One number</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${passwordValidation.rules.hasSpecialChar ? "text-green-700" : "text-gray-500"}`}>
                    {passwordValidation.rules.hasSpecialChar ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                    <span>One special character</span>
                  </div>
                </div>
              </div>
            )}

            {errors.newPassword && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <XCircle size={14} />
                {errors.newPassword}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPasswords.confirm ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                className={`pr-10 ${
                  errors.confirmPassword 
                    ? 'border-red-500' 
                    : passwordsMatch 
                    ? 'border-green-500' 
                    : ''
                }`}
                placeholder="Confirm new password"
                disabled={loading}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {passwordsMatch && (
                  <CheckCircle2 size={16} className="text-green-700" />
                )}
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirm")}
                  className="text-gray-500 hover:text-gray-700"
                  disabled={loading}
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            {passwordsMatch && (
              <p className="text-xs text-green-700 flex items-center gap-1">
                <CheckCircle2 size={12} />
                Passwords match
              </p>
            )}
            {errors.confirmPassword && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <XCircle size={14} />
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Password Requirements removed - now shown inline above */}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#15592F] hover:bg-[#104624]"
              disabled={loading}
            >
              {loading ? "Changing..." : "Change Password"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
