/**
 * CameraState.ts
 *
 * TypeScript enums and types for the embedded camera preview system.
 * Used by CameraPreviewService, CameraController, and useCameraPreview.
 *
 * Phase 2 — Camera preview state management.
 * Phase 5 — TensorFlow Lite will add DETECTING state.
 */

/**
 * Lifecycle states of the embedded camera preview.
 */
export enum CameraPreviewState {
  /** Camera is not started */
  Idle = 'idle',
  /** Permission check or camera start in progress */
  Initializing = 'initializing',
  /** Live camera feed is active */
  Previewing = 'previewing',
  /** Preview is paused (e.g. app backgrounded) */
  Paused = 'paused',
  /** A frame has been captured — preview is frozen */
  Captured = 'captured',
  /** An error occurred (permissions denied, camera unavailable) */
  Error = 'error',
}

/**
 * Flash / torch mode.
 */
export enum FlashMode {
  Off = 'off',
  On = 'on',
  Auto = 'auto',
  Torch = 'torch',
}

/**
 * Camera lens direction.
 */
export enum CameraLens {
  Rear = 'rear',
  Front = 'front',
}

/**
 * Result of a camera capture operation.
 */
export interface CaptureResult {
  /** data URL suitable for <img src={...}> */
  dataUrl: string;
  /** Raw base64 without data:image/... prefix */
  base64: string;
  /** Image format, e.g. 'jpeg' or 'png' */
  format: string;
}

/**
 * Options for starting the camera preview.
 */
export interface CameraPreviewStartOptions {
  /** Which camera lens to use (default: rear) */
  lens?: CameraLens;
  /** Enable/disable flash at start (default: off) */
  flashMode?: FlashMode;
  /** Quality for captured images 0–100 (default: 85) */
  quality?: number;
}

/**
 * Camera error types.
 */
export type CameraErrorCode =
  | 'PERMISSION_DENIED'
  | 'PERMISSION_PERMANENTLY_DENIED'
  | 'CAMERA_UNAVAILABLE'
  | 'CAPTURE_FAILED'
  | 'START_FAILED'
  | 'UNKNOWN';

/**
 * Structured camera error.
 */
export interface CameraError {
  code: CameraErrorCode;
  message: string;
}
