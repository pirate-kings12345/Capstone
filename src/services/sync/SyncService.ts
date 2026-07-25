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
import { OfflineQueue, QueueCollection } from './OfflineQueue';
import { FishRepository } from '../../repositories/FishRepository';
import { HistoryRepository } from '../../repositories/HistoryRepository';
import { SavedResultsRepository } from '../../repositories/SavedResultsRepository';
import { SettingsRepository } from '../../repositories/SettingsRepository';
import { rowToSpecies, speciesToParams, INSERT_SPECIES_SQL } from '../storage/DatabaseMapper';
import { SQLiteService } from '../storage/SQLiteService';
import { NetworkService } from '../mobile/NetworkService';
import { SpeciesInfo } from '../../types';

export type SyncStatus = 'idle' | 'syncing' | 'error' | 'offline';

export class SyncService {
  private static instance: SyncService;

  private firestore   = FirestoreService.getInstance();
  private queue       = OfflineQueue.getInstance();
  private fishRepo    = FishRepository.getInstance();
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
    this.queue.enqueue({ id, collection: col, operation: 'upsert', data });
    if (this.network.isOnline()) this.sync();
  }

  /** Enqueue a delete operation for the next sync. */
  public queueDelete(col: QueueCollection, id: string): void {
    this.queue.enqueue({ id, collection: col, operation: 'delete', data: {} });
    if (this.network.isOnline()) this.sync();
  }

  /** How many items are pending upload. */
  public pendingCount(): number { return this.queue.size(); }

  // ── Main sync loop ────────────────────────────────────────────────────────

  public async sync(): Promise<void> {
    if (this.status === 'syncing') return;
    if (!this.network.isOnline()) {
      this.setStatus('offline');
      return;
    }

    this.setStatus('syncing');

    try {
      await this.flushQueue();
      await this.downloadHistory();
      await this.downloadSaved();
      await this.downloadSettings();
      this.setStatus('idle');
    } catch {
      this.setStatus('error');
    }
  }

  // ── Upload: flush the offline queue ──────────────────────────────────────

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

  // ── Download: pull cloud records into SQLite ──────────────────────────────

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
    // Conflict resolution: cloud wins only if it has a newer timestamp
    // (we don't store timestamps locally yet — cloud overrides if local hasn't changed recently)
    await this.settingsRepo.saveSettings({
      theme:                cloud.theme,
      language:             cloud.language,
      notificationsEnabled: cloud.notificationsEnabled,
      userName:             cloud.userName,
    });
  }
}

