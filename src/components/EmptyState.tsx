import React from 'react';
import { HelpCircle, History, Heart, User } from 'lucide-react';

interface EmptyStateProps {
  message: string;
  subtitle?: string;
  type?: 'history' | 'saved' | 'profile' | 'guide' | 'default';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  subtitle,
  type = 'default',
}) => {
  const getIcon = () => {
    switch (type) {
      case 'history':
        return <History className="w-12 h-12 text-slate-450 dark:text-slate-500 animate-pulse" />;
      case 'saved':
        return <Heart className="w-12 h-12 text-slate-450 dark:text-slate-500 animate-pulse" />;
      case 'profile':
        return <User className="w-12 h-12 text-slate-450 dark:text-slate-500" />;
      case 'guide':
      case 'default':
      default:
        return <HelpCircle className="w-12 h-12 text-slate-450 dark:text-slate-500 opacity-60" />;
    }
  };

  return (
    <div className="text-center py-16 px-6 glass-card rounded-2xl border border-dashed border-slate-300 dark:border-white/10 text-slate-500 dark:text-slate-400 max-w-md mx-auto my-4">
      <div className="flex justify-center mb-4">
        {getIcon()}
      </div>
      <h3 className="font-bold text-base text-slate-800 dark:text-slate-200 mb-1">
        {message}
      </h3>
      {subtitle && (
        <p className="text-xs text-slate-505 dark:text-slate-400 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default EmptyState;

