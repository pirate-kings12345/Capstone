import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Capacitor } from '@capacitor/core';
import { initializeDatabase } from './services/storage/DatabaseInitializer';

async function boot(): Promise<void> {
  // 1. Initialize SQLite and create tables
  await initializeDatabase();

  // 2. Configure native Android UI
  if (Capacitor.isNativePlatform()) {
    try {
      await StatusBar.setOverlaysWebView({ overlay: false });
      await StatusBar.setStyle({ style: Style.Dark });
      await StatusBar.setBackgroundColor({ color: '#001830' });
    } catch (_) {}
    try {
      await SplashScreen.hide({ fadeOutDuration: 400 });
    } catch (_) {}
  }

  // 3. Render React
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

boot();
