/**
 * OfflineQueue.ts
 * Persists pending sync operations to localStorage when device is offline.
 * Operations are replayed when connectivity is restored.
 */

export type QueueOperation = 'upsert' | 'delete';
export type QueueCollection = 'species' | 'history' | 'saved_results' | 'settings';

export interface QueueItem {
  id:         string;
  collection: QueueCollection;
  operation:  QueueOperation;
  data:       Record<string, any>;
  timestamp:  number;
  retries:    number;
}

const QUEUE_KEY = 'aquaid_sync_queue';
const MAX_RETRIES = 5;

export class OfflineQueue {
  private static instance: OfflineQueue;

  private constructor() {}

  public static getInstance(): OfflineQueue {
    if (!OfflineQueue.instance) OfflineQueue.instance = new OfflineQueue();
    return OfflineQueue.instance;
  }

  private load(): QueueItem[] {
    try {
      const raw = localStorage.getItem(QUEUE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }

  private save(items: QueueItem[]): void {
    try { localStorage.setItem(QUEUE_KEY, JSON.stringify(items)); } catch {}
  }

  /** Add or update a pending operation. Deduplicates by id + collection. */
  public enqueue(item: Omit<QueueItem, 'timestamp' | 'retries'>): void {
    const queue = this.load();
    const idx = queue.findIndex(q => q.id === item.id && q.collection === item.collection);
    const entry: QueueItem = { ...item, timestamp: Date.now(), retries: 0 };
    if (idx >= 0) queue[idx] = entry;
    else queue.push(entry);
    this.save(queue);
  }

  /** Remove a successfully synced item. */
  public dequeue(id: string, collection: QueueCollection): void {
    const queue = this.load().filter(q => !(q.id === id && q.collection === collection));
    this.save(queue);
  }

  /** Increment retry count. Removes item if max retries exceeded. */
  public incrementRetry(id: string, collection: QueueCollection): void {
    const queue = this.load().map(q => {
      if (q.id === id && q.collection === collection) {
        return { ...q, retries: q.retries + 1 };
      }
      return q;
    }).filter(q => q.retries <= MAX_RETRIES);
    this.save(queue);
  }

  /** Get all pending items, oldest first. */
  public getAll(): QueueItem[] {
    return this.load().sort((a, b) => a.timestamp - b.timestamp);
  }

  /** Returns total pending item count. */
  public size(): number {
    return this.load().length;
  }

  /** Clear the entire queue (e.g. after full sync). */
  public clear(): void {
    this.save([]);
  }
}
