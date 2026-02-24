import { useBanner } from '@/context/BannerContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <Label className="text-xs text-muted-foreground shrink-0">{label}</Label>
      <div className="flex items-center gap-2">
        <div
          className="w-6 h-6 rounded border border-border shrink-0"
          style={{ backgroundColor: value }}
        />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-7 w-24 text-xs font-mono"
        />
      </div>
    </div>
  );
}

export function ThemePanel() {
  const { state, dispatch } = useBanner();
  const { theme } = state.config;

  const updateTheme = (updates: Partial<typeof theme>) => {
    dispatch({ type: 'SET_THEME', payload: updates });
  };

  return (
    <div className="p-4 space-y-6 overflow-y-auto h-full">
      <div>
        <h3 className="text-sm font-semibold mb-3">Colors</h3>
        <div className="space-y-3">
          <ColorInput
            label="Background"
            value={theme.backgroundColor}
            onChange={(v) => updateTheme({ backgroundColor: v })}
          />
          <ColorInput
            label="Text"
            value={theme.textColor}
            onChange={(v) => updateTheme({ textColor: v })}
          />
          <ColorInput
            label="Primary"
            value={theme.primaryColor}
            onChange={(v) => updateTheme({ primaryColor: v })}
          />
          <ColorInput
            label="Primary Text"
            value={theme.primaryTextColor}
            onChange={(v) => updateTheme({ primaryTextColor: v })}
          />
          <ColorInput
            label="Secondary"
            value={theme.secondaryColor}
            onChange={(v) => updateTheme({ secondaryColor: v })}
          />
          <ColorInput
            label="Secondary Text"
            value={theme.secondaryTextColor}
            onChange={(v) => updateTheme({ secondaryTextColor: v })}
          />
          <ColorInput
            label="Toggle Active"
            value={theme.toggleActiveColor}
            onChange={(v) => updateTheme({ toggleActiveColor: v })}
          />
          <ColorInput
            label="Toggle Inactive"
            value={theme.toggleInactiveColor}
            onChange={(v) => updateTheme({ toggleInactiveColor: v })}
          />
          <ColorInput
            label="Border"
            value={theme.borderColor}
            onChange={(v) => updateTheme({ borderColor: v })}
          />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Overlay</h3>
        <div className="space-y-3">
          <ColorInput
            label="Color"
            value={theme.overlayColor}
            onChange={(v) => updateTheme({ overlayColor: v })}
          />
          <div className="flex items-center justify-between gap-3">
            <Label className="text-xs text-muted-foreground">Opacity</Label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={theme.overlayOpacity}
                onChange={(e) =>
                  updateTheme({ overlayOpacity: parseFloat(e.target.value) })
                }
                className="w-20"
              />
              <span className="text-xs font-mono w-8 text-right">
                {theme.overlayOpacity.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Typography</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <Label className="text-xs text-muted-foreground">Font Size</Label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="10"
                max="20"
                step="1"
                value={theme.fontSize}
                onChange={(e) =>
                  updateTheme({ fontSize: parseInt(e.target.value) })
                }
                className="w-20"
              />
              <span className="text-xs font-mono w-8 text-right">
                {theme.fontSize}px
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-3">
            <Label className="text-xs text-muted-foreground">Font Family</Label>
            <select
              value={theme.fontFamily}
              onChange={(e) => updateTheme({ fontFamily: e.target.value })}
              className="h-7 text-xs bg-secondary border border-border rounded px-2"
            >
              <option value="system-ui, -apple-system, sans-serif">System</option>
              <option value="'Inter', sans-serif">Inter</option>
              <option value="'Roboto', sans-serif">Roboto</option>
              <option value="'Open Sans', sans-serif">Open Sans</option>
              <option value="Georgia, serif">Georgia</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quick Presets */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Quick Presets</h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() =>
              updateTheme({
                backgroundColor: '#ffffff',
                textColor: '#1a1a2e',
                primaryColor: '#1f6ff0',
                primaryTextColor: '#ffffff',
                secondaryColor: '#f0f0f5',
                secondaryTextColor: '#1a1a2e',
                borderColor: '#e2e8f0',
              })
            }
            className="p-2 rounded-lg border border-border text-xs hover:border-primary/50 transition-colors cursor-pointer bg-white text-gray-900"
          >
            Light
          </button>
          <button
            onClick={() =>
              updateTheme({
                backgroundColor: '#1a1a2e',
                textColor: '#e2e8f0',
                primaryColor: '#6d5dfc',
                primaryTextColor: '#ffffff',
                secondaryColor: '#2a2a3e',
                secondaryTextColor: '#e2e8f0',
                borderColor: '#3a3a4e',
              })
            }
            className="p-2 rounded-lg border border-border text-xs hover:border-primary/50 transition-colors cursor-pointer bg-[#1a1a2e] text-gray-200"
          >
            Dark
          </button>
          <button
            onClick={() =>
              updateTheme({
                backgroundColor: '#0f172a',
                textColor: '#f8fafc',
                primaryColor: '#22c55e',
                primaryTextColor: '#ffffff',
                secondaryColor: '#1e293b',
                secondaryTextColor: '#f8fafc',
                borderColor: '#334155',
              })
            }
            className="p-2 rounded-lg border border-border text-xs hover:border-primary/50 transition-colors cursor-pointer bg-[#0f172a] text-green-400"
          >
            Forest
          </button>
          <button
            onClick={() =>
              updateTheme({
                backgroundColor: '#faf5ff',
                textColor: '#3b0764',
                primaryColor: '#8b5cf6',
                primaryTextColor: '#ffffff',
                secondaryColor: '#f3e8ff',
                secondaryTextColor: '#3b0764',
                borderColor: '#ddd6fe',
              })
            }
            className="p-2 rounded-lg border border-border text-xs hover:border-primary/50 transition-colors cursor-pointer bg-purple-50 text-purple-900"
          >
            Purple
          </button>
        </div>
      </div>
    </div>
  );
}
