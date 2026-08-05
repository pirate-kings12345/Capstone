/**
 * useCameraPreview.ts
 *
 * React hook for the embedded camera preview system.
 *
 * On Android (native):
 *   - Uses CameraController → CameraPreviewService → @capacitor-community/camera-preview
 *   - Camera renders behind the WebView as a native layer
 *   - WebView background becomes transparent
 *
 * On web (dev / browser):
 *   - Uses navigator.mediaDevices.getUserMedia
 *   - Renders a <video> element in the viewfinder area
 *   - Canvas capture for still frames
 *
 * Phase 2 — Live preview + capture only. No AI analysis.
 */

import { useState, useEffect, useRef, useCallback, type RefObject } from 'react';
import { Capacitor } from '@capacitor/core';
import { CameraController } from '../../native/CameraController';
import { CameraPreviewState, FlashMode, type CaptureResult } from '../../native/CameraState';
import { onAppStateChange } from '../../native/AppLifecycle';
import {
  isCameraPermanentlyDenied,
} from '../../native/CameraPermissionService';
import { useAppNavigation } from '../../navigation/AppNavigator';
import { pickFromGallery as nativePickFromGallery } from '../../native/NativeCamera';

// ── Types ─────────────────────────────────────────────────────────────────

export interface UseCameraPreviewReturn {
  /** Current state of the camera */
  previewState: CameraPreviewState;
  /** Captured image data URL (null when in preview / idle) */
  capturedImage: string | null;
  /** Current flash mode */
  flashMode: FlashMode;
  /** Error message to display (null when no error) */
  errorMessage: string | null;
  /** True on native Android, false on web */
  isNative: boolean;
  /** ref to attach to a <video> element — web fallback only */
  videoRef: RefObject<HTMLVideoElement | null>;
  /** ref to attach to a <canvas> element — web capture only */
  canvasRef: RefObject<HTMLCanvasElement | null>;
  /** Start or restart the camera preview */
  startPreview: () => Promise<void>;
  /** Stop the preview completely */
  stopPreview: () => Promise<void>;
  /** Capture the current frame */
  capture: () => Promise<void>;
  /** Discard captured image, resume preview */
  retake: () => Promise<void>;
  /** Cycle flash Off → On → Torch → Off */
  cycleFlash: () => Promise<void>;
  /** Flip front/rear camera */
  flipCamera: () => Promise<void>;
  /** Open gallery to pick an image */
  pickFromGallery: () => Promise<void>;
}

// ── Web Helpers ───────────────────────────────────────────────────────────

/**
 * Start getUserMedia stream and attach to a video element.
 */
async function startWebPreview(videoEl: HTMLVideoElement): Promise<MediaStream> {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: 'environment', // Rear camera preference
      width: { ideal: 1280 },
      height: { ideal: 720 },
    },
    audio: false,
  });
  videoEl.srcObject = stream;
  await videoEl.play();
  return stream;
}

/**
 * Capture a still frame from a video element via canvas.
 */
function captureWebFrame(
  videoEl: HTMLVideoElement,
  canvasEl: HTMLCanvasElement,
  quality = 0.85,
): CaptureResult {
  canvasEl.width = videoEl.videoWidth;
  canvasEl.height = videoEl.videoHeight;
  const ctx = canvasEl.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context not available');
  ctx.drawImage(videoEl, 0, 0);
  const dataUrl = canvasEl.toDataURL('image/jpeg', quality);
  const base64 = dataUrl.split(',')[1] ?? '';
  return { dataUrl, base64, format: 'jpeg' };
}

/**
 * Stop all tracks in a MediaStream.
 */
function stopWebStream(stream: MediaStream | null): void {
  stream?.getTracks().forEach((t) => t.stop());
}

// ── Hook ──────────────────────────────────────────────────────────────────

export function useCameraPreview(): UseCameraPreviewReturn {
  const { navigate } = useAppNavigation();
  const isNative = Capacitor.isNativePlatform();

  // ── Native controller (per-instance, not singleton, so each screen mount
  //    gets a fresh state but shares the underlying service singleton)
  const controllerRef = useRef<CameraController>(new CameraController());

  // ── State ────────────────────────────────────────────────────────────────
  const [previewState, setPreviewState] = useState<CameraPreviewState>(
    CameraPreviewState.Idle,
  );
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [flashMode, setFlashMode] = useState<FlashMode>(FlashMode.Off);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ── Web fallback refs ────────────────────────────────────────────────────
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const webStreamRef = useRef<MediaStream | null>(null);

  // ── Subscribe to native controller state ─────────────────────────────────
  useEffect(() => {
    if (!isNative) return;

    const controller = controllerRef.current;
    const unsubscribe = controller.subscribe((s) => {
      setPreviewState(s.previewState);
      setCapturedImage(s.capturedImage?.dataUrl ?? null);
      setFlashMode(s.flashMode);

      if (s.error) {
        setErrorMessage(s.error.message);

        // Navigate to the appropriate permission denied screen
        if (s.error.code === 'PERMISSION_PERMANENTLY_DENIED' || s.error.code === 'PERMISSION_DENIED') {
          navigate('CameraPermissionDenied');
        }
      } else {
        setErrorMessage(null);
      }
    });

    return unsubscribe;
  }, [isNative, navigate]);

  // ── App lifecycle: pause/resume preview ──────────────────────────────────
  useEffect(() => {
    if (!isNative) return;

    const controller = controllerRef.current;
    const cleanup = onAppStateChange((active) => {
      if (active) {
        controller.resumePreview();
      } else {
        controller.pausePreview();
      }
    });

    return cleanup;
  }, [isNative]);

  // ── Auto-start on mount ───────────────────────────────────────────────────
  useEffect(() => {
    if (isNative) {
      controllerRef.current.startPreview();
    } else {
      // Web: start getUserMedia
      startWebPreviewLocal();
    }

    // Cleanup on unmount
    return () => {
      if (isNative) {
        controllerRef.current.stopPreview();
      } else {
        stopWebStream(webStreamRef.current);
        webStreamRef.current = null;
        setPreviewState(CameraPreviewState.Idle);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Web preview helpers ───────────────────────────────────────────────────

  const startWebPreviewLocal = useCallback(async () => {
    setPreviewState(CameraPreviewState.Initializing);
    setErrorMessage(null);

    if (!navigator.mediaDevices?.getUserMedia) {
      setPreviewState(CameraPreviewState.Error);
      setErrorMessage('Camera not supported in this browser.');
      return;
    }

    try {
      // Stop any existing stream first
      stopWebStream(webStreamRef.current);

      const videoEl = videoRef.current;
      if (!videoEl) {
        setPreviewState(CameraPreviewState.Error);
        setErrorMessage('Video element not ready.');
        return;
      }

      const stream = await startWebPreview(videoEl);
      webStreamRef.current = stream;
      setPreviewState(CameraPreviewState.Previewing);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      const isPermanent =
        msg.toLowerCase().includes('permission denied') ||
        msg.toLowerCase().includes('notallowederror');

      setPreviewState(CameraPreviewState.Error);

      if (isPermanent) {
        setErrorMessage(
          'Camera permission denied. Please allow camera access in your browser settings.',
        );
      } else {
        setErrorMessage(`Camera unavailable: ${msg}`);
      }
    }
  }, []);

  // ── Public Actions ────────────────────────────────────────────────────────

  const startPreview = useCallback(async () => {
    if (isNative) {
      await controllerRef.current.startPreview();
    } else {
      await startWebPreviewLocal();
    }
  }, [isNative, startWebPreviewLocal]);

  const stopPreview = useCallback(async () => {
    if (isNative) {
      await controllerRef.current.stopPreview();
    } else {
      stopWebStream(webStreamRef.current);
      webStreamRef.current = null;
      setPreviewState(CameraPreviewState.Idle);
    }
  }, [isNative]);

  const capture = useCallback(async () => {
    if (isNative) {
      await controllerRef.current.capture();
    } else {
      // Web: capture from video via canvas
      const videoEl = videoRef.current;
      const canvasEl = canvasRef.current;
      if (!videoEl || !canvasEl) return;

      try {
        const result = captureWebFrame(videoEl, canvasEl);
        // Pause the video stream visually (don't stop the stream so retake works)
        videoEl.pause();
        setCapturedImage(result.dataUrl);
        setPreviewState(CameraPreviewState.Captured);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        setErrorMessage(`Capture failed: ${msg}`);
      }
    }
  }, [isNative]);

  const retake = useCallback(async () => {
    if (isNative) {
      await controllerRef.current.retake();
    } else {
      setCapturedImage(null);
      setErrorMessage(null);
      // Resume video playback
      const videoEl = videoRef.current;
      if (videoEl) {
        await videoEl.play();
      }
      setPreviewState(CameraPreviewState.Previewing);
    }
  }, [isNative]);

  const cycleFlash = useCallback(async () => {
    if (isNative) {
      await controllerRef.current.cycleFlash();
    }
    // Web: flash not supported — no-op
  }, [isNative]);

  const flipCamera = useCallback(async () => {
    if (isNative) {
      await controllerRef.current.flipCamera();
    }
    // Web: could re-call getUserMedia with facingMode toggle — future enhancement
  }, [isNative]);

  const pickFromGallery = useCallback(async () => {
    try {
      const result = await nativePickFromGallery();
      setCapturedImage(result.dataUrl);
      setPreviewState(CameraPreviewState.Captured);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setErrorMessage(`Gallery failed: ${msg}`);
    }
  }, []);

  return {
    previewState,
    capturedImage,
    flashMode,
    errorMessage,
    isNative,
    videoRef,
    canvasRef,
    startPreview,
    stopPreview,
    capture,
    retake,
    cycleFlash,
    flipCamera,
    pickFromGallery,
  };
}
