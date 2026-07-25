/**
 * CameraPermissionService.ts
 *
 * Dedicated permission service for camera access.
 * Extracted from NativePermissions.ts for single-responsibility.
 *
 * Handles:
 * - First-time permission request
 * - Permission denied
 * - Permission permanently denied
 * - Camera unavailable
 */

import { Capacitor } from '@capacitor/core';
import { Camera, type CameraPermissionState } from '@capacitor/camera';
import {
  type CameraErrorCode,
  type CameraError,
} from './CameraState';

export type PermissionStatus =
  | 'granted'
  | 'denied'
  | 'prompt'
  | 'prompt-with-rationale'
  | 'limited';

function mapCameraState(state: CameraPermissionState): PermissionStatus {
  return state as PermissionStatus;
}

/**
 * Check the current camera permission status without prompting the user.
 */
export async function checkCameraPermission(): Promise<PermissionStatus> {
  if (!Capacitor.isNativePlatform()) {
    // On web — camera access is handled by the browser via getUserMedia
    return 'granted';
  }
  try {
    const status = await Camera.checkPermissions();
    return mapCameraState(status.camera);
  } catch {
    return 'prompt';
  }
}

/**
 * Request camera permission from the OS.
 * Shows the system permission dialog on first call.
 * On subsequent calls where the user permanently denied, returns 'denied'.
 */
export async function requestCameraPermission(): Promise<PermissionStatus> {
  if (!Capacitor.isNativePlatform()) {
    return 'granted';
  }
  try {
    const status = await Camera.requestPermissions({ permissions: ['camera'] });
    return mapCameraState(status.camera);
  } catch {
    return 'denied';
  }
}

/**
 * Returns true if the permission is usable (granted or limited).
 */
export function isCameraGranted(status: PermissionStatus): boolean {
  return status === 'granted' || status === 'limited';
}

/**
 * Returns true if the user permanently denied and must go to Settings.
 */
export function isCameraPermanentlyDenied(status: PermissionStatus): boolean {
  return status === 'denied';
}

/**
 * Returns true if the OS will show a rationale before requesting.
 */
export function needsCameraRationale(status: PermissionStatus): boolean {
  return status === 'prompt-with-rationale';
}

/**
 * Perform the full permission check → request flow.
 * Returns the resolved permission status after any needed prompts.
 */
export async function ensureCameraPermission(): Promise<PermissionStatus> {
  let status = await checkCameraPermission();

  if (isCameraGranted(status)) return status;
  if (isCameraPermanentlyDenied(status)) return status;

  // Needs prompt — request from OS
  status = await requestCameraPermission();
  return status;
}

/**
 * Build a structured CameraError from a permission status.
 */
export function permissionToCameraError(status: PermissionStatus): CameraError {
  if (isCameraPermanentlyDenied(status)) {
    return {
      code: 'PERMISSION_PERMANENTLY_DENIED' as CameraErrorCode,
      message:
        'Camera permission was permanently denied. Please enable it in device Settings → Apps → AQUAID → Permissions.',
    };
  }
  return {
    code: 'PERMISSION_DENIED' as CameraErrorCode,
    message: 'Camera permission is required to scan fish. Please allow camera access.',
  };
}
