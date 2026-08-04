import React from 'react';
import { motion } from 'motion/react';
import {
  Camera,
  BookOpen,
  User,
  Home as HomeIcon,
  Image as ImageIcon,
  ChevronRight,
  Menu,
  BarChart3,
  History,
  Heart,
  Info,
  HelpCircle,
  Settings as SettingsIcon,
  LogOut,
  X,
  Bookmark,
  ShieldCheck,
} from 'lucide-react';

import { useAppStore } from '../../app/store';
import { SpeciesInfo } from '../../types';
import { useAppNavigation } from '../../navigation/AppNavigator';
import { EmptyState } from '../../components/EmptyState';
import splashBackground from '../../assets/backgrounds/splash_background.jpg';

/* ═══════════════════════════════════════════════════════════════════════
   AQUAID HOME DASHBOARD
   Redesigned UI — existing logic preserved
   ═══════════════════════════════════════════════════════════════════════ */

/* ── Bottom Navigation ─────────────────────────────────────────────── */

const bottomNavItems = [
  {
    id: 'home',
    label: 'Home',
    icon: HomeIcon,
    route: 'Home' as const,
  },
  {
    id: 'scan',
    label: 'Scan',
    icon: Camera,
    route: 'Camera' as const,
  },
  {
    id: 'library',
    label: 'Library',
    icon: BookOpen,
    route: 'Guide' as const,
  },
  {
    id: 'history',
    label: 'History',
    icon: History,
    route: 'History' as const,
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: User,
    route: 'Settings' as const,
  },
];

/* ── Side Menu ─────────────────────────────────────────────────────── */

const sideMenuItems = [
  {
    label: 'Home',
    icon: HomeIcon,
    route: 'Home' as const,
  },
  {
    label: 'Analytics',
    icon: BarChart3,
    route: 'Analytics' as const,
  },
  {
    label: 'Settings',
    icon: SettingsIcon,
    route: 'Settings' as const,
  },
  {
    label: 'Fish Guide',
    icon: BookOpen,
    route: 'Guide' as const,
  },
  {
    label: 'Scan History',
    icon: History,
    route: 'History' as const,
  },
  {
    label: 'Saved Results',
    icon: Heart,
    route: 'SavedResults' as const,
  },
  {
    label: 'About',
    icon: Info,
    route: 'About' as const,
  },
  {
    label: 'Help',
    icon: HelpCircle,
    route: 'Help' as const,
  },
];

/* ═══════════════════════════════════════════════════════════════════════
   HOME
   ═══════════════════════════════════════════════════════════════════════ */

export const Home: React.FC = () => {
  const {
    userName,
    history,
    setUserName,
    setOnboardingCompleted,
    setIsGuestMode,
  } = useAppStore();

  const {
    currentRoute,
    navigate,
    setSelectedSpecies,
    setMenuOpen,
    isMenuOpen,
  } = useAppNavigation();

  /* ── Existing detail logic ─────────────────────────────────────── */

  const handleNavigateToDetail = (item: SpeciesInfo) => {
    setSelectedSpecies(item);
    navigate('Detail');
  };

  /* ── Existing logout logic ──────────────────────────────────────── */

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
        background:
          'linear-gradient(180deg, #EAF7FF 0%, #F5FBFF 45%, #FFFFFF 100%)',
        fontFamily: '"Poppins", sans-serif',
        color: '#102A43',
      }}
    >
      {/* ═══════════════════════════════════════════════════════════════
          BACKGROUND
          ═══════════════════════════════════════════════════════════════ */}

      <img
        src={splashBackground}
        alt="Dashboard background"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(239,250,255,0.78) 0%, rgba(242,250,255,0.91) 48%, rgba(255,255,255,0.97) 100%)',
        }}
      />

      {/* ═══════════════════════════════════════════════════════════════
          HEADER
          ═══════════════════════════════════════════════════════════════ */}

      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-30 flex items-center justify-between px-5 pt-4 pb-3"
        style={{
          paddingTop: 'max(16px, env(safe-area-inset-top))',
        }}
      >
        {/* Menu */}

        <button
          onClick={() => setMenuOpen(true)}
          className="w-11 h-11 rounded-full flex items-center justify-center cursor-pointer bg-white active:scale-95 transition-transform"
          style={{
            border: '1px solid rgba(31,63,175,0.10)',
            boxShadow: '0 8px 24px rgba(31,63,175,0.10)',
          }}
          aria-label="Open menu"
        >
          <Menu
            className="w-6 h-6"
            strokeWidth={2.3}
            style={{ color: '#1747B5' }}
          />
        </button>

        {/* Greeting */}

        <div className="flex-1 px-4">
          <h1 className="text-[20px] sm:text-[22px] font-bold text-[#102A43] leading-tight">
            Hello, {userName || 'Explorer'}! 👋
          </h1>

          <p className="text-[12px] sm:text-[13px] font-medium text-[#52677D] mt-1">
            Discover. Identify. Protect.
          </p>
        </div>

        {/* Profile */}

        <button
          onClick={() => navigate('Settings')}
          className="w-11 h-11 rounded-full flex items-center justify-center cursor-pointer bg-white active:scale-95 transition-transform"
          style={{
            border: '1px solid rgba(31,63,175,0.10)',
            boxShadow: '0 8px 24px rgba(31,63,175,0.10)',
          }}
          aria-label="Profile"
        >
          <User
            className="w-5 h-5"
            strokeWidth={2}
            style={{ color: '#1747B5' }}
          />
        </button>
      </motion.header>

      {/* ═══════════════════════════════════════════════════════════════
          MAIN CONTENT
          ═══════════════════════════════════════════════════════════════ */}

      <main
        className="relative z-10 flex-1 overflow-y-auto pb-28"
        style={{
          scrollbarWidth: 'none',
        }}
      >
        <div className="px-5 sm:px-6 max-w-2xl mx-auto space-y-6">

          {/* ═══════════════════════════════════════════════════════════
              HERO SCAN CARD
              ═══════════════════════════════════════════════════════════ */}

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <button
              onClick={() => navigate('Camera')}
              className="relative w-full overflow-hidden rounded-[28px] text-left cursor-pointer active:scale-[0.985] transition-transform"
              style={{
                minHeight: '205px',
                background:
                  'linear-gradient(135deg, #078BD3 0%, #1263C7 48%, #10265F 100%)',
                boxShadow: '0 18px 40px rgba(20,87,170,0.25)',
              }}
            >
              {/* Decorative bubbles */}

              <div
                className="absolute -right-10 -top-16 w-48 h-48 rounded-full"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                }}
              />

              <div
                className="absolute right-16 -bottom-20 w-40 h-40 rounded-full"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                }}
              />

              {/* Background fish image */}

              <img
                src={splashBackground}
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-screen"
              />

              <div className="relative z-10 p-6 flex items-center min-h-[205px]">

                {/* Camera Icon */}

                <div
                  className="w-[76px] h-[76px] rounded-[24px] flex items-center justify-center shrink-0"
                  style={{
                    background: 'rgba(255,255,255,0.18)',
                    border: '1px solid rgba(255,255,255,0.25)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <Camera
                    className="w-9 h-9 text-white"
                    strokeWidth={1.8}
                  />
                </div>

                {/* Text */}

                <div className="ml-5 flex-1 min-w-0">
                  <p className="text-[25px] font-bold text-white leading-tight">
                    Scan Fish
                  </p>

                  <p className="text-[13px] text-white/80 font-medium mt-1 leading-relaxed">
                    Use your camera to identify fish instantly
                  </p>

                  <div
                    className="inline-flex items-center gap-2 mt-4 rounded-full px-4 py-2 bg-white"
                    style={{
                      boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
                    }}
                  >
                    <span className="text-[12px] font-bold text-[#1647A8]">
                      Start Scanning
                    </span>

                    <ChevronRight
                      className="w-4 h-4 text-[#1647A8]"
                      strokeWidth={2.5}
                    />
                  </div>
                </div>
              </div>
            </button>
          </motion.section>

          {/* ═══════════════════════════════════════════════════════════
              QUICK ACTIONS
              ═══════════════════════════════════════════════════════════ */}

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.12,
              duration: 0.5,
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[18px] font-bold text-[#102A43]">
                Quick Actions
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-3">

              {/* Upload */}

              <button
                onClick={() => navigate('Upload')}
                className="bg-white rounded-[22px] p-4 text-left cursor-pointer active:scale-[0.97] transition-transform"
                style={{
                  boxShadow: '0 8px 25px rgba(31,63,175,0.09)',
                  border: '1px solid rgba(31,63,175,0.06)',
                }}
              >
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center mb-4"
                  style={{
                    background: '#E6F5FF',
                  }}
                >
                  <ImageIcon
                    className="w-5 h-5"
                    style={{ color: '#1489D5' }}
                  />
                </div>

                <p className="text-[12px] font-bold text-[#102A43] leading-tight">
                  Upload Image
                </p>

                <p className="text-[10px] text-[#70839A] mt-2 leading-relaxed">
                  Choose from your gallery
                </p>

                <ChevronRight
                  className="w-4 h-4 mt-3"
                  style={{ color: '#7990A8' }}
                />
              </button>

              {/* Library */}

              <button
                onClick={() => navigate('Guide')}
                className="bg-white rounded-[22px] p-4 text-left cursor-pointer active:scale-[0.97] transition-transform"
                style={{
                  boxShadow: '0 8px 25px rgba(31,63,175,0.09)',
                  border: '1px solid rgba(31,63,175,0.06)',
                }}
              >
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center mb-4"
                  style={{
                    background: '#E7F8F1',
                  }}
                >
                  <BookOpen
                    className="w-5 h-5"
                    style={{ color: '#1CA978' }}
                  />
                </div>

                <p className="text-[12px] font-bold text-[#102A43] leading-tight">
                  Species Library
                </p>

                <p className="text-[10px] text-[#70839A] mt-2 leading-relaxed">
                  Explore fish species
                </p>

                <ChevronRight
                  className="w-4 h-4 mt-3"
                  style={{ color: '#7990A8' }}
                />
              </button>

              {/* Saved */}

              <button
                onClick={() => navigate('SavedResults')}
                className="bg-white rounded-[22px] p-4 text-left cursor-pointer active:scale-[0.97] transition-transform"
                style={{
                  boxShadow: '0 8px 25px rgba(31,63,175,0.09)',
                  border: '1px solid rgba(31,63,175,0.06)',
                }}
              >
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center mb-4"
                  style={{
                    background: '#F0EBFF',
                  }}
                >
                  <Bookmark
                    className="w-5 h-5"
                    style={{ color: '#7655D8' }}
                  />
                </div>

                <p className="text-[12px] font-bold text-[#102A43] leading-tight">
                  Saved Results
                </p>

                <p className="text-[10px] text-[#70839A] mt-2 leading-relaxed">
                  View saved fish
                </p>

                <ChevronRight
                  className="w-4 h-4 mt-3"
                  style={{ color: '#7990A8' }}
                />
              </button>

            </div>
          </motion.section>

          {/* ═══════════════════════════════════════════════════════════
              RECENT SCANS
              ═══════════════════════════════════════════════════════════ */}

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.22,
              duration: 0.5,
            }}
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-[18px] font-bold text-[#102A43]">
                Recent Scans
              </h2>

              {history.length > 0 && (
                <button
                  onClick={() => navigate('History')}
                  className="text-[12px] text-[#1762C4] font-bold cursor-pointer"
                >
                  View All
                  <ChevronRight className="inline w-3.5 h-3.5 ml-0.5" />
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <div
                className="rounded-[24px] overflow-hidden"
                style={{
                  background: 'rgba(255,255,255,0.72)',
                  border: '1px solid rgba(31,63,175,0.08)',
                }}
              >
                <EmptyState
                  message="No scans yet."
                  subtitle="Tap 'Scan Fish' or upload a photo to identify your first species."
                  type="history"
                />
              </div>
            ) : (
              <div
                className="rounded-[24px] overflow-hidden bg-white"
                style={{
                  boxShadow: '0 8px 25px rgba(31,63,175,0.08)',
                  border: '1px solid rgba(31,63,175,0.06)',
                }}
              >
                {history.slice(0, 5).map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavigateToDetail(item)}
                    className="w-full flex items-center gap-3 p-3.5 text-left cursor-pointer hover:bg-[#F7FBFF] active:bg-[#F0F7FC] transition-colors"
                    style={{
                      borderBottom:
                        index < Math.min(history.length, 5) - 1
                          ? '1px solid rgba(31,63,175,0.07)'
                          : 'none',
                    }}
                  >
                    {/* Image */}

                    <div
                      className="w-[68px] h-[68px] shrink-0 overflow-hidden rounded-[16px]"
                      style={{
                        background: '#EAF4FA',
                      }}
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.commonName}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Species Info */}

                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-bold text-[#102A43] truncate">
                        {item.commonName}
                      </p>

                      {item.scientificName && (
                        <p className="text-[11px] italic text-[#7890A6] truncate mt-1">
                          {item.scientificName}
                        </p>
                      )}

                      <p className="text-[10px] text-[#8A9BAD] mt-1">
                        Identification result
                      </p>
                    </div>

                    <ChevronRight
                      className="w-5 h-5 shrink-0"
                      style={{ color: '#8296A9' }}
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.section>

          {/* ═══════════════════════════════════════════════════════════
              CONSERVATION CARD
              ═══════════════════════════════════════════════════════════ */}

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.3,
              duration: 0.5,
            }}
          >
            <button
              onClick={() => navigate('About')}
              className="w-full flex items-center gap-3.5 rounded-[22px] p-4 text-left cursor-pointer active:scale-[0.985] transition-transform"
              style={{
                background:
                  'linear-gradient(135deg, #E8F6FF 0%, #F1FAFF 100%)',
                border: '1px solid rgba(36,137,205,0.12)',
              }}
            >
              <div
                className="w-11 h-11 rounded-full shrink-0 flex items-center justify-center"
                style={{
                  background: '#D9F0FF',
                }}
              >
                <ShieldCheck
                  className="w-5 h-5"
                  style={{ color: '#1673C4' }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-[#163B61]">
                  Every scan helps protect our oceans.
                </p>

                <p className="text-[10.5px] text-[#64819B] mt-1">
                  Learn more about marine conservation.
                </p>
              </div>

              <ChevronRight
                className="w-5 h-5 shrink-0"
                style={{ color: '#66839D' }}
              />
            </button>
          </motion.section>

        </div>
      </main>

      {/* ═══════════════════════════════════════════════════════════════
          BOTTOM NAVIGATION
          ═══════════════════════════════════════════════════════════════ */}

      <nav
        className="aquaid-bottom-nav"
        style={{
          paddingBottom: 'max(0px, env(safe-area-inset-bottom))',
        }}
      >
        {bottomNavItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            currentRoute === item.route ||
            (item.id === 'home' && currentRoute === 'Home');

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.route)}
              className={`aquaid-bottom-nav-item ${
                isActive ? 'active' : ''
              }`}
              style={{
                color: isActive ? '#1F3FAF' : '#94a3b8',
              }}
            >
              <Icon
                className="w-5 h-5"
                strokeWidth={isActive ? 2.5 : 2}
              />

              <span className="text-[10px] font-semibold">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* ═══════════════════════════════════════════════════════════════
          SIDE MENU
          ═══════════════════════════════════════════════════════════════ */}

      {isMenuOpen && (
        <div className="fixed inset-0 z-[70] flex pointer-events-auto">

          {/* Overlay */}

          <div
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0"
            style={{
              background: 'rgba(2, 10, 24, 0.72)',
              backdropFilter: 'blur(5px)',
              WebkitBackdropFilter: 'blur(5px)',
            }}
          />

          {/* Drawer */}

          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
            className="relative w-[88vw] max-w-[320px] h-full flex flex-col z-10 p-4 sm:p-6"
            style={{
              background:
                'linear-gradient(180deg, #FFFFFF 0%, #F7F9FC 100%)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              boxShadow: '16px 0 48px rgba(17,17,17,0.22)',
              borderRight: '1px solid rgba(31,63,175,0.14)',
            }}
          >

            {/* Menu Header */}

            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2.5">

                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{
                    background:
                      'linear-gradient(135deg, #4FC3F7, #1F3FAF)',
                  }}
                >
                  <Menu className="w-4 h-4 text-white" />
                </div>

                <span className="font-black text-lg text-[#111111] tracking-wider">
                  AQUAID
                </span>

              </div>

              <button
                onClick={() => setMenuOpen(false)}
                className="p-1.5 rounded-xl hover:bg-[#1F3FAF]/5 text-[#94a3b8] hover:text-[#111111] cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Card */}

            <div
              className="mb-6 p-4 rounded-2xl flex items-center gap-3"
              style={{
                background: 'rgba(79,195,247,0.12)',
                border: '1px solid rgba(31,63,175,0.10)',
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                style={{
                  background:
                    'linear-gradient(135deg, #4FC3F7, #1F3FAF)',
                }}
              >
                {userName
                  ? userName.charAt(0).toUpperCase()
                  : 'A'}
              </div>

              <div className="min-w-0">
                <p className="text-[11px] text-[#4F5D75] font-medium">
                  Signed in as
                </p>

                <p className="font-bold text-[#111111] truncate text-sm">
                  {userName || 'Explorer'}
                </p>
              </div>
            </div>

            {/* Menu Items */}

            <nav className="flex-grow flex flex-col gap-1 overflow-y-auto">
              {sideMenuItems.map((item) => {
                const Icon = item.icon;

                const isActive =
                  currentRoute === item.route;

                return (
                  <button
                    key={item.route}
                    onClick={() => {
                      navigate(item.route);
                      setMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold transition-all text-sm cursor-pointer ${
                      isActive
                        ? 'text-white'
                        : 'text-[#4F5D75] hover:text-[#111111] hover:bg-[#1F3FAF]/5'
                    }`}
                    style={
                      isActive
                        ? {
                            background:
                              'linear-gradient(135deg, #4FC3F7, #1F3FAF)',
                            boxShadow:
                              '0 8px 24px rgba(31,63,175,0.18)',
                          }
                        : {}
                    }
                  >
                    <Icon
                      className={`w-[18px] h-[18px] flex-shrink-0 ${
                        isActive
                          ? 'text-white'
                          : 'text-[#1F3FAF]'
                      }`}
                    />

                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Logout */}

            <div className="mt-auto space-y-3">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-100 cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>

              <div
                className="border-t pt-4 text-center"
                style={{
                  borderColor: 'rgba(0,56,115,0.06)',
                }}
              >
                <p className="text-[10px] text-[#4F5D75] font-semibold uppercase tracking-widest">
                  AQUAID
                </p>

                <p className="text-[9px] text-[#4F5D75]">
                  v2.0.0
                </p>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Home;