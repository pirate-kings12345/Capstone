/**
 * useAppState.ts
 *
 * React hook for app foreground/background state changes.
 * Listens to @capacitor/app appStateChange events.
 *
 * Usage:
 *   const { isActive } = useAppState();
 *
 * Phase 2 — Lifecycle state tracking only.
 */

import { useState, useEffect } from 'react';
import { onAppStateChange } from '../../native/AppLifecycle';

export interface AppStateResult {
  /** True when the app is in the foreground / active */
  isActive: boolean;
}

/**
 * Returns the current foreground/background state of the app.
 * isActive is true when the app is in the foreground.
 */
export function useAppState(): AppStateResult {
  // Default to true — assume app starts in foreground
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const cleanup = onAppStateChange((active) => {
      setIsActive(active);
    });

    return cleanup;
  }, []);

  return { isActive };
}
