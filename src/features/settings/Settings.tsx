import React from 'react';
import { Sliders, Trash2, HardDrive, Sun, Moon, Globe, Bell, Info } from 'lucide-react';
import { useAppStore } from '../../app/store';
import { AppLayout } from '../../layouts/AppLayout';

export const Settings: React.FC = () => {
  const {
    settings,
    updateSettings,
    history,
    clearScanHistory,
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
    <AppLayout title="Settings" showBack>
      <div className="space-y-6 pb-12 max-w-xl mx-auto">

        {/* Title header */}
        <div className="text-center pt-4">
          <div className="w-16 h-16 bg-cyan-100 dark:bg-cyan-950 rounded-full flex items-center justify-center mx-auto text-cyan-600 dark:text-cyan-400 mb-2">
            <Sliders className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Settings</h2>
          
        </div>

        <div className="waterline h-[1px] w-full" />

        {/* Scan History */}
        <div className="glass-card-light dark:glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/10 space-y-4 shadow-sm">
          <div className="flex items-center gap-3">
            <HardDrive className="w-5 h-5 text-cyan-500" />
            <h3 className="font-bold text-slate-800 dark:text-white">Scan History</h3>
          </div>

          <div className="flex justify-between items-center bg-slate-500/5 px-4 py-2.5 rounded-xl border border-slate-200/50 dark:border-white/5">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Total Saved Records</span>
            <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400">{history.length} entries</span>
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
          <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Sun className="w-5 h-5 text-cyan-500" /> Display & Language
          </h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Theme</span>
              <button
                onClick={toggleTheme}
                className="px-4 py-2 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-xs font-bold text-slate-700 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-white/10 transition-all flex items-center gap-2 cursor-pointer"
              >
                {settings.theme === 'light' ? (
                  <><Moon className="w-4 h-4 text-slate-600" /> Dark Mode</>
                ) : (
                  <><Sun className="w-4 h-4 text-amber-400" /> Light Mode</>
                )}
              </button>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-500" /> Language
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

        {/* Notifications */}
        <div className="glass-card-light dark:glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/10 space-y-4 shadow-sm">
          <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-cyan-500" /> Notifications
          </h3>
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Push Notifications</span>
            <input
              type="checkbox"
              checked={settings.notificationsEnabled}
              onChange={(e) => updateSettings({ notificationsEnabled: e.target.checked })}
              className="w-4 h-4 rounded accent-cyan-500 cursor-pointer"
            />
          </div>
        </div>

        {/* App Information */}
        <div className="glass-card-light dark:glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/10 space-y-4 shadow-sm">
          <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Info className="w-5 h-5 text-cyan-500" /> App Information
          </h3>
          <div className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <div className="flex justify-between">
              <span>App Name</span>
              <span className="font-bold text-slate-800 dark:text-white">AQUAID Marine Suite</span>
            </div>
            <div className="flex justify-between">
              <span>Version</span>
              <span className="font-bold text-slate-800 dark:text-white">2.0.0</span>
            </div>
          </div>
        </div>

      </div>
    </AppLayout>
  );
};
export default Settings;


