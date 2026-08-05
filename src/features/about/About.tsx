import React from 'react';
import { Heart, Cpu, Code } from 'lucide-react';
import { AppLayout } from '../../layouts/AppLayout';

// ---------------------------------------------------------------------------
// 1. ASSET IMPORTS
// ---------------------------------------------------------------------------
import logoForLogin from '../../assets/logos/LogoForLogin.png';

// 💡 WHEN YOU HAVE REAL MEMBER PHOTOS:
// Replace 'LogoForLogin.png' with your actual image file names (e.g., 'john.png')
import member1Img from '../../assets/logos/LogoForLogin.png';
import member2Img from '../../assets/logos/LogoForLogin.png';
import member3Img from '../../assets/logos/LogoForLogin.png';
import member4Img from '../../assets/logos/LogoForLogin.png';

export const About: React.FC = () => {
  return (
    <AppLayout title="About" showBack>
      <div className="space-y-6 pb-12 max-w-xl mx-auto font-sans px-4">

        {/* Banner with Logo */}
        <section className="text-center py-6">
          <div className="w-20 h-20 rounded-3xl bg-[#EAF7FF] border border-[#1F3FAF]/20 flex items-center justify-center mx-auto mb-3 shadow-sm overflow-hidden p-2">
            <img
              src={logoForLogin}
              alt="AQUAID Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-wider">
            AQUAID
          </h2>
        </section>

        <div className="h-[1px] w-full bg-slate-200" />

        {/* Purpose */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-xs font-black uppercase text-[#1F3FAF] tracking-wider flex items-center gap-2">
            <Heart className="w-4 h-4 text-[#1F3FAF]" /> Purpose of AQUAID
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed font-normal">
            AQUAID is designed to serve as an intelligent, portable gateway for marine explorers, aquarists, and ocean conservationists. The platform bridges computer vision technologies with ecological database archives, enabling explorers to instantly recognize marine species, understand regional sustainability profiles, and track changes in local waters.
          </p>
        </section>

<<<<<<< HEAD
        {/* Features */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-xs font-black uppercase text-[#1F3FAF] tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#1F3FAF]" /> Core Features
          </h3>
          <ul className="space-y-3 text-sm text-slate-700">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-[#1F3FAF] mt-1.5 flex-shrink-0" />
              <span className="leading-normal text-slate-700">
                <strong className="font-bold text-slate-900 mr-1">Camera Scanner:</strong>
                Real-time species identification using AI image analysis.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-[#1F3FAF] mt-1.5 flex-shrink-0" />
              <span className="leading-normal text-slate-700">
                <strong className="font-bold text-slate-900 mr-1">Sustainability Ratings:</strong>
                Built-in conservation status and preservation guidelines.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-[#1F3FAF] mt-1.5 flex-shrink-0" />
              <span className="leading-normal text-slate-700">
                <strong className="font-bold text-slate-900 mr-1">Scan History:</strong>
                Persistent local logs of all identified species.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-[#1F3FAF] mt-1.5 flex-shrink-0" />
              <span className="leading-normal text-slate-700">
                <strong className="font-bold text-slate-900 mr-1">Marine Guide:</strong>
                Searchable species dictionary with ecological details.
              </span>
            </li>
          </ul>
        </section>

=======
>>>>>>> f56a7d8491cc77e2db49173c86fe8b6f7fa4b845
        {/* Team */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-xs font-black uppercase text-[#1F3FAF] tracking-wider flex items-center gap-2">
            <Code className="w-4 h-4 text-[#1F3FAF]" /> Development Team
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed font-normal">
            AQUAID was developed by a team of 4th year college students majoring in Application Programming as our capstone project. We built this system to combine technology, marine awareness, and practical mobile solutions into one meaningful app.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            {/* ----------------------------------------------------------------- */}
            {/* 2. TEAM MEMBERS ARRAY WITH INDIVIDUAL PHOTO PROPERTIES            */}
            {/* ----------------------------------------------------------------- */}
            {[
              { name: 'Member 1', role: 'UI / UX', color: 'from-[#4FC3F7] to-[#1F3FAF]', photo: member1Img },
              { name: 'Member 2', role: 'Frontend', color: 'from-[#73E3E7] to-[#1F3FAF]', photo: member2Img },
              { name: 'Member 3', role: 'Backend', color: 'from-[#1F3FAF] to-[#111111]', photo: member3Img },
              { name: 'Member 4', role: 'QA / Testing', color: 'from-[#4FC3F7] to-[#73E3E7]', photo: member4Img },
            ].map((member) => (
              <div
                key={member.name}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-3"
              >
                <div
                  className={`mb-3 flex h-20 w-full items-center justify-center rounded-xl bg-gradient-to-br ${member.color} p-2 shadow-sm overflow-hidden`}
                >
                  {/* ----------------------------------------------------------- */}
                  {/* 3. DYNAMIC IMAGE RENDER                                     */}
                  {/* ----------------------------------------------------------- */}
                  <img
                    src={member.photo}
                    alt={`${member.name}`}
                    className="h-full w-full object-contain filter drop-shadow-sm"
                  />
                </div>
                <p className="text-xs font-bold text-slate-900">{member.name}</p>
                <p className="text-[11px] text-slate-500 font-medium">{member.role}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </AppLayout>
  );
};

export default About;