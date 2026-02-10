import { NextResponse } from 'next/server';

interface BioAPIResponse {
  data: PdufaItem[];
  meta?: {
    last_updated?: string;
    total?: number;
  };
}

interface PdufaItem {
  company?: string;
  ticker?: string;
  drug?: string;
  pdufa_date?: string;
  description?: string;
  category?: string;
}

export async function GET() {
  const apiKey = process.env.BIOAPI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'BIOAPI_API_KEY not configured. Using static data fallback.' },
      { status: 200 }
    );
  }

  try {
    const response = await fetch('https://api.bioapi.dev/v1/database/puda/calendar', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`BioAPI returned ${response.status}`);
    }

    const data: BioAPIResponse = await response.json();

    // Transform BioAPI format to our internal format
    const transformedData = data.data?.map((item, index) => ({
      id: `bioapi-${index}`,
      company: item.company || 'Unknown',
      ticker: item.ticker || 'N/A',
      drug: item.drug || 'Unknown',
      pdufaDate: item.pdufa_date || new Date().toISOString().split('T')[0],
      description: item.description || 'No description available',
      category: item.category || 'Other'
    })) || [];

    return NextResponse.json({
      data: transformedData,
      source: 'BioAPI',
      last_updated: data.meta?.last_updated,
      total: transformedData.length
    });

  } catch (error) {
    console.error('Error fetching from BioAPI:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from BioAPI. Check API key configuration.', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}