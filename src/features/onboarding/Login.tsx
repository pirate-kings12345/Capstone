import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAppNavigation } from '../../navigation/AppNavigator';
import { useAppStore } from '../../app/store';
import splashBackground from '../../assets/backgrounds/splash_background.jpg';
import logo from '../../assets/logos/LogoForLanding.png';

export const Login: React.FC = () => {
  const { navigate } = useAppNavigation();
  const { setUserName, setOnboardingCompleted, setIsGuestMode } = useAppStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetMessage, setResetMessage] = useState('');

  const handleSignIn = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    const name = email.trim() ? email.split('@')[0] : 'Aqua Explorer';
    const displayName = name.charAt(0).toUpperCase() + name.slice(1);
    setIsGuestMode(false);
    setUserName(displayName);
    setOnboardingCompleted(true);
    navigate('Home');
  };

  const handleGuestSignIn = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsGuestMode(true);
    setUserName('Guest');
    setOnboardingCompleted(true);
    navigate('Home');
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setResetMessage('Please enter your email address first.');
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setResetMessage(`Password reset link sent to ${email}. Please check your inbox.`);
    setIsLoading(false);
    setShowForgotPassword(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative min-h-screen overflow-hidden bg-[#111111] font-sans text-white"
    >
      <img src={splashBackground} alt="Background" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/45 to-black/80" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          className="w-full max-w-md rounded-[32px] border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl"
        >
          <div className="mb-8 flex flex-col items-center text-center">
            <img src={logo} alt="AQUAID Logo" className="mb-4 h-16 w-16 object-contain" />
            <h2 className="text-xl font-semibold tracking-[0.25em] text-white">AQUAID</h2>
            <p className="mt-2 text-xs font-light tracking-wide text-[#73E3E7]">
              Fish Recognition & Classification System
            </p>
          </div>

          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold text-white">Welcome Back</h1>
            <p className="mt-2 text-sm font-light text-white/70">
              Guest mode keeps your activity in this session only and does not save scans or favorites.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
              <Mail className="mr-3 h-5 w-5 text-white/70" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="flex-1 border-none bg-transparent text-[15px] text-white outline-none placeholder:text-white/50"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSignIn();
                }}
              />
            </div>

            <div className="relative flex items-center rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
              <Lock className="mr-3 h-5 w-5 text-white/70" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="flex-1 border-none bg-transparent pr-10 text-[15px] text-white outline-none placeholder:text-white/50"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSignIn();
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-white/70 transition-colors hover:text-white"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <div className="text-right">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-[13px] font-medium text-[#73E3E7] transition-colors hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <button
              onClick={handleSignIn}
              disabled={isLoading}
              className="flex h-[56px] w-full items-center justify-center rounded-2xl bg-white/90 text-[15px] font-semibold text-slate-900 transition-all duration-300 hover:bg-white active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-900/20 border-t-slate-900" />
              ) : (
                <span className="flex items-center gap-2">
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </button>

            <button
              onClick={handleGuestSignIn}
              disabled={isLoading}
              className="flex h-[48px] w-full items-center justify-center rounded-2xl border border-[#73E3E7]/40 bg-[#1F3FAF]/20 text-[14px] font-semibold text-[#73E3E7] transition-all duration-300 hover:bg-[#1F3FAF]/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >
              Continue as Guest
            </button>
          </div>

          {showForgotPassword && (
            <div className="mt-5 rounded-2xl border border-[#73E3E7]/30 bg-[#1F3FAF]/20 p-4 text-left">
              <p className="text-sm font-semibold text-white">Reset your password</p>
              <p className="mt-1 text-xs text-white/70">
                Enter your email and we’ll send a recovery link to help you sign back in.
              </p>
              <button
                onClick={handleForgotPassword}
                disabled={isLoading}
                className="mt-3 flex h-10 w-full items-center justify-center rounded-xl bg-[#73E3E7] text-sm font-semibold text-[#111111] transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? 'Sending...' : 'Send Recovery Link'}
              </button>
            </div>
          )}

          {resetMessage && (
            <div className="mt-4 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-3 text-center text-sm text-emerald-200">
              {resetMessage}
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-[13px] font-light text-white/70">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('CreateAccount')}
                className="font-medium text-white underline-offset-4 hover:underline"
              >
                Create Account
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Login;
