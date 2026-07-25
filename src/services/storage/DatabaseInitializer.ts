/**
 * DatabaseInitializer.ts
 * Bootstraps SQLite, Firebase, Auth, and SyncService on first launch.
 * Called once from main.tsx before React renders.
 */

import { SQLiteService } from './SQLiteService';
import { SettingsRepository } from '../../repositories/SettingsRepository';
import { initializeFirebase, isFirebaseConfigured } from '../../config/firebase';
import { AuthService } from '../firebase/AuthService';
import { SyncService } from '../sync/SyncService';

export async function initializeDatabase(): Promise<void> {
  // 1. SQLite — always runs, offline-first
  const db = SQLiteService.getInstance();
  await db.initialize();

  // 2. Seed default settings row if first launch
  const settings = SettingsRepository.getInstance();
  await settings.getSettings();

  // 3. Firebase — gracefully skipped if env vars not configured
  const firebaseReady = initializeFirebase();
  if (firebaseReady) {
    // 4. Auth — anonymous sign-in so every device gets a UID
    await AuthService.getInstance().initialize();

    // 5. Sync — start network listener for automatic cloud sync
    SyncService.getInstance().start();
  }
}
