import { useBanner } from '@/context/BannerContext';
import { Label } from '@/components/ui/label';
import type { BannerLayoutType } from '@/types/banner';
import {
  Maximize,
  PanelBottom,
  PanelTop,
  SquareStack,
  CornerDownLeft,
  CornerDownRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const LAYOUT_OPTIONS: {
  type: BannerLayoutType;
  label: string;
  icon: React.ReactNode;
}[] = [
  { type: 'wall', label: 'Wall', icon: <Maximize size={18} /> },
  { type: 'bar-bottom', label: 'Bar Bottom', icon: <PanelBottom size={18} /> },
  { type: 'bar-top', label: 'Bar Top', icon: <PanelTop size={18} /> },
  { type: 'popup-center', label: 'Center Popup', icon: <SquareStack size={18} /> },
  { type: 'popup-bottom-left', label: 'Bottom Left', icon: <CornerDownLeft size={18} /> },
  { type: 'popup-bottom-right', label: 'Bottom Right', icon: <CornerDownRight size={18} /> },
];

export function LayoutPanel() {
  const { state, dispatch } = useBanner();
  const { layout } = state.config;

  const updateLayout = (updates: Partial<typeof layout>) => {
    dispatch({ type: 'SET_LAYOUT', payload: updates });
  };

  return (
    <div className="p-4 space-y-6 overflow-y-auto h-full">
      {/* Layout Type */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Layout Type</h3>
        <div className="grid grid-cols-3 gap-2">
          {LAYOUT_OPTIONS.map((opt) => (
            <button
              key={opt.type}
              onClick={() => updateLayout({ type: opt.type })}
              className={cn(
                'flex flex-col items-center gap-1.5 p-3 rounded-lg border text-xs transition-colors cursor-pointer',
                layout.type === opt.type
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:border-primary/30 text-muted-foreground'
              )}
            >
              {opt.icon}
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Dimensions */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Dimensions</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <Label className="text-xs text-muted-foreground">Max Width</Label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="320"
                max="1200"
                step="10"
                value={layout.maxWidth}
                onChange={(e) =>
                  updateLayout({ maxWidth: parseInt(e.target.value) })
                }
                className="w-24"
              />
              <span className="text-xs font-mono w-12 text-right">
                {layout.maxWidth}px
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-3">
            <Label className="text-xs text-muted-foreground">
              Border Radius
            </Label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="32"
                step="1"
                value={layout.borderRadius}
                onChange={(e) =>
                  updateLayout({ borderRadius: parseInt(e.target.value) })
                }
                className="w-24"
              />
              <span className="text-xs font-mono w-12 text-right">
                {layout.borderRadius}px
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Toggles */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Elements</h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between gap-3 cursor-pointer">
            <span className="text-xs text-muted-foreground">Show Logo</span>
            <button
              onClick={() => updateLayout({ showLogo: !layout.showLogo })}
              className={cn(
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer',
                layout.showLogo ? 'bg-primary' : 'bg-muted'
              )}
            >
              <span
                className={cn(
                  'inline-block h-4 w-4 rounded-full bg-white transition-transform shadow-sm',
                  layout.showLogo ? 'translate-x-[22px]' : 'translate-x-1'
                )}
              />
            </button>
          </label>
          <label className="flex items-center justify-between gap-3 cursor-pointer">
            <span className="text-xs text-muted-foreground">
              Close Button
            </span>
            <button
              onClick={() =>
                updateLayout({ showCloseButton: !layout.showCloseButton })
              }
              className={cn(
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer',
                layout.showCloseButton ? 'bg-primary' : 'bg-muted'
              )}
            >
              <span
                className={cn(
                  'inline-block h-4 w-4 rounded-full bg-white transition-transform shadow-sm',
                  layout.showCloseButton
                    ? 'translate-x-[22px]'
                    : 'translate-x-1'
                )}
              />
            </button>
          </label>
          <label className="flex items-center justify-between gap-3 cursor-pointer">
            <span className="text-xs text-muted-foreground">
              Privacy Button
            </span>
            <button
              onClick={() =>
                updateLayout({
                  showPrivacyButton: !layout.showPrivacyButton,
                })
              }
              className={cn(
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer',
                layout.showPrivacyButton ? 'bg-primary' : 'bg-muted'
              )}
            >
              <span
                className={cn(
                  'inline-block h-4 w-4 rounded-full bg-white transition-transform shadow-sm',
                  layout.showPrivacyButton
                    ? 'translate-x-[22px]'
                    : 'translate-x-1'
                )}
              />
            </button>
          </label>
        </div>
      </div>
    </div>
  );
}
