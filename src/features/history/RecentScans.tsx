import React, { useState } from 'react';
import { Search, History, Shield, Check, Info, AlertTriangle, Trash2 } from 'lucide-react';
import { useAppStore } from '../../app/store';
import { SpeciesInfo } from '../../types';
import { useAppNavigation } from '../../navigation/AppNavigator';
import { AppLayout } from '../../layouts/AppLayout';
import { EmptyState } from '../../components/EmptyState';

export const RecentScans: React.FC = () => {
  const { history, deleteScanFromHistory } = useAppStore();
  const { navigate, setSelectedSpecies } = useAppNavigation();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | 'Sustainable' | 'Caution' | 'Protected'>('All');

  // Filters calculation
  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.commonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.scientificName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.family.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      activeFilter === 'All' || item.sustainabilityStatus === activeFilter;

    return matchesSearch && matchesFilter;
  });

  const getBadgeStyles = (status: string) => {
    switch (status) {
      case 'Sustainable':
        return 'bg-emerald-100 text-emerald-700 dark:text-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200/50';
      case 'Caution':
        return 'bg-amber-100 text-amber-700 dark:text-amber-300 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200/50';
      default:
        return 'bg-rose-100 text-rose-700 dark:text-rose-300 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200/50';
    }
  };

  const handleNavigateToDetail = (item: SpeciesInfo) => {
    setSelectedSpecies(item);
    navigate('Detail');
  };

  const totalSustainabilityMatches = history.filter(h => h.sustainabilityStatus === 'Sustainable').length;
  const sustainablePercent = history.length > 0 ? Math.round((totalSustainabilityMatches / history.length) * 100) : 0;

  return (
    <AppLayout title="Scan History" showBack>
      <div className="space-y-6 pb-12">
        {/* Search Input Bar */}
        <section className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search fish species..."
            className="w-full h-14 pl-12 pr-4 bg-white/50 dark:bg-black/20 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-white/10 outline-none focus:ring-2 focus:ring-[#1F3FAF] transition-all font-sans text-[#111111] dark:text-white"
          />
        </section>

        {/* Stats Dashboard */}
        <section className="grid grid-cols-2 gap-4">
          {/* Discovered Specs */}
          <div className="aquaid-glass-light dark:aquaid-glass p-5 rounded-2xl flex flex-col justify-between border border-slate-105 dark:border-white/10">
            <div>
              <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-1">
                Species Found
              </p>
              <h2 className="text-3xl font-black text-[#1F3FAF] dark:text-[#4FC3F7]">
                {filteredHistory.length}
              </h2>
            </div>
            <div className="mt-3 flex items-center text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              <Check className="w-3.5 h-3.5 mr-1" />
              <span>Total results</span>
            </div>
          </div>

          {/* Sustainable metrics */}
          <div className="aquaid-glass-light dark:aquaid-glass p-5 rounded-2xl flex flex-col justify-between border border-slate-105 dark:border-white/10">
            <div>
              <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-1">
                Sustainable Rate
              </p>
              <h2 className="text-3xl font-black text-[#1F3FAF] dark:text-[#4FC3F7]">
                {sustainablePercent}%
              </h2>
            </div>
            <div className="mt-3 flex items-center text-[#1F3FAF] dark:text-[#4FC3F7] text-xs font-semibold">
              <Info className="w-3.5 h-3.5 mr-1" />
              <span>Based on scans</span>
            </div>
          </div>
        </section>

        {/* Filter Chips row */}
        <section className="flex gap-2.5 overflow-x-auto pb-1.5 hide-scrollbar">
          {[
            { key: 'All', label: 'All Entries' },
            { key: 'Sustainable', label: 'Sustainable' },
            { key: 'Caution', label: 'Caution / Monitor' },
            { key: 'Protected', label: 'Protected Status' },
          ].map((btn) => (
            <button
              key={btn.key}
              onClick={() => setActiveFilter(btn.key as any)}
              className={`px-4.5 py-2 rounded-full font-sans text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                activeFilter === btn.key
                  ? 'bg-[#1F3FAF] text-white shadow-md'
                  : 'bg-slate-200/50 dark:bg-white/15 text-[#4B5563] dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/30'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </section>

        {/* History Timeline feed list */}
        <section className="relative pl-6">
          {/* Timeline bar line visual */}
          <div className="absolute left-2 top-4 bottom-0 w-0.5 bg-[#1F3FAF]/20 dark:bg-[#1F3FAF]/40 pointer-events-none rounded" />

          {filteredHistory.length === 0 ? (
            <EmptyState 
              message="No scan history available." 
              subtitle="Conduct a scan or customize filter criteria to view details." 
              type="history" 
            />
          ) : (
            <div className="space-y-6">
              {filteredHistory.map((item) => (
                <div key={item.id} className="relative group">
                  {/* Timeline status point */}
                  <div className="absolute -left-6 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-[#4FC3F7] bg-white dark:bg-slate-900 z-10" />

                  <div className="aquaid-feature-card p-5 rounded-2xl flex gap-5 hover:shadow-lg transition-all duration-300 border border-slate-100 dark:border-white/10 relative">
                    {/* Photo Thumbnail */}
                    <div 
                      onClick={() => handleNavigateToDetail(item)}
                      className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 shadow-inner border border-white/20 relative cursor-pointer"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.commonName}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-550"
                      />
                    </div>

                    {/* Body Content */}
                    <div className="flex-grow min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-1 gap-1">
                          <h4 
                            onClick={() => handleNavigateToDetail(item)}
                            className="font-bold text-[#111111] dark:text-white truncate text-base hover:text-[#1F3FAF] dark:hover:text-[#4FC3F7] cursor-pointer"
                          >
                            {item.commonName}
                          </h4>
                          <span className="text-[9px] font-black tracking-tight text-[#1F3FAF] dark:text-[#4FC3F7] bg-[#1F3FAF]/5 dark:bg-[#1F3FAF]/20 px-1.5 py-0.5 rounded flex-shrink-0">
                            {item.confidence.toFixed(1)}% AI
                          </span>
                        </div>
                        <p className="text-xs italic text-[#4B5563] truncate mb-2">
                          {item.scientificName}
                        </p>
                      </div>

                      <div className="flex justify-between items-center bg-slate-500/5 p-1 rounded-lg">
                        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[9px] font-black tracking-wider ${getBadgeStyles(item.sustainabilityStatus)}`}>
                          {item.sustainabilityStatus === 'Sustainable' ? (
                            <Check className="w-3 h-3" />
                          ) : item.sustainabilityStatus === 'Caution' ? (
                            <AlertTriangle className="w-3 h-3" />
                          ) : (
                            <Shield className="w-3 h-3" />
                          )}
                          <span>{item.sustainabilityStatus.toUpperCase()}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-[#6B7280] font-medium">
                            {item.date} • {item.time}
                          </span>
                          <button
                            onClick={() => deleteScanFromHistory(item.id)}
                            className="p-1 rounded text-rose-500 hover:bg-rose-500/10 cursor-pointer transition-colors"
                            title="Remove entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
};
export default RecentScans;





