import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppNavigation } from '../../navigation/AppNavigator';
import { useAppStore } from '../../app/store';
import splashBackground from "../../assets/backgrounds/splash_background.jpg";
import logo from "../../assets/logos/LogoForLanding.png";
import { AuthService } from '../../services/firebase/AuthService';
import { SessionService } from '../../services/firebase/SessionService';

export const Splash: React.FC = () => {
  const { navigate } = useAppNavigation();
  const { isDbReady, setIsGuestMode, setUserName, setOnboardingCompleted } = useAppStore();
  
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [authResolved, setAuthResolved] = useState(false);
  const [targetRoute, setTargetRoute] = useState<'Home' | 'Login'>('Login');

  useEffect(() => {
    const initAuth = async () => {
      try {
        const authService = AuthService.getInstance();
        const sessionService = SessionService.getInstance();
        
        const sessionType = sessionService.loadSession();
        
        if (sessionType) {
          const { isLoggedIn } = await authService.initialize();
          
          if (isLoggedIn) {
            setIsGuestMode(sessionType === 'guest');
            if (sessionType === 'guest') {
              setUserName('Guest');
            } else {
              const user = authService.getCurrentUser();
              const rawName = user?.displayName || user?.email?.split('@')[0] || 'Aqua Explorer';
              const displayName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
              setUserName(displayName);
            }
            setOnboardingCompleted(true);
            setTargetRoute('Home');
          } else {
            // Firebase token invalid or logged out remotely
            sessionService.clearSession();
            setTargetRoute('Login');
          }
        } else {
          setTargetRoute('Login');
        }
      } catch (error) {
        console.error("Session restoration failed:", error);
        SessionService.getInstance().clearSession();
        setTargetRoute('Login');
      } finally {
        setAuthResolved(true);
      }
    };
    
    initAuth();
  }, [setIsGuestMode, setUserName, setOnboardingCompleted]);

  const handleTap = () => {
    if (isTransitioning || !isDbReady || !authResolved) return;
    setIsTransitioning(true);
    setTimeout(() => {
      navigate(targetRoute);
    }, 600); // Wait for transition animation to finish
  };

  return (
    <motion.div
      className="relative w-full h-screen overflow-hidden bg-black font-sans cursor-pointer"
      onClick={handleTap}
      animate={{ opacity: isTransitioning ? 0 : 1 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      {/* Background Image */}
      <img
        src={splashBackground}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark Gradient Overlay for better readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80" />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-between h-full px-6 py-12 pb-safe">

        {/* Top spacer */}
        <div className="flex-1" />

        {/* Center Content: Logo & Text */}
        <div className="flex flex-col items-center flex-[2] justify-center">

          {/* Logo Entrance Wrapper */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{
              opacity: 1,
              scale: isTransitioning ? 0.9 : 1
            }}
            transition={{
              opacity: { duration: 0.8, delay: 0.4 },
              scale: { duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
            }}
            className="relative flex justify-center items-center mb-8"
          >
            {/* Subtle Glow Behind Logo */}
            <div className="absolute inset-0 bg-white/10 blur-[40px] rounded-full scale-[1.8]" />

            {/* Logo Floating & Breathing */}
            <motion.div
              animate={{
                y: [0, -5, 0],
                scale: [1, 1.02, 1]
              }}
              transition={{
                duration: 4.5,
                ease: 'easeInOut',
                repeat: Infinity,
                delay: 1.2 // Starts floating smoothly after entrance
              }}
            >
              <img
                src={logo}
                alt="AQUAID Logo"
                className="relative w-32 h-32 object-contain drop-shadow-2xl z-10"
              />
            </motion.div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3, ease: 'easeOut' }}
            className="text-3xl font-semibold tracking-[0.25em] text-white mb-3 drop-shadow-lg"
          >
            AQUAID
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.7, ease: 'easeOut' }}
            className="text-[13px] font-light tracking-wide text-white/70 max-w-[260px] text-center leading-relaxed"
          >
            Fish Recognition & Classification System
          </motion.p>
        </div>

        {/* Bottom Instruction Text (Replaces Button) */}
        <div className="w-full flex-1 flex items-end justify-center pb-8">
          <AnimatePresence>
            {!isTransitioning && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.75 }}
                exit={{ opacity: 0, transition: { duration: 0.3 } }}
                transition={{ duration: 1.2, delay: 2.5 }} // Fades in after title/subtitle
              >
                <motion.p
                  animate={{ opacity: [0.3, 0.75, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-white font-light text-[12px] tracking-[0.15em] uppercase text-center"
                >
                  {authResolved && isDbReady ? 'Tap Anywhere to Continue' : 'Loading...'}
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default Splash;
