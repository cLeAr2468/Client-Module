import { useState } from "react";
import Image1 from "@/assets/login.png";
import Image2 from "@/assets/nwssu 1.png";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [course, setCourse] = useState("");

  return (
    <div className="min-h-screen flex">
      {/* LEFT SIDE */}
      <div className="hidden lg:flex w-1/2 relative">
        {/* Background Image */}
        <img
          src={Image1}
          alt="Campus"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-green-900/70" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center text-white px-10">
          <img src={Image2} alt="Logo" className="w-28 mb-6" />

          <h1 className="text-[24px] font-bold leading-tight">
            NORTHWEST SAMAR STATE UNIVERSITY SAN JORGE CAMPUS
          </h1>

          <p className="mt-3 tracking-widest text-[20px] italic">
            STUDENT AFFAIRS AND SERVICES
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1 flex items-center justify-center bg-gray-100 p-6">
        <Card className="w-full max-w-xl rounded-3xl border border-black shadow-none">
          <CardContent className="p-10">
            <h2 className="text-center text-2xl font-bold mb-6">Register</h2>

            <form className="space-y-5">
              {/* Student ID & First Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5 text-sm font-medium">Student ID:</label>
                  <Input
                    placeholder="21-SJ-0001"
                    className="h-8 text-sm bg-white border border-gray-300"
                  />
                </div>

                <div>
                  <label className="block mb-1.5 text-sm font-medium">First Name:</label>
                  <Input
                    placeholder="First Name"
                    className="h-8 text-sm bg-white border border-gray-300"
                  />
                </div>
              </div>

              {/* Middle Name & Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5 text-sm font-medium">Middle Name:</label>
                  <Input
                    placeholder="Middle Name"
                    className="h-8 text-sm bg-white border border-gray-300"
                  />
                </div>

                <div>
                  <label className="block mb-1.5 text-sm font-medium">Last Name:</label>
                  <Input
                    placeholder="Last Name"
                    className="h-8 text-sm bg-white border border-gray-300"
                  />
                </div>
              </div>

              {/* Course & Email */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5 text-sm font-medium">Course:</label>
                  <Select value={course} onValueChange={setCourse}>
                    <SelectTrigger className="h-4 w-full text-sm bg-white border border-gray-300">
                      <SelectValue placeholder="Select Course" />
                    </SelectTrigger>
                    <SelectContent className="text-sm">
                      <SelectItem value="BSCS">BSCS</SelectItem>
                      <SelectItem value="BSIT">BSIT</SelectItem>
                      <SelectItem value="BSCOE">BSCOE</SelectItem>
                      <SelectItem value="BSEE">BSEE</SelectItem>
                      <SelectItem value="BSME">BSME</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block mb-1.5 text-sm font-medium">Email:</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="h-8 pl-9 text-sm bg-white border border-gray-300"
                    />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block mb-1.5 text-sm font-medium">Password:</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2 h-4 w-4 text-muted-foreground" />

                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="h-8 pl-9 pr-10 text-sm bg-white border border-gray-300"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block mb-1.5 text-sm font-medium">Confirm Password:</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2 h-4 w-4 text-muted-foreground" />

                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="h-8 pl-9 pr-10 text-sm bg-white border border-gray-300"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>

              {/* Register Button */}
              <div className="flex flex-col gap-3 items-center">
                <Button
                  type="submit"
                  className="w-full h-8 mt-4 bg-green-800 hover:bg-green-700 text-base font-medium"
                >
                  Register
                </Button>
                <p>Do you have an account? <Link to="/login" className="text-green-700 hover:underline text-center">Login</Link></p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 