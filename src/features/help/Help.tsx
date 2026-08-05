import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Mail, ShieldCheck } from 'lucide-react';
import { AppLayout } from '../../layouts/AppLayout';
import { faqs } from '../../config/presets';

export const Help: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <AppLayout title="Help & Support" showBack>
      <div className="space-y-6 pb-12 max-w-xl mx-auto font-sans">

        {/* Help icon section */}
        <section className="text-center pt-4">
          <div className="w-16 h-16 bg-[#4FC3F7]/10 dark:bg-[#1F3FAF]/20 rounded-full flex items-center justify-center mx-auto text-[#1F3FAF] dark:text-[#4FC3F7] mb-2">
            <HelpCircle className="w-8 h-8 animate-pulse" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Help Center</h2>
        </section>

        {/* How to Scan guide */}
        <section className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200 dark:border-white/10 space-y-4 shadow-sm">
          <h3 className="text-sm font-black uppercase text-[#1F3FAF] dark:text-[#4FC3F7] tracking-wider">How to Scan</h3>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-6 h-6 rounded-full bg-[#4FC3F7]/10 border border-[#4FC3F7]/30 text-xs font-black text-[#1F3FAF] dark:text-[#4FC3F7] flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Access the Scanner</p>
                <p className="text-[12px] text-slate-600 dark:text-slate-300 leading-relaxed mt-0.5">Press 'Scan Aqua Life' on the dashboard to open the Camera, or select 'Upload from Gallery' to classify saved photos.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-6 h-6 rounded-full bg-[#4FC3F7]/10 border border-[#4FC3F7]/30 text-xs font-black text-[#1F3FAF] dark:text-[#4FC3F7] flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Frame and Capture</p>
                <p className="text-[12px] text-slate-600 dark:text-slate-300 leading-relaxed mt-0.5">Position the fish clearly inside the Reticle overlay brackets. Hold the camera steady and press the shutter Capture button.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-6 h-6 rounded-full bg-[#4FC3F7]/10 border border-[#4FC3F7]/30 text-xs font-black text-[#1F3FAF] dark:text-[#4FC3F7] flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Run Analysis</p>
                <p className="text-[12px] text-slate-600 dark:text-slate-300 leading-relaxed mt-0.5">Tap the Analyze button. The AI model extracts biological characteristics, outputs scientific classification, and registers sustainable ratings.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ list */}
        <section className="space-y-3">
          <h3 className="text-sm font-black uppercase text-[#1F3FAF] dark:text-[#4FC3F7] tracking-wider px-1">FAQ</h3>

          <div className="space-y-2">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-5 py-4 flex justify-between items-center text-left font-bold text-xs text-slate-900 dark:text-white cursor-pointer select-none"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-[#1F3FAF] dark:text-[#4FC3F7]" /> : <ChevronDown className="w-4 h-4 text-[#1F3FAF] dark:text-[#4FC3F7]" />}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-[12px] text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/60 dark:border-white/10 pt-3 bg-slate-500/5">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Contact Support */}
        <section className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200 dark:border-white/10 space-y-4 shadow-sm">
          <h3 className="text-sm font-black uppercase text-[#1F3FAF] dark:text-[#4FC3F7] tracking-wider flex items-center gap-2">
            <Mail className="w-4 h-4" /> Contact Support
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Have a question or found an issue? Reach us at:
          </p>
          <div className="bg-slate-500/5 p-3 rounded-xl border border-slate-200/60 dark:border-white/10 text-center">
            <a
              href="mailto:support@aquaid.org"
              className="text-xs font-bold text-[#1F3FAF] dark:text-[#4FC3F7] hover:underline cursor-pointer"
            >
              support@aquaid.org
            </a>
          </div>
        </section>

        {/* Privacy Policy */}
        <section className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200 dark:border-white/10 space-y-3 shadow-sm">
          <h3 className="text-sm font-black uppercase text-[#1F3FAF] dark:text-[#4FC3F7] tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" /> Privacy Policy
          </h3>
          <p className="text-[12px] text-slate-600 dark:text-slate-300 leading-relaxed">
            AQUAID respects telemetry data. All coordinates, usernames, and history logs are processed and stored locally on your device. We do not transmit coordinates or custom uploaded photos to remote servers without user synchronization approval.
          </p>
        </section>

      </div>
    </AppLayout>
  );
};

export default Help;