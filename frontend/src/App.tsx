import { useInternetIdentity } from './hooks/useInternetIdentity';
import AppLayout from './components/AppLayout';
import LoginPage from './pages/LoginPage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import TextureGenerator from './pages/TextureGenerator';
import { useGetCallerUserProfile } from './hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';

function AppContent() {
  const { identity, isInitializing } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched: profileFetched,
  } = useGetCallerUserProfile();

  // Show loading while initializing auth
  if (isInitializing) {
    return (
      <div className="h-full flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-amber border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono text-muted-foreground">Initializing...</span>
        </div>
      </div>
    );
  }

  // Not authenticated → show login
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Authenticated but profile loading
  if (profileLoading || !profileFetched) {
    return (
      <div className="h-full flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-amber border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono text-muted-foreground">Loading profile...</span>
        </div>
      </div>
    );
  }

  // Authenticated but no profile → setup
  if (isAuthenticated && profileFetched && userProfile === null) {
    return <ProfileSetupPage onComplete={() => {}} />;
  }

  // Fully authenticated with profile → show app
  return <TextureGenerator />;
}

export default function App() {
  return (
    <AppLayout>
      <AppContent />
    </AppLayout>
  );
}
