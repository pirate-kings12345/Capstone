import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <Loader2 className="w-8 h-8 text-cyan-600 dark:text-cyan-400 animate-spin" />
      {message && <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{message}</span>}
    </div>
  );
};

export const SkeletonCard: React.FC = () => {
  return (
    <div className="glass-card-light dark:glass-card p-4 rounded-2xl border border-slate-200 dark:border-white/10 flex gap-4 animate-pulse w-full max-w-md mx-auto my-3">
      <div className="w-20 h-20 bg-slate-300 dark:bg-slate-800/80 rounded-xl flex-shrink-0" />
      <div className="flex-grow flex flex-col justify-between py-1">
        <div className="space-y-2">
          <div className="h-4 bg-slate-300 dark:bg-slate-800/80 rounded w-2/3" />
          <div className="h-3 bg-slate-300 dark:bg-slate-800/80 rounded w-1/2" />
        </div>
        <div className="flex justify-between items-center mt-2">
          <div className="h-3 bg-slate-300 dark:bg-slate-800/80 rounded w-1/3" />
          <div className="h-4 bg-slate-300 dark:bg-slate-800/80 rounded w-10" />
        </div>
      </div>
    </div>
  );
};

export const ProgressIndicator: React.FC<{ progress: number; message?: string }> = ({ progress, message }) => {
  return (
    <div className="w-full max-w-xs mx-auto py-4 space-y-2">
      {message && <div className="text-[10px] text-center font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">{message}</div>}
      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-850 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-cyan-500 to-sky-600 transition-all duration-300"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
};

