/**
 * Philippine Address API Integration
 * Uses PSGC (Philippine Standard Geographic Code) data
 * 
 * This provides complete barangay data for ALL municipalities in the Philippines
 */

// Free Philippine Locations API
const API_BASE_URL = "https://psgc.gitlab.io/api";

/**
 * Fetch all provinces
 * @returns {Promise<Array>} List of provinces
 */
export const fetchProvinces = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/provinces/`);
    const data = await response.json();
    
    // Filter to Region VIII (Eastern Visayas) provinces
    const region8Provinces = [
      "Leyte",
      "Southern Leyte", 
      "Eastern Samar",
      "Northern Samar",
      "Samar",
      "Biliran"
    ];
    
    return data
      .filter(province => region8Provinces.some(name => province.name.includes(name)))
      .map(province => ({
        value: province.name,
        label: province.name,
        code: province.code
      }));
  } catch (error) {
    console.error("Error fetching provinces:", error);
    return [];
  }
};

/**
 * Fetch municipalities for a province
 * @param {string} provinceCode - PSGC code of the province
 * @returns {Promise<Array>} List of municipalities
 */
export const fetchMunicipalities = async (provinceCode) => {
  try {
    const response = await fetch(`${API_BASE_URL}/provinces/${provinceCode}/cities-municipalities/`);
    const data = await response.json();
    
    return data.map(muni => ({
      value: muni.name,
      label: muni.name,
      code: muni.code
    }));
  } catch (error) {
    console.error("Error fetching municipalities:", error);
    return [];
  }
};

/**
 * Fetch barangays for a municipality
 * @param {string} municipalityCode - PSGC code of the municipality
 * @returns {Promise<Array>} List of barangays
 */
export const fetchBarangays = async (municipalityCode) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cities-municipalities/${municipalityCode}/barangays/`);
    const data = await response.json();
    
    return data.map(brgy => ({
      value: brgy.name,
      label: brgy.name,
      code: brgy.code
    }));
  } catch (error) {
    console.error("Error fetching barangays:", error);
    return [];
  }
};

/**
 * Alternative API - PH Locations (Backup)
 */
const PH_API_BASE = "https://ph-locations-api.buonzz.com/v1";

export const fetchBarangaysAlternative = async (municipalityName) => {
  try {
    const response = await fetch(`${PH_API_BASE}/barangays?municipality=${encodeURIComponent(municipalityName)}`);
    const data = await response.json();
    
    return data.data.map(brgy => ({
      value: brgy.name,
      label: brgy.name
    }));
  } catch (error) {
    console.error("Error fetching barangays (alternative):", error);
    return [];
  }
};

export default {
  fetchProvinces,
  fetchMunicipalities,
  fetchBarangays,
  fetchBarangaysAlternative
};
