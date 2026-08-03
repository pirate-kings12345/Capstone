import React from 'react';
import { Trash2, HardDrive, Sun, Moon, Globe, UserCircle2, ChevronRight, ShieldCheck } from 'lucide-react';
import { useAppStore } from '../../app/store';
import { AppLayout } from '../../layouts/AppLayout';

const Toggle: React.FC<{ checked: boolean; onChange: () => void }> = ({ checked, onChange }) => (
  <button
    onClick={onChange}
    className="relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 cursor-pointer"
    style={{ background: checked ? '#1F3FAF' : '#CBD5E1' }}
  >
    <span
      className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-200"
      style={{ left: checked ? '22px' : '2px' }}
    />
  </button>
);

export const Settings: React.FC = () => {
  const {
    settings,
    updateSettings,
    history,
    clearScanHistory,
    userName,
  } = useAppStore();

  const toggleTheme = () => {
    const next = settings.theme === 'light' ? 'dark' : 'light';
    updateSettings({ theme: next });
  };

  const handleClearHistory = () => {
    const agree = window.confirm('Are you sure you want to clear all scan history?');
    if (agree) clearScanHistory();
  };

  return (
    <AppLayout title="Profile" showBack>
      <div className="space-y-6 pb-12 max-w-xl mx-auto">
        <div className="waterline h-[1px] w-full" />

        {/* Profile Summary */}
        <div
          className="rounded-2xl p-6 border border-slate-200 dark:border-white/10 shadow-sm flex items-center gap-4"
          style={{ background: 'linear-gradient(135deg, #4FC3F7 0%, #1F3FAF 100%)' }}
        >
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/15 border-2 border-white/30">
            {userName ? (
              <span className="text-lg font-bold text-white">{userName.charAt(0).toUpperCase()}</span>
            ) : (
              <UserCircle2 className="w-8 h-8 text-white" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-base font-bold text-white">{userName || 'Aqua Explorer'}</p>
            <p className="text-xs font-medium text-white/75">
              {history.length} {history.length === 1 ? 'scan' : 'scans'} saved
            </p>
          </div>
        </div>

        {/* Scan History */}
        <div className="glass-card-light dark:glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/10 space-y-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1F3FAF]/10">
              <HardDrive className="w-4.5 h-4.5 text-[#1F3FAF]" />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-white">Scan History</h3>
          </div>

          <div className="flex justify-between items-center bg-slate-500/5 px-4 py-2.5 rounded-xl border border-slate-200/50 dark:border-white/5">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Total Saved Records</span>
            <span className="text-sm font-bold text-[#1F3FAF]">{history.length} entries</span>
          </div>

          <button
            onClick={handleClearHistory}
            className="w-full h-11 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-950/50 border border-rose-200 dark:border-rose-800/30 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4" /> Clear All History
          </button>
        </div>

        {/* Display & Language */}
        <div className="glass-card-light dark:glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/10 space-y-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1F3FAF]/10">
              <Sun className="w-4.5 h-4.5 text-[#1F3FAF]" />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-white">Display & Language</h3>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                {settings.theme === 'light' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-500" />
                )}
                {settings.theme === 'light' ? 'Light Mode' : 'Dark Mode'}
              </span>
              <Toggle checked={settings.theme === 'dark'} onChange={toggleTheme} />
            </div>

            <div className="flex justify-between items-center px-1">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#1F3FAF]" /> Language
              </span>
              <select
                value={settings.language}
                onChange={(e) => updateSettings({ language: e.target.value as any })}
                className="bg-slate-100 dark:bg-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-white/10 px-3 py-2 outline-none cursor-pointer"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="Tagalog">Tagalog</option>
              </select>
            </div>
          </div>
        </div>

        {/* Privacy & Security (visual only, no store wiring yet) */}
        <div className="glass-card-light dark:glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/10 space-y-1 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1F3FAF]/10">
              <ShieldCheck className="w-4.5 h-4.5 text-[#1F3FAF]" />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-white">Privacy & Security</h3>
          </div>

          <button className="w-full flex items-center justify-between py-2.5 cursor-pointer">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Privacy Policy</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
          <button className="w-full flex items-center justify-between py-2.5 cursor-pointer">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Terms of Service</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>
    </AppLayout>
  );
};
export default Settings;