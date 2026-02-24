import { useBanner } from '@/context/BannerContext';
import { Shield, ChevronLeft, Info } from 'lucide-react';
import { useState } from 'react';

export function BannerSecondLayer() {
  const { state, dispatch } = useBanner();
  const { theme, content, layout, categories } = state.config;
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const containerStyle: React.CSSProperties = {
    backgroundColor: theme.backgroundColor,
    color: theme.textColor,
    fontFamily: theme.fontFamily,
    fontSize: `${theme.fontSize}px`,
    borderRadius: `${layout.borderRadius}px`,
    maxWidth: `${layout.maxWidth}px`,
    border: `1px solid ${theme.borderColor}`,
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  };

  const handleToggle = (serviceId: string) => {
    dispatch({ type: 'TOGGLE_SERVICE_CONSENT', payload: serviceId });
  };

  const handleSave = () => {
    dispatch({ type: 'SET_PREVIEW_MODE', payload: 'first-layer' });
  };

  return (
    <div style={containerStyle} className="w-full overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-3">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => dispatch({ type: 'SET_PREVIEW_MODE', payload: 'first-layer' })}
            className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors cursor-pointer"
            style={{ backgroundColor: theme.secondaryColor }}
          >
            <ChevronLeft size={16} style={{ color: theme.secondaryTextColor }} />
          </button>
          {layout.showLogo && (
            <div
              className="flex items-center justify-center w-10 h-10 rounded-lg"
              style={{ backgroundColor: theme.primaryColor }}
            >
              <Shield size={20} style={{ color: theme.primaryTextColor }} />
            </div>
          )}
          <h2 className="text-lg font-semibold" style={{ color: theme.textColor }}>
            {content.moreInfoLabel}
          </h2>
        </div>
        <p
          className="text-sm leading-relaxed opacity-70"
          style={{ color: theme.textColor }}
        >
          Manage your cookie preferences for each category below.
        </p>
      </div>

      {/* Categories list */}
      <div className="px-6 max-h-[320px] overflow-y-auto">
        {categories.map((category) => (
          <div
            key={category.id}
            className="mb-3 rounded-lg overflow-hidden"
            style={{
              border: `1px solid ${theme.borderColor}`,
              backgroundColor: theme.secondaryColor,
            }}
          >
            {/* Category header */}
            <button
              onClick={() =>
                setExpandedCategory(
                  expandedCategory === category.id ? null : category.id
                )
              }
              className="w-full flex items-center justify-between p-4 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span
                  className="text-sm font-medium"
                  style={{ color: theme.secondaryTextColor }}
                >
                  {category.label}
                </span>
                <span className="text-xs opacity-50" style={{ color: theme.secondaryTextColor }}>
                  {category.services.length} service{category.services.length !== 1 ? 's' : ''}
                </span>
              </div>
              <Info size={14} style={{ color: theme.secondaryTextColor, opacity: 0.5 }} />
            </button>

            {/* Expanded services */}
            {expandedCategory === category.id && (
              <div
                className="px-4 pb-4"
                style={{ borderTop: `1px solid ${theme.borderColor}` }}
              >
                <p className="text-xs opacity-60 mt-3 mb-3" style={{ color: theme.secondaryTextColor }}>
                  {category.description}
                </p>
                {category.services.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex-1 pr-4">
                      <p className="text-sm font-medium" style={{ color: theme.secondaryTextColor }}>
                        {service.name}
                      </p>
                      <p className="text-xs opacity-60 mt-0.5" style={{ color: theme.secondaryTextColor }}>
                        {service.description}
                      </p>
                    </div>
                    {/* Toggle */}
                    <button
                      onClick={() => handleToggle(service.id)}
                      disabled={service.isEssential}
                      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{
                        backgroundColor: service.consent
                          ? theme.toggleActiveColor
                          : theme.toggleInactiveColor,
                      }}
                    >
                      <span
                        className="inline-block h-4 w-4 rounded-full bg-white transition-transform shadow-sm"
                        style={{
                          transform: service.consent
                            ? 'translateX(22px)'
                            : 'translateX(4px)',
                        }}
                      />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="p-6 pt-3 flex gap-2">
        <button
          onClick={() => dispatch({ type: 'ACCEPT_ALL' })}
          className="flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90 cursor-pointer"
          style={{
            backgroundColor: theme.primaryColor,
            color: theme.primaryTextColor,
          }}
        >
          {content.acceptAllLabel}
        </button>
        <button
          onClick={handleSave}
          className="flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-opacity hover:opacity-80 cursor-pointer"
          style={{
            backgroundColor: theme.secondaryColor,
            color: theme.secondaryTextColor,
          }}
        >
          {content.saveLabel}
        </button>
      </div>

      {/* Footer */}
      <div
        className="px-6 py-3 flex items-center justify-center gap-4 text-xs"
        style={{ borderTop: `1px solid ${theme.borderColor}` }}
      >
        <a
          href={content.privacyPolicyUrl}
          className="hover:underline opacity-60"
          style={{ color: theme.textColor }}
          onClick={(e) => e.preventDefault()}
        >
          {content.privacyPolicyLabel}
        </a>
        <span className="opacity-30">|</span>
        <a
          href={content.imprintUrl}
          className="hover:underline opacity-60"
          style={{ color: theme.textColor }}
          onClick={(e) => e.preventDefault()}
        >
          {content.imprintLabel}
        </a>
        <span className="opacity-30">|</span>
        <span className="opacity-40">Powered by Usercentrics</span>
      </div>
    </div>
  );
}
