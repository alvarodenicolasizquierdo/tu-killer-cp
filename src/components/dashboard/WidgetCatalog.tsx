import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
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
  Plus,
} from 'lucide-react';
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
import { SortableWidgetItem } from './SortableWidgetItem';

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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = enabledWidgets.findIndex(w => w.id === active.id);
      const newIndex = enabledWidgets.findIndex(w => w.id === over.id);
      
      const reorderedEnabled = arrayMove(enabledWidgets, oldIndex, newIndex);
      
      // Update order values based on new positions
      const updatedWidgets = widgets.map(w => {
        const newOrderIndex = reorderedEnabled.findIndex(ew => ew.id === w.id);
        if (newOrderIndex !== -1) {
          return { ...w, order: newOrderIndex };
        }
        return w;
      });
      
      onReorderWidgets(updatedWidgets);
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
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={enabledWidgets.map(w => w.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  <AnimatePresence>
                    {enabledWidgets.map((widget) => (
                      <SortableWidgetItem
                        key={widget.id}
                        widget={widget}
                        onRemove={onToggleWidget}
                      />
                    ))}
                  </AnimatePresence>
                  {enabledWidgets.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No widgets enabled. Add widgets from the catalog below.
                    </p>
                  )}
                </div>
              </SortableContext>
            </DndContext>
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
