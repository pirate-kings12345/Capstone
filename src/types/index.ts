export interface Fish {
  id: string;
  commonName: string;
  scientificName: string;
  family: string;
}

export interface FishProfile {
  bodyShape: string;
  dominantColor: string;
  averageLength: string;
  averageWeight: string;
}

export interface HabitatInformation {
  waterType: string;
  habitat: string;
  distribution: string;
  temperature: string;
  waterDepth: string;
}

export interface FishermanGuideSection {
  commercialImportance: string;
  catchSize: string;
  catchWeight: string;
  breedingSeason: string;
  fishingRestrictions: string;
  recommendedFishingMethod: string;
  sustainabilityTips: string;
}

export interface AquacultureInformation {
  suitable: string;
  cultureMethod: string;
  waterTemperature: string;
  waterPh: string;
  feedingGuide: string;
  growthPeriod: string;
  harvestPeriod: string;
  harvestSize: string;
  commonDiseases: string;
  diseasePrevention: string;
}

export interface MarketInformation {
  averagePrice: string;
  qualityGrade: string;
  freshnessIndicators: string;
  storage: string;
  shelfLife: string;
  marketDemand: string;
}

export interface EducationalSection {
  kingdom: string;
  phylum: string;
  class: string;
  order: string;
  description: string;
  diet: string;
  lifespan: string;
  interestingFacts: string[];
  similarSpecies: string[];
}

export interface NutritionInformation {
  safeToEat: string;
  calories: string;
  protein: string;
  fat: string;
  omega3: string;
  cookingMethods: string;
  storage: string;
  freshnessIndicators: string;
}

export interface Species extends Fish {
  localName: string;
  sustainabilityStatus: 'Sustainable' | 'Caution' | 'Protected';
  sustainabilityDescription: string;
  imageUrl: string;
  confidence: number;
  recognitionTime: number;
  recognitionMethod: string;
  modelVersion: string;
  datasetVersion: string;
  date: string;
  time: string;
  profile: FishProfile;
  habitat: HabitatInformation;
  fishermanGuide: FishermanGuideSection;
  aquaculture: AquacultureInformation;
  market: MarketInformation;
  education: EducationalSection;
  nutrition: NutritionInformation;
}

// Backward compatibility alias for Species
export type SpeciesInfo = Species;

export interface RecognitionMetadata {
  confidence: number;
  recognitionTime: number; // in seconds
  recognitionMethod: string;
  modelVersion: string;
  datasetVersion: string;
}

export interface RecognitionResult {
  id: string;
  species: Species;
  metadata: RecognitionMetadata;
  imageUrl: string;
}

export interface HistoryRecord {
  id: string;
  date: string;
  time: string;
  recognitionResult: RecognitionResult;
}

export interface UserProfile {
  userName: string;
  email: string;
  avatarUrl: string;
}

export interface ScanStats {
  totalScans: number;
  sustainablePercentage: number;
  rareCount: number;
  level: number;
}

export interface AppSettings {
  theme: 'light' | 'dark';
  language: 'English' | 'Spanish' | 'French' | 'Tagalog';
  arOverlays: boolean;
  gpsCoordinates: boolean;
  notificationsEnabled: boolean;
  cameraPermission: 'prompt' | 'granted' | 'denied';
  avatar: string;
}

export type AppRoute =
  | 'Splash'
  | 'Login'
  | 'CreateAccount'
  | 'Home'
  | 'Camera'
  | 'Upload'
  | 'History'
  | 'Detail'
  | 'Guide'
  | 'SavedResults'
  | 'Settings'
  | 'Profile'
  | 'Analytics'
  | 'About'
  | 'Help'
  | 'CameraPermissionDenied'
  | 'GalleryPermissionDenied';

/**
 * HistoryEntry extends Species with scan session metadata.
 * Used by the history store and Recent Scans screen.
 */
export interface HistoryEntry extends Species {
  date: string;
  time: string;
}


