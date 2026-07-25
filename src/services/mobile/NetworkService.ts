/**
 * NetworkService.ts
 *
 * Network connectivity detection service.
 * Currently uses browser navigator.onLine API.
 *
 * Phase 4 upgrade path: swap for @capacitor/network which provides
 * reliable native connectivity status on Android/iOS.
 */

export type NetworkStatus = 'online' | 'offline' | 'unknown';
export type ConnectivityCallback = (isOnline: boolean) => void;

const listeners = new Set<ConnectivityCallback>();

// Wire up browser events once
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    listeners.forEach((cb) => cb(true));
  });
  window.addEventListener('offline', () => {
    listeners.forEach((cb) => cb(false));
  });
}

export class NetworkService {
  private static instance: NetworkService;

  private constructor() {}

  public static getInstance(): NetworkService {
    if (!NetworkService.instance) {
      NetworkService.instance = new NetworkService();
    }
    return NetworkService.instance;
  }

  /**
   * Returns true if the device currently has network connectivity.
   */
  public isOnline(): boolean {
    if (typeof navigator === 'undefined') return true;
    return navigator.onLine;
  }

  /**
   * Returns the current connectivity status.
   */
  public getStatus(): NetworkStatus {
    if (typeof navigator === 'undefined') return 'unknown';
    return navigator.onLine ? 'online' : 'offline';
  }

  /**
   * Register a callback that fires when connectivity changes.
   * Returns an unsubscribe function — call it in useEffect cleanup.
   */
  public onConnectivityChange(callback: ConnectivityCallback): () => void {
    listeners.add(callback);
    return () => {
      listeners.delete(callback);
    };
  }

  /**
   * Wait for connectivity to be restored.
   * Resolves immediately if already online.
   * Use carefully — can hang forever if network never comes back.
   */
  public waitForOnline(): Promise<void> {
    return new Promise((resolve) => {
      if (this.isOnline()) {
        resolve();
        return;
      }
      const unsubscribe = this.onConnectivityChange((isOnline) => {
        if (isOnline) {
          unsubscribe();
          resolve();
        }
      });
    });
  }
}
