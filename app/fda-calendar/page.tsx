"use client";

import { useState, useMemo } from 'react';
import { Calendar } from 'lucide-react';
import { PDUFA_DATA } from '@/lib/pdufa-data';

interface PdufaItem {
  id: string;
  company: string;
  ticker: string;
  drug: string;
  pdufaDate: string;
  description: string;
  category: string;
}

export default function FDACalendar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('date-asc');

  const filteredData = useMemo(() => {
    let filtered = [...PDUFA_DATA];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.company.toLowerCase().includes(term) ||
        item.ticker.toLowerCase().includes(term) ||
        item.drug.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term)
      );
    }

    // Category filter
    if (categoryFilter !== 'All') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    // Date filter
    const now = new Date();
    const oneMonthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    if (dateFilter !== 'All') {
      if (dateFilter === 'week') {
        const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(item => {
          const itemDate = new Date(item.pdufaDate);
          return itemDate >= now && itemDate <= oneWeekFromNow;
        });
      } else if (dateFilter === 'month') {
        filtered = filtered.filter(item => {
          const itemDate = new Date(item.pdufaDate);
          return itemDate >= now && itemDate <= oneMonthFromNow;
        });
      } else if (dateFilter === 'month-plus') {
        filtered = filtered.filter(item => {
          const itemDate = new Date(item.pdufaDate);
          return itemDate >= now && itemDate >= oneMonthFromNow;
        });
      }
    }

    // Sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.pdufaDate);
      const dateB = new Date(b.pdufaDate);
      if (sortOrder === 'date-asc') return dateA.getTime() - dateB.getTime();
      if (sortOrder === 'date-desc') return dateB.getTime() - dateA.getTime();
      if (sortOrder === 'company-asc') return a.company.localeCompare(b.company);
      if (sortOrder === 'company-desc') return b.company.localeCompare(a.company);
      return 0;
    });

    return filtered;
  }, [searchTerm, categoryFilter, dateFilter, sortOrder]);

  const categories = ['All', ...Array.from(new Set(PDUFA_DATA.map(item => item.category)))];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Oncology': 'bg-red-100 text-red-800',
      'Neurology': 'bg-blue-100 text-blue-800',
      'Cardiology': 'bg-purple-100 text-purple-800',
      'Immunology': 'bg-green-100 text-green-800',
      'Rare Disease': 'bg-yellow-100 text-yellow-800',
      'Metabolic': 'bg-orange-100 text-orange-800',
      'Infectious Disease': 'bg-pink-100 text-pink-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            FDA & PDUFA Calendar
          </h1>
          <p className="text-slate-300">
            Track upcoming Prescription Drug User Fee Act (PDUFA) review dates
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Data last updated: {new Date().toLocaleDateString()}
          </p>
        </header>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 mb-8 border border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Search
              </label>
              <input
                type="text"
                placeholder="Company, ticker, drug..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Date Range
              </label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              >
                <option value="All">All Dates</option>
                <option value="week">Next 7 Days</option>
                <option value="month">Next 30 Days</option>
                <option value="month-plus">30+ Days</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Sort By
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              >
                <option value="date-asc">Date (Earliest First)</option>
                <option value="date-desc">Date (Latest First)</option>
                <option value="company-asc">Company (A-Z)</option>
                <option value="company-desc">Company (Z-A)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-sm text-slate-400">
            <span className="font-medium">Showing {filteredData.length} results</span>
            {searchTerm && <span>• Search: "{searchTerm}"</span>}
            {categoryFilter !== 'All' && <span>• Category: {categoryFilter}</span>}
            {dateFilter !== 'All' && <span>• Filter: {dateFilter}</span>}
          </div>
        </div>

        {filteredData.length === 0 ? (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-8 text-center border border-slate-700">
            <p className="text-slate-400 text-lg">No results found</p>
            <p className="text-slate-500 text-sm mt-2">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredData.map((item) => (
              <div
                key={item.id}
                className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700 hover:border-blue-500/50 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/10"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-white">{item.company}</h3>
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-sm font-mono">
                        {item.ticker}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(item.category)}`}>
                        {item.category}
                      </span>
                    </div>
                    <h4 className="text-lg font-semibold text-blue-400 mb-1">{item.drug}</h4>
                    <p className="text-slate-300 text-sm">{item.description}</p>
                  </div>
                  <div className="flex flex-col items-start md:items-end gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-sm">PDUFA Date:</span>
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg font-semibold">
                        {formatDate(item.pdufaDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {(() => {
                          const days = Math.ceil((new Date(item.pdufaDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                          return days > 0 ? `${days} days away` : 'Past due';
                        })()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <footer className="mt-12 text-center text-slate-400 text-sm">
          <p>Data sourced from FDA regulatory filings. For informational purposes only.</p>
          <p className="mt-1">
            <a href="https://github.com/randy06122001-boop/FDA-Tracker" className="text-blue-400 hover:text-blue-300">
              View on GitHub
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}