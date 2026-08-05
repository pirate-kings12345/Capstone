import React from 'react';
import { AlertCircle, WifiOff, RefreshCw, XCircle } from 'lucide-react';

interface ErrorProps {
  message?: string;
  onRetry?: () => void;
}

export const NoDataError: React.FC<ErrorProps> = ({ message = 'No data available.', onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center space-y-4 max-w-sm mx-auto">
      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center text-slate-500">
        <AlertCircle className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <h4 className="font-bold text-[#111111] dark:text-white">Data Unavailable</h4>
        <p className="text-xs text-[#4B5563] dark:text-slate-400">{message}</p>
      </div>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="h-12 px-6 bg-gradient-to-r from-[#4FC3F7] to-[#1F3FAF] hover:opacity-90 active:scale-[0.98] text-white font-bold rounded-2xl text-sm flex items-center gap-2 cursor-pointer transition-all shadow-md"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Retry
        </button>
      )}
    </div>
  );
};

export const ConnectionLostError: React.FC<ErrorProps> = ({ message = 'Network connection offline. Please check connection.', onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center space-y-4 max-w-sm mx-auto">
      <div className="w-12 h-12 bg-amber-100/10 border border-amber-500/20 rounded-full flex items-center justify-center text-amber-500">
        <WifiOff className="w-6 h-6 animate-pulse" />
      </div>
      <div className="space-y-1">
        <h4 className="font-bold text-[#111111] dark:text-white">Connection Offline</h4>
        <p className="text-xs text-[#4B5563] dark:text-slate-400">{message}</p>
      </div>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="h-12 px-6 bg-gradient-to-r from-[#4FC3F7] to-[#1F3FAF] hover:opacity-90 active:scale-[0.98] text-white font-bold rounded-2xl text-sm flex items-center gap-2 cursor-pointer transition-all shadow-md"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Reconnect
        </button>
      )}
    </div>
  );
};

export const LoadingFailedError: React.FC<ErrorProps> = ({ message = 'Unable to download details.', onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center space-y-4 max-w-sm mx-auto">
      <div className="w-12 h-12 bg-rose-100/10 border border-rose-500/20 rounded-full flex items-center justify-center text-rose-500">
        <AlertCircle className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <h4 className="font-bold text-[#111111] dark:text-white">Loading Failed</h4>
        <p className="text-xs text-[#4B5563] dark:text-slate-400">{message}</p>
      </div>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="h-12 px-6 bg-gradient-to-r from-[#4FC3F7] to-[#1F3FAF] hover:opacity-90 active:scale-[0.98] text-white font-bold rounded-2xl text-sm flex items-center gap-2 cursor-pointer transition-all shadow-md"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Reload
        </button>
      )}
    </div>
  );
};

export const RecognitionFailedError: React.FC<ErrorProps> = ({ message = 'AI Vision scanning was unsuccessful.', onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center space-y-4 max-w-sm mx-auto">
      <div className="w-12 h-12 bg-rose-100/10 border border-rose-500/20 rounded-full flex items-center justify-center text-rose-500">
        <XCircle className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <h4 className="font-bold text-[#111111] dark:text-white">Recognition Failed</h4>
        <p className="text-xs text-[#4B5563] dark:text-slate-400">{message}</p>
      </div>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="h-12 px-6 bg-gradient-to-r from-[#4FC3F7] to-[#1F3FAF] hover:opacity-90 active:scale-[0.98] text-white font-bold rounded-2xl text-sm flex items-center gap-2 cursor-pointer transition-all shadow-md"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Try Again
        </button>
      )}
    </div>
  );
};
