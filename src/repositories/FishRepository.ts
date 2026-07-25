/**
 * FishRepository.ts
 * All fish species data access goes through this repository.
 * Reads and writes exclusively from/to SQLite (via SQLiteService).
 */

import { SpeciesInfo } from '../types';
import { SQLiteService } from '../services/storage/SQLiteService';
import { rowToSpecies, speciesToParams, INSERT_SPECIES_SQL } from '../services/storage/DatabaseMapper';

export class FishRepository {
  private static instance: FishRepository;
  private db = SQLiteService.getInstance();

  private constructor() {}

  public static getInstance(): FishRepository {
    if (!FishRepository.instance) {
      FishRepository.instance = new FishRepository();
    }
    return FishRepository.instance;
  }

  /** Return all species, newest first. */
  public async getAllFish(): Promise<SpeciesInfo[]> {
    const rows = await this.db.query(
      `SELECT * FROM FishSpecies ORDER BY commonName ASC`
    );
    return rows.map(rowToSpecies);
  }

  /** Search by common name, local name, scientific name, or family. */
  public async searchFish(query: string): Promise<SpeciesInfo[]> {
    const q = `%${query}%`;
    const rows = await this.db.query(
      `SELECT * FROM FishSpecies
       WHERE commonName    LIKE ?
          OR localName     LIKE ?
          OR scientificName LIKE ?
          OR family        LIKE ?
       ORDER BY commonName ASC`,
      [q, q, q, q]
    );
    return rows.map(rowToSpecies);
  }

  /** Fetch one species by ID. */
  public async getFishById(id: string): Promise<SpeciesInfo | null> {
    const rows = await this.db.query(
      `SELECT * FROM FishSpecies WHERE id = ?`,
      [id]
    );
    return rows.length > 0 ? rowToSpecies(rows[0]) : null;
  }

  /** Upsert a species record (used during seeding or AI result caching). */
  public async upsertFish(species: SpeciesInfo): Promise<void> {
    await this.db.execute(INSERT_SPECIES_SQL, speciesToParams(species));
  }

  /** Bulk insert for initial seed data. */
  public async seedFish(species: SpeciesInfo[]): Promise<void> {
    for (const s of species) {
      await this.upsertFish(s);
    }
  }

  /** Check if any fish exist (used to skip re-seeding). */
  public async isEmpty(): Promise<boolean> {
    const rows = await this.db.query(`SELECT id FROM FishSpecies LIMIT 1`);
    return rows.length === 0;
  }
}
