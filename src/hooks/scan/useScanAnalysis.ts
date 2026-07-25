/**
 * useScanAnalysis.ts
 * Shared recognition pipeline hook.
 * Passes both base64 AND the display image URL to AIService
 * so the captured image is always preserved on the Result Screen.
 */

import { useState, useCallback, useRef } from 'react';
import { AIService, ScanStep, ScanError } from '../../services/ai/AIService';
import { SpeciesInfo } from '../../types';
import { useAppStore } from '../../app/store';
import { useAppNavigation } from '../../navigation/AppNavigator';

export interface ScanAnalysisState {
  isAnalyzing: boolean;
  scanStep: ScanStep;
  stepLabel: string;
  error: string | null;
}

export interface ScanAnalysisActions {
  /** base64Image: raw base64 (with or without data: prefix)
   *  displayImageUrl: the data URL shown in the UI — preserved on Result Screen */
  analyze: (base64Image: string, displayImageUrl?: string) => Promise<void>;
  clearError: () => void;
}

export function useScanAnalysis(): ScanAnalysisState & ScanAnalysisActions {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanStep,    setScanStep]    = useState<ScanStep>('idle');
  const [stepLabel,   setStepLabel]   = useState('');
  const [error,       setError]       = useState<string | null>(null);
  const abortRef = useRef(false);

  const { addScanToHistory } = useAppStore();
  const { navigate, setSelectedSpecies } = useAppNavigation();
  const aiService = AIService.getInstance();

  const analyze = useCallback(async (base64Image: string, displayImageUrl?: string) => {
    if (isAnalyzing) return;
    if (!base64Image) {
      setError('No image captured. Please take a photo first.');
      return;
    }

    abortRef.current = false;
    setIsAnalyzing(true);
    setError(null);

    const step = (s: ScanStep, label: string) => {
      if (abortRef.current) return;
      setScanStep(s);
      setStepLabel(label);
    };

    try {
      // Pass displayImageUrl so the captured photo always appears on the Result Screen
      const species: SpeciesInfo = await aiService.classifyImage(
        base64Image,
        step,
        displayImageUrl,
      );

      if (abortRef.current) return;

      // Debug: verify all data sections are populated before saving
      console.log('[AQUAID] Species mapped:', {
        id: species.id,
        commonName: species.commonName,
        imageUrl: species.imageUrl ? species.imageUrl.substring(0, 40) + '...' : 'MISSING',
        habitat: species.habitat.habitat || 'EMPTY',
        commercial: species.fishermanGuide.commercialImportance || 'EMPTY',
        aquaculture: species.aquaculture.suitable || 'EMPTY',
        market: species.market.averagePrice || 'EMPTY',
        education: species.education.description ? species.education.description.substring(0, 40) + '...' : 'EMPTY',
        nutrition: species.nutrition.calories || 'EMPTY',
        facts: species.education.interestingFacts.length + ' facts',
      });

      step('saving', 'Saving locally...');
      await addScanToHistory(species);

      step('done', 'Done!');
      setSelectedSpecies(species);
      navigate('Detail');

    } catch (err: any) {
      if (abortRef.current) return;
      const scanError = err as ScanError;
      const message = scanError?.message ?? 'Recognition failed. Please try again.';
      setError(message);
      setScanStep('error');
      setStepLabel('Recognition failed.');
      console.error('[useScanAnalysis]', scanError?.code ?? 'UNKNOWN', message);
    } finally {
      if (!abortRef.current) setIsAnalyzing(false);
    }
  }, [isAnalyzing, aiService, addScanToHistory, navigate, setSelectedSpecies]);

  const clearError = useCallback(() => {
    setError(null);
    setScanStep('idle');
    setStepLabel('');
  }, []);

  return { isAnalyzing, scanStep, stepLabel, error, analyze, clearError };
}

