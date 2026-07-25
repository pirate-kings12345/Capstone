/**
 * NativePermissions.ts
 *
 * Permission checking and requesting for camera and media storage.
 * Wraps @capacitor/camera permission APIs.
 *
 * Phase 2 — Camera and Gallery permissions only.
 */

import { Camera, type CameraPermissionState } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

export type PermissionStatus = 'granted' | 'denied' | 'prompt' | 'prompt-with-rationale' | 'limited';

export interface CameraPermissions {
  camera: PermissionStatus;
  photos: PermissionStatus;
}

function mapState(state: CameraPermissionState): PermissionStatus {
  // Capacitor uses 'granted', 'denied', 'prompt', 'prompt-with-rationale', 'limited'
  return state as PermissionStatus;
}

/**
 * Check current camera and photos/gallery permission status without prompting.
 */
export async function checkPermissions(): Promise<CameraPermissions> {
  if (!Capacitor.isNativePlatform()) {
    // On web, camera access depends on browser — treat as granted for dev
    return { camera: 'granted', photos: 'granted' };
  }
  const status = await Camera.checkPermissions();
  return {
    camera: mapState(status.camera),
    photos: mapState(status.photos),
  };
}

/**
 * Request camera and photos permissions from the OS.
 * Will show the system permission dialog on first call.
 */
export async function requestPermissions(): Promise<CameraPermissions> {
  if (!Capacitor.isNativePlatform()) {
    return { camera: 'granted', photos: 'granted' };
  }
  const status = await Camera.requestPermissions({ permissions: ['camera', 'photos'] });
  return {
    camera: mapState(status.camera),
    photos: mapState(status.photos),
  };
}

/**
 * Check camera permission only.
 */
export async function checkCameraPermission(): Promise<PermissionStatus> {
  const p = await checkPermissions();
  return p.camera;
}

/**
 * Check photos/gallery permission only.
 */
export async function checkGalleryPermission(): Promise<PermissionStatus> {
  const p = await checkPermissions();
  return p.photos;
}

/**
 * Returns true if the given status means the permission is usable.
 */
export function isPermissionGranted(status: PermissionStatus): boolean {
  return status === 'granted' || status === 'limited';
}

/**
 * Returns true if the OS will show a rationale / explanation before requesting.
 */
export function needsRationale(status: PermissionStatus): boolean {
  return status === 'prompt-with-rationale';
}

/**
 * Returns true if permission was permanently denied (user must go to Settings).
 */
export function isPermanentlyDenied(status: PermissionStatus): boolean {
  return status === 'denied';
}
