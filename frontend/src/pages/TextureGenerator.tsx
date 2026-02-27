import { useState, Suspense } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Save, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import MaterialSelector from '../components/MaterialSelector';
import ParameterControls from '../components/ParameterControls';
import TextureExportPanel from '../components/TextureExportPanel';
import PresetsLibrary from '../components/PresetsLibrary';
import SavePresetDialog from '../components/SavePresetDialog';
import { useTextureParameters, type ExtendedMaterialType } from '../hooks/useTextureParameters';
import { type TexturePreset, MaterialType } from '../backend';
import { Toaster } from '@/components/ui/sonner';
import TexturePreview3D from '../components/TexturePreview3D';

export default function TextureGenerator() {
  const { params, updateParam, setMaterialType, loadPresetParams } = useTextureParameters();
  const [activeMaterial, setActiveMaterial] = useState<ExtendedMaterialType>(MaterialType.metal);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);

  const handleMaterialChange = (type: ExtendedMaterialType) => {
    setActiveMaterial(type);
    setMaterialType(type);
  };

  const handleLoadPreset = (preset: TexturePreset) => {
    loadPresetParams(preset);
    setActiveMaterial(preset.materialType);
  };

  const handleRandomize = () => {
    updateParam('roughness', Math.random());
    updateParam('metalness', Math.random());
    updateParam('bumpIntensity', Math.random() * 0.8 + 0.1);
    updateParam('patternScale', Math.random() * 3 + 0.5);
    updateParam('colorVariation', Math.random() * 0.6 + 0.1);
    const hue = Math.floor(Math.random() * 360);
    const sat = Math.floor(Math.random() * 60 + 20);
    const light = Math.floor(Math.random() * 40 + 30);
    const hex = hslToHex(hue, sat, light);
    updateParam('baseColor', hex);
    updateParam('colorPalette', [hex, lighten(hex, 20), darken(hex, 20)]);
  };

  return (
    <div className="h-full flex overflow-hidden" style={{ height: 'calc(100vh - 80px)' }}>
      <Toaster theme="dark" />

      {/* Left Panel - Material & Parameters */}
      <div
        className={`shrink-0 border-r border-border bg-panel flex flex-col transition-all duration-200 ${
          leftPanelOpen ? 'w-64' : 'w-0 overflow-hidden'
        }`}
      >
        <div className="flex items-center justify-between px-3 py-2 border-b border-border">
          <span className="tech-label">MATERIAL SETUP</span>
          <button
            onClick={() => setLeftPanelOpen(false)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>
        <ScrollArea className="flex-1 scrollbar-thin">
          <div className="p-3 space-y-4">
            <MaterialSelector
              selected={activeMaterial}
              onChange={handleMaterialChange}
            />
            <Separator className="bg-border" />
            <ParameterControls
              params={params}
              activeMaterial={activeMaterial}
              onChange={updateParam}
            />
          </div>
        </ScrollArea>
      </div>

      {/* Left panel toggle when closed */}
      {!leftPanelOpen && (
        <button
          onClick={() => setLeftPanelOpen(true)}
          className="shrink-0 w-6 border-r border-border bg-panel hover:bg-panel-light flex items-center justify-center transition-colors"
        >
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      )}

      {/* Center - 3D Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Viewport toolbar */}
        <div className="h-9 flex items-center justify-between px-3 border-b border-border bg-panel/50 shrink-0">
          <div className="flex items-center gap-3">
            <span className="tech-label">3D VIEWPORT</span>
            <span className="text-[10px] font-mono text-muted-foreground/60">
              Drag to rotate · Scroll to zoom
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
              <span className="text-amber">{params.materialType.toUpperCase()}</span>
              <span>·</span>
              <span>{params.patternStyle}</span>
              <span>·</span>
              <span>R:{params.roughness.toFixed(2)}</span>
              <span>M:{params.metalness.toFixed(2)}</span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleRandomize}
              className="h-6 text-[10px] font-mono border border-border hover:border-amber/40 hover:text-amber px-2"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Randomize
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSaveDialogOpen(true)}
              className="h-6 text-[10px] font-mono border border-amber/40 text-amber hover:bg-amber/10 hover:border-amber px-2"
            >
              <Save className="w-3 h-3 mr-1" />
              Save Preset
            </Button>
          </div>
        </div>

        {/* 3D Canvas */}
        <div className="flex-1 viewport-bg relative">
          <Suspense fallback={
            <div className="w-full h-full flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-amber border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-mono text-muted-foreground">Loading 3D Engine...</span>
              </div>
            </div>
          }>
            <TexturePreview3D params={params} />
          </Suspense>

          {/* Corner info overlay */}
          <div className="absolute bottom-3 left-3 pointer-events-none">
            <div className="bg-panel/80 border border-border rounded-sm px-2 py-1 backdrop-blur-sm">
              <p className="text-[10px] font-mono text-muted-foreground">
                PBR · MeshStandardMaterial · 256px preview
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel toggle when closed */}
      {!rightPanelOpen && (
        <button
          onClick={() => setRightPanelOpen(true)}
          className="shrink-0 w-6 border-l border-border bg-panel hover:bg-panel-light flex items-center justify-center transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      )}

      {/* Right Panel - Export & Presets */}
      <div
        className={`shrink-0 border-l border-border bg-panel flex flex-col transition-all duration-200 ${
          rightPanelOpen ? 'w-64' : 'w-0 overflow-hidden'
        }`}
      >
        <div className="flex items-center justify-between px-3 py-2 border-b border-border">
          <span className="tech-label">EXPORT & PRESETS</span>
          <button
            onClick={() => setRightPanelOpen(false)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <ScrollArea className="flex-1 scrollbar-thin">
          <div className="p-3 space-y-4">
            <TextureExportPanel params={params} />
            <Separator className="bg-border" />
            <PresetsLibrary onLoad={handleLoadPreset} />
          </div>
        </ScrollArea>
      </div>

      {/* Save Preset Dialog */}
      <SavePresetDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        params={params}
      />
    </div>
  );
}

// ─── Color Helpers ────────────────────────────────────────────────────────────

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function lighten(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, (num >> 16) + amount);
  const g = Math.min(255, ((num >> 8) & 0xff) + amount);
  const b = Math.min(255, (num & 0xff) + amount);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function darken(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, (num >> 16) - amount);
  const g = Math.max(0, ((num >> 8) & 0xff) - amount);
  const b = Math.max(0, (num & 0xff) - amount);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
