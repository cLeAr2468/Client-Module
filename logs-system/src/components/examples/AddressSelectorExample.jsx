/**
 * ADDRESS SELECTOR EXAMPLE
 * 
 * This file demonstrates how to use the AddressSelector component
 * in your forms (register, edit profile, etc.)
 */

import { useState } from "react";
import AddressSelector from "@/components/common/AddressSelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AddressSelectorExample() {
  const [form, setForm] = useState({
    province: "",
    municipality: "",
    barangay: "",
  });

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data:", form);
    alert(`
      Province: ${form.province}
      Municipality: ${form.municipality}
      Barangay: ${form.barangay}
    `);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Address Selector Example</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Address Selector Component */}
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
              onBarangayChange={(value) => setForm({ ...form, barangay: value })}
              required={true}
              layout="grid" // or "stacked"
            />

            {/* Display Selected Values */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Selected Address:</h3>
              <p className="text-sm">Province: {form.province || "Not selected"}</p>
              <p className="text-sm">Municipality: {form.municipality || "Not selected"}</p>
              <p className="text-sm">Barangay: {form.barangay || "Not selected"}</p>
            </div>

            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Usage Instructions */}
      <div className="mt-8 p-6 bg-blue-50 rounded-lg">
        <h2 className="text-lg font-bold mb-4">How to Use in Your Forms:</h2>
        
        <h3 className="font-semibold mt-4 mb-2">1. Import the component:</h3>
        <pre className="bg-gray-800 text-white p-3 rounded text-sm overflow-x-auto">
{`import AddressSelector from "@/components/common/AddressSelector";`}
        </pre>

        <h3 className="font-semibold mt-4 mb-2">2. Add state variables:</h3>
        <pre className="bg-gray-800 text-white p-3 rounded text-sm overflow-x-auto">
{`const [form, setForm] = useState({
  province: "",
  municipality: "",
  barangay: "",
  // ... other fields
});`}
        </pre>

        <h3 className="font-semibold mt-4 mb-2">3. Use the component:</h3>
        <pre className="bg-gray-800 text-white p-3 rounded text-sm overflow-x-auto">
{`<AddressSelector
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
  disabled={false}
  layout="grid" // or "stacked"
/>`}
        </pre>

        <h3 className="font-semibold mt-4 mb-2">Props:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li><strong>province</strong>: Current province value</li>
          <li><strong>municipality</strong>: Current municipality value</li>
          <li><strong>barangay</strong>: Current barangay value</li>
          <li><strong>onProvinceChange</strong>: Callback when province changes (reset municipality & barangay)</li>
          <li><strong>onMunicipalityChange</strong>: Callback when municipality changes (reset barangay)</li>
          <li><strong>onBarangayChange</strong>: Callback when barangay changes</li>
          <li><strong>required</strong>: (Optional) Boolean - Shows red asterisk</li>
          <li><strong>disabled</strong>: (Optional) Boolean - Disables all fields</li>
          <li><strong>layout</strong>: (Optional) "grid" (2 columns) or "stacked" (single column)</li>
        </ul>

        <h3 className="font-semibold mt-4 mb-2">Features:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>✅ Cascading dropdowns: Province → Municipality → Barangay</li>
          <li>✅ Auto-resets dependent fields when parent changes</li>
          <li>✅ Includes Leyte, Southern Leyte, Eastern Samar, Northern Samar, Western Samar, Biliran</li>
          <li>✅ Falls back to text input for municipalities without barangay data</li>
          <li>✅ Responsive grid or stacked layout</li>
          <li>✅ Disabled state when no data available</li>
        </ul>
      </div>
    </div>
  );
}
