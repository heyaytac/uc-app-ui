import { useBanner } from '@/context/BannerContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { getServicesForCategory } from '@/types/banner';
import type { UCService, UCCategory } from '@/types/banner';

export function ServicesPanel() {
  const { state, dispatch } = useBanner();
  const { categories, services } = state.config;
  const [settingsId, setSettingsId] = useState(state.config.settingsId);
  const [expandedService, setExpandedService] = useState<string | null>(null);

  const handleAddService = (categorySlug: string) => {
    const newService: UCService = {
      templateId: `service-${Date.now()}`,
      dataProcessor: 'New Service',
      descriptionOfService: 'Service description',
      nameOfProcessingCompany: 'Company Name',
      addressOfProcessingCompany: '',
      dataPurposesList: [],
      technologyUsed: ['HTTP Cookies'],
      dataCollectedList: [],
      legalBasisList: ['Art. 6(1)(a) GDPR'],
      locationOfProcessing: 'European Union',
      retentionPeriodDescription: '',
      thirdCountryTransfer: 'No',
      dataRecipientsList: [],
      privacyPolicyURL: '',
      cookiePolicyURL: '',
      optOutUrl: '',
      categorySlug,
      isEssential: false,
      consent: { status: false, history: [] },
    };
    dispatch({ type: 'SET_SERVICES', payload: [...services, newService] });
  };

  const handleRemoveService = (templateId: string) => {
    dispatch({ type: 'SET_SERVICES', payload: services.filter((s) => s.templateId !== templateId) });
  };

  const handleUpdateService = (templateId: string, updates: Partial<UCService>) => {
    dispatch({
      type: 'SET_SERVICES',
      payload: services.map((s) => (s.templateId === templateId ? { ...s, ...updates } : s)),
    });
  };

  const handleAddCategory = () => {
    const newCat: UCCategory = {
      categorySlug: `category-${Date.now()}`,
      label: 'New Category',
      description: 'Category description',
    };
    dispatch({ type: 'SET_CATEGORIES', payload: [...categories, newCat] });
  };

  return (
    <div className="p-4 space-y-6 overflow-y-auto h-full">
      {/* Settings ID */}
      <div>
        <h3 className="text-sm font-semibold mb-2">Usercentrics Settings ID</h3>
        <p className="text-xs text-muted-foreground mb-2">
          Connect to UsercentricsCore to fetch real services via getCMPData().
        </p>
        <div className="flex gap-2">
          <Input
            value={settingsId}
            onChange={(e) => setSettingsId(e.target.value)}
            placeholder="e.g., ABC123xyz"
            className="h-8 text-sm flex-1"
          />
          <button
            onClick={() => dispatch({ type: 'SET_SETTINGS_ID', payload: settingsId })}
            className="h-8 px-3 text-xs rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer"
          >
            Connect
          </button>
        </div>
      </div>

      {/* Categories and Services */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">Categories & Services</h3>
          <button
            onClick={handleAddCategory}
            className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors cursor-pointer"
          >
            <Plus size={12} />
            Add Category
          </button>
        </div>

        <p className="text-[10px] text-muted-foreground mb-3">
          category.slug == service.categorySlug
        </p>

        <div className="space-y-4">
          {categories.map((category) => {
            const catServices = getServicesForCategory(category, services);
            return (
              <div key={category.categorySlug} className="rounded-lg border border-border overflow-hidden">
                <div className="flex items-center gap-2 p-3 bg-secondary/50">
                  <GripVertical size={14} className="text-muted-foreground opacity-40" />
                  <Input
                    value={category.label}
                    onChange={(e) => {
                      dispatch({
                        type: 'SET_CATEGORIES',
                        payload: categories.map((c) =>
                          c.categorySlug === category.categorySlug ? { ...c, label: e.target.value } : c
                        ),
                      });
                    }}
                    className="h-6 text-xs font-medium border-none bg-transparent p-0 focus-visible:ring-0"
                  />
                  <span className="text-[10px] text-muted-foreground shrink-0">
                    slug: {category.categorySlug}
                  </span>
                </div>

                <div className="p-2 space-y-2">
                  {catServices.map((service) => {
                    const isExpanded = expandedService === service.templateId;
                    return (
                      <div key={service.templateId} className="rounded-md hover:bg-secondary/30">
                        <div className="flex items-start gap-2 p-2">
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setExpandedService(isExpanded ? null : service.templateId)}
                                className="cursor-pointer text-muted-foreground"
                              >
                                {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                              </button>
                              <Input
                                value={service.dataProcessor}
                                onChange={(e) => handleUpdateService(service.templateId, { dataProcessor: e.target.value })}
                                className="h-6 text-xs border-none bg-transparent p-0 focus-visible:ring-0 font-medium"
                              />
                            </div>
                            <Input
                              value={service.descriptionOfService}
                              onChange={(e) => handleUpdateService(service.templateId, { descriptionOfService: e.target.value })}
                              className="h-5 text-[11px] border-none bg-transparent p-0 focus-visible:ring-0 text-muted-foreground ml-6"
                            />
                            <div className="flex items-center gap-3 ml-6">
                              <label className="flex items-center gap-1.5 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={service.isEssential}
                                  onChange={(e) =>
                                    handleUpdateService(service.templateId, {
                                      isEssential: e.target.checked,
                                      consent: { ...service.consent, status: e.target.checked || service.consent.status },
                                    })
                                  }
                                  className="w-3 h-3"
                                />
                                <span className="text-[10px] text-muted-foreground">Essential</span>
                              </label>
                              <Label className={cn('text-[10px]', service.consent.status ? 'text-success' : 'text-muted-foreground')}>
                                {service.consent.status ? 'Consent: On' : 'Consent: Off'}
                              </Label>
                            </div>

                            {/* Expanded: full service detail fields */}
                            {isExpanded && (
                              <div className="ml-6 mt-2 space-y-2 border-t border-border pt-2">
                                <FieldRow label="Processing Company" value={service.nameOfProcessingCompany} onChange={(v) => handleUpdateService(service.templateId, { nameOfProcessingCompany: v })} />
                                <FieldRow label="Company Address" value={service.addressOfProcessingCompany} onChange={(v) => handleUpdateService(service.templateId, { addressOfProcessingCompany: v })} />
                                <FieldRow label="Data Purposes" value={service.dataPurposesList.join(', ')} onChange={(v) => handleUpdateService(service.templateId, { dataPurposesList: v.split(',').map(s => s.trim()).filter(Boolean) })} />
                                <FieldRow label="Technologies Used" value={service.technologyUsed.join(', ')} onChange={(v) => handleUpdateService(service.templateId, { technologyUsed: v.split(',').map(s => s.trim()).filter(Boolean) })} />
                                <FieldRow label="Data Collected" value={service.dataCollectedList.join(', ')} onChange={(v) => handleUpdateService(service.templateId, { dataCollectedList: v.split(',').map(s => s.trim()).filter(Boolean) })} />
                                <FieldRow label="Legal Basis" value={service.legalBasisList.join(', ')} onChange={(v) => handleUpdateService(service.templateId, { legalBasisList: v.split(',').map(s => s.trim()).filter(Boolean) })} />
                                <FieldRow label="Location" value={service.locationOfProcessing} onChange={(v) => handleUpdateService(service.templateId, { locationOfProcessing: v })} />
                                <FieldRow label="Retention Period" value={service.retentionPeriodDescription} onChange={(v) => handleUpdateService(service.templateId, { retentionPeriodDescription: v })} />
                                <FieldRow label="3rd Country Transfer" value={service.thirdCountryTransfer} onChange={(v) => handleUpdateService(service.templateId, { thirdCountryTransfer: v })} />
                                <FieldRow label="Data Recipients" value={service.dataRecipientsList.join(', ')} onChange={(v) => handleUpdateService(service.templateId, { dataRecipientsList: v.split(',').map(s => s.trim()).filter(Boolean) })} />
                                <FieldRow label="Privacy Policy URL" value={service.privacyPolicyURL} onChange={(v) => handleUpdateService(service.templateId, { privacyPolicyURL: v })} />
                                <FieldRow label="Cookie Policy URL" value={service.cookiePolicyURL} onChange={(v) => handleUpdateService(service.templateId, { cookiePolicyURL: v })} />
                                <FieldRow label="Opt Out URL" value={service.optOutUrl} onChange={(v) => handleUpdateService(service.templateId, { optOutUrl: v })} />
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => handleRemoveService(service.templateId)}
                            className="p-1 text-muted-foreground hover:text-destructive transition-colors cursor-pointer shrink-0"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  <button
                    onClick={() => handleAddService(category.categorySlug)}
                    className="w-full flex items-center justify-center gap-1 py-1.5 text-xs text-muted-foreground hover:text-foreground border border-dashed border-border rounded-md transition-colors cursor-pointer"
                  >
                    <Plus size={12} />
                    Add Service
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FieldRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <Label className="text-[10px] text-muted-foreground mb-0.5 block">{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} className="h-6 text-[11px] bg-transparent" />
    </div>
  );
}
