import { useBanner } from '@/context/BannerContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export function ContentPanel() {
  const { state, dispatch } = useBanner();
  const { settings } = state.config;
  const { labels } = settings;

  const updateLabels = (updates: Partial<typeof labels>) => {
    dispatch({ type: 'SET_LABELS', payload: updates });
  };

  const updateSettings = (updates: Partial<typeof settings>) => {
    dispatch({ type: 'SET_SETTINGS', payload: updates });
  };

  return (
    <div className="p-4 space-y-6 overflow-y-auto h-full">
      {/* First Layer */}
      <div>
        <h3 className="text-sm font-semibold mb-1">First Layer</h3>
        <p className="text-[10px] text-muted-foreground mb-3">settings.labels.firstLayerTitle, settings.firstLayerDescription</p>
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Title (labels.firstLayerTitle)</Label>
            <Input
              value={labels.firstLayerTitle}
              onChange={(e) => updateLabels({ firstLayerTitle: e.target.value })}
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Description (settings.firstLayerDescription)</Label>
            <Textarea
              value={settings.firstLayerDescription}
              onChange={(e) => updateSettings({ firstLayerDescription: e.target.value })}
              className="text-sm min-h-[80px]"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Mobile Description</Label>
            <Textarea
              value={settings.firstLayerMobileDescription}
              onChange={(e) => updateSettings({ firstLayerMobileDescription: e.target.value })}
              className="text-sm min-h-[60px]"
            />
          </div>
        </div>
      </div>

      {/* Second Layer */}
      <div>
        <h3 className="text-sm font-semibold mb-1">Second Layer</h3>
        <p className="text-[10px] text-muted-foreground mb-3">settings.labels.secondLayerTitle, settings.secondLayer.*</p>
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Title (labels.secondLayerTitle)</Label>
            <Input
              value={labels.secondLayerTitle}
              onChange={(e) => updateLabels({ secondLayerTitle: e.target.value })}
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Description</Label>
            <Input
              value={labels.secondLayerDescription}
              onChange={(e) => updateLabels({ secondLayerDescription: e.target.value })}
              className="h-8 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Button Labels */}
      <div>
        <h3 className="text-sm font-semibold mb-1">Button Labels</h3>
        <p className="text-[10px] text-muted-foreground mb-3">settings.labels.btn*</p>
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Accept All (labels.btnAcceptAll)</Label>
            <Input value={labels.btnAcceptAll} onChange={(e) => updateLabels({ btnAcceptAll: e.target.value })} className="h-8 text-sm" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Deny (labels.btnDeny)</Label>
            <Input value={labels.btnDeny} onChange={(e) => updateLabels({ btnDeny: e.target.value })} className="h-8 text-sm" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Save (labels.btnSave)</Label>
            <Input value={labels.btnSave} onChange={(e) => updateLabels({ btnSave: e.target.value })} className="h-8 text-sm" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">More Info (labels.btnMore)</Label>
            <Input value={labels.btnMore} onChange={(e) => updateLabels({ btnMore: e.target.value })} className="h-8 text-sm" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Read More (labels.btnBannerReadMore)</Label>
            <Input value={labels.btnBannerReadMore} onChange={(e) => updateLabels({ btnBannerReadMore: e.target.value })} className="h-8 text-sm" />
          </div>
        </div>
      </div>

      {/* Legal Links */}
      <div>
        <h3 className="text-sm font-semibold mb-1">Legal Links</h3>
        <p className="text-[10px] text-muted-foreground mb-3">settings.privacyPolicyUrl, settings.imprintUrl</p>
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Privacy Policy Label</Label>
            <Input value={labels.privacyPolicyLinkText} onChange={(e) => updateLabels({ privacyPolicyLinkText: e.target.value })} className="h-8 text-sm" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Privacy Policy URL</Label>
            <Input value={settings.privacyPolicyUrl} onChange={(e) => updateSettings({ privacyPolicyUrl: e.target.value })} className="h-8 text-sm" placeholder="https://example.com/privacy" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Imprint Label</Label>
            <Input value={labels.imprintLinkText} onChange={(e) => updateLabels({ imprintLinkText: e.target.value })} className="h-8 text-sm" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Imprint URL</Label>
            <Input value={settings.imprintUrl} onChange={(e) => updateSettings({ imprintUrl: e.target.value })} className="h-8 text-sm" placeholder="https://example.com/imprint" />
          </div>
        </div>
      </div>

      {/* Language */}
      <div>
        <h3 className="text-sm font-semibold mb-1">Language</h3>
        <p className="text-[10px] text-muted-foreground mb-3">settings.language</p>
        <div className="flex items-center gap-2">
          <Label className="text-xs text-muted-foreground">Language</Label>
          <select
            value={settings.language}
            onChange={(e) => updateSettings({ language: e.target.value })}
            className="h-7 text-xs bg-secondary border border-border rounded px-2"
          >
            {settings.languagesAvailable.map((lang) => (
              <option key={lang} value={lang}>{lang.toUpperCase()}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
