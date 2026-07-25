/**
 * AIProvider.ts
 * Shared interface that every AI provider must implement.
 * server.ts uses this interface exclusively — never the provider directly.
 */

export interface ScanRequest {
  speciesName?: string;
  base64Image?: string;
}

export interface ScanResult {
  // ===== GENERAL =====
  commonName: string;
  scientificName: string;
  localName: string;
  family: string;
  confidence: number;
  conservationStatus: string;
  sustainabilityStatus: 'Sustainable' | 'Caution' | 'Protected';
  sustainabilityDescription: string;

  habitat: string;
  distribution: string;
  diet: string;

  bodyShape: string;
  dominantColor: string;
  averageLength: string;
  averageWeight: string;
  waterType: string;
  temperature: string;
  waterDepth: string;

  // ===== Fishermen =====
  commercialImportance: string;
  catchSize: string;
  catchWeight: string;
  breedingSeason: string;
  fishingRestrictions: string;
  recommendedFishingMethod: string;
  sustainabilityTips: string;

  // ===== Fish Farmers =====
  aquacultureSuitable: string;
  cultureMethod: string;
  waterTemperature: string;
  waterPh: string;
  feedingGuide: string;
  growthPeriod: string;
  harvestPeriod: string;
  harvestSize: string;
  commonDiseases: string;
  diseasePrevention: string;

  // ===== Vendors =====
  averagePrice: string;
  qualityGrade: string;
  freshnessIndicators: string;
  storageMethod: string;
  shelfLife: string;
  marketDemand: string;

  // ===== Students =====
  kingdom: string;
  phylum: string;
  taxClass: string;
  taxOrder: string;
  description: string;
  lifespan: string;
  interestingFacts: string[];
  similarSpecies: string[];

  // ===== Consumers =====
  safeToEat: string;
  calories: string;
  protein: string;
  fat: string;
  omega3: string;
  cookingMethods: string;
  nutritionStorage: string;
  nutritionFreshness: string;

  // ===== Optional =====
  dietDetail: string;
  distributionDetail: string;
}

export interface AIProvider {
  /** Human-readable name for health reporting */
  name: 'gemini' | 'claude';
  /** True when the provider has a valid API key loaded */
  isConfigured(): boolean;
  /** Run fish identification from image or species name */
  scan(request: ScanRequest): Promise<ScanResult>;
}

// ─── Shared validation helper (used by both providers) ────────────────────────
export function validateScanResult(raw: unknown): ScanResult {
  if (!raw || typeof raw !== 'object') {
    throw new Error('AI returned a non-object response.');
  }
  const r = raw as Record<string, unknown>;

  const str = (k: string, fb = '') =>
    typeof r[k] === 'string' ? (r[k] as string).trim() : fb;
  const num = (k: string, fb = 75) =>
    typeof r[k] === 'number' ? (r[k] as number) : fb;
  const arr = (k: string): string[] =>
  Array.isArray(r[k])
    ? (r[k] as unknown[]).filter((v): v is string => typeof v === "string")
    : [];

  const commonName = str('commonName');
  if (!commonName) throw new Error('AI returned no species name.');

  const rawStatus = str('sustainabilityStatus');
  const sustainabilityStatus: 'Sustainable' | 'Caution' | 'Protected' =
    rawStatus === 'Sustainable' || rawStatus === 'Caution' || rawStatus === 'Protected'
      ? rawStatus : 'Caution';

  return {
    commonName,
    scientificName: str("scientificName"),
    localName: str("localName"),
    family: str("family"),

    confidence: Math.min(100, Math.max(0, num("confidence", 75))),
    conservationStatus: str("conservationStatus"),
    sustainabilityStatus,
    sustainabilityDescription: str("sustainabilityDescription"),

    habitat: str("habitat"),
    distribution: str("distribution"),
    diet: str("diet"),

    bodyShape: str("bodyShape"),
    dominantColor: str("dominantColor"),
    averageLength: str("averageLength"),
    averageWeight: str("averageWeight"),
    waterType: str("waterType"),
    temperature: str("temperature"),
    waterDepth: str("waterDepth"),

    commercialImportance: str("commercialImportance"),
    catchSize: str("catchSize"),
    catchWeight: str("catchWeight"),
    breedingSeason: str("breedingSeason"),
    fishingRestrictions: str("fishingRestrictions"),
    recommendedFishingMethod: str("recommendedFishingMethod"),
    sustainabilityTips: str("sustainabilityTips"),

    aquacultureSuitable: str("aquacultureSuitable"),
    cultureMethod: str("cultureMethod"),
    waterTemperature: str("waterTemperature"),
    waterPh: str("waterPh"),
    feedingGuide: str("feedingGuide"),
    growthPeriod: str("growthPeriod"),
    harvestPeriod: str("harvestPeriod"),
    harvestSize: str("harvestSize"),
    commonDiseases: str("commonDiseases"),
    diseasePrevention: str("diseasePrevention"),

    averagePrice: str("averagePrice"),
    qualityGrade: str("qualityGrade"),
    freshnessIndicators: str("freshnessIndicators"),
    storageMethod: str("storageMethod"),
    shelfLife: str("shelfLife"),
    marketDemand: str("marketDemand"),

    kingdom: str("kingdom"),
    phylum: str("phylum"),
    taxClass: str("taxClass"),
    taxOrder: str("taxOrder"),
    description: str("description"),
    lifespan: str("lifespan"),

    interestingFacts: arr("interestingFacts"),
    similarSpecies: arr("similarSpecies"),

    safeToEat: str("safeToEat"),
    calories: str("calories"),
    protein: str("protein"),
    fat: str("fat"),
    omega3: str("omega3"),
    cookingMethods: str("cookingMethods"),
    nutritionStorage: str("nutritionStorage"),
    nutritionFreshness: str("nutritionFreshness"),

    dietDetail: str("dietDetail"),
    distributionDetail: str("distributionDetail"),
  };
}
