import React from 'react';
import { Menu, User, ArrowLeft, Home, BookOpen, History, Heart, Info, HelpCircle, Settings, X, Waves } from 'lucide-react';
import { useAppNavigation } from '../navigation/AppNavigator';
import { useAppStore } from '../app/store';

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  showBack?: boolean;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  title,
  subtitle,
  showBack = false,
}) => {
  const { currentRoute, navigate, goBack, isMenuOpen, setMenuOpen } = useAppNavigation();
  const { userName } = useAppStore();

  const menuItems = [
    { label: 'Home', icon: Home, route: 'Home' as const },
    { label: 'Fish Guide', icon: BookOpen, route: 'Guide' as const },
    { label: 'Scan History', icon: History, route: 'History' as const },
    { label: 'Saved Results', icon: Heart, route: 'SavedResults' as const },
    { label: 'About', icon: Info, route: 'About' as const },
    { label: 'Help', icon: HelpCircle, route: 'Help' as const },
    { label: 'Settings', icon: Settings, route: 'Settings' as const },
  ];

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#e0f7fa] to-[#faf9fc] text-slate-800 dark:from-slate-900 dark:to-slate-950 dark:text-slate-100 transition-colors duration-300 relative">

      {/* Background decoration */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] animate-ripple bg-[radial-gradient(circle_at_50%_50%,#90e0ef_0%,transparent_70%)]" />
      </div>

      {/* ── Fixed Header ── */}
      <header className="flex-shrink-0 z-40 flex justify-between items-center px-6 h-16 bg-white/20 dark:bg-black/20 backdrop-blur-xl border-b border-white/10 shadow-sm relative">
        <div className="flex items-center gap-3">
          {showBack ? (
            <button
              onClick={goBack}
              className="p-2 -ml-2 rounded-full hover:bg-slate-500/10 dark:hover:bg-white/10 transition-colors text-slate-800 dark:text-white cursor-pointer"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => setMenuOpen(true)}
              className="p-2 -ml-2 rounded-full hover:bg-slate-500/10 dark:hover:bg-white/10 transition-colors text-slate-800 dark:text-white cursor-pointer"
              aria-label="Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <div className="flex flex-col">
            {subtitle && (
              <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-widest leading-none mb-0.5">
                {subtitle}
              </span>
            )}
            <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              {title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentRoute === 'Camera' ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 animate-pulse text-white">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span className="text-[9px] font-bold tracking-widest">LIVE</span>
            </div>
          ) : (
            <button
              onClick={() => navigate('Settings')}
              className="p-2 rounded-full hover:bg-slate-500/10 dark:hover:bg-white/10 transition-colors text-slate-800 dark:text-white flex items-center gap-2 cursor-pointer"
              title="Settings"
            >
              <User className="w-5 h-5" />
              {userName && <span className="text-xs font-bold hidden sm:inline">{userName}</span>}
            </button>
          )}
        </div>
      </header>

      {/* ── Scrollable Content ── */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative z-10">
        <div className="px-6 pt-6 pb-8 max-w-4xl mx-auto">
          {children}
        </div>
      </main>

      {/* ── Slide-out Navigation Drawer ── */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          />
          <div className="relative w-80 max-w-xs h-full bg-white/90 dark:bg-slate-950/95 backdrop-blur-2xl shadow-2xl flex flex-col z-10 border-r border-slate-200 dark:border-white/10 p-6">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <Waves className="w-6 h-6 text-cyan-500" />
                <span className="font-black text-xl text-slate-900 dark:text-white tracking-wider">AQUAID</span>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6 p-4 bg-cyan-500/10 rounded-2xl border border-cyan-400/20 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                {userName ? userName.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500 dark:text-slate-400">Signed in as</p>
                <p className="font-bold text-slate-900 dark:text-white truncate">
                  {userName || 'Explorer'}
                </p>
              </div>
            </div>

            <nav className="flex-grow flex flex-col gap-2 overflow-y-auto">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentRoute === item.route;
                return (
                  <button
                    key={item.route}
                    onClick={() => { navigate(item.route); setMenuOpen(false); }}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition-all text-sm cursor-pointer ${
                      isActive
                        ? 'bg-cyan-600 text-white shadow-md'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/5'
                    }`}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-cyan-500'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="mt-auto border-t border-slate-200 dark:border-white/10 pt-4 text-center">
              <p className="text-[10px] text-slate-400 font-semibold uppercase">AQUAID</p>
              <p className="text-[9px] text-slate-500">v2.0.0</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AppLayout;

