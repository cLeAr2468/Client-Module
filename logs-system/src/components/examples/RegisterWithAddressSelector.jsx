/**
 * COMPLETE EXAMPLE: Register Form with Address Selector
 * 
 * This shows how to integrate the AddressSelector into the register form
 * Copy the relevant parts to your actual register.jsx
 */

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import AddressSelector from "@/components/common/AddressSelector";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function RegisterWithAddressSelector() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [form, setForm] = useState({
    student_id: "",
    fname: "",
    mname: "",
    lname: "",
    email: "",
    province: "",
    municipality: "",
    barangay: "",
    course: "",
    year_level: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    if (!form.province || !form.municipality || !form.barangay) {
      toast.error("Please complete all address fields!");
      return;
    }

    if (form.password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters!");
      return;
    }

    setLoading(true);

    try {
      // Your API call here
      console.log("Form data:", form);
      
      toast.success("Registered successfully!");
      
      // Reset form
      setForm({
        student_id: "",
        fname: "",
        mname: "",
        lname: "",
        email: "",
        province: "",
        municipality: "",
        barangay: "",
        course: "",
        year_level: "",
        password: "",
      });
      setConfirmPassword("");
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
      <Card className="w-full max-w-3xl rounded-3xl">
        <CardContent className="p-8">
          <h2 className="mb-6 text-center text-2xl font-bold">
            Register with Address Selector
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Student ID */}
            <div>
              <Label>Student ID</Label>
              <Input
                id="student_id"
                placeholder="21-SJ-0001"
                value={form.student_id}
                onChange={handleChange}
                required
              />
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>First Name</Label>
                <Input
                  id="fname"
                  placeholder="First Name"
                  value={form.fname}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label>Middle Name (Optional)</Label>
                <Input
                  id="mname"
                  placeholder="Middle Name"
                  value={form.mname}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Last Name</Label>
                <Input
                  id="lname"
                  placeholder="Last Name"
                  value={form.lname}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    className="pl-9"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* ADDRESS SELECTOR - THIS IS THE KEY PART! */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-3">Address Information</h3>
              <AddressSelector
                province={form.province}
                municipality={form.municipality}
                barangay={form.barangay}
                onProvinceChange={(value) =>
                  setForm({ 
                    ...form, 
                    province: value, 
                    municipality: "", 
                    barangay: "" 
                  })
                }
                onMunicipalityChange={(value) =>
                  setForm({ 
                    ...form, 
                    municipality: value, 
                    barangay: "" 
                  })
                }
                onBarangayChange={(value) => 
                  setForm({ ...form, barangay: value })
                }
                required={true}
                layout="grid"
              />
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-9 pr-10"
                    value={form.password}
                    onChange={handleChange}
                    required
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

              <div>
                <Label>Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-9 pr-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
            </div>

            {/* Display Selected Address */}
            {(form.province || form.municipality || form.barangay) && (
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Complete Address:</h4>
                <p className="text-sm text-gray-700">
                  {form.barangay && `${form.barangay}, `}
                  {form.municipality && `${form.municipality}, `}
                  {form.province}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#15592F] hover:bg-[#124b28] text-white"
            >
              {loading ? "Registering..." : "Register Student"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
