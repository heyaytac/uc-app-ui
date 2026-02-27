import { useBanner } from '@/context/BannerContext';

export function BannerFirstLayer() {
  const { state, dispatch } = useBanner();
  const { theme, settings, layout } = state.config;
  const { labels } = settings;

  const containerStyle: React.CSSProperties = {
    backgroundColor: theme.backgroundColor,
    color: theme.textColor,
    fontFamily: theme.fontFamily,
    fontSize: `${theme.fontSize}px`,
    borderRadius: `${layout.borderRadius}px`,
    maxWidth: layout.type === 'wall' ? `${layout.maxWidth}px` : undefined,
    boxShadow: '0 -2px 16px rgba(0, 0, 0, 0.12)',
  };

  return (
    <div style={containerStyle} className="w-full overflow-hidden">
      {/* Header area */}
      <div className="px-6 pt-6 pb-2">
        {/* Optional logo */}
        {layout.showLogo && (
          <div className="flex items-center gap-2 mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.22.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
                fill={theme.primaryColor}
              />
            </svg>
          </div>
        )}

        {/* Title */}
        <h2
          className="font-semibold mb-3"
          style={{ color: theme.textColor, fontSize: `${theme.fontSize + 4}px`, lineHeight: '1.3' }}
        >
          {labels.firstLayerTitle}
        </h2>

        {/* Description */}
        <p
          className="leading-relaxed mb-1"
          style={{ color: theme.textColor, opacity: 0.75, fontSize: `${theme.fontSize}px`, lineHeight: '1.6' }}
        >
          {settings.firstLayerDescription}
        </p>

        {/* Read more link */}
        <button
          onClick={() => dispatch({ type: 'SET_PREVIEW_MODE', payload: 'second-layer' })}
          className="text-left font-medium mb-4 cursor-pointer hover:underline"
          style={{ color: theme.primaryColor, fontSize: `${theme.fontSize}px` }}
        >
          {labels.btnBannerReadMore}
        </button>
      </div>

      {/* Buttons */}
      <div className="px-6 pb-4 space-y-2">
        {/* Accept All — full-width filled primary */}
        <button
          onClick={() => dispatch({ type: 'ACCEPT_ALL' })}
          className="w-full py-3 px-4 font-semibold transition-opacity hover:opacity-90 cursor-pointer"
          style={{
            backgroundColor: theme.primaryColor,
            color: theme.primaryTextColor,
            borderRadius: `${Math.min(layout.borderRadius, 8)}px`,
            fontSize: `${theme.fontSize}px`,
          }}
        >
          {labels.btnAcceptAll}
        </button>

        {/* Deny — full-width outlined */}
        <button
          onClick={() => dispatch({ type: 'DENY_ALL' })}
          className="w-full py-3 px-4 font-semibold transition-opacity hover:opacity-80 cursor-pointer"
          style={{
            backgroundColor: 'transparent',
            color: theme.textColor,
            border: `1.5px solid ${theme.borderColor}`,
            borderRadius: `${Math.min(layout.borderRadius, 8)}px`,
            fontSize: `${theme.fontSize}px`,
          }}
        >
          {labels.btnDeny}
        </button>

        {/* More Information — text link style */}
        <button
          onClick={() => dispatch({ type: 'SET_PREVIEW_MODE', payload: 'second-layer' })}
          className="w-full py-2 px-4 font-medium transition-opacity hover:opacity-70 cursor-pointer"
          style={{
            backgroundColor: 'transparent',
            color: theme.primaryColor,
            fontSize: `${theme.fontSize - 1}px`,
          }}
        >
          {labels.btnMore}
        </button>
      </div>

      {/* Footer */}
      <div
        className="px-6 py-3 flex items-center justify-between"
        style={{ borderTop: `1px solid ${theme.borderColor}`, backgroundColor: theme.secondaryColor }}
      >
        <div className="flex items-center gap-3" style={{ fontSize: `${theme.fontSize - 2}px` }}>
          <a
            href={settings.privacyPolicyUrl}
            className="hover:underline"
            style={{ color: theme.textColor, opacity: 0.6 }}
            onClick={(e) => e.preventDefault()}
          >
            {labels.privacyPolicyLinkText}
          </a>
          <span style={{ color: theme.textColor, opacity: 0.25 }}>|</span>
          <a
            href={settings.imprintUrl}
            className="hover:underline"
            style={{ color: theme.textColor, opacity: 0.6 }}
            onClick={(e) => e.preventDefault()}
          >
            {labels.imprintLinkText}
          </a>
        </div>
        <div className="flex items-center gap-1.5" style={{ fontSize: `${theme.fontSize - 3}px`, color: theme.textColor, opacity: 0.35 }}>
          <svg width="14" height="14" viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 5C25.2 5 5 25.2 5 50s20.2 45 45 45 45-20.2 45-45S74.8 5 50 5zm0 82c-20.4 0-37-16.6-37-37s16.6-37 37-37 37 16.6 37 37-16.6 37-37 37z" />
            <path d="M50 20c-16.6 0-30 13.4-30 30s13.4 30 30 30 30-13.4 30-30-13.4-30-30-30zm0 52c-12.2 0-22-9.8-22-22s9.8-22 22-22 22 9.8 22 22-9.8 22-22 22z" />
            <circle cx="50" cy="50" r="12" />
          </svg>
          <span>Powered by Usercentrics</span>
        </div>
      </div>
    </div>
  );
}
