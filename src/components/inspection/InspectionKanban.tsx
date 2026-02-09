import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { DndContext, DragOverlay, closestCorners, useDraggable, useDroppable, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { InspectionTypeBadge } from './InspectionTypeBadge';
import { InspectionResultBadge } from './InspectionResultBadge';
import { InspectionRiskBadge } from './InspectionRiskBadge';
import { cn } from '@/lib/utils';
import type { RichInspection, ExtendedInspectionStatus } from '@/data/mockInspections';

interface InspectionKanbanProps {
  inspections: RichInspection[];
  onStatusChange: (inspectionId: string, newStatus: ExtendedInspectionStatus) => void;
}

const statusColumns: { id: ExtendedInspectionStatus; label: string; color: string }[] = [
  { id: 'scheduled', label: 'Scheduled', color: 'border-t-blue-500' },
  { id: 'in_progress', label: 'In Progress', color: 'border-t-amber-500' },
  { id: 'pending_review', label: 'Pending Review', color: 'border-t-orange-500' },
  { id: 'completed', label: 'Completed', color: 'border-t-emerald-500' },
];

// Draggable card component
function DraggableCard({ inspection }: { inspection: RichInspection }) {
  const navigate = useNavigate();
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: inspection.id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const handleClick = () => {
    const detailId = inspection.id.replace('ins-', 'insp-');
    navigate(`/inspections/${detailId}`);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        'touch-none',
        isDragging && 'opacity-50'
      )}
    >
      <Card
        className="cursor-grab active:cursor-grabbing hover:shadow-md transition-all duration-300 hover:-translate-y-px"
        onClick={handleClick}
      >
        <CardContent className="p-3 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold tracking-[-0.01em] text-primary">{inspection.inspectionNumber}</span>
            <InspectionTypeBadge typeCode={inspection.typeCode} />
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground">{inspection.poNumber}</p>
            <p className="text-sm font-medium tracking-[-0.01em] line-clamp-1">{inspection.productName}</p>
          </div>

          <div className="text-xs text-muted-foreground">
            <p className="font-medium text-foreground">{inspection.supplierName}</p>
            <p>{inspection.factoryName}</p>
          </div>

          <div className="flex items-center justify-between pt-1.5 border-t border-border/50">
            <div className="flex items-center gap-1.5">
              <Avatar className="h-5 w-5">
                <AvatarImage src={inspection.inspectorAvatar} />
                <AvatarFallback className="text-[10px]">
                  {inspection.inspectorName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs">{format(parseISO(inspection.scheduledDate), 'MMM d')}</span>
            </div>
            <div className="flex items-center gap-2">
              <InspectionRiskBadge risk={inspection.riskLevel} />
              {inspection.score !== undefined && (
                <span className={cn(
                  'text-xs font-semibold',
                  inspection.score >= 80 ? 'text-emerald-600' :
                  inspection.score >= 60 ? 'text-amber-600' : 'text-red-600'
                )}>
                  {inspection.score}%
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Droppable column component
function DroppableColumn({ 
  column, 
  inspections 
}: { 
  column: typeof statusColumns[number]; 
  inspections: RichInspection[];
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <div className="flex-1 min-w-[280px]">
      <Card className={cn('h-full border-t-4 shadow-sm', column.color)}>
        <CardHeader className="p-3 pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold tracking-[-0.01em]">{column.label}</CardTitle>
            <Badge variant="secondary" className="text-xs font-medium">
              {inspections.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-2 pt-0">
          <ScrollArea className="h-[calc(100vh-350px)]">
            <div
              ref={setNodeRef}
              className={cn(
                'space-y-2 min-h-[200px] p-1 rounded-md transition-colors',
                isOver && 'bg-muted/50'
              )}
            >
              {inspections.map((inspection) => (
                <DraggableCard key={inspection.id} inspection={inspection} />
              ))}
              {inspections.length === 0 && (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  No inspections
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

export function InspectionKanban({ inspections, onStatusChange }: InspectionKanbanProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const activeInspection = activeId ? inspections.find(i => i.id === activeId) : null;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const inspection = inspections.find(i => i.id === active.id);
      const newStatus = over.id as ExtendedInspectionStatus;
      
      if (inspection && statusColumns.some(col => col.id === newStatus)) {
        onStatusChange(active.id as string, newStatus);
      }
    }
  };

  const getInspectionsByStatus = (status: ExtendedInspectionStatus) => {
    return inspections.filter(i => i.status === status);
  };

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {statusColumns.map((column) => (
          <DroppableColumn
            key={column.id}
            column={column}
            inspections={getInspectionsByStatus(column.id)}
          />
        ))}
      </div>

      <DragOverlay>
        {activeInspection && (
          <div className="opacity-90">
            <Card className="shadow-lg">
              <CardContent className="p-3">
                <p className="text-sm font-medium">{activeInspection.inspectionNumber}</p>
                <p className="text-xs text-muted-foreground">{activeInspection.productName}</p>
              </CardContent>
            </Card>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}

export default InspectionKanban;
