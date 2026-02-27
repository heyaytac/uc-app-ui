import type { BannerConfig, BannerLayout } from '@/types/banner';
import type { AIConfigUpdate } from '@/lib/ai-chat';

/** Fallback local engine when no AI API key is configured */
export function processUserMessage(
  message: string,
  _currentConfig: BannerConfig
): { message: string; configUpdates?: AIConfigUpdate } {
  const lower = message.toLowerCase();
  const updates: AIConfigUpdate = {};
  const actions: string[] = [];

  // --- Theme changes ---
  if (lower.includes('dark')) {
    updates.theme = {
      backgroundColor: '#1a1a2e', textColor: '#e2e8f0',
      secondaryColor: '#2a2a3e', secondaryTextColor: '#e2e8f0',
      borderColor: '#3a3a4e', overlayColor: '#000000', overlayOpacity: 0.7,
    };
    actions.push('Applied dark theme');
  }
  if (lower.includes('light') && !lower.includes('delight')) {
    updates.theme = {
      ...updates.theme,
      backgroundColor: '#ffffff', textColor: '#1a1a2e',
      secondaryColor: '#f0f0f5', secondaryTextColor: '#1a1a2e',
      borderColor: '#e2e8f0', overlayColor: '#000000', overlayOpacity: 0.5,
    };
    actions.push('Applied light theme');
  }

  const color = findColor(message);
  if (color) {
    if (lower.includes('background') || lower.includes('bg')) {
      updates.theme = { ...updates.theme, backgroundColor: color };
      actions.push(`Set background to ${color}`);
    } else if (lower.includes('text')) {
      updates.theme = { ...updates.theme, textColor: color };
      actions.push(`Set text color to ${color}`);
    } else {
      updates.theme = { ...updates.theme, primaryColor: color };
      actions.push(`Set primary color to ${color}`);
    }
  }

  if (lower.includes('modern') || lower.includes('clean') || lower.includes('minimal')) {
    updates.theme = { ...updates.theme, primaryColor: '#6d5dfc', fontSize: 14 };
    updates.layout = { ...updates.layout, borderRadius: 16, showLogo: true };
    actions.push('Applied modern styling');
  }

  // --- Layout changes ---
  const layoutType = findLayout(message);
  if (layoutType) {
    updates.layout = { ...updates.layout, type: layoutType };
    actions.push(`Changed layout to ${layoutType}`);
  }

  if (lower.includes('rounded') || lower.includes('round')) {
    updates.layout = { ...updates.layout, borderRadius: 16 };
    actions.push('Rounded corners');
  }
  if (lower.includes('sharp') || lower.includes('square')) {
    updates.layout = { ...updates.layout, borderRadius: 0 };
    actions.push('Sharp corners');
  }
  if (lower.includes('wider') || lower.includes('full width')) {
    updates.layout = { ...updates.layout, maxWidth: 800 };
    actions.push('Wider banner');
  }
  if (lower.includes('narrower') || lower.includes('compact')) {
    updates.layout = { ...updates.layout, maxWidth: 480 };
    actions.push('Compact banner');
  }
  if (lower.includes('hide logo') || lower.includes('remove logo') || lower.includes('no logo')) {
    updates.layout = { ...updates.layout, showLogo: false };
    actions.push('Removed logo');
  }
  if (lower.includes('show logo') || lower.includes('add logo')) {
    updates.layout = { ...updates.layout, showLogo: true };
    actions.push('Added logo');
  }

  // --- Label / content changes (using settings.labels paths) ---
  const titleMatch = message.match(/title[:\s]+"([^"]+)"/i);
  if (titleMatch) {
    updates.labels = { ...updates.labels, firstLayerTitle: titleMatch[1] };
    actions.push(`Title: "${titleMatch[1]}"`);
  }

  const descMatch = message.match(/description[:\s]+"([^"]+)"/i);
  if (descMatch) {
    updates.settings = { ...updates.settings, firstLayerDescription: descMatch[1] };
    actions.push('Updated description');
  }

  if (lower.includes('accept') && lower.includes('label')) {
    const m = message.match(/accept.*label[:\s]+"([^"]+)"/i);
    if (m) {
      updates.labels = { ...updates.labels, btnAcceptAll: m[1] };
      actions.push(`Accept button: "${m[1]}"`);
    }
  }

  if (lower.includes('privacy') && (lower.includes('url') || lower.includes('link'))) {
    const urlMatch = message.match(/https?:\/\/[^\s"]+/);
    if (urlMatch) {
      updates.settings = { ...updates.settings, privacyPolicyUrl: urlMatch[0] };
      actions.push(`Privacy URL: ${urlMatch[0]}`);
    }
  }

  // --- Font size ---
  if (lower.includes('larger text') || lower.includes('bigger text')) {
    updates.theme = { ...updates.theme, fontSize: 16 };
    actions.push('Larger text');
  }
  if (lower.includes('smaller text') || lower.includes('small font')) {
    updates.theme = { ...updates.theme, fontSize: 12 };
    actions.push('Smaller text');
  }

  if (actions.length > 0) {
    const hasUpdates = updates.theme || updates.layout || updates.labels || updates.settings;
    return {
      message: actions.join('. ') + '.' + (hasUpdates ? ' Preview updated!' : ''),
      configUpdates: hasUpdates ? updates : undefined,
    };
  }

  return {
    message:
      "I can help customize your CMP banner. Try:\n" +
      '- "Make it dark themed"\n' +
      '- "Use a bottom bar layout"\n' +
      '- "Change primary color to green"\n' +
      '- "Set title to \\"Welcome\\""\n' +
      '- "Use a popup in the bottom right"\n\n' +
      'For AI-powered changes, add your API key in the chat settings.',
  };
}

// --- Helpers ---

const COLOR_MAP: Record<string, string> = {
  red: '#ef4444', green: '#22c55e', blue: '#3b82f6', purple: '#8b5cf6',
  pink: '#ec4899', orange: '#f97316', yellow: '#eab308', teal: '#14b8a6',
  cyan: '#06b6d4', indigo: '#6366f1', black: '#000000', white: '#ffffff',
  gray: '#6b7280', grey: '#6b7280', navy: '#1e3a5f',
};

function findColor(text: string): string | null {
  const hexMatch = text.match(/#[0-9a-fA-F]{3,8}/);
  if (hexMatch) return hexMatch[0];
  const lower = text.toLowerCase();
  for (const [name, hex] of Object.entries(COLOR_MAP)) {
    if (lower.includes(name)) return hex;
  }
  return null;
}

type LayoutType = BannerLayout['type'];
function findLayout(text: string): LayoutType | null {
  const lower = text.toLowerCase();
  if (lower.includes('bar') && lower.includes('bottom')) return 'bar-bottom';
  if (lower.includes('bar') && lower.includes('top')) return 'bar-top';
  if (lower.includes('bar')) return 'bar-bottom';
  if (lower.includes('popup') && lower.includes('left')) return 'popup-bottom-left';
  if (lower.includes('popup') && lower.includes('right')) return 'popup-bottom-right';
  if (lower.includes('popup') && lower.includes('center')) return 'popup-center';
  if (lower.includes('popup')) return 'popup-center';
  if (lower.includes('wall') || lower.includes('full') || lower.includes('modal')) return 'wall';
  return null;
}
