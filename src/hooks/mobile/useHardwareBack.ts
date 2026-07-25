/**
 * useHardwareBack.ts
 *
 * React hook for Android hardware back button.
 * Registers a listener via @capacitor/app and calls the provided callback.
 *
 * Usage:
 *   useHardwareBack(() => goBack());
 *
 * Phase 2 — Back button navigation only.
 */

import { useEffect } from 'react';
import { onBackButton } from '../../native/AppLifecycle';

/**
 * Register a handler for the Android hardware back button.
 *
 * @param onBack - Callback to invoke when back button is pressed.
 *                 Typically calls navigation.goBack() or navigate('Home').
 * @param enabled - Set to false to temporarily disable this listener.
 */
export function useHardwareBack(onBack: () => void, enabled: boolean = true): void {
  useEffect(() => {
    if (!enabled) return;

    const cleanup = onBackButton(onBack);

    return cleanup;
  }, [onBack, enabled]);
}
