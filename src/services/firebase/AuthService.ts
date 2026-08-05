/**
 * AuthService.ts
 * Core authentication service for AQUAID.
 * Supports Guest Mode, Google Sign-In, and Email/Password.
 * Replaces previous anonymous authentication.
 */

import {
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { getFirebaseAuth, isFirebaseConfigured } from '../../config/firebase';
import { UserRepository } from '../../repositories/UserRepository';

export type AuthType = 'guest' | 'google' | 'email' | null;

export class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;
  private authType: AuthType = null;
  private listeners: ((user: User | null) => void)[] = [];

  private readonly AUTH_TYPE_KEY = 'aquaid_auth_type';

  private constructor() {
    const storedType = localStorage.getItem(this.AUTH_TYPE_KEY);
    if (storedType === 'guest' || storedType === 'google' || storedType === 'email') {
      this.authType = storedType as AuthType;
    }
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) AuthService.instance = new AuthService();
    return AuthService.instance;
  }

  /**
   * Initialize auth state listener.
   * Checks for previous sessions, restores Guest or Firebase session.
   * Returns the initialized authentication state.
   */
  public async initialize(): Promise<{ isLoggedIn: boolean; type: AuthType }> {
    if (this.authType === 'guest') {
      // Restore guest session without Firebase
      this.currentUser = null;
      return { isLoggedIn: true, type: 'guest' };
    }

    if (!isFirebaseConfigured()) {
      return { isLoggedIn: false, type: null };
    }

    const auth = getFirebaseAuth();
    if (!auth) {
      return { isLoggedIn: false, type: null };
    }

    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          // If we had a firebase session
          this.currentUser = user;
          // In case it wasn't saved locally for some reason but Firebase persisted it
          if (!this.authType || this.authType === 'guest') {
            this.setAuthType(user.providerData.some(p => p.providerId === 'google.com') ? 'google' : 'email');
          }
          UserRepository.getInstance().syncProfile(user, this.authType);
          this.notifyListeners(user);
          resolve({ isLoggedIn: true, type: this.authType });
        } else {
          // No user session found
          this.currentUser = null;
          if (this.authType !== 'guest') {
            this.setAuthType(null);
          }
          this.notifyListeners(null);
          resolve({ isLoggedIn: false, type: null });
        }
        unsubscribe(); // We only want the initial state
      });
    });
  }

  /**
   * Continue as a Guest user.
   * Does NOT authenticate with Firebase. Stores session locally.
   */
  public async continueAsGuest(): Promise<void> {
    const auth = getFirebaseAuth();
    if (auth && auth.currentUser) {
      await signOut(auth);
    }
    this.currentUser = null;
    this.setAuthType('guest');
    this.notifyListeners(null);
  }

  /**
   * Login using Google Authentication.
   */
  public async loginWithGoogle(): Promise<void> {
    const auth = getFirebaseAuth();
    if (!auth) throw new Error('Firebase Auth not initialized');

    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    this.currentUser = result.user;
    this.setAuthType('google');
    await UserRepository.getInstance().syncProfile(result.user, 'google');
    this.notifyListeners(result.user);
  }

  /**
   * Register a new user with Email and Password.
   */
  public async registerWithEmail(email: string, password: string): Promise<void> {
    const auth = getFirebaseAuth();
    if (!auth) throw new Error('Firebase Auth not initialized');

    const result = await createUserWithEmailAndPassword(auth, email, password);
    this.currentUser = result.user;
    this.setAuthType('email');
    await UserRepository.getInstance().syncProfile(result.user, 'email');
    this.notifyListeners(result.user);
  }

  /**
   * Login an existing user with Email and Password.
   */
  public async loginWithEmail(email: string, password: string): Promise<void> {
    const auth = getFirebaseAuth();
    if (!auth) throw new Error('Firebase Auth not initialized');

    const result = await signInWithEmailAndPassword(auth, email, password);
    this.currentUser = result.user;
    this.setAuthType('email');
    await UserRepository.getInstance().syncProfile(result.user, 'email');
    this.notifyListeners(result.user);
  }

  /**
   * Logout the current user.
   * If Guest, clears local session.
   * If Google/Email, signs out from Firebase and clears local session.
   */
  public async logout(): Promise<void> {
    const auth = getFirebaseAuth();
    if (auth && this.authType !== 'guest') {
      try {
        await signOut(auth);
      } catch (e) {
        console.error('Error signing out of Firebase', e);
      }
    }
    
    this.currentUser = null;
    this.setAuthType(null);
    this.notifyListeners(null);
  }

  // --- Authentication Helpers ---

  /** Returns the current authentication type. */
  public getUserType(): AuthType {
    return this.authType;
  }

  /** Returns true if the user is a Guest. */
  public isGuest(): boolean {
    return this.authType === 'guest';
  }

  /** Returns true if there is an active session (Guest, Google, or Email). */
  public isLoggedIn(): boolean {
    return this.authType !== null;
  }

  /** Returns the full Firebase User object, or null for guests/unauthenticated. */
  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  /** Returns the current Firebase UID, or null for guests/unauthenticated. */
  public getUid(): string | null {
    return this.currentUser?.uid ?? null;
  }

  /** Listen to auth state changes. Returns unsubscribe function. */
  public onUserChanged(callback: (user: User | null) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  // --- Private Utilities ---

  private setAuthType(type: AuthType): void {
    this.authType = type;
    if (type === null) {
      localStorage.removeItem(this.AUTH_TYPE_KEY);
    } else {
      localStorage.setItem(this.AUTH_TYPE_KEY, type);
    }
  }

  private notifyListeners(user: User | null): void {
    this.listeners.forEach(l => l(user));
  }
}
