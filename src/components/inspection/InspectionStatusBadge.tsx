import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, Clock, Pause, XCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ExtendedInspectionStatus } from '@/data/mockInspections';

interface InspectionStatusBadgeProps {
  status: ExtendedInspectionStatus;
  animated?: boolean;
  className?: string;
}

const statusConfig: Record<ExtendedInspectionStatus, {
  label: string;
  className: string;
  icon?: React.ElementType;
  animate?: boolean;
}> = {
  scheduled: {
    label: 'Scheduled',
    className: 'bg-blue-500/10 text-blue-600 border-blue-200',
    icon: Clock,
  },
  in_progress: {
    label: 'In Progress',
    className: 'bg-amber-500/10 text-amber-600 border-amber-200',
    icon: Loader2,
    animate: true,
  },
  pending_review: {
    label: 'Pending Review',
    className: 'bg-orange-500/10 text-orange-600 border-orange-200',
    icon: AlertCircle,
  },
  completed: {
    label: 'Completed',
    className: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
    icon: CheckCircle2,
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-red-500/10 text-red-600 border-red-200',
    icon: XCircle,
  },
  on_hold: {
    label: 'On Hold',
    className: 'bg-muted text-muted-foreground',
    icon: Pause,
  },
};

export function InspectionStatusBadge({ status, animated = true, className }: InspectionStatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge 
      variant="outline" 
      className={cn(
        'flex items-center gap-1',
        config.className,
        className
      )}
    >
      {Icon && (
        <Icon className={cn(
          'h-3 w-3',
          animated && config.animate && 'animate-spin'
        )} />
      )}
      {config.label}
    </Badge>
  );
}

export default InspectionStatusBadge;
