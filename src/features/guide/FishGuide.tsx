import React, { useState, useEffect, useCallback } from 'react';
import { Search, Info, HelpCircle } from 'lucide-react';
import { useAppNavigation } from '../../navigation/AppNavigator';
import { AppLayout } from '../../layouts/AppLayout';
import { SpeciesInfo } from '../../types';
import { SpeciesRepository } from '../../repositories/SpeciesRepository';
import { EmptyState } from '../../components/EmptyState';
import { LoadingSpinner } from '../../components/LoadingStates';

const repo = SpeciesRepository.getInstance();

const getBadgeStyles = (status: string) => {
  switch (status) {
    case 'Sustainable':
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200/50';
    case 'Caution':
      return 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200/50';
    default:
      return 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200/50';
  }
};

export const FishGuide: React.FC = () => {
  const { navigate, setSelectedSpecies } = useAppNavigation();
  const [searchTerm, setSearchTerm]       = useState('');
  const [allSpecies, setAllSpecies]       = useState<SpeciesInfo[]>([]);
  const [filtered, setFiltered]           = useState<SpeciesInfo[]>([]);
  const [loading, setLoading]             = useState(true);

  // Load all species on mount
  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await repo.getAllSpecies();
      setAllSpecies(data);
      setFiltered(data);
      setLoading(false);
    })();
  }, []);

  // Search via SQLite when term changes
  const handleSearch = useCallback(async (term: string) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFiltered(allSpecies);
      return;
    }
    const results = await repo.searchSpecies(term.trim());
    setFiltered(results);
  }, [allSpecies]);

  const handleNavigateToDetail = (item: SpeciesInfo) => {
    setSelectedSpecies(item);
    navigate('Detail');
  };

  return (
    <AppLayout title="Fish Guide" showBack>
      <div className="space-y-6 pb-12">

        {/* Search */}
        <section className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={e => handleSearch(e.target.value)}
            placeholder="Search fish species..."
            className="w-full h-14 pl-12 pr-4 bg-white/50 dark:bg-black/20 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-white/10 outline-none focus:ring-2 focus:ring-cyan-500 transition-all font-sans text-slate-800 dark:text-white"
          />
        </section>

        {loading ? (
          <LoadingSpinner message="Loading species..." />
        ) : filtered.length === 0 ? (
          <EmptyState
            message={searchTerm ? 'No fish found' : 'No species available'}
            subtitle={searchTerm ? 'Try a different name or spelling.' : 'Species will appear here as you scan them.'}
            type="guide"
          />
        ) : (
          <div className="space-y-4">
            {filtered.map(item => (
              <div
                key={item.id}
                onClick={() => handleNavigateToDetail(item)}
                className="glass-card-light dark:glass-card p-4 rounded-2xl flex gap-4 hover:shadow-lg transition-all duration-300 border border-slate-100 dark:border-white/10 cursor-pointer group"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 shadow-inner border border-white/20 relative">
                  <img
                    src={item.imageUrl}
                    alt={item.commonName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="flex-grow min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-0.5 gap-1">
                      <h4 className="font-bold text-slate-900 dark:text-white truncate text-base">
                        {item.commonName}
                      </h4>
                      <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-black border tracking-wider ${getBadgeStyles(item.sustainabilityStatus)}`}>
                        {item.sustainabilityStatus.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs italic text-slate-500 truncate mb-1">{item.scientificName}</p>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400">
                    <span>Family: {item.family}</span>
                    <span className="flex items-center gap-1 text-cyan-600 dark:text-cyan-400 font-bold">
                      <Info className="w-3.5 h-3.5" /> Details
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};
export default FishGuide;
