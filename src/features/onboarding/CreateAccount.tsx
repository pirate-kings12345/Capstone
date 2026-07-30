import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAppNavigation } from '../../navigation/AppNavigator';
import { useAppStore } from '../../app/store';

/* ═══════════════════════════════════════════════════════════════════════
   AQUAID CREATE ACCOUNT SCREEN
   Registration form with clean white card interface
   ═══════════════════════════════════════════════════════════════════════ */

export const CreateAccount: React.FC = () => {
  const { navigate } = useAppNavigation();
  const { setUserName, setOnboardingCompleted } = useAppStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isValid = fullName.trim() && email.trim() && password.length >= 1 && password === confirmPassword;

  const handleCreateAccount = async () => {
    if (!isValid) {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
      }
      return;
    }
    setError('');
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const displayName = fullName.trim() || 'Aqua Explorer';
    setUserName(displayName);
    setOnboardingCompleted(true);
    navigate('Home');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col overflow-y-auto select-none"
      style={{
        background: 'linear-gradient(180deg, #F5FAFF 0%, #E8F4FD 50%, #F5FAFF 100%)',
        fontFamily: '"Poppins", sans-serif',
      }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-20 -left-20 w-60 h-60 rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(53,214,255,0.15) 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(10,102,255,0.2) 0%, transparent 70%)' }}
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
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
            style={{
              background: 'linear-gradient(135deg, #0A66FF 0%, #005BBB 100%)',
              boxShadow: '0 4px 20px rgba(10,102,255,0.3)',
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
              <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
              <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
            </svg>
          </div>
          <h2 className="text-xl font-black tracking-[0.15em] text-[#003873]">
            AQUAID
          </h2>
          <p className="text-[10px] font-medium tracking-wide text-[#005BBB] mt-0.5">
            Fish Recognition & Classification System
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
              <h1 className="text-2xl font-bold text-[#1a2a3a] mb-1">Create Account</h1>
              <p className="text-sm text-[#64748b]">
                Join AQUAID and start exploring aquatic species.
              </p>
            </motion.div>

            {/* Full Name */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-3.5"
            >
              <label className="block text-xs font-semibold text-[#475569] mb-1.5 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#94a3b8]" />
                <input
                  id="register-name"
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Your full name"
                  maxLength={30}
                  className="aquaid-input pl-11"
                />
              </div>
            </motion.div>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-3.5"
            >
              <label className="block text-xs font-semibold text-[#475569] mb-1.5 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#94a3b8]" />
                <input
                  id="register-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="aquaid-input pl-11"
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-3.5"
            >
              <label className="block text-xs font-semibold text-[#475569] mb-1.5 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#94a3b8]" />
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="aquaid-input pl-11 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#475569] transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                </button>
              </div>
            </motion.div>

            {/* Confirm Password */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="mb-5"
            >
              <label className="block text-xs font-semibold text-[#475569] mb-1.5 ml-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#94a3b8]" />
                <input
                  id="register-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => { setConfirmPassword(e.target.value); setError(''); }}
                  placeholder="Confirm your password"
                  className="aquaid-input pl-11 pr-12"
                  onKeyDown={e => { if (e.key === 'Enter') handleCreateAccount(); }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#475569] transition-colors cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                </button>
              </div>
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs font-semibold text-red-500 mb-4 text-center"
              >
                {error}
              </motion.p>
            )}

            {/* Create Account Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <button
                id="register-submit"
                onClick={handleCreateAccount}
                disabled={!isValid || isLoading}
                className="w-full h-14 rounded-2xl text-white font-bold text-base tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 disabled:opacity-40 disabled:pointer-events-none relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #0A66FF 0%, #005BBB 100%)',
                  boxShadow: isValid ? '0 4px 20px rgba(10,102,255,0.35)' : 'none',
                }}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </motion.div>
          </div>

          {/* Bottom Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-center mt-6 pb-4"
          >
            <p className="text-sm text-[#64748b]">
              Already have an account?{' '}
              <button
                onClick={() => navigate('Login')}
                className="font-bold text-[#0A66FF] hover:text-[#005BBB] transition-colors cursor-pointer"
              >
                Sign In
              </button>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateAccount;
