import React from 'react';
import { Heart, Trash2, Shield, AlertTriangle, Check } from 'lucide-react';
import { useAppStore } from '../../app/store';
import { SpeciesInfo } from '../../types';
import { useAppNavigation } from '../../navigation/AppNavigator';
import { AppLayout } from '../../layouts/AppLayout';
import { EmptyState } from '../../components/EmptyState';

export const SavedResults: React.FC = () => {
  const { savedResults, toggleSaveResult } = useAppStore();
  const { navigate, setSelectedSpecies } = useAppNavigation();

  const handleNavigateToDetail = (item: SpeciesInfo) => {
    setSelectedSpecies(item);
    navigate('Detail');
  };

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

  return (
    <AppLayout title="Saved Results" showBack>
      <div className="space-y-6 pb-12">
        {savedResults.length === 0 ? (
          <EmptyState 
            message="No saved species." 
            subtitle="Scan or browse the Fish Guide, then save species to find them here." 
            type="saved" 
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedResults.map((item) => (
              <div 
                key={item.id} 
                className="aquaid-feature-card rounded-2xl overflow-hidden border border-slate-100 dark:border-white/10 flex flex-col justify-between hover:shadow-lg transition-all duration-300 relative group"
              >
                {/* Photo Thumbnail */}
                <div 
                  onClick={() => handleNavigateToDetail(item)}
                  className="h-44 w-full relative bg-slate-900 border-b border-slate-200 dark:border-white/10 cursor-pointer overflow-hidden"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.commonName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[9px] text-white font-bold uppercase tracking-wider ${
                    item.sustainabilityStatus === 'Sustainable' 
                      ? 'bg-emerald-500/80 backdrop-blur-md'
                      : item.sustainabilityStatus === 'Caution'
                      ? 'bg-amber-500/80 backdrop-blur-md'
                      : 'bg-rose-500/80 backdrop-blur-md'
                  }`}>
                    {item.sustainabilityStatus}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-grow flex flex-col justify-between gap-3">
                  <div>
                    <div className="flex justify-between items-start gap-1">
                      <h4 
                        onClick={() => handleNavigateToDetail(item)}
                        className="font-bold text-[#111111] dark:text-white truncate text-base hover:text-[#1F3FAF] dark:hover:text-[#4FC3F7] cursor-pointer"
                      >
                        {item.commonName}
                      </h4>
                      <button
                        onClick={() => toggleSaveResult(item)}
                        className="p-1 rounded text-rose-500 hover:bg-rose-500/10 cursor-pointer transition-colors"
                        title="Remove bookmark"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs italic text-[#4B5563] truncate mb-1">
                      {item.scientificName}
                    </p>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-[#6B7280] bg-[#1F3FAF]/5 p-1.5 rounded-lg">
                    <span>Family: {item.family}</span>
                    <span className="font-bold text-[#1F3FAF] dark:text-[#4FC3F7]">
                      {item.confidence.toFixed(1)}% CF
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
export default SavedResults;





