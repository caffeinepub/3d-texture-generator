import { useState, useCallback } from 'react';
import { MaterialType, type GenerationParameters } from '../backend';

export interface TextureParameters {
  materialType: MaterialType;
  baseColor: string;
  roughness: number;
  metalness: number;
  bumpIntensity: number;
  patternScale: number;
  colorVariation: number;
  patternStyle: string;
  colorPalette: string[];
  tilingScale: number;
}

export const MATERIAL_CONFIGS: Record<MaterialType, Partial<TextureParameters>> = {
  [MaterialType.metal]: {
    roughness: 0.2,
    metalness: 0.95,
    bumpIntensity: 0.3,
    patternScale: 1.0,
    colorVariation: 0.1,
    patternStyle: 'brushed',
    baseColor: '#8a8a8a',
    colorPalette: ['#8a8a8a', '#b0b0b0', '#606060'],
  },
  [MaterialType.wood]: {
    roughness: 0.75,
    metalness: 0.0,
    bumpIntensity: 0.6,
    patternScale: 2.0,
    colorVariation: 0.4,
    patternStyle: 'grain',
    baseColor: '#8B5E3C',
    colorPalette: ['#8B5E3C', '#6B4226', '#A0714F'],
  },
  [MaterialType.stone]: {
    roughness: 0.85,
    metalness: 0.0,
    bumpIntensity: 0.8,
    patternScale: 1.5,
    colorVariation: 0.3,
    patternStyle: 'cracked',
    baseColor: '#7a7a72',
    colorPalette: ['#7a7a72', '#5a5a52', '#9a9a92'],
  },
  [MaterialType.fabric]: {
    roughness: 0.95,
    metalness: 0.0,
    bumpIntensity: 0.4,
    patternScale: 3.0,
    colorVariation: 0.2,
    patternStyle: 'weave',
    baseColor: '#4a6fa5',
    colorPalette: ['#4a6fa5', '#2a4f85', '#6a8fc5'],
  },
  [MaterialType.plastic]: {
    roughness: 0.3,
    metalness: 0.0,
    bumpIntensity: 0.1,
    patternScale: 1.0,
    colorVariation: 0.05,
    patternStyle: 'smooth',
    baseColor: '#e03030',
    colorPalette: ['#e03030', '#c02020', '#ff5050'],
  },
  [MaterialType.organic]: {
    roughness: 0.7,
    metalness: 0.0,
    bumpIntensity: 0.7,
    patternScale: 2.5,
    colorVariation: 0.5,
    patternStyle: 'cellular',
    baseColor: '#4a7a3a',
    colorPalette: ['#4a7a3a', '#2a5a1a', '#6a9a5a'],
  },
};

// Extended material types for UI (beyond backend enum)
export type ExtendedMaterialType = MaterialType | 'ceramic' | 'concrete';

export const EXTENDED_MATERIAL_CONFIGS: Record<ExtendedMaterialType, Partial<TextureParameters>> = {
  ...MATERIAL_CONFIGS,
  ceramic: {
    roughness: 0.15,
    metalness: 0.05,
    bumpIntensity: 0.2,
    patternScale: 1.0,
    colorVariation: 0.08,
    patternStyle: 'smooth',
    baseColor: '#e8e0d0',
    colorPalette: ['#e8e0d0', '#d0c8b8', '#f0e8d8'],
  },
  concrete: {
    roughness: 0.9,
    metalness: 0.0,
    bumpIntensity: 0.9,
    patternScale: 1.8,
    colorVariation: 0.25,
    patternStyle: 'noise',
    baseColor: '#888880',
    colorPalette: ['#888880', '#686860', '#a8a8a0'],
  },
};

export const PATTERN_STYLES: Record<ExtendedMaterialType, string[]> = {
  [MaterialType.metal]: ['brushed', 'polished', 'hammered', 'corrugated', 'perforated'],
  [MaterialType.wood]: ['grain', 'plank', 'parquet', 'bark', 'knot'],
  [MaterialType.stone]: ['cracked', 'marble', 'granite', 'slate', 'cobble'],
  [MaterialType.fabric]: ['weave', 'knit', 'denim', 'silk', 'canvas'],
  [MaterialType.plastic]: ['smooth', 'matte', 'glossy', 'textured', 'carbon'],
  [MaterialType.organic]: ['cellular', 'scales', 'bark', 'moss', 'coral'],
  ceramic: ['smooth', 'crackle', 'glazed', 'terracotta', 'porcelain'],
  concrete: ['noise', 'poured', 'stamped', 'exposed', 'polished'],
};

const DEFAULT_PARAMS: TextureParameters = {
  materialType: MaterialType.metal,
  baseColor: '#8a8a8a',
  roughness: 0.2,
  metalness: 0.95,
  bumpIntensity: 0.3,
  patternScale: 1.0,
  colorVariation: 0.1,
  patternStyle: 'brushed',
  colorPalette: ['#8a8a8a', '#b0b0b0', '#606060'],
  tilingScale: 1.0,
};

export function useTextureParameters() {
  const [params, setParams] = useState<TextureParameters>(DEFAULT_PARAMS);

  const updateParam = useCallback(<K extends keyof TextureParameters>(
    key: K,
    value: TextureParameters[K]
  ) => {
    setParams(prev => ({ ...prev, [key]: value }));
  }, []);

  const setMaterialType = useCallback((type: ExtendedMaterialType) => {
    const config = EXTENDED_MATERIAL_CONFIGS[type];
    const backendType = Object.values(MaterialType).includes(type as MaterialType)
      ? (type as MaterialType)
      : MaterialType.stone; // fallback for ceramic/concrete

    setParams(prev => ({
      ...prev,
      ...config,
      materialType: backendType,
    }));
  }, []);

  const loadPresetParams = useCallback((preset: {
    materialType: MaterialType;
    parameters: GenerationParameters;
  }) => {
    const config = MATERIAL_CONFIGS[preset.materialType] || {};
    setParams(prev => ({
      ...prev,
      ...config,
      materialType: preset.materialType,
      roughness: preset.parameters.roughness,
      metalness: preset.parameters.metalness,
      patternStyle: preset.parameters.patternStyle,
      colorPalette: preset.parameters.colorPalette,
      tilingScale: preset.parameters.tilingScale,
      baseColor: preset.parameters.colorPalette[0] || prev.baseColor,
    }));
  }, []);

  const toGenerationParameters = useCallback((): GenerationParameters => ({
    roughness: params.roughness,
    metalness: params.metalness,
    colorPalette: params.colorPalette,
    patternStyle: params.patternStyle,
    tilingScale: params.tilingScale,
  }), [params]);

  return {
    params,
    updateParam,
    setMaterialType,
    loadPresetParams,
    toGenerationParameters,
  };
}
