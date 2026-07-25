/**
 * FirestoreService.ts
 * Low-level Firestore operations. Never called directly from UI.
 * All access goes through repositories -> SyncService -> FirestoreService.
 *
 * Firestore structure:
 *   users/{uid}/
 *     species/{speciesId}      — cached species profiles
 *     history/{scanId}         — scan history records
 *     saved_results/{speciesId} — bookmarked species
 *     settings/singleton       — user preferences
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { getFirebaseDb, isFirebaseConfigured } from '../../config/firebase';
import { AuthService } from './AuthService';

export type FirestoreCollection = 'species' | 'history' | 'saved_results' | 'settings';

export class FirestoreService {
  private static instance: FirestoreService;
  private auth = AuthService.getInstance();

  private constructor() {}

  public static getInstance(): FirestoreService {
    if (!FirestoreService.instance) FirestoreService.instance = new FirestoreService();
    return FirestoreService.instance;
  }

  private isReady(): boolean {
    return isFirebaseConfigured() && this.auth.isAuthenticated() && !!getFirebaseDb();
  }

  /** Returns a Firestore collection ref scoped to the current user. */
  private col(name: FirestoreCollection) {
    const db = getFirebaseDb()!;
    const uid = this.auth.getUid()!;
    return collection(db, 'users', uid, name);
  }

  /** Returns a document ref scoped to the current user. */
  private docRef(colName: FirestoreCollection, docId: string) {
    const db = getFirebaseDb()!;
    const uid = this.auth.getUid()!;
    return doc(db, 'users', uid, colName, docId);
  }

  /** Upload a single document. */
  public async upsert(colName: FirestoreCollection, id: string, data: Record<string, any>): Promise<boolean> {
    if (!this.isReady()) return false;
    try {
      await setDoc(this.docRef(colName, id), { ...data, updatedAt: serverTimestamp() }, { merge: true });
      return true;
    } catch { return false; }
  }

  /** Upload multiple documents in a single batch (max 500). */
  public async batchUpsert(colName: FirestoreCollection, records: { id: string; data: Record<string, any> }[]): Promise<boolean> {
    if (!this.isReady() || records.length === 0) return false;
    try {
      const db = getFirebaseDb()!;
      const batch = writeBatch(db);
      for (const r of records.slice(0, 500)) {
        const ref = this.docRef(colName, r.id);
        batch.set(ref, { ...r.data, updatedAt: serverTimestamp() }, { merge: true });
      }
      await batch.commit();
      return true;
    } catch { return false; }
  }

  /** Fetch all documents in a user collection. */
  public async getAll(colName: FirestoreCollection): Promise<{ id: string; data: Record<string, any> }[]> {
    if (!this.isReady()) return [];
    try {
      const snap = await getDocs(this.col(colName));
      return snap.docs.map(d => ({ id: d.id, data: d.data() }));
    } catch { return []; }
  }

  /** Fetch a single document. */
  public async getOne(colName: FirestoreCollection, id: string): Promise<Record<string, any> | null> {
    if (!this.isReady()) return null;
    try {
      const snap = await getDoc(this.docRef(colName, id));
      return snap.exists() ? snap.data() : null;
    } catch { return null; }
  }

  /** Delete a document. */
  public async remove(colName: FirestoreCollection, id: string): Promise<boolean> {
    if (!this.isReady()) return false;
    try {
      await deleteDoc(this.docRef(colName, id));
      return true;
    } catch { return false; }
  }
}

