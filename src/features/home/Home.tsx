import React from 'react';
import { Camera, Image as ImageIcon, Database, TrendingUp, Sparkles, Award } from 'lucide-react';
import { useAppStore } from '../../app/store';
import { SpeciesInfo } from '../../types';
import { useAppNavigation } from '../../navigation/AppNavigator';
import { AppLayout } from '../../layouts/AppLayout';
import { EmptyState } from '../../components/EmptyState';

export const Home: React.FC = () => {
  const { userName, history } = useAppStore();
  const { navigate, setSelectedSpecies } = useAppNavigation();

  const handleNavigateToDetail = (item: SpeciesInfo) => {
    setSelectedSpecies(item);
    navigate('Detail');
  };

  return (
    <AppLayout title="Home">
      <div className="space-y-6 pb-12">

        {/* Action Buttons */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <button
            onClick={() => navigate('Camera')}
            className="relative h-48 rounded-2xl overflow-hidden flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-cyan-600 to-sky-800 group hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 shadow-md text-white border border-white/10 cursor-pointer"
          >
            <div className="absolute inset-0 bg-cyan-400/5 opacity-20 pointer-events-none" />
            <div className="w-16 h-16 bg-white/15 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:scale-105 transition-transform">
              <Camera className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold tracking-tight text-white mb-0.5">Scan Aqua Life</h2>
              <p className="text-xs text-cyan-100/80">Instant AI Camera Identification</p>
            </div>
          </button>

          <button
            onClick={() => navigate('Upload')}
            className="h-48 glass-card rounded-2xl flex flex-col items-center justify-center gap-3 group hover:bg-white/25 dark:hover:bg-black/25 transition-all duration-300 border border-white/30 cursor-pointer"
          >
            <div className="w-16 h-16 neumorphic-inset bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
              <ImageIcon className="w-8 h-8 text-cyan-600" />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white mb-0.5">
                Upload from Gallery
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Analyze any saved photo</p>
            </div>
          </button>
        </section>

        {/* Statistics */}
        <section className="grid grid-cols-2 gap-3">
          <div className="glass-card rounded-xl p-5 flex flex-col items-center justify-center text-center border border-white/10">
            <Database className="w-5 h-5 text-cyan-500 mb-2" />
            <span className="text-2xl font-black text-slate-800 dark:text-white">{history.length}</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 mt-0.5">Total Scans</span>
          </div>
          <div className="glass-card rounded-xl p-5 flex flex-col items-center justify-center text-center border border-white/10">
            <TrendingUp className="w-5 h-5 text-emerald-500 mb-2" />
            <span className="text-2xl font-black text-slate-800 dark:text-white">
              {history.length > 0 ? Math.round((history.filter(h => h.sustainabilityStatus === 'Sustainable').length / history.length) * 100) : 0}%
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 mt-0.5">Sustainable Rate</span>
          </div>
          <div className="glass-card rounded-xl p-5 flex flex-col items-center justify-center text-center border border-white/10">
            <Sparkles className="w-5 h-5 text-amber-500 mb-2" />
            <span className="text-2xl font-black text-slate-800 dark:text-white">
              {history.filter(h => h.confidence > 95).length}
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 mt-0.5">High Confidence</span>
          </div>
          <div className="glass-card rounded-xl p-5 flex flex-col items-center justify-center text-center border border-white/10">
            <Award className="w-5 h-5 text-cyan-500 mb-2" />
            <span className="text-2xl font-black text-slate-800 dark:text-white">
              Lv {Math.max(1, Math.floor(history.length / 3) + 1)}
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 mt-0.5">Explorer Rank</span>
          </div>
        </section>

        {/* Recent Identifications */}
        <section className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold tracking-tight text-slate-800 dark:text-white">Recent Identifications</h3>
            <button onClick={() => navigate('History')} className="text-xs text-cyan-600 dark:text-cyan-400 font-bold hover:underline cursor-pointer">
              See All
            </button>
          </div>
          {history.length === 0 ? (
            <EmptyState message="No scans yet." subtitle="Tap 'Scan Aqua Life' or upload a photo to identify your first species." type="history" />
          ) : (
            <div className="flex overflow-x-auto gap-4 pb-2 -mx-6 px-6 hide-scrollbar snap-x">
              {history.slice(0, 10).map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNavigateToDetail(item)}
                  className="flex-shrink-0 w-60 glass-card rounded-2xl overflow-hidden hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer snap-start border border-white/25 self-start"
                >
                  <div className="h-36 w-full relative bg-slate-900 border-b border-white/10">
                    <img src={item.imageUrl} alt={item.commonName} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] text-white font-bold uppercase tracking-wider backdrop-blur-md ${item.sustainabilityStatus === 'Sustainable' ? 'bg-emerald-500/80' : item.sustainabilityStatus === 'Caution' ? 'bg-amber-500/80' : 'bg-rose-500/80'}`}>
                      {item.sustainabilityStatus}
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="font-bold text-sm text-slate-800 dark:text-white truncate">{item.commonName}</h4>
                    <p className="text-xs italic text-slate-500 dark:text-slate-400 truncate mb-2">{item.scientificName}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-400 font-medium">{item.date}</span>
                      <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-bold bg-cyan-50 dark:bg-cyan-950/40 px-1.5 py-0.5 rounded">{item.confidence.toFixed(1)}%</span>
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
export default Home;

