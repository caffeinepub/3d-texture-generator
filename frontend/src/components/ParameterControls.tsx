import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { type TextureParameters, PATTERN_STYLES, type ExtendedMaterialType } from '../hooks/useTextureParameters';
import { MaterialType } from '../backend';

interface ParameterControlsProps {
  params: TextureParameters;
  activeMaterial: ExtendedMaterialType;
  onChange: <K extends keyof TextureParameters>(key: K, value: TextureParameters[K]) => void;
}

interface SliderRowProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (v: number) => void;
  displayValue?: string;
}

function SliderRow({ label, value, min = 0, max = 1, step = 0.01, onChange, displayValue }: SliderRowProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className="tech-label">{label}</Label>
        <span className="font-mono text-[11px] text-amber tabular-nums">
          {displayValue ?? value.toFixed(2)}
        </span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([v]) => onChange(v)}
        className="[&_[role=slider]]:bg-amber [&_[role=slider]]:border-amber [&_.bg-primary]:bg-amber"
      />
    </div>
  );
}

export default function ParameterControls({ params, activeMaterial, onChange }: ParameterControlsProps) {
  const patternOptions = PATTERN_STYLES[activeMaterial] || PATTERN_STYLES[MaterialType.metal];

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    onChange('baseColor', hex);
    // Update first color in palette
    const newPalette = [...params.colorPalette];
    newPalette[0] = hex;
    onChange('colorPalette', newPalette);
  };

  return (
    <div className="space-y-4">
      <p className="tech-label mb-2">Parameters</p>

      {/* Base Color */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label className="tech-label">Base Color</Label>
          <span className="font-mono text-[11px] text-amber uppercase">{params.baseColor}</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-sm border border-border cursor-pointer overflow-hidden relative"
            style={{ backgroundColor: params.baseColor }}
          >
            <input
              type="color"
              value={params.baseColor}
              onChange={handleColorChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
          </div>
          <div className="flex-1 h-8 rounded-sm border border-border overflow-hidden">
            <div
              className="w-full h-full"
              style={{
                background: `linear-gradient(to right, ${params.colorPalette.join(', ')})`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Pattern Style */}
      <div className="space-y-1.5">
        <Label className="tech-label">Pattern Style</Label>
        <div className="flex flex-wrap gap-1">
          {patternOptions.map((style) => (
            <button
              key={style}
              onClick={() => onChange('patternStyle', style)}
              className={`
                px-2 py-0.5 text-[10px] font-mono rounded-sm border transition-all
                ${params.patternStyle === style
                  ? 'border-amber text-amber bg-amber/10'
                  : 'border-border text-muted-foreground hover:border-amber/40 hover:text-foreground'
                }
              `}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      {/* Sliders */}
      <SliderRow
        label="Roughness"
        value={params.roughness}
        onChange={(v) => onChange('roughness', v)}
      />
      <SliderRow
        label="Metalness"
        value={params.metalness}
        onChange={(v) => onChange('metalness', v)}
      />
      <SliderRow
        label="Bump Intensity"
        value={params.bumpIntensity}
        onChange={(v) => onChange('bumpIntensity', v)}
      />
      <SliderRow
        label="Pattern Scale"
        value={params.patternScale}
        min={0.1}
        max={5}
        step={0.1}
        onChange={(v) => onChange('patternScale', v)}
        displayValue={params.patternScale.toFixed(1)}
      />
      <SliderRow
        label="Tiling Scale"
        value={params.tilingScale}
        min={0.1}
        max={4}
        step={0.1}
        onChange={(v) => onChange('tilingScale', v)}
        displayValue={params.tilingScale.toFixed(1)}
      />
      <SliderRow
        label="Color Variation"
        value={params.colorVariation}
        onChange={(v) => onChange('colorVariation', v)}
      />
    </div>
  );
}
