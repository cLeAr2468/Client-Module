/**
 * Script to download complete Philippine barangay data
 * Run: node scripts/downloadBarangayData.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// PSGC API endpoint
const API_BASE = 'https://psgc.gitlab.io/api';

async function fetchJSON(url) {
  const response = await fetch(url);
  return response.json();
}

async function downloadCompleteData() {
  console.log('Starting download of complete Philippine address data...\n');

  try {
    const completeData = {};

    // Fetch all provinces
    console.log('Fetching provinces...');
    const provinces = await fetchJSON(`${API_BASE}/provinces/`);
    
    for (const province of provinces) {
      // Filter to Region VIII only
      if (!province.name.includes('Leyte') && 
          !province.name.includes('Samar') && 
          !province.name.includes('Biliran')) {
        continue;
      }

      console.log(`\nProcessing ${province.name}...`);
      completeData[province.name] = {};

      // Fetch municipalities
      const municipalities = await fetchJSON(`${API_BASE}/provinces/${province.code}/cities-municipalities/`);
      
      for (const municipality of municipalities) {
        console.log(`  - ${municipality.name}`);
        
        try {
          // Fetch barangays
          const barangays = await fetchJSON(`${API_BASE}/cities-municipalities/${municipality.code}/barangays/`);
          
          completeData[province.name][municipality.name] = barangays.map(b => ({
            value: b.name,
            label: b.name
          }));
          
          console.log(`    ✓ ${barangays.length} barangays`);
        } catch (error) {
          console.log(`    ✗ Failed to fetch barangays`);
          completeData[province.name][municipality.name] = [];
        }
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    // Save to file
    const outputPath = path.join(__dirname, '..', 'src', 'data', 'philippine-barangays.json');
    const outputDir = path.dirname(outputPath);
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, JSON.stringify(completeData, null, 2));
    
    console.log(`\n✅ Complete data saved to: ${outputPath}`);
    console.log(`Total provinces: ${Object.keys(completeData).length}`);
    
    let totalMunicipalities = 0;
    let totalBarangays = 0;
    
    for (const province in completeData) {
      const munCount = Object.keys(completeData[province]).length;
      totalMunicipalities += munCount;
      
      for (const municipality in completeData[province]) {
        totalBarangays += completeData[province][municipality].length;
      }
    }
    
    console.log(`Total municipalities: ${totalMunicipalities}`);
    console.log(`Total barangays: ${totalBarangays}`);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

downloadCompleteData();
