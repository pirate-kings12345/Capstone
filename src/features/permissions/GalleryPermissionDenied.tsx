import React from 'react';
import { ImageOff, Settings, ArrowLeft, ShieldAlert } from 'lucide-react';
import { useAppNavigation } from '../../navigation/AppNavigator';
import { isAndroid } from '../../native/DeviceInfo';

/**
 * GalleryPermissionDenied
 *
 * Full-screen error state shown when the user has permanently denied
 * photo library / gallery access. Instructs them how to enable it in Settings.
 */
export const GalleryPermissionDenied: React.FC = () => {
  const { goBack } = useAppNavigation();

  const openAppSettings = () => {
    if (isAndroid()) {
      window.open('android.settings.APPLICATION_DETAILS_SETTINGS', '_system');
    } else {
      alert('Please open your device Settings and enable Photos/Storage permission for AQUAID.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-slate-950 via-[#001219] to-slate-950 flex flex-col items-center justify-center px-8 text-white font-sans select-none">

      {/* Back button */}
      <button
        onClick={goBack}
        className="absolute top-12 left-6 p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all active:scale-95 cursor-pointer"
        aria-label="Go back"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      {/* Icon */}
      <div className="relative mb-8">
        <div className="w-28 h-28 rounded-3xl bg-amber-950/60 border border-amber-500/20 flex items-center justify-center shadow-[0_0_60px_rgba(245,158,11,0.12)]">
          <ImageOff className="w-14 h-14 text-amber-400" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-amber-500 border-2 border-slate-950 flex items-center justify-center">
          <ShieldAlert className="w-4 h-4 text-white" />
        </div>
      </div>

      {/* Heading */}
      <h1 className="text-2xl font-extrabold tracking-tight text-center mb-3">
        Gallery Access Denied
      </h1>

      {/* Description */}
      <p className="text-sm text-slate-400 text-center leading-relaxed max-w-xs mb-2">
        AQUAID needs access to your photo library to upload images for fish identification.
      </p>
      <p className="text-xs text-slate-500 text-center leading-relaxed max-w-xs mb-10">
        You previously denied this permission. To enable it, open your device{' '}
        <span className="text-cyan-400 font-semibold">Settings</span> → <span className="text-cyan-400 font-semibold">Apps</span> → <span className="text-cyan-400 font-semibold">AQUAID</span> → <span className="text-cyan-400 font-semibold">Permissions</span> → Photos.
      </p>

      {/* Steps */}
      <div className="w-full max-w-sm space-y-3 mb-10">
        {[
          { step: '1', text: 'Open device Settings' },
          { step: '2', text: 'Tap Apps → AQUAID' },
          { step: '3', text: 'Tap Permissions → Photos' },
          { step: '4', text: 'Select "Allow" or "Allow all"' },
        ].map(({ step, text }) => (
          <div
            key={step}
            className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3"
          >
            <span className="w-7 h-7 rounded-full bg-amber-600/30 border border-amber-500/30 flex items-center justify-center text-xs font-bold text-amber-300 shrink-0">
              {step}
            </span>
            <span className="text-sm text-slate-300">{text}</span>
          </div>
        ))}
      </div>

      {/* Open Settings CTA */}
      <button
        onClick={openAppSettings}
        className="w-full max-w-sm h-14 flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-500 hover:to-orange-600 text-white font-bold rounded-2xl shadow-lg shadow-amber-500/20 active:scale-[0.99] transition-all cursor-pointer mb-4"
      >
        <Settings className="w-5 h-5" />
        Open App Settings
      </button>

      <button
        onClick={goBack}
        className="text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer py-2"
      >
        Go back without gallery
      </button>
    </div>
  );
};

export default GalleryPermissionDenied;
