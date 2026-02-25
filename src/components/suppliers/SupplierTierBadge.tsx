import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { SupplierTier } from '@/types/supplier';

interface SupplierTierBadgeProps {
  tier: SupplierTier;
  className?: string;
}

const tierConfig: Record<SupplierTier, { label: string; className: string }> = {
  strategic: {
    label: 'Strategic',
    className: 'bg-violet-100 text-violet-700 border-violet-200',
  },
  preferred: {
    label: 'Preferred',
    className: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  approved: {
    label: 'Approved',
    className: 'bg-slate-100 text-slate-700 border-slate-200',
  },
  probation: {
    label: 'Probation',
    className: 'bg-orange-100 text-orange-700 border-orange-200',
  },
};

export function SupplierTierBadge({ tier, className }: SupplierTierBadgeProps) {
  const config = tierConfig[tier];
  
  return (
    <Badge variant="outline" className={cn('text-xs font-medium', config.className, className)}>
      {config.label}
    </Badge>
  );
}
