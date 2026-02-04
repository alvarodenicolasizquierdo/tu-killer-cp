import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { GripVertical, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WidgetConfig } from './WidgetCatalog';

interface SortableWidgetItemProps {
  widget: WidgetConfig;
  onRemove: (widgetId: string) => void;
}

export function SortableWidgetItem({ widget, onRemove }: SortableWidgetItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: isDragging ? 0.8 : 1, y: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className={`flex items-center gap-3 p-3 rounded-lg border bg-card hover:border-primary/30 transition-colors group ${
        isDragging ? 'shadow-lg border-primary/50 z-50' : ''
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-muted transition-colors touch-none"
        aria-label="Drag to reorder"
      >
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </button>
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
        onClick={() => onRemove(widget.id)}
      >
        <X className="w-4 h-4" />
      </Button>
    </motion.div>
  );
}
