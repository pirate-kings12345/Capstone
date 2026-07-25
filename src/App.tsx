import React from 'react';
import { AppStoreProvider } from './app/store';
import { NavigationProvider, AppNavigator } from './navigation/AppNavigator';

export default function App() {
  return (
    <AppStoreProvider>
      <NavigationProvider>
        <AppNavigator />
      </NavigationProvider>
    </AppStoreProvider>
  );
}
