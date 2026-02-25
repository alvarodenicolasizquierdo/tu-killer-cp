import { CheckCircle2, Clock, Loader2, AlertCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ExtendedInspectionStatus } from '@/data/mockInspections';

interface WorkflowStep {
  id: ExtendedInspectionStatus;
  label: string;
  icon: React.ElementType;
}

const workflowSteps: WorkflowStep[] = [
  { id: 'scheduled', label: 'Scheduled', icon: Clock },
  { id: 'in_progress', label: 'In Progress', icon: Loader2 },
  { id: 'pending_review', label: 'Review', icon: AlertCircle },
  { id: 'completed', label: 'Completed', icon: CheckCircle2 },
];

interface InspectionWorkflowProgressProps {
  currentStatus: string;
  className?: string;
}

export function InspectionWorkflowProgress({ currentStatus, className }: InspectionWorkflowProgressProps) {
  // Map legacy status to extended status
  const statusMap: Record<string, ExtendedInspectionStatus> = {
    'scheduled': 'scheduled',
    'in_progress': 'in_progress',
    'pending_review': 'pending_review',
    'completed': 'completed',
    'cancelled': 'cancelled',
    'postponed': 'on_hold',
    'on_hold': 'on_hold',
  };

  const mappedStatus = statusMap[currentStatus] || 'scheduled';

  // Handle cancelled/on_hold states
  if (mappedStatus === 'cancelled' || mappedStatus === 'on_hold') {
    return (
      <div className={cn('flex items-center gap-2 p-3 rounded-lg bg-muted/50', className)}>
        <XCircle className="h-5 w-5 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">
          {currentStatus === 'cancelled' ? 'Inspection Cancelled' : 'Inspection On Hold'}
        </span>
      </div>
    );
  }

  const currentIndex = workflowSteps.findIndex(step => step.id === mappedStatus);

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between">
        {workflowSteps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isPending = index > currentIndex;
          const Icon = step.icon;

          return (
            <div key={step.id} className="flex-1 flex items-center">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all',
                    isCompleted && 'bg-emerald-500 border-emerald-500 text-white',
                    isCurrent && 'bg-primary border-primary text-primary-foreground',
                    isPending && 'bg-background border-muted-foreground/30 text-muted-foreground'
                  )}
                >
                  <Icon className={cn(
                    'h-5 w-5',
                    isCurrent && step.id === 'in_progress' && 'animate-spin'
                  )} />
                </div>
                <span
                  className={cn(
                    'text-xs font-medium text-center',
                    isCompleted && 'text-emerald-600',
                    isCurrent && 'text-primary',
                    isPending && 'text-muted-foreground'
                  )}
                >
                  {step.label}
                </span>
              </div>
              
              {index < workflowSteps.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-2',
                    index < currentIndex ? 'bg-emerald-500' : 'bg-muted-foreground/20'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default InspectionWorkflowProgress;
