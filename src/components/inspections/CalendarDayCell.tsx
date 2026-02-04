import { format, isSameDay } from 'date-fns';
import { motion } from 'framer-motion';
import { Inspection, InspectionType } from '@/types';
import DraggableInspectionDot from './DraggableInspectionDot';

interface CalendarDayCellProps {
  day: Date;
  inspections: Inspection[];
  isSelected: boolean;
  isToday: boolean;
  isDragOver: boolean;
  isDragging: boolean;
  draggedInspectionId: string | null;
  onSelect: (day: Date) => void;
  onDragStart: (inspection: Inspection, date: Date) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent, day: Date) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent, day: Date) => void;
}

const CalendarDayCell = ({
  day,
  inspections,
  isSelected,
  isToday,
  isDragOver,
  isDragging,
  draggedInspectionId,
  onSelect,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
}: CalendarDayCellProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onSelect(day)}
      onDragOver={(e) => onDragOver(e, day)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, day)}
      className={`
        aspect-square p-1 rounded-lg border transition-all relative
        ${isSelected ? 'border-primary bg-primary/10' : 'border-transparent hover:border-border'}
        ${isToday ? 'bg-accent' : ''}
        ${isDragOver ? 'border-primary border-2 bg-primary/20 ring-2 ring-primary/30' : ''}
        ${isDragging ? 'hover:border-primary hover:bg-primary/10' : ''}
      `}
    >
      <div className="h-full flex flex-col">
        <span className={`text-sm ${isToday ? 'font-bold' : ''}`}>
          {format(day, 'd')}
        </span>
        {inspections.length > 0 && (
          <div className="flex-1 flex flex-wrap gap-0.5 mt-1 overflow-hidden">
            {inspections.slice(0, 3).map(insp => (
              <DraggableInspectionDot
                key={insp.id}
                inspection={insp}
                onDragStart={() => onDragStart(insp, day)}
                onDragEnd={onDragEnd}
                isDragging={draggedInspectionId === insp.id}
              />
            ))}
            {inspections.length > 3 && (
              <span className="text-[10px] text-muted-foreground">+{inspections.length - 3}</span>
            )}
          </div>
        )}
      </div>
      
      {/* Drop indicator overlay */}
      {isDragOver && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 rounded-lg border-2 border-dashed border-primary bg-primary/10 flex items-center justify-center"
        >
          <span className="text-xs font-medium text-primary">Drop here</span>
        </motion.div>
      )}
    </motion.button>
  );
};

export default CalendarDayCell;
