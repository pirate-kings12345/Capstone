import React from 'react';
import { Waves, Heart, Shield, Cpu, Code } from 'lucide-react';
import { AppLayout } from '../../layouts/AppLayout';

export const About: React.FC = () => {
  return (
    <AppLayout title="About" showBack>
      <div className="space-y-6 pb-12 max-w-xl mx-auto font-sans">

        {/* Banner with Logo */}
        <section className="text-center py-6">
          <div className="w-20 h-20 rounded-3xl bg-[#EAF7FF] border border-[#1F3FAF]/10 flex items-center justify-center mx-auto text-[#1F3FAF] mb-3">
            <Waves className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-wider">AQUAID</h2>
          
        </section>

        <div className="waterline h-[1px] w-full" />

        {/* Purpose */}
        <section className="glass-card-light dark:glass-card p-6 rounded-2xl border border-slate-200 dark:border-white/10 space-y-3">
          <h3 className="text-sm font-black uppercase text-[#1F3FAF] tracking-wider flex items-center gap-2">
            <Heart className="w-4 h-4" /> Purpose of AQUAID
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            AQUAID is designed to serve as an intelligent, portable gateway for marine explorers, aquarists, and ocean conservationists. The platform bridges computer vision technologies with ecological database archives, enabling explorers to instantly recognize marine species, understand regional sustainability profiles, and track changes in local waters.
          </p>
        </section>

        {/* Features */}
        <section className="glass-card-light dark:glass-card p-6 rounded-2xl border border-slate-200 dark:border-white/10 space-y-3">
          <h3 className="text-sm font-black uppercase text-[#1F3FAF] tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4" /> Core Features
          </h3>
          <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 font-semibold">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4FC3F7] mt-1.5 flex-shrink-0" />
              <span><span className="font-bold text-slate-800 dark:text-white">Camera Scanner:</span> Real-time species identification using AI image analysis.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4FC3F7] mt-1.5 flex-shrink-0" />
              <span><span className="font-bold text-slate-800 dark:text-white">Sustainability Ratings:</span> Built-in conservation status and preservation guidelines.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4FC3F7] mt-1.5 flex-shrink-0" />
              <span><span className="font-bold text-slate-800 dark:text-white">Scan History:</span> Persistent local logs of all identified species.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4FC3F7] mt-1.5 flex-shrink-0" />
              <span><span className="font-bold text-slate-800 dark:text-white">Marine Guide:</span> Searchable species dictionary with ecological details.</span>
            </li>
          </ul>
        </section>

        {/* Team */}
        <section className="glass-card-light dark:glass-card p-6 rounded-2xl border border-slate-200 dark:border-white/10 space-y-3">
          <h3 className="text-sm font-black uppercase text-[#1F3FAF] tracking-wider flex items-center gap-2">
            <Code className="w-4 h-4" /> Development Team
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            AQUAID was developed by a team of 4th year college students majoring in Application Programming as our capstone project. We built this system to combine technology, marine awareness, and practical mobile solutions into one meaningful app.
          </p>
        </section>

      </div>
    </AppLayout>
  );
};
export default About;


