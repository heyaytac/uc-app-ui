import { useBanner } from '@/context/BannerContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export function ContentPanel() {
  const { state, dispatch } = useBanner();
  const { content } = state.config;

  const updateContent = (updates: Partial<typeof content>) => {
    dispatch({ type: 'SET_CONTENT', payload: updates });
  };

  return (
    <div className="p-4 space-y-6 overflow-y-auto h-full">
      {/* Main text */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Banner Text</h3>
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">
              Title
            </Label>
            <Input
              value={content.title}
              onChange={(e) => updateContent({ title: e.target.value })}
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">
              Description
            </Label>
            <Textarea
              value={content.description}
              onChange={(e) => updateContent({ description: e.target.value })}
              className="text-sm min-h-[80px]"
            />
          </div>
        </div>
      </div>

      {/* Button labels */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Button Labels</h3>
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">
              Accept All
            </Label>
            <Input
              value={content.acceptAllLabel}
              onChange={(e) =>
                updateContent({ acceptAllLabel: e.target.value })
              }
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">
              Deny All
            </Label>
            <Input
              value={content.denyAllLabel}
              onChange={(e) =>
                updateContent({ denyAllLabel: e.target.value })
              }
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">
              Save Settings
            </Label>
            <Input
              value={content.saveLabel}
              onChange={(e) => updateContent({ saveLabel: e.target.value })}
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">
              More Info
            </Label>
            <Input
              value={content.moreInfoLabel}
              onChange={(e) =>
                updateContent({ moreInfoLabel: e.target.value })
              }
              className="h-8 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Links */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Legal Links</h3>
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">
              Privacy Policy Label
            </Label>
            <Input
              value={content.privacyPolicyLabel}
              onChange={(e) =>
                updateContent({ privacyPolicyLabel: e.target.value })
              }
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">
              Privacy Policy URL
            </Label>
            <Input
              value={content.privacyPolicyUrl}
              onChange={(e) =>
                updateContent({ privacyPolicyUrl: e.target.value })
              }
              className="h-8 text-sm"
              placeholder="https://example.com/privacy"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">
              Imprint Label
            </Label>
            <Input
              value={content.imprintLabel}
              onChange={(e) =>
                updateContent({ imprintLabel: e.target.value })
              }
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">
              Imprint URL
            </Label>
            <Input
              value={content.imprintUrl}
              onChange={(e) => updateContent({ imprintUrl: e.target.value })}
              className="h-8 text-sm"
              placeholder="https://example.com/imprint"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
