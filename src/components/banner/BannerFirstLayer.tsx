import { useBanner } from '@/context/BannerContext';
import { getServicesForCategory } from '@/types/banner';
import { Shield } from 'lucide-react';

export function BannerFirstLayer() {
  const { state, dispatch } = useBanner();
  const { theme, settings, layout, categories, services } = state.config;
  const { labels } = settings;

  const containerStyle: React.CSSProperties = {
    backgroundColor: theme.backgroundColor,
    color: theme.textColor,
    fontFamily: theme.fontFamily,
    fontSize: `${theme.fontSize}px`,
    borderRadius: `${layout.borderRadius}px`,
    maxWidth: layout.type === 'wall' ? `${layout.maxWidth}px` : undefined,
    border: `1px solid ${theme.borderColor}`,
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  };

  return (
    <div style={containerStyle} className="w-full overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-3">
        <div className="flex items-center gap-3 mb-3">
          {layout.showLogo && (
            <div
              className="flex items-center justify-center w-10 h-10 rounded-lg"
              style={{ backgroundColor: theme.primaryColor }}
            >
              <Shield size={20} style={{ color: theme.primaryTextColor }} />
            </div>
          )}
          <h2 className="text-lg font-semibold" style={{ color: theme.textColor }}>
            {labels.firstLayerTitle}
          </h2>
        </div>
        <p className="text-sm leading-relaxed opacity-80" style={{ color: theme.textColor }}>
          {settings.firstLayerDescription}
        </p>
      </div>

      {/* Category pills */}
      <div className="px-6 py-3">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const catServices = getServicesForCategory(cat, services);
            return (
              <span
                key={cat.categorySlug}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                style={{ backgroundColor: theme.secondaryColor, color: theme.secondaryTextColor }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: cat.categorySlug === 'essential'
                      ? theme.toggleActiveColor
                      : theme.toggleInactiveColor,
                  }}
                />
                {cat.label}
                <span className="opacity-50">({catServices.length})</span>
              </span>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="p-6 pt-3 flex flex-col gap-2">
        <button
          onClick={() => dispatch({ type: 'ACCEPT_ALL' })}
          className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90 cursor-pointer"
          style={{ backgroundColor: theme.primaryColor, color: theme.primaryTextColor }}
        >
          {labels.btnAcceptAll}
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => dispatch({ type: 'DENY_ALL' })}
            className="flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-opacity hover:opacity-80 cursor-pointer"
            style={{ backgroundColor: theme.secondaryColor, color: theme.secondaryTextColor }}
          >
            {labels.btnDeny}
          </button>
          <button
            onClick={() => dispatch({ type: 'SET_PREVIEW_MODE', payload: 'second-layer' })}
            className="flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-opacity hover:opacity-80 cursor-pointer"
            style={{ backgroundColor: 'transparent', color: theme.primaryColor, border: `1px solid ${theme.primaryColor}` }}
          >
            {labels.btnMore}
          </button>
        </div>
      </div>

      {/* Footer links */}
      <div
        className="px-6 py-3 flex items-center justify-center gap-4 text-xs"
        style={{ borderTop: `1px solid ${theme.borderColor}` }}
      >
        <a
          href={settings.privacyPolicyUrl}
          className="hover:underline opacity-60"
          style={{ color: theme.textColor }}
          onClick={(e) => e.preventDefault()}
        >
          {labels.privacyPolicyLinkText}
        </a>
        <span className="opacity-30">|</span>
        <a
          href={settings.imprintUrl}
          className="hover:underline opacity-60"
          style={{ color: theme.textColor }}
          onClick={(e) => e.preventDefault()}
        >
          {labels.imprintLinkText}
        </a>
        <span className="opacity-30">|</span>
        <span className="opacity-40">Powered by Usercentrics</span>
      </div>
    </div>
  );
}
