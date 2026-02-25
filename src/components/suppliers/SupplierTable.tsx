import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { MoreHorizontal, MapPin } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SupplierTierBadge } from './SupplierTierBadge';
import { SupplierComplianceBadge } from './SupplierComplianceBadge';
import { cn } from '@/lib/utils';
import type { RichSupplier } from '@/types/supplier';

interface SupplierTableProps {
  suppliers: RichSupplier[];
  selectedIds: Set<string>;
  onSelectionChange: (ids: Set<string>) => void;
  onViewDetails: (supplier: RichSupplier) => void;
}

export function SupplierTable({
  suppliers,
  selectedIds,
  onSelectionChange,
  onViewDetails,
}: SupplierTableProps) {
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(new Set(suppliers.map((s) => s.id)));
    } else {
      onSelectionChange(new Set());
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSelection = new Set(selectedIds);
    if (checked) {
      newSelection.add(id);
    } else {
      newSelection.delete(id);
    }
    onSelectionChange(newSelection);
  };

  const allSelected = suppliers.length > 0 && selectedIds.size === suppliers.length;
  const someSelected = selectedIds.size > 0 && selectedIds.size < suppliers.length;

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600';
    if (score >= 75) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                    className={someSelected ? 'data-[state=checked]:bg-primary/50' : ''}
                  />
                </TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead className="text-center">Score</TableHead>
                <TableHead>Compliance</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead className="text-center">Styles</TableHead>
                <TableHead className="text-center">Pass Rate</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.map((supplier) => (
                <TableRow
                  key={supplier.id}
                  className="cursor-pointer hover:bg-muted/40 transition-colors duration-200"
                  onClick={() => onViewDetails(supplier)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedIds.has(supplier.id)}
                      onCheckedChange={(checked) => handleSelectOne(supplier.id, !!checked)}
                      aria-label={`Select ${supplier.name}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0",
                        supplier.status === 'active' && "bg-emerald-100 text-emerald-700",
                        supplier.status === 'at-risk' && "bg-amber-100 text-amber-700",
                        supplier.status === 'inactive' && "bg-gray-100 text-gray-700"
                      )}>
                        {supplier.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium tracking-[-0.01em]">{supplier.name}</p>
                        <p className="text-xs text-muted-foreground">{supplier.code}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      {supplier.city ? `${supplier.city}, ${supplier.country}` : supplier.country}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{supplier.primaryContact?.name || '-'}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                        {supplier.primaryContact?.email || '-'}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={cn('text-lg font-bold', getScoreColor(supplier.overallScore))}>
                      {supplier.overallScore}
                    </span>
                  </TableCell>
                  <TableCell>
                    <SupplierComplianceBadge status={supplier.complianceStatus} />
                  </TableCell>
                  <TableCell>
                    <SupplierTierBadge tier={supplier.tier} />
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-medium">{supplier.activeStyles}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 min-w-[100px]">
                      <Progress value={supplier.passRate} className="h-2 flex-1" />
                      <span className="text-xs font-medium w-12">{supplier.passRate}%</span>
                    </div>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onViewDetails(supplier)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => window.open('https://suppllier-uki-questionnaire.manus.space/', '_blank')}>
                          Send Questionnaire
                        </DropdownMenuItem>
                        <DropdownMenuItem>Request Documents</DropdownMenuItem>
                        <DropdownMenuItem>Schedule Audit</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {suppliers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                    No suppliers found matching your filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
