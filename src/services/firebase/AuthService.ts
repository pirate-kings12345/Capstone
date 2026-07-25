/**
 * AuthService.ts
 * Firebase Authentication — anonymous sign-in by default.
 * Every user gets a Firebase UID for cloud sync even without an account.
 */

import {
  signInAnonymously,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { getFirebaseAuth, isFirebaseConfigured } from '../../config/firebase';

export class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;
  private listeners: ((user: User | null) => void)[] = [];

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) AuthService.instance = new AuthService();
    return AuthService.instance;
  }

  /**
   * Initialize auth state listener. Called once from DatabaseInitializer.
   * Automatically signs in anonymously if no user session exists.
   */
  public async initialize(): Promise<void> {
    if (!isFirebaseConfigured()) return;
    const auth = getFirebaseAuth();
    if (!auth) return;

    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          this.currentUser = user;
          this.notifyListeners(user);
          unsubscribe();
          resolve();
        } else {
          try {
            const result = await signInAnonymously(auth);
            this.currentUser = result.user;
            this.notifyListeners(result.user);
          } catch {
            this.currentUser = null;
          }
          unsubscribe();
          resolve();
        }
      });
    });
  }

  /** Returns the current Firebase UID, or null if offline/unconfigured. */
  public getUid(): string | null {
    return this.currentUser?.uid ?? null;
  }

  /** Returns the full Firebase User object. */
  public getUser(): User | null {
    return this.currentUser;
  }

  /** Returns true if user is authenticated (even anonymously). */
  public isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  /** Listen to auth state changes. Returns unsubscribe function. */
  public onUserChanged(callback: (user: User | null) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notifyListeners(user: User | null): void {
    this.listeners.forEach(l => l(user));
  }
}

