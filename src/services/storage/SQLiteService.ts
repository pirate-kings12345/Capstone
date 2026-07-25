/**
 * SQLiteService.ts
 * Core database driver. Uses @capacitor-community/sqlite on Android.
 * Falls back to a localStorage-backed adapter on web for development.
 */

import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { DB_NAME, DB_VERSION, ALL_TABLES } from './DatabaseSchema';

// ─── Web fallback store ───────────────────────────────────────────────────────
// On browser, we simulate row storage using localStorage keyed by table name.
// This lets the full repository layer work in dev without a real SQLite engine.

const WEB_STORE_KEY = 'aquaid_sqlite_web';

function webLoad(): Record<string, any[]> {
  try {
    const raw = localStorage.getItem(WEB_STORE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function webSave(store: Record<string, any[]>): void {
  try { localStorage.setItem(WEB_STORE_KEY, JSON.stringify(store)); } catch {}
}

// Minimal SQL parser for the web fallback (handles SELECT, INSERT, UPDATE, DELETE)
function runWebSQL(
  store: Record<string, any[]>,
  sql: string,
  params: any[]
): { rows: any[]; rowsAffected: number } {
  const s = sql.trim();
  let pi = 0; // param index


  // ── SELECT ────────────────────────────────────────────────────────────────
  const selMatch = s.match(/^SELECT\s+(.+?)\s+FROM\s+(\w+)(?:\s+WHERE\s+(.+?))?(?:\s+ORDER BY\s+(.+?))?(?:\s+LIMIT\s+(\d+))?(?:\s+OFFSET\s+(\d+))?$/is);
  if (selMatch) {
    const table = selMatch[2];
    const rows = store[table] ?? [];
    let result = [...rows];

    if (selMatch[3]) {
      const conditions = selMatch[3].split(/\s+AND\s+/i);
      // Pre-parse conditions with their param values BEFORE filtering
      const parsedConds = conditions.map(cond => {
        const likeMatch = cond.match(/(\w+)\s+LIKE\s+\?/i);
        const eqMatch   = cond.match(/(\w+)\s*=\s*\?/i);
        if (likeMatch) return { type: 'like', col: likeMatch[1], val: (params[pi++] as string).replace(/%/g, '') };
        if (eqMatch)   return { type: 'eq',   col: eqMatch[1],   val: String(params[pi++]) };
        return { type: 'skip', col: '', val: '' };
      });
      result = result.filter(row =>
        parsedConds.every(c => {
          if (c.type === 'like') return String(row[c.col] ?? '').toLowerCase().includes(c.val.toLowerCase());
          if (c.type === 'eq')   return String(row[c.col]) === c.val;
          return true;
        })
      );
    }

    if (selMatch[5]) result = result.slice(Number(selMatch[6] ?? 0), Number(selMatch[6] ?? 0) + Number(selMatch[5]));
    return { rows: result, rowsAffected: 0 };
  }

  // ── INSERT OR REPLACE ─────────────────────────────────────────────────────
  const insMatch = s.match(/^INSERT\s+(?:OR\s+REPLACE\s+)?INTO\s+(\w+)\s*\(([^)]+)\)\s*VALUES\s*\(([^)]+)\)/is);
  if (insMatch) {
    const table = insMatch[1];
    const cols = insMatch[2].split(',').map(c => c.trim());
    const vals = insMatch[3].split(',').map(() => params[pi++]);
    const row: Record<string, any> = {};
    cols.forEach((c, i) => { row[c] = vals[i]; });
    if (!store[table]) store[table] = [];
    const idx = store[table].findIndex(r => r.id === row.id || r.id === row.speciesId);
    if (idx >= 0) store[table][idx] = row; else store[table].unshift(row);
    webSave(store);
    return { rows: [], rowsAffected: 1 };
  }

  // ── DELETE ────────────────────────────────────────────────────────────────
  const delMatch = s.match(/^DELETE\s+FROM\s+(\w+)(?:\s+WHERE\s+(\w+)\s*=\s*\?)?/is);
  if (delMatch) {
    const table = delMatch[1];
    if (!store[table]) return { rows: [], rowsAffected: 0 };
    if (delMatch[2]) {
      const col = delMatch[2];
      const val = params[pi++];
      const before = store[table].length;
      store[table] = store[table].filter(r => String(r[col]) !== String(val));
      const affected = before - store[table].length;
      webSave(store);
      return { rows: [], rowsAffected: affected };
    }
    const affected = store[table].length;
    store[table] = [];
    webSave(store);
    return { rows: [], rowsAffected: affected };
  }

  // ── UPDATE ────────────────────────────────────────────────────────────────
  const updMatch = s.match(/^UPDATE\s+(\w+)\s+SET\s+(.+?)\s+WHERE\s+(\w+)\s*=\s*\?/is);
  if (updMatch) {
    const table = updMatch[1];
    if (!store[table]) return { rows: [], rowsAffected: 0 };
    const assignments = updMatch[2].split(',').map(a => {
      const [col] = a.trim().split(/\s*=\s*/);
      return { col: col.trim(), val: params[pi++] };
    });
    const idCol = updMatch[3];
    const idVal = params[pi++];
    let affected = 0;
    store[table] = store[table].map(row => {
      if (String(row[idCol]) === String(idVal)) {
        affected++;
        const updated = { ...row };
        assignments.forEach(a => { updated[a.col] = a.val; });
        return updated;
      }
      return row;
    });
    webSave(store);
    return { rows: [], rowsAffected: affected };
  }

  return { rows: [], rowsAffected: 0 };
}

// ─── SQLiteService ────────────────────────────────────────────────────────────

export class SQLiteService {
  private static instance: SQLiteService;
  private sqlite: SQLiteConnection;
  private db: SQLiteDBConnection | null = null;
  private isNative: boolean;
  private webStore: Record<string, any[]> = {};
  private initialized = false;

  private constructor() {
    this.sqlite = new SQLiteConnection(CapacitorSQLite);
    this.isNative = Capacitor.isNativePlatform();
  }

  public static getInstance(): SQLiteService {
    if (!SQLiteService.instance) {
      SQLiteService.instance = new SQLiteService();
    }
    return SQLiteService.instance;
  }

  public async initialize(): Promise<void> {
    if (this.initialized) return;
    this.initialized = true;

    if (!this.isNative) {
      this.webStore = webLoad();
      return;
    }

    try {
      const isConn = await this.sqlite.isConnection(DB_NAME, false);
      if (isConn.result) {
        this.db = await this.sqlite.retrieveConnection(DB_NAME, false);
      } else {
        this.db = await this.sqlite.createConnection(
          DB_NAME, false, 'no-encryption', DB_VERSION, false
        );
      }
      
      await this.db.execute('PRAGMA foreign_keys = ON;');
      await this.runMigrations();
    } catch {
      this.db = null;
    }
  }

  private async runMigrations(): Promise<void> {
    if (!this.db) return;
    // Create / verify all tables
    for (const sql of ALL_TABLES) {
      await this.db.execute(sql);
    }
    // v1 → v2: add modelVersion column if missing
    try {
      await this.db.execute(`ALTER TABLE FishSpecies ADD COLUMN modelVersion TEXT NOT NULL DEFAULT ''`);
    } catch { /* column already exists — safe to ignore */ }
  }

  public async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    if (!this.isNative) {
      this.webStore = webLoad();
      const { rows } = runWebSQL(this.webStore, sql, params);
      return rows as T[];
    }
    if (!this.db) return [];
    try {
      const result = await this.db.query(sql, params);
      return (result.values ?? []) as T[];
    } catch { return []; }
  }

  public async execute(sql: string, params: any[] = []): Promise<{ rowsAffected: number; insertId?: number }> {
    if (!this.isNative) {
      this.webStore = webLoad();
      const { rowsAffected } = runWebSQL(this.webStore, sql, params);
      webSave(this.webStore);
      return { rowsAffected };
    }
    if (!this.db) return { rowsAffected: 0 };
    try {
      const result = await this.db.run(sql, params);
      return {
        rowsAffected: result.changes?.changes ?? 0,
        insertId: result.changes?.lastId,
      };
    } catch { return { rowsAffected: 0 }; }
  }

  public isReady(): boolean {
    return this.initialized;
  }
}



