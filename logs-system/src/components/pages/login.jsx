import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Image1 from "@/assets/login.png";
import Image2 from "@/assets/nwssu 1.png";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ForgotPass from "@/components/modals/forgot-pass";
import VerifyOtpDialog from "@/components/modals/otp-dialog";
import CreateNewPasswordDialog from "@/components/modals/new-password";
import { login, forgotPassword, verifyOtp, resendOtp, resetPassword } from "@/api/authApi";
import { toast } from "sonner";

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [showNewPasswordDialog, setShowNewPasswordDialog] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!loginEmail) {
      setLoginError("Please enter your email address");
      return;
    }

    if (!loginPassword) {
      setLoginError("Please enter your password");
      return;
    }

    setLoading(true);
    setLoginError("");

    try {
      const response = await login(loginEmail, loginPassword);
      console.log("✅ Login successful:", response);
      
      // Store token and user data in localStorage
      localStorage.setItem("auth_token", response.token);
      localStorage.setItem("user_data", JSON.stringify(response.user));
      
      // If remember me is checked, store credentials (optional - for better security, only store token)
      if (rememberMe) {
        localStorage.setItem("remember_me", "true");
      }
      
      // Show success message
      toast.success(`Welcome back, ${response.user.fname}!`);
      
      // Navigate to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Login failed:", err);
      setLoginError(err.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle sending OTP
  const handleForgotSubmit = async () => {
    if (!forgotEmail) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await forgotPassword(forgotEmail);
      console.log("✅ OTP sent:", response.message);
      
      // Show success message
      toast.success(response.message || "OTP sent to your email");
      
      // Close forgot password dialog and open OTP dialog
      setShowForgotPassword(false);
      setShowOtpDialog(true);
    } catch (err) {
      console.error("❌ Error sending OTP:", err);
      setError(err.message || "Failed to send OTP. Please try again.");
      
      // Show error message with toast
      if (err.error === 'email_not_found') {
        toast.error(err.message || "Email not found. Please register first.");
      } else if (err.error === 'email_send_failed') {
        toast.error(
          <div>
            <p className="font-semibold">Failed to Send Email</p>
            <p className="text-sm mt-1">{err.message}</p>
          </div>,
          { duration: 5000 }
        );
      } else {
        toast.error(err.message || "Failed to send OTP. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification
  const handleOtpVerify = async (otpValue) => {
    if (!otpValue || otpValue.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await verifyOtp(forgotEmail, otpValue);
      console.log("✅ OTP verified:", response.message);
      
      // Store OTP for password reset
      setOtp(otpValue);
      
      // Close OTP dialog and open new password dialog
      setShowOtpDialog(false);
      setShowNewPasswordDialog(true);
    } catch (err) {
      console.error("❌ Error verifying OTP:", err);
      setError(err.message || "Invalid OTP. Please try again.");
      throw err; // Re-throw to be handled by the modal
    } finally {
      setLoading(false);
    }
  };

  // Handle resending OTP
  const handleResendOtp = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await resendOtp(forgotEmail);
      console.log("✅ OTP resent:", response.message);
      
      // Show success message
      toast.success(response.message || "OTP resent to your email");
    } catch (err) {
      console.error("❌ Error resending OTP:", err);
      setError(err.message || "Failed to resend OTP. Please try again.");
      
      // Show error message with toast
      if (err.error === 'email_send_failed') {
        toast.error(
          <div>
            <p className="font-semibold">Failed to Send Email</p>
            <p className="text-sm mt-1">{err.message}</p>
          </div>,
          { duration: 5000 }
        );
      } else {
        toast.error(err.message || "Failed to resend OTP. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpBack = () => {
    // Close OTP dialog and go back to forgot password
    setShowOtpDialog(false);
    setShowForgotPassword(true);
    setError("");
  };

  // Handle password reset
  const handlePasswordSuccess = async (password, passwordConfirmation) => {
    if (!password || !passwordConfirmation) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== passwordConfirmation) {
      setError("Passwords do not match");
      throw new Error("Passwords do not match");
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      throw new Error("Password must be at least 6 characters");
    }

    setLoading(true);
    setError("");

    try {
      const response = await resetPassword(forgotEmail, otp, password, passwordConfirmation);
      console.log("✅ Password reset successful:", response.message);
      
      // Show success message
      toast.success(
        <div>
          <p className="font-semibold">Password Reset Successful!</p>
          <p className="text-sm mt-1">Please login with your new password.</p>
        </div>,
        { duration: 4000 }
      );
      
      // Close all dialogs and reset state
      setShowNewPasswordDialog(false);
      setForgotEmail("");
      setOtp("");
      setError("");
    } catch (err) {
      console.error("❌ Error resetting password:", err);
      setError(err.message || "Failed to reset password. Please try again.");
      throw err; // Re-throw to be handled by the modal
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordBack = () => {
    // Close new password dialog and go back to OTP
    setShowNewPasswordDialog(false);
    setShowOtpDialog(true);
    setError("");
  };

  const handleBackToLogin = () => {
    // Reset all states and close all dialogs
    setShowForgotPassword(false);
    setShowOtpDialog(false);
    setShowNewPasswordDialog(false);
    setForgotEmail("");
    setOtp("");
    setError("");
  };

  return (
    <div className="flex min-h-screen">
      {/* MOBILE VIEW - Full width login card */}
      <div className="flex flex-1 items-center justify-center bg-gray-100 p-4 lg:hidden">
        <Card className="w-full max-w-md rounded-2xl border border-gray-300 shadow-sm">
          <CardContent className="p-6">
            {/* Header - Mobile */}
            <div className="mb-6 flex flex-col items-center">
              <img
                src="/user.jpg"
                alt="Login Visual"
                className="mb-3 h-16 w-16 rounded-full"
              />
              <h2 className="text-xl font-bold">Login</h2>
            </div>

            {/* Error Message - Mobile */}
            {loginError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{loginError}</p>
              </div>
            )}

            {/* Email Field - Mobile */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium">Email</label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <Input
                  type="email"
                  placeholder="Enter Email"
                  className="h-10 pl-10"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field - Mobile */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium">Password</label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  className="h-10 pl-10 pr-10"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  disabled={loading}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin(e)}
                />
                {showPassword ? (
                  <EyeOff
                    size={18}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(false)}
                  />
                ) : (
                  <Eye
                    size={18}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(true)}
                  />
                )}
              </div>
            </div>

            {/* Remember Me & Forgot Password - Mobile */}
            <div className="mb-5 flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember-mobile" 
                  checked={rememberMe}
                  onCheckedChange={setRememberMe}
                  disabled={loading}
                />
                <label htmlFor="remember-mobile" className="text-sm">
                  Remember me
                </label>
              </div>

              <button
                type="button"
                className="text-sm text-green-700 font-bold hover:underline"
                onClick={() => setShowForgotPassword(true)}
                disabled={loading}
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button & Register Link - Mobile */}
            <div className="flex flex-col items-center gap-3">
              <Button
                className="h-10 w-full bg-green-800 hover:bg-green-900"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
              <p className="text-sm">
                Don't have an account?{" "}
                <Link to="/register" className="text-green-700 font-bold hover:underline">
                  Register
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <ForgotPass
          open={showForgotPassword}
          onOpenChange={setShowForgotPassword}
          email={forgotEmail}
          setEmail={setForgotEmail}
          onSubmit={handleForgotSubmit}
          onBack={handleBackToLogin}
          loading={loading}
          error={error}
        />

        <VerifyOtpDialog
          open={showOtpDialog}
          onOpenChange={setShowOtpDialog}
          email={forgotEmail}
          onBack={handleOtpBack}
          onVerify={handleOtpVerify}
          onResend={handleResendOtp}
          loading={loading}
          error={error}
        />

        <CreateNewPasswordDialog
          open={showNewPasswordDialog}
          onOpenChange={setShowNewPasswordDialog}
          onBack={handlePasswordBack}
          onSuccess={handlePasswordSuccess}
          loading={loading}
          error={error}
        />
      </div>

      {/* DESKTOP VIEW - Split screen layout */}
      <div className="hidden w-full min-h-screen lg:flex lg:flex-row">
        {/* LEFT SIDE - Background with logo */}
        <div className="relative flex w-1/2">
          <img
            src={Image1}
            alt="Campus"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-green-900/70" />
          <div className="relative z-10 flex flex-col items-center justify-center px-10 text-center text-white">
            <img src={Image2} alt="Logo" className="mb-6 w-28" />
            <h1 className="text-[24px] font-bold leading-tight">
              NORTHWEST SAMAR STATE UNIVERSITY SAN JORGE CAMPUS
            </h1>
            <p className="mt-3 text-[20px] italic tracking-widest">
              STUDENT AFFAIRS AND SERVICES
            </p>
          </div>
        </div>

        {/* RIGHT SIDE - Login form */}
        <div className="flex w-1/2 items-center justify-center bg-gray-100">
          <Card className="w-full max-w-lg rounded-2xl border border-gray-300 shadow-sm">
            <CardContent className="p-10">
              {/* Header - Desktop */}
              <div className="mb-8 flex flex-col items-center">
                <img
                  src="/user.jpg"
                  alt="Login Visual"
                  className="mb-3 h-[70px] w-[70px] rounded-full"
                />
                <h2 className="text-[24px] font-bold">Login</h2>
              </div>

              {/* Error Message - Desktop */}
              {loginError && (
                <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{loginError}</p>
                </div>
              )}

              {/* Email Field - Desktop */}
              <div className="mb-5">
                <label className="mb-2 block text-sm font-medium">Email</label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <Input
                    type="email"
                    placeholder="Enter Email"
                    className="h-11 pl-10"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password Field - Desktop */}
              <div className="mb-5">
                <label className="mb-2 block text-sm font-medium">Password</label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Password"
                    className="h-11 pl-10 pr-10"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    disabled={loading}
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin(e)}
                  />
                  {showPassword ? (
                    <EyeOff
                      size={18}
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(false)}
                    />
                  ) : (
                    <Eye
                      size={18}
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(true)}
                    />
                  )}
                </div>
              </div>

              {/* Remember Me & Forgot Password - Desktop */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember-desktop" 
                    checked={rememberMe}
                    onCheckedChange={setRememberMe}
                    disabled={loading}
                  />
                  <label htmlFor="remember-desktop" className="text-sm">
                    Remember me
                  </label>
                </div>

                <button
                  type="button"
                  className="text-sm text-green-700 font-bold hover:underline"
                  onClick={() => setShowForgotPassword(true)}
                  disabled={loading}
                >
                  Forgot Password?
                </button>
              </div>

              {/* Login Button & Register Link - Desktop */}
              <div className="flex flex-col items-center gap-3">
                <Button
                  className="h-11 w-full bg-green-800 hover:bg-green-900"
                  onClick={handleLogin}
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
                <p className="text-base">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-green-700 font-bold hover:underline">
                    Register
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          <ForgotPass
            open={showForgotPassword}
            onOpenChange={setShowForgotPassword}
            email={forgotEmail}
            setEmail={setForgotEmail}
            onSubmit={handleForgotSubmit}
            onBack={handleBackToLogin}
            loading={loading}
            error={error}
          />

          <VerifyOtpDialog
            open={showOtpDialog}
            onOpenChange={setShowOtpDialog}
            email={forgotEmail}
            onBack={handleOtpBack}
            onVerify={handleOtpVerify}
            onResend={handleResendOtp}
            loading={loading}
            error={error}
          />

          <CreateNewPasswordDialog
            open={showNewPasswordDialog}
            onOpenChange={setShowNewPasswordDialog}
            onBack={handlePasswordBack}
            onSuccess={handlePasswordSuccess}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
}

export default Login;