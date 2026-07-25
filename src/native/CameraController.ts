/**
 * CameraController.ts
 *
 * State machine that orchestrates the full camera lifecycle.
 *
 * Coordinates:
 *   CameraPermissionService → permission check/request
 *   CameraPreviewService    → native preview start/stop/capture
 *
 * Emits state changes via a callback so React hooks can update UI.
 *
 * Phase 2 — Preview + capture.
 * Phase 5 — Will add frame streaming for TensorFlow Lite inference.
 */

import { Capacitor } from '@capacitor/core';
import { CameraPreviewService } from './CameraPreviewService';
import {
  ensureCameraPermission,
  isCameraGranted,
  isCameraPermanentlyDenied,
  permissionToCameraError,
} from './CameraPermissionService';
import {
  CameraPreviewState,
  FlashMode,
  CameraLens,
  type CaptureResult,
  type CameraError,
} from './CameraState';

export interface CameraControllerState {
  previewState: CameraPreviewState;
  capturedImage: CaptureResult | null;
  flashMode: FlashMode;
  lens: CameraLens;
  error: CameraError | null;
}

export type CameraStateChangeCallback = (state: CameraControllerState) => void;

const DEFAULT_STATE: CameraControllerState = {
  previewState: CameraPreviewState.Idle,
  capturedImage: null,
  flashMode: FlashMode.Off,
  lens: CameraLens.Rear,
  error: null,
};

export class CameraController {
  private _state: CameraControllerState = { ...DEFAULT_STATE };
  private _listeners = new Set<CameraStateChangeCallback>();
  private readonly _preview = CameraPreviewService.getInstance();

  // ── Public State Access ───────────────────────────────────────────────────

  public getState(): Readonly<CameraControllerState> {
    return this._state;
  }

  public subscribe(cb: CameraStateChangeCallback): () => void {
    this._listeners.add(cb);
    return () => this._listeners.delete(cb);
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  /**
   * Start the camera preview.
   * Performs permission check → request → start preview.
   * On permanently denied: sets error state (caller should navigate to permission screen).
   */
  public async startPreview(): Promise<void> {
    this._setState({
      previewState: CameraPreviewState.Initializing,
      error: null,
    });

    // ── Permission flow ──────────────────────────────────────────────────
    if (Capacitor.isNativePlatform()) {
      const permStatus = await ensureCameraPermission();

      if (!isCameraGranted(permStatus)) {
        const err = permissionToCameraError(permStatus);
        this._setState({
          previewState: CameraPreviewState.Error,
          error: err,
        });
        return;
      }
    }

    // ── Start native preview ─────────────────────────────────────────────
    try {
      await this._preview.start(this._state.lens);
      this._setState({ previewState: CameraPreviewState.Previewing });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      this._setState({
        previewState: CameraPreviewState.Error,
        error: { code: 'START_FAILED', message: `Failed to start camera: ${msg}` },
      });
    }
  }

  /**
   * Stop the preview and clean up.
   */
  public async stopPreview(): Promise<void> {
    await this._preview.stop();
    this._setState({
      previewState: CameraPreviewState.Idle,
      capturedImage: null,
      error: null,
    });
  }

  /**
   * Pause the preview (app backgrounded).
   */
  public async pausePreview(): Promise<void> {
    if (this._state.previewState !== CameraPreviewState.Previewing) return;
    await this._preview.pause();
    this._setState({ previewState: CameraPreviewState.Paused });
  }

  /**
   * Resume the preview (app foregrounded).
   */
  public async resumePreview(): Promise<void> {
    if (this._state.previewState !== CameraPreviewState.Paused) return;
    await this._preview.resume(this._state.lens);
    this._setState({ previewState: CameraPreviewState.Previewing });
  }

  // ── Capture ───────────────────────────────────────────────────────────────

  /**
   * Capture the current camera frame.
   * Transitions to Captured state and returns the image.
   */
  public async capture(): Promise<CaptureResult | null> {
    if (this._state.previewState !== CameraPreviewState.Previewing) return null;

    try {
      const result = await this._preview.capture();
      this._setState({
        previewState: CameraPreviewState.Captured,
        capturedImage: result,
      });
      return result;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      this._setState({
        error: { code: 'CAPTURE_FAILED', message: `Capture failed: ${msg}` },
      });
      return null;
    }
  }

  /**
   * Discard the captured image and resume the live preview.
   */
  public async retake(): Promise<void> {
    this._setState({ capturedImage: null });
    await this._preview.resume(this._state.lens);
    this._setState({ previewState: CameraPreviewState.Previewing, error: null });
  }

  // ── Controls ──────────────────────────────────────────────────────────────

  /**
   * Cycle flash: Off → On → Torch → Off
   */
  public async cycleFlash(): Promise<void> {
    const next: Record<FlashMode, FlashMode> = {
      [FlashMode.Off]: FlashMode.On,
      [FlashMode.On]: FlashMode.Torch,
      [FlashMode.Torch]: FlashMode.Off,
      [FlashMode.Auto]: FlashMode.Off,
    };
    const newMode = next[this._state.flashMode];
    await this._preview.setFlashMode(newMode);
    this._setState({ flashMode: newMode });
  }

  /**
   * Set flash to a specific mode.
   */
  public async setFlashMode(mode: FlashMode): Promise<void> {
    await this._preview.setFlashMode(mode);
    this._setState({ flashMode: mode });
  }

  /**
   * Flip between front and rear cameras.
   */
  public async flipCamera(): Promise<void> {
    const newLens = this._state.lens === CameraLens.Rear ? CameraLens.Front : CameraLens.Rear;
    await this._preview.flip();
    this._setState({ lens: newLens });
  }

  // ── Private ───────────────────────────────────────────────────────────────

  private _setState(partial: Partial<CameraControllerState>): void {
    this._state = { ...this._state, ...partial };
    this._listeners.forEach((cb) => cb(this._state));
  }
}
