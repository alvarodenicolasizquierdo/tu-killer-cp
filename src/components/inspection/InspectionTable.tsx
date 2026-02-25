import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { InspectionStatusBadge } from './InspectionStatusBadge';
import { InspectionResultBadge } from './InspectionResultBadge';
import { InspectionRiskBadge } from './InspectionRiskBadge';
import { InspectionTypeBadge } from './InspectionTypeBadge';
import type { RichInspection } from '@/data/mockInspections';
import { cn } from '@/lib/utils';

interface InspectionTableProps {
  inspections: RichInspection[];
  selectedIds: Set<string>;
  onSelectionChange: (ids: Set<string>) => void;
}

export function InspectionTable({ inspections, selectedIds, onSelectionChange }: InspectionTableProps) {
  const navigate = useNavigate();

  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    onSelectionChange(newSelection);
  };

  const toggleAll = () => {
    if (selectedIds.size === inspections.length) {
      onSelectionChange(new Set());
    } else {
      onSelectionChange(new Set(inspections.map(i => i.id)));
    }
  };

  const handleRowClick = (inspection: RichInspection) => {
    // Map rich inspection ID to existing detail page format
    const detailId = inspection.id.replace('ins-', 'insp-');
    navigate(`/inspections/${detailId}`);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[40px]">
              <Checkbox
                checked={selectedIds.size === inspections.length && inspections.length > 0}
                onCheckedChange={toggleAll}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead className="w-[140px]">Inspection #</TableHead>
            <TableHead>PO / Product</TableHead>
            <TableHead className="w-[60px]">Type</TableHead>
            <TableHead>Supplier / Factory</TableHead>
            <TableHead>Inspector</TableHead>
            <TableHead className="w-[100px]">Date</TableHead>
            <TableHead className="w-[120px]">Status</TableHead>
            <TableHead className="w-[100px]">Result</TableHead>
            <TableHead className="w-[110px]">Risk</TableHead>
            <TableHead className="w-[60px] text-right">Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inspections.length === 0 ? (
            <TableRow>
              <TableCell colSpan={11} className="h-24 text-center text-muted-foreground">
                No inspections found.
              </TableCell>
            </TableRow>
          ) : (
            inspections.map((inspection) => (
              <TableRow
                key={inspection.id}
                className={cn(
                  'cursor-pointer hover:bg-muted/50 transition-colors',
                  selectedIds.has(inspection.id) && 'bg-muted/30'
                )}
                onClick={() => handleRowClick(inspection)}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedIds.has(inspection.id)}
                    onCheckedChange={() => toggleSelection(inspection.id)}
                    aria-label={`Select ${inspection.inspectionNumber}`}
                  />
                </TableCell>
                <TableCell className="font-medium text-primary">
                  {inspection.inspectionNumber}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm text-muted-foreground">{inspection.poNumber}</p>
                    <p className="font-medium">{inspection.productName}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <InspectionTypeBadge typeCode={inspection.typeCode} />
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{inspection.supplierName}</p>
                    <p className="text-sm text-muted-foreground">
                      {inspection.factoryName}, {inspection.factoryLocation}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={inspection.inspectorAvatar} />
                      <AvatarFallback className="text-xs">
                        {inspection.inspectorName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{inspection.inspectorName}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm">
                  {format(parseISO(inspection.scheduledDate), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  <InspectionStatusBadge status={inspection.status} />
                </TableCell>
                <TableCell>
                  <InspectionResultBadge result={inspection.result} />
                </TableCell>
                <TableCell>
                  <InspectionRiskBadge risk={inspection.riskLevel} />
                </TableCell>
                <TableCell className="text-right">
                  {inspection.score !== undefined ? (
                    <span className={cn(
                      'font-semibold',
                      inspection.score >= 80 ? 'text-emerald-600' :
                      inspection.score >= 60 ? 'text-amber-600' : 'text-red-600'
                    )}>
                      {inspection.score}%
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default InspectionTable;
