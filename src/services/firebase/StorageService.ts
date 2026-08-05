/**
 * StorageService.ts
 * Firebase Storage — handles image upload/download for scan captures.
 * SQLite stores the returned download URL, not the raw image data.
 */

import {
  ref,
  uploadString,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { getFirebaseStorage, isFirebaseConfigured } from '../../config/firebase';
import { AuthService } from './AuthService';

export class StorageService {
  private static instance: StorageService;
  private auth = AuthService.getInstance();

  private constructor() {}

  public static getInstance(): StorageService {
    if (!StorageService.instance) StorageService.instance = new StorageService();
    return StorageService.instance;
  }

  private isReady(): boolean {
    return isFirebaseConfigured() && this.auth.isAuthenticated() && !!getFirebaseStorage();
  }

  /**
   * Upload a base64 image string to Firebase Storage.
   * Returns the public download URL, or null on failure.
   *
   * @param base64    Base64 data string (with or without data: prefix)
   * @param scanId    Unique scan ID — used as filename
   */
  public async uploadScanImage(base64: string, scanId: string): Promise<string | null> {
    if (!this.isReady()) return null;
    try {
      const uid = this.auth.getUid()!;
      const storage = getFirebaseStorage()!;
      const clean = base64.replace(/^data:image\/\w+;base64,/, '');
      const storageRef = ref(storage, `users/${uid}/scans/${scanId}.jpg`);
      await uploadString(storageRef, clean, 'base64', { contentType: 'image/jpeg' });
      const url = await getDownloadURL(storageRef);
      return url;
    } catch { return null; }
  }

  /**
   * Upload a base64 image string as a user's profile photo.
   * Overwrites any existing photo.
   * Returns the public download URL, or null on failure.
   *
   * @param base64    Base64 data string (with or without data: prefix)
   */
  public async uploadProfilePhoto(base64: string): Promise<string | null> {
    if (!this.isReady()) return null;
    try {
      const uid = this.auth.getUid()!;
      const storage = getFirebaseStorage()!;
      const clean = base64.replace(/^data:image\/\w+;base64,/, '');
      const storageRef = ref(storage, `users/${uid}/profile/photo.jpg`);
      await uploadString(storageRef, clean, 'base64', { contentType: 'image/jpeg' });
      const url = await getDownloadURL(storageRef);
      return url;
    } catch { return null; }
  }

  /**
   * Delete a stored scan image.
   * @param scanId   Unique scan ID
   */
  public async deleteScanImage(scanId: string): Promise<void> {
    if (!this.isReady()) return;
    try {
      const uid = this.auth.getUid()!;
      const storage = getFirebaseStorage()!;
      const storageRef = ref(storage, `users/${uid}/scans/${scanId}.jpg`);
      await deleteObject(storageRef);
    } catch {}
  }
}
