import { PDUFA_DATA as STATIC_DATA } from './pdufa-data-static';

export interface PdufaItem {
  id: string;
  company: string;
  ticker: string;
  drug: string;
  treatment: string;
  pdufaDate: string;
  approvalType: "NDA" | "BLA" | "sNDA" | "sBLA" | "ANDA";
  priority: "Standard" | "Priority" | "Accelerated";
  status: "Pending" | "Review" | "Complete";
  description: string;
}

export interface FdaDataResponse {
  data: PdufaItem[];
  meta: {
    source: string;
    sourceUrl: string;
    scrapedAt: string;
    itemCount: number;
    dateRange: {
      earliest: string | null;
      latest: string | null;
    };
  };
}

// Type assertion helper function
function assertPdufaItem(item: any): PdufaItem {
  return {
    id: String(item.id),
    company: String(item.company),
    ticker: String(item.ticker),
    drug: String(item.drug),
    treatment: String(item.treatment || item.description || ''),
    pdufaDate: String(item.pdufaDate),
    approvalType: (item.approvalType || 'NDA') as "NDA" | "BLA" | "sNDA" | "sBLA" | "ANDA",
    priority: (item.priority || 'Standard') as "Standard" | "Priority" | "Accelerated",
    status: (item.status || 'Pending') as "Pending" | "Review" | "Complete",
    description: String(item.description)
  };
}

// Load data from scraped JSON file
export async function getPdufaData(): Promise<PdufaItem[]> {
  try {
    // Try to load from public/fda-data.json first
    const response = await fetch('/fda-data.json');
    if (response.ok) {
      const json: any = await response.json();
      const data: PdufaItem[] = json.data.map(assertPdufaItem);
      console.log(`Loaded ${data.length} items from scraped data`);
      return data;
    }
  } catch (error) {
    console.error('Failed to load scraped data, using static fallback:', error);
  }
  
  // Fallback to static data
  console.log('Using static fallback data');
  return STATIC_DATA as unknown as PdufaItem[];
}

// Export static data as fallback
export const PDUFA_DATA = STATIC_DATA as unknown as PdufaItem[];
