import { useBanner } from '@/context/BannerContext';
import { generateBannerCode, generateReactCode } from '@/lib/code-generator';
import { Copy, Check, Download } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function CodeExportPanel() {
  const { state } = useBanner();
  const [activeTab, setActiveTab] = useState<'vanilla' | 'react'>('vanilla');
  const [copied, setCopied] = useState(false);

  const code =
    activeTab === 'vanilla'
      ? generateBannerCode(state.config)
      : generateReactCode(state.config);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = activeTab === 'vanilla' ? 'js' : 'tsx';
    const filename = `consent-banner.${ext}`;
    const blob = new Blob([code], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex items-center gap-1 p-3 border-b border-border">
        <button
          onClick={() => setActiveTab('vanilla')}
          className={cn(
            'px-3 py-1.5 text-xs rounded-md transition-colors cursor-pointer',
            activeTab === 'vanilla'
              ? 'bg-secondary text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          Vanilla JS
        </button>
        <button
          onClick={() => setActiveTab('react')}
          className={cn(
            'px-3 py-1.5 text-xs rounded-md transition-colors cursor-pointer',
            activeTab === 'react'
              ? 'bg-secondary text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          React
        </button>

        <div className="flex-1" />

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check size={12} className="text-success" />
              Copied
            </>
          ) : (
            <>
              <Copy size={12} />
              Copy
            </>
          )}
        </button>
        <button
          onClick={handleDownload}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
        >
          <Download size={12} />
          Download
        </button>
      </div>

      {/* Code */}
      <div className="flex-1 overflow-auto">
        <pre className="p-4 text-xs leading-relaxed font-mono text-muted-foreground">
          <code>{code}</code>
        </pre>
      </div>

      {/* Info */}
      <div className="p-3 border-t border-border">
        <p className="text-xs text-muted-foreground">
          {activeTab === 'vanilla' ? (
            <>
              This code uses the{' '}
              <code className="text-primary">@usercentrics/cmp-browser-sdk</code>{' '}
              package. Install it with:{' '}
              <code className="text-primary">
                npm install @usercentrics/cmp-browser-sdk
              </code>
            </>
          ) : (
            <>
              React component using the Usercentrics Browser SDK. Drop this
              component into your app and replace{' '}
              <code className="text-primary">YOUR_SETTINGS_ID</code> with your
              Usercentrics settings ID.
            </>
          )}
        </p>
      </div>
    </div>
  );
}
