/**
 * CameraPreviewService.ts
 *
 * Singleton service wrapping @capacitor-community/camera-preview.
 *
 * Provides embedded live camera preview INSIDE the app â€” no external
 * camera application is launched. The native camera layer renders
 * BEHIND the WebView. The WebView background must be transparent
 * for the feed to be visible.
 *
 * Web fallback: uses navigator.mediaDevices.getUserMedia with a
 * <video> element â€” handled by the CameraController / useCameraPreview hook.
 *
 * Phase 2 â€” Live preview + capture. No AI analysis.
 * Phase 5 â€” TensorFlow Lite will consume the preview frames directly.
 */

import { Capacitor } from '@capacitor/core';
import { CameraPreview } from '@capacitor-community/camera-preview';
import { FlashMode, CameraLens, type CaptureResult } from './CameraState';

/** CSS class applied to <body> when the native preview is active */
const CAMERA_ACTIVE_CLASS = 'camera-active';

/** Default capture quality (0â€“100) */
const DEFAULT_QUALITY = 85;

export class CameraPreviewService {
  private static instance: CameraPreviewService;
  private _isRunning = false;

  private constructor() {}

  public static getInstance(): CameraPreviewService {
    if (!CameraPreviewService.instance) {
      CameraPreviewService.instance = new CameraPreviewService();
    }
    return CameraPreviewService.instance;
  }

  /** True when a native preview session is active */
  public get isRunning(): boolean {
    return this._isRunning;
  }

  /**
   * Start the embedded native camera preview.
   *
   * On Android this renders a native camera layer BEHIND the WebView.
   * The body background is set to transparent so the feed shows through.
   *
   * @param lens    Which camera to use (default: rear)
   * @param quality Capture quality 0â€“100 (default: 85)
   */
  public async start(
    lens: CameraLens = CameraLens.Rear,
    quality: number = DEFAULT_QUALITY,
  ): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      // Web mode â€” handled separately via getUserMedia
      return;
    }

    if (this._isRunning) {
      await this.stop();
    }

    await CameraPreview.start({
      position: lens === CameraLens.Front ? 'front' : 'rear',
      parent: 'camera-preview-container',
      className: 'camera-preview-layer',
      // Cover the full screen behind the WebView
      width: window.screen.width,
      height: window.screen.height,
      x: 0,
      y: 0,
      toBack: true,          // Render BEHIND the WebView
      enableOpacity: true,    // Required for transparency on some Android versions
      enableHighResolution: false,
      disableExifHeaderStripping: false,
    });

    // Make the WebView transparent so the camera feed shows through
    this._applyTransparentBackground();
    this._isRunning = true;
  }

  /**
   * Stop the preview and restore the WebView background.
   */
  public async stop(): Promise<void> {
    if (!Capacitor.isNativePlatform()) return;

    try {
      await CameraPreview.stop();
    } catch {
      // Plugin may throw if already stopped â€” safe to ignore
    } finally {
      this._removeTransparentBackground();
      this._isRunning = false;
    }
  }

  /**
   * Pause the preview (e.g. when the app is backgrounded).
   * The native layer is stopped but state is preserved.
   */
  public async pause(): Promise<void> {
    if (!Capacitor.isNativePlatform() || !this._isRunning) return;
    try {
      await CameraPreview.stop();
    } catch {
      // Ignore
    }
  }

  /**
   * Resume the preview (e.g. when the app returns to foreground).
   */
  public async resume(lens: CameraLens = CameraLens.Rear): Promise<void> {
    if (!Capacitor.isNativePlatform()) return;
    // Re-start with the same configuration
    this._isRunning = false; // Allow start() to proceed
    await this.start(lens);
  }

  /**
   * Capture the current camera frame.
   * Returns base64-encoded image data.
   */
  public async capture(quality: number = DEFAULT_QUALITY): Promise<CaptureResult> {
    if (!Capacitor.isNativePlatform()) {
      throw new Error('CameraPreviewService.capture: not on native platform');
    }

    const result = await CameraPreview.capture({ quality });
    const base64 = result.value ?? '';
    const format = 'jpeg';
    const dataUrl = `data:image/${format};base64,${base64}`;
    return { dataUrl, base64, format };
  }

  /**
   * Set the flash / torch mode.
   */
  public async setFlashMode(mode: FlashMode): Promise<void> {
    if (!Capacitor.isNativePlatform()) return;
    try {
      await CameraPreview.setFlashMode({ flashMode: mode });
    } catch {
    }
  }

  /**
   * Flip between front and rear cameras.
   */
  public async flip(): Promise<void> {
    if (!Capacitor.isNativePlatform()) return;
    try {
      await CameraPreview.flip();
    } catch {
    }
  }

  // â”€â”€ Private Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  /**
   * Apply transparent backgrounds so the native camera layer shows through.
   * Only affects the camera screen â€” reversed when stop() is called.
   */
  private _applyTransparentBackground(): void {
    document.body.classList.add(CAMERA_ACTIVE_CLASS);
  }

  /**
   * Restore the normal background after the camera is stopped.
   */
  private _removeTransparentBackground(): void {
    document.body.classList.remove(CAMERA_ACTIVE_CLASS);
  }
}

