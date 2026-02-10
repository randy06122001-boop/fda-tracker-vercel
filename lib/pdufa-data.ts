import { PDUFA_DATA as STATIC_DATA } from './pdufa-data-static';

export interface PdufaItem {
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

// Load data from scraped JSON file
export async function getPdufaData(): Promise<PdufaItem[]> {
  try {
    // Try to load from public/fda-data.json first
    const response = await fetch('/fda-data.json');
    if (response.ok) {
      const json: FdaDataResponse = await response.json();
      console.log(`Loaded ${json.data.length} items from scraped data`);
      return json.data;
    }
  } catch (error) {
    console.error('Failed to load scraped data, using static fallback:', error);
  }
  
  // Fallback to static data
  console.log('Using static fallback data');
  return STATIC_DATA;
}

// Export static data as fallback
export const PDUFA_DATA = STATIC_DATA;
