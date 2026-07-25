/**
 * GeminiProvider.ts
 * Full-schema Gemini AI provider.
 */

import { GoogleGenAI, Type } from '@google/genai';
import { AIProvider, ScanRequest, ScanResult, validateScanResult } from './AIProvider';

const SYSTEM_INSTRUCTION = `You are a senior marine biologist and fish identification expert for AQUAID.
Your task is to identify the species and return a COMPLETE data profile used by fishermen, fish farmers, vendors, students, researchers, and consumers.
CRITICAL: You MUST populate EVERY field in the JSON schema. Do NOT leave any field empty.
If exact data is unavailable, provide the best scientific estimate with "approx." prefix.
sustainabilityStatus must be exactly one of: "Sustainable", "Caution", or "Protected".
confidence must be an integer between 60 and 100.
interestingFacts must be an array of at least 3 factual strings.
similarSpecies must be an array of at least 2 related species names.`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    commonName:                { type: Type.STRING },
    scientificName:            { type: Type.STRING },
    localName:                 { type: Type.STRING },
    family:                    { type: Type.STRING },
    confidence:                { type: Type.INTEGER },
    conservationStatus:        { type: Type.STRING },
    sustainabilityStatus:      { type: Type.STRING },
    sustainabilityDescription: { type: Type.STRING },
    bodyShape:                 { type: Type.STRING },
    dominantColor:             { type: Type.STRING },
    averageLength:             { type: Type.STRING },
    averageWeight:             { type: Type.STRING },
    waterType:                 { type: Type.STRING },
    habitat:                   { type: Type.STRING },
    distribution:              { type: Type.STRING },
    temperature:               { type: Type.STRING },
    waterDepth:                { type: Type.STRING },
    commercialImportance:      { type: Type.STRING },
    catchSize:                 { type: Type.STRING },
    catchWeight:               { type: Type.STRING },
    breedingSeason:            { type: Type.STRING },
    fishingRestrictions:       { type: Type.STRING },
    recommendedFishingMethod:  { type: Type.STRING },
    sustainabilityTips:        { type: Type.STRING },
    aquacultureSuitable:       { type: Type.STRING },
    cultureMethod:             { type: Type.STRING },
    waterTemperature:          { type: Type.STRING },
    waterPh:                   { type: Type.STRING },
    feedingGuide:              { type: Type.STRING },
    growthPeriod:              { type: Type.STRING },
    harvestPeriod:             { type: Type.STRING },
    harvestSize:               { type: Type.STRING },
    commonDiseases:            { type: Type.STRING },
    diseasePrevention:         { type: Type.STRING },
    averagePrice:              { type: Type.STRING },
    qualityGrade:              { type: Type.STRING },
    freshnessIndicators:       { type: Type.STRING },
    storageMethod:             { type: Type.STRING },
    shelfLife:                 { type: Type.STRING },
    marketDemand:              { type: Type.STRING },
    kingdom:                   { type: Type.STRING },
    phylum:                    { type: Type.STRING },
    taxClass:                  { type: Type.STRING },
    taxOrder:                  { type: Type.STRING },
    description:               { type: Type.STRING },
    diet:                      { type: Type.STRING },
    lifespan:                  { type: Type.STRING },
    interestingFacts:          { type: Type.ARRAY, items: { type: Type.STRING } },
    similarSpecies:            { type: Type.ARRAY, items: { type: Type.STRING } },
    safeToEat:                 { type: Type.STRING },
    calories:                  { type: Type.STRING },
    protein:                   { type: Type.STRING },
    fat:                       { type: Type.STRING },
    omega3:                    { type: Type.STRING },
    cookingMethods:            { type: Type.STRING },
    nutritionStorage:          { type: Type.STRING },
    nutritionFreshness:        { type: Type.STRING },
  },
  required: [
    'commonName','scientificName','localName','family','confidence',
    'conservationStatus','sustainabilityStatus','sustainabilityDescription',
    'bodyShape','dominantColor','averageLength','averageWeight',
    'waterType','habitat','distribution','temperature','waterDepth',
    'commercialImportance','catchSize','catchWeight','breedingSeason',
    'fishingRestrictions','recommendedFishingMethod','sustainabilityTips',
    'aquacultureSuitable','cultureMethod','waterTemperature','waterPh',
    'feedingGuide','growthPeriod','harvestPeriod','harvestSize',
    'commonDiseases','diseasePrevention',
    'averagePrice','qualityGrade','freshnessIndicators','storageMethod',
    'shelfLife','marketDemand',
    'kingdom','phylum','taxClass','taxOrder','description','diet','lifespan',
    'interestingFacts','similarSpecies',
    'safeToEat','calories','protein','fat','omega3',
    'cookingMethods','nutritionStorage','nutritionFreshness',
  ],
};

export class GeminiProvider implements AIProvider {
  readonly name = 'gemini' as const;
  private client: GoogleGenAI | null = null;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'YOUR_GEMINI_API_KEY' && apiKey !== 'MY_GEMINI_API_KEY') {
      this.client = new GoogleGenAI({
        apiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
      });
    }
  }

  isConfigured(): boolean { return this.client !== null; }

  async scan(request: ScanRequest): Promise<ScanResult> {
    if (!this.client) {
      throw Object.assign(new Error('GEMINI_API_KEY is not configured.'), { code: 'MISSING_API_KEY' });
    }

    const contents: any[] = [];

    if (request.base64Image) {
      const data = request.base64Image.replace(/^data:image\/\w+;base64,/, '');
      const mimeType = data.startsWith('/9j/') ? 'image/jpeg'
        : data.startsWith('iVBOR') ? 'image/png'
        : data.startsWith('R0lGO') ? 'image/gif'
        : 'image/jpeg';
      contents.push({ inlineData: { data, mimeType } });
      contents.push({ text: 'Identify this fish or marine species and populate EVERY field in the schema with complete, accurate data.' });
    } else if (request.speciesName) {
      contents.push({ text: `Provide a complete data profile for: "${request.speciesName}". Populate EVERY schema field.` });
    } else {
      throw Object.assign(new Error('No image or species name provided.'), { code: 'INVALID_REQUEST' });
    }

    const response = await this.client.models.generateContent({
      model: 'gemini-3.6-flash',
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: RESPONSE_SCHEMA,
      },
    });

  const text = response.text;

  if (!text || !text.trim()) {
    throw Object.assign(
      new Error("Gemini returned an empty response."),
      { code: "EMPTY_RESPONSE" }
    );
  }

  // ================= DEBUG =================
  if (process.env.NODE_ENV !== "production") {
    console.log("\n================ RAW GEMINI JSON ================\n");
    console.log(text);
    console.log("\n===============================================\n");
  }
  // =========================================

  let parsed: unknown;

  try {
    parsed = JSON.parse(text);
  } catch {
    throw Object.assign(
      new Error(`Gemini returned invalid JSON: ${text.slice(0, 200)}`),
      { code: "INVALID_JSON" }
    );
  }

  // ================= DEBUG =================
  if (process.env.NODE_ENV !== "production") {
    console.log("\n================ PARSED OBJECT ================\n");
    console.dir(parsed, { depth: null });
    console.log("\n==============================================\n");

    console.log("Fields returned:");
    console.log(Object.keys(parsed as object));
  }
  // =========================================

  return validateScanResult(parsed);
  }
}
