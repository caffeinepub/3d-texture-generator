import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { LogIn, Layers } from 'lucide-react';

export default function LoginPage() {
  const { login, clear, loginStatus } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isLoggingIn = loginStatus === 'logging-in';

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: unknown) {
      const err = error as Error;
      if (err?.message === 'User is already authenticated') {
        await clear();
        queryClient.clear();
        setTimeout(() => login(), 300);
      }
    }
  };

  return (
    <div className="h-full flex items-center justify-center bg-background">
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(oklch(0.72 0.18 55) 1px, transparent 1px),
            linear-gradient(90deg, oklch(0.72 0.18 55) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-8 max-w-sm w-full px-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-amber/20 blur-xl" />
            <img
              src="/assets/generated/texturecraft-logo.dim_256x256.png"
              alt="TextureCraft"
              className="relative w-20 h-20 object-contain"
            />
          </div>
          <div className="text-center">
            <h1 className="font-mono font-bold text-2xl tracking-widest">
              TEXTURE<span className="text-amber">CRAFT</span>
            </h1>
            <p className="text-xs font-mono text-muted-foreground mt-1 tracking-wider">
              3D MATERIAL GENERATOR
            </p>
          </div>
        </div>

        {/* Feature list */}
        <div className="w-full space-y-2">
          {[
            'Procedural PBR texture generation',
            'Real-time 3D sphere preview',
            'Export Albedo, Normal, Roughness & Metalness maps',
            'Save & manage texture presets',
          ].map((feature) => (
            <div key={feature} className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <span className="w-1 h-1 rounded-full bg-amber shrink-0" />
              {feature}
            </div>
          ))}
        </div>

        {/* Login card */}
        <div className="w-full p-5 rounded-sm border border-border bg-panel shadow-panel">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-4 h-4 text-amber" />
            <span className="text-sm font-mono font-medium">Access Required</span>
          </div>
          <p className="text-xs text-muted-foreground font-mono mb-4 leading-relaxed">
            Sign in to access the texture generator, save presets, and export PBR maps for your 3D workflow.
          </p>
          <Button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="w-full h-9 font-mono text-sm bg-amber text-panel-dark hover:bg-amber-bright border-0 transition-all"
          >
            {isLoggingIn ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-panel-dark border-t-transparent rounded-full animate-spin" />
                Connecting...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <LogIn className="w-4 h-4" />
                Login to Continue
              </span>
            )}
          </Button>
        </div>

        <p className="text-[10px] font-mono text-muted-foreground/50 text-center">
          Secure authentication · No password required
        </p>
      </div>
    </div>
  );
}
