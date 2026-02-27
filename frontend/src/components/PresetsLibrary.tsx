import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Trash2, FolderOpen, Clock } from 'lucide-react';
import { useGetAllPresets, useDeletePreset } from '../hooks/useQueries';
import { type TexturePreset } from '../backend';
import { toast } from 'sonner';

interface PresetsLibraryProps {
  onLoad: (preset: TexturePreset) => void;
}

function formatTimestamp(ts: bigint): string {
  const ms = Number(ts / BigInt(1_000_000));
  const date = new Date(ms);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
}

function materialLabel(type: string): string {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

const MATERIAL_COLORS: Record<string, string> = {
  metal: '#a0a0b0',
  wood: '#8B5E3C',
  stone: '#7a7a72',
  fabric: '#4a6fa5',
  plastic: '#e03030',
  organic: '#4a7a3a',
};

export default function PresetsLibrary({ onLoad }: PresetsLibraryProps) {
  const { data: presets, isLoading } = useGetAllPresets();
  const deletePreset = useDeletePreset();
  const [deletingName, setDeletingName] = useState<string | null>(null);

  const handleDelete = async (name: string) => {
    setDeletingName(name);
    try {
      await deletePreset.mutateAsync(name);
      toast.success(`Preset "${name}" deleted`);
    } catch {
      toast.error('Failed to delete preset');
    } finally {
      setDeletingName(null);
    }
  };

  const handleLoad = (preset: TexturePreset) => {
    onLoad(preset);
    toast.success(`Loaded "${preset.name}"`);
  };

  return (
    <div className="space-y-2">
      <p className="tech-label mb-2">Saved Presets</p>

      {isLoading ? (
        <div className="space-y-1.5">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 w-full bg-panel-light" />
          ))}
        </div>
      ) : !presets || presets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 text-center border border-dashed border-border rounded-sm">
          <FolderOpen className="w-6 h-6 text-muted-foreground mb-2" />
          <p className="text-xs text-muted-foreground font-mono">No presets saved yet</p>
          <p className="text-[10px] text-muted-foreground/60 font-mono mt-0.5">
            Save your current config above
          </p>
        </div>
      ) : (
        <ScrollArea className="h-[280px] pr-1">
          <div className="space-y-1">
            {presets.map((preset) => {
              const matColor = MATERIAL_COLORS[preset.materialType] || '#888';
              return (
                <div
                  key={preset.name}
                  className="group flex items-center gap-2 p-2 rounded-sm border border-border bg-panel hover:border-amber/30 transition-all"
                >
                  <div
                    className="w-2 h-8 rounded-full shrink-0"
                    style={{ backgroundColor: matColor }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-mono font-medium text-foreground truncate">
                      {preset.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-mono text-amber">
                        {materialLabel(preset.materialType)}
                      </span>
                      <span className="text-[10px] text-muted-foreground">·</span>
                      <span className="text-[10px] text-muted-foreground">
                        {preset.parameters.patternStyle}
                      </span>
                      <span className="text-[10px] text-muted-foreground ml-auto flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5" />
                        {formatTimestamp(preset.timestamp)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleLoad(preset)}
                      className="h-6 w-6 p-0 hover:bg-amber/10 hover:text-amber"
                      title="Load preset"
                    >
                      <FolderOpen className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(preset.name)}
                      disabled={deletingName === preset.name}
                      className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                      title="Delete preset"
                    >
                      {deletingName === preset.name ? (
                        <span className="w-3 h-3 border border-destructive border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
