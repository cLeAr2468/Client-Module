import { useState, useEffect } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Pencil, Loader2, XCircle } from "lucide-react";
import { updateProfile } from "@/api/profileApi";
import { toast } from "sonner";
import AddressSelector from "@/components/common/AddressSelector";
import { validateTextInput, autoCapitalize } from "@/utils/validation";

export default function EditProfileDialog({
  user,
  fullWidth = false,
  onSave,
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    // Initialize form with user data and ensure all address fields are set
    setForm({
      ...user,
      region: user.region || '',
      province: user.province || '',
      municipality: user.municipality || '',
      barangay: user.barangay || '',
      status: user.status || 'Active', // Ensure status has a default value
    });
  }, [user]);

  const initials = `${form.firstname?.charAt(0) ?? ""}${
    form.lastname?.charAt(0) ?? ""
  }`.toUpperCase();

  function handleChange(e) {
    const { name, value } = e.target;

    let processedValue = value;

    // Apply auto-capitalization to name fields
    if (["firstname", "middlename", "lastname"].includes(name)) {
      processedValue = autoCapitalize(value);
    }

    setForm((prev) => ({
      ...prev,
      [name]: processedValue,
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  }

  function handleBlur(field) {
    setTouched({ ...touched, [field]: true });
    validateField(field);
  }

  function validateField(field) {
    let fieldError = null;

    switch (field) {
      case "firstname":
      case "lastname":
        const validation = validateTextInput(form[field], {
          minLength: 2,
          maxLength: 50,
          allowSpecialChars: false,
          required: true,
        });
        if (!validation.isValid) {
          fieldError = validation.error;
        }
        break;

      case "middlename":
        if (form[field]) {
          const validation = validateTextInput(form[field], {
            minLength: 1,
            maxLength: 50,
            allowSpecialChars: false,
            required: false,
          });
          if (!validation.isValid) {
            fieldError = validation.error;
          }
        }
        break;

      case "email":
        if (!form[field] || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form[field])) {
          fieldError = "Please enter a valid email address";
        }
        break;
    }

    if (fieldError) {
      setErrors({ ...errors, [field]: fieldError });
    }

    return !fieldError;
  }

  async function handleSave() {
    // Validate all required fields
    const fieldsToValidate = ["firstname", "lastname", "email"];
    let isValid = true;

    fieldsToValidate.forEach((field) => {
      if (!validateField(field)) {
        isValid = false;
      }
    });

    // Validate course and year level
    if (!form.course) {
      toast.error("Please select a course");
      isValid = false;
    }
    if (!form.year) {
      toast.error("Please select a year level");
      isValid = false;
    }

    // Mark all fields as touched
    setTouched({
      firstname: true,
      lastname: true,
      middlename: true,
      email: true,
    });

    if (!isValid) {
      toast.error("Please fix all validation errors before saving");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Send all data - backend will update both users and masterlist tables
      const updateData = {
        // Masterlist fields (will update masterlist table)
        firstname: form.firstname,
        middlename: form.middlename || "",
        lastname: form.lastname,
        email: form.email,
        course: form.course,
        year: form.year,
        // User fields (will update users table)
        region: form.region || "",
        province: form.province || "",
        municipality: form.municipality || "",
        barangay: form.barangay || "",
        purok: form.purok || "",
        suffix: form.suffix || "",
      };

      // Call the API to update profile
      const response = await updateProfile(updateData);

      // Update local state with the response
      if (onSave) {
        onSave(response.user);
      }

      toast.success("Profile updated successfully!");
      setOpen(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      const errorMessage = error.message || "Failed to update profile";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={fullWidth ? "w-full mt-5" : "w-full mt-6"}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>

          <DialogDescription>
            Update your account information.
          </DialogDescription>
        </DialogHeader>
        {/* Form */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label>Student ID</Label>

            <Input
              name="student_id"
              value={form.student_id}
              onChange={handleChange}
              readOnly
              className="bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <Label>Email <span className="text-red-500">*</span></Label>

            <Input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              onBlur={() => handleBlur("email")}
              className={touched.email && errors.email ? "border-red-500" : ""}
            />
            {touched.email && errors.email && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <XCircle size={12} />
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>First Name <span className="text-red-500">*</span></Label>

            <Input
              name="firstname"
              value={form.firstname}
              onChange={handleChange}
              onBlur={() => handleBlur("firstname")}
              className={touched.firstname && errors.firstname ? "border-red-500" : ""}
            />
            {touched.firstname && errors.firstname && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <XCircle size={12} />
                {errors.firstname}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Middle Name</Label>

            <Input
              name="middlename"
              placeholder="Middle Name"
              value={form.middlename || ""}
              onChange={handleChange}
              onBlur={() => handleBlur("middlename")}
              className={touched.middlename && errors.middlename ? "border-red-500" : ""}
            />
            {touched.middlename && errors.middlename && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <XCircle size={12} />
                {errors.middlename}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Last Name <span className="text-red-500">*</span></Label>

            <Input
              name="lastname"
              value={form.lastname}
              onChange={handleChange}
              onBlur={() => handleBlur("lastname")}
              className={touched.lastname && errors.lastname ? "border-red-500" : ""}
            />
            {touched.lastname && errors.lastname && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <XCircle size={12} />
                {errors.lastname}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Suffix</Label>

            <Select
              value={form.suffix || ""}
              onValueChange={(value) =>
                setForm({
                  ...form,
                  suffix: value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="None" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="">None</SelectItem>
                <SelectItem value="Jr.">Jr.</SelectItem>
                <SelectItem value="Sr.">Sr.</SelectItem>
                <SelectItem value="II">II</SelectItem>
                <SelectItem value="III">III</SelectItem>
                <SelectItem value="IV">IV</SelectItem>
                <SelectItem value="V">V</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>

            <Select
              value={form.status || ""}
              onValueChange={(value) =>
                setForm({
                  ...form,
                  status: value,
                })
              }
              disabled
            >
              <SelectTrigger className="bg-gray-100 cursor-not-allowed">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="Active">
                  Active
                </SelectItem>

                <SelectItem value="Inactive">
                  Inactive
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Course */}

          <div className="space-y-2">
            <Label>Course <span className="text-red-500">*</span></Label>

            <Select
              value={form.course}
              onValueChange={(value) =>
                setForm({
                  ...form,
                  course: value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Course" />
              </SelectTrigger>
                  <SelectContent className="text-sm">
                    <SelectItem value="BEED">BEED</SelectItem>
                    <SelectItem value="BSIT">BSIT</SelectItem>
                    <SelectItem value="BTLED">BTLED</SelectItem>
                    <SelectItem value="BSABE">BSABE</SelectItem>
                    <SelectItem value="BSCRIM">BSCRIM</SelectItem>
                    <SelectItem value="BSA">BSA</SelectItem>
                    <SelectItem value="BAT">BAT</SelectItem>
                    <SelectItem value="BSF">BSF</SelectItem>
                  </SelectContent>
            </Select>
          </div>

          {/* Year */}

          <div className="space-y-2">
            <Label>Year Level <span className="text-red-500">*</span></Label>

            <Select
              value={form.year}
              onValueChange={(value) =>
                setForm({
                  ...form,
                  year: value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Year" />
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

          {/* Address Section */}
          <div className="md:col-span-2 space-y-4 border-t pt-4 mt-4">
            <h3 className="text-base font-semibold">Address Information</h3>
            
            {/* Region Selector */}
            <div className="space-y-2">
              <Label>Region</Label>
              <Select
                value={form.region || ""}
                onValueChange={(value) =>
                  setForm({ ...form, region: value, province: "", municipality: "", barangay: "" })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Region I - Ilocos Region">Region I - Ilocos Region</SelectItem>
                  <SelectItem value="Region II - Cagayan Valley">Region II - Cagayan Valley</SelectItem>
                  <SelectItem value="Region III - Central Luzon">Region III - Central Luzon</SelectItem>
                  <SelectItem value="Region IV-A - CALABARZON">Region IV-A - CALABARZON</SelectItem>
                  <SelectItem value="Region IV-B - MIMAROPA">Region IV-B - MIMAROPA</SelectItem>
                  <SelectItem value="Region V - Bicol Region">Region V - Bicol Region</SelectItem>
                  <SelectItem value="Region VI - Western Visayas">Region VI - Western Visayas</SelectItem>
                  <SelectItem value="Region VII - Central Visayas">Region VII - Central Visayas</SelectItem>
                  <SelectItem value="Region VIII - Eastern Visayas">Region VIII - Eastern Visayas</SelectItem>
                  <SelectItem value="Region IX - Zamboanga Peninsula">Region IX - Zamboanga Peninsula</SelectItem>
                  <SelectItem value="Region X - Northern Mindanao">Region X - Northern Mindanao</SelectItem>
                  <SelectItem value="Region XI - Davao Region">Region XI - Davao Region</SelectItem>
                  <SelectItem value="Region XII - SOCCSKSARGEN">Region XII - SOCCSKSARGEN</SelectItem>
                  <SelectItem value="Region XIII - Caraga">Region XIII - Caraga</SelectItem>
                  <SelectItem value="NCR - National Capital Region">NCR - National Capital Region</SelectItem>
                  <SelectItem value="CAR - Cordillera Administrative Region">CAR - Cordillera Administrative Region</SelectItem>
                  <SelectItem value="BARMM - Bangsamoro Autonomous Region in Muslim Mindanao">BARMM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <AddressSelector
              province={form.province || ""}
              municipality={form.municipality || ""}
              barangay={form.barangay || ""}
              onProvinceChange={(value) =>
                setForm({ ...form, province: value, municipality: "", barangay: "" })
              }
              onMunicipalityChange={(value) =>
                setForm({ ...form, municipality: value, barangay: "" })
              }
              onBarangayChange={(value) => 
                setForm({ ...form, barangay: value })
              }
              required={false}
              layout="grid"
            />
            
            {/* Purok Field */}
            <div className="space-y-2">
              <Label>Purok/Street (Optional)</Label>
              <Input
                name="purok"
                placeholder="Enter Purok or Street"
                value={form.purok || ""}
                onChange={handleChange}
              />
            </div>
          </div>

        </div>

        <DialogFooter className="mt-8">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button onClick={handleSave} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}