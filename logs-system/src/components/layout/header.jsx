import { Button } from "@/components/ui/button";
import Logo from "@/assets/nwssu 1.png"; // Your logo image
import { Link } from "react-router-dom";
export default function Header() {
  return (
    <header className="relative h-24 w-full overflow-hidden">
      <div className="relative z-10 flex h-full items-center justify-between px-4 md:px-6">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          <img
            src={Logo}
            alt="NWSSU Logo"
            className="h-16 w-16 rounded-full border-2 border-white object-cover"
          />

          <div className="text-white">
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

        {/* Right Side */}
        <div className="flex items-center gap-4">
            <Link to= "/login">
            <Button
            className="h-8 w-30 border border-white bg-green-800 text-md font-semibold hover:bg-green-700 rounded-md"
            >
            Login
            </Button>
            </Link>

            <Link to= "/register">
            <Button
            className="h-8 w-30 border border-white bg-green-800 text-md font-semibold hover:bg-green-700 rounded-md"
            >
            Register
            </Button>
            </Link>
        </div>
      </div>
    </header>
  );
}