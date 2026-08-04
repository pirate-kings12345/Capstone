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
      <div className="w-full max-w-xl mx-auto space-y-6 sm:space-y-7 pb-12">
        <div className="waterline h-[1px] w-full" />

        {/* Profile Summary */}
        <div
          className="relative overflow-hidden rounded-[24px] sm:rounded-[28px] p-5 sm:p-7 flex items-center gap-4 sm:gap-5"
          style={{
            background: 'linear-gradient(135deg, #4FC3F7 0%, #1F3FAF 100%)',
            boxShadow: '0 16px 40px rgba(31,63,175,0.35)',
          }}
        >
          <div
            className="absolute -top-10 -right-10 h-40 w-40 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(115,227,231,0.35) 0%, transparent 70%)' }}
          />
          <div
            className="relative flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-full bg-white/15 border-[3px] border-white/40"
            style={{ boxShadow: '0 6px 18px rgba(0,0,0,0.15)' }}
          >
            {userName ? (
              <span className="text-2xl font-extrabold text-white">{userName.charAt(0).toUpperCase()}</span>
            ) : (
              <UserCircle2 className="w-10 h-10 text-white" />
            )}
          </div>
          <div className="relative flex-1">
            <p className="text-lg sm:text-xl font-extrabold text-white leading-tight">{userName || 'Aqua Explorer'}</p>
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white">
              {history.length} {history.length === 1 ? 'scan' : 'scans'} saved
            </span>
          </div>
        </div>

        {/* Scan History */}
        <div
          className="rounded-[24px] p-6 space-y-5 bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-white/10"
          style={{ boxShadow: '0 10px 28px rgba(15,23,42,0.06)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-2xl"
              style={{ background: 'linear-gradient(135deg, rgba(31,63,175,0.16), rgba(79,195,247,0.16))' }}
            >
              <HardDrive className="w-5 h-5 text-[#1F3FAF]" />
            </div>
            <h3 className="text-[15px] font-extrabold text-slate-800 dark:text-white">Scan History</h3>
          </div>

          <div className="flex justify-between items-center gap-3 bg-[#1F3FAF]/[0.06] px-4 sm:px-5 py-3.5 rounded-2xl">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Total Saved Records</span>
            <span className="text-base font-extrabold text-[#1F3FAF]">{history.length} entries</span>
          </div>

          <button
            onClick={handleClearHistory}
            className="w-full h-12 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-950/50 text-rose-600 dark:text-rose-400 text-sm font-bold rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer"
            style={{ boxShadow: '0 4px 14px rgba(225,29,72,0.12)' }}
          >
            <Trash2 className="w-4 h-4" /> Clear All History
          </button>
        </div>

        {/* Display & Language */}
        <div
          className="rounded-[24px] p-6 space-y-5 bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-white/10"
          style={{ boxShadow: '0 10px 28px rgba(15,23,42,0.06)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-2xl"
              style={{ background: 'linear-gradient(135deg, rgba(31,63,175,0.16), rgba(115,227,231,0.2))' }}
            >
              <Sun className="w-5 h-5 text-[#1F3FAF]" />
            </div>
            <h3 className="text-[15px] font-extrabold text-slate-800 dark:text-white">Display & Language</h3>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center bg-slate-50 dark:bg-white/5 rounded-2xl px-4 py-3.5">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2.5">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-xl"
                  style={{ background: settings.theme === 'light' ? 'rgba(251,191,36,0.15)' : 'rgba(100,116,139,0.15)' }}
                >
                  {settings.theme === 'light' ? (
                    <Sun className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Moon className="w-4 h-4 text-slate-500" />
                  )}
                </span>
                {settings.theme === 'light' ? 'Light Mode' : 'Dark Mode'}
              </span>
              <Toggle checked={settings.theme === 'dark'} onChange={toggleTheme} />
            </div>

            <div className="flex justify-between items-center bg-slate-50 dark:bg-white/5 rounded-2xl px-4 py-3.5">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl" style={{ background: 'rgba(31,63,175,0.12)' }}>
                  <Globe className="w-4 h-4 text-[#1F3FAF]" />
                </span>
                Language
              </span>
              <select
                value={settings.language}
                onChange={(e) => updateSettings({ language: e.target.value as any })}
                className="bg-white dark:bg-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-white/10 px-3 py-2.5 outline-none cursor-pointer"
                style={{ boxShadow: '0 2px 6px rgba(15,23,42,0.05)' }}
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
        <div
          className="rounded-[22px] sm:rounded-[24px] p-5 sm:p-6 bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-white/10"
          style={{ boxShadow: '0 10px 28px rgba(15,23,42,0.06)' }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-2xl"
              style={{ background: 'linear-gradient(135deg, rgba(31,63,175,0.16), rgba(79,195,247,0.16))' }}
            >
              <ShieldCheck className="w-5 h-5 text-[#1F3FAF]" />
            </div>
            <h3 className="text-[15px] font-extrabold text-slate-800 dark:text-white">Privacy & Security</h3>
          </div>

          <div className="space-y-2">
            <button className="w-full flex items-center justify-between bg-slate-50 dark:bg-white/5 rounded-2xl px-4 py-3.5 cursor-pointer">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Privacy Policy</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
            <button className="w-full flex items-center justify-between bg-slate-50 dark:bg-white/5 rounded-2xl px-4 py-3.5 cursor-pointer">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Terms of Service</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
export default Settings;