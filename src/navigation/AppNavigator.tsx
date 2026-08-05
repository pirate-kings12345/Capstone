import React, { createContext, useContext, useState, useEffect, Suspense, useCallback } from 'react';
import { Loader } from 'lucide-react';
import { AppRoute, SpeciesInfo } from '../types';
import { useAppStore } from '../app/store';
import { useHardwareBack } from '../hooks/mobile/useHardwareBack';

// Lazy loading screens
const Splash = React.lazy(() => import('../features/onboarding/Splash'));
const Login = React.lazy(() => import('../features/onboarding/Login'));
const CreateAccount = React.lazy(() => import('../features/onboarding/CreateAccount'));
const Home = React.lazy(() => import('../features/home/Home'));
const CameraPlaceholder = React.lazy(() => import('../features/camera/CameraPlaceholder'));
const UploadImage = React.lazy(() => import('../features/upload/UploadImage'));
const RecentScans = React.lazy(() => import('../features/history/RecentScans'));
const FishGuide = React.lazy(() => import('../features/guide/FishGuide'));
const SavedResults = React.lazy(() => import('../features/history/SavedResults'));
const SettingsScreen = React.lazy(() => import('../features/settings/Settings'));
const AboutScreen = React.lazy(() => import('../features/about/About'));
const HelpScreen = React.lazy(() => import('../features/help/Help'));
const AnalyticsScreen = React.lazy(() => import('../features/analytics/Analytics'));
const DetailView = React.lazy(() => import('../features/history/DetailView'));
const ProfileScreen = React.lazy(() => import('../features/profile/Profile'));
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
    // We intentionally let Splash handle the initial navigation
  }, []);

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
  <div
    className="min-h-screen flex flex-col items-center justify-center"
    style={{
      background: 'linear-gradient(180deg, #001220 0%, #003873 50%, #005BBB 100%)',
      fontFamily: '"Poppins", sans-serif',
    }}
  >
    <div className="flex flex-col items-center gap-4">
      <Loader className="w-8 h-8 text-[#35D6FF] animate-spin" />
      <span className="text-xs font-semibold tracking-widest uppercase text-[#35D6FF]/70">
        Loading AQUAID...
      </span>
    </div>
  </div>
);

export const AppNavigator: React.FC = () => {
  const { currentRoute, goBack } = useAppNavigation();

  // ──────────────────────────────────────────────
  // Android Hardware Back Button
  // Routes where back should not pop the stack (root-level screens)
  const rootRoutes: AppRoute[] = ['Splash', 'Login', 'CreateAccount', 'Home'];
  const isAtRoot = rootRoutes.includes(currentRoute);

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
      case 'Login':
        return <Login />;
      case 'CreateAccount':
        return <CreateAccount />;
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
      case 'Analytics':
        return <AnalyticsScreen />;
      case 'About':
        return <AboutScreen />;
      case 'Help':
        return <HelpScreen />;
      case 'Profile':
        return <ProfileScreen />;
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
