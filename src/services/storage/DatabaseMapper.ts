/**
 * DatabaseMapper.ts
 * Converts between SQLite row objects and TypeScript SpeciesInfo types.
 * The UI layer only ever sees SpeciesInfo — never raw SQL rows.
 */

import { SpeciesInfo } from '../../types';

// ─── Row → SpeciesInfo ────────────────────────────────────────────────────────

export function rowToSpecies(row: Record<string, any>): SpeciesInfo {
  const parsedFacts   = tryParse<string[]>(row.interestingFacts, []);
  const parsedSimilar = tryParse<string[]>(row.similarSpecies,   []);

  return {
    id:                     row.id,
    commonName:             row.commonName       ?? '',
    localName:              row.localName        ?? '',
    scientificName:         row.scientificName   ?? '',
    family:                 row.family           ?? '',
    sustainabilityStatus:   row.sustainabilityStatus ?? 'Sustainable',
    sustainabilityDescription: row.sustainabilityDesc ?? '',
    imageUrl:               row.imageUrl         ?? '',
    confidence:             Number(row.confidence        ?? 0),
    recognitionTime:        Number(row.recognitionTime   ?? 0),
    recognitionMethod:      row.recognitionMethod ?? '',
    modelVersion:           row.modelVersion     ?? '',
    datasetVersion:         row.datasetVersion   ?? '',
    date:                   row.scanDate         ?? new Date().toLocaleDateString(),
    time:                   row.scanTime         ?? new Date().toLocaleTimeString(),
    profile: {
      bodyShape:      row.bodyShape      ?? '',
      dominantColor:  row.dominantColor  ?? '',
      averageLength:  row.averageLength  ?? '',
      averageWeight:  row.averageWeight  ?? '',
    },
    habitat: {
      waterType:    row.waterType    ?? '',
      habitat:      row.habitat      ?? '',
      distribution: row.distribution ?? '',
      temperature:  row.temperature  ?? '',
      waterDepth:   row.waterDepth   ?? '',
    },
    fishermanGuide: {
      commercialImportance:    row.commercialImportance ?? '',
      catchSize:               row.catchSize            ?? '',
      catchWeight:             row.catchWeight          ?? '',
      breedingSeason:          row.breedingSeason       ?? '',
      fishingRestrictions:     row.fishingRestrictions  ?? '',
      recommendedFishingMethod: row.fishingMethod       ?? '',
      sustainabilityTips:      row.sustainabilityTips   ?? '',
    },
    aquaculture: {
      suitable:          row.aquacultureSuitable ?? '',
      cultureMethod:     row.cultureMethod       ?? '',
      waterTemperature:  row.waterTemperature    ?? '',
      waterPh:           row.waterPh             ?? '',
      feedingGuide:      row.feedingGuide        ?? '',
      growthPeriod:      row.growthPeriod        ?? '',
      harvestPeriod:     row.harvestPeriod       ?? '',
      harvestSize:       row.harvestSize         ?? '',
      commonDiseases:    row.commonDiseases      ?? '',
      diseasePrevention: row.diseasePrevention   ?? '',
    },
    market: {
      averagePrice:        row.averagePrice       ?? '',
      qualityGrade:        row.qualityGrade       ?? '',
      freshnessIndicators: row.freshnessIndicators ?? '',
      storage:             row.storageMethod      ?? '',
      shelfLife:           row.shelfLife          ?? '',
      marketDemand:        row.marketDemand       ?? '',
    },
    education: {
      kingdom:          row.kingdom        ?? '',
      phylum:           row.phylum         ?? '',
      class:            row.taxClass       ?? '',
      order:            row.taxOrder       ?? '',
      description:      row.description    ?? '',
      diet:             row.diet           ?? '',
      lifespan:         row.lifespan       ?? '',
      interestingFacts: parsedFacts,
      similarSpecies:   parsedSimilar,
    },
    nutrition: {
      safeToEat:           row.safeToEat          ?? '',
      calories:            row.calories           ?? '',
      protein:             row.protein            ?? '',
      fat:                 row.fat                ?? '',
      omega3:              row.omega3             ?? '',
      cookingMethods:      row.cookingMethods     ?? '',
      storage:             row.nutritionStorage   ?? '',
      freshnessIndicators: row.nutritionFreshness ?? '',
    },
  };
}

// ─── SpeciesInfo → INSERT params ──────────────────────────────────────────────

export function speciesToParams(s: SpeciesInfo): any[] {
  return [
    s.id,
    s.commonName,
    s.localName,
    s.scientificName,
    s.family,
    s.sustainabilityStatus,
    s.sustainabilityDescription,
    s.imageUrl,
    s.profile.bodyShape,
    s.profile.dominantColor,
    s.profile.averageLength,
    s.profile.averageWeight,
    s.habitat.waterType,
    s.habitat.habitat,
    s.habitat.distribution,
    s.habitat.temperature,
    s.habitat.waterDepth,
    s.fishermanGuide.commercialImportance,
    s.fishermanGuide.catchSize,
    s.fishermanGuide.catchWeight,
    s.fishermanGuide.breedingSeason,
    s.fishermanGuide.fishingRestrictions,
    s.fishermanGuide.recommendedFishingMethod,
    s.fishermanGuide.sustainabilityTips,
    s.aquaculture.suitable,
    s.aquaculture.cultureMethod,
    s.aquaculture.waterTemperature,
    s.aquaculture.waterPh,
    s.aquaculture.feedingGuide,
    s.aquaculture.growthPeriod,
    s.aquaculture.harvestPeriod,
    s.aquaculture.harvestSize,
    s.aquaculture.commonDiseases,
    s.aquaculture.diseasePrevention,
    s.market.averagePrice,
    s.market.qualityGrade,
    s.market.freshnessIndicators,
    s.market.storage,
    s.market.shelfLife,
    s.market.marketDemand,
    s.education.kingdom,
    s.education.phylum,
    s.education.class,
    s.education.order,
    s.education.description,
    s.education.diet,
    s.education.lifespan,
    JSON.stringify(s.education.interestingFacts),
    JSON.stringify(s.education.similarSpecies),
    s.nutrition.safeToEat,
    s.nutrition.calories,
    s.nutrition.protein,
    s.nutrition.fat,
    s.nutrition.omega3,
    s.nutrition.cookingMethods,
    s.nutrition.storage,
    s.nutrition.freshnessIndicators,
    s.recognitionMethod,
    s.modelVersion,
    s.datasetVersion,
  ];
}

export const INSERT_SPECIES_SQL = `
  INSERT OR REPLACE INTO FishSpecies (
    id, commonName, localName, scientificName, family,
    sustainabilityStatus, sustainabilityDesc, imageUrl,
    bodyShape, dominantColor, averageLength, averageWeight,
    waterType, habitat, distribution, temperature, waterDepth,
    commercialImportance, catchSize, catchWeight, breedingSeason,
    fishingRestrictions, fishingMethod, sustainabilityTips,
    aquacultureSuitable, cultureMethod, waterTemperature, waterPh,
    feedingGuide, growthPeriod, harvestPeriod, harvestSize,
    commonDiseases, diseasePrevention,
    averagePrice, qualityGrade, freshnessIndicators, storageMethod,
    shelfLife, marketDemand,
    kingdom, phylum, taxClass, taxOrder, description, diet, lifespan,
    interestingFacts, similarSpecies,
    safeToEat, calories, protein, fat, omega3,
    cookingMethods, nutritionStorage, nutritionFreshness,
    recognitionMethod, modelVersion, datasetVersion
  ) VALUES (
    ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?
  )
`;

function tryParse<T>(val: any, fallback: T): T {
  if (Array.isArray(val)) return val as unknown as T;
  try { return JSON.parse(val ?? ''); } catch { return fallback; }
}

