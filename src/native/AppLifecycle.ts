/**
 * AppLifecycle.ts
 *
 * Application lifecycle event management using @capacitor/app.
 * - App foreground / background state changes
 * - Hardware back button handling (Android)
 * - Deep link URL open handling
 *
 * Phase 2 — Lifecycle listening only.
 */

import { App, type AppState } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

export type AppStateChangeCallback = (isActive: boolean) => void;
export type BackButtonCallback = () => void;
export type AppUrlOpenCallback = (url: string) => void;

let backButtonListenerHandle: ReturnType<typeof App.addListener> | null = null;
let appStateListenerHandle: ReturnType<typeof App.addListener> | null = null;

/**
 * Register a callback for Android hardware back button presses.
 * Only active on native platforms.
 * Returns a cleanup function — call it in useEffect cleanup.
 */
export function onBackButton(callback: BackButtonCallback): () => void {
  if (!Capacitor.isNativePlatform()) {
    // On web, browser handles back navigation natively
    return () => {};
  }

  const handle = App.addListener('backButton', () => {
    callback();
  });

  backButtonListenerHandle = handle;

  return () => {
    handle.then((h) => h.remove()).catch(() => {});
    backButtonListenerHandle = null;
  };
}

/**
 * Register a callback for app foreground/background state changes.
 * Returns a cleanup function.
 */
export function onAppStateChange(callback: AppStateChangeCallback): () => void {
  if (!Capacitor.isNativePlatform()) {
    return () => {};
  }

  const handle = App.addListener('appStateChange', (state: AppState) => {
    callback(state.isActive);
  });

  appStateListenerHandle = handle;

  return () => {
    handle.then((h) => h.remove()).catch(() => {});
    appStateListenerHandle = null;
  };
}

/**
 * Minimize the app to the background (Android only).
 * Equivalent to pressing the home button.
 */
export async function minimizeApp(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await App.minimizeApp();
  } catch {
    // App.minimizeApp may not be available on all Capacitor versions
  }
}

/**
 * Exit the application (Android only).
 */
export async function exitApp(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  await App.exitApp();
}

/**
 * Remove all registered lifecycle listeners.
 * Call this during app cleanup / unmount.
 */
export async function removeAllListeners(): Promise<void> {
  await App.removeAllListeners();
}
