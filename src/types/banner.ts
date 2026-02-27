// ============================================================
// Types aligned with UsercentricsCore SDK (getCMPData)
// Ref: https://usercentrics.com/docs/apps/features/build_own_ui/
// ============================================================

// --- SDK Data Model (mirrors UsercentricsCore.getCMPData()) ---

export interface UCCMPData {
  settings: UCSettings;
  services: UCService[];
  categories: UCCategory[];
  legalBasis: UCLegalBasis;
}

export interface UCSettings {
  labels: UCLabels;
  secondLayer: UCSecondLayerSettings;
  language: string;
  languagesAvailable: string[];
  privacyPolicyUrl: string;
  imprintUrl: string;
  firstLayerDescriptionHtml: string;
  firstLayerDescription: string;
  firstLayerMobileDescriptionHtml: string;
  firstLayerMobileDescription: string;
}

export interface UCLabels {
  firstLayerTitle: string;
  secondLayerTitle: string;
  secondLayerDescriptionHtml: string;
  secondLayerDescription: string;
  btnAcceptAll: string;
  btnDeny: string;
  btnSave: string;
  btnMore: string;
  btnBannerReadMore: string;
  privacyPolicyLinkText: string;
  imprintLinkText: string;
  descriptionOfService: string;
  processingCompanyTitle: string;
  dataPurposes: string;
  dataPurposesInfo: string;
  technologiesUsed: string;
  technologiesUsedInfo: string;
  dataCollectedList: string;
  dataCollectedListInfo: string;
  legalBasisList: string;
  legalBasisInfo: string;
  locationOfProcessing: string;
  retentionPeriod: string;
  transferToThirdCountries: string;
  dataRecipientsList: string;
  policyOf: string;
  cookiePolicyInfo: string;
  optOut: string;
  history: string;
  yes: string;
  no: string;
  explicit: string;
  implicit: string;
}

export interface UCSecondLayerSettings {
  acceptButtonText: string;
  denyButtonText: string;
  tabsCategoriesLabel: string;
  tabsServicesLabel: string;
}

export interface UCService {
  templateId: string;
  dataProcessor: string;
  descriptionOfService: string;
  nameOfProcessingCompany: string;
  addressOfProcessingCompany: string;
  dataPurposesList: string[];
  technologyUsed: string[];
  dataCollectedList: string[];
  legalBasisList: string[];
  locationOfProcessing: string;
  retentionPeriodDescription: string;
  thirdCountryTransfer: string;
  dataRecipientsList: string[];
  privacyPolicyURL: string;
  cookiePolicyURL: string;
  optOutUrl: string;
  categorySlug: string;
  isEssential: boolean;
  consent: UCServiceConsent;
}

export interface UCServiceConsent {
  status: boolean;
  history: UCConsentHistory[];
}

export interface UCConsentHistory {
  status: boolean;
  type: 'explicit' | 'implicit';
  dateTime: string;
}

export interface UCCategory {
  categorySlug: string;
  label: string;
  description: string;
}

export interface UCLegalBasis {
  data: Record<string, string> | null;
}

// --- Consent types & analytics (from SDK action delegates) ---

export type UsercentricsConsentType = 'EXPLICIT' | 'IMPLICIT';

export type UsercentricsAnalyticsEventType =
  | 'CMP_SHOWN'
  | 'ACCEPT_ALL_FIRST_LAYER'
  | 'DENY_ALL_FIRST_LAYER'
  | 'SAVE_FIRST_LAYER'
  | 'ACCEPT_ALL_SECOND_LAYER'
  | 'DENY_ALL_SECOND_LAYER'
  | 'SAVE_SECOND_LAYER'
  | 'IMPRINT_LINK'
  | 'MORE_INFORMATION_LINK'
  | 'PRIVACY_POLICY_LINK';

export interface UserDecision {
  serviceId: string;
  consent: boolean;
}

// ============================================================
// Banner Builder Config (our app layer on top of SDK data)
// ============================================================

export interface BannerConfig {
  settingsId: string;
  layout: BannerLayout;
  theme: BannerTheme;
  settings: UCSettings;
  services: UCService[];
  categories: UCCategory[];
}

export type BannerLayoutType =
  | 'wall'
  | 'bar-bottom'
  | 'bar-top'
  | 'popup-center'
  | 'popup-bottom-left'
  | 'popup-bottom-right';

export interface BannerLayout {
  type: BannerLayoutType;
  showLogo: boolean;
  showCloseButton: boolean;
  showPrivacyButton: boolean;
  borderRadius: number;
  maxWidth: number;
}

export interface BannerTheme {
  backgroundColor: string;
  textColor: string;
  primaryColor: string;
  primaryTextColor: string;
  secondaryColor: string;
  secondaryTextColor: string;
  toggleActiveColor: string;
  toggleInactiveColor: string;
  borderColor: string;
  overlayColor: string;
  overlayOpacity: number;
  fontFamily: string;
  fontSize: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// ============================================================
// Defaults (mimicking UsercentricsCore.getCMPData() structure)
// ============================================================

export const DEFAULT_THEME: BannerTheme = {
  backgroundColor: '#ffffff',
  textColor: '#2d3748',
  primaryColor: '#2b61d6',
  primaryTextColor: '#ffffff',
  secondaryColor: '#f7f8fa',
  secondaryTextColor: '#2d3748',
  toggleActiveColor: '#2b61d6',
  toggleInactiveColor: '#cbd5e1',
  borderColor: '#e2e6ea',
  overlayColor: '#000000',
  overlayOpacity: 0.4,
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  fontSize: 14,
};

export const DEFAULT_LAYOUT: BannerLayout = {
  type: 'wall',
  showLogo: false,
  showCloseButton: false,
  showPrivacyButton: true,
  borderRadius: 12,
  maxWidth: 640,
};

export const DEFAULT_LABELS: UCLabels = {
  firstLayerTitle: 'We value your privacy',
  secondLayerTitle: 'Privacy Settings',
  secondLayerDescriptionHtml: '',
  secondLayerDescription: 'Manage your consent preferences for each service and category below.',
  btnAcceptAll: 'Accept All',
  btnDeny: 'Deny All',
  btnSave: 'Save Settings',
  btnMore: 'More Information',
  btnBannerReadMore: 'Read More',
  privacyPolicyLinkText: 'Privacy Policy',
  imprintLinkText: 'Imprint',
  descriptionOfService: 'Description of Service',
  processingCompanyTitle: 'Processing Company',
  dataPurposes: 'Data Purposes',
  dataPurposesInfo: 'The purposes for which the data is collected and processed.',
  technologiesUsed: 'Technologies Used',
  technologiesUsedInfo: 'The technologies used to process data.',
  dataCollectedList: 'Data Collected',
  dataCollectedListInfo: 'The types of data collected.',
  legalBasisList: 'Legal Basis',
  legalBasisInfo: 'The legal basis for data processing.',
  locationOfProcessing: 'Location of Processing',
  retentionPeriod: 'Retention Period',
  transferToThirdCountries: 'Transfer to Third Countries',
  dataRecipientsList: 'Data Recipients',
  policyOf: 'Privacy Policy of',
  cookiePolicyInfo: 'Cookie Policy',
  optOut: 'Opt Out',
  history: 'Consent History',
  yes: 'Yes',
  no: 'No',
  explicit: 'Explicit',
  implicit: 'Implicit',
};

export const DEFAULT_SECOND_LAYER: UCSecondLayerSettings = {
  acceptButtonText: 'Accept All',
  denyButtonText: 'Deny All',
  tabsCategoriesLabel: 'Categories',
  tabsServicesLabel: 'Services',
};

export const DEFAULT_SETTINGS: UCSettings = {
  labels: DEFAULT_LABELS,
  secondLayer: DEFAULT_SECOND_LAYER,
  language: 'en',
  languagesAvailable: ['en', 'de', 'fr'],
  privacyPolicyUrl: '#',
  imprintUrl: '#',
  firstLayerDescriptionHtml: '',
  firstLayerDescription:
    'We use cookies and similar technologies to provide the best experience on our website. You can choose which cookies you want to allow below.',
  firstLayerMobileDescriptionHtml: '',
  firstLayerMobileDescription:
    'We use cookies to provide the best experience. Choose your preferences below.',
};

export const DEFAULT_SERVICES: UCService[] = [
  {
    templateId: 'essential-cookies',
    dataProcessor: 'Essential Cookies',
    descriptionOfService: 'These cookies are necessary for the website to function and cannot be switched off.',
    nameOfProcessingCompany: 'Website Owner',
    addressOfProcessingCompany: '',
    dataPurposesList: ['Functionality', 'Security'],
    technologyUsed: ['HTTP Cookies'],
    dataCollectedList: ['Session data'],
    legalBasisList: ['Art. 6(1)(f) GDPR'],
    locationOfProcessing: 'European Union',
    retentionPeriodDescription: 'Session',
    thirdCountryTransfer: 'No',
    dataRecipientsList: [],
    privacyPolicyURL: '#',
    cookiePolicyURL: '#',
    optOutUrl: '',
    categorySlug: 'essential',
    isEssential: true,
    consent: { status: true, history: [] },
  },
  {
    templateId: 'google-analytics',
    dataProcessor: 'Google Analytics',
    descriptionOfService: 'Web analytics service that tracks and reports website traffic and user behavior.',
    nameOfProcessingCompany: 'Google Ireland Limited',
    addressOfProcessingCompany: 'Gordon House, Barrow Street, Dublin 4, Ireland',
    dataPurposesList: ['Analytics', 'Statistics'],
    technologyUsed: ['HTTP Cookies', 'Pixel'],
    dataCollectedList: ['IP address', 'Browser information', 'Page views', 'Referrer URL'],
    legalBasisList: ['Art. 6(1)(a) GDPR'],
    locationOfProcessing: 'European Union, United States',
    retentionPeriodDescription: '14 months',
    thirdCountryTransfer: 'United States',
    dataRecipientsList: ['Google LLC'],
    privacyPolicyURL: 'https://policies.google.com/privacy',
    cookiePolicyURL: 'https://policies.google.com/technologies/cookies',
    optOutUrl: 'https://tools.google.com/dlpage/gaoptout',
    categorySlug: 'analytics',
    isEssential: false,
    consent: { status: false, history: [] },
  },
  {
    templateId: 'google-ads',
    dataProcessor: 'Google Ads',
    descriptionOfService: 'Online advertising platform for displaying targeted advertisements.',
    nameOfProcessingCompany: 'Google Ireland Limited',
    addressOfProcessingCompany: 'Gordon House, Barrow Street, Dublin 4, Ireland',
    dataPurposesList: ['Marketing', 'Advertising'],
    technologyUsed: ['HTTP Cookies', 'Pixel', 'JavaScript'],
    dataCollectedList: ['IP address', 'Usage data', 'Ad interaction data'],
    legalBasisList: ['Art. 6(1)(a) GDPR'],
    locationOfProcessing: 'European Union, United States',
    retentionPeriodDescription: '540 days',
    thirdCountryTransfer: 'United States',
    dataRecipientsList: ['Google LLC', 'Advertisers'],
    privacyPolicyURL: 'https://policies.google.com/privacy',
    cookiePolicyURL: 'https://policies.google.com/technologies/cookies',
    optOutUrl: 'https://adssettings.google.com',
    categorySlug: 'marketing',
    isEssential: false,
    consent: { status: false, history: [] },
  },
  {
    templateId: 'hotjar',
    dataProcessor: 'Hotjar',
    descriptionOfService: 'Behavior analytics tool that reveals what users do on your site through heatmaps and recordings.',
    nameOfProcessingCompany: 'Hotjar Ltd.',
    addressOfProcessingCompany: 'Level 2, St Julians Business Centre, Elia Zammit Street, St Julians, Malta',
    dataPurposesList: ['Analytics', 'User Experience'],
    technologyUsed: ['HTTP Cookies', 'JavaScript'],
    dataCollectedList: ['IP address', 'Device information', 'Interactions', 'Mouse movements'],
    legalBasisList: ['Art. 6(1)(a) GDPR'],
    locationOfProcessing: 'European Union',
    retentionPeriodDescription: '365 days',
    thirdCountryTransfer: 'No',
    dataRecipientsList: ['Hotjar Ltd.'],
    privacyPolicyURL: 'https://www.hotjar.com/privacy/',
    cookiePolicyURL: 'https://www.hotjar.com/legal/policies/cookie-information/',
    optOutUrl: 'https://www.hotjar.com/policies/do-not-track/',
    categorySlug: 'functional',
    isEssential: false,
    consent: { status: false, history: [] },
  },
];

export const DEFAULT_CATEGORIES: UCCategory[] = [
  { categorySlug: 'essential', label: 'Essential', description: 'Essential cookies are necessary for the website to function properly.' },
  { categorySlug: 'functional', label: 'Functional', description: 'Functional cookies enable enhanced functionality and personalization.' },
  { categorySlug: 'analytics', label: 'Analytics', description: 'Analytics cookies help us understand how visitors interact with our website.' },
  { categorySlug: 'marketing', label: 'Marketing', description: 'Marketing cookies are used to deliver relevant advertisements.' },
];

export const DEFAULT_BANNER_CONFIG: BannerConfig = {
  settingsId: '',
  layout: DEFAULT_LAYOUT,
  theme: DEFAULT_THEME,
  settings: DEFAULT_SETTINGS,
  services: DEFAULT_SERVICES,
  categories: DEFAULT_CATEGORIES,
};

/** Match services to categories via category.slug == service.categorySlug */
export function getServicesForCategory(category: UCCategory, services: UCService[]): UCService[] {
  return services.filter((s) => s.categorySlug === category.categorySlug);
}
