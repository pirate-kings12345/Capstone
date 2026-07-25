/**
 * AIService.ts
 * Frontend AI recognition pipeline.
 * classifyImage(base64, onStep?, capturedImageUrl?) → SpeciesInfo
 * capturedImageUrl is preserved as imageUrl so the Result Screen always shows the photo.
 */

import { SpeciesInfo } from '../../types';
import { NetworkService } from '../mobile/NetworkService';

export type ScanStep = 'idle' | 'uploading' | 'analyzing' | 'receiving' | 'saving' | 'done' | 'error';

export interface ScanError {
  code: 'NO_INTERNET' | 'SERVER_OFFLINE' | 'TIMEOUT' | 'INVALID_RESPONSE' | 'EMPTY_RESPONSE' | 'UNKNOWN';
  message: string;
}

// ─── Backward-compat exports ──────────────────────────────────────────────────
export interface GeminiScanResponse {
  commonName: string; scientificName: string; family: string;
  habitat: string; diet: string; dietDetail: string;
  distribution: string; distributionDetail: string;
  conservationStatus: string; confidence: number;
  sustainabilityStatus: 'Sustainable' | 'Caution' | 'Protected';
  sustainabilityDescription: string; imageUrl?: string;
}
export function mapResponseToSpecies(g: GeminiScanResponse, scanId: string, imageUrl?: string): SpeciesInfo {
  return _mapRaw(g as any, scanId, imageUrl ?? '');
}

const SCAN_TIMEOUT_MS = 60_000;
const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_ENDPOINT = `${API_BASE_URL}/api/scan`;



// ─── Helpers ──────────────────────────────────────────────────────────────────
function s(r: Record<string, any>, k: string, fb = '')   { return typeof r[k] === 'string' ? r[k].trim() || fb : fb; }
function n(r: Record<string, any>, k: string, fb = 0)    { return typeof r[k] === 'number' ? r[k] : fb; }
function a(r: Record<string, any>, k: string): string[]  { return Array.isArray(r[k]) ? r[k].filter((x: any) => typeof x === 'string').map((x: string) => x.trim()).filter(Boolean) : []; }

function _mapRaw(r: Record<string, any>, scanId: string, capturedImageUrl: string): SpeciesInfo {
  const now  = new Date();
  const date = now.toLocaleDateString([], { year: 'numeric', month: '2-digit', day: '2-digit' });
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const commonName = s(r, 'commonName', 'Unknown Species');
  const status = r.sustainabilityStatus === 'Sustainable' || r.sustainabilityStatus === 'Caution' || r.sustainabilityStatus === 'Protected'
    ? r.sustainabilityStatus as 'Sustainable' | 'Caution' | 'Protected'
    : 'Caution' as const;

  return {
    id: scanId, commonName,
    localName:        s(r,'localName',        commonName),
    scientificName:   s(r,'scientificName',   'Unknown'),
    family:           s(r,'family',           'Unknown'),
    imageUrl:         capturedImageUrl || s(r,'imageUrl',''),
    sustainabilityStatus:      status,
    sustainabilityDescription: s(r,'sustainabilityDescription',''),
    confidence:       Math.min(100, Math.max(0, n(r,'confidence',75))),
    recognitionTime:  0,
    recognitionMethod: 'Gemini Vision AI',
    modelVersion:     'gemini-2.5-flash',
    datasetVersion:   'Gemini-2026',
    date, time,
    profile: {
      bodyShape:     s(r,'bodyShape',''),
      dominantColor: s(r,'dominantColor',''),
      averageLength: s(r,'averageLength',''),
      averageWeight: s(r,'averageWeight',''),
    },
    habitat: {
      waterType:    s(r,'waterType','Marine'),
      habitat:      s(r,'habitat',''),
      distribution: s(r,'distribution',''),
      temperature:  s(r,'temperature',''),
      waterDepth:   s(r,'waterDepth',''),
    },
    fishermanGuide: {
      commercialImportance:     s(r,'commercialImportance',''),
      catchSize:                s(r,'catchSize',''),
      catchWeight:              s(r,'catchWeight',''),
      breedingSeason:           s(r,'breedingSeason',''),
      fishingRestrictions:      s(r,'fishingRestrictions',''),
      recommendedFishingMethod: s(r,'recommendedFishingMethod',''),
      sustainabilityTips:       s(r,'sustainabilityTips',''),
    },
    aquaculture: {
      suitable:          s(r,'aquacultureSuitable',''),
      cultureMethod:     s(r,'cultureMethod',''),
      waterTemperature:  s(r,'waterTemperature',''),
      waterPh:           s(r,'waterPh',''),
      feedingGuide:      s(r,'feedingGuide',''),
      growthPeriod:      s(r,'growthPeriod',''),
      harvestPeriod:     s(r,'harvestPeriod',''),
      harvestSize:       s(r,'harvestSize',''),
      commonDiseases:    s(r,'commonDiseases',''),
      diseasePrevention: s(r,'diseasePrevention',''),
    },
    market: {
      averagePrice:        s(r,'averagePrice',''),
      qualityGrade:        s(r,'qualityGrade',''),
      freshnessIndicators: s(r,'freshnessIndicators',''),
      storage:             s(r,'storageMethod',''),
      shelfLife:           s(r,'shelfLife',''),
      marketDemand:        s(r,'marketDemand',''),
    },
    education: {
      kingdom:          s(r,'kingdom','Animalia'),
      phylum:           s(r,'phylum','Chordata'),
      class:            s(r,'taxClass',''),
      order:            s(r,'taxOrder',''),
      description:      s(r,'description',''),
      diet:             s(r,'diet',''),
      lifespan:         s(r,'lifespan',''),
      interestingFacts: a(r,'interestingFacts'),
      similarSpecies:   a(r,'similarSpecies'),
    },
    nutrition: {
      safeToEat:           s(r,'safeToEat',''),
      calories:            s(r,'calories',''),
      protein:             s(r,'protein',''),
      fat:                 s(r,'fat',''),
      omega3:              s(r,'omega3',''),
      cookingMethods:      s(r,'cookingMethods',''),
      storage:             s(r,'nutritionStorage',''),
      freshnessIndicators: s(r,'nutritionFreshness',''),
    },
  };
}

// ─── AIService ────────────────────────────────────────────────────────────────
export class AIService {
  private static instance: AIService;
  private network = NetworkService.getInstance();
  private constructor() {}
  public static getInstance(): AIService {
    if (!AIService.instance) AIService.instance = new AIService();
    return AIService.instance;
  }
  public async initializeLocalModel(): Promise<void> {}

  public async classifyImage(
    base64Image:       string,
    onStep?:           (step: ScanStep, label: string) => void,
    capturedImageUrl?: string,
  ): Promise<SpeciesInfo> {
    const report = (step: ScanStep, label: string) => onStep?.(step, label);

    if (!this.network.isOnline()) {
      throw { code: 'NO_INTERNET', message: 'No internet connection. Please check your network and try again.' } as ScanError;
    }

    report('uploading', 'Uploading image...');

    const controller = new AbortController();
    const timeout    = setTimeout(() => controller.abort(), SCAN_TIMEOUT_MS);
    const cleanB64   = base64Image.replace(/^data:image\/\w+;base64,/, '');
    const scanId     = String(Date.now());
    const startTime  = Date.now();
    let raw: unknown;

    try {
      report('analyzing', 'AI analyzing species...');

      console.log("CALLING SERVER:", API_ENDPOINT);

      const response = await fetch(API_ENDPOINT, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ base64Image: cleanB64 }),
        signal:  controller.signal,
      });

      clearTimeout(timeout);
      report('receiving', 'Receiving results...');

      if (!response.ok) {
        const errText = await response.text().catch(() => '');
        let errJson: any = null;
        try { errJson = JSON.parse(errText); } catch {}
        throw {
          code: response.status >= 500 ? 'SERVER_OFFLINE' : 'INVALID_RESPONSE',
          message: errJson?.message ?? errJson?.error ?? `Server error ${response.status}`,
        } as ScanError;
      }

      const text = await response.text();
      if (!text || !text.trim()) {
        throw { code: 'EMPTY_RESPONSE', message: 'Server returned an empty response.' } as ScanError;
      }
      try { raw = JSON.parse(text); }
      catch { throw { code: 'INVALID_RESPONSE', message: 'Server returned invalid JSON.' } as ScanError; }

    } catch (err: any) {
      clearTimeout(timeout);
      if (err?.code && typeof err.code === 'string') throw err;
      if (err?.name === 'AbortError') {
        throw { code: 'TIMEOUT', message: 'Recognition timed out. Please try again.' } as ScanError;
      }
      if (err?.message?.toLowerCase().includes('failed to fetch') || err?.message?.toLowerCase().includes('network')) {
        throw { code: 'SERVER_OFFLINE', message: 'Cannot reach the recognition server.' } as ScanError;
      }
      throw { code: 'UNKNOWN', message: err?.message ?? 'An unexpected error occurred.' } as ScanError;
    }

    const r = raw as Record<string, any>;
    const displayImage = capturedImageUrl
      || (base64Image.startsWith('data:') ? base64Image : `data:image/jpeg;base64,${base64Image}`);

    const species = _mapRaw(r, scanId, displayImage);
    species.recognitionTime = parseFloat(((Date.now() - startTime) / 1000).toFixed(2));

    report('saving', 'Saving locally...');
    return species;
  }
}
