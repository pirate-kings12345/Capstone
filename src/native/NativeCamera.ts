/**
 * NativeCamera.ts
 *
 * Native camera and gallery abstraction using @capacitor/camera.
 * On Android: opens native camera or gallery picker.
 * On web (dev/preview): falls back gracefully to browser File input trigger.
 *
 * Phase 2 — Image capture only. No AI recognition.
 */

import { Capacitor } from '@capacitor/core';
import {
  Camera,
  CameraResultType,
  CameraSource,
  CameraDirection,
  type Photo,
} from '@capacitor/camera';

export interface CaptureResult {
  /** data URL suitable for use in <img src={...}> */
  dataUrl: string;
  /** raw base64 string without prefix */
  base64: string;
  /** MIME type, e.g. 'image/jpeg' */
  format: string;
}

export type FlashMode = 'off' | 'on' | 'auto';

const DEFAULT_QUALITY = 85;

function photoToResult(photo: Photo): CaptureResult {
  const format = photo.format ?? 'jpeg';
  const base64 = photo.base64String ?? '';
  const dataUrl = base64
    ? `data:image/${format};base64,${base64}`
    : (photo.webPath ?? '');
  return { dataUrl, base64, format };
}

/**
 * Open the native device camera shutter.
 * Returns a CaptureResult on success.
 * Throws if the user cancels or permission is denied.
 */
export async function takePhoto(
  direction: CameraDirection = CameraDirection.Rear,
  quality: number = DEFAULT_QUALITY
): Promise<CaptureResult> {
  const photo = await Camera.getPhoto({
    quality,
    allowEditing: false,
    resultType: CameraResultType.Base64,
    source: CameraSource.Camera,
    direction,
    saveToGallery: false,
    correctOrientation: true,
    presentationStyle: 'fullscreen',
  });
  return photoToResult(photo);
}

/**
 * Open the native device gallery / photo library picker.
 * Returns a CaptureResult on success.
 * Throws if the user cancels or permission is denied.
 */
export async function pickFromGallery(
  quality: number = DEFAULT_QUALITY
): Promise<CaptureResult> {
  const photo = await Camera.getPhoto({
    quality,
    allowEditing: false,
    resultType: CameraResultType.Base64,
    source: CameraSource.Photos,
    correctOrientation: true,
  });
  return photoToResult(photo);
}

/**
 * Returns true when running inside a real Capacitor native shell (Android/iOS).
 * Returns false on web (dev server / browser preview).
 */
export function isNativePlatform(): boolean {
  return Capacitor.isNativePlatform();
}

/**
 * Returns the current runtime platform string: 'android' | 'ios' | 'web'.
 */
export function getPlatform(): string {
  return Capacitor.getPlatform();
}
