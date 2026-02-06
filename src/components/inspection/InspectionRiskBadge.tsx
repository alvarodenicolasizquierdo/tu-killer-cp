import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { RiskLevel } from '@/data/mockInspections';

interface InspectionRiskBadgeProps {
  risk: RiskLevel;
  className?: string;
}

const riskConfig: Record<RiskLevel, {
  label: string;
  className: string;
  dotColor: string;
}> = {
  low: {
    label: 'Low Risk',
    className: 'text-emerald-600',
    dotColor: 'bg-emerald-500',
  },
  medium: {
    label: 'Medium Risk',
    className: 'text-amber-600',
    dotColor: 'bg-amber-500',
  },
  high: {
    label: 'High Risk',
    className: 'text-red-600',
    dotColor: 'bg-red-500',
  },
};

export function InspectionRiskBadge({ risk, className }: InspectionRiskBadgeProps) {
  const config = riskConfig[risk];

  return (
    <span className={cn('flex items-center gap-1.5 text-sm', config.className, className)}>
      <span className={cn('h-2 w-2 rounded-full', config.dotColor)} />
      {config.label}
    </span>
  );
}

export default InspectionRiskBadge;
