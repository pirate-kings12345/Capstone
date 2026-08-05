/**
 * UserRepository.ts
 * Manages user profile synchronization with Firestore.
 */

import { FirestoreService } from '../services/firebase/FirestoreService';
import { User } from 'firebase/auth';
import { AuthType } from '../services/firebase/AuthService';

export class UserRepository {
  private static instance: UserRepository;
  
  private constructor() {}

  public static getInstance(): UserRepository {
    if (!UserRepository.instance) UserRepository.instance = new UserRepository();
    return UserRepository.instance;
  }

  /**
   * Synchronizes the user profile to Firestore.
   * If the user is a guest, it safely ignores the operation.
   * If the profile exists, it updates the timestamp.
   * If the profile is new, it creates a full profile document.
   */
  public async syncProfile(user: User, authType: AuthType): Promise<void> {
    if (authType === 'guest' || authType === null) return;
    
    const db = FirestoreService.getInstance();
    
    try {
      const profile = await db.getOne('profile', 'main');
      
      if (profile) {
        // Just trigger an updatedAt refresh via FirestoreService's upsert
        await db.upsert('profile', 'main', {}); 
      } else {
        // Create full profile for new users
        await db.upsert('profile', 'main', {
          uid: user.uid,
          displayName: user.displayName || user.email?.split('@')[0] || 'Aqua Explorer',
          email: user.email || '',
          photoURL: user.photoURL || '',
          accountType: authType,
          createdAt: new Date().toISOString()
        });
      }
    } catch (e) {
      console.error('Failed to sync user profile:', e);
    }
  }

  /**
   * Updates a user's profile data in Firestore.
   * @param uid The user's unique ID.
   * @param data An object with the fields to update (e.g., displayName, photoURL).
   */
  public async updateProfile(uid: string, data: { displayName?: string; photoURL?: string }): Promise<void> {
    if (!uid) return;

    const db = FirestoreService.getInstance();
    try {
      await db.upsert('profile', 'main', data);
    } catch (e) {
      console.error('Failed to update user profile:', e);
      throw new Error('Could not update profile in database.');
    }
  }
}
