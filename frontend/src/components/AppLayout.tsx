import { type ReactNode } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, User } from 'lucide-react';
import { useGetCallerUserProfile } from '../hooks/useQueries';

interface AppLayoutProps {
  children: ReactNode;
}

function HeaderAuth() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: profile } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: unknown) {
        const err = error as Error;
        if (err?.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <div className="flex items-center gap-3">
      {isAuthenticated && profile && (
        <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
          <User className="w-3 h-3 text-amber" />
          <span className="text-foreground">{profile.name}</span>
        </div>
      )}
      <Button
        onClick={handleAuth}
        disabled={isLoggingIn}
        size="sm"
        variant="ghost"
        className={`h-7 text-xs font-mono border transition-all ${
          isAuthenticated
            ? 'border-border text-muted-foreground hover:border-destructive/50 hover:text-destructive'
            : 'border-amber/40 text-amber hover:bg-amber/10 hover:border-amber'
        }`}
      >
        {isLoggingIn ? (
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 border border-amber border-t-transparent rounded-full animate-spin" />
            Connecting...
          </span>
        ) : isAuthenticated ? (
          <span className="flex items-center gap-1.5">
            <LogOut className="w-3 h-3" />
            Logout
          </span>
        ) : (
          <span className="flex items-center gap-1.5">
            <LogIn className="w-3 h-3" />
            Login
          </span>
        )}
      </Button>
    </div>
  );
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="h-12 flex items-center justify-between px-4 border-b border-border bg-panel shrink-0">
        <div className="flex items-center gap-3">
          <img
            src="/assets/generated/texturecraft-logo.dim_256x256.png"
            alt="TextureCraft"
            className="w-7 h-7 object-contain"
          />
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-sm text-foreground tracking-tight">
              TEXTURE<span className="text-amber">CRAFT</span>
            </span>
            <span className="hidden sm:block text-[10px] font-mono text-muted-foreground border border-border px-1.5 py-0.5 rounded-sm">
              3D MATERIAL GENERATOR
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Status indicator */}
          <div className="hidden md:flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            ONLINE
          </div>
          <HeaderAuth />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>

      {/* Footer */}
      <footer className="h-8 flex items-center justify-between px-4 border-t border-border bg-panel shrink-0">
        <span className="text-[10px] font-mono text-muted-foreground">
          © {new Date().getFullYear()} TextureCraft · PBR Texture Generator
        </span>
        <span className="text-[10px] font-mono text-muted-foreground">
          Built with{' '}
          <span className="text-amber">♥</span>
          {' '}using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'texturecraft')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber hover:text-amber-bright transition-colors"
          >
            caffeine.ai
          </a>
        </span>
      </footer>
    </div>
  );
}
