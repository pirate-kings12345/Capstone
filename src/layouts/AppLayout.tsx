import React, { useState } from 'react';
import { Menu, ArrowLeft, Home, BookOpen, History, Heart, Info, HelpCircle, Settings, BarChart3, LogOut, X } from 'lucide-react';
import { useAppNavigation } from '../navigation/AppNavigator';
import { useAppStore } from '../app/store';
import logo from '../assets/logos/LogoForLanding.png';

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
  const { userName, setUserName, setOnboardingCompleted, setIsGuestMode } = useAppStore();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const menuItems = [
    { label: 'Home', icon: Home, route: 'Home' as const },
    { label: 'Analytics', icon: BarChart3, route: 'Analytics' as const },
    { label: 'Settings', icon: Settings, route: 'Settings' as const },
    { label: 'Fish Guide', icon: BookOpen, route: 'Guide' as const },
    { label: 'Scan History', icon: History, route: 'History' as const },
    { label: 'Saved Results', icon: Heart, route: 'SavedResults' as const },
    { label: 'About', icon: Info, route: 'About' as const },
    { label: 'Help', icon: HelpCircle, route: 'Help' as const },
  ];

  const handleLogout = async () => {
    await setUserName('');
    await setOnboardingCompleted(false);
    setIsGuestMode(false);
    setMenuOpen(false);
    setShowLogoutConfirm(false);
    navigate('Login');
  };

  return (
    <div
      className="flex min-h-screen w-full flex-col transition-colors duration-300 relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #F7F9FC 0%, #F7F9FC 40%, #FFFFFF 100%)',
        fontFamily: '"Poppins", sans-serif',
        color: '#111111',
      }}
    >
      {/* Background decoration */}
      <div className="fixed inset-0 z-0 opacity-30 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-0 right-0 h-60"
          style={{
            background: 'radial-gradient(ellipse 120% 100% at 50% 0%, rgba(79,195,247,0.18) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* ── Fixed Header ── */}
      <header
        className="flex-shrink-0 z-40 flex justify-between items-center px-4 sm:px-5 h-14 relative"
        style={{
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(31,63,175,0.08)',
          boxShadow: '0 8px 24px rgba(17,17,17,0.04)',
          paddingTop: 'env(safe-area-inset-top, 0px)',
        }}
      >
        <div className="flex items-center gap-3">
          {showBack ? (
            <button
              onClick={goBack}
              className="p-2 -ml-2 rounded-xl hover:bg-[#1F3FAF]/5 transition-colors cursor-pointer"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5 text-[#111111]" />
            </button>
          ) : (
            <button
              onClick={() => setMenuOpen(true)}
              className="p-2 -ml-2 rounded-xl hover:bg-[#1F3FAF]/5 transition-colors cursor-pointer"
              aria-label="Menu"
            >
              <Menu className="w-5 h-5 text-[#111111]" />
            </button>
          )}
          <div className="flex flex-col">
            {subtitle && (
              <span className="text-[10px] text-[#1F3FAF] font-bold uppercase tracking-widest leading-none mb-0.5">
                {subtitle}
              </span>
            )}
            <h1 className="text-lg font-bold tracking-tight text-[#111111]">
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
                background: 'linear-gradient(135deg, #4FC3F7 0%, #1F3FAF 100%)',
                boxShadow: '0 8px 24px rgba(31,63,175,0.16)',
              }}
            >
              {userName ? userName.charAt(0).toUpperCase() : 'A'}
            </button>
          )}
        </div>
      </header>

      {/* ── Scrollable Content ── */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative z-10">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-5 pt-4 sm:pt-5 pb-8">
          {children}
        </div>
      </main>

      {/* ── Slide-out Navigation Drawer ── */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <div
            onClick={() => setShowLogoutConfirm(false)}
            className="absolute inset-0"
            style={{ background: 'rgba(0,24,48,0.45)', backdropFilter: 'blur(4px)' }}
          />
          <div className="relative w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xl">
            <h3 className="text-lg font-bold text-[#111111]">Log out?</h3>
            <p className="mt-2 text-sm text-[#4F5D75]">Are you sure you want to sign out of AQUAID?</p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-[#4F5D75] hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-600 cursor-pointer"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {isMenuOpen && (
        <div className="fixed inset-0 z-[70] flex pointer-events-auto">
          <div
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0"
            style={{ background: 'rgba(2, 10, 24, 0.72)', backdropFilter: 'blur(5px)', WebkitBackdropFilter: 'blur(5px)' }}
          />
          <div
            className="relative w-[88vw] max-w-[320px] h-full flex flex-col z-10 p-4 sm:p-6"
            style={{
              background: 'linear-gradient(180deg, #FFFFFF 0%, #F7F9FC 100%)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              boxShadow: '16px 0 48px rgba(17,17,17,0.22)',
              borderRight: '1px solid rgba(31,63,175,0.14)',
            }}
          >
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2.5">
                <img
                  src={logo}
                  alt="AQUAID Logo"
                  className="w-8 h-8 rounded-lg object-contain"
                  style={{ background: 'linear-gradient(135deg, #4FC3F7, #1F3FAF)' }}
                />
                <span className="font-black text-lg text-[#111111] tracking-wider">AQUAID</span>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-1.5 rounded-xl hover:bg-[#1F3FAF]/5 text-[#94a3b8] hover:text-[#111111] cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div
              className="mb-6 p-4 rounded-2xl flex items-center gap-3"
              style={{
                background: 'rgba(79,195,247,0.12)',
                border: '1px solid rgba(31,63,175,0.10)',
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #4FC3F7, #1F3FAF)' }}
              >
                {userName ? userName.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-[#4F5D75] font-medium">Signed in as</p>
                <p className="font-bold text-[#111111] truncate text-sm">
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
                        : 'text-[#4F5D75] hover:text-[#111111] hover:bg-[#1F3FAF]/5'
                    }`}
                    style={isActive ? {
                      background: 'linear-gradient(135deg, #4FC3F7, #1F3FAF)',
                      boxShadow: '0 8px 24px rgba(31,63,175,0.18)',
                    } : {}}
                  >
                    <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? 'text-white' : 'text-[#1F3FAF]'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="mt-auto space-y-3">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setShowLogoutConfirm(true);
                }}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-100 cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>

              <div className="border-t pt-4 text-center" style={{ borderColor: 'rgba(0,56,115,0.06)' }}>
                <p className="text-[10px] text-[#4F5D75] font-semibold uppercase tracking-widest">AQUAID</p>
                <p className="text-[9px] text-[#4F5D75]">v2.0.0</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AppLayout;
