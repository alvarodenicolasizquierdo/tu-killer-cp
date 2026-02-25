import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { InspectionTypeCode } from '@/data/mockInspections';

interface InspectionTypeBadgeProps {
  typeCode: InspectionTypeCode;
  className?: string;
}

const typeConfig: Record<InspectionTypeCode, {
  label: string;
  className: string;
}> = {
  PPI: {
    label: 'PPI',
    className: 'bg-purple-500/10 text-purple-600 border-purple-200',
  },
  DPI: {
    label: 'DPI',
    className: 'bg-blue-500/10 text-blue-600 border-blue-200',
  },
  FRI: {
    label: 'FRI',
    className: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
  },
  CLI: {
    label: 'CLI',
    className: 'bg-amber-500/10 text-amber-600 border-amber-200',
  },
  FA: {
    label: 'FA',
    className: 'bg-rose-500/10 text-rose-600 border-rose-200',
  },
};

export function InspectionTypeBadge({ typeCode, className }: InspectionTypeBadgeProps) {
  const config = typeConfig[typeCode];

  return (
    <Badge 
      variant="outline" 
      className={cn(
        'font-mono text-xs',
        config.className,
        className
      )}
    >
      {config.label}
    </Badge>
  );
}

export default InspectionTypeBadge;
