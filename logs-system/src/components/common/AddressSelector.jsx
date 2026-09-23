import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";
import { 
  getProvinces, 
  getCities, 
  getBarangays 
} from 'ph-addresses-locations';

/**
 * Fix text encoding issues (like Ã± → ñ)
 * Common issues from UTF-8 to Latin-1 conversion
 */
const fixTextEncoding = (text) => {
  if (!text) return text;
  
  const fixes = {
    'Ã±': 'ñ',
    'Ã': 'Ñ',
    'Ã¡': 'á',
    'Ã©': 'é',
    'Ã­': 'í',
    'Ã³': 'ó',
    'Ãº': 'ú',
    'Ã': 'Á',
    'Ã': 'É',
    'Ã': 'Í',
    'Ã': 'Ó',
    'Ã': 'Ú',
    'Ã±': 'ñ',
    'Ã¼': 'ü',
    'Ã¤': 'ä',
    'Ã¶': 'ö',
  };
  
  let fixed = text;
  for (const [wrong, correct] of Object.entries(fixes)) {
    fixed = fixed.replace(new RegExp(wrong, 'g'), correct);
  }
  
  return fixed;
};

/**
 * AddressSelector Component
 * Uses complete PSGC data with ALL provinces, municipalities, and barangays
 * 
 * Features:
 * - All 82+ provinces
 * - All 1,634+ cities and municipalities
 * - All 42,000+ barangays
 * - Based on Philippine Standard Geographic Code (PSGC)
 * - Fixed text encoding for special characters
 */
export default function AddressSelector({
  province,
  municipality,
  barangay,
  onProvinceChange,
  onMunicipalityChange,
  onBarangayChange,
  required = false,
  disabled = false,
  layout = "grid",
}) {
  const [allProvinces, setAllProvinces] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [barangays, setBarangays] = useState([]);

  // Load all provinces on mount (sorted alphabetically)
  useEffect(() => {
    const provinces = getProvinces();
    // Fix encoding and sort provinces alphabetically by name
    const fixedProvinces = provinces.map(p => ({
      ...p,
      name: fixTextEncoding(p.name)
    }));
    const sortedProvinces = fixedProvinces.sort((a, b) => 
      a.name.localeCompare(b.name)
    );
    setAllProvinces(sortedProvinces);
  }, []);

  // Load municipalities when province changes (sorted alphabetically)
  useEffect(() => {
    if (province) {
      // Find province by name to get its code
      const selectedProvince = allProvinces.find(p => p.name === province);
      if (selectedProvince) {
        const cities = getCities(selectedProvince.code);
        // Fix encoding and sort municipalities alphabetically by name
        const fixedCities = cities.map(c => ({
          ...c,
          name: fixTextEncoding(c.name)
        }));
        const sortedCities = fixedCities.sort((a, b) => 
          a.name.localeCompare(b.name)
        );
        setMunicipalities(sortedCities);
      } else {
        setMunicipalities([]);
      }
      setBarangays([]);
    } else {
      setMunicipalities([]);
      setBarangays([]);
    }
  }, [province, allProvinces]);

  // Load barangays when municipality changes (sorted alphabetically)
  useEffect(() => {
    if (municipality) {
      // Find municipality by name to get its code
      const selectedMunicipality = municipalities.find(m => m.name === municipality);
      if (selectedMunicipality) {
        const brgyList = getBarangays(selectedMunicipality.code);
        // Fix encoding and sort barangays alphabetically by name
        const fixedBarangays = brgyList.map(b => ({
          ...b,
          name: fixTextEncoding(b.name)
        }));
        
        // Remove duplicates by name (keep first occurrence)
        const uniqueBarangays = fixedBarangays.reduce((acc, current) => {
          const exists = acc.find(item => item.name === current.name);
          if (!exists) {
            acc.push(current);
          }
          return acc;
        }, []);
        
        const sortedBarangays = uniqueBarangays.sort((a, b) => 
          a.name.localeCompare(b.name)
        );
        setBarangays(sortedBarangays);
      } else {
        setBarangays([]);
      }
    } else {
      setBarangays([]);
    }
  }, [municipality, municipalities]);

  const handleProvinceChange = (provinceName) => {
    onProvinceChange(provinceName);
    // Reset municipality and barangay
    onMunicipalityChange('');
    onBarangayChange('');
  };

  const handleMunicipalityChange = (municipalityName) => {
    onMunicipalityChange(municipalityName);
    // Reset barangay
    onBarangayChange('');
  };

  const handleBarangayChange = (barangayName) => {
    // Fix encoding before passing to parent
    const fixedName = fixTextEncoding(barangayName);
    onBarangayChange(fixedName);
  };

  const containerClass = layout === "grid" 
    ? "grid grid-cols-1 md:grid-cols-2 gap-4" 
    : "space-y-4";

  return (
    <div className={containerClass}>
      {/* Province Selector */}
      <div className="space-y-2">
        <Label>
          Province {required && <span className="text-red-500">*</span>}
        </Label>
        <Select 
          value={province || ""} 
          onValueChange={handleProvinceChange} 
          disabled={disabled}
        >
          <SelectTrigger className={disabled ? "bg-gray-100 cursor-not-allowed" : ""}>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Select Province" />
            </div>
          </SelectTrigger>
          <SelectContent position="popper" side="bottom" align="start" className="max-h-[300px] overflow-y-auto">
            {allProvinces.map((prov) => (
              <SelectItem key={prov.code} value={prov.name}>
                {prov.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Municipality/City Selector */}
      <div className="space-y-2">
        <Label>
          City/Municipality {required && <span className="text-red-500">*</span>}
        </Label>
        <Select 
          value={municipality || ""} 
          onValueChange={handleMunicipalityChange} 
          disabled={disabled || !province}
        >
          <SelectTrigger className={disabled || !province ? "bg-gray-100 cursor-not-allowed" : ""}>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder={
                !province 
                  ? "Select Province first" 
                  : "Select Municipality"
              } />
            </div>
          </SelectTrigger>
          <SelectContent position="popper" side="bottom" align="start" className="max-h-[300px] overflow-y-auto">
            {municipalities.map((muni) => (
              <SelectItem key={muni.code} value={muni.name}>
                {muni.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Barangay Selector */}
      <div className={`space-y-2 ${layout === "grid" ? "md:col-span-2" : ""}`}>
        <Label>
          Barangay {required && <span className="text-red-500">*</span>}
        </Label>
        <Select 
          value={barangay || ""} 
          onValueChange={handleBarangayChange} 
          disabled={disabled || !municipality}
        >
          <SelectTrigger className={disabled || !municipality ? "bg-gray-100 cursor-not-allowed" : ""}>
            <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
            <SelectValue placeholder={
              !municipality 
                ? "Select Municipality first" 
                : "Select Barangay"
            } />
          </SelectTrigger>
          <SelectContent position="popper" side="bottom" align="start" className="max-h-[300px] overflow-y-auto">
            {barangays.map((brgy) => (
              <SelectItem key={brgy.code} value={brgy.name}>
                {brgy.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {!municipality && (
          <p className="text-xs text-muted-foreground">
            Please select a municipality first
          </p>
        )}
        {municipality && barangays.length === 0 && (
          <p className="text-xs text-muted-foreground">
            Loading barangays...
          </p>
        )}
      </div>
    </div>
  );
}
