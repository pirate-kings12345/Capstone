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

        {/* Team */}
        <section className="glass-card-light dark:glass-card p-6 rounded-2xl border border-slate-200 dark:border-white/10 space-y-4">
          <h3 className="text-sm font-black uppercase text-[#1F3FAF] tracking-wider flex items-center gap-2">
            <Code className="w-4 h-4" /> Development Team
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            AQUAID was developed by a team of 4th year college students majoring in Application Programming as our capstone project. We built this system to combine technology, marine awareness, and practical mobile solutions into one meaningful app.
          </p>

          <div className="grid grid-cols-2 gap-3">
            {[
              { name: 'Member 1', role: 'UI / UX', color: 'from-[#4FC3F7] to-[#1F3FAF]' },
              { name: 'Member 2', role: 'Frontend', color: 'from-[#73E3E7] to-[#1F3FAF]' },
              { name: 'Member 3', role: 'Backend', color: 'from-[#1F3FAF] to-[#111111]' },
              { name: 'Member 4', role: 'QA / Testing', color: 'from-[#4FC3F7] to-[#73E3E7]' },
            ].map((member) => (
              <div
                key={member.name}
                className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 p-3"
              >
                <div
                  className={`mb-3 flex h-20 w-full items-center justify-center rounded-xl bg-gradient-to-br ${member.color} text-white text-xs font-black uppercase tracking-[0.2em]`}
                >
                  Photo
                </div>
                <p className="text-[11px] font-black text-slate-800 dark:text-white">{member.name}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-300">{member.role}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </AppLayout>
  );
};
export default About;


