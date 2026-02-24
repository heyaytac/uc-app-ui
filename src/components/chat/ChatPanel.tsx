import { useState, useRef, useEffect } from 'react';
import { useBanner } from '@/context/BannerContext';
import { Send, Sparkles, Loader2 } from 'lucide-react';
import type { ChatMessage } from '@/types/banner';
import { processUserMessage } from '@/lib/chat-engine';

export function ChatPanel() {
  const { state, dispatch } = useBanner();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || state.isGenerating) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };
    dispatch({ type: 'ADD_MESSAGE', payload: userMsg });
    setInput('');

    dispatch({ type: 'SET_IS_GENERATING', payload: true });

    // Process the message and generate response
    setTimeout(() => {
      const response = processUserMessage(input.trim(), state.config);
      if (response.configUpdates) {
        if (response.configUpdates.theme) {
          dispatch({ type: 'SET_THEME', payload: response.configUpdates.theme });
        }
        if (response.configUpdates.layout) {
          dispatch({ type: 'SET_LAYOUT', payload: response.configUpdates.layout });
        }
        if (response.configUpdates.content) {
          dispatch({ type: 'SET_CONTENT', payload: response.configUpdates.content });
        }
      }

      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
      };
      dispatch({ type: 'ADD_MESSAGE', payload: assistantMsg });
      dispatch({ type: 'SET_IS_GENERATING', payload: false });
    }, 800);
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
    'Add a cookie policy URL',
    'Make it look more modern',
    'Use a popup in the bottom-right',
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {state.messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Sparkles size={24} className="text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Build your CMP Banner
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              Describe how you want your consent banner to look. I'll generate it using Usercentrics SDK patterns.
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
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
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
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your banner changes..."
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
