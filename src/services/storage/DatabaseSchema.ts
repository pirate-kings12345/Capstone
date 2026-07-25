/**
 * DatabaseSchema.ts
 * Defines all SQL table creation statements for the AQUAID SQLite database.
 * Version-controlled — increment DB_VERSION when adding/modifying tables.
 */

export const DB_NAME = 'aquaid.db';
export const DB_VERSION = 2;

export const SQL_CREATE_FISH_SPECIES = `
  CREATE TABLE IF NOT EXISTS FishSpecies (
    id                    TEXT PRIMARY KEY,
    commonName            TEXT NOT NULL,
    localName             TEXT NOT NULL DEFAULT '',
    scientificName        TEXT NOT NULL,
    family                TEXT NOT NULL,
    sustainabilityStatus  TEXT NOT NULL CHECK(sustainabilityStatus IN ('Sustainable','Caution','Protected')),
    sustainabilityDesc    TEXT NOT NULL DEFAULT '',
    imageUrl              TEXT NOT NULL DEFAULT '',
    -- Profile
    bodyShape             TEXT NOT NULL DEFAULT '',
    dominantColor         TEXT NOT NULL DEFAULT '',
    averageLength         TEXT NOT NULL DEFAULT '',
    averageWeight         TEXT NOT NULL DEFAULT '',
    -- Habitat
    waterType             TEXT NOT NULL DEFAULT '',
    habitat               TEXT NOT NULL DEFAULT '',
    distribution          TEXT NOT NULL DEFAULT '',
    temperature           TEXT NOT NULL DEFAULT '',
    waterDepth            TEXT NOT NULL DEFAULT '',
    -- Fisherman Guide
    commercialImportance  TEXT NOT NULL DEFAULT '',
    catchSize             TEXT NOT NULL DEFAULT '',
    catchWeight           TEXT NOT NULL DEFAULT '',
    breedingSeason        TEXT NOT NULL DEFAULT '',
    fishingRestrictions   TEXT NOT NULL DEFAULT '',
    fishingMethod         TEXT NOT NULL DEFAULT '',
    sustainabilityTips    TEXT NOT NULL DEFAULT '',
    -- Aquaculture
    aquacultureSuitable   TEXT NOT NULL DEFAULT '',
    cultureMethod         TEXT NOT NULL DEFAULT '',
    waterTemperature      TEXT NOT NULL DEFAULT '',
    waterPh               TEXT NOT NULL DEFAULT '',
    feedingGuide          TEXT NOT NULL DEFAULT '',
    growthPeriod          TEXT NOT NULL DEFAULT '',
    harvestPeriod         TEXT NOT NULL DEFAULT '',
    harvestSize           TEXT NOT NULL DEFAULT '',
    commonDiseases        TEXT NOT NULL DEFAULT '',
    diseasePrevention     TEXT NOT NULL DEFAULT '',
    -- Market
    averagePrice          TEXT NOT NULL DEFAULT '',
    qualityGrade          TEXT NOT NULL DEFAULT '',
    freshnessIndicators   TEXT NOT NULL DEFAULT '',
    storageMethod         TEXT NOT NULL DEFAULT '',
    shelfLife             TEXT NOT NULL DEFAULT '',
    marketDemand          TEXT NOT NULL DEFAULT '',
    -- Education
    kingdom               TEXT NOT NULL DEFAULT '',
    phylum                TEXT NOT NULL DEFAULT '',
    taxClass              TEXT NOT NULL DEFAULT '',
    taxOrder              TEXT NOT NULL DEFAULT '',
    description           TEXT NOT NULL DEFAULT '',
    diet                  TEXT NOT NULL DEFAULT '',
    lifespan              TEXT NOT NULL DEFAULT '',
    interestingFacts      TEXT NOT NULL DEFAULT '[]',
    similarSpecies        TEXT NOT NULL DEFAULT '[]',
    -- Nutrition
    safeToEat             TEXT NOT NULL DEFAULT '',
    calories              TEXT NOT NULL DEFAULT '',
    protein               TEXT NOT NULL DEFAULT '',
    fat                   TEXT NOT NULL DEFAULT '',
    omega3                TEXT NOT NULL DEFAULT '',
    cookingMethods        TEXT NOT NULL DEFAULT '',
    nutritionStorage      TEXT NOT NULL DEFAULT '',
    nutritionFreshness    TEXT NOT NULL DEFAULT '',
    -- Meta
    createdAt             TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt             TEXT NOT NULL DEFAULT (datetime('now'))
  );
`;

export const SQL_CREATE_SCAN_HISTORY = `
  CREATE TABLE IF NOT EXISTS ScanHistory (
    id                TEXT PRIMARY KEY,
    speciesId         TEXT NOT NULL,
    confidence        REAL NOT NULL DEFAULT 0,
    recognitionTime   REAL NOT NULL DEFAULT 0,
    recognitionMethod TEXT NOT NULL DEFAULT '',
    modelVersion      TEXT NOT NULL DEFAULT '',
    datasetVersion    TEXT NOT NULL DEFAULT '',
    imageUrl          TEXT NOT NULL DEFAULT '',
    scanDate          TEXT NOT NULL,
    scanTime          TEXT NOT NULL,
    createdAt         TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (speciesId) REFERENCES FishSpecies(id) ON DELETE CASCADE
  );
`;

export const SQL_CREATE_SAVED_RESULTS = `
  CREATE TABLE IF NOT EXISTS SavedResults (
    id          TEXT PRIMARY KEY,
    speciesId   TEXT NOT NULL UNIQUE,
    savedAt     TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (speciesId) REFERENCES FishSpecies(id) ON DELETE CASCADE
  );
`;

export const SQL_CREATE_USER_SETTINGS = `
  CREATE TABLE IF NOT EXISTS UserSettings (
    id                    TEXT PRIMARY KEY DEFAULT 'singleton',
    userName              TEXT NOT NULL DEFAULT '',
    theme                 TEXT NOT NULL DEFAULT 'light',
    language              TEXT NOT NULL DEFAULT 'English',
    preferredUserType     TEXT NOT NULL DEFAULT 'Students',
    notificationsEnabled  INTEGER NOT NULL DEFAULT 1,
    onboardingCompleted   INTEGER NOT NULL DEFAULT 0,
    updatedAt             TEXT NOT NULL DEFAULT (datetime('now'))
  );
`;

export const SQL_CREATE_RECOGNITION_LOGS = `
  CREATE TABLE IF NOT EXISTS RecognitionLogs (
    id            TEXT PRIMARY KEY,
    scanId        TEXT NOT NULL,
    eventType     TEXT NOT NULL,
    payload       TEXT NOT NULL DEFAULT '{}',
    createdAt     TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (scanId) REFERENCES ScanHistory(id) ON DELETE CASCADE
  );
`;

export const SQL_INDEXES = [
  `CREATE INDEX IF NOT EXISTS idx_fish_commonName    ON FishSpecies(commonName);`,
  `CREATE INDEX IF NOT EXISTS idx_fish_scientificName ON FishSpecies(scientificName);`,
  `CREATE INDEX IF NOT EXISTS idx_fish_family         ON FishSpecies(family);`,
  `CREATE INDEX IF NOT EXISTS idx_fish_status         ON FishSpecies(sustainabilityStatus);`,
  `CREATE INDEX IF NOT EXISTS idx_history_species     ON ScanHistory(speciesId);`,
  `CREATE INDEX IF NOT EXISTS idx_history_date        ON ScanHistory(scanDate);`,
  `CREATE INDEX IF NOT EXISTS idx_saved_species       ON SavedResults(speciesId);`,
];

export const ALL_TABLES = [
  SQL_CREATE_FISH_SPECIES,
  SQL_CREATE_SCAN_HISTORY,
  SQL_CREATE_SAVED_RESULTS,
  SQL_CREATE_USER_SETTINGS,
  SQL_CREATE_RECOGNITION_LOGS,
  ...SQL_INDEXES,
];

