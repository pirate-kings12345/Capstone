/**
 * SyncService.ts
 * Orchestrates bidirectional synchronization between SQLite and Firestore.
 *
 * Architecture:
 *   SQLite (source of truth offline)
 *     ↕
 *   SyncService
 *     ↕
 *   Firestore (cloud backup + multi-device)
 *
 * Rules:
 *   - Local-only records are uploaded.
 *   - Cloud-only records are downloaded into SQLite.
 *   - Conflicts: newest updatedAt timestamp wins.
 *   - All failed operations are queued for retry.
 */

import { FirestoreService } from '../firebase/FirestoreService';
import { AuthService } from '../firebase/AuthService';
import { OfflineQueue, QueueCollection } from './OfflineQueue';
import { HistoryRepository } from '../../repositories/HistoryRepository';
import { SavedResultsRepository } from '../../repositories/SavedResultsRepository';
import { SettingsRepository } from '../../repositories/SettingsRepository';
import { SQLiteService } from '../storage/SQLiteService';
import { NetworkService } from '../mobile/NetworkService';
import { SpeciesInfo } from '../../types';

export type SyncStatus = 'idle' | 'syncing' | 'error' | 'offline';

export class SyncService {
  private static instance: SyncService;

  private firestore   = FirestoreService.getInstance();
  private auth        = AuthService.getInstance();
  private queue       = OfflineQueue.getInstance();
  private histRepo    = HistoryRepository.getInstance();
  private savedRepo   = SavedResultsRepository.getInstance();
  private settingsRepo = SettingsRepository.getInstance();
  private network     = NetworkService.getInstance();
  private db          = SQLiteService.getInstance();

  private status: SyncStatus = 'idle';
  private listeners: ((s: SyncStatus) => void)[] = [];
  private networkUnsub: (() => void) | null = null;

  private constructor() {}

  public static getInstance(): SyncService {
    if (!SyncService.instance) SyncService.instance = new SyncService();
    return SyncService.instance;
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  /** Start network listener — triggers sync whenever connection is restored. */
  public start(): void {
    this.networkUnsub = this.network.onConnectivityChange((isOnline) => {
      if (isOnline) this.sync();
    });
    // Attempt sync immediately if already online
    if (this.network.isOnline()) this.sync();
  }

  public stop(): void {
    this.networkUnsub?.();
    this.networkUnsub = null;
  }

  // ── Status ────────────────────────────────────────────────────────────────

  public getStatus(): SyncStatus { return this.status; }

  public onStatusChange(cb: (s: SyncStatus) => void): () => void {
    this.listeners.push(cb);
    return () => { this.listeners = this.listeners.filter(l => l !== cb); };
  }

  private setStatus(s: SyncStatus): void {
    this.status = s;
    this.listeners.forEach(l => l(s));
  }

  // ── Queue helpers ─────────────────────────────────────────────────────────

  /** Enqueue an upsert operation for the next sync. */
  public queueUpsert(col: QueueCollection, id: string, data: Record<string, any>): void {
    if (this.auth.isGuest()) return; // Never queue for guests
    this.queue.enqueue({ id, collection: col, operation: 'upsert', data });
    if (this.network.isOnline()) this.sync();
  }

  /** Enqueue a delete operation for the next sync. */
  public queueDelete(col: QueueCollection, id: string): void {
    if (this.auth.isGuest()) return; // Never queue for guests
    this.queue.enqueue({ id, collection: col, operation: 'delete', data: {} });
    if (this.network.isOnline()) this.sync();
  }

  public pendingCount(): number { return this.queue.size(); }

  // ── Main sync loop ────────────────────────────────────────────────────────

  public async sync(): Promise<void> {
    // 1. Guest protection: Guests NEVER sync to Firestore
    if (this.auth.isGuest() || !this.auth.isLoggedIn()) return;

    if (this.status === 'syncing') return;
    if (!this.network.isOnline()) {
      this.setStatus('offline');
      return;
    }

    this.setStatus('syncing');

    try {
      // Offline queue flush
      await this.flushQueue();

      // Download missing from cloud
      await this.downloadHistory();
      await this.downloadSaved();
      await this.downloadSettings();

      // Upload local un-synced to cloud (Bulk uploads)
      await this.uploadHistory();
      await this.uploadSavedResults();
      await this.uploadSettings();

      this.setStatus('idle');
    } catch (e) {
      console.error('Sync failed', e);
      this.setStatus('error');
    }
  }

  // ── Upload ────────────────────────────────────────────────────────────────

  private async flushQueue(): Promise<void> {
    const items = this.queue.getAll();
    for (const item of items) {
      let ok = false;
      if (item.operation === 'upsert') {
        ok = await this.firestore.upsert(item.collection, item.id, item.data);
      } else {
        ok = await this.firestore.remove(item.collection, item.id);
      }
      if (ok) {
        this.queue.dequeue(item.id, item.collection);
      } else {
        this.queue.incrementRetry(item.id, item.collection);
      }
    }
  }

  private async uploadHistory(): Promise<void> {
    const local = await this.histRepo.getAllHistory();
    const cloud = await this.firestore.getAll('history');
    const cloudIds = new Set(cloud.map(c => c.id));
    
    const toUpload = local.filter(l => !cloudIds.has(l.id)).map(species => ({
      id: species.id,
      data: {
        speciesId:         species.id,
        speciesData:       species,
        confidence:        species.confidence,
        recognitionTime:   species.recognitionTime,
        recognitionMethod: species.recognitionMethod,
        modelVersion:      species.modelVersion,
        datasetVersion:    species.datasetVersion,
        imageUrl:          species.imageUrl,
        scanDate:          species.date,
        scanTime:          species.time,
      }
    }));
    if (toUpload.length > 0) {
      await this.firestore.batchUpsert('history', toUpload);
    }
  }

  private async uploadSavedResults(): Promise<void> {
    const local = await this.savedRepo.getAll();
    const cloud = await this.firestore.getAll('saved_results');
    const cloudIds = new Set(cloud.map(c => c.id));

    const toUpload = local.filter(l => !cloudIds.has(l.id)).map(species => ({
      id: species.id,
      data: { speciesId: species.id, speciesData: species }
    }));
    if (toUpload.length > 0) {
      await this.firestore.batchUpsert('saved_results', toUpload);
    }
  }

  private async uploadSettings(): Promise<void> {
    const localRaw = await this.settingsRepo.getSettingsRaw();
    const cloud = await this.firestore.getOne('settings', 'singleton');

    let shouldUpload = false;

    if (!cloud) {
      shouldUpload = true;
    } else {
      const localTime = new Date(localRaw.updatedAt ?? 0).getTime();
      const cloudTime = cloud.updatedAt?.toMillis ? cloud.updatedAt.toMillis() : new Date(cloud.updatedAt ?? 0).getTime();
      
      // If local is newer, upload it
      if (localTime > cloudTime) {
        shouldUpload = true;
      }
    }

    if (shouldUpload) {
      const { updatedAt, id, ...dataToSync } = localRaw; // strip SQLite specific metadata
      await this.firestore.upsert('settings', 'singleton', dataToSync);
    }
  }

  // ── Download ──────────────────────────────────────────────────────────────

  private async downloadHistory(): Promise<void> {
    const cloudItems = await this.firestore.getAll('history');
    for (const item of cloudItems) {
      const { id, data } = item;
      const rows = await this.db.query(`SELECT id FROM ScanHistory WHERE id = ?`, [id]);
      if (rows.length === 0 && data.speciesData) {
        // Use HistoryRepository to respect the architecture boundary
        await this.histRepo.saveHistory(data.speciesData as SpeciesInfo);
      }
    }
  }

  private async downloadSaved(): Promise<void> {
    const cloudItems = await this.firestore.getAll('saved_results');
    for (const item of cloudItems) {
      const { id, data } = item;
      const rows = await this.db.query(`SELECT id FROM SavedResults WHERE speciesId = ?`, [id]);
      if (rows.length === 0 && data.speciesData) {
        const species = data.speciesData as SpeciesInfo;
        await this.savedRepo.save(species);
      }
    }
  }

  private async downloadSettings(): Promise<void> {
    const cloud = await this.firestore.getOne('settings', 'singleton');
    if (!cloud) return;

    const localRaw = await this.settingsRepo.getSettingsRaw();
    const localTime = new Date(localRaw.updatedAt ?? 0).getTime();
    const cloudTime = cloud.updatedAt?.toMillis ? cloud.updatedAt.toMillis() : new Date(cloud.updatedAt ?? 0).getTime();

    // Conflict resolution: keep whichever is newer
    if (cloudTime > localTime) {
      await this.settingsRepo.saveSettings({
        theme:                cloud.theme,
        language:             cloud.language,
        notificationsEnabled: cloud.notificationsEnabled,
        userName:             cloud.userName,
        preferredUserType:    cloud.preferredUserType,
        onboardingCompleted:  cloud.onboardingCompleted,
        avatar:               cloud.avatar,
      });
    }
  }
}
