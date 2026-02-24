import { useBanner } from '@/context/BannerContext';
import { BannerPreview } from '@/components/banner/BannerPreview';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { ThemePanel } from '@/components/editor/ThemePanel';
import { LayoutPanel } from '@/components/editor/LayoutPanel';
import { ContentPanel } from '@/components/editor/ContentPanel';
import { ServicesPanel } from '@/components/editor/ServicesPanel';
import { CodeExportPanel } from '@/components/editor/CodeExportPanel';
import {
  Shield,
  MessageSquare,
  Palette,
  Layout,
  Type,
  Database,
  Code,
  ArrowLeft,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const TABS = [
  { id: 'chat' as const, label: 'Chat', icon: <MessageSquare size={16} /> },
  { id: 'theme' as const, label: 'Theme', icon: <Palette size={16} /> },
  { id: 'layout' as const, label: 'Layout', icon: <Layout size={16} /> },
  { id: 'content' as const, label: 'Content', icon: <Type size={16} /> },
  { id: 'services' as const, label: 'Services', icon: <Database size={16} /> },
  { id: 'code' as const, label: 'Code', icon: <Code size={16} /> },
];

export function BuilderPage() {
  const { state, dispatch } = useBanner();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePanel, setActivePanel] = useState<string>('chat');

  const handleTabClick = (tabId: string) => {
    setActivePanel(tabId);
    if (tabId !== 'code') {
      dispatch({
        type: 'SET_ACTIVE_TAB',
        payload: tabId as typeof state.activeTab,
      });
    }
    if (!sidebarOpen) {
      setSidebarOpen(true);
    }
  };

  const renderPanel = () => {
    switch (activePanel) {
      case 'chat':
        return <ChatPanel />;
      case 'theme':
        return <ThemePanel />;
      case 'layout':
        return <LayoutPanel />;
      case 'content':
        return <ContentPanel />;
      case 'services':
        return <ServicesPanel />;
      case 'code':
        return <CodeExportPanel />;
      default:
        return <ChatPanel />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top bar */}
      <header className="h-12 border-b border-border flex items-center px-3 gap-3 shrink-0">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
            <Shield size={12} className="text-primary-foreground" />
          </div>
          <span className="text-sm font-medium">{state.projectName}</span>
        </div>
        <div className="flex-1" />
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          {sidebarOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
        </button>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Icon tab bar */}
        <div className="w-14 border-r border-border flex flex-col items-center py-2 gap-1 shrink-0 bg-card">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={cn(
                'w-10 h-10 flex flex-col items-center justify-center rounded-lg transition-colors cursor-pointer gap-0.5',
                activePanel === tab.id
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              )}
              title={tab.label}
            >
              {tab.icon}
              <span className="text-[9px] font-medium leading-none">
                {tab.label}
              </span>
            </button>
          ))}
        </div>

        {/* Side panel */}
        {sidebarOpen && (
          <div className="w-80 border-r border-border flex flex-col shrink-0 bg-card overflow-hidden">
            <div className="flex-1 overflow-hidden">{renderPanel()}</div>
          </div>
        )}

        {/* Preview */}
        <div className="flex-1 overflow-hidden">
          <BannerPreview />
        </div>
      </div>
    </div>
  );
}
