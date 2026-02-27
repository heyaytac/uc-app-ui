import type { BannerConfig } from '@/types/banner';

/**
 * Generates Vanilla JS code using UsercentricsCore SDK
 * Uses: getCMPData(), acceptAll(), denyAll(), saveDecisions(), track()
 */
export function generateBannerCode(config: BannerConfig): string {
  const { theme, layout } = config;

  return `// Custom CMP Banner using UsercentricsCore SDK
// Ref: https://usercentrics.com/docs/apps/features/build_own_ui/
//
// Install: npm install @usercentrics/cmp-browser-sdk

import UsercentricsCore from '@usercentrics/cmp-browser-sdk';

// ─── Banner Theme & Layout ───────────────────────────────────────
const bannerConfig = {
  theme: ${JSON.stringify(theme, null, 4)},
  layout: ${JSON.stringify(layout, null, 4)},
};

// ─── Initialize UsercentricsCore ─────────────────────────────────
UsercentricsCore.configure('${config.settingsId || 'YOUR_SETTINGS_ID'}');

UsercentricsCore.isReady(
  function onReady() {
    // getCMPData() returns { settings, services, categories, legalBasis }
    const data = UsercentricsCore.getCMPData();
    const settings = data.settings;
    const services = data.services;
    const categories = data.categories;

    // Match categories and services: category.slug == service.categorySlug
    const categoriesWithServices = categories.map(cat => ({
      ...cat,
      services: services.filter(s => s.categorySlug === cat.categorySlug),
    }));

    showFirstLayer(settings, categoriesWithServices, services);

    // Track analytics: CMP_SHOWN
    UsercentricsCore.track({ event: 'CMP_SHOWN' });
  },
  function onFailure(error) {
    console.error('UsercentricsCore init failed:', error);
  }
);

// ─── First Layer ─────────────────────────────────────────────────
function showFirstLayer(settings, categoriesWithServices, allServices) {
  const labels = settings.labels;
  const overlay = document.createElement('div');
  overlay.id = 'uc-banner-overlay';
  Object.assign(overlay.style, {
    position: 'fixed', inset: '0', zIndex: '99999',
    display: 'flex',
    alignItems: '${getAlignItems(layout.type)}',
    justifyContent: '${getJustifyContent(layout.type)}',
    padding: '24px',
  });

  const banner = document.createElement('div');
  banner.id = 'uc-banner';
  Object.assign(banner.style, {
    backgroundColor: bannerConfig.theme.backgroundColor,
    color: bannerConfig.theme.textColor,
    fontFamily: bannerConfig.theme.fontFamily,
    fontSize: bannerConfig.theme.fontSize + 'px',
    borderRadius: bannerConfig.layout.borderRadius + 'px',
    maxWidth: '${layout.type.startsWith('bar') ? '100%' : layout.maxWidth + 'px'}',
    width: '100%',
    border: '1px solid ' + bannerConfig.theme.borderColor,
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
    overflow: 'hidden',
  });

  banner.innerHTML = \`
    <div style="padding: 24px 24px 12px;">
      <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 8px;">
        \${labels.firstLayerTitle}
      </h2>
      <p style="font-size: 0.875rem; line-height: 1.6; opacity: 0.8;">
        \${settings.firstLayerDescription}
      </p>
    </div>
    <div style="padding: 12px 24px 24px; display: flex; flex-direction: column; gap: 8px;">
      <button id="uc-accept-all" style="width: 100%; padding: 10px 16px; border-radius: 8px;
        font-weight: 600; border: none; cursor: pointer;
        background: \${bannerConfig.theme.primaryColor};
        color: \${bannerConfig.theme.primaryTextColor};">
        \${labels.btnAcceptAll}
      </button>
      <div style="display: flex; gap: 8px;">
        <button id="uc-deny-all" style="flex: 1; padding: 10px 16px; border-radius: 8px;
          border: none; cursor: pointer;
          background: \${bannerConfig.theme.secondaryColor};
          color: \${bannerConfig.theme.secondaryTextColor};">
          \${labels.btnDeny}
        </button>
        <button id="uc-more-info" style="flex: 1; padding: 10px 16px; border-radius: 8px;
          cursor: pointer; background: transparent;
          color: \${bannerConfig.theme.primaryColor};
          border: 1px solid \${bannerConfig.theme.primaryColor};">
          \${labels.btnMore}
        </button>
      </div>
    </div>
  \`;

  overlay.appendChild(banner);
  document.body.appendChild(overlay);

  // ─── Action Delegates ──────────────────────────────────────
  // acceptAll(consentType) -> returns consents array
  document.getElementById('uc-accept-all').addEventListener('click', () => {
    const consents = UsercentricsCore.acceptAll('EXPLICIT');
    UsercentricsCore.track({ event: 'ACCEPT_ALL_FIRST_LAYER' });
    applyConsents(consents);
    removeBanner();
  });

  // denyAll(consentType) -> returns consents array
  document.getElementById('uc-deny-all').addEventListener('click', () => {
    const consents = UsercentricsCore.denyAll('EXPLICIT');
    UsercentricsCore.track({ event: 'DENY_ALL_FIRST_LAYER' });
    applyConsents(consents);
    removeBanner();
  });

  document.getElementById('uc-more-info').addEventListener('click', () => {
    UsercentricsCore.track({ event: 'MORE_INFORMATION_LINK' });
    removeBanner();
    // Show second layer with per-service toggles
    // Use saveDecisions(decisions, 'EXPLICIT') to save granular choices
  });
}

// ─── Apply Consent ───────────────────────────────────────────────
function applyConsents(consents) {
  consents.forEach(consent => {
    console.log('Service ' + consent.templateId + ': consent=' + consent.status);
    // Apply consent to your 3rd party SDKs here
  });
}

function removeBanner() {
  document.getElementById('uc-banner-overlay')?.remove();
}
`;
}

/**
 * Generates React component using UsercentricsCore SDK
 */
export function generateReactCode(config: BannerConfig): string {
  const { theme, layout } = config;

  return `import { useState, useEffect, useCallback } from 'react';
import UsercentricsCore from '@usercentrics/cmp-browser-sdk';

// ─── Types (from UsercentricsCore.getCMPData()) ──────────────────
interface UCService {
  templateId: string;
  dataProcessor: string;
  descriptionOfService: string;
  categorySlug: string;
  isEssential: boolean;
  consent: { status: boolean };
}

interface UCCategory {
  categorySlug: string;
  label: string;
}

// ─── Configure SDK ───────────────────────────────────────────────
UsercentricsCore.configure('${config.settingsId || 'YOUR_SETTINGS_ID'}');

export function ConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [layer, setLayer] = useState<'first' | 'second'>('first');
  const [services, setServices] = useState<UCService[]>([]);
  const [categories, setCategories] = useState<UCCategory[]>([]);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    UsercentricsCore.isReady(
      () => {
        const data = UsercentricsCore.getCMPData();
        setSettings(data.settings);
        setServices(data.services);
        setCategories(data.categories);
        setVisible(true);
        UsercentricsCore.track({ event: 'CMP_SHOWN' });
      },
      (err) => console.error('UC init failed:', err)
    );
  }, []);

  const handleAcceptAll = useCallback((fromLayer: 'first' | 'second') => {
    const consents = UsercentricsCore.acceptAll('EXPLICIT');
    UsercentricsCore.track({
      event: fromLayer === 'first' ? 'ACCEPT_ALL_FIRST_LAYER' : 'ACCEPT_ALL_SECOND_LAYER',
    });
    applyConsents(consents);
    setVisible(false);
  }, []);

  const handleDenyAll = useCallback((fromLayer: 'first' | 'second') => {
    const consents = UsercentricsCore.denyAll('EXPLICIT');
    UsercentricsCore.track({
      event: fromLayer === 'first' ? 'DENY_ALL_FIRST_LAYER' : 'DENY_ALL_SECOND_LAYER',
    });
    applyConsents(consents);
    setVisible(false);
  }, []);

  const handleSave = useCallback(() => {
    const decisions = services.map(s => ({
      serviceId: s.templateId,
      consent: s.consent.status,
    }));
    const consents = UsercentricsCore.saveDecisions(decisions, 'EXPLICIT');
    UsercentricsCore.track({ event: 'SAVE_SECOND_LAYER' });
    applyConsents(consents);
    setVisible(false);
  }, [services]);

  const toggleService = (templateId: string) => {
    setServices(prev =>
      prev.map(s =>
        s.templateId === templateId && !s.isEssential
          ? { ...s, consent: { ...s.consent, status: !s.consent.status } }
          : s
      )
    );
  };

  if (!visible || !settings) return null;

  const { labels } = settings;
  const getServicesForCat = (cat: UCCategory) =>
    services.filter(s => s.categorySlug === cat.categorySlug);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
      backgroundColor: '${theme.overlayColor}80',
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
                {labels.firstLayerTitle}
              </h2>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.6, opacity: 0.8 }}>
                {settings.firstLayerDescription}
              </p>
            </div>
            <div style={{ padding: '12px 24px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button onClick={() => handleAcceptAll('first')} style={{
                width: '100%', padding: '10px 16px', borderRadius: 8,
                fontWeight: 600, border: 'none', cursor: 'pointer',
                background: '${theme.primaryColor}', color: '${theme.primaryTextColor}',
              }}>{labels.btnAcceptAll}</button>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => handleDenyAll('first')} style={{
                  flex: 1, padding: '10px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
                  background: '${theme.secondaryColor}', color: '${theme.secondaryTextColor}',
                }}>{labels.btnDeny}</button>
                <button onClick={() => {
                  setLayer('second');
                  UsercentricsCore.track({ event: 'MORE_INFORMATION_LINK' });
                }} style={{
                  flex: 1, padding: '10px 16px', borderRadius: 8, cursor: 'pointer',
                  background: 'transparent', color: '${theme.primaryColor}',
                  border: '1px solid ${theme.primaryColor}',
                }}>{labels.btnMore}</button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div style={{ padding: '24px 24px 12px' }}>
              <button onClick={() => setLayer('first')}>Back</button>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginTop: 8 }}>
                {labels.secondLayerTitle}
              </h2>
            </div>
            <div style={{ padding: '0 24px', maxHeight: 320, overflowY: 'auto' }}>
              {categories.map(cat => (
                <div key={cat.categorySlug} style={{ marginBottom: 12, border: '1px solid ${theme.borderColor}', borderRadius: 8 }}>
                  <div style={{ padding: 12, fontWeight: 500 }}>{cat.label}</div>
                  {getServicesForCat(cat).map(svc => (
                    <div key={svc.templateId} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px' }}>
                      <span>{svc.dataProcessor}</span>
                      <button onClick={() => toggleService(svc.templateId)} disabled={svc.isEssential}>
                        {svc.consent.status ? 'On' : 'Off'}
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div style={{ padding: '12px 24px 24px', display: 'flex', gap: 8 }}>
              <button onClick={() => handleAcceptAll('second')} style={{ flex: 1, padding: '10px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', background: '${theme.primaryColor}', color: '${theme.primaryTextColor}' }}>
                {settings.secondLayer.acceptButtonText}
              </button>
              <button onClick={handleSave} style={{ flex: 1, padding: '10px 16px', borderRadius: 8, cursor: 'pointer', background: 'transparent', color: '${theme.primaryColor}', border: '1px solid ${theme.primaryColor}' }}>
                {labels.btnSave}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function applyConsents(consents: Array<{ templateId: string; status: boolean }>) {
  consents.forEach(c => {
    console.log('Service ' + c.templateId + ': consent=' + c.status);
  });
}
`;
}

function getAlignItems(type: string): string {
  switch (type) {
    case 'bar-bottom': case 'popup-bottom-left': case 'popup-bottom-right': return 'flex-end';
    case 'bar-top': return 'flex-start';
    default: return 'center';
  }
}

function getJustifyContent(type: string): string {
  switch (type) {
    case 'popup-bottom-left': return 'flex-start';
    case 'popup-bottom-right': return 'flex-end';
    default: return 'center';
  }
}
