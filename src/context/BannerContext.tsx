import { createContext, useContext, useReducer, type ReactNode } from 'react';
import {
  type BannerConfig,
  type BannerTheme,
  type BannerLayout,
  type UCSettings,
  type UCLabels,
  type ChatMessage,
  type UCService,
  type UCCategory,
  DEFAULT_BANNER_CONFIG,
} from '../types/banner';

export interface BannerState {
  config: BannerConfig;
  messages: ChatMessage[];
  activeTab: 'chat' | 'theme' | 'layout' | 'content' | 'services';
  previewMode: 'first-layer' | 'second-layer';
  isGenerating: boolean;
  projectName: string;
  aiApiKey: string;
  aiProvider: 'anthropic' | 'openai';
}

export type BannerAction =
  | { type: 'SET_CONFIG'; payload: BannerConfig }
  | { type: 'SET_THEME'; payload: Partial<BannerTheme> }
  | { type: 'SET_LAYOUT'; payload: Partial<BannerLayout> }
  | { type: 'SET_SETTINGS'; payload: Partial<UCSettings> }
  | { type: 'SET_LABELS'; payload: Partial<UCLabels> }
  | { type: 'SET_SERVICES'; payload: UCService[] }
  | { type: 'SET_CATEGORIES'; payload: UCCategory[] }
  | { type: 'TOGGLE_SERVICE_CONSENT'; payload: string }
  | { type: 'ADD_MESSAGE'; payload: ChatMessage }
  | { type: 'SET_ACTIVE_TAB'; payload: BannerState['activeTab'] }
  | { type: 'SET_PREVIEW_MODE'; payload: BannerState['previewMode'] }
  | { type: 'SET_IS_GENERATING'; payload: boolean }
  | { type: 'SET_PROJECT_NAME'; payload: string }
  | { type: 'SET_SETTINGS_ID'; payload: string }
  | { type: 'SET_AI_API_KEY'; payload: string }
  | { type: 'SET_AI_PROVIDER'; payload: BannerState['aiProvider'] }
  | { type: 'ACCEPT_ALL' }
  | { type: 'DENY_ALL' };

function bannerReducer(state: BannerState, action: BannerAction): BannerState {
  switch (action.type) {
    case 'SET_CONFIG':
      return { ...state, config: action.payload };
    case 'SET_THEME':
      return {
        ...state,
        config: { ...state.config, theme: { ...state.config.theme, ...action.payload } },
      };
    case 'SET_LAYOUT':
      return {
        ...state,
        config: { ...state.config, layout: { ...state.config.layout, ...action.payload } },
      };
    case 'SET_SETTINGS':
      return {
        ...state,
        config: { ...state.config, settings: { ...state.config.settings, ...action.payload } },
      };
    case 'SET_LABELS':
      return {
        ...state,
        config: {
          ...state.config,
          settings: {
            ...state.config.settings,
            labels: { ...state.config.settings.labels, ...action.payload },
          },
        },
      };
    case 'SET_SERVICES':
      return { ...state, config: { ...state.config, services: action.payload } };
    case 'SET_CATEGORIES':
      return { ...state, config: { ...state.config, categories: action.payload } };
    case 'TOGGLE_SERVICE_CONSENT': {
      const services = state.config.services.map((s) =>
        s.templateId === action.payload && !s.isEssential
          ? { ...s, consent: { ...s.consent, status: !s.consent.status } }
          : s
      );
      return { ...state, config: { ...state.config, services } };
    }
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    case 'SET_PREVIEW_MODE':
      return { ...state, previewMode: action.payload };
    case 'SET_IS_GENERATING':
      return { ...state, isGenerating: action.payload };
    case 'SET_PROJECT_NAME':
      return { ...state, projectName: action.payload };
    case 'SET_SETTINGS_ID':
      return { ...state, config: { ...state.config, settingsId: action.payload } };
    case 'SET_AI_API_KEY':
      return { ...state, aiApiKey: action.payload };
    case 'SET_AI_PROVIDER':
      return { ...state, aiProvider: action.payload };
    case 'ACCEPT_ALL': {
      const services = state.config.services.map((s) => ({
        ...s,
        consent: { ...s.consent, status: true },
      }));
      return { ...state, config: { ...state.config, services } };
    }
    case 'DENY_ALL': {
      const services = state.config.services.map((s) => ({
        ...s,
        consent: { ...s.consent, status: s.isEssential },
      }));
      return { ...state, config: { ...state.config, services } };
    }
    default:
      return state;
  }
}

const initialState: BannerState = {
  config: DEFAULT_BANNER_CONFIG,
  messages: [],
  activeTab: 'chat',
  previewMode: 'first-layer',
  isGenerating: false,
  projectName: 'My CMP Banner',
  aiApiKey: '',
  aiProvider: 'anthropic',
};

interface BannerContextValue {
  state: BannerState;
  dispatch: React.Dispatch<BannerAction>;
}

const BannerContext = createContext<BannerContextValue | null>(null);

export function BannerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bannerReducer, initialState);
  return (
    <BannerContext.Provider value={{ state, dispatch }}>
      {children}
    </BannerContext.Provider>
  );
}

export function useBanner() {
  const ctx = useContext(BannerContext);
  if (!ctx) throw new Error('useBanner must be used within BannerProvider');
  return ctx;
}
