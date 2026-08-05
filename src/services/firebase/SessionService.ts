/**
 * SessionService.ts
 * Dedicated service for managing application sessions independently from Firebase Authentication.
 * Supports determining if a user is a Guest, or signed in via Google/Email.
 */

export type SessionType = 'guest' | 'google' | 'email' | null;

export class SessionService {
  private static instance: SessionService;
  private currentSessionType: SessionType = null;
  private readonly STORAGE_KEY = 'aquaid_session_type';

  private constructor() {
    this.loadSession();
  }

  /**
   * Retrieves the Singleton instance of the SessionService.
   */
  public static getInstance(): SessionService {
    if (!SessionService.instance) {
      SessionService.instance = new SessionService();
    }
    return SessionService.instance;
  }

  /**
   * Saves the session information locally.
   * @param type The type of session to save.
   */
  public saveSession(type: SessionType): void {
    this.currentSessionType = type;
    if (type === null) {
      localStorage.removeItem(this.STORAGE_KEY);
    } else {
      localStorage.setItem(this.STORAGE_KEY, type);
    }
  }

  /**
   * Alias for saveSession, used to remember the authentication type.
   * @param type The type of session to remember.
   */
  public rememberSession(type: SessionType): void {
    this.saveSession(type);
  }

  /**
   * Loads any existing session during application startup.
   * @returns The loaded SessionType, or null if no session exists.
   */
  public loadSession(): SessionType {
    const storedType = localStorage.getItem(this.STORAGE_KEY);
    if (storedType === 'guest' || storedType === 'google' || storedType === 'email') {
      this.currentSessionType = storedType as SessionType;
    } else {
      this.currentSessionType = null;
    }
    return this.currentSessionType;
  }

  /**
   * Alias for loadSession, used to restore the session upon application restart.
   * @returns The restored SessionType.
   */
  public restoreSession(): SessionType {
    return this.loadSession();
  }

  /**
   * Clears the session during logout.
   */
  public clearSession(): void {
    this.currentSessionType = null;
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Retrieves the current authentication session type.
   * @returns The active SessionType.
   */
  public getSessionType(): SessionType {
    return this.currentSessionType;
  }

  /**
   * Checks whether the application has an active session.
   * @returns True if a valid session exists, false otherwise.
   */
  public hasActiveSession(): boolean {
    return this.currentSessionType !== null;
  }
}
