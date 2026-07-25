import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aquaid.app',
  appName: 'AQUAID',
  webDir: 'dist',

  server: {
    // Required for secure context on Android (camera, permissions, geolocation, etc.)
    androidScheme: 'https',
    cleartext: false,
  },

  android: {
    initialFocus: true,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },

  plugins: {
    SplashScreen: {
      launchShowDuration: 2500,
      launchAutoHide: true,
      launchFadeOutDuration: 500,
      backgroundColor: '#001219',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#001219',
    },
    Camera: {
      presentationStyle: 'fullscreen',
    },
  },
};

export default config;
