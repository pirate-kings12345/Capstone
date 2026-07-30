import React from 'react';
import { motion } from 'motion/react';
import {
  Camera, BookOpen, History, Heart, Settings, Info,
  Bell, Scan, User, Home as HomeIcon, Image as ImageIcon,
  Database, TrendingUp, Sparkles, Award, ChevronRight, Anchor
} from 'lucide-react';
import { useAppStore } from '../../app/store';
import { SpeciesInfo } from '../../types';
import { useAppNavigation } from '../../navigation/AppNavigator';
import { EmptyState } from '../../components/EmptyState';
import splashBackground from '../../assets/backgrounds/splash_background.jpg';
import logo from '../../assets/logos/LogoForLanding.png';

/* ═══════════════════════════════════════════════════════════════════════
   AQUAID HOME DASHBOARD
   Ocean-themed premium dashboard with glassmorphism cards
   ═══════════════════════════════════════════════════════════════════════ */

// ── Feature Card Data ───────────────────────────────────────────────────
const featureCards = [
  {
    id: 'scanner',
    title: 'AI Scanner',
    description: 'Identify fish instantly with AI',
    icon: Scan,
    route: 'Camera' as const,
    gradient: 'linear-gradient(135deg, #0A66FF 0%, #005BBB 100%)',
    iconColor: '#0A66FF',
    iconBg: 'rgba(10,102,255,0.1)',
  },
  {
    id: 'guide',
    title: 'Fish Guide',
    description: 'Explore aquatic species',
    icon: BookOpen,
    route: 'Guide' as const,
    gradient: 'linear-gradient(135deg, #35D6FF 0%, #0A66FF 100%)',
    iconColor: '#35D6FF',
    iconBg: 'rgba(53,214,255,0.1)',
  },
  {
    id: 'history',
    title: 'Scan History',
    description: 'View past identifications',
    icon: History,
    route: 'History' as const,
    gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    iconColor: '#10B981',
    iconBg: 'rgba(16,185,129,0.1)',
  },
  {
    id: 'saved',
    title: 'Saved Results',
    description: 'Your bookmarked species',
    icon: Heart,
    route: 'SavedResults' as const,
    gradient: 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)',
    iconColor: '#F43F5E',
    iconBg: 'rgba(244,63,94,0.1)',
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'Customize your experience',
    icon: Settings,
    route: 'Settings' as const,
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
    iconColor: '#8B5CF6',
    iconBg: 'rgba(139,92,246,0.1)',
  },
  {
    id: 'about',
    title: 'About',
    description: 'Learn about AQUAID',
    icon: Info,
    route: 'About' as const,
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    iconColor: '#F59E0B',
    iconBg: 'rgba(245,158,11,0.1)',
  },
];

// ── Marine Tips ─────────────────────────────────────────────────────────
const marineTips = [
  {
    id: 1,
    emoji: '🐢',
    title: 'Sea Turtles',
    text: 'Sea turtles have existed for over 100 million years, even outliving the dinosaurs.',
    color: '#10B981',
  },
  {
    id: 2,
    emoji: '🪸',
    title: 'Coral Reefs',
    text: 'Coral reefs support 25% of all marine species, but cover less than 1% of the ocean floor.',
    color: '#F43F5E',
  },
  {
    id: 3,
    emoji: '🐋',
    title: 'Blue Whales',
    text: 'A blue whale\'s heart is so large that a small child could crawl through its arteries.',
    color: '#0A66FF',
  },
  {
    id: 4,
    emoji: '🌊',
    title: 'Ocean Conservation',
    text: 'Over 8 million tons of plastic enter the ocean each year. Every action counts.',
    color: '#35D6FF',
  },
  {
    id: 5,
    emoji: '🐠',
    title: 'Clownfish',
    text: 'Clownfish can change their sex. All clownfish are born male and the dominant becomes female.',
    color: '#F59E0B',
  },
];

// ── Bottom Nav Items ────────────────────────────────────────────────────
const bottomNavItems = [
  { id: 'home', label: 'Home', icon: HomeIcon, route: 'Home' as const },
  { id: 'scanner', label: 'Scanner', icon: Camera, route: 'Camera' as const },
  { id: 'history', label: 'History', icon: History, route: 'History' as const },
  { id: 'guide', label: 'Guide', icon: BookOpen, route: 'Guide' as const },
  { id: 'profile', label: 'Profile', icon: User, route: 'Settings' as const },
];

export const Home: React.FC = () => {
  const { userName, history } = useAppStore();
  const { currentRoute, navigate, setSelectedSpecies, setMenuOpen } = useAppNavigation();

  const handleNavigateToDetail = (item: SpeciesInfo) => {
    setSelectedSpecies(item);
    navigate('Detail');
  };

  return (
    <div
      className="fixed inset-0 z-0 flex flex-col overflow-hidden select-none"
      style={{
        background: 'linear-gradient(180deg, #E8F4FD 0%, #F5FAFF 40%, #FFFFFF 100%)',
        fontFamily: '"Poppins", sans-serif',
      }}
    >
      <img src={splashBackground} alt="Dashboard background" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-slate-100/70 to-white/95" />

      {/* ── Subtle water background ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-0 right-0 h-72 opacity-40"
          style={{
            background: 'radial-gradient(ellipse 120% 100% at 50% 0%, rgba(10,102,255,0.08) 0%, transparent 70%)',
          }}
        />
        {/* Animated caustics — very subtle */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              radial-gradient(ellipse 150px 100px at 30% 20%, rgba(53,214,255,0.8) 0%, transparent 70%),
              radial-gradient(ellipse 200px 150px at 70% 50%, rgba(10,102,255,0.6) 0%, transparent 70%)
            `,
            animation: 'water-caustics 15s ease-in-out infinite',
          }}
        />
      </div>

      {/* ── Header ── */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-30 flex items-center justify-between px-5 pt-4 pb-3"
        style={{ paddingTop: 'max(16px, env(safe-area-inset-top))' }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMenuOpen(true)}
            className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-colors hover:bg-[#0A66FF]/5"
            style={{ border: '1.5px solid rgba(0,56,115,0.08)' }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 4.5h14M2 9h10M2 13.5h14" stroke="#1a2a3a" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <div>
            <p className="text-[11px] font-medium text-[#64748b]">Welcome back</p>
            <h1 className="text-lg font-bold text-[#1a2a3a] -mt-0.5">
              Hello, {userName || 'Explorer'} 👋
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-colors hover:bg-[#0A66FF]/5 relative"
            style={{ border: '1.5px solid rgba(0,56,115,0.08)' }}
          >
            <Bell className="w-[18px] h-[18px] text-[#475569]" />
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#F43F5E]" />
          </button>
          <button
            onClick={() => navigate('Settings')}
            className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer text-white font-bold text-sm"
            style={{
              background: 'linear-gradient(135deg, #0A66FF 0%, #005BBB 100%)',
              boxShadow: '0 2px 10px rgba(10,102,255,0.25)',
            }}
          >
            {userName ? userName.charAt(0).toUpperCase() : 'A'}
          </button>
        </div>
      </motion.header>

      {/* ── Scrollable Content ── */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 pb-20">
        <div className="px-5 pt-2 pb-8">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="relative mb-5 overflow-hidden rounded-[28px] border border-white/70 bg-white/70 p-4 shadow-[0_14px_40px_rgba(10,102,255,0.12)] backdrop-blur-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#0A66FF]/10 via-transparent to-[#35D6FF]/10" />
            <div className="relative flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 shadow-sm">
                <img src={logo} alt="AQUAID Logo" className="h-8 w-8 object-contain" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#64748b]">Dashboard</p>
                <h2 className="text-base font-semibold text-[#1a2a3a]">Ready to explore the ocean</h2>
              </div>
            </div>
            <p className="relative mt-3 text-sm font-medium leading-relaxed text-[#475569]">
              Your temporary sign-in is complete. Choose a feature below to begin identifying marine life and browsing insights.
            </p>
          </motion.section>

          {/* ── Quick Actions ── */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="grid grid-cols-2 gap-3 mb-5"
          >
            <button
              onClick={() => navigate('Camera')}
              className="relative h-[120px] rounded-2xl overflow-hidden flex flex-col items-center justify-center gap-2 group cursor-pointer transition-all duration-300 active:scale-[0.97]"
              style={{
                background: 'linear-gradient(135deg, #0A66FF 0%, #005BBB 100%)',
                boxShadow: '0 4px 20px rgba(10,102,255,0.25)',
              }}
            >
              <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center border border-white/20 group-hover:scale-105 transition-transform">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-white">Scan Aqua Life</p>
                <p className="text-[10px] text-white/70 font-medium">AI Camera</p>
              </div>
            </button>

            <button
              onClick={() => navigate('Upload')}
              className="relative h-[120px] rounded-2xl overflow-hidden flex flex-col items-center justify-center gap-2 group cursor-pointer transition-all duration-300 active:scale-[0.97]"
              style={{
                background: 'rgba(255,255,255,0.75)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1.5px solid rgba(0,56,115,0.06)',
                boxShadow: '0 2px 12px rgba(0,56,115,0.06)',
              }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform"
                style={{ background: 'rgba(10,102,255,0.08)' }}
              >
                <ImageIcon className="w-6 h-6 text-[#0A66FF]" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-[#1a2a3a]">Upload Photo</p>
                <p className="text-[10px] text-[#64748b] font-medium">From Gallery</p>
              </div>
            </button>
          </motion.section>

          {/* ── Statistics ── */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="grid grid-cols-4 gap-2.5 mb-6"
          >
            {[
              { icon: Database, label: 'Scans', value: history.length, color: '#0A66FF' },
              { icon: TrendingUp, label: 'Sustainable', value: history.length > 0 ? `${Math.round((history.filter(h => h.sustainabilityStatus === 'Sustainable').length / history.length) * 100)}%` : '0%', color: '#10B981' },
              { icon: Sparkles, label: 'Hi-Conf', value: history.filter(h => h.confidence > 95).length, color: '#F59E0B' },
              { icon: Award, label: 'Level', value: `Lv ${Math.max(1, Math.floor(history.length / 3) + 1)}`, color: '#8B5CF6' },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="rounded-2xl p-3 flex flex-col items-center text-center transition-all duration-300 active:scale-[0.97]"
                style={{
                  background: 'rgba(255,255,255,0.75)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.9)',
                  boxShadow: '0 1px 8px rgba(0,56,115,0.04)',
                  animationDelay: `${i * 0.1}s`,
                }}
              >
                <stat.icon className="w-4 h-4 mb-1.5" style={{ color: stat.color }} />
                <span className="text-lg font-black text-[#1a2a3a] leading-none">{stat.value}</span>
                <span className="text-[8px] uppercase font-bold tracking-wider text-[#94a3b8] mt-1">{stat.label}</span>
              </div>
            ))}
          </motion.section>

          {/* ── Feature Cards ── */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-[#1a2a3a]">Features</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {featureCards.map((card, i) => {
                const Icon = card.icon;
                return (
                  <motion.button
                    key={card.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.06, duration: 0.4 }}
                    onClick={() => navigate(card.route)}
                    className="aquaid-feature-card rounded-2xl p-4 flex flex-col items-start text-left cursor-pointer"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                      style={{ background: card.iconBg }}
                    >
                      <Icon className="w-5 h-5" style={{ color: card.iconColor }} />
                    </div>
                    <h3 className="text-sm font-bold text-[#1a2a3a] mb-0.5">{card.title}</h3>
                    <p className="text-[11px] text-[#64748b] font-medium leading-tight">{card.description}</p>
                  </motion.button>
                );
              })}
            </div>
          </motion.section>

          {/* ── Marine Facts / Tips ── */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-[#1a2a3a]">
                <Anchor className="w-4 h-4 inline mr-1.5 -mt-0.5" style={{ color: '#0A66FF' }} />
                Ocean Discoveries
              </h2>
            </div>
            <div className="flex overflow-x-auto gap-3 pb-2 -mx-5 px-5 hide-scrollbar snap-x">
              {marineTips.map((tip) => (
                <div
                  key={tip.id}
                  className="flex-shrink-0 w-64 rounded-2xl p-4 snap-start transition-all duration-300 active:scale-[0.98]"
                  style={{
                    background: 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.9)',
                    boxShadow: '0 2px 12px rgba(0,56,115,0.05)',
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{tip.emoji}</span>
                    <h3 className="text-sm font-bold text-[#1a2a3a]">{tip.title}</h3>
                  </div>
                  <p className="text-[12px] text-[#64748b] leading-relaxed font-medium">{tip.text}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* ── Recent Identifications ── */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-base font-bold text-[#1a2a3a]">Recent Identifications</h2>
              {history.length > 0 && (
                <button
                  onClick={() => navigate('History')}
                  className="text-xs text-[#0A66FF] font-bold hover:underline cursor-pointer flex items-center gap-0.5"
                >
                  See All <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            {history.length === 0 ? (
              <EmptyState message="No scans yet." subtitle="Tap 'Scan Aqua Life' or upload a photo to identify your first species." type="history" />
            ) : (
              <div className="flex overflow-x-auto gap-3 pb-2 -mx-5 px-5 hide-scrollbar snap-x">
                {history.slice(0, 10).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleNavigateToDetail(item)}
                    className="flex-shrink-0 w-56 rounded-2xl overflow-hidden cursor-pointer snap-start transition-all duration-300 active:scale-[0.98] self-start"
                    style={{
                      background: 'rgba(255,255,255,0.85)',
                      border: '1px solid rgba(255,255,255,0.9)',
                      boxShadow: '0 2px 16px rgba(0,56,115,0.06)',
                    }}
                  >
                    <div className="h-32 w-full relative bg-[#E8F4FD]">
                      <img
                        src={item.imageUrl}
                        alt={item.commonName}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div
                        className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] text-white font-bold uppercase tracking-wider backdrop-blur-md ${
                          item.sustainabilityStatus === 'Sustainable'
                            ? 'bg-emerald-500/80'
                            : item.sustainabilityStatus === 'Caution'
                            ? 'bg-amber-500/80'
                            : 'bg-rose-500/80'
                        }`}
                      >
                        {item.sustainabilityStatus}
                      </div>
                    </div>
                    <div className="p-3">
                      <h4 className="font-bold text-sm text-[#1a2a3a] truncate">{item.commonName}</h4>
                      <p className="text-[11px] italic text-[#64748b] truncate mb-2">{item.scientificName}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-[#94a3b8] font-medium">{item.date}</span>
                        <span
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                          style={{ color: '#0A66FF', background: 'rgba(10,102,255,0.08)' }}
                        >
                          {item.confidence.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
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
              style={{ color: isActive ? '#0A66FF' : '#94a3b8' }}
            >
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-semibold">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Home;
