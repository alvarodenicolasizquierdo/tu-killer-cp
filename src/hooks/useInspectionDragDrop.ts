import { useState, useCallback } from 'react';
import { format } from 'date-fns';
import { Inspection } from '@/types';

interface DragState {
  isDragging: boolean;
  draggedInspection: Inspection | null;
  sourceDate: Date | null;
}

interface UseInspectionDragDropReturn {
  dragState: DragState;
  handleDragStart: (inspection: Inspection, sourceDate: Date) => void;
  handleDragEnd: () => void;
  handleDrop: (targetDate: Date, onReschedule: (inspectionId: string, newDate: string) => void) => void;
  isDragOver: string | null;
  setIsDragOver: (dateKey: string | null) => void;
}

export const useInspectionDragDrop = (): UseInspectionDragDropReturn => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedInspection: null,
    sourceDate: null,
  });
  const [isDragOver, setIsDragOver] = useState<string | null>(null);

  const handleDragStart = useCallback((inspection: Inspection, sourceDate: Date) => {
    // Only allow rescheduling non-completed inspections
    if (inspection.status === 'completed' || inspection.status === 'cancelled') {
      return;
    }
    
    setDragState({
      isDragging: true,
      draggedInspection: inspection,
      sourceDate,
    });
  }, []);

  const handleDragEnd = useCallback(() => {
    setDragState({
      isDragging: false,
      draggedInspection: null,
      sourceDate: null,
    });
    setIsDragOver(null);
  }, []);

  const handleDrop = useCallback((
    targetDate: Date, 
    onReschedule: (inspectionId: string, newDate: string) => void
  ) => {
    const { draggedInspection, sourceDate } = dragState;
    
    if (!draggedInspection || !sourceDate) return;
    
    // Don't reschedule if dropped on same date
    if (format(targetDate, 'yyyy-MM-dd') === format(sourceDate, 'yyyy-MM-dd')) {
      handleDragEnd();
      return;
    }
    
    // Call the reschedule callback
    const newDateStr = format(targetDate, 'yyyy-MM-dd');
    onReschedule(draggedInspection.id, newDateStr);
    
    handleDragEnd();
  }, [dragState, handleDragEnd]);

  return {
    dragState,
    handleDragStart,
    handleDragEnd,
    handleDrop,
    isDragOver,
    setIsDragOver,
  };
};
