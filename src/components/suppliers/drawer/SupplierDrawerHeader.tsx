import { MapPin } from 'lucide-react';
import { SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { SupplierTierBadge } from '../SupplierTierBadge';
import { SupplierComplianceBadge } from '../SupplierComplianceBadge';
import { cn } from '@/lib/utils';
import type { RichSupplier } from '@/types/supplier';

interface SupplierDrawerHeaderProps {
  supplier: RichSupplier;
}

export function SupplierDrawerHeader({ supplier }: SupplierDrawerHeaderProps) {
  return (
    <SheetHeader>
      <div className="flex items-start gap-4">
        <div className={cn(
          "w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold shrink-0",
          supplier.status === 'active' && "bg-emerald-100 text-emerald-700",
          supplier.status === 'at-risk' && "bg-amber-100 text-amber-700",
          supplier.status === 'inactive' && "bg-gray-100 text-gray-700"
        )}>
          {supplier.name.substring(0, 2).toUpperCase()}
        </div>
        <div className="flex-1">
          <SheetTitle className="text-xl">{supplier.name}</SheetTitle>
          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            {supplier.city ? `${supplier.city}, ${supplier.country}` : supplier.country}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <SupplierTierBadge tier={supplier.tier} />
            <SupplierComplianceBadge status={supplier.complianceStatus} />
          </div>
        </div>
      </div>
    </SheetHeader>
  );
}
