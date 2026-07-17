import { useState } from "react";
import api from "../../api/api";
import Image1 from "@/assets/login.png";
import Image2 from "@/assets/nwssu 1.png";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Mail, Lock, Eye, EyeOff, School } from "lucide-react";
import { toast } from "sonner";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [course, setCourse] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [form, setForm] = useState({
    student_id: "",
    fname: "",
    mname: "",
    lname: "",
    email: "",
    course: "",
    year_level: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetchingStudent, setFetchingStudent] = useState(false);

  // Fetch student data from masterlist when student ID is entered
  const handleStudentIdBlur = async () => {
    if (!form.student_id || form.student_id.trim() === "") return;

    setFetchingStudent(true);
    try {
      const response = await api.get(`/masterlist/student/${form.student_id}`);
      const student = response.data.student;

      // Auto-fill form with masterlist data
      setForm({
        ...form,
        fname: student.fname || "",
        mname: student.mname || "",
        lname: student.lname || "",
        email: student.email || "",
        course: student.course || "",
        year_level: student.year_level || "",
      });

      toast.success("Student information loaded!");
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error("Student ID not found in masterlist. Please contact the administrator.");
      } else {
        toast.error("Failed to fetch student information");
      }
      // Clear other fields if student not found
      setForm({
        ...form,
        fname: "",
        mname: "",
        lname: "",
        email: "",
        course: "",
        year_level: "",
      });
    } finally {
      setFetchingStudent(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password match
    if (form.password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    // Validate password length
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters!");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/register", form);

      console.log(response.data);

      toast.success("Registered successfully! Redirecting to login...");

      setForm({
        student_id: "",
        fname: "",
        mname: "",
        lname: "",
        email: "",
        course: "",
        year_level: "",
        password: "",
      });
      setConfirmPassword("");

      // Redirect to login after successful registration
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (error) {
      console.error(error.response?.data);

      toast.error(
        error.response?.data?.message ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
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

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Student ID - Mobile */}
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Student ID:
                </label>
                <Input
                  id="student_id"
                  placeholder="21-SJ-0001"
                  className="h-9 border border-gray-300 bg-white text-sm"
                  value={form.student_id}
                  onChange={handleChange}
                  onBlur={handleStudentIdBlur}
                  disabled={fetchingStudent}
                />
                {fetchingStudent && (
                  <p className="text-xs text-gray-500 mt-1">Loading student info...</p>
                )}
              </div>

              {/* First Name - Mobile */}
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  First Name:
                </label>
                <Input
                  id="fname"
                  placeholder="First Name"
                  className="h-9 border border-gray-300 bg-white text-sm"
                  value={form.fname}
                  onChange={handleChange}
                />
              </div>

              {/* Middle Name - Mobile */}
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Middle Name:
                </label>
                <Input
                  id="mname"
                  placeholder="Middle Name"
                  className="h-9 border border-gray-300 bg-white text-sm"
                  value={form.mname}
                  onChange={handleChange}
                />
              </div>

              {/* Last Name - Mobile */}
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Last Name:
                </label>
                <Input
                  id="lname"
                  placeholder="Last Name"
                  className="h-9 border border-gray-300 bg-white text-sm"
                  value={form.lname}
                  onChange={handleChange}
                />
              </div>

              {/* Course - Mobile */}
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Course:
                </label>
                <Select value={form.course}
                  onValueChange={(value) =>
                    setForm({ ...form, course: value })
                  }>
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
              <div className="space-y-2">
                <Label>Year Level</Label>

                <Select
                  value={form.year_level}
                  onValueChange={(value) =>
                    setForm({ ...form, year_level: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <div className="flex items-center gap-2">
                      <School className="h-4 w-4 text-muted-foreground" />
                      <SelectValue placeholder="Select Year Level" />
                    </div>
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="1st Year">
                      1st Year
                    </SelectItem>

                    <SelectItem value="2nd Year">
                      2nd Year
                    </SelectItem>

                    <SelectItem value="3rd Year">
                      3rd Year
                    </SelectItem>

                    <SelectItem value="4th Year">
                      4th Year
                    </SelectItem>
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
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="h-9 border border-gray-300 bg-white pl-9 text-sm"
                    value={form.email}
                    onChange={handleChange}
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
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="h-9 border border-gray-300 bg-white pl-9 pr-10 text-sm"
                    value={form.password}
                    onChange={handleChange}
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
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="h-9 border border-gray-300 bg-white pl-9 pr-10 text-sm"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                  disabled={loading}
                  className="w-full bg-[#15592F] hover:bg-[#124b28] text-white flex items-center gap-2 ml-4 cursor-pointer"
                >
                  {loading ? "Registering..." : "Register Student"}
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

              <form className="space-y-5" onSubmit={handleSubmit}>
                {/* Student ID & First Name - Desktop */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Student ID:
                  </label>
                  <Input
                    id="student_id"
                    placeholder="21-SJ-0001"
                    className="h-10 border border-gray-300 bg-white text-sm"
                    value={form.student_id}
                    onChange={handleChange}
                    onBlur={handleStudentIdBlur}
                    disabled={fetchingStudent}
                  />
                  {fetchingStudent && (
                    <p className="text-xs text-gray-500 mt-1">Loading student info...</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      First Name:
                    </label>
                    <Input
                      id="fname"
                      placeholder="First Name"
                      className="h-10 border border-gray-300 bg-white text-sm"
                      value={form.fname}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Middle Name:
                    </label>
                    <Input
                      id="mname"
                      placeholder="Middle Name"
                      className="h-10 border border-gray-300 bg-white text-sm"
                      value={form.mname}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                {/* Middle Name & Last Name - Desktop */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Last Name:
                    </label>
                    <Input
                      id="lname"
                      placeholder="Last Name"
                      className="h-10 border border-gray-300 bg-white text-sm"
                      value={form.lname}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Email:
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="h-10 border border-gray-300 bg-white pl-9 text-sm"
                        value={form.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Course & Email - Desktop */}
                <div className="grid grid-cols-2 gap-4">
                <div> 
                <label className="mb-1.5 block text-sm font-medium">
                  Course:
                </label>
                <Select value={form.course}
                  onValueChange={(value) =>
                    setForm({ ...form, course: value })
                  }>
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
              <div className="space-y-2">
                <Label>Year Level</Label>

                <Select
                  value={form.year_level}
                  onValueChange={(value) =>
                    setForm({ ...form, year_level: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <div className="flex items-center gap-2">
                      <School className="h-4 w-4 text-muted-foreground" />
                      <SelectValue placeholder="Select Year Level" />
                    </div>
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="1st Year">
                      1st Year
                    </SelectItem>

                    <SelectItem value="2nd Year">
                      2nd Year
                    </SelectItem>

                    <SelectItem value="3rd Year">
                      3rd Year
                    </SelectItem>

                    <SelectItem value="4th Year">
                      4th Year
                    </SelectItem>
                  </SelectContent>
                </Select>
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
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="h-10 border border-gray-300 bg-white pl-9 pr-10 text-sm"
                      value={form.password}
                      onChange={handleChange}
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
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="h-10 border border-gray-300 bg-white pl-9 pr-10 text-sm"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
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
                  disabled={loading}
                  className="w-full bg-[#15592F] hover:bg-[#124b28] text-white flex items-center gap-2 ml-4 cursor-pointer"
                >
                  {loading ? "Registering..." : "Register Student"}
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