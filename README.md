# FDA & PDUFA Tracker

A modern Next.js application for viewing, searching, and filtering upcoming PDUFA (Prescription Drug User Fee Act) and FDA review dates.

## 🚀 Live Demo

- **Vercel Version**: Deploy this repo to Vercel
- **zo.space Version**: https://zeromx.zo.space/fda-calendar

## ✨ Features

- **Real-time PDUFA Calendar**: Track upcoming FDA review dates with detailed information
- **Powerful Search**: Find entries by company name, ticker symbol, or drug name
- **Smart Filters**: Filter by therapeutic category, date range, and sort by relevance
- **Responsive Design**: Beautiful dark mode UI that works on all devices
- **Web Scraping**: Python script to scrape data from RTTNews (run monthly)

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Data Source**: RTTNews FDA Calendar (web scraping)

## 📁 Project Structure

```
fda-tracker-vercel/
├── app/
│   ├── api/
│   │   └── pdufa-dates/route.ts    # API endpoint (optional)
│   ├── fda-calendar/
│   │   └── page.tsx                # Main FDA calendar page
│   ├── page.tsx                    # Landing page
│   └── layout.tsx                  # Root layout
├── lib/
│   ├── pdufa-data.ts               # Data loading logic
│   └── pdufa-data-static.ts        # Fallback static data
├── public/
│   └── fda-data.json              # Scraped FDA data
├── scripts/
│   ├── rttnews-scraper.py          # Python scraper (working)
│   └── rttnews-scraper.ts          # Bun/TypeScript scraper
└── README.md
```

## 🚀 Quick Start

1. Clone the repository:
```bash
git clone https://github.com/randy06122001-boop/fda-tracker-vercel.git
cd fda-tracker-vercel
```

2. Install dependencies:
```bash
bun install
```

3. Run the development server:
```bash
bun run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## 📊 Data Management

### Scraping New Data

The included Python scraper fetches the latest FDA calendar data from RTTNews:

```bash
python3 scripts/rttnews-scraper.py
```

This saves data to `public/fda-data.json` with:
- Company name and ticker symbol
- Drug name and description
- PDUFA target action date
- Therapeutic category
- Approval status

**Note**: Only scrape on the 1st of each month to avoid overloading the source website.

### Scheduled Scraping

To set up monthly scraping (on the 1st of each month), use a cron job or scheduler:

```bash
# Run at 9:00 AM on the 1st of every month
0 9 1 * * cd /path/to/fda-tracker-vercel && python3 scripts/rttnews-scraper.py && git add public/fda-data.json && git commit -m "Update FDA data" && git push
```

## 🌐 Deploy to Vercel

1. Push this repository to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Add New Project"
4. Import the GitHub repository
5. Click "Deploy"

Vercel will automatically:
- Detect Next.js
- Install dependencies
- Build the application
- Deploy to a global CDN

### Environment Variables

Optional: Add `BIOAPI_API_KEY` if you plan to integrate with BioAPI for additional data sources.

## 📄 Data Source

- **Primary**: [RTTNews FDA Calendar](https://www.rttnews.com/corpinfo/fdacalendar.aspx)
- **Alternative Sources** (for future integration):
  - [Benzinga FDA Calendar](https://www.benzinga.com/fda-calendar/pdufa) (API available)
  - [BioWatch FDA Calendar](https://www.biopharmawatch.com/fda-calendar)
  - [FDATracker](https://www.fdatracker.com/fda-calendar/)

## 🎨 Features Overview

### Search & Filter
- **Text Search**: Search by company, ticker, or drug name
- **Category Filter**: Filter by therapeutic area (Oncology, Neurology, etc.)
- **Date Range**: Filter by next 7 days, 30 days, or 30+ days
- **Sorting**: Sort by date (asc/desc) or company (A-Z/Z-A)

### Visual Design
- Dark mode gradient background
- Color-coded category badges
- Responsive card layout
- Hover effects and transitions
- Days-away countdown

## ⚠️ Disclaimer

Data sourced from FDA regulatory filings and publicly available sources. For informational purposes only. Not financial or medical advice. Always verify PDUFA dates from official FDA sources.

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Contact via [Zo Computer](https://zeromx.zo.computer)
