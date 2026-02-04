import { useState, useCallback } from 'react';
import { WidgetConfig, widgetCatalogItems } from '@/components/dashboard/WidgetCatalog';

const DEFAULT_WIDGETS: WidgetConfig[] = [
  {
    ...widgetCatalogItems.find(w => w.id === 'regulatory_alerts')!,
    enabled: true,
    order: 0,
  },
  {
    ...widgetCatalogItems.find(w => w.id === 'tasks')!,
    enabled: true,
    order: 1,
  },
  {
    ...widgetCatalogItems.find(w => w.id === 'kpis')!,
    enabled: true,
    order: 2,
  },
  {
    ...widgetCatalogItems.find(w => w.id === 'activity_feed')!,
    enabled: true,
    order: 3,
  },
];

// Initialize all widgets (enabled and disabled)
const initializeWidgets = (): WidgetConfig[] => {
  const storedWidgets = localStorage.getItem('dashboard-widgets');
  if (storedWidgets) {
    try {
      const parsed = JSON.parse(storedWidgets);
      // Merge with catalog to ensure all icons are present
      return parsed.map((stored: WidgetConfig) => {
        const catalogItem = widgetCatalogItems.find(w => w.id === stored.id);
        return catalogItem ? { ...catalogItem, enabled: stored.enabled, order: stored.order } : stored;
      });
    } catch {
      return DEFAULT_WIDGETS;
    }
  }
  return DEFAULT_WIDGETS;
};

export function useWidgetConfig() {
  const [widgets, setWidgets] = useState<WidgetConfig[]>(initializeWidgets);

  const toggleWidget = useCallback((widgetId: string) => {
    setWidgets(prev => {
      const existing = prev.find(w => w.id === widgetId);
      let newWidgets: WidgetConfig[];

      if (existing) {
        // Toggle existing widget
        newWidgets = prev.map(w => 
          w.id === widgetId ? { ...w, enabled: !w.enabled } : w
        );
      } else {
        // Add new widget from catalog
        const catalogItem = widgetCatalogItems.find(w => w.id === widgetId);
        if (!catalogItem) return prev;
        
        const maxOrder = Math.max(...prev.filter(w => w.enabled).map(w => w.order), -1);
        newWidgets = [...prev, { ...catalogItem, enabled: true, order: maxOrder + 1 }];
      }

      localStorage.setItem('dashboard-widgets', JSON.stringify(newWidgets));
      return newWidgets;
    });
  }, []);

  const reorderWidgets = useCallback((newWidgets: WidgetConfig[]) => {
    setWidgets(newWidgets);
    localStorage.setItem('dashboard-widgets', JSON.stringify(newWidgets));
  }, []);

  const enabledWidgets = widgets
    .filter(w => w.enabled)
    .sort((a, b) => a.order - b.order);

  const isWidgetEnabled = useCallback((widgetId: string) => {
    return widgets.find(w => w.id === widgetId)?.enabled ?? false;
  }, [widgets]);

  return {
    widgets,
    enabledWidgets,
    toggleWidget,
    reorderWidgets,
    isWidgetEnabled,
  };
}
