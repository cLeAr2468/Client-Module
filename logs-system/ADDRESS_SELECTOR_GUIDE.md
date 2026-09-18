# Philippine Address Selector - Implementation Guide

## Overview
Cascading dropdown system para sa Philippine addresses: **Province → Municipality → Barangay**

Kapag nag-select ng Leyte sa Province, lalabas lang yung municipalities sa Leyte.  
Kapag nag-select ng municipality (e.g., San Jorge), lalabas lang yung barangays sa San Jorge.

---

## Files Created

1. **`src/utils/philippineAddresses.js`**  
   - Contains all address data (provinces, municipalities, barangays)
   - Helper functions para kumuha ng filtered data

2. **`src/components/common/AddressSelector.jsx`**  
   - Reusable component na may cascading dropdowns
   - Pwede gamitin sa register, edit profile, at iba pang forms

3. **`src/components/examples/AddressSelectorExample.jsx`**  
   - Example kung paano gamitin yung component
   - May complete documentation

---

## Quick Start

### 1. Import the Component

```jsx
import AddressSelector from "@/components/common/AddressSelector";
```

### 2. Add State Variables

```jsx
const [form, setForm] = useState({
  province: "",
  municipality: "",
  barangay: "",
  // ... other fields
});
```

### 3. Use the Component

```jsx
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
```

---

## Integration sa Register.jsx

### BEFORE (Old Code):
```jsx
<div>
  <label>Barangay:</label>
  <Input
    id="barangay"
    value={form.barangay}
    onChange={handleChange}
  />
</div>
<div>
  <label>Municipality:</label>
  <Input
    id="municipality"
    value={form.municipality}
    onChange={handleChange}
  />
</div>
<div>
  <label>Province:</label>
  <Input
    id="province"
    value={form.province}
    onChange={handleChange}
  />
</div>
```

### AFTER (New Code):
```jsx
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
```

---

## Integration sa Edit Profile Modal

```jsx
import AddressSelector from "@/components/common/AddressSelector";

export default function EditProfileDialog({ user, onSave }) {
  const [form, setForm] = useState(user);

  return (
    <DialogContent>
      {/* ... other fields ... */}
      
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
        layout="stacked"
      />
      
      {/* ... submit button ... */}
    </DialogContent>
  );
}
```

---

## Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `province` | string | ✅ | Current province value |
| `municipality` | string | ✅ | Current municipality value |
| `barangay` | string | ✅ | Current barangay value |
| `onProvinceChange` | function | ✅ | Called when province changes |
| `onMunicipalityChange` | function | ✅ | Called when municipality changes |
| `onBarangayChange` | function | ✅ | Called when barangay changes |
| `required` | boolean | ❌ | Shows red asterisk (default: false) |
| `disabled` | boolean | ❌ | Disables all fields (default: false) |
| `layout` | string | ❌ | "grid" or "stacked" (default: "grid") |

---

## Features

✅ **Cascading Dropdowns** - Municipality depends on Province, Barangay depends on Municipality  
✅ **Auto-Reset** - Changes sa province/municipality automatically clears dependent fields  
✅ **Region VIII Coverage** - Leyte, Southern Leyte, Eastern Samar, Northern Samar, Western Samar, Biliran  
✅ **Fallback Input** - Text input para sa municipalities without barangay data  
✅ **Responsive Layout** - Grid (2 columns) or Stacked (single column)  
✅ **Validation Support** - Required fields with asterisk indicator  
✅ **Disabled States** - Shows "Select Province first" kung walang selected province  

---

## Data Coverage

### Provinces:
- Leyte (43 municipalities)
- Southern Leyte (19 municipalities)
- Eastern Samar (23 municipalities)
- Northern Samar (24 municipalities)
- Samar/Western Samar (26 municipalities)
- Biliran (8 municipalities)

### Barangay Data Available:
- Tacloban City (20 barangays)
- Ormoc City (20 barangays)
- Baybay City (20 barangays)
- San Jorge (20 barangays)
- Albuera (12 barangays)
- Maasin City (18 barangays)
- Sogod (15 barangays)

**Note:** For municipalities without barangay data, the component automatically shows a text input field.

---

## Adding More Data

To add more barangays, edit `src/utils/philippineAddresses.js`:

```javascript
export const barangays = {
  // Add your municipality
  "Your Municipality": [
    { value: "Barangay 1", label: "Barangay 1" },
    { value: "Barangay 2", label: "Barangay 2" },
    // ... more barangays
  ],
};
```

---

## Testing

To test the component, import the example page:

```jsx
import AddressSelectorExample from "@/components/examples/AddressSelectorExample";

// Use in your routes or test page
<AddressSelectorExample />
```

---

## Common Issues

### Issue: Barangay field is blank/disabled
**Solution:** Make sure province and municipality are selected first

### Issue: Can't see barangays for my municipality  
**Solution:** Check if barangay data exists in `philippineAddresses.js`. If not, the component will show a text input.

### Issue: Values not updating  
**Solution:** Make sure you're resetting dependent fields:
```jsx
onProvinceChange={(value) =>
  setForm({ ...form, province: value, municipality: "", barangay: "" })
}
```

---

## Support

Para sa questions or additional data, contact the development team.
