import React from 'react';
import { motion } from 'motion/react';
import {
  Camera, BookOpen, User, Home as HomeIcon,
  Image as ImageIcon, ChevronRight, Menu, BarChart3,
  History, Heart, Info, HelpCircle, Settings as SettingsIcon,
  LogOut, X,
} from 'lucide-react';
import { useAppStore } from '../../app/store';
import { SpeciesInfo } from '../../types';
import { useAppNavigation } from '../../navigation/AppNavigator';
import { EmptyState } from '../../components/EmptyState';
import splashBackground from '../../assets/backgrounds/splash_background.jpg';

/* ═══════════════════════════════════════════════════════════════════════
   AQUAID HOME DASHBOARD
   ═══════════════════════════════════════════════════════════════════════ */

// ── Primary Action Cards ────────────────────────────────────────────────
const actionCards = [
  {
    id: 'scan',
    title: 'Scan Fish',
    description: 'Use camera to detect fish',
    icon: Camera,
    route: 'Camera' as const,
    gradient: 'linear-gradient(135deg, #1F3FAF 0%, #111111 100%)',
  },
  {
    id: 'upload',
    title: 'Upload Image',
    description: 'Choose from your gallery',
    icon: ImageIcon,
    route: 'Upload' as const,
    gradient: 'linear-gradient(135deg, #1F3FAF 0%, #111111 100%)',
  },
  {
    id: 'library',
    title: 'Species Library',
    description: 'Explore fish species',
    icon: BookOpen,
    route: 'Guide' as const,
    gradient: 'linear-gradient(135deg, #1F3FAF 0%, #111111 100%)',
  },
];

// ── Bottom Nav Items ────────────────────────────────────────────────────
const bottomNavItems = [
  { id: 'home', label: 'Home', icon: HomeIcon, route: 'Home' as const },
  { id: 'scan', label: 'Scan', icon: Camera, route: 'Camera' as const },
  { id: 'library', label: 'Library', icon: BookOpen, route: 'Guide' as const },
  { id: 'history', label: 'History', icon: BookOpen, route: 'History' as const },
  { id: 'profile', label: 'Profile', icon: User, route: 'Settings' as const },
];

const sideMenuItems = [
  { label: 'Home', icon: HomeIcon, route: 'Home' as const },
  { label: 'Analytics', icon: BarChart3, route: 'Analytics' as const },
  { label: 'Settings', icon: SettingsIcon, route: 'Settings' as const },
  { label: 'Fish Guide', icon: BookOpen, route: 'Guide' as const },
  { label: 'Scan History', icon: History, route: 'History' as const },
  { label: 'Saved Results', icon: Heart, route: 'SavedResults' as const },
  { label: 'About', icon: Info, route: 'About' as const },
  { label: 'Help', icon: HelpCircle, route: 'Help' as const },
];

export const Home: React.FC = () => {
  const { userName, history, setUserName, setOnboardingCompleted, setIsGuestMode } = useAppStore();
  const { currentRoute, navigate, setSelectedSpecies, setMenuOpen, isMenuOpen } = useAppNavigation();

  const handleNavigateToDetail = (item: SpeciesInfo) => {
    setSelectedSpecies(item);
    navigate('Detail');
  };

  const handleLogout = async () => {
    await setUserName('');
    await setOnboardingCompleted(false);
    setIsGuestMode(false);
    setMenuOpen(false);
    navigate('Login');
  };

  return (
    <div
      className="fixed inset-0 z-0 flex flex-col overflow-hidden select-none"
      style={{
        background: 'linear-gradient(180deg, #F7F9FC 0%, #F7F9FC 40%, #FFFFFF 100%)',
        fontFamily: '"Poppins", sans-serif',
        color: '#111111',
      }}
    >
      <img src={splashBackground} alt="Dashboard background" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-[#F7F9FC]/90 to-white/95" />

      {/* ── Header ── */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-30 flex items-center justify-between px-5 pt-4 pb-2"
        style={{ paddingTop: 'max(16px, env(safe-area-inset-top))' }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMenuOpen(true)}
            className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer bg-white transition-colors hover:bg-[#F7F9FC]"
            style={{ border: '1.5px solid rgba(31,63,175,0.12)', boxShadow: '0 8px 24px rgba(31,63,175,0.10)' }}
            aria-label="Open menu"
          >
            <div className="flex flex-col items-center justify-center gap-[3px]">
              <span className="block h-[2px] w-[16px] rounded-full bg-[#1F3FAF]" />
              <span className="block h-[2px] w-[16px] rounded-full bg-[#1F3FAF]" />
              <span className="block h-[2px] w-[16px] rounded-full bg-[#1F3FAF]" />
            </div>
          </button>

          <div>
            <h1 className="text-xl font-bold text-[#111111]">
              Hello, {userName || 'Explorer'}! 👋
            </h1>
            <p className="text-[13px] font-medium text-[#4F5D75] mt-0.5">What do you want to do today?</p>
          </div>
        </div>

        <button
          onClick={() => navigate('Settings')}
          className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer bg-white transition-colors hover:bg-[#F7F9FC]"
          style={{ border: '1.5px solid rgba(31,63,175,0.12)', boxShadow: '0 8px 24px rgba(31,63,175,0.10)' }}
        >
          <User className="w-[18px] h-[18px] text-[#1F3FAF]" />
        </button>
      </motion.header>

      {/* ── Scrollable Content ── */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 pb-24">
        <div className="px-5 pt-3 pb-8">
          {/* ── Action Cards ── */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="space-y-3 mb-8"
          >
            {actionCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.button
                  key={card.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.4 }}
                  onClick={() => navigate(card.route)}
                  className="w-full flex items-center gap-4 rounded-2xl px-5 py-4 cursor-pointer transition-transform duration-200 active:scale-[0.98]"
                  style={{ background: card.gradient, boxShadow: '0 10px 24px rgba(31,63,175,0.18)' }}
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/20">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-[15px] font-bold text-white">{card.title}</p>
                    <p className="text-[12px] font-medium text-white/75">{card.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 shrink-0 text-white/80" />
                </motion.button>
              );
            })}
          </motion.section>

          {/* ── Recent Scans ── */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-base font-bold text-[#111111]">Recent Scans</h2>
              {history.length > 0 && (
                <button
                  onClick={() => navigate('History')}
                  className="text-xs text-[#1F3FAF] font-bold hover:underline cursor-pointer"
                >
                  See all
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <EmptyState message="No scans yet." subtitle="Tap 'Scan Fish' or upload a photo to identify your first species." type="history" />
            ) : (
              <div className="flex overflow-x-auto gap-3 pb-1 -mx-5 px-5 hide-scrollbar snap-x">
                {history.slice(0, 10).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavigateToDetail(item)}
                    className="flex-shrink-0 w-24 flex flex-col items-center gap-2 snap-start cursor-pointer transition-transform duration-200 active:scale-95"
                  >
                    <div className="h-24 w-24 overflow-hidden rounded-2xl bg-[#F7F9FC]" style={{ boxShadow: '0 10px 24px rgba(31,63,175,0.10)' }}>
                      <img
                        src={item.imageUrl}
                        alt={item.commonName}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span className="text-[12px] font-medium text-[#4F5D75] truncate w-full text-center">
                      {item.commonName}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </motion.section>
        </div>
      </main>

      {/* ── Bottom Navigation Bar ── */}
      <nav className="aquaid-bottom-nav" style={{ paddingBottom: 'max(0px, env(safe-area-inset-bottom))' }}>
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentRoute === item.route || (item.id === 'home' && currentRoute === 'Home');
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.route)}
              className={`aquaid-bottom-nav-item ${isActive ? 'active' : ''}`}
              style={{ color: isActive ? '#1F3FAF' : '#94a3b8' }}
            >
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-semibold">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] flex">
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
              boxShadow: '4px 0 32px rgba(17,17,17,0.10)',
              borderRight: '1px solid rgba(31,63,175,0.08)',
            }}
          >
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #4FC3F7, #1F3FAF)' }}
                >
                  <Menu className="w-4 h-4 text-white" />
                </div>
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
              {sideMenuItems.map((item) => {
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
                onClick={handleLogout}
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

export default Home;``