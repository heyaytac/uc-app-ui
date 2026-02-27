import type { BannerConfig, BannerTheme, BannerLayout, UCLabels, UCSettings } from '@/types/banner';

export interface AIConfigUpdate {
  theme?: Partial<BannerTheme>;
  layout?: Partial<BannerLayout>;
  labels?: Partial<UCLabels>;
  settings?: Partial<UCSettings>;
}

export interface AIChatResponse {
  message: string;
  configUpdates?: AIConfigUpdate;
}

const SYSTEM_PROMPT = `You are a CMP (Consent Management Platform) banner design assistant. You help users customize their GDPR/CCPA consent banners built with the Usercentrics SDK.

The banner config has these sections that you can modify:

## theme (BannerTheme)
- backgroundColor, textColor, primaryColor, primaryTextColor
- secondaryColor, secondaryTextColor, toggleActiveColor, toggleInactiveColor
- borderColor, overlayColor, overlayOpacity (0-1)
- fontFamily, fontSize (number in px)

## layout (BannerLayout)
- type: "wall" | "bar-bottom" | "bar-top" | "popup-center" | "popup-bottom-left" | "popup-bottom-right"
- showLogo (boolean), showCloseButton (boolean), showPrivacyButton (boolean)
- borderRadius (number in px), maxWidth (number in px)

## labels (UCLabels - maps to settings.labels in Usercentrics SDK)
- firstLayerTitle, btnAcceptAll, btnDeny, btnSave, btnMore, btnBannerReadMore
- privacyPolicyLinkText, imprintLinkText, secondLayerTitle, secondLayerDescription

## settings (UCSettings)
- firstLayerDescription, privacyPolicyUrl, imprintUrl, language

When the user asks for changes, respond with a JSON block containing updates, wrapped in \`\`\`json ... \`\`\`.
Only include the properties that need to change. Example:

\`\`\`json
{
  "theme": { "backgroundColor": "#1a1a2e", "textColor": "#e2e8f0" },
  "layout": { "type": "bar-bottom" },
  "labels": { "firstLayerTitle": "Cookie Consent" }
}
\`\`\`

Always provide a brief, friendly explanation of what you changed before the JSON block.
If the user asks something that doesn't require config changes, just answer helpfully without JSON.`;

function buildUserMessage(userInput: string, currentConfig: BannerConfig): string {
  return `Current config summary:
- Theme: bg=${currentConfig.theme.backgroundColor}, primary=${currentConfig.theme.primaryColor}, text=${currentConfig.theme.textColor}
- Layout: type=${currentConfig.layout.type}, radius=${currentConfig.layout.borderRadius}px, maxWidth=${currentConfig.layout.maxWidth}px
- Title: "${currentConfig.settings.labels.firstLayerTitle}"
- Description: "${currentConfig.settings.firstLayerDescription.substring(0, 100)}..."
- Services: ${currentConfig.services.map(s => s.dataProcessor).join(', ')}

User request: ${userInput}`;
}

export async function callAIChat(
  userInput: string,
  currentConfig: BannerConfig,
  apiKey: string,
  provider: 'anthropic' | 'openai'
): Promise<AIChatResponse> {
  if (!apiKey) {
    throw new Error('API key not configured');
  }

  const userMessage = buildUserMessage(userInput, currentConfig);

  if (provider === 'anthropic') {
    return callAnthropic(userMessage, apiKey);
  } else {
    return callOpenAI(userMessage, apiKey);
  }
}

async function callAnthropic(userMessage: string, apiKey: string): Promise<AIChatResponse> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Anthropic API error: ${response.status} ${err}`);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text || '';
  return parseAIResponse(text);
}

async function callOpenAI(userMessage: string, apiKey: string): Promise<AIChatResponse> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      max_tokens: 1024,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI API error: ${response.status} ${err}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || '';
  return parseAIResponse(text);
}

function parseAIResponse(text: string): AIChatResponse {
  // Extract JSON block from response
  const jsonMatch = text.match(/```json\s*([\s\S]*?)```/);
  let configUpdates: AIConfigUpdate | undefined;

  if (jsonMatch) {
    try {
      configUpdates = JSON.parse(jsonMatch[1]);
    } catch {
      // Failed to parse JSON, just return the text
    }
  }

  // Clean up the message (remove JSON block)
  const message = text.replace(/```json[\s\S]*?```/g, '').trim();

  return { message: message || 'Updated your banner configuration.', configUpdates };
}
