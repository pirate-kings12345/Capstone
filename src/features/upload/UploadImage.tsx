import React, { useRef, useState, ChangeEvent } from 'react';
import { ImageIcon, Upload, Trash2, Loader2, Camera, Sparkles, AlertCircle, X } from 'lucide-react';
import { useAppNavigation } from '../../navigation/AppNavigator';
import { AppLayout } from '../../layouts/AppLayout';
import { useCamera } from '../../hooks/mobile/useCamera';
import { isNativePlatform } from '../../native/NativeCamera';
import { useScanAnalysis } from '../../hooks/scan/useScanAnalysis';

export const UploadImage: React.FC = () => {
  const { navigate } = useAppNavigation();
  const [webPreview, setWebPreview] = useState<string | null>(null);
  const [webBase64,  setWebBase64]  = useState<string | null>(null);
  const { isAnalyzing, stepLabel, error, analyze, clearError } = useScanAnalysis();

  const {
    capturedImage, isCapturing, error: cameraError,
    takePhoto, pickFromGallery, clearImage,
  } = useCamera();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setWebPreview(dataUrl);
      setWebBase64(dataUrl.split(',')[1] ?? dataUrl);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handlePickFromGallery = async () => {
    clearError();
    if (isNativePlatform()) {
      await pickFromGallery();
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleTakePhoto = async () => {
    clearError();
    await takePhoto();
  };

  const handleClearPreview = () => {
    setWebPreview(null);
    setWebBase64(null);
    clearImage();
    clearError();
  };

  const handleAnalyze = async () => {
    const base64 = isNativePlatform()
      ? capturedImage
      : (capturedImage || webBase64);

    if (!base64) return;

    // Build the display URL for the Result Screen image
    const displayUrl = isNativePlatform()
      ? (capturedImage?.startsWith('data:') ? capturedImage : `data:image/jpeg;base64,${capturedImage}`)
      : (webPreview || (capturedImage?.startsWith('data:') ? capturedImage : `data:image/jpeg;base64,${capturedImage}`));

    await analyze(base64, displayUrl ?? undefined);
  };

  const imagePreview = isNativePlatform()
    ? capturedImage
    : (capturedImage || webPreview);

  const hasImage = !!imagePreview;
  const displayError = error || cameraError;

  return (
    <AppLayout title="Upload Photo" showBack>
      <div className="space-y-6 pb-12 max-w-md mx-auto">

        {!isNativePlatform() && (
          <input type="file" ref={fileInputRef} onChange={handleFileChange}
            accept="image/*" className="hidden" />
        )}

        {/* AI analyzing overlay */}
        {isAnalyzing && (
          <div className="w-full rounded-2xl border border-cyan-500/20 bg-cyan-950/30 p-6 flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
            <div className="text-center space-y-1">
              <p className="text-sm font-bold text-cyan-300">{stepLabel || 'Analyzing...'}</p>
              <p className="text-xs text-slate-400">Please wait</p>
            </div>
            <div className="flex gap-1.5">
              {['uploading','analyzing','receiving','saving'].map((s, i) => {
                const idx = stepLabel.toLowerCase().includes('upload') ? 0
                  : stepLabel.toLowerCase().includes('analyz') ? 1
                  : stepLabel.toLowerCase().includes('receiv') ? 2 : 3;
                return <span key={s} className={`w-2 h-2 rounded-full ${i <= idx ? 'bg-cyan-400' : 'bg-white/20'}`} />;
              })}
            </div>
          </div>
        )}

        {/* Camera opening */}
        {isCapturing && !isAnalyzing && (
          <div className="w-full aspect-[4/3] rounded-2xl border border-white/10 glass-card flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
            <p className="text-sm font-bold text-cyan-600 dark:text-cyan-300 tracking-wide">Opening...</p>
          </div>
        )}

        {/* Error banner */}
        {displayError && !isAnalyzing && (
          <div className="w-full rounded-2xl bg-rose-950/40 border border-rose-500/20 px-4 py-3.5 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-rose-300 font-medium leading-snug flex-1">{displayError}</p>
            <button onClick={clearError} className="text-rose-400 hover:text-rose-200 cursor-pointer flex-shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Image preview */}
        {hasImage && !isCapturing ? (
          <div className="space-y-4">
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-white/20 glass-card shadow-lg">
              <img src={imagePreview!} alt="Upload Preview" className="w-full h-full object-cover" />
              {!isAnalyzing && (
                <button onClick={handleClearPreview}
                  className="absolute top-4 right-4 p-2.5 bg-rose-600/80 backdrop-blur-sm text-white rounded-xl hover:bg-rose-500 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full h-14 bg-gradient-to-r from-cyan-600 to-sky-700 hover:from-cyan-500 hover:to-sky-600 disabled:opacity-50 text-white font-bold rounded-2xl shadow-lg shadow-cyan-500/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isAnalyzing
                ? <><Loader2 className="w-5 h-5 animate-spin" /> <span>{stepLabel || 'Analyzing...'}</span></>
                : <><Sparkles className="w-5 h-5 text-cyan-300" /> <span>Identify Species</span></>}
            </button>
          </div>

        ) : !isCapturing && !isAnalyzing ? (
          <div className="space-y-4">
            <button onClick={handlePickFromGallery}
              className="w-full aspect-[4/3] rounded-2xl border-2 border-dashed border-slate-300 dark:border-white/20 hover:border-cyan-500 dark:hover:border-cyan-500 transition-all flex flex-col items-center justify-center gap-4 bg-white/40 dark:bg-black/10 hover:bg-white/60 dark:hover:bg-black/20 text-slate-500 dark:text-slate-400 p-6 cursor-pointer">
              <div className="w-16 h-16 rounded-full bg-cyan-100 dark:bg-cyan-950/40 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                <Upload className="w-7 h-7" />
              </div>
              <div className="text-center space-y-1">
                <p className="font-bold text-slate-800 dark:text-white">Choose from Gallery</p>
                <p className="text-xs text-slate-500">
                  {isNativePlatform() ? 'Opens native photo library' : 'Supports JPG, PNG formats'}
                </p>
              </div>
            </button>

            <button onClick={handleTakePhoto}
              className="w-full h-14 flex items-center justify-center gap-3 bg-white/40 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-cyan-500 dark:hover:border-cyan-500/40 rounded-2xl transition-all cursor-pointer text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-white/60 dark:hover:bg-white/10">
              <Camera className="w-5 h-5 text-cyan-500" />
              {isNativePlatform() ? 'Take a Photo' : 'Open Camera'}
            </button>
          </div>
        ) : null}

      </div>
    </AppLayout>
  );
};
export default UploadImage;

