import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2 } from 'lucide-react';

interface ScanningOverlayProps {
  stepLabel: string;
}

export const ScanningOverlay: React.FC<ScanningOverlayProps> = ({ stepLabel }) => {
  const [dots, setDots] = useState('');

  // Animated dots for the scanning text
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 z-40 bg-black/40 overflow-hidden flex flex-col items-center justify-center pointer-events-none">
      
      {/* 1. Detection Grid overlay */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'linear-gradient(rgba(79, 195, 247, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(79, 195, 247, 0.5) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* 2. Scanning Beam (Sweeping vertically) */}
      <motion.div
        animate={{ y: ['-100vh', '100vh'] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
        className="absolute top-0 left-0 w-full h-1 bg-white shadow-[0_0_20px_4px_rgba(79,195,247,0.8)] z-10"
      />
      <motion.div
        animate={{ y: ['-100vh', '100vh'] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
        className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-[#4FC3F7]/30 z-0"
      />

      {/* 3. Pulsing Brackets around the center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-64 h-64 sm:w-80 sm:h-80">
          <motion.div
            animate={{ scale: [1, 1.05, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            className="absolute inset-0 border-2 border-[#4FC3F7] rounded-3xl"
          />
          {/* Corner brackets */}
          <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-white rounded-tl-3xl" />
          <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-white rounded-tr-3xl" />
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-white rounded-bl-3xl" />
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-white rounded-br-3xl" />
        </div>
      </div>

      {/* 4. Floating Particles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: ['100vh', '-10vh'],
            x: Math.random() * 40 - 20,
            opacity: [0, 0.8, 0]
          }}
          transition={{
            repeat: Infinity,
            duration: 3 + Math.random() * 3,
            delay: Math.random() * 2,
            ease: 'linear'
          }}
          className="absolute w-1.5 h-1.5 bg-[#4FC3F7] rounded-full blur-[1px]"
          style={{ left: `${Math.random() * 100}%`, top: '100%' }}
        />
      ))}

      {/* 5. Center Progress Indicator & Text */}
      <div className="absolute bottom-32 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md px-8 py-4 rounded-3xl border border-white/10 shadow-2xl">
        <Loader2 className="w-10 h-10 text-[#4FC3F7] animate-spin mb-3" />
        <AnimatePresence mode="wait">
          <motion.p
            key={stepLabel}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-sm font-black tracking-widest uppercase text-white"
          >
            {stepLabel}{dots}
          </motion.p>
        </AnimatePresence>
        <p className="text-[10px] text-[#4FC3F7] mt-1 uppercase tracking-wider font-bold">
          AI Processor Active
        </p>
      </div>

    </div>
  );
};

export default ScanningOverlay;
