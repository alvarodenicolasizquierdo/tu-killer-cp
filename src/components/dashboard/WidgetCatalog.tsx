import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutGrid, 
  Target, 
  FlaskConical, 
  BarChart3, 
  AlertTriangle, 
  Bell,
  TrendingUp,
  FileText,
  Users,
  X,
  Plus,
  GripVertical
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';

export interface WidgetConfig {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'operational' | 'analytics' | 'alerts';
  enabled: boolean;
  order: number;
}

interface WidgetCatalogProps {
  widgets: WidgetConfig[];
  onToggleWidget: (widgetId: string) => void;
  onReorderWidgets: (widgets: WidgetConfig[]) => void;
}

const widgetCatalogItems: Omit<WidgetConfig, 'enabled' | 'order'>[] = [
  {
    id: 'regulatory_alerts',
    name: 'Regulatory Alerts',
    description: 'Stay updated on regulatory changes requiring acknowledgment',
    icon: <AlertTriangle className="w-5 h-5" />,
    category: 'alerts',
  },
  {
    id: 'tasks',
    name: 'Priority Tasks',
    description: 'AI-prioritized actions based on impact and urgency',
    icon: <Target className="w-5 h-5" />,
    category: 'operational',
  },
  {
    id: 'lab_queue',
    name: 'Lab Queue',
    description: 'Real-time view of testing workload and priorities',
    icon: <FlaskConical className="w-5 h-5" />,
    category: 'operational',
  },
  {
    id: 'kpis',
    name: 'KPI Summary',
    description: 'Key performance indicators at a glance',
    icon: <BarChart3 className="w-5 h-5" />,
    category: 'analytics',
  },
  {
    id: 'activity_feed',
    name: 'Activity Feed',
    description: 'Recent activity across your organization',
    icon: <Bell className="w-5 h-5" />,
    category: 'operational',
  },
  {
    id: 'trends',
    name: 'Compliance Trends',
    description: 'Track compliance metrics over time',
    icon: <TrendingUp className="w-5 h-5" />,
    category: 'analytics',
  },
  {
    id: 'draft_resume',
    name: 'Draft Resume',
    description: 'Quick access to your in-progress work',
    icon: <FileText className="w-5 h-5" />,
    category: 'operational',
  },
  {
    id: 'supplier_overview',
    name: 'Supplier Overview',
    description: 'Top suppliers by risk and performance',
    icon: <Users className="w-5 h-5" />,
    category: 'operational',
  },
];

const categoryLabels = {
  operational: 'Operational',
  analytics: 'Analytics',
  alerts: 'Alerts & Notifications',
};

export function WidgetCatalog({ widgets, onToggleWidget, onReorderWidgets }: WidgetCatalogProps) {
  const enabledWidgets = widgets.filter(w => w.enabled).sort((a, b) => a.order - b.order);
  const availableWidgets = widgetCatalogItems.filter(
    item => !widgets.find(w => w.id === item.id && w.enabled)
  );

  const handleMoveUp = (widgetId: string) => {
    const widgetIndex = enabledWidgets.findIndex(w => w.id === widgetId);
    if (widgetIndex <= 0) return;
    
    const newWidgets = [...widgets];
    const currentWidget = newWidgets.find(w => w.id === widgetId);
    const previousWidget = newWidgets.find(w => w.id === enabledWidgets[widgetIndex - 1].id);
    
    if (currentWidget && previousWidget) {
      const tempOrder = currentWidget.order;
      currentWidget.order = previousWidget.order;
      previousWidget.order = tempOrder;
      onReorderWidgets(newWidgets);
    }
  };

  const handleMoveDown = (widgetId: string) => {
    const widgetIndex = enabledWidgets.findIndex(w => w.id === widgetId);
    if (widgetIndex >= enabledWidgets.length - 1) return;
    
    const newWidgets = [...widgets];
    const currentWidget = newWidgets.find(w => w.id === widgetId);
    const nextWidget = newWidgets.find(w => w.id === enabledWidgets[widgetIndex + 1].id);
    
    if (currentWidget && nextWidget) {
      const tempOrder = currentWidget.order;
      currentWidget.order = nextWidget.order;
      nextWidget.order = tempOrder;
      onReorderWidgets(newWidgets);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <LayoutGrid className="w-4 h-4" />
          Configure Widgets
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-primary" />
            Widget Configuration
          </SheetTitle>
          <SheetDescription>
            Customize your dashboard by adding, removing, or reordering widgets.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Active Widgets */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full" />
              Active Widgets ({enabledWidgets.length})
            </h4>
            <div className="space-y-2">
              <AnimatePresence>
                {enabledWidgets.map((widget, index) => (
                  <motion.div
                    key={widget.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:border-primary/30 transition-colors group"
                  >
                    <div className="flex flex-col gap-0.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5"
                        onClick={() => handleMoveUp(widget.id)}
                        disabled={index === 0}
                      >
                        <GripVertical className="w-3 h-3 rotate-90" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5"
                        onClick={() => handleMoveDown(widget.id)}
                        disabled={index === enabledWidgets.length - 1}
                      >
                        <GripVertical className="w-3 h-3 rotate-90" />
                      </Button>
                    </div>
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      {widget.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground">{widget.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{widget.description}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                      onClick={() => onToggleWidget(widget.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
              {enabledWidgets.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No widgets enabled. Add widgets from the catalog below.
                </p>
              )}
            </div>
          </div>

          {/* Available Widgets by Category */}
          {Object.entries(categoryLabels).map(([category, label]) => {
            const categoryWidgets = availableWidgets.filter(w => w.category === category);
            if (categoryWidgets.length === 0) return null;

            return (
              <div key={category}>
                <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {label}
                  </Badge>
                </h4>
                <div className="space-y-2">
                  {categoryWidgets.map((widget) => (
                    <motion.div
                      key={widget.id}
                      whileHover={{ scale: 1.01 }}
                      className="flex items-center gap-3 p-3 rounded-lg border border-dashed bg-muted/30 hover:bg-muted/50 hover:border-primary/30 transition-colors cursor-pointer group"
                      onClick={() => onToggleWidget(widget.id)}
                    >
                      <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                        {widget.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground">{widget.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{widget.description}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-primary"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export { widgetCatalogItems };
