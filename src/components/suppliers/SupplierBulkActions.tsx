import { Button } from '@/components/ui/button';
import { Download, Send, FileText, X } from 'lucide-react';
import { toast } from 'sonner';
import { exportSuppliersToCSV, downloadCSV } from '@/data/mockSuppliers';
import type { RichSupplier } from '@/types/supplier';

interface SupplierBulkActionsProps {
  selectedIds: Set<string>;
  suppliers: RichSupplier[];
  onClearSelection: () => void;
}

export function SupplierBulkActions({
  selectedIds,
  suppliers,
  onClearSelection,
}: SupplierBulkActionsProps) {
  if (selectedIds.size === 0) return null;

  const selectedSuppliers = suppliers.filter((s) => selectedIds.has(s.id));

  const handleExportCSV = () => {
    const csvContent = exportSuppliersToCSV(selectedSuppliers);
    downloadCSV(csvContent, `suppliers-export-${new Date().toISOString().split('T')[0]}.csv`);
    toast.success(`Exported ${selectedSuppliers.length} supplier(s) to CSV`);
  };

  const handleSendQuestionnaire = () => {
    window.open('https://suppllier-uki-questionnaire.manus.space/', '_blank');
    toast.success(`Opening questionnaire for ${selectedSuppliers.length} supplier(s)`, {
      description: selectedSuppliers.map(s => s.name).join(', '),
    });
  };

  const handleRequestDocuments = () => {
    toast.success(`Document request sent to ${selectedSuppliers.length} supplier(s)`, {
      description: 'Requested: Certifications, Audit Reports, Compliance Documents',
    });
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border">
      <span className="text-sm font-medium">{selectedIds.size} selected</span>

      <Button variant="outline" size="sm" onClick={handleExportCSV} className="gap-1.5">
        <Download className="w-4 h-4" />
        Export CSV
      </Button>

      <Button variant="outline" size="sm" onClick={handleSendQuestionnaire} className="gap-1.5">
        <Send className="w-4 h-4" />
        Send Questionnaire
      </Button>

      <Button variant="outline" size="sm" onClick={handleRequestDocuments} className="gap-1.5">
        <FileText className="w-4 h-4" />
        Request Documents
      </Button>

      <Button variant="ghost" size="sm" onClick={onClearSelection} className="ml-auto gap-1">
        <X className="w-4 h-4" />
        Clear
      </Button>
    </div>
  );
}
