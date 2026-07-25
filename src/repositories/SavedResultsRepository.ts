/**
 * SavedResultsRepository.ts
 * Bookmarked species persistence via SQLite + Firestore sync queue.
 */

import { SpeciesInfo } from '../types';
import { SQLiteService } from '../services/storage/SQLiteService';
import { rowToSpecies, speciesToParams, INSERT_SPECIES_SQL } from '../services/storage/DatabaseMapper';

export class SavedResultsRepository {
  private static instance: SavedResultsRepository;
  private db = SQLiteService.getInstance();

  private constructor() {}

  public static getInstance(): SavedResultsRepository {
    if (!SavedResultsRepository.instance) SavedResultsRepository.instance = new SavedResultsRepository();
    return SavedResultsRepository.instance;
  }

  /** Return all saved species, most recent first. */
  public async getAll(): Promise<SpeciesInfo[]> {
    const rows = await this.db.query(
      `SELECT fs.* FROM SavedResults sr
       JOIN FishSpecies fs ON fs.id = sr.speciesId
       ORDER BY sr.savedAt DESC`
    );
    return rows.map(rowToSpecies);
  }

  /** Save a species as bookmarked. */
  public async save(species: SpeciesInfo): Promise<void> {
    await this.db.execute(INSERT_SPECIES_SQL, speciesToParams(species));
    await this.db.execute(
      `INSERT OR REPLACE INTO SavedResults (id, speciesId) VALUES (?, ?)`,
      [species.id, species.id]
    );
    try {
      const { SyncService } = await import('../services/sync/SyncService');
      SyncService.getInstance().queueUpsert('saved_results', species.id, { speciesId: species.id, speciesData: species });
    } catch {}
  }

  /** Remove a bookmark by species ID. */
  public async remove(speciesId: string): Promise<void> {
    await this.db.execute(`DELETE FROM SavedResults WHERE speciesId = ?`, [speciesId]);
    try {
      const { SyncService } = await import('../services/sync/SyncService');
      SyncService.getInstance().queueDelete('saved_results', speciesId);
    } catch {}
  }

  /** Check if a species is bookmarked. */
  public async isSaved(speciesId: string): Promise<boolean> {
    const rows = await this.db.query(`SELECT id FROM SavedResults WHERE speciesId = ?`, [speciesId]);
    return rows.length > 0;
  }
}
