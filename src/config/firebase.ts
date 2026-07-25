/**
 * firebase.ts
 * Single initialization point for all Firebase services.
 * Reads config from environment variables — never hardcode credentials.
 *
 * Required .env variables:
 *   VITE_FIREBASE_API_KEY
 *   VITE_FIREBASE_AUTH_DOMAIN
 *   VITE_FIREBASE_PROJECT_ID
 *   VITE_FIREBASE_STORAGE_BUCKET
 *   VITE_FIREBASE_MESSAGING_SENDER_ID
 *   VITE_FIREBASE_APP_ID
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY            ?? '',
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        ?? '',
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID         ?? '',
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     ?? '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId:             import.meta.env.VITE_FIREBASE_APP_ID             ?? '',
};

/** Returns true only when all required env vars are present. */
export function isFirebaseConfigured(): boolean {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
  );
}

let app:     FirebaseApp      | null = null;
let auth:    Auth             | null = null;
let db:      Firestore        | null = null;
let storage: FirebaseStorage  | null = null;

/**
 * Initialize Firebase once. Safe to call multiple times.
 * Returns false if env vars are missing (offline-only mode).
 */
export function initializeFirebase(): boolean {
  if (!isFirebaseConfigured()) return false;
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  auth    = getAuth(app);
  db      = getFirestore(app);
  storage = getStorage(app);
  return true;
}

export function getFirebaseAuth():    Auth            | null { return auth;    }
export function getFirebaseDb():      Firestore       | null { return db;      }
export function getFirebaseStorage(): FirebaseStorage | null { return storage; }
export function getFirebaseApp():     FirebaseApp     | null { return app;     }
