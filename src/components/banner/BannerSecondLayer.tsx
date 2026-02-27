import { useBanner } from '@/context/BannerContext';
import { getServicesForCategory } from '@/types/banner';
import type { UCService, BannerTheme, UCLabels } from '@/types/banner';
import type { BannerAction } from '@/context/BannerContext';
import { Shield, ChevronLeft, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
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
    border: `1px solid ${theme.borderColor}`,
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
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
            {labels.secondLayerTitle}
          </h2>
        </div>
        <p className="text-sm leading-relaxed opacity-70" style={{ color: theme.textColor }}>
          {labels.secondLayerDescription}
        </p>
      </div>

      {/* Category / Services tabs */}
      <div className="px-6 flex gap-1 mb-3">
        <button
          onClick={() => setActiveTab('categories')}
          className="px-3 py-1.5 text-xs rounded-md transition-colors cursor-pointer"
          style={{
            backgroundColor: activeTab === 'categories' ? theme.primaryColor : theme.secondaryColor,
            color: activeTab === 'categories' ? theme.primaryTextColor : theme.secondaryTextColor,
          }}
        >
          {settings.secondLayer.tabsCategoriesLabel}
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className="px-3 py-1.5 text-xs rounded-md transition-colors cursor-pointer"
          style={{
            backgroundColor: activeTab === 'services' ? theme.primaryColor : theme.secondaryColor,
            color: activeTab === 'services' ? theme.primaryTextColor : theme.secondaryTextColor,
          }}
        >
          {settings.secondLayer.tabsServicesLabel}
        </button>
      </div>

      {/* Content */}
      <div className="px-6 max-h-[320px] overflow-y-auto">
        {activeTab === 'categories'
          ? categories.map((category) => {
              const catServices = getServicesForCategory(category, services);
              const isExpanded = expandedCategory === category.categorySlug;
              return (
                <div
                  key={category.categorySlug}
                  className="mb-3 rounded-lg overflow-hidden"
                  style={{ border: `1px solid ${theme.borderColor}`, backgroundColor: theme.secondaryColor }}
                >
                  <button
                    onClick={() => setExpandedCategory(isExpanded ? null : category.categorySlug)}
                    className="w-full flex items-center justify-between p-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium" style={{ color: theme.secondaryTextColor }}>
                        {category.label}
                      </span>
                      <span className="text-xs opacity-50" style={{ color: theme.secondaryTextColor }}>
                        {catServices.length} service{catServices.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    {isExpanded
                      ? <ChevronUp size={14} style={{ color: theme.secondaryTextColor, opacity: 0.5 }} />
                      : <ChevronDown size={14} style={{ color: theme.secondaryTextColor, opacity: 0.5 }} />}
                  </button>
                  {isExpanded && (
                    <div className="px-4 pb-4" style={{ borderTop: `1px solid ${theme.borderColor}` }}>
                      <p className="text-xs opacity-60 mt-3 mb-3" style={{ color: theme.secondaryTextColor }}>
                        {category.description}
                      </p>
                      {catServices.map((service) => (
                        <ServiceRow key={service.templateId} service={service} theme={theme} labels={labels} dispatch={dispatch} />
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
                  className="mb-3 rounded-lg overflow-hidden"
                  style={{ border: `1px solid ${theme.borderColor}`, backgroundColor: theme.secondaryColor }}
                >
                  <div className="flex items-center justify-between p-4">
                    <button
                      onClick={() => setExpandedService(isExpanded ? null : service.templateId)}
                      className="flex-1 flex items-center gap-3 cursor-pointer text-left"
                    >
                      <span className="text-sm font-medium" style={{ color: theme.secondaryTextColor }}>
                        {service.dataProcessor}
                      </span>
                      {isExpanded
                        ? <ChevronUp size={14} style={{ color: theme.secondaryTextColor, opacity: 0.5 }} />
                        : <ChevronDown size={14} style={{ color: theme.secondaryTextColor, opacity: 0.5 }} />}
                    </button>
                    <ToggleButton service={service} theme={theme} dispatch={dispatch} />
                  </div>
                  {isExpanded && <ServiceDetail service={service} theme={theme} labels={labels} />}
                </div>
              );
            })}
      </div>

      {/* Actions */}
      <div className="p-6 pt-3 flex gap-2">
        <button
          onClick={() => dispatch({ type: 'ACCEPT_ALL' })}
          className="flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90 cursor-pointer"
          style={{ backgroundColor: theme.primaryColor, color: theme.primaryTextColor }}
        >
          {settings.secondLayer.acceptButtonText}
        </button>
        <button
          onClick={() => dispatch({ type: 'DENY_ALL' })}
          className="flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-opacity hover:opacity-80 cursor-pointer"
          style={{ backgroundColor: theme.secondaryColor, color: theme.secondaryTextColor }}
        >
          {settings.secondLayer.denyButtonText}
        </button>
        <button
          onClick={() => dispatch({ type: 'SET_PREVIEW_MODE', payload: 'first-layer' })}
          className="flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-opacity hover:opacity-80 cursor-pointer"
          style={{ backgroundColor: 'transparent', color: theme.primaryColor, border: `1px solid ${theme.primaryColor}` }}
        >
          {labels.btnSave}
        </button>
      </div>

      {/* Footer */}
      <div
        className="px-6 py-3 flex items-center justify-center gap-4 text-xs"
        style={{ borderTop: `1px solid ${theme.borderColor}` }}
      >
        <a href={settings.privacyPolicyUrl} className="hover:underline opacity-60" style={{ color: theme.textColor }} onClick={(e) => e.preventDefault()}>
          {labels.privacyPolicyLinkText}
        </a>
        <span className="opacity-30">|</span>
        <a href={settings.imprintUrl} className="hover:underline opacity-60" style={{ color: theme.textColor }} onClick={(e) => e.preventDefault()}>
          {labels.imprintLinkText}
        </a>
        <span className="opacity-30">|</span>
        <span className="opacity-40">Powered by Usercentrics</span>
      </div>
    </div>
  );
}

function ServiceRow({ service, theme, labels, dispatch }: {
  service: UCService; theme: BannerTheme; labels: UCLabels; dispatch: React.Dispatch<BannerAction>;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="py-2">
      <div className="flex items-center justify-between">
        <button onClick={() => setExpanded(!expanded)} className="flex-1 pr-4 text-left cursor-pointer">
          <p className="text-sm font-medium" style={{ color: theme.secondaryTextColor }}>{service.dataProcessor}</p>
          <p className="text-xs opacity-60 mt-0.5" style={{ color: theme.secondaryTextColor }}>{service.descriptionOfService}</p>
        </button>
        <ToggleButton service={service} theme={theme} dispatch={dispatch} />
      </div>
      {expanded && <ServiceDetail service={service} theme={theme} labels={labels} />}
    </div>
  );
}

function ToggleButton({ service, theme, dispatch }: {
  service: UCService; theme: BannerTheme; dispatch: React.Dispatch<BannerAction>;
}) {
  return (
    <button
      onClick={() => dispatch({ type: 'TOGGLE_SERVICE_CONSENT', payload: service.templateId })}
      disabled={service.isEssential}
      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      style={{ backgroundColor: service.consent.status ? theme.toggleActiveColor : theme.toggleInactiveColor }}
    >
      <span
        className="inline-block h-4 w-4 rounded-full bg-white transition-transform shadow-sm"
        style={{ transform: service.consent.status ? 'translateX(22px)' : 'translateX(4px)' }}
      />
    </button>
  );
}

function ServiceDetail({ service, theme, labels }: {
  service: UCService; theme: BannerTheme; labels: UCLabels;
}) {
  const detailRows: { label: string; value: string | string[] }[] = [
    { label: labels.descriptionOfService, value: service.descriptionOfService },
    { label: labels.processingCompanyTitle, value: `${service.nameOfProcessingCompany}${service.addressOfProcessingCompany ? ', ' + service.addressOfProcessingCompany : ''}` },
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
    <div className="mt-2 pt-2 space-y-1.5" style={{ borderTop: `1px solid ${theme.borderColor}` }}>
      {detailRows.map(({ label, value }) => {
        if (!value || (Array.isArray(value) && value.length === 0)) return null;
        const displayValue = Array.isArray(value) ? value.join(', ') : value;
        return (
          <div key={label} className="text-xs">
            <span className="font-medium opacity-70" style={{ color: theme.secondaryTextColor }}>{label}: </span>
            <span className="opacity-60" style={{ color: theme.secondaryTextColor }}>{displayValue}</span>
          </div>
        );
      })}
      <div className="flex flex-wrap gap-3 pt-1">
        {service.privacyPolicyURL && service.privacyPolicyURL !== '#' && (
          <a href={service.privacyPolicyURL} className="inline-flex items-center gap-1 text-xs opacity-70" style={{ color: theme.primaryColor }} onClick={(e) => e.preventDefault()}>
            {labels.policyOf} {service.dataProcessor} <ExternalLink size={10} />
          </a>
        )}
        {service.cookiePolicyURL && service.cookiePolicyURL !== '#' && (
          <a href={service.cookiePolicyURL} className="inline-flex items-center gap-1 text-xs opacity-70" style={{ color: theme.primaryColor }} onClick={(e) => e.preventDefault()}>
            {labels.cookiePolicyInfo} <ExternalLink size={10} />
          </a>
        )}
        {service.optOutUrl && (
          <a href={service.optOutUrl} className="inline-flex items-center gap-1 text-xs opacity-70" style={{ color: theme.primaryColor }} onClick={(e) => e.preventDefault()}>
            {labels.optOut} <ExternalLink size={10} />
          </a>
        )}
      </div>
    </div>
  );
}
