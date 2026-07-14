import { Button } from "@/components/ui/button";
import Logo from "@/assets/nwssu 1.png"; // Your logo image
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated, logout } from "@/utils/auth";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

export default function Header() {
  const navigate = useNavigate();
  const isLoggedIn = isAuthenticated();

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

  return (
    <header className="relative w-full overflow-hidden">
      {/* MOBILE VIEW - Visible only on mobile */}
      <div className="block md:hidden">
        <div className="relative z-10 flex h-full flex-col items-center justify-between gap-3 px-3 py-3">
          {/* Left Side - Mobile: Center */}
          <div className="flex flex-col items-center gap-2">
            <img
              src={Logo}
              alt="NWSSU Logo"
              className="h-12 w-12 rounded-full border-2 border-white object-cover"
            />

            <div className="text-center text-white">
              <h1 className="text-sm font-bold uppercase leading-tight">
                Northwest Samar State University
              </h1>

              <h2 className="text-xs font-semibold uppercase">
                San Jorge Campus
              </h2>

              <div className="mt-1 flex flex-wrap items-center justify-center gap-1 text-xs text-gray-200">
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

          {/* Right Side - Mobile: Full width buttons */}
          <div className="flex w-full items-center gap-2">
            {isLoggedIn ? (
              <>
                <Link to="/dashboard" className="flex-1">
                  <Button className="h-8 w-full rounded-md border border-white bg-green-800 text-sm font-semibold hover:bg-green-700">
                    Go to Dashboard
                  </Button>
                </Link>
                <Button 
                  onClick={handleLogout}
                  className="h-8 w-auto px-3 rounded-md border border-white bg-red-600 text-sm font-semibold hover:bg-red-700"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="flex-1">
                  <Button className="h-8 w-full rounded-md border border-white bg-green-800 text-sm font-semibold hover:bg-green-700">
                    Login
                  </Button>
                </Link>

                <Link to="/register" className="flex-1">
                  <Button className="h-8 w-full rounded-md border border-white bg-green-800 text-sm font-semibold hover:bg-green-700">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* DESKTOP VIEW - Visible only on desktop */}
      <div className="hidden md:block">
        <div className="relative z-10 flex h-24 items-center justify-between    px-6">
          {/* Left Side - Desktop: Left aligned */}
          <div className="flex items-center gap-4">
            <img
              src={Logo}
              alt="NWSSU Logo"
              className="h-16 w-16 rounded-full border-2 border-white object-cover"
            />

            <div className="text-left text-white">
              <h1 className="text-xl font-bold uppercase leading-tight">
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

          {/* Right Side - Desktop: Normal buttons */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <Link to="/dashboard">
                  <Button className="h-9 px-6 rounded-md border border-white bg-green-800 text-base font-semibold hover:bg-green-700">
                    Go to Dashboard
                  </Button>
                </Link>
                <Button 
                  onClick={handleLogout}
                  className="h-9 px-4 rounded-md border border-white bg-red-600 text-base font-semibold hover:bg-red-700 flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button className="h-8 w-24 rounded-md border border-white bg-green-800 text-base font-semibold hover:bg-green-700">
                    Login
                  </Button>
                </Link>

                <Link to="/register">
                  <Button className="h-8 w-24 rounded-md border border-white bg-green-800 text-base font-semibold hover:bg-green-700">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}