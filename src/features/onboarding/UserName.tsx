import React, { useState } from 'react';
import { User, ArrowRight, Waves } from 'lucide-react';
import { useAppStore } from '../../app/store';
import { useAppNavigation } from '../../navigation/AppNavigator';

export const UserName: React.FC = () => {
  const { setUserName, setOnboardingCompleted } = useAppStore();
  const { navigate } = useAppNavigation();
  const [nameInput, setNameInput] = useState('');

  const handleProceed = (name: string) => {
    const finalName = name.trim() || 'Aqua Explorer';
    setUserName(finalName);
    setOnboardingCompleted(true);
    navigate('Home');
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-[#e0f7fa] to-[#faf9fc] dark:from-slate-900 dark:to-slate-950 flex flex-col justify-between p-6 font-sans select-none">
      {/* Top logo header */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-1.5">
          <Waves className="w-5 h-5 text-cyan-600 dark:text-cyan-400 animate-pulse" />
          <span className="font-black text-sm tracking-wider text-slate-800 dark:text-white">AQUAID</span>
        </div>
      </div>

      {/* Input container */}
      <div className="max-w-sm mx-auto w-full space-y-6 text-center my-auto">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
          <User className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-800 dark:text-white">
            What should we call you?
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            This is how you'll appear in your scan history and profile.
          </p>
        </div>

        <div className="relative">
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Your name..."
            maxLength={25}
            className="w-full h-14 pl-5 pr-5 bg-white/50 dark:bg-black/20 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-white/10 outline-none focus:ring-2 focus:ring-cyan-500 transition-all font-bold text-slate-800 dark:text-white text-center"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleProceed(nameInput);
            }}
          />
        </div>
      </div>

      {/* Bottom buttons panel */}
      <div className="max-w-md mx-auto w-full mb-6 space-y-3">
        <button
          onClick={() => handleProceed(nameInput)}
          disabled={!nameInput.trim()}
          className="w-full h-14 bg-gradient-to-r from-cyan-600 to-sky-850 hover:from-cyan-500 hover:to-sky-700 text-white font-bold rounded-2xl shadow-lg shadow-cyan-500/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => handleProceed('Aqua Explorer')}
          className="w-full h-12 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 cursor-pointer"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
};
export default UserName;

