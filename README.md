# FDA & PDUFA Tracker - Vercel Deployment

A modern Next.js application for tracking Prescription Drug User Fee Act (PDUFA) review dates and FDA regulatory milestones.

## 🚀 Live Demo

- **Vercel**: [Deploy your own instance](#-deploy-to-vercel)
- **zo.space**: https://zeromx.zo.space/fda-calendar

## ✨ Features

- **Real-time PDUFA Tracking**: Monitor upcoming FDA review dates
- **Powerful Search**: Find entries by company name, ticker, or drug
- **Smart Filters**: Filter by therapeutic category and date range
- **Sortable Results**: Sort by date or company name
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark Mode**: Beautiful gradient UI with modern styling

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Deployment**: Vercel

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/randy06122001-boop/FDA-Tracker.git
cd FDA-Tracker

# Install dependencies
bun install
# or
npm install

# Run development server
bun run dev
# or
npm run dev

# Open http://localhost:3000
```

## 🚀 Deploy to Vercel

### Option 1: Quick Deploy (Recommended)

1. Push this repository to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your `FDA-Tracker` repository
4. Click "Deploy"

Vercel will automatically detect Next.js and configure everything.

### Option 2: Deploy from Command Line

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

## 🔌 BioAPI Integration (Optional)

To use live PDUFA data from [BioAPI](https://bioapi.dev):

1. Get an API key from [bioapi.dev/signup](https://bioapi.dev/signup)
2. Add environment variable in Vercel:
   - Go to Project Settings > Environment Variables
   - Add `BIOAPI_API_KEY` with your key
3. Redeploy the application

The app will automatically use BioAPI when the key is configured.

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `BIOAPI_API_KEY` | BioAPI key for live PDUFA data | No (fallback to static data) |

## 📁 Project Structure

```
fda-tracker-vercel/
├── app/
│   ├── api/
│   │   └── pdufa-dates/
│   │       └── route.ts          # BioAPI endpoint
│   ├── fda-calendar/
│   │   └── page.tsx             # Main calendar page
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
├── lib/
│   └── pdufa-data.ts             # Static PDUFA data
├── public/                       # Static assets
├── next.config.js                # Next.js config
├── tailwind.config.ts            # Tailwind config
└── tsconfig.json                 # TypeScript config
```

## 🎨 Customization

### Update PDUFA Data

Edit `lib/pdufa-data.ts` to update the static data:

```typescript
export const PDUFA_DATA = [
  {
    id: "1",
    company: "Vertex Pharmaceuticals",
    ticker: "VRTX",
    drug: "VX-548 (Suzetrigine)",
    pdufaDate: "2026-02-12",
    description: "Non-opioid acute pain treatment",
    category: "Neurology"
  },
  // Add more entries...
];
```

### Change Colors

Edit `app/fda-calendar/page.tsx` to customize the gradient and colors:

```typescript
<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
```

## 📊 Data Sources

- **Primary**: BioAPI (https://bioapi.dev) - PDUFA calendar endpoint
- **Fallback**: Static data (see `lib/pdufa-data.ts`)
- **Alternatives**: Benzinga, RTTNews, BioPharmaWatch

See [SETUP.md](SETUP.md) for detailed integration instructions.

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vercel](https://vercel.com/)
- [BioAPI](https://bioapi.dev/) for PDUFA data
- [Lucide](https://lucide.dev/) for icons

## 🔗 Links

- [GitHub Repository](https://github.com/randy06122001-boop/FDA-Tracker)
- [Vercel](https://vercel.com/)
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind Docs](https://tailwindcss.com/docs)

---

**Disclaimer**: This tool is for informational purposes only and should not be used for making financial or medical decisions. Always verify PDUFA dates from official FDA sources.
