import { useState } from "react";
import { Button } from "@/components/ui/button";
import Logo from "@/assets/nwssu 1.png";
import {
  LogOut,
  Settings,
  Menu,
  X,
  PencilLine,
  User,
  MessageSquareText,
  LayoutDashboard,
  CalendarClock,
  History,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ChangePass from "@/components/modals/change-pass";
import { logout } from "@/utils/auth";
import { toast } from "sonner";

export default function DashboardHeader() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isChangePassOpen, setIsChangePassOpen] = useState(false);
  const location = useLocation();

  const handlePasswordChange = async ({ currentPassword, newPassword }) => {
    console.log("Change password:", { currentPassword, newPassword });
    // call your API here
  };

  const handleLogout = () => {
    toast.warning(
      <div>
        <p className="font-semibold">Logout?</p>
        <p className="text-sm">Are you sure you want to logout?</p>
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => {
              logout();
              toast.dismiss();
              toast.success('Logged out successfully');
            }}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
          >
            Yes, Logout
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-sm"
          >
            Cancel
          </button>
        </div>
      </div>,
      { duration: 10000 }
    );
  };

  // Helper function to check if a path is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Helper function to check if any settings route is active
  const isSettingsActive = () => {
    return isActive("/Profile") || isActive("/profile") || isActive("/feedback");
  };

  return (
    <header className="relative w-full overflow-hidden">
      {/* MOBILE VIEW */}
      <div className="block lg:hidden">
        <div className="relative z-10 flex flex-col gap-3 px-3 py-3">
          {/* Top Row - Logo, Title, Menu Toggle */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <img
                src={Logo}
                alt="NWSSU Logo"
                className="h-10 w-10 rounded-full border-2 border-white object-cover"
              />
              <div className="text-left text-white">
                <h1 className="text-sm font-bold uppercase leading-tight">
                  NWSSU SAN JORGE CAMPUS
                </h1>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setMobileNavOpen((prev) => !prev)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              aria-expanded={mobileNavOpen}
              aria-label="Toggle navigation"
            >
              {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {mobileNavOpen && (
            <div className="space-y-3 rounded-3xl bg-white/10 p-3 text-white backdrop-blur-sm">
              <nav className="flex flex-col gap-2">
                <Link
                  to="/dashboard"
                  className={`mt-2 flex items-center gap-2 rounded-md px-3 py-2 font-medium ${
                    isActive("/dashboard")
                      ? "border-b-2 border-purple-500"
                      : "hover:bg-green-700"
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>

                <Link
                  to="/appointments"
                  className={`flex items-center gap-2 rounded-md px-3 py-2 font-medium ${
                    isActive("/appointments")
                      ? "border-b-2 border-purple-500"
                      : "hover:bg-green-700"
                  }`}
                >
                  <CalendarClock className="h-4 w-4" />
                  <span>Appointment Request</span>
                </Link>

                <Link
                  to="/transactions"
                  className={`flex items-center gap-2 rounded-md px-3 py-2 font-medium ${
                    isActive("/transactions")
                      ? "border-b-2 border-purple-500"
                      : "hover:bg-green-700"
                  }`}
                >
                  <History className="h-4 w-4" />
                  <span>Transaction History</span>
                </Link>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setUserMenuOpen((prev) => !prev)}
                    className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left font-medium ${
                      isSettingsActive()
                        ? "border-b-2 border-purple-500"
                        : "hover:bg-green-700"
                    }`}
                  >
                    <Settings className="h-4 w-4 text-white" />
                    <span className="text-sm font-medium text-white">Settings</span>
                  </button>

                  {userMenuOpen && (
                    <div className="mt-2 space-y-1 rounded-2xl px-2 py-2 text-white shadow-lg">
                      <Link
                        to="/profile"
                        className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-slate-100 ${
                          isActive("/profile") ? "bg-purple-100 text-purple-700 font-semibold" : ""
                        }`}
                      >
                        <User className="h-4 w-4" />
                        Profile
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false);
                          setIsChangePassOpen(true);
                        }}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm hover:bg-slate-100"
                      >
                        <PencilLine className="h-4 w-4" />
                        Change password
                      </button>

                      <Link
                        to="/feedback"
                        className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-slate-100 ${
                          isActive("/feedback") ? "bg-purple-100 text-purple-700 font-semibold" : ""
                        }`}
                      >
                        <MessageSquareText className="h-4 w-4" />
                        Feedback
                      </Link>
                    </div>
                  )}
                </div>
              </nav>

              <div className="flex flex-col gap-3">
                <Button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-md bg-red-600 px-3 py-2 text-sm font-medium hover:bg-red-700"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DESKTOP VIEW */}
      <div className="hidden lg:block">
        <div className="relative z-10 flex h-24 items-center justify-between px-6">
          {/* Left Side - Logo and Title */}
          <div className="flex items-center gap-4">
            <img
              src={Logo}
              alt="NWSSU Logo"
              className="h-16 w-16 rounded-full border-2 border-white object-cover"
            />

            <div className="text-left text-white">
              <h1 className="text-lg font-bold uppercase leading-tight">
                Northwest Samar State University
              </h1>

              <h2 className="text-lg font-semibold uppercase">
                San Jorge Campus
              </h2>

              <div className="mt-1 flex items-center gap-2 text-sm text-gray-200">
                <span>Resilience</span>
                <span>●</span>
                <span>Integrity</span>
                <span>●</span>
                <span>Service</span>
                <span>●</span>
                <span>Excellence</span>
              </div>
            </div>
          </div>

          {/* Right Side - Navigation and Actions */}
          <div className="flex items-center gap-6">
            <nav className="flex items-center gap-1">
              <Link
                to="/dashboard"
                className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white ${
                  isActive("/dashboard")
                    ? "border-b-2 border-purple-500"
                    : "hover:bg-green-700"
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>

              <Link
                to="/appointments"
                className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white ${
                  isActive("/appointments")
                    ? "border-b-2 border-purple-500"
                    : "hover:bg-green-700"
                }`}
              >
                <CalendarClock className="h-4 w-4" />
                <span>Appointment Request</span>
              </Link>

              <Link
                to="/transactions"
                className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white ${
                  isActive("/transactions")
                    ? "border-b-2 border-purple-500"
                    : "hover:bg-green-700"
                }`}
              >
                <History className="h-4 w-4" />
                <span>Transaction History</span>
              </Link>
            </nav>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={`flex items-center gap-2 rounded-md px-10 py-2 text-sm font-medium text-white ${
                    isSettingsActive()
                      ? "border-b-2 border-purple-500"
                      : "hover:bg-green-700"
                  }`}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white">
                    <Settings />
                  </div>
                  <span className="text-sm font-medium text-white">Settings</span>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-44 bg-white text-slate-900">
                <DropdownMenuItem asChild>
                  <Link 
                    to="/Profile" 
                    className={`flex cursor-pointer items-center gap-2 ${
                      isActive("/Profile") ? "bg-purple-100 text-purple-700 font-semibold" : ""
                    }`}
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onSelect={(event) => {
                    event.preventDefault();
                    setIsChangePassOpen(true);
                  }}
                >
                  <div className="flex cursor-pointer items-center gap-2">
                    <PencilLine className="h-4 w-4" />
                    Change Password
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link 
                    to="/feedback" 
                    className={`flex cursor-pointer items-center gap-2 ${
                      isActive("/feedback") ? "bg-purple-100 text-purple-700 font-semibold" : ""
                    }`}
                  >
                    <MessageSquareText className="h-4 w-4" />
                    Feedback
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem 
                  onSelect={(event) => {
                    event.preventDefault();
                    handleLogout();
                  }}
                >
                  <div className="flex cursor-pointer items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    Logout
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <ChangePass
              open={isChangePassOpen}
              onOpenChange={setIsChangePassOpen}
              onSubmit={handlePasswordChange}
            />
          </div>
        </div>
      </div>
    </header>
  );
}