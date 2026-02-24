import type {
  BannerConfig,
  BannerTheme,
  BannerLayout,
  BannerContent,
  BannerLayoutType,
} from '@/types/banner';

interface ChatResponse {
  message: string;
  configUpdates?: {
    theme?: Partial<BannerTheme>;
    layout?: Partial<BannerLayout>;
    content?: Partial<BannerContent>;
  };
}

const COLOR_MAP: Record<string, string> = {
  red: '#ef4444',
  green: '#22c55e',
  blue: '#3b82f6',
  purple: '#8b5cf6',
  pink: '#ec4899',
  orange: '#f97316',
  yellow: '#eab308',
  teal: '#14b8a6',
  cyan: '#06b6d4',
  indigo: '#6366f1',
  black: '#000000',
  white: '#ffffff',
  gray: '#6b7280',
  grey: '#6b7280',
  navy: '#1e3a5f',
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

function findLayout(text: string): BannerLayoutType | null {
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

export function processUserMessage(
  message: string,
  _currentConfig: BannerConfig
): ChatResponse {
  const lower = message.toLowerCase();
  const updates: ChatResponse['configUpdates'] = {};
  const actions: string[] = [];

  // Dark theme
  if (lower.includes('dark')) {
    updates.theme = {
      backgroundColor: '#1a1a2e',
      textColor: '#e2e8f0',
      secondaryColor: '#2a2a3e',
      secondaryTextColor: '#e2e8f0',
      borderColor: '#3a3a4e',
      overlayColor: '#000000',
      overlayOpacity: 0.7,
    };
    actions.push('Applied dark theme with deep background and light text');
  }

  // Light theme
  if (lower.includes('light') && !lower.includes('delight')) {
    updates.theme = {
      ...updates.theme,
      backgroundColor: '#ffffff',
      textColor: '#1a1a2e',
      secondaryColor: '#f0f0f5',
      secondaryTextColor: '#1a1a2e',
      borderColor: '#e2e8f0',
      overlayColor: '#000000',
      overlayOpacity: 0.5,
    };
    actions.push('Applied light theme with clean white background');
  }

  // Primary color
  if (lower.includes('primary') || lower.includes('accent') || lower.includes('brand')) {
    const color = findColor(message);
    if (color) {
      updates.theme = { ...updates.theme, primaryColor: color };
      actions.push(`Set primary color to ${color}`);
    }
  }

  // General color changes
  if (
    (lower.includes('color') || lower.includes('colour')) &&
    !lower.includes('primary') &&
    !lower.includes('accent')
  ) {
    const color = findColor(message);
    if (color) {
      updates.theme = { ...updates.theme, primaryColor: color };
      actions.push(`Updated primary color to ${color}`);
    }
  }

  // Specific color words without "color" keyword
  if (!actions.length) {
    const color = findColor(message);
    if (color && (lower.includes('make') || lower.includes('change') || lower.includes('use') || lower.includes('set'))) {
      if (lower.includes('background') || lower.includes('bg')) {
        updates.theme = { ...updates.theme, backgroundColor: color };
        actions.push(`Set background color to ${color}`);
      } else if (lower.includes('text')) {
        updates.theme = { ...updates.theme, textColor: color };
        actions.push(`Set text color to ${color}`);
      } else if (lower.includes('button') || lower.includes('primary')) {
        updates.theme = { ...updates.theme, primaryColor: color };
        actions.push(`Set button/primary color to ${color}`);
      } else {
        updates.theme = { ...updates.theme, primaryColor: color };
        actions.push(`Updated primary color to ${color}`);
      }
    }
  }

  // Layout
  const layoutType = findLayout(message);
  if (layoutType) {
    updates.layout = { type: layoutType };
    const layoutNames: Record<string, string> = {
      'wall': 'full-screen wall',
      'bar-bottom': 'bottom bar',
      'bar-top': 'top bar',
      'popup-center': 'center popup',
      'popup-bottom-left': 'bottom-left popup',
      'popup-bottom-right': 'bottom-right popup',
    };
    actions.push(`Changed layout to ${layoutNames[layoutType]}`);
  }

  // Border radius
  const radiusMatch = lower.match(/(?:border[- ]?)?radius[:\s]+(\d+)/);
  if (radiusMatch) {
    updates.layout = { ...updates.layout, borderRadius: parseInt(radiusMatch[1]) };
    actions.push(`Set border radius to ${radiusMatch[1]}px`);
  }
  if (lower.includes('rounded') || lower.includes('round')) {
    updates.layout = { ...updates.layout, borderRadius: 16 };
    actions.push('Made corners more rounded');
  }
  if (lower.includes('sharp') || lower.includes('square')) {
    updates.layout = { ...updates.layout, borderRadius: 0 };
    actions.push('Made corners sharp/square');
  }

  // Modern look
  if (lower.includes('modern') || lower.includes('clean') || lower.includes('minimal')) {
    updates.theme = {
      ...updates.theme,
      primaryColor: '#6d5dfc',
      borderColor: '#e2e8f0',
      fontSize: 14,
    };
    updates.layout = {
      ...updates.layout,
      borderRadius: 16,
      showLogo: true,
    };
    actions.push('Applied modern, clean styling with refined colors and rounded corners');
  }

  // Font size
  const fontSizeMatch = lower.match(/font[- ]?size[:\s]+(\d+)/);
  if (fontSizeMatch) {
    updates.theme = { ...updates.theme, fontSize: parseInt(fontSizeMatch[1]) };
    actions.push(`Set font size to ${fontSizeMatch[1]}px`);
  }
  if (lower.includes('larger text') || lower.includes('bigger text') || lower.includes('large font')) {
    updates.theme = { ...updates.theme, fontSize: 16 };
    actions.push('Increased text size');
  }
  if (lower.includes('smaller text') || lower.includes('small font')) {
    updates.theme = { ...updates.theme, fontSize: 12 };
    actions.push('Decreased text size');
  }

  // Title changes
  if (lower.includes('title')) {
    const titleMatch = message.match(/title[:\s]+"([^"]+)"|title[:\s]+to[:\s]+"([^"]+)"|title[:\s]+(.+)/i);
    if (titleMatch) {
      const title = (titleMatch[1] || titleMatch[2] || titleMatch[3]).trim();
      updates.content = { ...updates.content, title };
      actions.push(`Updated title to "${title}"`);
    }
  }

  // Description changes
  if (lower.includes('description') || lower.includes('message text')) {
    const descMatch = message.match(/(?:description|message text)[:\s]+"([^"]+)"/i);
    if (descMatch) {
      updates.content = { ...updates.content, description: descMatch[1] };
      actions.push(`Updated description`);
    }
  }

  // Button labels
  if (lower.includes('accept') && lower.includes('label')) {
    const labelMatch = message.match(/accept(?:\s+all)?\s+(?:button\s+)?label[:\s]+"([^"]+)"/i);
    if (labelMatch) {
      updates.content = { ...updates.content, acceptAllLabel: labelMatch[1] };
      actions.push(`Updated accept button label to "${labelMatch[1]}"`);
    }
  }

  // Privacy policy URL
  if (lower.includes('privacy') && (lower.includes('url') || lower.includes('link'))) {
    const urlMatch = message.match(/https?:\/\/[^\s"]+/);
    if (urlMatch) {
      updates.content = { ...updates.content, privacyPolicyUrl: urlMatch[0] };
      actions.push(`Set privacy policy URL to ${urlMatch[0]}`);
    }
  }

  // Logo toggle
  if (lower.includes('logo')) {
    if (lower.includes('hide') || lower.includes('remove') || lower.includes('no ')) {
      updates.layout = { ...updates.layout, showLogo: false };
      actions.push('Removed logo from banner');
    } else if (lower.includes('show') || lower.includes('add')) {
      updates.layout = { ...updates.layout, showLogo: true };
      actions.push('Added logo to banner');
    }
  }

  // Width
  const widthMatch = lower.match(/(?:max[- ]?)?width[:\s]+(\d+)/);
  if (widthMatch) {
    updates.layout = { ...updates.layout, maxWidth: parseInt(widthMatch[1]) };
    actions.push(`Set max width to ${widthMatch[1]}px`);
  }
  if (lower.includes('wider') || lower.includes('full width')) {
    updates.layout = { ...updates.layout, maxWidth: 800 };
    actions.push('Made banner wider');
  }
  if (lower.includes('narrower') || lower.includes('compact')) {
    updates.layout = { ...updates.layout, maxWidth: 480 };
    actions.push('Made banner more compact');
  }

  // Settings ID
  const settingsIdMatch = message.match(/settings[- ]?id[:\s]+([a-zA-Z0-9_-]+)/i);
  if (settingsIdMatch) {
    actions.push(`Settings ID noted: ${settingsIdMatch[1]}. In production, this would connect to the Usercentrics SDK to fetch your actual services and categories.`);
  }

  // Build response
  if (actions.length > 0) {
    const hasUpdates =
      updates.theme || updates.layout || updates.content;
    return {
      message: actions.join('. ') + '. ' + (hasUpdates ? 'Preview updated!' : ''),
      configUpdates: hasUpdates ? updates : undefined,
    };
  }

  // Fallback help
  return {
    message:
      "I can help you customize your CMP banner. Try things like:\n\n" +
      '- "Make it dark themed"\n' +
      '- "Use a bottom bar layout"\n' +
      '- "Change the primary color to green"\n' +
      '- "Make it more rounded"\n' +
      '- "Set the title to Welcome"\n' +
      '- "Add privacy policy URL https://example.com/privacy"\n' +
      '- "Make the banner wider"\n' +
      '- "Use a popup in the bottom right"',
  };
}
