/**
 * SettingsRepository.ts
 * User preferences persistence via SQLite (single-row singleton pattern).
 */

import { AppSettings } from '../types';
import { SQLiteService } from '../services/storage/SQLiteService';

export interface StoredSettings {
  userName: string;
  theme: string;
  language: string;
  preferredUserType: string;
  notificationsEnabled: boolean;
  onboardingCompleted: boolean;
}

const DEFAULT: StoredSettings = {
  userName: '',
  theme: 'light',
  language: 'English',
  preferredUserType: 'Students',
  notificationsEnabled: true,
  onboardingCompleted: false,
};

export class SettingsRepository {
  private static instance: SettingsRepository;
  private db = SQLiteService.getInstance();

  private constructor() {}

  public static getInstance(): SettingsRepository {
    if (!SettingsRepository.instance) {
      SettingsRepository.instance = new SettingsRepository();
    }
    return SettingsRepository.instance;
  }

  /** Load settings row, inserting defaults if not yet present. */
  public async getSettings(): Promise<StoredSettings> {
    const rows = await this.db.query(
      `SELECT * FROM UserSettings WHERE id = 'singleton'`
    );
    if (rows.length === 0) {
      await this.saveSettings(DEFAULT);
      return { ...DEFAULT };
    }
    const r = rows[0];
    return {
      userName:             r.userName             ?? '',
      theme:                r.theme                ?? 'light',
      language:             r.language             ?? 'English',
      preferredUserType:    r.preferredUserType    ?? 'Students',
      notificationsEnabled: Boolean(r.notificationsEnabled ?? 1),
      onboardingCompleted:  Boolean(r.onboardingCompleted  ?? 0),
    };
  }

  /** Upsert the singleton settings row. */
  public async saveSettings(s: Partial<StoredSettings>): Promise<void> {
    const current = await this.getSettingsRaw();
    const merged = { ...DEFAULT, ...current, ...s };
    await this.db.execute(
      `INSERT OR REPLACE INTO UserSettings
         (id, userName, theme, language, preferredUserType, notificationsEnabled, onboardingCompleted, updatedAt)
       VALUES ('singleton', ?, ?, ?, ?, ?, ?, datetime('now'))`,
      [
        merged.userName,
        merged.theme,
        merged.language,
        merged.preferredUserType,
        merged.notificationsEnabled ? 1 : 0,
        merged.onboardingCompleted  ? 1 : 0,
      ]
    );
  }

  private async getSettingsRaw(): Promise<Partial<StoredSettings>> {
    const rows = await this.db.query(`SELECT * FROM UserSettings WHERE id = 'singleton'`);
    return rows.length > 0 ? rows[0] : {};
  }
}

