import { Download, UserPlus, RefreshCw, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import type { RichInspection, ExtendedInspectionStatus } from '@/data/mockInspections';
import { exportInspectionsToCSV, downloadCSV } from '@/data/mockInspections';

interface InspectionBulkActionsProps {
  selectedIds: Set<string>;
  inspections: RichInspection[];
  onClearSelection: () => void;
  onStatusChange: (ids: string[], newStatus: ExtendedInspectionStatus) => void;
}

export function InspectionBulkActions({
  selectedIds,
  inspections,
  onClearSelection,
  onStatusChange,
}: InspectionBulkActionsProps) {
  const selectedInspections = inspections.filter(i => selectedIds.has(i.id));

  const handleExport = () => {
    const csvContent = exportInspectionsToCSV(selectedInspections);
    downloadCSV(csvContent, `inspections-export-${new Date().toISOString().split('T')[0]}.csv`);
    toast.success(`Exported ${selectedInspections.length} inspection(s) to CSV`);
  };

  const handleStatusChange = (status: ExtendedInspectionStatus) => {
    onStatusChange(Array.from(selectedIds), status);
    toast.success(`Updated ${selectedIds.size} inspection(s) to ${status.replace('_', ' ')}`);
  };

  const handleAssign = () => {
    toast.info('Assign functionality - would open inspector selection dialog');
  };

  if (selectedIds.size === 0) return null;

  return (
    <div className="flex items-center gap-2 p-3 bg-primary/5 border border-primary/20 rounded-lg">
      <Badge variant="secondary" className="font-normal">
        {selectedIds.size} selected
      </Badge>

      <div className="h-4 w-px bg-border" />

      <Button variant="outline" size="sm" onClick={handleExport}>
        <Download className="h-4 w-4 mr-1" />
        Export CSV
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-1" />
            Change Status
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => handleStatusChange('scheduled')}>
            Scheduled
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatusChange('in_progress')}>
            In Progress
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatusChange('pending_review')}>
            Pending Review
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatusChange('completed')}>
            Completed
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatusChange('on_hold')}>
            On Hold
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button variant="outline" size="sm" onClick={handleAssign}>
        <UserPlus className="h-4 w-4 mr-1" />
        Assign
      </Button>

      <div className="flex-1" />

      <Button variant="ghost" size="sm" onClick={onClearSelection}>
        <X className="h-4 w-4 mr-1" />
        Clear
      </Button>
    </div>
  );
}

export default InspectionBulkActions;
