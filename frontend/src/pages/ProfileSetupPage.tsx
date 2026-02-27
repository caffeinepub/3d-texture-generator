import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, ArrowRight } from 'lucide-react';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

interface ProfileSetupPageProps {
  onComplete: () => void;
}

export default function ProfileSetupPage({ onComplete }: ProfileSetupPageProps) {
  const [name, setName] = useState('');
  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await saveProfile.mutateAsync({ name: name.trim() });
      toast.success('Profile created!');
      onComplete();
    } catch {
      toast.error('Failed to save profile');
    }
  };

  return (
    <div className="h-full flex items-center justify-center bg-background">
      <Toaster theme="dark" />
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

      <div className="relative z-10 w-full max-w-sm px-6">
        <div className="p-6 rounded-sm border border-border bg-panel shadow-panel">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-sm bg-amber/10 border border-amber/30 flex items-center justify-center">
              <User className="w-4 h-4 text-amber" />
            </div>
            <div>
              <h2 className="font-mono font-bold text-sm">Setup Profile</h2>
              <p className="text-[10px] font-mono text-muted-foreground">One-time setup</p>
            </div>
          </div>

          <p className="text-xs font-mono text-muted-foreground mb-5 leading-relaxed">
            Enter your name to personalize your TextureCraft workspace. This is stored securely on-chain.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="tech-label">Your Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Chen"
                className="bg-background border-border font-mono text-sm h-9 focus:border-amber focus:ring-amber/20"
                autoFocus
              />
            </div>

            <Button
              type="submit"
              disabled={!name.trim() || saveProfile.isPending}
              className="w-full h-9 font-mono text-sm bg-amber text-panel-dark hover:bg-amber-bright border-0"
            >
              {saveProfile.isPending ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-panel-dark border-t-transparent rounded-full animate-spin" />
                  Saving...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Enter TextureCraft
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
