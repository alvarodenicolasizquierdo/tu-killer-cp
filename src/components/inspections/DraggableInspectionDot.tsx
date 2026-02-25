import { useMemo } from 'react';
import { Inspection, InspectionType } from '@/types';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

interface DraggableInspectionDotProps {
  inspection: Inspection;
  onDragStart: () => void;
  onDragEnd: () => void;
  isDragging: boolean;
}

const DraggableInspectionDot = ({ 
  inspection, 
  onDragStart, 
  onDragEnd,
  isDragging 
}: DraggableInspectionDotProps) => {
  const getTypeColor = (type: InspectionType) => {
    switch (type) {
      case 'factory_audit': return 'bg-blue-500';
      case 'quality_check': return 'bg-emerald-500';
      case 'social_compliance': return 'bg-purple-500';
      case 'environmental': return 'bg-green-500';
      case 'pre_shipment': return 'bg-amber-500';
    }
  };

  const canDrag = inspection.status !== 'completed' && inspection.status !== 'cancelled';

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <div
            draggable={canDrag}
            onDragStart={(e) => {
              if (!canDrag) {
                e.preventDefault();
                return;
              }
              e.dataTransfer.effectAllowed = 'move';
              e.dataTransfer.setData('text/plain', inspection.id);
              onDragStart();
            }}
            onDragEnd={onDragEnd}
            className={`
              w-2 h-2 rounded-full ${getTypeColor(inspection.type)}
              ${canDrag ? 'cursor-grab active:cursor-grabbing hover:scale-150 hover:ring-2 hover:ring-offset-1 hover:ring-primary/50' : 'cursor-default opacity-60'}
              ${isDragging ? 'opacity-50 scale-75' : ''}
              transition-all duration-150
            `}
          />
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-1">
            <p className="font-medium text-sm">{inspection.title}</p>
            <p className="text-xs text-muted-foreground">{inspection.factoryName}</p>
            {canDrag && (
              <p className="text-xs text-primary">Drag to reschedule</p>
            )}
            {!canDrag && (
              <p className="text-xs text-muted-foreground italic">
                {inspection.status === 'completed' ? 'Completed - cannot reschedule' : 'Cancelled'}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default DraggableInspectionDot;
