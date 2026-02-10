#!/usr/bin/env bun
/**
 * RTTNews FDA Calendar Web Scraper
 * 
 * Scrapes PDUFA and FDA review dates from https://www.rttnews.com/corpinfo/fdacalendar.aspx
 * Run on the 1st of each month to update data
 */

const BASE_URL = "https://www.rttnews.com/corpinfo/fdacalendar.aspx";

interface PdufaItem {
  id: string;
  company: string;
  ticker: string;
  drug: string;
  pdufaDate: string;
  description: string;
  category: string;
  status: string;
  sourceUrl: string;
  scrapedAt: string;
}

// Parse date from MM/DD/YYYY format
function parseDate(dateStr: string): string {
  const match = dateStr.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (!match) return "";
  const [_, month, day, year] = match;
  const paddedMonth = month.padStart(2, '0');
  const paddedDay = day.padStart(2, '0');
  return `${year}-${paddedMonth}-${paddedDay}`;
}

// Extract ticker from company name (e.g., "Regenxbio Inc (RGNX)" -> "RGNX")
function extractTicker(text: string): string {
  const match = text.match(/\(([A-Z]+)\)/);
  return match ? match[1] : "";
}

// Clean company name (remove ticker)
function cleanCompanyName(companyName: string): string {
  return companyName.replace(/\s*\([A-Z]+\)\s*/g, "").trim();
}

// Infer category from drug description
function inferCategory(description: string): string {
  const desc = description.toLowerCase();
  if (desc.includes("cancer") || desc.includes("tumor") || desc.includes("oncology") || desc.includes("leukemia") || desc.includes("prostate") || desc.includes("ovarian") || desc.includes("bladder")) return "Oncology";
  if (desc.includes("diabetes")) return "Metabolic/Endocrine";
  if (desc.includes("schizophrenia") || desc.includes("bipolar") || desc.includes("depression") || desc.includes("mental")) return "Neurology/Psychiatry";
  if (desc.includes("achondroplasia") || desc.includes("metabolic") || desc.includes("syndrome") || desc.includes("mucopolysaccharidosis")) return "Genetic/Rare Disease";
  if (desc.includes("respiratory") || desc.includes("rhinosinusitis")) return "Respiratory";
  if (desc.includes("imaging") || desc.includes("pet")) return "Diagnostics";
  return "Other";
}

async function scrapeRTTNews(): Promise<PdufaItem[]> {
  console.log(`Scraping RTTNews FDA Calendar from ${BASE_URL}...`);
  
  const response = await fetch(BASE_URL);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const html = await response.text();
  
  // Parse HTML to extract data
  const items: PdufaItem[] = [];
  const lines = html.split('\n');
  
  let idCounter = 1;
  let currentCompany = "";
  let currentTicker = "";
  let currentDrug = "";
  let currentDate = "";
  let currentDescription = "";
  let foundEntry = false;
  
  for (const line of lines) {
    // Look for company name with ticker link
    const match = line.match(/symbolsearch\.aspx\?symbol=([^&]+)">([^<]+)<\/a>\s*\([^)]+\)/);
    if (match) {
      currentTicker = match[1];
      currentCompany = match[2];
      console.log(`Found company: ${currentCompany} (${currentTicker})`);
    }
    
    // Look for drug name - check for BLA, NDA, sBLA, sNDA indicators
    if (currentCompany && (line.includes("(BLA") || line.includes("(NDA") || line.includes("(sBLA") || line.includes("(sNDA") || line.includes("BLA)") || line.includes("NDA)") || line.includes("sBLA)") || line.includes("sNDA)"))) {
      // Extract drug name before the parentheses
      const drugMatch = line.match(/^([^<(]+)(?:\s*\((?:BLA|NDA|sBLA|sNDA)\))?\s*(?:\([A-Z0-9\.]+\))?\s*$/);
      if (drugMatch) {
        currentDrug = drugMatch[1].trim();
        if (currentDrug.length > 0) {
          foundEntry = true;
          console.log(`Found drug: ${currentDrug}`);
        }
      }
    }
    
    // Look for date in MM/DD/YYYY format
    if (foundEntry && !currentDate) {
      const dateMatch = line.match(/(\d{1,2}\/\d{1,2}\/\d{4})/);
      if (dateMatch) {
        currentDate = dateMatch[1];
        console.log(`Found date: ${currentDate}`);
      }
    }
    
    // Look for "FDA decision" description
    if (foundEntry && currentDate && line.includes("FDA decision")) {
      currentDescription = line.trim();
      console.log(`Found description: ${currentDescription.substring(0, 50)}...`);
      
      // Parse the date
      const parsedDate = parseDate(currentDate);
      if (!parsedDate) {
        console.log(`Invalid date format: ${currentDate}`);
        continue;
      }
      
      // Only include dates from today onwards (no backdating)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const pdufaDate = new Date(parsedDate);
      
      if (pdufaDate < today) {
        console.log(`Skipping past date: ${parsedDate} (${currentCompany})`);
      } else {
        items.push({
          id: String(idCounter++),
          company: cleanCompanyName(currentCompany),
          ticker: currentTicker.toUpperCase(),
          drug: currentDrug,
          pdufaDate: parsedDate,
          description: currentDescription,
          category: inferCategory(currentDescription),
          status: "Pending",
          sourceUrl: BASE_URL,
          scrapedAt: new Date().toISOString()
        });
        console.log(`Added: ${currentCompany} - ${currentDrug} - ${parsedDate}`);
      }
      
      // Reset for next entry
      currentTicker = "";
      currentCompany = "";
      currentDrug = "";
      currentDate = "";
      currentDescription = "";
      foundEntry = false;
    }
  }
  
  // Sort by PDUFA date
  items.sort((a, b) => a.pdufaDate.localeCompare(b.pdufaDate));
  
  console.log(`Scraped ${items.length} upcoming PDUFA dates`);
  return items;
}

// Save data to JSON file
function saveData(data: PdufaItem[], outputPath: string) {
  const output = {
    data,
    meta: {
      source: "RTTNews",
      sourceUrl: BASE_URL,
      scrapedAt: new Date().toISOString(),
      itemCount: data.length,
      dateRange: {
        earliest: data.length > 0 ? data[0].pdufaDate : null,
        latest: data.length > 0 ? data[data.length - 1].pdufaDate : null
      }
    }
  };
  
  Bun.write(outputPath, JSON.stringify(output, null, 2));
  console.log(`Data saved to ${outputPath}`);
}

async function main() {
  try {
    // Scrape data
    const data = await scrapeRTTNews();
    
    // Save to multiple locations
    const dataPath = "/home/workspace/fda-tracker-vercel/public/fda-data.json";
    
    // Ensure directory exists
    const dirPath = "/home/workspace/fda-tracker-vercel/public";
    await Bun.$`mkdir -p ${dirPath}`;
    
    saveData(data, dataPath);
    
    console.log("\n✅ Scraping complete!");
    console.log(`📊 Total items: ${data.length}`);
    console.log(`📁 Saved to: ${dataPath}`);
    
  } catch (error) {
    console.error("❌ Error scraping RTTNews:", error);
    process.exit(1);
  }
}

main();
