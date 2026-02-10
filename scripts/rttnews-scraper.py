#!/usr/bin/env python3
"""
RTTNews FDA Calendar Web Scraper
Scrapes PDUFA and FDA review dates from https://www.rttnews.com/corpinfo/fdacalendar.aspx
Run on the 1st of each month to update data
"""

import requests
from bs4 import BeautifulSoup
from datetime import datetime, date
import json
import re

BASE_URL = "https://www.rttnews.com/corpinfo/fdacalendar.aspx"
OUTPUT_PATH = "/home/workspace/fda-tracker-vercel/public/fda-data.json"


def parse_date(date_str):
    """Parse date from MM/DD/YYYY format to YYYY-MM-DD"""
    match = re.match(r'(\d{1,2})/(\d{1,2})/(\d{4})', date_str)
    if not match:
        return ""
    month, day, year = match.groups()
    return f"{year}-{month.zfill(2)}-{day.zfill(2)}"


def extract_ticker(text):
    """Extract ticker from company name link"""
    match = re.search(r'symbol=([A-Z]+)', text)
    return match.group(1) if match else ""


def clean_company_name(company_name):
    """Remove ticker and extra spaces from company name"""
    cleaned = re.sub(r'\s*\([^)]+\)\s*', '', company_name)
    return cleaned.strip()


def infer_category(description):
    """Infer category from drug description"""
    desc = description.lower()
    if any(x in desc for x in ["cancer", "tumor", "oncology", "leukemia", "prostate", "ovarian", "bladder"]):
        return "Oncology"
    if "diabetes" in desc:
        return "Metabolic/Endocrine"
    if any(x in desc for x in ["schizophrenia", "bipolar", "depression", "mental"]):
        return "Neurology/Psychiatry"
    if any(x in desc for x in ["achondroplasia", "metabolic", "syndrome", "mucopolysaccharidosis"]):
        return "Genetic/Rare Disease"
    if any(x in desc for x in ["respiratory", "rhinosinusitis"]):
        return "Respiratory"
    if any(x in desc for x in ["imaging", "pet"]):
        return "Diagnostics"
    return "Other"


def scrape_rttnews():
    """Scrape RTTNews FDA Calendar"""
    print(f"Scraping RTTNews FDA Calendar from {BASE_URL}...")
    
    response = requests.get(BASE_URL)
    if not response.ok:
        raise Exception(f"HTTP error! status: {response.status}")
    
    soup = BeautifulSoup(response.text, 'html.parser')
    
    items = []
    id_counter = 1
    
    # Find all company divs
    company_divs = soup.find_all('div', {'data-th': 'Company Name', 'data-group': 'calData'})
    
    for company_div in company_divs:
        # Get company name and ticker
        company_link = company_div.find('a', href=re.compile(r'symbolsearch\.aspx'))
        if not company_link:
            continue
            
        company_name = company_div.get_text(separator=' ').strip()
        ticker = extract_ticker(str(company_link))
        
        if not ticker:
            print(f"Warning: No ticker found for {company_name}")
            continue
        
        print(f"Found company: {company_name} ({ticker})")
        
        # The next sibling divs contain Drug, Event, Outcome
        # Find the next div after company_div
        next_div = company_div.find_next_sibling('div', {'data-group': 'calData'})
        
        if not next_div or next_div.get('data-th') != 'Drug':
            continue
            
        drug_div = next_div
        drug_name = drug_div.get_text().strip()
        # Remove parentheses content like (BLA), (NDA)
        drug_name = re.sub(r'\s*\([^)]+\)\s*', '', drug_name).strip()
        
        print(f"  Found drug: {drug_name}")
        
        # Next is Event div with date and description
        event_div = drug_div.find_next_sibling('div', {'data-group': 'calData'})
        
        if not event_div or event_div.get('data-th') != 'Event':
            continue
            
        # Extract date from span with bg-purple class
        date_span = event_div.find('span', class_='bg-purple')
        if not date_span:
            continue
            
        date_str = date_span.get_text().strip()
        parsed_date = parse_date(date_str)
        
        if not parsed_date:
            print(f"  Warning: Invalid date format: {date_str}")
            continue
        
        # Extract description (after the span and <br />)
        event_text = event_div.get_text(separator=' ', strip=True)
        # Remove the date portion and keep the description
        description = event_text.replace(date_str, '').strip()
        # Clean up extra whitespace
        description = re.sub(r'\s+', ' ', description).strip()
        
        print(f"  Found date: {parsed_date}")
        print(f"  Found description: {description[:50]}...")
        
        # Check if date is in the future (no backdating)
        today = date.today()
        pdufa_date = datetime.strptime(parsed_date, "%Y-%m-%d").date()
        
        if pdufa_date < today:
            print(f"  Skipping past date: {parsed_date}")
            continue
        
        # Create item
        item = {
            "id": str(id_counter),
            "company": clean_company_name(company_name),
            "ticker": ticker.upper(),
            "drug": drug_name,
            "pdufaDate": parsed_date,
            "description": description,
            "category": infer_category(description),
            "status": "Pending",
            "sourceUrl": BASE_URL,
            "scrapedAt": datetime.now().isoformat()
        }
        
        items.append(item)
        print(f"  Added: {item['company']} - {item['drug']} - {parsed_date}")
        
        id_counter += 1
    
    # Sort by PDUFA date
    items.sort(key=lambda x: x['pdufaDate'])
    
    print(f"Scraped {len(items)} upcoming PDUFA dates")
    return items


def save_data(items, output_path):
    """Save data to JSON file"""
    output = {
        "data": items,
        "meta": {
            "source": "RTTNews",
            "sourceUrl": BASE_URL,
            "scrapedAt": datetime.now().isoformat(),
            "itemCount": len(items),
            "dateRange": {
                "earliest": items[0]['pdufaDate'] if items else None,
                "latest": items[-1]['pdufaDate'] if items else None
            }
        }
    }
    
    with open(output_path, 'w') as f:
        json.dump(output, f, indent=2)
    
    print(f"Data saved to {output_path}")


def main():
    try:
        # Scrape data
        items = scrape_rttnews()
        
        # Create output directory if needed
        import os
        output_dir = os.path.dirname(OUTPUT_PATH)
        os.makedirs(output_dir, exist_ok=True)
        
        # Save data
        save_data(items, OUTPUT_PATH)
        
        print("\n✅ Scraping complete!")
        print(f"📊 Total items: {len(items)}")
        print(f"📁 Saved to: {OUTPUT_PATH}")
        
    except Exception as error:
        print(f"❌ Error scraping RTTNews: {error}")
        import traceback
        traceback.print_exc()
        exit(1)


if __name__ == "__main__":
    main()
