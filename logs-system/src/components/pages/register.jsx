import { useState, useMemo } from "react";
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
import AddressSelector from "@/components/common/AddressSelector";

import { Mail, Lock, Eye, EyeOff, School, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { 
  validatePassword, 
  validateEmail, 
  validateTextInput,
  autoCapitalize,
  formatStudentId,
  getPasswordStrengthColor,
  getPasswordErrorMessage
} from "@/utils/validation";

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
    barangay: "",
    municipality: "",
    province: "",
    course: "",
    year_level: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetchingStudent, setFetchingStudent] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Password validation (memoized for performance)
  const passwordValidation = useMemo(() => {
    if (!form.password) return null;
    return validatePassword(form.password);
  }, [form.password]);

  // Check if passwords match
  const passwordsMatch = form.password && confirmPassword && form.password === confirmPassword;

  // Fetch student data from masterlist when student ID is entered
  const handleStudentIdBlur = async () => {
    if (!form.student_id || form.student_id.trim() === "") return;

    setFetchingStudent(true);
    try {
      const response = await api.get(`/masterlist/student/${form.student_id}`);
      const student = response.data.student;

      // Auto-fill form with masterlist data and apply capitalization
      setForm({
        ...form,
        fname: autoCapitalize(student.fname || ""),
        mname: autoCapitalize(student.mname || ""),
        lname: autoCapitalize(student.lname || ""),
        email: student.email || "",
        barangay: student.barangay || "",
        municipality: student.municipality || "",
        province: student.province || "",
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
        barangay: "",
        municipality: "",
        province: "",
        course: "",
        year_level: "",
      });
    } finally {
      setFetchingStudent(false);
    }
  };

  // Handle input changes with validation
  const handleChange = (e) => {
    const { id, value } = e.target;
    
    let processedValue = value;
    
    // Apply formatting based on field type
    if (id === "student_id") {
      processedValue = formatStudentId(value);
    } else if (["fname", "mname", "lname"].includes(id)) {
      // Auto-capitalize names as user types
      processedValue = autoCapitalize(value);
    }

    setForm({
      ...form,
      [id]: processedValue,
    });

    // Clear error when user starts typing
    if (errors[id]) {
      setErrors({ ...errors, [id]: null });
    }
  };

  // Mark field as touched on blur
  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    validateField(field);
  };

  // Validate individual field
  const validateField = (field) => {
    let error = null;

    switch (field) {
      case "student_id":
        if (!form.student_id) {
          error = "Student ID is required";
        }
        break;
      
      case "fname":
      case "lname":
        const validation = validateTextInput(form[field], {
          minLength: 2,
          maxLength: 50,
          allowSpecialChars: false,
          required: true,
        });
        if (!validation.isValid) {
          error = validation.error;
        }
        break;

      case "mname":
        // Middle name is optional
        if (form[field]) {
          const validation = validateTextInput(form[field], {
            minLength: 1,
            maxLength: 50,
            allowSpecialChars: false,
            required: false,
          });
          if (!validation.isValid) {
            error = validation.error;
          }
        }
        break;

      case "email":
        if (!form.email) {
          error = "Email is required";
        } else if (!validateEmail(form.email)) {
          error = "Please enter a valid email address";
        }
        break;

      case "password":
        if (!form.password) {
          error = "Password is required";
        } else if (passwordValidation && !passwordValidation.isValid) {
          error = "Password does not meet all requirements";
        }
        break;

      case "confirmPassword":
        if (!confirmPassword) {
          error = "Please confirm your password";
        } else if (confirmPassword !== form.password) {
          error = "Passwords do not match";
        }
        break;

      case "course":
      case "year_level":
        if (!form[field]) {
          error = `${field === "year_level" ? "Year level" : "Course"} is required`;
        }
        break;

      case "province":
      case "municipality":
      case "barangay":
        if (!form[field]) {
          error = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        }
        break;
    }

    if (error) {
      setErrors({ ...errors, [field]: error });
    }

    return !error;
  };

  // Validate all fields
  const validateAllFields = () => {
    const fields = [
      "student_id",
      "fname",
      "lname",
      "email",
      "course",
      "year_level",
      "province",
      "municipality",
      "barangay",
      "password",
    ];

    let isValid = true;
    const newErrors = {};

    fields.forEach((field) => {
      if (!validateField(field)) {
        isValid = false;
      }
    });

    // Check confirm password separately
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (confirmPassword !== form.password) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors({ ...errors, ...newErrors });
    setTouched({
      student_id: true,
      fname: true,
      lname: true,
      email: true,
      course: true,
      year_level: true,
      province: true,
      municipality: true,
      barangay: true,
      password: true,
      confirmPassword: true,
    });

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields first
    if (!validateAllFields()) {
      toast.error("Please fix all validation errors before submitting");
      return;
    }

    // Validate password match (double-check)
    if (form.password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    // Validate password requirements (double-check)
    if (!passwordValidation || !passwordValidation.isValid) {
      const errorMsg = getPasswordErrorMessage(passwordValidation);
      toast.error(errorMsg || "Password does not meet all requirements!");
      return;
    }

    // Debug: Log form data before submitting
    console.log("=== FORM DATA BEFORE SUBMIT ===");
    console.log("Province:", form.province);
    console.log("Municipality:", form.municipality);
    console.log("Barangay:", form.barangay);
    console.log("Full form:", form);
    console.log("================================");

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
        barangay: "",
        municipality: "",
        province: "",
        course: "",
        year_level: "",
        password: "",
      });
      setConfirmPassword("");
      setErrors({});
      setTouched({});

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
                  Student ID: <span className="text-red-500">*</span>
                </label>
                <Input
                  id="student_id"
                  placeholder="21-SJ-0001"
                  className={`h-9 border bg-white text-sm ${
                    touched.student_id && errors.student_id ? "border-red-500" : "border-gray-300"
                  }`}
                  value={form.student_id}
                  onChange={handleChange}
                  onBlur={() => {
                    handleBlur("student_id");
                    handleStudentIdBlur();
                  }}
                  disabled={fetchingStudent}
                />
                {fetchingStudent && (
                  <p className="text-xs text-gray-500 mt-1">Loading student info...</p>
                )}
                {touched.student_id && errors.student_id && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <XCircle size={12} />
                    {errors.student_id}
                  </p>
                )}
              </div>

              {/* First Name - Mobile */}
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  First Name: <span className="text-red-500">*</span>
                </label>
                <Input
                  id="fname"
                  placeholder="First Name"
                  className={`h-9 border bg-white text-sm ${
                    touched.fname && errors.fname ? "border-red-500" : "border-gray-300"
                  }`}
                  value={form.fname}
                  onChange={handleChange}
                  onBlur={() => handleBlur("fname")}
                  required
                />
                {touched.fname && errors.fname && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <XCircle size={12} />
                    {errors.fname}
                  </p>
                )}
              </div>

              {/* Middle Name - Mobile */}
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Middle Name (Optional):
                </label>
                <Input
                  id="mname"
                  placeholder="Middle Name (Optional)"
                  className={`h-9 border bg-white text-sm ${
                    touched.mname && errors.mname ? "border-red-500" : "border-gray-300"
                  }`}
                  value={form.mname}
                  onChange={handleChange}
                  onBlur={() => handleBlur("mname")}
                />
                {touched.mname && errors.mname && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <XCircle size={12} />
                    {errors.mname}
                  </p>
                )}
              </div>

              {/* Last Name - Mobile */}
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Last Name: <span className="text-red-500">*</span>
                </label>
                <Input
                  id="lname"
                  placeholder="Last Name"
                  className={`h-9 border bg-white text-sm ${
                    touched.lname && errors.lname ? "border-red-500" : "border-gray-300"
                  }`}
                  value={form.lname}
                  onChange={handleChange}
                  onBlur={() => handleBlur("lname")}
                  required
                />
                {touched.lname && errors.lname && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <XCircle size={12} />
                    {errors.lname}
                  </p>
                )}
              </div>

              {/* Course - Mobile */}
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Course:
                </label>
                <Select value={form.course}
                  onValueChange={(value) =>
                    setForm({ ...form, course: value })
                  }
                  required>
                  <SelectTrigger className="h-9 w-full border border-gray-300 bg-white text-sm">
                    <SelectValue placeholder="Select Course" />
                  </SelectTrigger>
                  <SelectContent className="text-sm">
                    <SelectItem value="BEED">BEED</SelectItem>
                    <SelectItem value="BSIT">BSIT</SelectItem>
                    <SelectItem value="BTLED">BTLED</SelectItem>
                    <SelectItem value="BSABE">BSABE</SelectItem>
                    <SelectItem value="BSCRIM">BSCRIM</SelectItem>
                    <SelectItem value="BAT">BSA</SelectItem>
                    <SelectItem value="BAT">BAT</SelectItem>
                    <SelectItem value="BAT">BSF</SelectItem>
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
                  required
                >
                  <SelectTrigger className="w-full bg-white">
                    <div className="flex items-center gap-2">
                      <School className="h-4 w-4 text-muted-foreground" />
                      <SelectValue placeholder="Select Year Level" />
                    </div>
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="1">
                      1
                    </SelectItem>

                    <SelectItem value="2">
                      2
                    </SelectItem>

                    <SelectItem value="3">
                      3
                    </SelectItem>

                    <SelectItem value="4">
                      4
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
                    className="h-9 border border-gray-300 bg-gray-100 pl-9 text-sm cursor-not-allowed"
                    value={form.email}
                    onChange={handleChange}
                    readOnly
                  />
                </div>
              </div>

              {/* Address Selector - Mobile */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Address Information</h3>
                <AddressSelector
                  province={form.province}
                  municipality={form.municipality}
                  barangay={form.barangay}
                  onProvinceChange={(value) =>
                    setForm({ ...form, province: value, municipality: "", barangay: "" })
                  }
                  onMunicipalityChange={(value) =>
                    setForm({ ...form, municipality: value, barangay: "" })
                  }
                  onBarangayChange={(value) => 
                    setForm({ ...form, barangay: value })
                  }
                  required={true}
                  layout="stacked"
                />
              </div>

              {/* Password - Mobile */}
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Password: <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`h-9 border bg-white pl-9 pr-10 text-sm ${
                      touched.password && errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                    value={form.password}
                    onChange={handleChange}
                    onBlur={() => handleBlur("password")}
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

                {/* Password strength indicator */}
                {passwordValidation && form.password && (
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

                {touched.password && errors.password && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <XCircle size={12} />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password - Mobile */}
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Confirm Password: <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`h-9 border bg-white pl-9 pr-10 text-sm ${
                      touched.confirmPassword && errors.confirmPassword 
                        ? "border-red-500" 
                        : passwordsMatch 
                        ? "border-green-500" 
                        : "border-gray-300"
                    }`}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword) {
                        setErrors({ ...errors, confirmPassword: null });
                      }
                    }}
                    onBlur={() => handleBlur("confirmPassword")}
                  />
                  <div className="absolute right-3 top-2.5 flex items-center gap-1">
                    {passwordsMatch && (
                      <CheckCircle2 size={16} className="text-green-700" />
                    )}
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>
                {passwordsMatch && (
                  <p className="text-xs text-green-700 mt-1 flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    Passwords match
                  </p>
                )}
                {touched.confirmPassword && errors.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <XCircle size={12} />
                    {errors.confirmPassword}
                  </p>
                )}
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
                    Student ID: <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="student_id"
                    placeholder="21-SJ-0001"
                    className={`h-10 border bg-white text-sm ${
                      touched.student_id && errors.student_id ? "border-red-500" : "border-gray-300"
                    }`}
                    value={form.student_id}
                    onChange={handleChange}
                    onBlur={() => {
                      handleBlur("student_id");
                      handleStudentIdBlur();
                    }}
                    disabled={fetchingStudent}
                  />
                  {fetchingStudent && (
                    <p className="text-xs text-gray-500 mt-1">Loading student info...</p>
                  )}
                  {touched.student_id && errors.student_id && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <XCircle size={12} />
                      {errors.student_id}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      First Name: <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="fname"
                      placeholder="First Name"
                      className={`h-10 border bg-white text-sm ${
                        touched.fname && errors.fname ? "border-red-500" : "border-gray-300"
                      }`}
                      value={form.fname}
                      onChange={handleChange}
                      onBlur={() => handleBlur("fname")}
                      required
                    />
                    {touched.fname && errors.fname && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <XCircle size={12} />
                        {errors.fname}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Middle Name (Optional):
                    </label>
                    <Input
                      id="mname"
                      placeholder="Middle Name (Optional)"
                      className={`h-10 border bg-white text-sm ${
                        touched.mname && errors.mname ? "border-red-500" : "border-gray-300"
                      }`}
                      value={form.mname}
                      onChange={handleChange}
                      onBlur={() => handleBlur("mname")}
                    />
                    {touched.mname && errors.mname && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <XCircle size={12} />
                        {errors.mname}
                      </p>
                    )}
                  </div>
                </div>
                {/* Middle Name & Last Name - Desktop */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Last Name: <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="lname"
                      placeholder="Last Name"
                      className={`h-10 border bg-white text-sm ${
                        touched.lname && errors.lname ? "border-red-500" : "border-gray-300"
                      }`}
                      value={form.lname}
                      onChange={handleChange}
                      onBlur={() => handleBlur("lname")}
                      required
                    />
                    {touched.lname && errors.lname && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <XCircle size={12} />
                        {errors.lname}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Email: <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className={`h-10 border bg-gray-100 pl-9 text-sm cursor-not-allowed ${
                          touched.email && errors.email ? "border-red-500" : "border-gray-300"
                        }`}
                        value={form.email}
                        onChange={handleChange}
                        onBlur={() => handleBlur("email")}
                        readOnly
                      />
                    </div>
                    {touched.email && errors.email && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <XCircle size={12} />
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Address Selector - Desktop */}
                <div className="space-y-4 border-t pt-4">
                  <h3 className="text-base font-semibold">Address Information</h3>
                  <AddressSelector
                    province={form.province}
                    municipality={form.municipality}
                    barangay={form.barangay}
                    onProvinceChange={(value) =>
                      setForm({ ...form, province: value, municipality: "", barangay: "" })
                    }
                    onMunicipalityChange={(value) =>
                      setForm({ ...form, municipality: value, barangay: "" })
                    }
                    onBarangayChange={(value) => 
                      setForm({ ...form, barangay: value })
                    }
                    required={true}
                    layout="grid"
                  />
                </div>

                {/* Course & Year Level - Desktop */}
                <div className="grid grid-cols-2 gap-4">
                <div> 
                <label className="mb-1.5 block text-sm font-medium">
                  Course:
                </label>
                <Select value={form.course}
                  onValueChange={(value) =>
                    setForm({ ...form, course: value })
                  }
                  required>
                  <SelectTrigger className="h-9 w-full border border-gray-300 bg-white text-sm">
                    <SelectValue placeholder="Select Course" />
                  </SelectTrigger>
                  <SelectContent className="text-sm">
                    <SelectItem value="BEED">BEED</SelectItem>
                    <SelectItem value="BSIT">BSIT</SelectItem>
                    <SelectItem value="BTLED">BTLED</SelectItem>
                    <SelectItem value="BSABE">BSABE</SelectItem>
                    <SelectItem value="BSCRIM">BSCRIM</SelectItem>
                    <SelectItem value="BAT">BSA</SelectItem>
                    <SelectItem value="BAT">BAT</SelectItem>
                    <SelectItem value="BAT">BSF</SelectItem>
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
                  required
                >
                  <SelectTrigger className="w-full bg-white">
                    <div className="flex items-center gap-2">
                      <School className="h-4 w-4 text-muted-foreground" />
                      <SelectValue placeholder="Select Year Level" />
                    </div>
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="1">
                      1
                    </SelectItem>

                    <SelectItem value="2">
                      2
                    </SelectItem>

                    <SelectItem value="3">
                      3
                    </SelectItem>

                    <SelectItem value="4">
                      4
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
                </div>

                {/* Password - Desktop */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Password: <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className={`h-10 border bg-white pl-9 pr-10 text-sm ${
                        touched.password && errors.password ? "border-red-500" : "border-gray-300"
                      }`}
                      value={form.password}
                      onChange={handleChange}
                      onBlur={() => handleBlur("password")}
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

                  {/* Password strength indicator - Desktop */}
                  {passwordValidation && form.password && (
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
                      <div className="text-xs space-y-1 bg-gray-50 p-2.5 rounded border">
                        <p className="font-semibold text-gray-700 mb-1.5">Password must contain:</p>
                        <div className={`flex items-center gap-1.5 ${passwordValidation.rules.hasMinLength ? "text-green-700" : "text-gray-500"}`}>
                          {passwordValidation.rules.hasMinLength ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                          <span>At least 8 characters</span>
                        </div>
                        <div className={`flex items-center gap-1.5 ${passwordValidation.rules.hasUppercase ? "text-green-700" : "text-gray-500"}`}>
                          {passwordValidation.rules.hasUppercase ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                          <span>One uppercase letter (A-Z)</span>
                        </div>
                        <div className={`flex items-center gap-1.5 ${passwordValidation.rules.hasLowercase ? "text-green-700" : "text-gray-500"}`}>
                          {passwordValidation.rules.hasLowercase ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                          <span>One lowercase letter (a-z)</span>
                        </div>
                        <div className={`flex items-center gap-1.5 ${passwordValidation.rules.hasNumber ? "text-green-700" : "text-gray-500"}`}>
                          {passwordValidation.rules.hasNumber ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                          <span>One number (0-9)</span>
                        </div>
                        <div className={`flex items-center gap-1.5 ${passwordValidation.rules.hasSpecialChar ? "text-green-700" : "text-gray-500"}`}>
                          {passwordValidation.rules.hasSpecialChar ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                          <span>One special character (!@#$%^&*...)</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {touched.password && errors.password && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <XCircle size={12} />
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password - Desktop */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Confirm Password: <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className={`h-10 border bg-white pl-9 pr-10 text-sm ${
                        touched.confirmPassword && errors.confirmPassword 
                          ? "border-red-500" 
                          : passwordsMatch 
                          ? "border-green-500" 
                          : "border-gray-300"
                      }`}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword) {
                          setErrors({ ...errors, confirmPassword: null });
                        }
                      }}
                      onBlur={() => handleBlur("confirmPassword")}
                    />

                    <div className="absolute right-3 top-3 flex items-center gap-1">
                      {passwordsMatch && (
                        <CheckCircle2 size={16} className="text-green-700" />
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </div>

                  {passwordsMatch && (
                    <p className="text-xs text-green-700 mt-1 flex items-center gap-1">
                      <CheckCircle2 size={12} />
                      Passwords match
                    </p>
                  )}
                  {touched.confirmPassword && errors.confirmPassword && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <XCircle size={12} />
                      {errors.confirmPassword}
                    </p>
                  )}
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