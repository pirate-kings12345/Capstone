import React, { useState, useEffect, useCallback } from 'react';
import { Search, Info, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useAppNavigation } from '../../navigation/AppNavigator';
import { AppLayout } from '../../layouts/AppLayout';
import { SpeciesInfo } from '../../types';
import { SpeciesRepository } from '../../repositories/SpeciesRepository';
import { EmptyState } from '../../components/EmptyState';
import { LoadingSpinner } from '../../components/LoadingStates';

const repo = SpeciesRepository.getInstance();

const getBadgeStyles = (status: string | undefined) => {
  switch (status?.toLowerCase()) {
    case 'sustainable':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'caution':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'threatened':
    case 'endangered':
    case 'vulnerable':
      return 'bg-rose-100 text-rose-800 border-rose-200';
    default:
      return 'bg-slate-100 text-slate-800 border-slate-200';
  }
};

const FishCard: React.FC<{ item: SpeciesInfo; onClick: (item: SpeciesInfo) => void; }> = ({ item, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    layout
    onClick={() => onClick(item)}
    className="bg-white p-4 rounded-3xl flex gap-4 border border-slate-200/80 shadow-md shadow-slate-500/5 hover:shadow-lg hover:border-slate-300/80 active:scale-[0.98] transition-all duration-300 cursor-pointer group"
  >
    <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-100 border-2 border-white shadow-inner">
      <img
        src={item.imageUrl}
        alt={item.commonName}
        loading="lazy"
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
    </div>
    <div className="flex-grow min-w-0 flex flex-col justify-center">
      <div>
        <h4 className="font-extrabold text-slate-900 text-lg truncate">
          {item.commonName}
        </h4>
        <p className="text-sm italic text-slate-500 truncate mb-2">
          {item.scientificName}
        </p>
      </div>
      <div className="flex items-center gap-2 mt-auto">
        <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${getBadgeStyles(item.sustainabilityStatus)}`}>
          {item.sustainabilityStatus || 'N/A'}
        </span>
        <span className="text-xs font-semibold text-slate-600 truncate pr-2 hidden sm:inline">
          Family: <strong className="font-extrabold">{item.family}</strong>
        </span>
      </div>
    </div>
    <div className="flex items-center ml-auto">
      <Info className="w-6 h-6 text-slate-300 group-hover:text-[#1F3FAF] transition-colors" />
    </div>
  </motion.div>
);

export const FishGuide: React.FC = () => {
  const { navigate, setSelectedSpecies } = useAppNavigation();
  const [searchTerm, setSearchTerm] = useState('');
  const [allSpecies, setAllSpecies] = useState<SpeciesInfo[]>([]);
  const [filtered, setFiltered] = useState<SpeciesInfo[]>([]);
  const [loading, setLoading] = useState(true);

  // Load species list
  useEffect(() => {
    let isMounted = true;
    (async () => {
      setLoading(true);
      try {
        const data = await repo.getAllSpecies();
        if (isMounted) {
          setAllSpecies(data);
          setFiltered(data);
        }
      } catch (e) {
        console.error('Error fetching species:', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  // Search logic
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFiltered(allSpecies);
      return;
    }
    const query = term.toLowerCase().trim();
    const results = allSpecies.filter((item) =>
      item.commonName?.toLowerCase().includes(query) ||
      item.scientificName?.toLowerCase().includes(query) ||
      item.family?.toLowerCase().includes(query)
    );
    setFiltered(results);
  }, [allSpecies]);

  const handleNavigateToDetail = (item: SpeciesInfo) => {
    setSelectedSpecies(item);
    navigate('Detail');
  };

  return (
    <AppLayout title="Fish Guide" showBack>
      <div className="bg-[#F8FAFC] min-h-screen -m-4 p-4 space-y-5 pb-12 max-w-xl mx-auto font-sans">

        <section className="relative">
          <div className="relative flex items-center">
            <Search className="absolute left-5 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search fish species..."
              className="w-full h-14 pl-14 pr-12 bg-white rounded-2xl border-2 border-slate-200/80 text-slate-900 placeholder:text-slate-400 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1F3FAF] transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => handleSearch('')}
                className="absolute right-4 p-1.5 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            )}
          </div>
        </section>

        {loading ? (
          <LoadingSpinner message="Loading species from database..." />
        ) : filtered.length === 0 ? (
          <EmptyState
            message={searchTerm ? 'No Species Found' : 'Fish Guide is Empty'}
            subtitle={searchTerm ? 'Try a different name or check your spelling.' : 'Species you discover will be added here.'}
            type="guide"
          />
        ) : (
          <div className="space-y-3.5">
            {filtered.map((item) => (
              <FishCard key={item.id} item={item} onClick={handleNavigateToDetail} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default FishGuide;