import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, AlertTriangle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { InspectionResult } from '@/data/mockInspections';

interface InspectionResultBadgeProps {
  result: InspectionResult;
  className?: string;
}

const resultConfig: Record<InspectionResult, {
  label: string;
  className: string;
  icon: React.ElementType;
}> = {
  pass: {
    label: 'Pass',
    className: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
    icon: CheckCircle2,
  },
  fail: {
    label: 'Fail',
    className: 'bg-red-500/10 text-red-600 border-red-200',
    icon: XCircle,
  },
  conditional: {
    label: 'Conditional',
    className: 'bg-amber-500/10 text-amber-600 border-amber-200',
    icon: AlertTriangle,
  },
  pending: {
    label: '—',
    className: 'bg-muted/50 text-muted-foreground border-transparent',
    icon: Clock,
  },
};

export function InspectionResultBadge({ result, className }: InspectionResultBadgeProps) {
  const config = resultConfig[result];
  const Icon = config.icon;

  if (result === 'pending') {
    return <span className="text-muted-foreground">—</span>;
  }

  return (
    <Badge 
      variant="outline" 
      className={cn(
        'flex items-center gap-1',
        config.className,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}

export default InspectionResultBadge;
