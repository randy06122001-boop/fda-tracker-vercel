"use client";

import { useState, useEffect, useMemo } from 'react';
import { Search, Calendar, Filter, TrendingUp, Pill, Building, AlertCircle, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { PDUFA_DATA } from '@/lib/pdufa-data';

export default function FDACalendar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [approvalFilter, setApprovalFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Get dates for next month
  useEffect(() => {
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const endMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0);
    
    setDateRange({
      start: nextMonth.toISOString().split('T')[0],
      end: endMonth.toISOString().split('T')[0]
    });
  }, []);

  // Filter data based on all criteria
  const filteredData = useMemo(() => {
    return PDUFA_DATA.filter((item) => {
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        !searchTerm ||
        item.company.toLowerCase().includes(searchLower) ||
        item.ticker.toLowerCase().includes(searchLower) ||
        item.drug.toLowerCase().includes(searchLower) ||
        item.treatment.toLowerCase().includes(searchLower);

      // Date range filter
      let matchesDate = true;
      if (dateRange.start || dateRange.end) {
        const itemDate = new Date(item.pdufaDate);
        if (dateRange.start) {
          const startDate = new Date(dateRange.start);
          matchesDate = matchesDate && itemDate >= startDate;
        }
        if (dateRange.end) {
          const endDate = new Date(dateRange.end);
          matchesDate = matchesDate && itemDate <= endDate;
        }
      }

      // Approval type filter
      const matchesApproval = approvalFilter === 'all' || item.approvalType === approvalFilter;

      // Priority filter
      const matchesPriority = priorityFilter === 'all' || item.priority === priorityFilter;

      // Status filter
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

      return matchesSearch && matchesDate && matchesApproval && matchesPriority && matchesStatus;
    }).sort((a, b) => new Date(a.pdufaDate).getTime() - new Date(b.pdufaDate).getTime());
  }, [searchTerm, dateRange, approvalFilter, priorityFilter, statusFilter]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getDaysUntil = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const pdufaDate = new Date(dateStr);
    pdufaDate.setHours(0, 0, 0, 0);
    const diffTime = pdufaDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Priority': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Accelerated': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getApprovalTypeColor = (type: string) => {
    switch (type) {
      case 'NDA': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'BLA': return 'bg-green-100 text-green-800 border-green-200';
      case 'sNDA': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'sBLA': return 'bg-teal-100 text-teal-800 border-teal-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDaysUntilColor = (days: number) => {
    if (days <= 7) return 'text-red-600 font-semibold';
    if (days <= 14) return 'text-amber-600 font-semibold';
    return 'text-green-600 font-semibold';
  };

  const clearFilters = () => {
    setSearchTerm('');
    setApprovalFilter('all');
    setPriorityFilter('all');
    setStatusFilter('all');
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const endMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0);
    setDateRange({
      start: nextMonth.toISOString().split('T')[0],
      end: endMonth.toISOString().split('T')[0]
    });
    setCurrentPage(1);
  };

  const activeFilterCount = [
    approvalFilter !== 'all',
    priorityFilter !== 'all',
    statusFilter !== 'all',
    searchTerm !== '',
    dateRange.start !== ''
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <CalendarIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">FDA & PDUFA Calendar</h1>
                <p className="text-sm text-slate-600">Upcoming drug review dates</p>
              </div>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">{activeFilterCount}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by company, drug, or ticker..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
          </div>
        </div>

        {showFilters && (
          <div className="mb-6 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Filters</h3>
              {activeFilterCount > 0 && (
                <button onClick={clearFilters} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Clear All Filters
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Date Range</label>
                <div className="flex space-x-2">
                  <input type="date" value={dateRange.start} onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })} className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <input type="date" value={dateRange.end} onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })} className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Approval Type</label>
                <select value={approvalFilter} onChange={(e) => setApprovalFilter(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="all">All Types</option>
                  <option value="NDA">NDA</option>
                  <option value="BLA">BLA</option>
                  <option value="sNDA">sNDA</option>
                  <option value="sBLA">sBLA</option>
                  <option value="ANDA">ANDA</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Review Priority</label>
                <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="all">All Priorities</option>
                  <option value="Priority">Priority</option>
                  <option value="Standard">Standard</option>
                  <option value="Accelerated">Accelerated</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="all">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Review">Under Review</option>
                  <option value="Complete">Complete</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Reviews</p>
                <p className="text-2xl font-bold text-slate-900">{filteredData.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Priority Reviews</p>
                <p className="text-2xl font-bold text-slate-900">{filteredData.filter(d => d.priority === 'Priority').length}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-amber-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">NDAs</p>
                <p className="text-2xl font-bold text-slate-900">{filteredData.filter(d => d.approvalType === 'NDA').length}</p>
              </div>
              <Pill className="w-8 h-8 text-blue-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">BLAs</p>
                <p className="text-2xl font-bold text-slate-900">{filteredData.filter(d => d.approvalType === 'BLA').length}</p>
              </div>
              <Building className="w-8 h-8 text-green-600 opacity-20" />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-slate-600">Showing <span className="font-medium text-slate-900">{paginatedData.length}</span> of <span className="font-medium text-slate-900">{filteredData.length}</span> results</p>
        </div>

        {paginatedData.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
            <AlertCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No results found</h3>
            <p className="text-slate-600">Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {paginatedData.map((item) => {
              const daysUntil = getDaysUntil(item.pdufaDate);
              return (
                <div key={item.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-slate-900">{item.drug}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-md border ${getApprovalTypeColor(item.approvalType)}`}>{item.approvalType}</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-md border ${getPriorityColor(item.priority)}`}>{item.priority}</span>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{item.description}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                        <span className="flex items-center"><Building className="w-4 h-4 mr-1" />{item.company} ({item.ticker})</span>
                        <span className="flex items-center"><Pill className="w-4 h-4 mr-1" />{item.treatment}</span>
                      </div>
                    </div>
                    <div className="lg:text-right">
                      <div className="mb-2">
                        <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">PDUFA Date</p>
                        <p className="text-lg font-semibold text-slate-900">{formatDate(item.pdufaDate)}</p>
                      </div>
                      <div>
                        <p className={`text-sm ${getDaysUntilColor(daysUntil)}`}>{daysUntil > 0 ? `${daysUntil} days remaining` : daysUntil === 0 ? 'Today' : 'Past due'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <p className="text-sm text-slate-600">Page {currentPage} of {totalPages}</p>
            <div className="flex items-center space-x-2">
              <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button key={page} onClick={() => setCurrentPage(page)} className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === page ? "bg-blue-600 text-white" : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"}`}>
                  {page}
                </button>
              ))}
              <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ml-1">
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )}

        <footer className="mt-12 text-center text-slate-400 text-sm">
          <p>Data sourced from FDA regulatory filings and publicly available sources.</p>
          <p className="mt-1">
            <a href="https://github.com/randy06122001-boop/FDA-Tracker" className="text-blue-600 hover:text-blue-700">
              View on GitHub
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}
