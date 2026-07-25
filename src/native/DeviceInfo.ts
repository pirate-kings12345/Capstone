/**
 * DeviceInfo.ts
 *
 * Device detection and platform utilities.
 * Uses @capacitor/core for native platform detection.
 *
 * Phase 2 — Platform detection only.
 * Phase 3+ will add @capacitor/device for full device info.
 */

import { Capacitor } from '@capacitor/core';

export type Platform = 'android' | 'ios' | 'web';

/**
 * Returns true when running inside a native Android or iOS shell.
 */
export function isNative(): boolean {
  return Capacitor.isNativePlatform();
}

/**
 * Returns 'android', 'ios', or 'web'.
 */
export function getPlatform(): Platform {
  return Capacitor.getPlatform() as Platform;
}

/**
 * Returns true when running on Android specifically.
 */
export function isAndroid(): boolean {
  return getPlatform() === 'android';
}

/**
 * Returns true when running on iOS specifically.
 */
export function isIOS(): boolean {
  return getPlatform() === 'ios';
}

/**
 * Returns true when running in a browser/web context.
 */
export function isWeb(): boolean {
  return getPlatform() === 'web';
}

/**
 * Returns true if the device has a camera available.
 * On web, returns false unless navigator.mediaDevices is available.
 */
export function hasCameraSupport(): boolean {
  if (isNative()) return true; // Assume native has camera
  if (typeof navigator !== 'undefined' && navigator.mediaDevices) return true;
  return false;
}

/**
 * Returns the safe area inset values for notch-aware layout.
 * On native, these are set via CSS env() variables by Capacitor automatically.
 * This utility exposes them for programmatic use.
 */
export function getSafeAreaInsets(): { top: number; bottom: number; left: number; right: number } {
  const getVar = (name: string): number => {
    if (typeof getComputedStyle === 'undefined') return 0;
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim();
    return parseInt(value, 10) || 0;
  };

  return {
    top: getVar('--ion-safe-area-top') || getVar('safe-area-inset-top'),
    bottom: getVar('--ion-safe-area-bottom') || getVar('safe-area-inset-bottom'),
    left: getVar('--ion-safe-area-left') || getVar('safe-area-inset-left'),
    right: getVar('--ion-safe-area-right') || getVar('safe-area-inset-right'),
  };
}
