import React, { createContext, useContext, useState, useEffect, Suspense, useCallback } from 'react';
import { Loader } from 'lucide-react';
import { AppRoute, SpeciesInfo } from '../types';
import { useAppStore } from '../app/store';
import { useHardwareBack } from '../hooks/mobile/useHardwareBack';

// Lazy loading screens
const Splash = React.lazy(() => import('../features/onboarding/Splash'));
const Onboarding1 = React.lazy(() => import('../features/onboarding/Onboarding1'));
const Onboarding2 = React.lazy(() => import('../features/onboarding/Onboarding2'));
const Onboarding3 = React.lazy(() => import('../features/onboarding/Onboarding3'));
const OnboardingFinal = React.lazy(() => import('../features/onboarding/OnboardingFinal'));
const UserName = React.lazy(() => import('../features/onboarding/UserName'));
const Home = React.lazy(() => import('../features/home/Home'));
const CameraPlaceholder = React.lazy(() => import('../features/camera/CameraPlaceholder'));
const UploadImage = React.lazy(() => import('../features/upload/UploadImage'));
const RecentScans = React.lazy(() => import('../features/history/RecentScans'));
const FishGuide = React.lazy(() => import('../features/guide/FishGuide'));
const SavedResults = React.lazy(() => import('../features/history/SavedResults'));
const SettingsScreen = React.lazy(() => import('../features/settings/Settings'));
const AboutScreen = React.lazy(() => import('../features/about/About'));
const HelpScreen = React.lazy(() => import('../features/help/Help'));
const DetailView = React.lazy(() => import('../features/history/DetailView'));
const CameraPermissionDenied = React.lazy(() => import('../features/permissions/CameraPermissionDenied'));
const GalleryPermissionDenied = React.lazy(() => import('../features/permissions/GalleryPermissionDenied'));

interface NavigationContextProps {
  currentRoute: AppRoute;
  navigate: (route: AppRoute) => void;
  goBack: () => void;
  isMenuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  selectedSpecies: SpeciesInfo | null;
  setSelectedSpecies: (species: SpeciesInfo | null) => void;
}

const NavigationContext = createContext<NavigationContextProps | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { onboardingCompleted, userName } = useAppStore();
  const [routeStack, setRouteStack] = useState<AppRoute[]>([]);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [selectedSpecies, setSelectedSpecies] = useState<SpeciesInfo | null>(null);

  // Initialize initial route based on onboarding state
  useEffect(() => {
    if (!onboardingCompleted) {
      setRouteStack(['Splash']);
    } else if (!userName) {
      setRouteStack(['UserName']);
    } else {
      setRouteStack(['Home']);
    }
  }, [onboardingCompleted, userName]);

  const currentRoute = routeStack[routeStack.length - 1] || 'Splash';

  const navigate = (route: AppRoute) => {
    setMenuOpen(false); // Close menu on navigation
    setRouteStack((prev) => [...prev, route]);
  };

  const goBack = () => {
    if (routeStack.length <= 1) return;
    setRouteStack((prev) => prev.slice(0, prev.length - 1));
  };

  return (
    <NavigationContext.Provider
      value={{
        currentRoute,
        navigate,
        goBack,
        isMenuOpen,
        setMenuOpen,
        selectedSpecies,
        setSelectedSpecies
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useAppNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useAppNavigation must be used within a NavigationProvider');
  }
  return context;
};

// Fallback Loader component
const LoadingFallback = () => (
  <div className="min-h-screen bg-gradient-to-b from-[#e0f7fa] to-[#faf9fc] dark:from-slate-900 dark:to-slate-950 flex flex-col items-center justify-center text-slate-800 dark:text-white">
    <div className="flex flex-col items-center gap-4">
      <Loader className="w-10 h-10 text-cyan-500 animate-spin" />
      <span className="text-sm font-semibold tracking-wider uppercase text-cyan-700 dark:text-cyan-400">Loading AQUAID Vision...</span>
    </div>
  </div>
);

export const AppNavigator: React.FC = () => {
  const { currentRoute, goBack } = useAppNavigation();

  // ──────────────────────────────────────────────
  // Android Hardware Back Button
  // Routes where back should navigate home instead of popping stack
  const onboardingRoutes: AppRoute[] = ['Splash', 'Onboarding1', 'Onboarding2', 'Onboarding3', 'OnboardingFinal', 'UserName', 'Home'];
  const isAtRoot = onboardingRoutes.includes(currentRoute);

  const handleHardwareBack = useCallback(() => {
    if (isAtRoot) return; // At root — let the OS handle (minimize app)
    goBack();
  }, [isAtRoot, goBack]);

  useHardwareBack(handleHardwareBack, !isAtRoot);
  // ──────────────────────────────────────────────

  const renderActiveScreen = () => {
    switch (currentRoute) {
      case 'Splash':
        return <Splash />;
      case 'Onboarding1':
        return <Onboarding1 />;
      case 'Onboarding2':
        return <Onboarding2 />;
      case 'Onboarding3':
        return <Onboarding3 />;
      case 'OnboardingFinal':
        return <OnboardingFinal />;
      case 'UserName':
        return <UserName />;
      case 'Home':
        return <Home />;
      case 'Camera':
        return <CameraPlaceholder />;
      case 'Upload':
        return <UploadImage />;
      case 'History':
        return <RecentScans />;
      case 'Guide':
        return <FishGuide />;
      case 'SavedResults':
        return <SavedResults />;
      case 'Settings':
        return <SettingsScreen />;
      case 'About':
        return <AboutScreen />;
      case 'Help':
        return <HelpScreen />;
      case 'Detail':
        // DetailView handles the null selectedSpecies state internally
        return <DetailView />;
      case 'CameraPermissionDenied':
        return <CameraPermissionDenied />;
      case 'GalleryPermissionDenied':
        return <GalleryPermissionDenied />;
      default:
        return <Splash />;
    }
  };

  return (
    <Suspense fallback={<LoadingFallback />}>
      {renderActiveScreen()}
    </Suspense>
  );
};
export default AppNavigator;
