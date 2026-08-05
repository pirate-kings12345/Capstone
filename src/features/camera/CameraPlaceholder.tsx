import React, { useCallback } from 'react';
import {
  Flashlight, AlertCircle, Camera, Check,
  RefreshCw, Sparkles, Loader2, Zap, ZapOff, X, Image as ImageIcon, ZoomIn
} from 'lucide-react';
import { useAppNavigation } from '../../navigation/AppNavigator';
import { useCameraPreview } from '../../hooks/mobile/useCameraPreview';
import { CameraPreviewState, FlashMode } from '../../native/CameraState';
import { useScanAnalysis } from '../../hooks/scan/useScanAnalysis';
import { BottomSheetResult } from '../../components/BottomSheetResult';
import { ScanningOverlay } from '../../components/ScanningOverlay';

function FlashIcon({ mode }: { mode: FlashMode }) {
  if (mode === FlashMode.Torch) return <Flashlight className="w-5 h-5 fill-current text-amber-300" />;
  if (mode === FlashMode.On)    return <Zap className="w-5 h-5 fill-current text-amber-300" />;
  return <ZapOff className="w-5 h-5 text-white/70" />;
}
function flashButtonClass(mode: FlashMode): string {
  return mode === FlashMode.Off
    ? 'bg-black/45 border-white/10 text-white'
    : 'bg-amber-400/25 border-amber-400/60 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.3)]';
}
function flashLabel(mode: FlashMode): string {
  return mode === FlashMode.Off ? 'Flash: Off' : mode === FlashMode.On ? 'Flash: On' : 'Torch';
}

export const CameraPlaceholder: React.FC = () => {
  const { navigate, selectedSpecies, setSelectedSpecies } = useAppNavigation();
  const { isAnalyzing, stepLabel, error, analyze, clearError } = useScanAnalysis();

  const {
    previewState, capturedImage, flashMode, errorMessage,
    isNative, videoRef, canvasRef, capture, retake, stopPreview, cycleFlash, pickFromGallery
  } = useCameraPreview();

  const handleCapture = useCallback(async () => {
    clearError();
    await capture();
  }, [capture, clearError]);

  const handleRetake = useCallback(async () => {
    clearError();
    await retake();
  }, [retake, clearError]);

  const handleCancel = useCallback(async () => {
    await stopPreview();
    navigate('Home');
  }, [stopPreview, navigate]);

  const handleCloseSheet = useCallback(async () => {
    setSelectedSpecies(null);
    await stopPreview();
    navigate('Home');
  }, [stopPreview, navigate, setSelectedSpecies]);

  const handleScanAgainSheet = useCallback(async () => {
    setSelectedSpecies(null);
    clearError();
    await retake();
  }, [retake, setSelectedSpecies, clearError]);

  const handleAnalyze = useCallback(async () => {
    if (!capturedImage || isAnalyzing) return;
    // Pass capturedImage as both the base64 source AND the display URL
    // so the scanned photo always appears on the Result Screen
    const displayUrl = capturedImage.startsWith('data:')
      ? capturedImage
      : `data:image/jpeg;base64,${capturedImage}`;
    await analyze(capturedImage, displayUrl);
  }, [capturedImage, isAnalyzing, analyze]);

  const isLive       = previewState === CameraPreviewState.Previewing;
  const isCaptured   = previewState === CameraPreviewState.Captured;
  const isInitializing = previewState === CameraPreviewState.Initializing;
  const hasError     = previewState === CameraPreviewState.Error;

  return (
    <div className={`fixed inset-0 z-40 overflow-hidden select-none font-sans text-white transition-colors duration-500 ${
      isLive && isNative ? 'bg-transparent' : 'bg-black'
    }`}>
      {/* Web camera video */}
      {!isNative && (
        <video
          ref={videoRef as React.RefObject<HTMLVideoElement>}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          autoPlay playsInline muted
          style={{ display: isCaptured ? 'none' : 'block' }}
        />
      )}
      <canvas ref={canvasRef as React.RefObject<HTMLCanvasElement>} className="hidden" />

      {/* Captured image preview */}
      {capturedImage && (
        <img src={capturedImage} alt="Captured specimen"
          className="absolute inset-0 w-full h-full object-cover" />
      )}

      {/* AI analyzing overlay */}
      {isAnalyzing && <ScanningOverlay stepLabel={stepLabel || 'Analyzing...'} />}

      {/* Camera initializing */}
      {isInitializing && !isAnalyzing && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-30">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-12 h-12 text-[#4FC3F7] animate-spin" />
            <p className="text-xs font-bold tracking-widest uppercase text-[#73E3E7]">Starting camera...</p>
          </div>
        </div>
      )}

      {/* Camera hardware error */}
      {hasError && errorMessage && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-30 px-8">
          <div className="w-full max-w-sm bg-rose-950/90 border border-rose-500/30 rounded-2xl p-6 flex flex-col items-center gap-4 text-center">
            <AlertCircle className="w-12 h-12 text-rose-400" />
            <p className="text-sm font-semibold text-rose-200">{errorMessage}</p>
            <button onClick={handleCancel}
              className="px-6 py-2.5 bg-white/10 border border-white/20 rounded-xl text-xs font-bold hover:bg-white/20 transition-all cursor-pointer">
              Go Back
            </button>
          </div>
        </div>
      )}

      {/* AI / network error banner */}
      {error && !isAnalyzing && (
        <div className="absolute bottom-44 left-4 right-4 z-50">
          <div className="bg-rose-950/95 border border-rose-500/40 rounded-2xl px-4 py-3.5 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-rose-200 font-medium leading-snug flex-1">{error}</p>
            <button onClick={clearError} className="text-rose-400 hover:text-rose-200 cursor-pointer flex-shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Close Button */}
      <div className="absolute top-6 left-6 z-50">
        <button onClick={handleCancel} disabled={isAnalyzing}
          className="p-3 bg-black/40 backdrop-blur-md hover:bg-black/60 rounded-full border border-white/10 cursor-pointer transition-all active:scale-95 disabled:opacity-40">
          <X className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Flash and Zoom */}
      <div className="absolute top-6 right-6 z-50 flex items-center gap-3">
        <button disabled={isAnalyzing}
          className="p-3 rounded-full border bg-black/45 border-white/10 text-white transition-all cursor-pointer active:scale-95 disabled:opacity-40">
          <ZoomIn className="w-5 h-5 text-white/70" />
        </button>
        <button onClick={cycleFlash} title={flashLabel(flashMode)} disabled={isAnalyzing}
          className={`p-3 rounded-full border transition-all cursor-pointer active:scale-95 disabled:opacity-40 ${flashButtonClass(flashMode)}`}>
          <FlashIcon mode={flashMode} />
        </button>
      </div>

      {/* Scanner reticle */}
      <div className="absolute inset-0 flex items-center justify-center p-6 pointer-events-none z-20">
        <div className={`relative w-full max-w-xs aspect-square border rounded-2xl flex items-center justify-center transition-colors duration-500 ${
          isCaptured ? 'border-emerald-500/40' : hasError ? 'border-rose-500/30' : 'border-white/10'
        }`}>
          {(['tl','tr','bl','br'] as const).map(corner => {
            const t = corner.startsWith('t') ? 'top-0 border-t-4' : 'bottom-0 border-b-4';
            const l = corner.endsWith('l')   ? 'left-0 border-l-4'  : 'right-0 border-r-4';
            const r = corner === 'tl' ? 'rounded-tl-lg' : corner === 'tr' ? 'rounded-tr-lg' : corner === 'bl' ? 'rounded-bl-lg' : 'rounded-br-lg';
            const c = isCaptured ? 'border-emerald-500' : hasError ? 'border-rose-500' : 'border-[#4FC3F7]';
            return <div key={corner} className={`absolute w-8 h-8 ${t} ${l} ${r} ${c}`} />;
          })}
          {isCaptured && !isAnalyzing && (
            <div className="bg-emerald-600/90 backdrop-blur-md border border-emerald-400/30 px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg">
              <Check className="w-4 h-4 text-white" />
              <span className="text-xs tracking-wider uppercase text-white">Ready</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom HUD */}
      <div className="absolute bottom-0 left-0 w-full z-50 bg-gradient-to-t from-black/90 via-black/40 to-transparent pb-10 pt-6 px-6">
        <div className="max-w-md mx-auto w-full flex flex-col gap-6 items-center">
          <div className="w-full grid grid-cols-3 gap-3 items-center">
            
            {/* Left Button */}
            {!isCaptured ? (
              <button onClick={pickFromGallery} disabled={isAnalyzing}
                className="h-14 w-14 ml-auto rounded-full bg-white/10 border border-white/10 text-xs font-bold flex flex-col items-center justify-center gap-1 hover:bg-white/20 active:scale-95 transition-all disabled:opacity-30 cursor-pointer">
                <ImageIcon className="w-5 h-5 text-white" />
              </button>
            ) : (
              <button onClick={handleRetake} disabled={isAnalyzing}
                className="h-14 rounded-2xl bg-white/10 border border-white/10 text-xs font-bold flex flex-col items-center justify-center gap-1 hover:bg-white/20 active:scale-95 transition-all disabled:opacity-30 cursor-pointer">
                <RefreshCw className="w-4 h-4" />
                <span>Retake</span>
              </button>
            )}

            {/* Center Button */}
            {!isCaptured ? (
              <button onClick={handleCapture} disabled={!isLive || isAnalyzing}
                className="relative h-16 w-16 mx-auto rounded-full bg-white border-4 border-slate-600 hover:scale-105 active:scale-95 transition-all flex items-center justify-center disabled:opacity-30 cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                <Camera className="w-6 h-6 text-black" />
              </button>
            ) : (
              <div /> // Empty center when captured
            )}

            {/* Right Button */}
            {!isCaptured ? (
              <div /> // Empty right when live
            ) : (
              <button onClick={handleAnalyze} disabled={!isCaptured || isAnalyzing}
                className="h-14 rounded-2xl bg-[#1F3FAF] hover:bg-[#1F3FAF]/90 text-xs font-bold flex flex-col items-center justify-center gap-1 hover:shadow-lg shadow-[#1F3FAF]/25 active:scale-95 transition-all disabled:opacity-30 cursor-pointer text-white border border-[#1F3FAF]/20">
                {isAnalyzing
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <Sparkles className="w-4 h-4 text-[#4FC3F7]" />}
                <span>{isAnalyzing ? 'Analyzing...' : 'Analyze'}</span>
              </button>
            )}

          </div>
        </div>
      </div>

      <BottomSheetResult 
        species={selectedSpecies}
        onClose={handleCloseSheet}
        onScanAgain={handleScanAgainSheet}
      />
    </div>
  );
};
export default CameraPlaceholder;

