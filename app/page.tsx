import Link from 'next/link';
import { Calendar, TrendingUp, Filter, Search } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            FDA & PDUFA Tracker
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Stay informed about upcoming Prescription Drug User Fee Act (PDUFA) review dates and FDA regulatory milestones.
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700 hover:border-blue-500/50 transition-all">
            <Calendar className="w-10 h-10 text-blue-400 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Real-Time Dates</h3>
            <p className="text-slate-400 text-sm">Track PDUFA target action dates as they're scheduled and updated.</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700 hover:border-purple-500/50 transition-all">
            <Search className="w-10 h-10 text-purple-400 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Powerful Search</h3>
            <p className="text-slate-400 text-sm">Find entries by company name, ticker symbol, or drug name.</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700 hover:border-pink-500/50 transition-all">
            <Filter className="w-10 h-10 text-pink-400 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Smart Filters</h3>
            <p className="text-slate-400 text-sm">Filter by therapeutic category, date range, and sort by relevance.</p>
          </div>
        </div>

        <div className="text-center mb-12">
          <Link
            href="/fda-calendar"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg font-semibold text-lg transition-all shadow-lg hover:shadow-blue-500/25"
          >
            <TrendingUp className="w-5 h-5" />
            View FDA Calendar
          </Link>
        </div>

        <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg p-6 border border-slate-700 text-center">
          <p className="text-slate-400 text-sm">
            Data sourced from FDA regulatory filings and publicly available sources.
          </p>
          <p className="text-slate-500 text-xs mt-2">
            For informational purposes only. Not financial or medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}