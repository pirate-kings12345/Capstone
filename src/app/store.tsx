import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SpeciesInfo, AppSettings } from '../types';
import { HistoryRepository } from '../repositories/HistoryRepository';
import { SavedResultsRepository } from '../repositories/SavedResultsRepository';
import { SettingsRepository } from '../repositories/SettingsRepository';

interface AppContextProps {
  onboardingCompleted: boolean;
  setOnboardingCompleted: (val: boolean) => void;
  userName: string;
  setUserName: (val: string) => void;
  isGuestMode: boolean;
  setIsGuestMode: (val: boolean) => void;
  settings: AppSettings;
  updateSettings: (val: Partial<AppSettings>) => void;
  history: SpeciesInfo[];
  addScanToHistory: (species: SpeciesInfo) => void;
  deleteScanFromHistory: (id: string) => void;
  clearScanHistory: () => void;
  savedResults: SpeciesInfo[];
  toggleSaveResult: (species: SpeciesInfo) => void;
  isSaved: (species: SpeciesInfo) => boolean;
  isDbReady: boolean;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'light',
  language: 'English',
  arOverlays: true,
  gpsCoordinates: true,
  notificationsEnabled: true,
  cameraPermission: 'prompt',
  avatar: 'marine',
};

const historyRepo  = HistoryRepository.getInstance();
const savedRepo    = SavedResultsRepository.getInstance();
const settingsRepo = SettingsRepository.getInstance();

export const AppStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDbReady, setDbReady]             = useState(false);
  const [onboardingCompleted, setOnboardingState] = useState(false);
  const [userName, setUserNameState]        = useState('');
  const [isGuestMode, setGuestModeState]    = useState(false);
  const [settings, setSettingsState]        = useState<AppSettings>(DEFAULT_SETTINGS);
  const [history,  setHistoryState]         = useState<SpeciesInfo[]>([]);
  const [savedResults, setSavedState]       = useState<SpeciesInfo[]>([]);

  // ── Bootstrap ──────────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const stored = await settingsRepo.getSettings();
        setOnboardingState(stored.onboardingCompleted);
        setUserNameState(stored.userName);
        setSettingsState(prev => ({
          ...prev,
          theme:                stored.theme as AppSettings['theme'],
          language:             stored.language as AppSettings['language'],
          notificationsEnabled: stored.notificationsEnabled,
          avatar:               stored.avatar || prev.avatar,
        }));
        const [hist, saved] = await Promise.all([
          historyRepo.getAllHistory(),
          savedRepo.getAll(),
        ]);
        setHistoryState(hist);
        setSavedState(saved);
      } catch {}
      setDbReady(true);
    })();
  }, []);

  // ── Theme → StatusBar ─────────────────────────────────────────────────────
  useEffect(() => {
    const isDark = settings.theme === 'dark';
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    if (Capacitor.isNativePlatform()) {
      StatusBar.setStyle({ style: isDark ? Style.Dark : Style.Light }).catch(() => {});
      StatusBar.setBackgroundColor({ color: isDark ? '#001220' : '#E8F4FD' }).catch(() => {});
    }
  }, [settings.theme]);

  // ── Actions ───────────────────────────────────────────────────────────────

  const setOnboardingCompleted = useCallback(async (val: boolean) => {
    setOnboardingState(val);
    await settingsRepo.saveSettings({ onboardingCompleted: val });
  }, []);

  const setUserName = useCallback(async (val: string) => {
    setUserNameState(val);
    await settingsRepo.saveSettings({ userName: val });
  }, []);

  const setIsGuestMode = useCallback((val: boolean) => {
    setGuestModeState(val);
    if (val) {
      setHistoryState([]);
      setSavedState([]);
    }
  }, []);

  const updateSettings = useCallback(async (updates: Partial<AppSettings>) => {
    setSettingsState(prev => ({ ...prev, ...updates }));
    await settingsRepo.saveSettings({
      theme:                updates.theme,
      language:             updates.language,
      notificationsEnabled: updates.notificationsEnabled,
      avatar:               updates.avatar,
    });
  }, []);

  const addScanToHistory = useCallback(async (species: SpeciesInfo) => {
    if (isGuestMode) return;

    // Deduplicate by ID — never re-generate the ID or timestamps set by AIService
    if (history.some(h => h.id === species.id)) return;

    // species already has id, date, time, imageUrl and all fields set by AIService
    await historyRepo.saveHistory(species);
    setHistoryState(prev => [species, ...prev]);
  }, [history, isGuestMode]);

  const deleteScanFromHistory = useCallback(async (id: string) => {
    if (isGuestMode) return;
    await historyRepo.deleteHistory(id);
    setHistoryState(prev => prev.filter(h => h.id !== id));
  }, [isGuestMode]);

  const clearScanHistory = useCallback(async () => {
    if (isGuestMode) return;
    await historyRepo.clearHistory();
    setHistoryState([]);
  }, [isGuestMode]);

  const toggleSaveResult = useCallback(async (species: SpeciesInfo) => {
    if (isGuestMode) return;

    const exists = savedResults.some(s => s.scientificName === species.scientificName);
    if (exists) {
      await savedRepo.remove(species.id);
      setSavedState(prev => prev.filter(s => s.scientificName !== species.scientificName));
    } else {
      await savedRepo.save(species);
      setSavedState(prev => [species, ...prev]);
    }
  }, [savedResults, isGuestMode]);

  const isSaved = useCallback((species: SpeciesInfo) => {
    return savedResults.some(s => s.scientificName === species.scientificName);
  }, [savedResults]);

  return (
    <AppContext.Provider value={{
      isDbReady,
      onboardingCompleted,
      setOnboardingCompleted,
      userName,
      setUserName,
      isGuestMode,
      setIsGuestMode,
      settings,
      updateSettings,
      history,
      addScanToHistory,
      deleteScanFromHistory,
      clearScanHistory,
      savedResults,
      toggleSaveResult,
      isSaved,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppStore must be used within AppStoreProvider');
  return ctx;
};

