import React from 'react';
import { BarChart3, BookmarkCheck, ScanLine, Leaf, ShieldCheck } from 'lucide-react';
import { AppLayout } from '../../layouts/AppLayout';
import { useAppStore } from '../../app/store';

const Analytics: React.FC = () => {
  const { history, savedResults } = useAppStore();

  const totalScans = history.length;
  const savedCount = savedResults.length;
  const sustainableCount = history.filter((item) => item.sustainabilityStatus === 'Sustainable').length;
  const protectedCount = history.filter((item) => item.sustainabilityStatus === 'Protected').length;

  const stats = [
    {
      label: 'Total scans',
      value: totalScans.toString(),
      icon: ScanLine,
      accent: 'from-[#4FC3F7] to-[#1F3FAF]',
    },
    {
      label: 'Saved results',
      value: savedCount.toString(),
      icon: BookmarkCheck,
      accent: 'from-[#2DBE6C] to-[#1B9A56]',
    },
    {
      label: 'Sustainable finds',
      value: sustainableCount.toString(),
      icon: Leaf,
      accent: 'from-[#7C4DFF] to-[#5E35B1]',
    },
    {
      label: 'Protected species',
      value: protectedCount.toString(),
      icon: ShieldCheck,
      accent: 'from-[#F59E0B] to-[#D97706]',
    },
  ];

  return (
    <AppLayout title="Analytics" showBack>
      <div className="space-y-4">
        <div className="rounded-[28px] border border-[#1F3FAF]/10 bg-white/90 p-5 shadow-[0_10px_30px_rgba(31,63,175,0.08)]">
          <div className="flex items-center gap-2 text-[#1F3FAF]">
            <BarChart3 className="h-5 w-5" />
            <p className="text-sm font-semibold">Your activity overview</p>
          </div>
          <p className="mt-2 text-sm text-[#4B5563]">
            Track your recent fish recognition activity and the species you saved.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-[24px] border border-slate-100 bg-white p-4 shadow-sm">
                <div className={`inline-flex rounded-2xl bg-gradient-to-br ${item.accent} p-2 text-white`}>
                  <Icon className="h-4 w-4" />
                </div>
                <p className="mt-3 text-2xl font-black text-[#111111]">{item.value}</p>
                <p className="text-sm text-[#6B7280]">{item.label}</p>
              </div>
            );
          })}
        </div>

        <div className="rounded-[28px] border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-[#111111]">Quick insight</p>
          <p className="mt-2 text-sm text-[#4B5563]">
            {totalScans === 0
              ? 'Start scanning fish to build your first analytics snapshot.'
              : `You have scanned ${totalScans} items and saved ${savedCount} results for later.`}
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Analytics;
