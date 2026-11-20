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
import { getProvinces, getCities, getBarangays } from "ph-addresses-locations";

/**
 * Clean display text - remove special characters for clean display
 * @param {string} text - Text to clean
 * @returns {string} Cleaned text
 */
const cleanDisplayText = (text) => {
  if (!text) return "";
  // Remove unnecessary special characters, keep only letters, numbers, spaces, hyphens, periods, and parentheses
  return text.replace(/[^\w\s\-().]/gi, "").trim();
};

/**
 * AddressSelector Component
 * Uses complete Philippine address data from ph-addresses-locations package
 * Displays clean address names without special characters
 * Includes ALL provinces, municipalities, and barangays in the Philippines
 * All dropdowns are sorted alphabetically (A to Z)
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
  const [provinces, setProvinces] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [barangays, setBarangays] = useState([]);
  const [selectedProvinceCode, setSelectedProvinceCode] = useState(null);
  const [selectedMunicipalityCode, setSelectedMunicipalityCode] = useState(null);

  // Load all provinces on mount (sorted alphabetically)
  useEffect(() => {
    try {
      const allProvinces = getProvinces();
      // Convert to our format with clean display names
      let formattedProvinces = allProvinces.map(prov => ({
        code: prov.code,
        value: cleanDisplayText(prov.name),
        label: cleanDisplayText(prov.name)
      }));
      
      // If province is already set but not found in the list, add it as a custom entry
      if (province && !formattedProvinces.find(p => p.value === province)) {
        console.log('AddressSelector: Province not in standard list, adding as custom entry:', province);
        formattedProvinces.push({
          code: 'custom',
          value: province,
          label: `${province} (Saved)`
        });
      }
      
      // Sort alphabetically by label
      const sortedProvinces = formattedProvinces.sort((a, b) => 
        a.label.localeCompare(b.label)
      );
      setProvinces(sortedProvinces);

      // If province is already set (edit mode), immediately load municipalities
      if (province && sortedProvinces.length > 0) {
        const provinceObj = sortedProvinces.find(p => p.value === province);
        if (provinceObj) {
          setSelectedProvinceCode(provinceObj.code);
        }
      }
    } catch (error) {
      console.error("Error loading provinces:", error);
      setProvinces([]);
    }
  }, [province]);

  // Load municipalities when province changes (sorted alphabetically)
  useEffect(() => {
    console.log('AddressSelector: Province changed to:', province, 'Provinces loaded:', provinces.length);
    
    if (province && provinces.length > 0) {
      try {
        // Find province code by name
        const provinceObj = provinces.find(p => p.value === province);
        console.log('AddressSelector: Found province object:', provinceObj);
        
        if (provinceObj) {
          setSelectedProvinceCode(provinceObj.code);
          const cities = getCities(provinceObj.code);
          // Convert to our format with clean display names
          let formattedMunicipalities = cities.map(city => ({
            code: city.code,
            value: cleanDisplayText(city.name),
            label: cleanDisplayText(city.name)
          }));
          
          // If municipality is already set but not found in the list, add it as a custom entry
          if (municipality && !formattedMunicipalities.find(m => m.value === municipality)) {
            console.log('AddressSelector: Municipality not in standard list, adding as custom entry');
            formattedMunicipalities.push({
              code: 'custom',
              value: municipality,
              label: `${municipality} (Saved)`
            });
          }
          
          // Sort alphabetically by label
          const sortedMunicipalities = formattedMunicipalities.sort((a, b) => 
            a.label.localeCompare(b.label)
          );
          console.log('AddressSelector: Loaded municipalities:', sortedMunicipalities.length);
          setMunicipalities(sortedMunicipalities);
          
          // If municipality is already set (edit mode), immediately set municipality code
          if (municipality) {
            console.log('AddressSelector: Looking for municipality:', municipality);
            const municipalityObj = sortedMunicipalities.find(m => m.value === municipality);
            console.log('AddressSelector: Found municipality object:', municipalityObj);
            
            if (municipalityObj) {
              setSelectedMunicipalityCode(municipalityObj.code);
            }
          }
        }
      } catch (error) {
        console.error("Error loading municipalities:", error);
        setMunicipalities([]);
      }
    } else {
      // Only clear if province is explicitly empty (not just unmatched)
      if (!province) {
        setMunicipalities([]);
        setBarangays([]);
        setSelectedProvinceCode(null);
        setSelectedMunicipalityCode(null);
        onMunicipalityChange("");
        onBarangayChange("");
      }
    }
  }, [province, provinces, municipality]);

  // Load barangays when municipality changes (sorted alphabetically)
  useEffect(() => {
    if (municipality && municipalities.length > 0) {
      try {
        // Find municipality code by name
        const municipalityObj = municipalities.find(m => m.value === municipality);
        if (municipalityObj && municipalityObj.code !== 'custom') {
          setSelectedMunicipalityCode(municipalityObj.code);
          const brgyList = getBarangays(municipalityObj.code);
          // Convert to our format with clean display names
          let formattedBarangays = brgyList.map(brgy => ({
            code: brgy.code,
            value: cleanDisplayText(brgy.name),
            label: cleanDisplayText(brgy.name)
          }));
          
          // If barangay is already set but not found in the list, add it as a custom entry
          if (barangay && !formattedBarangays.find(b => b.value === barangay)) {
            console.log('AddressSelector: Barangay not in standard list, adding as custom entry');
            formattedBarangays.push({
              code: 'custom',
              value: barangay,
              label: `${barangay} (Saved)`
            });
          }
          
          // Sort alphabetically by label
          const sortedBarangays = formattedBarangays.sort((a, b) => 
            a.label.localeCompare(b.label)
          );
          setBarangays(sortedBarangays);
        } else if (municipalityObj && municipalityObj.code === 'custom') {
          // If municipality is custom, we can't load barangays from API
          // But if barangay exists, show it as a custom entry
          if (barangay) {
            setBarangays([{
              code: 'custom',
              value: barangay,
              label: `${barangay} (Saved)`
            }]);
          } else {
            setBarangays([]);
          }
        }
      } catch (error) {
        console.error("Error loading barangays:", error);
        setBarangays([]);
      }
    } else {
      // Only clear if municipality is explicitly empty
      if (!municipality) {
        setBarangays([]);
        setSelectedMunicipalityCode(null);
        onBarangayChange("");
      }
    }
  }, [municipality, municipalities, barangay]);

  const containerClass = layout === "grid" 
    ? "grid grid-cols-1 md:grid-cols-2 gap-4" 
    : "space-y-4";

  return (
    <div className={containerClass}>
      <div className="space-y-2">
        <Label>
          Province {required && <span className="text-red-500">*</span>}
        </Label>
        <Select value={province} onValueChange={onProvinceChange} disabled={disabled} required={required}>
          <SelectTrigger className={disabled ? "bg-gray-100 cursor-not-allowed" : ""}>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Select Province" />
            </div>
          </SelectTrigger>
          <SelectContent position="popper" side="bottom" align="start" className="max-h-[300px] overflow-y-auto">
            {provinces.map((prov) => (
              <SelectItem key={prov.value} value={prov.value}>
                {cleanDisplayText(prov.label)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>
          City/Municipality {required && <span className="text-red-500">*</span>}
        </Label>
        <Select value={municipality} onValueChange={onMunicipalityChange} disabled={disabled || !province} required={required}>
          <SelectTrigger className={disabled || !province ? "bg-gray-100 cursor-not-allowed" : ""}>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder={!province ? "Select Province first" : "Select Municipality"} />
            </div>
          </SelectTrigger>
          <SelectContent position="popper" side="bottom" align="start" className="max-h-[300px] overflow-y-auto">
            {municipalities.map((muni) => (
              <SelectItem key={muni.value} value={muni.value}>
                {cleanDisplayText(muni.label)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className={`space-y-2 ${layout === "grid" ? "md:col-span-2" : ""}`}>
        <Label>
          Barangay {required && <span className="text-red-500">*</span>}
        </Label>
        <Select value={barangay} onValueChange={onBarangayChange} disabled={disabled || !municipality} required={required}>
          <SelectTrigger className={disabled || !municipality ? "bg-gray-100 cursor-not-allowed" : ""}>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder={!municipality ? "Select Municipality first" : "Select Barangay"} />
            </div>
          </SelectTrigger>
          <SelectContent position="popper" side="bottom" align="start" className="max-h-[300px] overflow-y-auto">
            {barangays.length > 0 ? (
              barangays.map((brgy, index) => (
                <SelectItem key={`${brgy.value}-${index}`} value={brgy.value}>
                  {brgy.label}
                </SelectItem>
              ))
            ) : (
              <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                No barangays available for this municipality
              </div>
            )}
          </SelectContent>
        </Select>
        {!municipality && <p className="text-xs text-muted-foreground">Please select a municipality first</p>}
        {municipality && barangays.length === 0 && (
          <p className="text-xs text-amber-600">No barangay data available for {municipality}</p>
        )}
      </div>
    </div>
  );
}
