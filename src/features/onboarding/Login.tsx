import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAppNavigation } from '../../navigation/AppNavigator';
import { useAppStore } from '../../app/store';
import logo from "../../assets/logos/LogoForLogin.png";

export const Login: React.FC = () => {
  const { navigate } = useAppNavigation();
  const { setUserName, setOnboardingCompleted } = useAppStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email.trim()) return;
    setIsLoading(true);
    // Simulate auth delay
    await new Promise(r => setTimeout(r, 800));
    const name = email.split('@')[0] || 'Aqua Explorer';
    const displayName = name.charAt(0).toUpperCase() + name.slice(1);
    setUserName(displayName);
    setOnboardingCompleted(true);
    navigate('Home');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-gray-900 pb-safe">
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 w-full max-w-md mx-auto">

        {/* Header / Logo */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col items-center mb-10"
        >
          <img
            src={logo}
            alt="AQUAID Logo"
            className="w-16 h-16 object-contain mb-4"
          />
          <h2 className="text-xl font-semibold tracking-wider text-gray-900">
            AQUAID
          </h2>
          <p className="text-xs font-light text-gray-500 mt-1">
            Fish Recognition & Classification System
          </p>
        </motion.div>

        {/* Welcome Text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          className="mb-8 text-center"
        >
          <h1 className="text-2xl font-medium text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-sm text-gray-500 font-light">
            Sign in to continue exploring
          </p>
        </motion.div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
        >
          {/* Email */}
          <div className="mb-5">
            <div className="relative flex items-center bg-gray-50 rounded-2xl border border-gray-100 transition-colors focus-within:border-gray-300 focus-within:bg-white h-[56px] px-4">
              <Mail className="w-5 h-5 text-gray-400 mr-3" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email address"
                className="flex-1 bg-transparent border-none outline-none text-[15px] text-gray-800 placeholder-gray-400 font-light"
                onKeyDown={e => { if (e.key === 'Enter') handleSignIn(); }}
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-6">
            <div className="relative flex items-center bg-gray-50 rounded-2xl border border-gray-100 transition-colors focus-within:border-gray-300 focus-within:bg-white h-[56px] px-4">
              <Lock className="w-5 h-5 text-gray-400 mr-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                className="flex-1 bg-transparent border-none outline-none text-[15px] text-gray-800 placeholder-gray-400 font-light pr-10"
                onKeyDown={e => { if (e.key === 'Enter') handleSignIn(); }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <div className="text-right mt-3">
              <button className="text-[13px] font-medium text-gray-500 hover:text-gray-800 transition-colors">
                Forgot password?
              </button>
            </div>
          </div>

          {/* Sign In Button */}
          <button
            onClick={handleSignIn}
            disabled={!email.trim() || isLoading}
            className="w-full h-[56px] rounded-2xl text-white font-medium text-[15px] bg-gray-900 hover:bg-black transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center shadow-lg shadow-gray-200"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              'Sign In'
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-[1px] bg-gray-100" />
            <span className="text-[11px] font-medium text-gray-400 uppercase tracking-widest">
              Or continue with
            </span>
            <div className="flex-1 h-[1px] bg-gray-100" />
          </div>

          {/* Social Sign-In */}
          <div className="flex gap-4">
            <button
              className="flex-1 h-[56px] rounded-2xl flex items-center justify-center bg-white border border-gray-200 transition-all hover:bg-gray-50 active:bg-gray-100"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            </button>
            <button
              className="flex-1 h-[56px] rounded-2xl flex items-center justify-center bg-white border border-gray-200 transition-all hover:bg-gray-50 active:bg-gray-100"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#000000">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
            </button>
          </div>
        </motion.div>

        {/* Bottom Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 text-center pb-4"
        >
          <p className="text-[13px] text-gray-500 font-light">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('CreateAccount')}
              className="font-medium text-gray-900 hover:underline underline-offset-4"
            >
              Create Account
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
