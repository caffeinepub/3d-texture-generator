import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save } from 'lucide-react';
import { useSavePreset } from '../hooks/useQueries';
import { type TextureParameters } from '../hooks/useTextureParameters';
import { toast } from 'sonner';

interface SavePresetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  params: TextureParameters;
}

export default function SavePresetDialog({ open, onOpenChange, params }: SavePresetDialogProps) {
  const [name, setName] = useState('');
  const savePreset = useSavePreset();

  const handleSave = async () => {
    if (!name.trim()) return;

    try {
      await savePreset.mutateAsync({
        name: name.trim(),
        materialType: params.materialType,
        parameters: {
          roughness: params.roughness,
          metalness: params.metalness,
          colorPalette: params.colorPalette,
          patternStyle: params.patternStyle,
          tilingScale: params.tilingScale,
        },
      });
      toast.success(`Preset "${name.trim()}" saved`);
      setName('');
      onOpenChange(false);
    } catch {
      toast.error('Failed to save preset');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-panel border-border max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-mono text-sm text-foreground flex items-center gap-2">
            <Save className="w-4 h-4 text-amber" />
            Save Preset
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground font-mono">
            Save current texture configuration as a reusable preset.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <div className="space-y-1.5">
            <Label className="tech-label">Preset Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Brushed Steel v2"
              className="bg-background border-border font-mono text-sm h-8 focus:border-amber focus:ring-amber/20"
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              autoFocus
            />
          </div>

          <div className="p-2 rounded-sm border border-border bg-background/50 space-y-1">
            <p className="tech-label">Configuration</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[10px] font-mono text-muted-foreground">
              <span>Material: <span className="text-amber">{params.materialType}</span></span>
              <span>Pattern: <span className="text-amber">{params.patternStyle}</span></span>
              <span>Roughness: <span className="text-amber">{params.roughness.toFixed(2)}</span></span>
              <span>Metalness: <span className="text-amber">{params.metalness.toFixed(2)}</span></span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="font-mono text-xs border border-border hover:border-amber/30"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!name.trim() || savePreset.isPending}
            className="font-mono text-xs bg-amber text-panel-dark hover:bg-amber-bright border-0"
          >
            {savePreset.isPending ? (
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 border border-panel-dark border-t-transparent rounded-full animate-spin" />
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Save className="w-3 h-3" />
                Save
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
