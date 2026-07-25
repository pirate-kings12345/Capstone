/**
 * HistoryRepository.ts
 * Scan history persistence via SQLite + Firestore sync queue.
 */

import { SpeciesInfo } from '../types';
import { SQLiteService } from '../services/storage/SQLiteService';
import { rowToSpecies, speciesToParams, INSERT_SPECIES_SQL } from '../services/storage/DatabaseMapper';

export class HistoryRepository {
  private static instance: HistoryRepository;
  private db = SQLiteService.getInstance();

  private constructor() {}

  public static getInstance(): HistoryRepository {
    if (!HistoryRepository.instance) HistoryRepository.instance = new HistoryRepository();
    return HistoryRepository.instance;
  }

  /** Fetch all history entries joined with species data, newest first. */
  public async getAllHistory(): Promise<SpeciesInfo[]> {
    const rows = await this.db.query(
      `SELECT sh.id         AS id,
              sh.scanDate   AS scanDate,
              sh.scanTime   AS scanTime,
              sh.confidence AS confidence,
              sh.recognitionTime AS recognitionTime,
              sh.imageUrl   AS imageUrl,
              sh.recognitionMethod AS recognitionMethod,
              sh.modelVersion      AS modelVersion,
              sh.datasetVersion    AS datasetVersion,
              fs.*
       FROM ScanHistory sh
       JOIN FishSpecies fs ON fs.id = sh.speciesId
       ORDER BY sh.createdAt DESC`
    );
    return rows.map(row => ({
      ...rowToSpecies(row),
      id:              row.id,
      date:            row.scanDate   ?? '',
      time:            row.scanTime   ?? '',
      confidence:      Number(row.confidence     ?? 0),
      recognitionTime: Number(row.recognitionTime ?? 0),
      recognitionMethod: row.recognitionMethod ?? '',
      modelVersion:    row.modelVersion    ?? '',
      datasetVersion:  row.datasetVersion  ?? '',
      imageUrl:        row.imageUrl || rowToSpecies(row).imageUrl,
    }));
  }

  /** Save a new scan. Upserts species first to satisfy FK constraint. */
  public async saveHistory(species: SpeciesInfo): Promise<void> {
    await this.db.execute(INSERT_SPECIES_SQL, speciesToParams(species));
    await this.db.execute(
      `INSERT OR REPLACE INTO ScanHistory
         (id, speciesId, confidence, recognitionTime, recognitionMethod,
          modelVersion, datasetVersion, imageUrl, scanDate, scanTime)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        species.id,
        species.id,
        species.confidence,
        species.recognitionTime,
        species.recognitionMethod,
        species.modelVersion,
        species.datasetVersion,
        species.imageUrl,
        species.date,
        species.time,
      ]
    );

    // Queue for cloud sync (lazy import avoids circular dependency)
    try {
      const { SyncService } = await import('../services/sync/SyncService');
      SyncService.getInstance().queueUpsert('history', species.id, {
        speciesId:         species.id,
        speciesData:       species,
        confidence:        species.confidence,
        recognitionTime:   species.recognitionTime,
        recognitionMethod: species.recognitionMethod,
        modelVersion:      species.modelVersion,
        datasetVersion:    species.datasetVersion,
        imageUrl:          species.imageUrl,
        scanDate:          species.date,
        scanTime:          species.time,
      });
    } catch {}
  }

  /** Delete one history entry by scan ID. */
  public async deleteHistory(id: string): Promise<void> {
    await this.db.execute(`DELETE FROM ScanHistory WHERE id = ?`, [id]);
    try {
      const { SyncService } = await import('../services/sync/SyncService');
      SyncService.getInstance().queueDelete('history', id);
    } catch {}
  }

  /** Wipe all history. */
  public async clearHistory(): Promise<void> {
    await this.db.execute(`DELETE FROM ScanHistory`);
  }
}
