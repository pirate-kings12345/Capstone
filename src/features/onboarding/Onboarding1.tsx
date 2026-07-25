import React from 'react';
import { Camera, Waves } from 'lucide-react';
import { useAppNavigation } from '../../navigation/AppNavigator';

export const Onboarding1: React.FC = () => {
  const { navigate } = useAppNavigation();

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-[#e0f7fa] to-[#faf9fc] dark:from-slate-900 dark:to-slate-950 flex flex-col justify-between p-6 font-sans select-none">
      {/* Top action skip bar */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-1.5">
          <Waves className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
          <span className="font-black text-sm tracking-wider text-slate-800 dark:text-white">AQUAID</span>
        </div>
        <button
          onClick={() => navigate('UserName')}
          className="text-xs font-bold text-slate-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400 cursor-pointer"
        >
          Skip
        </button>
      </div>

      {/* Main onboarding card illustration & details */}
      <div className="max-w-md mx-auto w-full space-y-8 text-center my-auto">
        <div className="relative w-48 h-48 mx-auto flex items-center justify-center bg-white/40 dark:bg-black/35 backdrop-blur-md rounded-full border border-white/20 shadow-2xl overflow-hidden group">
          <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-cyan-500 to-sky-700 opacity-20 pointer-events-none" />
          <Camera className="w-20 h-20 text-cyan-600 dark:text-cyan-400 ar-float" />
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-black text-slate-800 dark:text-white leading-tight">
            Instant AI Identification
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed max-w-xs mx-auto">
            Point your camera at any fish or aquatic species and AQUAID will identify it instantly.
          </p>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-1.5 pt-2">
          <span className="w-5 h-2 rounded-full bg-cyan-600 dark:bg-cyan-400"></span>
          <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-750"></span>
          <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-750"></span>
          <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-750"></span>
        </div>
      </div>

      {/* Bottom buttons panel */}
      <div className="max-w-md mx-auto w-full mb-6">
        <button
          onClick={() => navigate('Onboarding2')}
          className="w-full h-14 bg-gradient-to-r from-cyan-600 to-sky-850 hover:from-cyan-500 hover:to-sky-700 text-white font-bold rounded-2xl shadow-lg shadow-cyan-500/25 active:scale-[0.99] transition-all flex items-center justify-center cursor-pointer"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};
export default Onboarding1;

