import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';
import type { SupplierComplianceStatus } from '@/types/supplier';

interface SupplierComplianceBadgeProps {
  status: SupplierComplianceStatus;
  className?: string;
}

const complianceConfig: Record<SupplierComplianceStatus, { 
  label: string; 
  className: string;
  Icon: typeof CheckCircle;
}> = {
  compliant: {
    label: 'Compliant',
    className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Icon: CheckCircle,
  },
  at_risk: {
    label: 'At Risk',
    className: 'bg-amber-100 text-amber-700 border-amber-200',
    Icon: AlertTriangle,
  },
  non_compliant: {
    label: 'Non-Compliant',
    className: 'bg-red-100 text-red-700 border-red-200',
    Icon: XCircle,
  },
  pending_audit: {
    label: 'Pending Audit',
    className: 'bg-slate-100 text-slate-600 border-slate-200',
    Icon: Clock,
  },
};

export function SupplierComplianceBadge({ status, className }: SupplierComplianceBadgeProps) {
  const config = complianceConfig[status];
  const { Icon } = config;
  
  return (
    <Badge variant="outline" className={cn('text-xs font-medium gap-1', config.className, className)}>
      <Icon className="w-3 h-3" />
      {config.label}
    </Badge>
  );
}
