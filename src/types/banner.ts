export interface BannerConfig {
  settingsId: string;
  layout: BannerLayout;
  theme: BannerTheme;
  content: BannerContent;
  services: ServiceConfig[];
  categories: CategoryConfig[];
}

export type BannerLayoutType = 'wall' | 'bar-bottom' | 'bar-top' | 'popup-center' | 'popup-bottom-left' | 'popup-bottom-right';

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

export interface BannerContent {
  title: string;
  description: string;
  acceptAllLabel: string;
  denyAllLabel: string;
  saveLabel: string;
  moreInfoLabel: string;
  privacyPolicyLabel: string;
  privacyPolicyUrl: string;
  imprintLabel: string;
  imprintUrl: string;
}

export interface ServiceConfig {
  id: string;
  name: string;
  description: string;
  category: string;
  isEssential: boolean;
  consent: boolean;
}

export interface CategoryConfig {
  id: string;
  label: string;
  description: string;
  slug: string;
  services: ServiceConfig[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ProjectState {
  id: string;
  name: string;
  config: BannerConfig;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export const DEFAULT_THEME: BannerTheme = {
  backgroundColor: '#ffffff',
  textColor: '#1a1a2e',
  primaryColor: '#1f6ff0',
  primaryTextColor: '#ffffff',
  secondaryColor: '#f0f0f5',
  secondaryTextColor: '#1a1a2e',
  toggleActiveColor: '#1f6ff0',
  toggleInactiveColor: '#cbd5e1',
  borderColor: '#e2e8f0',
  overlayColor: '#000000',
  overlayOpacity: 0.5,
  fontFamily: 'system-ui, -apple-system, sans-serif',
  fontSize: 14,
};

export const DEFAULT_CONTENT: BannerContent = {
  title: 'We value your privacy',
  description: 'We use cookies and similar technologies to provide the best experience on our website. You can choose which cookies you want to allow below.',
  acceptAllLabel: 'Accept All',
  denyAllLabel: 'Deny All',
  saveLabel: 'Save Settings',
  moreInfoLabel: 'More Information',
  privacyPolicyLabel: 'Privacy Policy',
  privacyPolicyUrl: '#',
  imprintLabel: 'Imprint',
  imprintUrl: '#',
};

export const DEFAULT_LAYOUT: BannerLayout = {
  type: 'wall',
  showLogo: true,
  showCloseButton: false,
  showPrivacyButton: true,
  borderRadius: 12,
  maxWidth: 640,
};

export const DEFAULT_SERVICES: ServiceConfig[] = [
  {
    id: 'essential',
    name: 'Essential Cookies',
    description: 'These cookies are necessary for the website to function and cannot be switched off.',
    category: 'essential',
    isEssential: true,
    consent: true,
  },
  {
    id: 'analytics',
    name: 'Google Analytics',
    description: 'Analytics cookies help us understand how visitors interact with our website.',
    category: 'analytics',
    isEssential: false,
    consent: false,
  },
  {
    id: 'marketing',
    name: 'Google Ads',
    description: 'Marketing cookies are used to deliver relevant advertisements to visitors.',
    category: 'marketing',
    isEssential: false,
    consent: false,
  },
  {
    id: 'functional',
    name: 'Hotjar',
    description: 'Functional cookies enable enhanced functionality and personalization.',
    category: 'functional',
    isEssential: false,
    consent: false,
  },
];

export const DEFAULT_CATEGORIES: CategoryConfig[] = [
  {
    id: 'essential',
    label: 'Essential',
    description: 'Essential cookies are necessary for the website to function properly.',
    slug: 'essential',
    services: [DEFAULT_SERVICES[0]],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    description: 'Analytics cookies help us understand how visitors interact with our website.',
    slug: 'analytics',
    services: [DEFAULT_SERVICES[1]],
  },
  {
    id: 'marketing',
    label: 'Marketing',
    description: 'Marketing cookies are used to deliver relevant advertisements.',
    slug: 'marketing',
    services: [DEFAULT_SERVICES[2]],
  },
  {
    id: 'functional',
    label: 'Functional',
    description: 'Functional cookies enable enhanced functionality and personalization.',
    slug: 'functional',
    services: [DEFAULT_SERVICES[3]],
  },
];

export const DEFAULT_BANNER_CONFIG: BannerConfig = {
  settingsId: '',
  layout: DEFAULT_LAYOUT,
  theme: DEFAULT_THEME,
  content: DEFAULT_CONTENT,
  services: DEFAULT_SERVICES,
  categories: DEFAULT_CATEGORIES,
};
