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
        return <History className="w-12 h-12 text-[#1F3FAF]/40 dark:text-[#4FC3F7]/40 animate-pulse" />;
      case 'saved':
        return <Heart className="w-12 h-12 text-[#1F3FAF]/40 dark:text-[#4FC3F7]/40 animate-pulse" />;
      case 'profile':
        return <User className="w-12 h-12 text-[#1F3FAF]/40 dark:text-[#4FC3F7]/40" />;
      case 'guide':
      case 'default':
      default:
        return <HelpCircle className="w-12 h-12 text-[#1F3FAF]/40 dark:text-[#4FC3F7]/40 opacity-60" />;
    }
  };

  return (
    <div className="text-center py-16 px-6 aquaid-glass-light dark:aquaid-glass rounded-2xl border border-dashed border-[#1F3FAF]/20 dark:border-white/10 text-[#4B5563] dark:text-slate-400 max-w-md mx-auto my-4">
      <div className="flex justify-center mb-4">
        {getIcon()}
      </div>
      <h3 className="font-bold text-base text-[#111111] dark:text-slate-200 mb-1">
        {message}
      </h3>
      {subtitle && (
        <p className="text-xs text-[#6B7280] dark:text-slate-400 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default EmptyState;

