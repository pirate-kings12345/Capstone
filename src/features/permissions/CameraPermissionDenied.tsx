import React from 'react';
import { CameraOff, Settings, ArrowLeft, ShieldAlert } from 'lucide-react';
import { useAppNavigation } from '../../navigation/AppNavigator';
import { isAndroid } from '../../native/DeviceInfo';

/**
 * CameraPermissionDenied
 *
 * Full-screen error state shown when the user has permanently denied
 * camera access. Instructs them how to enable it in device Settings.
 */
export const CameraPermissionDenied: React.FC = () => {
  const { goBack } = useAppNavigation();

  const openAppSettings = () => {
    if (isAndroid()) {
      // On Android, deep-link to the app's settings page
      // This uses the standard Android intent — handled by the OS
      window.open('android.settings.APPLICATION_DETAILS_SETTINGS', '_system');
    } else {
      // On web / iOS, inform the user to open Settings manually
      alert('Please open your device Settings and enable Camera permission for AQUAID.');
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
        <div className="w-28 h-28 rounded-3xl bg-rose-950/60 border border-rose-500/20 flex items-center justify-center shadow-[0_0_60px_rgba(239,68,68,0.15)]">
          <CameraOff className="w-14 h-14 text-rose-400" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-rose-500 border-2 border-slate-950 flex items-center justify-center">
          <ShieldAlert className="w-4 h-4 text-white" />
        </div>
      </div>

      {/* Heading */}
      <h1 className="text-2xl font-extrabold tracking-tight text-center mb-3">
        Camera Access Denied
      </h1>

      {/* Description */}
      <p className="text-sm text-slate-400 text-center leading-relaxed max-w-xs mb-2">
        AQUAID needs access to your camera to scan and identify fish species.
      </p>
      <p className="text-xs text-slate-500 text-center leading-relaxed max-w-xs mb-10">
        You previously denied this permission. To enable it, open your device{' '}
        <span className="text-cyan-400 font-semibold">Settings</span> → <span className="text-cyan-400 font-semibold">Apps</span> → <span className="text-cyan-400 font-semibold">AQUAID</span> → <span className="text-cyan-400 font-semibold">Permissions</span> → Camera.
      </p>

      {/* Steps */}
      <div className="w-full max-w-sm space-y-3 mb-10">
        {[
          { step: '1', text: 'Open device Settings' },
          { step: '2', text: 'Tap Apps → AQUAID' },
          { step: '3', text: 'Tap Permissions → Camera' },
          { step: '4', text: 'Select "Allow"' },
        ].map(({ step, text }) => (
          <div
            key={step}
            className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3"
          >
            <span className="w-7 h-7 rounded-full bg-cyan-600/30 border border-cyan-500/30 flex items-center justify-center text-xs font-bold text-cyan-300 shrink-0">
              {step}
            </span>
            <span className="text-sm text-slate-300">{text}</span>
          </div>
        ))}
      </div>

      {/* Open Settings CTA */}
      <button
        onClick={openAppSettings}
        className="w-full max-w-sm h-14 flex items-center justify-center gap-2.5 bg-gradient-to-r from-cyan-600 to-sky-700 hover:from-cyan-500 hover:to-sky-600 text-white font-bold rounded-2xl shadow-lg shadow-cyan-500/20 active:scale-[0.99] transition-all cursor-pointer mb-4"
      >
        <Settings className="w-5 h-5" />
        Open App Settings
      </button>

      <button
        onClick={goBack}
        className="text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer py-2"
      >
        Go back without camera
      </button>
    </div>
  );
};

export default CameraPermissionDenied;
