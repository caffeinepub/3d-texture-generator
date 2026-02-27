import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Layers } from 'lucide-react';
import { type TextureParameters } from '../hooks/useTextureParameters';
import {
  generateAlbedoMap,
  generateNormalMap,
  generateRoughnessMap,
  generateMetalnessMap,
} from '../utils/textureMapGenerator';
import { downloadCanvasAsPng, buildTextureFilename } from '../utils/downloadHelper';

interface TextureExportPanelProps {
  params: TextureParameters;
}

type MapType = 'albedo' | 'normal' | 'roughness' | 'metalness';

const MAP_CONFIGS: { type: MapType; label: string; description: string; color: string }[] = [
  { type: 'albedo', label: 'Albedo / Diffuse', description: 'Base color map', color: '#d4a843' },
  { type: 'normal', label: 'Normal Map', description: 'Surface detail normals', color: '#6b8fd4' },
  { type: 'roughness', label: 'Roughness', description: 'Surface roughness map', color: '#8a8a8a' },
  { type: 'metalness', label: 'Metalness', description: 'Metallic surface map', color: '#c0c0c0' },
];

export default function TextureExportPanel({ params }: TextureExportPanelProps) {
  const [exporting, setExporting] = useState<MapType | null>(null);
  const [exportAll, setExportAll] = useState(false);

  const genParams = {
    baseColor: params.baseColor,
    roughness: params.roughness,
    metalness: params.metalness,
    bumpIntensity: params.bumpIntensity,
    patternScale: params.patternScale,
    colorVariation: params.colorVariation,
    patternStyle: params.patternStyle,
    colorPalette: params.colorPalette,
    tilingScale: params.tilingScale,
    size: 512,
  };

  const handleExport = async (type: MapType) => {
    setExporting(type);
    await new Promise(r => setTimeout(r, 50));

    try {
      let canvas: HTMLCanvasElement;
      switch (type) {
        case 'albedo': canvas = generateAlbedoMap(genParams); break;
        case 'normal': canvas = generateNormalMap(genParams); break;
        case 'roughness': canvas = generateRoughnessMap(genParams); break;
        case 'metalness': canvas = generateMetalnessMap(genParams); break;
      }
      const filename = buildTextureFilename(params.materialType, type);
      downloadCanvasAsPng(canvas, filename);
    } finally {
      setExporting(null);
    }
  };

  const handleExportAll = async () => {
    setExportAll(true);
    await new Promise(r => setTimeout(r, 50));

    try {
      for (const map of MAP_CONFIGS) {
        let canvas: HTMLCanvasElement;
        switch (map.type) {
          case 'albedo': canvas = generateAlbedoMap(genParams); break;
          case 'normal': canvas = generateNormalMap(genParams); break;
          case 'roughness': canvas = generateRoughnessMap(genParams); break;
          case 'metalness': canvas = generateMetalnessMap(genParams); break;
        }
        const filename = buildTextureFilename(params.materialType, map.type);
        downloadCanvasAsPng(canvas, filename);
        await new Promise(r => setTimeout(r, 100));
      }
    } finally {
      setExportAll(false);
    }
  };

  return (
    <div className="space-y-3">
      <p className="tech-label mb-2">Export Maps</p>

      <div className="space-y-1.5">
        {MAP_CONFIGS.map((map) => (
          <div
            key={map.type}
            className="flex items-center justify-between p-2 rounded-sm border border-border bg-panel hover:border-amber/30 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: map.color }}
              />
              <div>
                <p className="text-xs font-mono font-medium text-foreground">{map.label}</p>
                <p className="text-[10px] text-muted-foreground">{map.description}</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleExport(map.type)}
              disabled={exporting === map.type || exportAll}
              className="h-7 w-7 p-0 hover:bg-amber/10 hover:text-amber border border-transparent hover:border-amber/30"
            >
              {exporting === map.type ? (
                <span className="w-3 h-3 border border-amber border-t-transparent rounded-full animate-spin" />
              ) : (
                <Download className="w-3 h-3" />
              )}
            </Button>
          </div>
        ))}
      </div>

      <Button
        onClick={handleExportAll}
        disabled={exportAll || exporting !== null}
        className="w-full h-8 text-xs font-mono bg-amber/10 border border-amber/40 text-amber hover:bg-amber/20 hover:border-amber transition-all"
        variant="ghost"
      >
        {exportAll ? (
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 border border-amber border-t-transparent rounded-full animate-spin" />
            Exporting...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Layers className="w-3.5 h-3.5" />
            Export All Maps (512×512)
          </span>
        )}
      </Button>

      <p className="text-[10px] text-muted-foreground font-mono text-center">
        PNG · 512×512px · PBR-ready
      </p>
    </div>
  );
}
