import React, { useEffect } from 'react';
import { Waves } from 'lucide-react';
import { useAppNavigation } from '../../navigation/AppNavigator';

export const Splash: React.FC = () => {
  const { navigate } = useAppNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('Onboarding1');
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-[#e0f7fa] to-[#faf9fc] dark:from-slate-900 dark:to-slate-950 flex items-center justify-center font-sans overflow-hidden select-none">
      {/* Background decoration ripples */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-cyan-400/25 blur-3xl rounded-full animate-pulse" />
        <div className="absolute w-[200%] h-[200%] top-[-50%] left-[-50%] bg-[radial-gradient(circle_at_center,rgba(144,224,239,0.15)_0%,transparent_60%)] animate-ripple" />
      </div>

      <div className="relative text-center flex flex-col items-center gap-6 z-10">
        <div className="w-24 h-24 rounded-3xl bg-white/40 dark:bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-xl animate-bounce">
          <Waves className="w-14 h-14 text-cyan-600 dark:text-cyan-400" />
        </div>
        
        <div className="space-y-1.5">
          <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-widest uppercase">
            AQUAID
          </h1>
          <p className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 tracking-[0.25em] uppercase leading-none">
            Ecology & Vision Suite
          </p>
        </div>

        {/* Circular glass loader */}
        <div className="mt-8 flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-bounce [animation-delay:-0.3s]"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-bounce [animation-delay:-0.15s]"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-bounce"></span>
        </div>
      </div>
    </div>
  );
};
export default Splash;

