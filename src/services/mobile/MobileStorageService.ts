/**
 * MobileStorageService.ts
 *
 * Cross-platform key/value storage service.
 * Currently delegates to localStorage for web compatibility.
 *
 * Phase 3 upgrade path: swap localStorage calls for @capacitor/preferences
 * which persists data natively in Android SharedPreferences / iOS UserDefaults.
 */

export class MobileStorageService {
  private static instance: MobileStorageService;

  private constructor() {}

  public static getInstance(): MobileStorageService {
    if (!MobileStorageService.instance) {
      MobileStorageService.instance = new MobileStorageService();
    }
    return MobileStorageService.instance;
  }

  /**
   * Retrieve a value by key.
   * Returns null if the key does not exist.
   */
  public async get(key: string): Promise<string | null> {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  /**
   * Store a value by key.
   */
  public async set(key: string, value: string): Promise<void> {
    try {
      localStorage.setItem(key, value);
    } catch {
    }
  }

  /**
   * Remove a value by key.
   */
  public async remove(key: string): Promise<void> {
    try {
      localStorage.removeItem(key);
    } catch {
    }
  }

  /**
   * Clear all stored values.
   * Use with care â€” this will clear everything in localStorage.
   */
  public async clear(): Promise<void> {
    try {
      localStorage.clear();
    } catch {
    }
  }

  /**
   * Check if a key exists.
   */
  public async has(key: string): Promise<boolean> {
    const value = await this.get(key);
    return value !== null;
  }

  /**
   * Get a JSON-parsed value. Returns null on parse failure or missing key.
   */
  public async getJSON<T>(key: string): Promise<T | null> {
    const raw = await this.get(key);
    if (raw === null) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  /**
   * Store a JSON-serializable value.
   */
  public async setJSON<T>(key: string, value: T): Promise<void> {
    try {
      await this.set(key, JSON.stringify(value));
    } catch {
    }
  }
}

