import { MaterialType } from '../backend';
import { type ExtendedMaterialType } from '../hooks/useTextureParameters';

interface MaterialOption {
  id: ExtendedMaterialType;
  label: string;
  icon: string;
  description: string;
}

const MATERIALS: MaterialOption[] = [
  { id: MaterialType.metal, label: 'Metal', icon: '⬡', description: 'Brushed, polished, hammered' },
  { id: MaterialType.wood, label: 'Wood', icon: '▤', description: 'Grain, plank, bark' },
  { id: MaterialType.stone, label: 'Stone', icon: '◈', description: 'Marble, granite, slate' },
  { id: MaterialType.fabric, label: 'Fabric', icon: '⊞', description: 'Weave, knit, canvas' },
  { id: MaterialType.plastic, label: 'Plastic', icon: '◉', description: 'Smooth, matte, glossy' },
  { id: MaterialType.organic, label: 'Organic', icon: '❋', description: 'Cellular, scales, moss' },
  { id: 'ceramic', label: 'Ceramic', icon: '◎', description: 'Glazed, crackle, porcelain' },
  { id: 'concrete', label: 'Concrete', icon: '▦', description: 'Poured, stamped, exposed' },
];

interface MaterialSelectorProps {
  selected: ExtendedMaterialType;
  onChange: (type: ExtendedMaterialType) => void;
}

export default function MaterialSelector({ selected, onChange }: MaterialSelectorProps) {
  return (
    <div className="space-y-1">
      <p className="tech-label mb-2">Material Category</p>
      <div className="grid grid-cols-2 gap-1">
        {MATERIALS.map((mat) => {
          const isSelected = selected === mat.id;
          return (
            <button
              key={mat.id}
              onClick={() => onChange(mat.id)}
              className={`
                relative flex flex-col items-start p-2 rounded-sm border text-left transition-all duration-150
                ${isSelected
                  ? 'border-amber bg-amber/10 shadow-amber-sm'
                  : 'border-border bg-panel hover:border-amber/40 hover:bg-panel-light'
                }
              `}
            >
              <div className="flex items-center gap-1.5 w-full">
                <span className={`text-base leading-none ${isSelected ? 'text-amber' : 'text-muted-foreground'}`}>
                  {mat.icon}
                </span>
                <span className={`text-xs font-mono font-medium ${isSelected ? 'text-amber' : 'text-foreground'}`}>
                  {mat.label}
                </span>
                {isSelected && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-amber animate-pulse-amber" />
                )}
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight pl-5">
                {mat.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
