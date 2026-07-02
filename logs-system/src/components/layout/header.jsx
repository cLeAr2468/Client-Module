import { Button } from "@/components/ui/button";
import Logo from "@/assets/nwssu 1.png"; // Your logo image
import { Link } from "react-router-dom";

export default function Header() {
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
          </div>
        </div>
      </div>
    </header>
  );
}