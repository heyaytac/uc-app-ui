import { useBanner } from '@/context/BannerContext';
import { getServicesForCategory } from '@/types/banner';
import type { UCService, BannerTheme, UCLabels } from '@/types/banner';
import type { BannerAction } from '@/context/BannerContext';
import { ChevronDown, ChevronUp, ExternalLink, X } from 'lucide-react';
import { useState } from 'react';

export function BannerSecondLayer() {
  const { state, dispatch } = useBanner();
  const { theme, settings, layout, categories, services } = state.config;
  const { labels } = settings;
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'categories' | 'services'>('categories');

  const containerStyle: React.CSSProperties = {
    backgroundColor: theme.backgroundColor,
    color: theme.textColor,
    fontFamily: theme.fontFamily,
    fontSize: `${theme.fontSize}px`,
    borderRadius: `${layout.borderRadius}px`,
    maxWidth: `${layout.maxWidth}px`,
    boxShadow: '0 4px 32px rgba(0, 0, 0, 0.18)',
  };

  const tabStyle = (isActive: boolean): React.CSSProperties => ({
    color: isActive ? theme.primaryColor : theme.textColor,
    borderBottom: isActive ? `2px solid ${theme.primaryColor}` : '2px solid transparent',
    opacity: isActive ? 1 : 0.55,
    fontWeight: isActive ? 600 : 400,
    fontSize: `${theme.fontSize}px`,
    paddingBottom: '10px',
  });

  return (
    <div style={containerStyle} className="w-full overflow-hidden flex flex-col" role="dialog" aria-label="Privacy Settings">
      {/* Header */}
      <div className="px-6 pt-5 pb-0">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold" style={{ color: theme.textColor, fontSize: `${theme.fontSize + 4}px` }}>
            {labels.secondLayerTitle}
          </h2>
          {layout.showCloseButton && (
            <button
              onClick={() => dispatch({ type: 'SET_PREVIEW_MODE', payload: 'first-layer' })}
              className="p-1 rounded-md transition-colors cursor-pointer hover:opacity-70"
              style={{ color: theme.textColor }}
            >
              <X size={18} />
            </button>
          )}
        </div>
        <p
          className="leading-relaxed mb-4"
          style={{ color: theme.textColor, opacity: 0.65, fontSize: `${theme.fontSize - 1}px`, lineHeight: '1.6' }}
        >
          {labels.secondLayerDescription}
        </p>

        {/* Tabs — underline style like UC V3 */}
        <div className="flex gap-6" style={{ borderBottom: `1px solid ${theme.borderColor}` }}>
          <button onClick={() => setActiveTab('categories')} className="cursor-pointer pb-0" style={tabStyle(activeTab === 'categories')}>
            {settings.secondLayer.tabsCategoriesLabel}
          </button>
          <button onClick={() => setActiveTab('services')} className="cursor-pointer pb-0" style={tabStyle(activeTab === 'services')}>
            {settings.secondLayer.tabsServicesLabel}
          </button>
        </div>
      </div>

      {/* Content — scrollable */}
      <div className="px-6 py-4 flex-1 overflow-y-auto max-h-[380px]">
        {activeTab === 'categories'
          ? categories.map((category) => {
              const catServices = getServicesForCategory(category, services);
              const isExpanded = expandedCategory === category.categorySlug;
              const allConsented = catServices.every((s) => s.consent.status);
              const isEssentialCategory = category.categorySlug === 'essential';
              return (
                <div
                  key={category.categorySlug}
                  className="mb-2 overflow-hidden"
                  style={{
                    borderRadius: `${Math.min(layout.borderRadius, 8)}px`,
                    border: `1px solid ${theme.borderColor}`,
                  }}
                >
                  {/* Category header row */}
                  <div
                    className="flex items-center justify-between px-4 py-3.5"
                    style={{ backgroundColor: theme.secondaryColor }}
                  >
                    <button
                      onClick={() => setExpandedCategory(isExpanded ? null : category.categorySlug)}
                      className="flex-1 flex items-center gap-2 cursor-pointer text-left"
                    >
                      {isExpanded
                        ? <ChevronUp size={16} style={{ color: theme.textColor, opacity: 0.4 }} />
                        : <ChevronDown size={16} style={{ color: theme.textColor, opacity: 0.4 }} />}
                      <span className="font-medium" style={{ color: theme.textColor, fontSize: `${theme.fontSize}px` }}>
                        {category.label}
                      </span>
                      <span style={{ color: theme.textColor, opacity: 0.4, fontSize: `${theme.fontSize - 2}px` }}>
                        ({catServices.length})
                      </span>
                    </button>
                    {/* Category-level toggle */}
                    <ToggleSwitch
                      checked={allConsented}
                      disabled={isEssentialCategory}
                      theme={theme}
                      onChange={() => {
                        catServices.forEach((s) => {
                          if (!s.isEssential && s.consent.status !== !allConsented) {
                            dispatch({ type: 'TOGGLE_SERVICE_CONSENT', payload: s.templateId });
                          }
                        });
                      }}
                    />
                  </div>

                  {/* Expanded services */}
                  {isExpanded && (
                    <div style={{ borderTop: `1px solid ${theme.borderColor}` }}>
                      <div className="px-4 py-3">
                        <p style={{ color: theme.textColor, opacity: 0.55, fontSize: `${theme.fontSize - 1}px`, lineHeight: '1.5' }}>
                          {category.description}
                        </p>
                      </div>
                      {catServices.map((service, i) => (
                        <ServiceRow
                          key={service.templateId}
                          service={service}
                          theme={theme}
                          labels={labels}
                          dispatch={dispatch}
                          isLast={i === catServices.length - 1}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          : services.map((service) => {
              const isExpanded = expandedService === service.templateId;
              return (
                <div
                  key={service.templateId}
                  className="mb-2 overflow-hidden"
                  style={{
                    borderRadius: `${Math.min(layout.borderRadius, 8)}px`,
                    border: `1px solid ${theme.borderColor}`,
                  }}
                >
                  <div
                    className="flex items-center justify-between px-4 py-3.5"
                    style={{ backgroundColor: theme.secondaryColor }}
                  >
                    <button
                      onClick={() => setExpandedService(isExpanded ? null : service.templateId)}
                      className="flex-1 flex items-center gap-2 cursor-pointer text-left"
                    >
                      {isExpanded
                        ? <ChevronUp size={16} style={{ color: theme.textColor, opacity: 0.4 }} />
                        : <ChevronDown size={16} style={{ color: theme.textColor, opacity: 0.4 }} />}
                      <span className="font-medium" style={{ color: theme.textColor, fontSize: `${theme.fontSize}px` }}>
                        {service.dataProcessor}
                      </span>
                    </button>
                    <ToggleSwitch
                      checked={service.consent.status}
                      disabled={service.isEssential}
                      theme={theme}
                      onChange={() => dispatch({ type: 'TOGGLE_SERVICE_CONSENT', payload: service.templateId })}
                    />
                  </div>
                  {isExpanded && (
                    <div style={{ borderTop: `1px solid ${theme.borderColor}` }}>
                      <ServiceDetail service={service} theme={theme} labels={labels} />
                    </div>
                  )}
                </div>
              );
            })}
      </div>

      {/* Bottom action bar */}
      <div
        className="px-6 py-4 flex gap-2"
        style={{ borderTop: `1px solid ${theme.borderColor}` }}
      >
        <button
          onClick={() => dispatch({ type: 'ACCEPT_ALL' })}
          className="flex-1 py-2.5 px-3 font-semibold transition-opacity hover:opacity-90 cursor-pointer"
          style={{
            backgroundColor: theme.primaryColor,
            color: theme.primaryTextColor,
            borderRadius: `${Math.min(layout.borderRadius, 6)}px`,
            fontSize: `${theme.fontSize - 1}px`,
          }}
        >
          {settings.secondLayer.acceptButtonText}
        </button>
        <button
          onClick={() => dispatch({ type: 'DENY_ALL' })}
          className="flex-1 py-2.5 px-3 font-semibold transition-opacity hover:opacity-80 cursor-pointer"
          style={{
            backgroundColor: 'transparent',
            color: theme.textColor,
            border: `1.5px solid ${theme.borderColor}`,
            borderRadius: `${Math.min(layout.borderRadius, 6)}px`,
            fontSize: `${theme.fontSize - 1}px`,
          }}
        >
          {settings.secondLayer.denyButtonText}
        </button>
        <button
          onClick={() => dispatch({ type: 'SET_PREVIEW_MODE', payload: 'first-layer' })}
          className="flex-1 py-2.5 px-3 font-semibold transition-opacity hover:opacity-80 cursor-pointer"
          style={{
            backgroundColor: theme.primaryColor,
            color: theme.primaryTextColor,
            opacity: 0.85,
            borderRadius: `${Math.min(layout.borderRadius, 6)}px`,
            fontSize: `${theme.fontSize - 1}px`,
          }}
        >
          {labels.btnSave}
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

/* ------------------------------------------------------------------ */
/* Toggle Switch — styled like UC V3 (rounded pill with circle knob)  */
/* ------------------------------------------------------------------ */

function ToggleSwitch({ checked, disabled, theme, onChange }: {
  checked: boolean;
  disabled: boolean;
  theme: BannerTheme;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      disabled={disabled}
      className="relative inline-flex items-center shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      style={{
        width: '44px',
        height: '24px',
        borderRadius: '12px',
        backgroundColor: checked ? theme.toggleActiveColor : theme.toggleInactiveColor,
      }}
      role="switch"
      aria-checked={checked}
    >
      <span
        className="inline-block rounded-full bg-white shadow-sm transition-transform"
        style={{
          width: '18px',
          height: '18px',
          transform: checked ? 'translateX(23px)' : 'translateX(3px)',
        }}
      />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Service Row — compact service entry within a category               */
/* ------------------------------------------------------------------ */

function ServiceRow({ service, theme, labels, dispatch, isLast }: {
  service: UCService;
  theme: BannerTheme;
  labels: UCLabels;
  dispatch: React.Dispatch<BannerAction>;
  isLast: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className="px-4"
      style={{ borderTop: `1px solid ${theme.borderColor}` }}
    >
      <div className="flex items-center justify-between py-3">
        <button onClick={() => setExpanded(!expanded)} className="flex-1 pr-4 text-left cursor-pointer flex items-center gap-2">
          {expanded
            ? <ChevronUp size={14} style={{ color: theme.textColor, opacity: 0.3 }} />
            : <ChevronDown size={14} style={{ color: theme.textColor, opacity: 0.3 }} />}
          <div>
            <p className="font-medium" style={{ color: theme.textColor, fontSize: `${theme.fontSize - 1}px` }}>
              {service.dataProcessor}
            </p>
            <p style={{ color: theme.textColor, opacity: 0.45, fontSize: `${theme.fontSize - 2}px`, marginTop: '1px' }}>
              {service.nameOfProcessingCompany}
            </p>
          </div>
        </button>
        <ToggleSwitch
          checked={service.consent.status}
          disabled={service.isEssential}
          theme={theme}
          onChange={() => dispatch({ type: 'TOGGLE_SERVICE_CONSENT', payload: service.templateId })}
        />
      </div>
      {expanded && <ServiceDetail service={service} theme={theme} labels={labels} />}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Service Detail — full data processing info (like UC second layer)   */
/* ------------------------------------------------------------------ */

function ServiceDetail({ service, theme, labels }: {
  service: UCService;
  theme: BannerTheme;
  labels: UCLabels;
}) {
  const detailRows: { label: string; value: string | string[] }[] = [
    { label: labels.descriptionOfService, value: service.descriptionOfService },
    {
      label: labels.processingCompanyTitle,
      value: `${service.nameOfProcessingCompany}${service.addressOfProcessingCompany ? '\n' + service.addressOfProcessingCompany : ''}`,
    },
    { label: labels.dataPurposes, value: service.dataPurposesList },
    { label: labels.technologiesUsed, value: service.technologyUsed },
    { label: labels.dataCollectedList, value: service.dataCollectedList },
    { label: labels.legalBasisList, value: service.legalBasisList },
    { label: labels.locationOfProcessing, value: service.locationOfProcessing },
    { label: labels.retentionPeriod, value: service.retentionPeriodDescription },
    { label: labels.transferToThirdCountries, value: service.thirdCountryTransfer },
    { label: labels.dataRecipientsList, value: service.dataRecipientsList },
  ];

  return (
    <div className="pb-4 space-y-3">
      {/* Detail grid — each row is label + value like a definition list */}
      <div className="space-y-2">
        {detailRows.map(({ label, value }) => {
          if (!value || (Array.isArray(value) && value.length === 0)) return null;
          const displayValue = Array.isArray(value) ? value.join(', ') : value;
          return (
            <div key={label} style={{ fontSize: `${theme.fontSize - 2}px` }}>
              <div className="font-medium mb-0.5" style={{ color: theme.textColor, opacity: 0.55 }}>
                {label}
              </div>
              <div style={{ color: theme.textColor, opacity: 0.8, whiteSpace: 'pre-line' }}>
                {displayValue}
              </div>
            </div>
          );
        })}
      </div>

      {/* External links */}
      <div className="flex flex-wrap gap-4 pt-1">
        {service.privacyPolicyURL && service.privacyPolicyURL !== '#' && (
          <a
            href={service.privacyPolicyURL}
            className="inline-flex items-center gap-1 hover:underline"
            style={{ color: theme.primaryColor, fontSize: `${theme.fontSize - 2}px` }}
            onClick={(e) => e.preventDefault()}
          >
            {labels.policyOf} {service.dataProcessor} <ExternalLink size={11} />
          </a>
        )}
        {service.cookiePolicyURL && service.cookiePolicyURL !== '#' && (
          <a
            href={service.cookiePolicyURL}
            className="inline-flex items-center gap-1 hover:underline"
            style={{ color: theme.primaryColor, fontSize: `${theme.fontSize - 2}px` }}
            onClick={(e) => e.preventDefault()}
          >
            {labels.cookiePolicyInfo} <ExternalLink size={11} />
          </a>
        )}
        {service.optOutUrl && (
          <a
            href={service.optOutUrl}
            className="inline-flex items-center gap-1 hover:underline"
            style={{ color: theme.primaryColor, fontSize: `${theme.fontSize - 2}px` }}
            onClick={(e) => e.preventDefault()}
          >
            {labels.optOut} <ExternalLink size={11} />
          </a>
        )}
      </div>
    </div>
  );
}
