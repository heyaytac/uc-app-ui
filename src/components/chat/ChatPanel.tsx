import { useState, useRef, useEffect } from 'react';
import { useBanner } from '@/context/BannerContext';
import { Send, Sparkles, Loader2, Settings2, Key } from 'lucide-react';
import type { ChatMessage } from '@/types/banner';
import { processUserMessage } from '@/lib/chat-engine';
import { callAIChat } from '@/lib/ai-chat';
import type { AIConfigUpdate } from '@/lib/ai-chat';

export function ChatPanel() {
  const { state, dispatch } = useBanner();
  const [input, setInput] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(state.aiApiKey);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages]);

  const applyConfigUpdates = (updates: AIConfigUpdate) => {
    if (updates.theme) dispatch({ type: 'SET_THEME', payload: updates.theme });
    if (updates.layout) dispatch({ type: 'SET_LAYOUT', payload: updates.layout });
    if (updates.labels) dispatch({ type: 'SET_LABELS', payload: updates.labels });
    if (updates.settings) dispatch({ type: 'SET_SETTINGS', payload: updates.settings });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || state.isGenerating) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };
    dispatch({ type: 'ADD_MESSAGE', payload: userMsg });
    const userInput = input.trim();
    setInput('');
    dispatch({ type: 'SET_IS_GENERATING', payload: true });

    try {
      let response: { message: string; configUpdates?: AIConfigUpdate };

      if (state.aiApiKey) {
        response = await callAIChat(userInput, state.config, state.aiApiKey, state.aiProvider);
      } else {
        await new Promise((r) => setTimeout(r, 500));
        response = processUserMessage(userInput, state.config);
      }

      if (response.configUpdates) {
        applyConfigUpdates(response.configUpdates);
      }

      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
      };
      dispatch({ type: 'ADD_MESSAGE', payload: assistantMsg });
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Error: ${err instanceof Error ? err.message : 'Something went wrong'}. Falling back to local engine.`,
        timestamp: new Date(),
      };
      dispatch({ type: 'ADD_MESSAGE', payload: errorMsg });

      const fallback = processUserMessage(userInput, state.config);
      if (fallback.configUpdates) {
        applyConfigUpdates(fallback.configUpdates);
        const fallbackMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: fallback.message,
          timestamp: new Date(),
        };
        dispatch({ type: 'ADD_MESSAGE', payload: fallbackMsg });
      }
    } finally {
      dispatch({ type: 'SET_IS_GENERATING', payload: false });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const suggestions = [
    'Make the banner dark themed',
    'Use a bar layout at the bottom',
    'Change primary color to green',
    'Make it look more modern',
    'Use a popup in the bottom-right',
    'Set title to "Cookie Consent"',
  ];

  return (
    <div className="flex flex-col h-full">
      {/* AI Settings header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-primary" />
          <span className="text-xs font-medium">
            {state.aiApiKey ? `AI (${state.aiProvider})` : 'Local Engine'}
          </span>
          {state.aiApiKey && (
            <span className="text-[10px] text-success px-1.5 py-0.5 rounded-full bg-success/10">Connected</span>
          )}
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <Settings2 size={14} />
        </button>
      </div>

      {/* API Key settings */}
      {showSettings && (
        <div className="px-4 py-3 border-b border-border bg-secondary/30 space-y-2">
          <div className="flex items-center gap-2">
            <select
              value={state.aiProvider}
              onChange={(e) => dispatch({ type: 'SET_AI_PROVIDER', payload: e.target.value as 'anthropic' | 'openai' })}
              className="h-7 text-xs bg-secondary border border-border rounded px-2"
            >
              <option value="anthropic">Anthropic (Claude)</option>
              <option value="openai">OpenAI (GPT)</option>
            </select>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Key size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="Enter API key..."
                className="w-full h-7 text-xs bg-background border border-border rounded pl-7 pr-2 focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <button
              onClick={() => {
                dispatch({ type: 'SET_AI_API_KEY', payload: apiKeyInput });
                setShowSettings(false);
              }}
              className="h-7 px-3 text-xs rounded bg-primary text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer"
            >
              Save
            </button>
          </div>
          <p className="text-[10px] text-muted-foreground">
            Your API key is stored in browser memory only and sent directly to the {state.aiProvider === 'anthropic' ? 'Anthropic' : 'OpenAI'} API.
          </p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {state.messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Sparkles size={24} className="text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Build your CMP Banner</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              {state.aiApiKey
                ? 'Describe your banner changes and AI will apply them using the Usercentrics SDK data model.'
                : 'Describe your banner changes, or connect an AI API key for smarter modifications.'}
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInput(suggestion)}
                  className="px-3 py-1.5 text-xs rounded-full border border-border bg-secondary/50 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors cursor-pointer"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {state.messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-md'
                      : 'bg-secondary text-secondary-foreground rounded-bl-md'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {state.isGenerating && (
              <div className="flex justify-start">
                <div className="bg-secondary text-secondary-foreground rounded-2xl rounded-bl-md px-4 py-2.5 text-sm">
                  <Loader2 size={16} className="animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={state.aiApiKey ? 'Ask AI to modify your banner...' : 'Describe your banner changes...'}
            rows={1}
            className="w-full resize-none rounded-xl border border-border bg-secondary/50 px-4 py-3 pr-12 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="submit"
            disabled={!input.trim() || state.isGenerating}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-primary text-primary-foreground disabled:opacity-30 transition-opacity hover:opacity-90 cursor-pointer disabled:cursor-not-allowed"
          >
            <Send size={14} />
          </button>
        </form>
      </div>
    </div>
  );
}
