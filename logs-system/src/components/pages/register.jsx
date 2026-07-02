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
    <div className="flex min-h-screen">
      {/* MOBILE VIEW - Full width register form */}
      <div className="flex flex-1 items-center justify-center bg-gray-100 p-4 lg:hidden">
        <Card className="w-full max-w-xl rounded-2xl border border-black shadow-none">
          <CardContent className="p-6">
            {/* Mobile Logo */}
            <div className="mb-6 flex flex-col items-center">
              <img src={Image2} alt="Logo" className="mb-3 w-16" />
              <h2 className="text-center text-xl font-bold">Register</h2>
            </div>

            <form className="space-y-4">
              {/* Student ID - Mobile */}
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Student ID:
                </label>
                <Input
                  placeholder="21-SJ-0001"
                  className="h-9 border border-gray-300 bg-white text-sm"
                />
              </div>

              {/* First Name - Mobile */}
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  First Name:
                </label>
                <Input
                  placeholder="First Name"
                  className="h-9 border border-gray-300 bg-white text-sm"
                />
              </div>

              {/* Middle Name - Mobile */}
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Middle Name:
                </label>
                <Input
                  placeholder="Middle Name"
                  className="h-9 border border-gray-300 bg-white text-sm"
                />
              </div>

              {/* Last Name - Mobile */}
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Last Name:
                </label>
                <Input
                  placeholder="Last Name"
                  className="h-9 border border-gray-300 bg-white text-sm"
                />
              </div>

              {/* Course - Mobile */}
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Course:
                </label>
                <Select value={course} onValueChange={setCourse}>
                  <SelectTrigger className="h-9 w-full border border-gray-300 bg-white text-sm">
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

              {/* Email - Mobile */}
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Email:
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="h-9 border border-gray-300 bg-white pl-9 text-sm"
                  />
                </div>
              </div>

              {/* Password - Mobile */}
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Password:
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="h-9 border border-gray-300 bg-white pl-9 pr-10 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password - Mobile */}
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Confirm Password:
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="h-9 border border-gray-300 bg-white pl-9 pr-10 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>

              {/* Register Button - Mobile */}
              <div className="flex flex-col items-center gap-3">
                <Button
                  type="submit"
                  className="mt-4 h-10 w-full bg-green-800 text-base font-medium hover:bg-green-700"
                >
                  Register
                </Button>
                <p className="text-sm">
                  Do you have an account?{" "}
                  <Link
                    to="/login"
                    className="text-center text-green-700 font-bold hover:underline"
                  >
                    Login
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* DESKTOP VIEW - Split screen layout */}
      <div className="hidden min-h-screen lg:flex">
        {/* LEFT SIDE - Background with logo */}
        <div className="relative flex w-1/2">
          {/* Background Image */}
          <img
            src={Image1}
            alt="Campus"
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-green-900/70" />

          {/* Content */}
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

        {/* RIGHT SIDE - Register form */}
        <div className="flex w-1/2 items-center justify-center bg-gray-100 p-6">
          <Card className="w-full max-w-xl rounded-3xl border border-black shadow-none">
            <CardContent className="p-10">
              <h2 className="mb-6 text-center text-2xl font-bold">Register</h2>

              <form className="space-y-5">
                {/* Student ID & First Name - Desktop */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Student ID:
                    </label>
                    <Input
                      placeholder="21-SJ-0001"
                      className="h-10 border border-gray-300 bg-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      First Name:
                    </label>
                    <Input
                      placeholder="First Name"
                      className="h-10 border border-gray-300 bg-white text-sm"
                    />
                  </div>
                </div>

                {/* Middle Name & Last Name - Desktop */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Middle Name:
                    </label>
                    <Input
                      placeholder="Middle Name"
                      className="h-10 border border-gray-300 bg-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Last Name:
                    </label>
                    <Input
                      placeholder="Last Name"
                      className="h-10 border border-gray-300 bg-white text-sm"
                    />
                  </div>
                </div>

                {/* Course & Email - Desktop */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Course:
                    </label>
                    <Select value={course} onValueChange={setCourse}>
                      <SelectTrigger className="h-10 w-full border border-gray-300 bg-white text-sm">
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
                    <label className="mb-1.5 block text-sm font-medium">
                      Email:
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        className="h-10 border border-gray-300 bg-white pl-9 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Password - Desktop */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Password:
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="h-10 border border-gray-300 bg-white pl-9 pr-10 text-sm"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password - Desktop */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Confirm Password:
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="h-10 border border-gray-300 bg-white pl-9 pr-10 text-sm"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-3"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Register Button - Desktop */}
                <div className="flex flex-col items-center gap-3">
                  <Button
                    type="submit"
                    className="mt-4 h-11 w-full bg-green-800 text-base font-medium hover:bg-green-700"
                  >
                    Register
                  </Button>
                  <p className="text-base">
                    Do you have an account?{" "}
                    <Link
                      to="/login"
                      className="text-center font-bold text-green-700 hover:underline"
                    >
                      Login
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}