import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAppNavigation } from '../../navigation/AppNavigator';
import { useAppStore } from '../../app/store';
import { AuthService } from '../../services/firebase/AuthService';
import { SessionService } from '../../services/firebase/SessionService';

// ASSETS
import splashBackground from '../../assets/backgrounds/splash_background.jpg';
import logo from '../../assets/logos/LogoForLogin.png';

export const Login: React.FC = () => {
  const { navigate } = useAppNavigation();
  const { setUserName, setOnboardingCompleted, setIsGuestMode } = useAppStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetMessage, setResetMessage] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      setLoginError('Please enter both email and password.');
      return;
    }
    setLoginError('');
    setIsLoading(true);
    
    try {
      const authService = AuthService.getInstance();
      const sessionService = SessionService.getInstance();
      
      await authService.loginWithEmail(email, password);
      sessionService.saveSession('email');
      
      const user = authService.getCurrentUser();
      const name = user?.displayName || email.split('@')[0] || 'Aqua Explorer';
      const displayName = name.charAt(0).toUpperCase() + name.slice(1);
      
      setIsGuestMode(false);
      setUserName(displayName);
      setOnboardingCompleted(true);
      navigate('Home');
    } catch (err: any) {
      setLoginError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoginError('');
    setIsLoading(true);
    
    try {
      const authService = AuthService.getInstance();
      const sessionService = SessionService.getInstance();
      
      await authService.loginWithGoogle();
      sessionService.saveSession('google');
      
      const user = authService.getCurrentUser();
      const name = user?.displayName || 'Aqua Explorer';
      const displayName = name.charAt(0).toUpperCase() + name.slice(1);
      
      setIsGuestMode(false);
      setUserName(displayName);
      setOnboardingCompleted(true);
      navigate('Home');
    } catch (err: any) {
      setLoginError(err.message || 'Failed to sign in with Google.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestSignIn = async () => {
    setLoginError('');
    setIsLoading(true);
    
    try {
      const authService = AuthService.getInstance();
      const sessionService = SessionService.getInstance();
      
      await authService.continueAsGuest();
      sessionService.saveSession('guest');
      
      setIsGuestMode(true);
      setUserName('Guest');
      setOnboardingCompleted(true);
      navigate('Home');
    } catch (err: any) {
      setLoginError(err.message || 'Failed to continue as guest.');
    } finally {
      setIsLoading(false);
    }
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
    <div
      className="fixed inset-0 z-50 flex flex-col overflow-y-auto select-none"
      style={{
        background: 'linear-gradient(180deg, #F7F9FC 0%, #F7F9FC 50%, #FFFFFF 100%)',
        fontFamily: '"Poppins", sans-serif',
        color: '#111111',
      }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-20 -left-20 w-60 h-60 rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(79,195,247,0.18) 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(31,63,175,0.16) 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative flex-1 flex flex-col items-center justify-center px-6 py-8">
        {/* Logo & Branding */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center mb-6"
        >
          {/* Imported Image Logo */}
          <div className="relative flex justify-center items-center mb-3">
            <img
              src={logo}
              alt="AQUAID Logo"
              className="w-16 h-16 object-contain drop-shadow-md"
            />
          </div>
          <h2 className="text-xl font-black tracking-[0.15em] text-[#111111]">
            AQUAID
          </h2>
          <p className="text-[10px] font-medium tracking-wide text-[#1F3FAF] mt-0.5">
            Fish Recognition &amp; Classification System
          </p>
        </motion.div>

        {/* Card Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="w-full max-w-sm"
        >
          <div
            className="rounded-3xl p-7"
            style={{
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.9)',
              boxShadow: '0 4px 32px rgba(0,56,115,0.08), 0 1px 4px rgba(0,56,115,0.04)',
            }}
          >
            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-5"
            >
              <h1 className="text-2xl font-bold text-[#111111] mb-1">Welcome Back</h1>
              <p className="text-sm text-[#4B5563]">
                Sign in to save scans, view history, and build your catalog.
              </p>
            </motion.div>

            <div className="space-y-4">
              {/* Email Input */}
              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1.5 ml-1">Email</label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-4 w-[18px] h-[18px] text-[#94a3b8] pointer-events-none z-10" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full h-12 rounded-2xl border border-slate-200 bg-white/70 pl-11 pr-4 text-sm text-[#111111] placeholder:text-[#94a3b8] focus:border-[#1F3FAF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1F3FAF]/20 transition-all duration-200"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSignIn();
                    }}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1.5 ml-1">Password</label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-4 w-[18px] h-[18px] text-[#94a3b8] pointer-events-none z-10" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full h-12 rounded-2xl border border-slate-200 bg-white/70 pl-11 pr-11 text-sm text-[#111111] placeholder:text-[#94a3b8] focus:border-[#1F3FAF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1F3FAF]/20 transition-all duration-200"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSignIn();
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-[#94a3b8] transition-colors hover:text-[#475569] z-10"
                  >
                    {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-[13px] font-semibold text-[#1F3FAF] transition-colors hover:text-[#4FC3F7]"
                >
                  Forgot password?
                </button>
              </div>

              {/* Login Error Banner */}
              {loginError && (
                <div className="rounded-xl bg-red-50 p-3 text-center text-xs text-red-500 mb-2 border border-red-100">
                  {loginError}
                </div>
              )}

              {/* Sign In Button */}
              <button
                onClick={handleSignIn}
                disabled={isLoading}
                className="flex h-14 w-full items-center justify-center rounded-2xl text-[16px] font-bold text-white transition-all duration-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                style={{
                  background: 'linear-gradient(135deg, #4FC3F7 0%, #1F3FAF 100%)',
                  boxShadow: '0 8px 24px rgba(31,63,175,0.16)',
                }}
              >
                {isLoading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                ) : (
                  <span className="flex items-center gap-2">
                    Sign In
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </button>

              {/* Separator */}
              <div className="relative my-4 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#1F3FAF]/10"></div>
                </div>
                <span className="relative bg-white/80 px-3 text-xs font-semibold text-[#6B7280]">OR</span>
              </div>

              {/* Google Button */}
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-[15px] font-bold text-slate-700 transition-all duration-300 hover:bg-slate-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>

              {/* Continue as Guest Button */}
              <button
                onClick={handleGuestSignIn}
                disabled={isLoading}
                className="flex h-14 w-full items-center justify-center rounded-2xl border border-[#1F3FAF]/20 bg-[#1F3FAF]/5 text-[15px] font-bold text-[#1F3FAF] transition-all duration-300 hover:bg-[#1F3FAF]/10 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
              >
                Continue as Guest
              </button>
            </div>

            {/* Forgot Password Section */}
            {showForgotPassword && (
              <div className="mt-5 rounded-2xl border border-[#1F3FAF]/10 bg-[#1F3FAF]/5 p-4 text-left">
                <p className="text-sm font-semibold text-[#111111]">Reset your password</p>
                <p className="mt-1 text-xs text-[#4B5563]">
                  Enter your email and we’ll send a recovery link to help you sign back in.
                </p>
                <button
                  onClick={handleForgotPassword}
                  disabled={isLoading}
                  className="mt-3 flex h-10 w-full items-center justify-center rounded-xl bg-[#1F3FAF] text-sm font-semibold text-white transition-all hover:bg-[#1F3FAF]/90 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLoading ? 'Sending...' : 'Send Recovery Link'}
                </button>
              </div>
            )}

            {/* Success/Notification Banner */}
            {resetMessage && (
              <div className="mt-4 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-3 text-center text-sm text-emerald-600">
                {resetMessage}
              </div>
            )}
          </div>

          {/* Footer Link */}
          <div className="mt-6 text-center pb-4">
            <p className="text-sm text-[#64748b]">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('CreateAccount')}
                className="font-bold text-[#1F3FAF] hover:text-[#4FC3F7] transition-colors cursor-pointer"
              >
                Create Account
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;