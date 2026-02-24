import type { BannerConfig } from '@/types/banner';

export function generateBannerCode(config: BannerConfig): string {
  const { theme, layout, content, categories } = config;

  return `import Usercentrics, { UI_LAYER, UI_VARIANT } from '@usercentrics/cmp-browser-sdk';

// Initialize Usercentrics SDK
const UC = new Usercentrics('${config.settingsId || 'YOUR_SETTINGS_ID'}');

async function initBanner() {
  const initialUIValues = await UC.init();

  // Get settings and categories from Usercentrics
  const settings = UC.getSettingsCore();
  const labels = UC.getSettingsLabels();
  const categories = UC.getCategories();

  // Determine what to show
  if (initialUIValues.variant === UI_VARIANT.DEFAULT) {
    switch (initialUIValues.initialLayer) {
      case UI_LAYER.FIRST_LAYER:
        showFirstLayer(categories);
        break;
      case UI_LAYER.PRIVACY_BUTTON:
        showPrivacyButton();
        break;
      case UI_LAYER.NONE:
        // No banner needed
        break;
    }
  }
}

// Banner Configuration
const bannerConfig = {
  theme: ${JSON.stringify(theme, null, 4)},
  layout: ${JSON.stringify(layout, null, 4)},
  content: ${JSON.stringify(content, null, 4)},
};

// Render the First Layer (main consent banner)
function showFirstLayer(categories) {
  const overlay = document.createElement('div');
  overlay.id = 'uc-banner-overlay';
  Object.assign(overlay.style, {
    position: 'fixed',
    inset: '0',
    zIndex: '99999',
    display: 'flex',
    alignItems: '${getAlignItems(layout.type)}',
    justifyContent: '${getJustifyContent(layout.type)}',
    padding: '24px',
    backgroundColor: \`\${bannerConfig.theme.overlayColor}\${Math.round(bannerConfig.theme.overlayOpacity * 255).toString(16).padStart(2, '0')}\`,
  });

  const banner = document.createElement('div');
  banner.id = 'uc-banner';
  Object.assign(banner.style, {
    backgroundColor: bannerConfig.theme.backgroundColor,
    color: bannerConfig.theme.textColor,
    fontFamily: bannerConfig.theme.fontFamily,
    fontSize: bannerConfig.theme.fontSize + 'px',
    borderRadius: bannerConfig.layout.borderRadius + 'px',
    maxWidth: ${layout.type.startsWith('bar') ? "'100%'" : `bannerConfig.layout.maxWidth + 'px'`},
    width: '100%',
    border: \`1px solid \${bannerConfig.theme.borderColor}\`,
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    overflow: 'hidden',
  });

  banner.innerHTML = \`
    <div style="padding: 24px 24px 12px;">
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
        ${layout.showLogo ? `<div style="display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 8px; background: \${bannerConfig.theme.primaryColor};">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="\${bannerConfig.theme.primaryTextColor}" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>` : ''}
        <h2 style="font-size: 1.125rem; font-weight: 600; color: \${bannerConfig.theme.textColor};">
          \${bannerConfig.content.title}
        </h2>
      </div>
      <p style="font-size: 0.875rem; line-height: 1.6; opacity: 0.8; color: \${bannerConfig.theme.textColor};">
        \${bannerConfig.content.description}
      </p>
    </div>

    <div style="padding: 12px 24px;">
      <div style="display: flex; flex-wrap: wrap; gap: 8px;">
        ${categories.map((cat) => `
        <span style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 9999px; font-size: 0.75rem; font-weight: 500; background: \${bannerConfig.theme.secondaryColor}; color: \${bannerConfig.theme.secondaryTextColor};">
          <span style="width: 6px; height: 6px; border-radius: 50%; background: ${cat.slug === 'essential' ? '${bannerConfig.theme.toggleActiveColor}' : '${bannerConfig.theme.toggleInactiveColor}'};"></span>
          ${cat.label} <span style="opacity: 0.5;">(${cat.services.length})</span>
        </span>`).join('')}
      </div>
    </div>

    <div style="padding: 12px 24px 24px; display: flex; flex-direction: column; gap: 8px;">
      <button id="uc-accept-all" style="width: 100%; padding: 10px 16px; border-radius: 8px; font-size: 0.875rem; font-weight: 600; border: none; cursor: pointer; background: \${bannerConfig.theme.primaryColor}; color: \${bannerConfig.theme.primaryTextColor};">
        \${bannerConfig.content.acceptAllLabel}
      </button>
      <div style="display: flex; gap: 8px;">
        <button id="uc-deny-all" style="flex: 1; padding: 10px 16px; border-radius: 8px; font-size: 0.875rem; font-weight: 500; border: none; cursor: pointer; background: \${bannerConfig.theme.secondaryColor}; color: \${bannerConfig.theme.secondaryTextColor};">
          \${bannerConfig.content.denyAllLabel}
        </button>
        <button id="uc-more-info" style="flex: 1; padding: 10px 16px; border-radius: 8px; font-size: 0.875rem; font-weight: 500; border: 1px solid \${bannerConfig.theme.primaryColor}; cursor: pointer; background: transparent; color: \${bannerConfig.theme.primaryColor};">
          \${bannerConfig.content.moreInfoLabel}
        </button>
      </div>
    </div>

    <div style="padding: 12px 24px; border-top: 1px solid \${bannerConfig.theme.borderColor}; display: flex; align-items: center; justify-content: center; gap: 16px; font-size: 0.75rem;">
      <a href="\${bannerConfig.content.privacyPolicyUrl}" style="opacity: 0.6; color: \${bannerConfig.theme.textColor}; text-decoration: none;">
        \${bannerConfig.content.privacyPolicyLabel}
      </a>
      <span style="opacity: 0.3;">|</span>
      <a href="\${bannerConfig.content.imprintUrl}" style="opacity: 0.6; color: \${bannerConfig.theme.textColor}; text-decoration: none;">
        \${bannerConfig.content.imprintLabel}
      </a>
      <span style="opacity: 0.3;">|</span>
      <span style="opacity: 0.4;">Powered by Usercentrics</span>
    </div>
  \`;

  overlay.appendChild(banner);
  document.body.appendChild(overlay);

  // Wire up event handlers
  document.getElementById('uc-accept-all').addEventListener('click', async () => {
    const categories = UC.acceptAllServices();
    removeBanner();
  });

  document.getElementById('uc-deny-all').addEventListener('click', async () => {
    const categories = UC.denyAllServices();
    removeBanner();
  });

  document.getElementById('uc-more-info').addEventListener('click', () => {
    removeBanner();
    showSecondLayer();
  });
}

function showSecondLayer() {
  const categories = UC.getCategories();
  // Implement second layer UI with per-service toggles
  // Use UC.updateServices(userDecisions) to save individual choices
  console.log('Show second layer with categories:', categories);
}

function showPrivacyButton() {
  const btn = document.createElement('button');
  btn.id = 'uc-privacy-button';
  Object.assign(btn.style, {
    position: 'fixed',
    bottom: '24px',
    left: '24px',
    zIndex: '99998',
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.75rem',
    backgroundColor: bannerConfig.theme.primaryColor,
    color: bannerConfig.theme.primaryTextColor,
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  });
  btn.textContent = 'Privacy Settings';
  btn.addEventListener('click', () => {
    btn.remove();
    const categories = UC.getCategories();
    showFirstLayer(categories);
  });
  document.body.appendChild(btn);
}

function removeBanner() {
  document.getElementById('uc-banner-overlay')?.remove();
}

// Initialize on page load
initBanner();
`;
}

function getAlignItems(type: string): string {
  switch (type) {
    case 'bar-bottom':
    case 'popup-bottom-left':
    case 'popup-bottom-right':
      return 'flex-end';
    case 'bar-top':
      return 'flex-start';
    default:
      return 'center';
  }
}

function getJustifyContent(type: string): string {
  switch (type) {
    case 'popup-bottom-left':
      return 'flex-start';
    case 'popup-bottom-right':
      return 'flex-end';
    default:
      return 'center';
  }
}

export function generateReactCode(config: BannerConfig): string {
  const { theme, layout, content } = config;

  return `import { useState, useEffect } from 'react';
import Usercentrics, { UI_LAYER, UI_VARIANT } from '@usercentrics/cmp-browser-sdk';

// Initialize SDK
const UC = new Usercentrics('${config.settingsId || 'YOUR_SETTINGS_ID'}');

interface ServiceConsent {
  id: string;
  name: string;
  consent: boolean;
  isEssential: boolean;
  description: string;
  category: string;
}

interface Category {
  id: string;
  label: string;
  slug: string;
  services: ServiceConsent[];
}

export function ConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [layer, setLayer] = useState<'first' | 'second'>('first');
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    UC.init().then((initialUIValues) => {
      if (initialUIValues.variant === UI_VARIANT.DEFAULT) {
        if (initialUIValues.initialLayer === UI_LAYER.FIRST_LAYER) {
          const cats = UC.getCategories();
          // Map UC categories to our format
          setCategories(cats);
          setVisible(true);
        }
      }
    });
  }, []);

  const handleAcceptAll = () => {
    UC.acceptAllServices();
    setVisible(false);
  };

  const handleDenyAll = () => {
    UC.denyAllServices();
    setVisible(false);
  };

  const handleSave = () => {
    const decisions = categories
      .flatMap(c => c.services)
      .map(s => ({ serviceId: s.id, status: s.consent }));
    UC.updateServices(decisions);
    setVisible(false);
  };

  const toggleService = (serviceId: string) => {
    setCategories(prev =>
      prev.map(cat => ({
        ...cat,
        services: cat.services.map(s =>
          s.id === serviceId && !s.isEssential
            ? { ...s, consent: !s.consent }
            : s
        ),
      }))
    );
  };

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      backgroundColor: '${theme.overlayColor}${Math.round(theme.overlayOpacity * 255).toString(16).padStart(2, '0')}',
    }}>
      <div style={{
        backgroundColor: '${theme.backgroundColor}',
        color: '${theme.textColor}',
        fontFamily: "${theme.fontFamily}",
        fontSize: ${theme.fontSize},
        borderRadius: ${layout.borderRadius},
        maxWidth: ${layout.maxWidth},
        width: '100%',
        border: '1px solid ${theme.borderColor}',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        overflow: 'hidden',
      }}>
        {layer === 'first' ? (
          <>
            <div style={{ padding: '24px 24px 12px' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: 12 }}>
                ${content.title}
              </h2>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.6, opacity: 0.8 }}>
                ${content.description}
              </p>
            </div>
            <div style={{ padding: '12px 24px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button
                onClick={handleAcceptAll}
                style={{
                  width: '100%', padding: '10px 16px', borderRadius: 8,
                  fontSize: '0.875rem', fontWeight: 600, border: 'none', cursor: 'pointer',
                  background: '${theme.primaryColor}', color: '${theme.primaryTextColor}',
                }}
              >
                ${content.acceptAllLabel}
              </button>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={handleDenyAll}
                  style={{
                    flex: 1, padding: '10px 16px', borderRadius: 8,
                    fontSize: '0.875rem', fontWeight: 500, border: 'none', cursor: 'pointer',
                    background: '${theme.secondaryColor}', color: '${theme.secondaryTextColor}',
                  }}
                >
                  ${content.denyAllLabel}
                </button>
                <button
                  onClick={() => setLayer('second')}
                  style={{
                    flex: 1, padding: '10px 16px', borderRadius: 8,
                    fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer',
                    background: 'transparent', color: '${theme.primaryColor}',
                    border: '1px solid ${theme.primaryColor}',
                  }}
                >
                  ${content.moreInfoLabel}
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div style={{ padding: '24px 24px 12px' }}>
              <button onClick={() => setLayer('first')}>Back</button>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>
                ${content.moreInfoLabel}
              </h2>
            </div>
            <div style={{ padding: '0 24px', maxHeight: 320, overflowY: 'auto' }}>
              {categories.map(cat => (
                <div key={cat.id} style={{ marginBottom: 12, border: '1px solid ${theme.borderColor}', borderRadius: 8 }}>
                  <div style={{ padding: 12, fontWeight: 500 }}>{cat.label}</div>
                  {cat.services.map(service => (
                    <div key={service.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px' }}>
                      <span>{service.name}</span>
                      <button
                        onClick={() => toggleService(service.id)}
                        disabled={service.isEssential}
                      >
                        {service.consent ? 'On' : 'Off'}
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div style={{ padding: '12px 24px 24px', display: 'flex', gap: 8 }}>
              <button onClick={handleAcceptAll} style={{ flex: 1, padding: '10px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', background: '${theme.primaryColor}', color: '${theme.primaryTextColor}' }}>
                ${content.acceptAllLabel}
              </button>
              <button onClick={handleSave} style={{ flex: 1, padding: '10px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', background: '${theme.secondaryColor}', color: '${theme.secondaryTextColor}' }}>
                ${content.saveLabel}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
`;
}
