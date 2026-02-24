import { useBanner } from '@/context/BannerContext';
import { BannerFirstLayer } from './BannerFirstLayer';
import { BannerSecondLayer } from './BannerSecondLayer';
import { Monitor, Smartphone, Layers, Layers2 } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function BannerPreview() {
  const { state, dispatch } = useBanner();
  const { theme, layout } = state.config;
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');

  const getLayoutClasses = () => {
    switch (layout.type) {
      case 'wall':
        return 'items-center justify-center';
      case 'bar-bottom':
        return 'items-end justify-center';
      case 'bar-top':
        return 'items-start justify-center';
      case 'popup-center':
        return 'items-center justify-center';
      case 'popup-bottom-left':
        return 'items-end justify-start';
      case 'popup-bottom-right':
        return 'items-end justify-end';
      default:
        return 'items-center justify-center';
    }
  };

  const isBarLayout = layout.type === 'bar-bottom' || layout.type === 'bar-top';

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Preview</span>
        </div>
        <div className="flex items-center gap-1">
          {/* Viewport toggle */}
          <button
            onClick={() => setViewport('desktop')}
            className={cn(
              'p-2 rounded-md transition-colors cursor-pointer',
              viewport === 'desktop'
                ? 'bg-secondary text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Monitor size={16} />
          </button>
          <button
            onClick={() => setViewport('mobile')}
            className={cn(
              'p-2 rounded-md transition-colors cursor-pointer',
              viewport === 'mobile'
                ? 'bg-secondary text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Smartphone size={16} />
          </button>

          <div className="w-px h-5 bg-border mx-2" />

          {/* Layer toggle */}
          <button
            onClick={() => dispatch({ type: 'SET_PREVIEW_MODE', payload: 'first-layer' })}
            className={cn(
              'p-2 rounded-md transition-colors cursor-pointer',
              state.previewMode === 'first-layer'
                ? 'bg-secondary text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
            title="First Layer"
          >
            <Layers size={16} />
          </button>
          <button
            onClick={() => dispatch({ type: 'SET_PREVIEW_MODE', payload: 'second-layer' })}
            className={cn(
              'p-2 rounded-md transition-colors cursor-pointer',
              state.previewMode === 'second-layer'
                ? 'bg-secondary text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
            title="Second Layer"
          >
            <Layers2 size={16} />
          </button>
        </div>
      </div>

      {/* Preview area */}
      <div className="flex-1 relative overflow-hidden">
        {/* Simulated page background */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,.03) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
        />

        {/* Overlay */}
        {layout.type === 'wall' && (
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: theme.overlayColor,
              opacity: theme.overlayOpacity,
            }}
          />
        )}

        {/* Banner container */}
        <div
          className={cn(
            'absolute inset-0 flex p-6',
            getLayoutClasses(),
            viewport === 'mobile' && 'max-w-[375px] mx-auto'
          )}
        >
          <div
            className={cn(
              'w-full transition-all duration-300',
              isBarLayout && 'max-w-full'
            )}
            style={{
              maxWidth: isBarLayout ? '100%' : `${layout.maxWidth}px`,
            }}
          >
            {state.previewMode === 'first-layer' ? (
              <BannerFirstLayer />
            ) : (
              <BannerSecondLayer />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
