import { SpeciesInfo } from "../types";

/**
 * createDetailedMockSpecies
 * Factory retained for use by the Gemini AI scan pipeline (server.ts response → SpeciesInfo).
 * No hardcoded fish data is instantiated here — all species live in SQLite.
 */
export function createDetailedMockSpecies(
  id: string,
  commonName: string,
  scientificName: string,
  family: string,
  sustainabilityStatus: 'Sustainable' | 'Caution' | 'Protected',
  imageUrl: string,
  customOverrides?: Partial<SpeciesInfo>
): SpeciesInfo {
  const now = new Date();
  return {
    id,
    commonName,
    localName:              commonName,
    scientificName,
    family,
    imageUrl,
    sustainabilityStatus,
    sustainabilityDescription: '',
    confidence:             0,
    recognitionTime:        0,
    recognitionMethod:      'Gemini Vision AI',
    modelVersion:           'v2.0.0',
    datasetVersion:         'DS-Marine-2026',
    date: now.toLocaleDateString([], { year: 'numeric', month: '2-digit', day: '2-digit' }),
    time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    profile:       { bodyShape: '', dominantColor: '', averageLength: '', averageWeight: '' },
    habitat:       { waterType: '', habitat: '', distribution: '', temperature: '', waterDepth: '' },
    fishermanGuide: {
      commercialImportance: '', catchSize: '', catchWeight: '',
      breedingSeason: '', fishingRestrictions: '', recommendedFishingMethod: '', sustainabilityTips: ''
    },
    aquaculture: {
      suitable: '', cultureMethod: '', waterTemperature: '', waterPh: '',
      feedingGuide: '', growthPeriod: '', harvestPeriod: '', harvestSize: '',
      commonDiseases: '', diseasePrevention: ''
    },
    market: {
      averagePrice: '', qualityGrade: '', freshnessIndicators: '',
      storage: '', shelfLife: '', marketDemand: ''
    },
    education: {
      kingdom: '', phylum: '', class: '', order: '', description: '',
      diet: '', lifespan: '', interestingFacts: [], similarSpecies: []
    },
    nutrition: {
      safeToEat: '', calories: '', protein: '', fat: '', omega3: '',
      cookingMethods: '', storage: '', freshnessIndicators: ''
    },
    ...customOverrides,
  };
}

// No hardcoded species — all data comes from SQLite (Phase 3) or Gemini AI API.
export const fishGuideData: SpeciesInfo[] = [];
export const clientSideFallbacks: Record<string, SpeciesInfo> = {};

export const faqs = [
  {
    question: "How do I scan a fish?",
    answer: "Tap 'Scan Aqua Life' on the home screen to open the camera, or tap 'Upload from Gallery' to identify a fish from a saved photo."
  },
  {
    question: "Is the AI scanner accurate?",
    answer: "AQUAID uses advanced AI vision to identify species and provide ecological data. Results are high-confidence but always verify critical decisions with local marine authorities."
  },
  {
    question: "What do the sustainability ratings mean?",
    answer: "Sustainable means populations are stable. Caution means collection may impact reef or stock health. Protected means wild capture or trade is restricted by law."
  },
  {
    question: "Can I use the app offline?",
    answer: "The app stores your scan history and saved species locally on your device using an offline database."
  }
];

export function getMockSpeciesInfo(speciesName?: string, customImage?: string): SpeciesInfo {
  return createDetailedMockSpecies(
    String(Date.now()),
    speciesName || 'Unknown Species',
    '',
    '',
    'Sustainable',
    customImage || '',
    {
      confidence:      95,
      recognitionTime: 1.0,
    }
  );
}
