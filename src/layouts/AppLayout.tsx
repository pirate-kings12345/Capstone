import React from 'react';
import { Menu, User, ArrowLeft, Home, BookOpen, History, Heart, Info, HelpCircle, Settings, X } from 'lucide-react';
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
    <div
      className="flex flex-col h-full transition-colors duration-300 relative"
      style={{
        background: 'linear-gradient(180deg, #E8F4FD 0%, #F5FAFF 40%, #FFFFFF 100%)',
        fontFamily: '"Poppins", sans-serif',
        color: '#1a2a3a',
      }}
    >
      {/* Background decoration */}
      <div className="fixed inset-0 z-0 opacity-30 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-0 right-0 h-60"
          style={{
            background: 'radial-gradient(ellipse 120% 100% at 50% 0%, rgba(10,102,255,0.06) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* ── Fixed Header ── */}
      <header
        className="flex-shrink-0 z-40 flex justify-between items-center px-5 h-14 relative"
        style={{
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0,56,115,0.06)',
          boxShadow: '0 1px 8px rgba(0,56,115,0.04)',
          paddingTop: 'env(safe-area-inset-top, 0px)',
        }}
      >
        <div className="flex items-center gap-3">
          {showBack ? (
            <button
              onClick={goBack}
              className="p-2 -ml-2 rounded-xl hover:bg-[#0A66FF]/5 transition-colors cursor-pointer"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5 text-[#1a2a3a]" />
            </button>
          ) : (
            <button
              onClick={() => setMenuOpen(true)}
              className="p-2 -ml-2 rounded-xl hover:bg-[#0A66FF]/5 transition-colors cursor-pointer"
              aria-label="Menu"
            >
              <Menu className="w-5 h-5 text-[#1a2a3a]" />
            </button>
          )}
          <div className="flex flex-col">
            {subtitle && (
              <span className="text-[10px] text-[#0A66FF] font-bold uppercase tracking-widest leading-none mb-0.5">
                {subtitle}
              </span>
            )}
            <h1 className="text-lg font-bold tracking-tight text-[#1a2a3a]">
              {title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentRoute === 'Camera' ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 animate-pulse">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span className="text-[9px] font-bold tracking-widest text-rose-600">LIVE</span>
            </div>
          ) : (
            <button
              onClick={() => navigate('Settings')}
              className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer text-white font-bold text-xs"
              title="Settings"
              style={{
                background: 'linear-gradient(135deg, #0A66FF 0%, #005BBB 100%)',
                boxShadow: '0 2px 8px rgba(10,102,255,0.2)',
              }}
            >
              {userName ? userName.charAt(0).toUpperCase() : 'A'}
            </button>
          )}
        </div>
      </header>

      {/* ── Scrollable Content ── */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative z-10">
        <div className="px-5 pt-5 pb-8 max-w-4xl mx-auto">
          {children}
        </div>
      </main>

      {/* ── Slide-out Navigation Drawer ── */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0"
            style={{ background: 'rgba(0,24,48,0.4)', backdropFilter: 'blur(4px)' }}
          />
          <div
            className="relative w-80 max-w-xs h-full flex flex-col z-10 p-6"
            style={{
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              boxShadow: '4px 0 32px rgba(0,24,48,0.15)',
              borderRight: '1px solid rgba(0,56,115,0.06)',
            }}
          >
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #0A66FF, #005BBB)' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
                    <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
                    <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
                  </svg>
                </div>
                <span className="font-black text-lg text-[#003873] tracking-wider">AQUAID</span>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-1.5 rounded-xl hover:bg-[#0A66FF]/5 text-[#94a3b8] hover:text-[#1a2a3a] cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div
              className="mb-6 p-4 rounded-2xl flex items-center gap-3"
              style={{
                background: 'rgba(10,102,255,0.06)',
                border: '1px solid rgba(10,102,255,0.08)',
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #0A66FF, #005BBB)' }}
              >
                {userName ? userName.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-[#94a3b8] font-medium">Signed in as</p>
                <p className="font-bold text-[#1a2a3a] truncate text-sm">
                  {userName || 'Explorer'}
                </p>
              </div>
            </div>

            <nav className="flex-grow flex flex-col gap-1 overflow-y-auto">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentRoute === item.route;
                return (
                  <button
                    key={item.route}
                    onClick={() => { navigate(item.route); setMenuOpen(false); }}
                    className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold transition-all text-sm cursor-pointer ${
                      isActive
                        ? 'text-white'
                        : 'text-[#475569] hover:text-[#1a2a3a] hover:bg-[#0A66FF]/5'
                    }`}
                    style={isActive ? {
                      background: 'linear-gradient(135deg, #0A66FF, #005BBB)',
                      boxShadow: '0 2px 12px rgba(10,102,255,0.25)',
                    } : {}}
                  >
                    <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? 'text-white' : 'text-[#0A66FF]'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="mt-auto border-t pt-4 text-center" style={{ borderColor: 'rgba(0,56,115,0.06)' }}>
              <p className="text-[10px] text-[#94a3b8] font-semibold uppercase tracking-widest">AQUAID</p>
              <p className="text-[9px] text-[#94a3b8]">v2.0.0</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AppLayout;
