import { useBanner } from '@/context/BannerContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import type { ServiceConfig, CategoryConfig } from '@/types/banner';

export function ServicesPanel() {
  const { state, dispatch } = useBanner();
  const { categories, services } = state.config;
  const [settingsId, setSettingsId] = useState(state.config.settingsId);

  const handleAddService = (categoryId: string) => {
    const newService: ServiceConfig = {
      id: `service-${Date.now()}`,
      name: 'New Service',
      description: 'Service description',
      category: categoryId,
      isEssential: false,
      consent: false,
    };

    const newServices = [...services, newService];
    const newCategories = categories.map((cat) =>
      cat.id === categoryId
        ? { ...cat, services: [...cat.services, newService] }
        : cat
    );

    dispatch({ type: 'SET_SERVICES', payload: newServices });
    dispatch({ type: 'SET_CATEGORIES', payload: newCategories });
  };

  const handleRemoveService = (serviceId: string) => {
    const newServices = services.filter((s) => s.id !== serviceId);
    const newCategories = categories.map((cat) => ({
      ...cat,
      services: cat.services.filter((s) => s.id !== serviceId),
    }));

    dispatch({ type: 'SET_SERVICES', payload: newServices });
    dispatch({ type: 'SET_CATEGORIES', payload: newCategories });
  };

  const handleUpdateService = (
    serviceId: string,
    updates: Partial<ServiceConfig>
  ) => {
    const newServices = services.map((s) =>
      s.id === serviceId ? { ...s, ...updates } : s
    );
    const newCategories = categories.map((cat) => ({
      ...cat,
      services: cat.services.map((s) =>
        s.id === serviceId ? { ...s, ...updates } : s
      ),
    }));

    dispatch({ type: 'SET_SERVICES', payload: newServices });
    dispatch({ type: 'SET_CATEGORIES', payload: newCategories });
  };

  const handleAddCategory = () => {
    const newCat: CategoryConfig = {
      id: `category-${Date.now()}`,
      label: 'New Category',
      description: 'Category description',
      slug: `category-${Date.now()}`,
      services: [],
    };
    dispatch({
      type: 'SET_CATEGORIES',
      payload: [...categories, newCat],
    });
  };

  return (
    <div className="p-4 space-y-6 overflow-y-auto h-full">
      {/* Settings ID */}
      <div>
        <h3 className="text-sm font-semibold mb-2">Usercentrics Settings ID</h3>
        <p className="text-xs text-muted-foreground mb-2">
          Enter your Usercentrics Settings ID to fetch real services and categories.
        </p>
        <div className="flex gap-2">
          <Input
            value={settingsId}
            onChange={(e) => setSettingsId(e.target.value)}
            placeholder="e.g., ABC123xyz"
            className="h-8 text-sm flex-1"
          />
          <button
            onClick={() =>
              dispatch({ type: 'SET_SETTINGS_ID', payload: settingsId })
            }
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

        <div className="space-y-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="rounded-lg border border-border overflow-hidden"
            >
              {/* Category header */}
              <div className="flex items-center gap-2 p-3 bg-secondary/50">
                <GripVertical
                  size={14}
                  className="text-muted-foreground opacity-40"
                />
                <Input
                  value={category.label}
                  onChange={(e) => {
                    const newCategories = categories.map((c) =>
                      c.id === category.id
                        ? { ...c, label: e.target.value }
                        : c
                    );
                    dispatch({
                      type: 'SET_CATEGORIES',
                      payload: newCategories,
                    });
                  }}
                  className="h-6 text-xs font-medium border-none bg-transparent p-0 focus-visible:ring-0"
                />
              </div>

              {/* Services */}
              <div className="p-2 space-y-2">
                {category.services.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-start gap-2 p-2 rounded-md hover:bg-secondary/30"
                  >
                    <div className="flex-1 space-y-1.5">
                      <Input
                        value={service.name}
                        onChange={(e) =>
                          handleUpdateService(service.id, {
                            name: e.target.value,
                          })
                        }
                        className="h-6 text-xs border-none bg-transparent p-0 focus-visible:ring-0 font-medium"
                      />
                      <Input
                        value={service.description}
                        onChange={(e) =>
                          handleUpdateService(service.id, {
                            description: e.target.value,
                          })
                        }
                        className="h-5 text-[11px] border-none bg-transparent p-0 focus-visible:ring-0 text-muted-foreground"
                      />
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={service.isEssential}
                            onChange={(e) =>
                              handleUpdateService(service.id, {
                                isEssential: e.target.checked,
                                consent: e.target.checked || service.consent,
                              })
                            }
                            className="w-3 h-3"
                          />
                          <span className="text-[10px] text-muted-foreground">
                            Essential
                          </span>
                        </label>
                        <Label
                          className={cn(
                            'text-[10px]',
                            service.consent
                              ? 'text-success'
                              : 'text-muted-foreground'
                          )}
                        >
                          {service.consent ? 'Consent: On' : 'Consent: Off'}
                        </Label>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveService(service.id)}
                      className="p-1 text-muted-foreground hover:text-destructive transition-colors cursor-pointer shrink-0"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => handleAddService(category.id)}
                  className="w-full flex items-center justify-center gap-1 py-1.5 text-xs text-muted-foreground hover:text-foreground border border-dashed border-border rounded-md transition-colors cursor-pointer"
                >
                  <Plus size={12} />
                  Add Service
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
