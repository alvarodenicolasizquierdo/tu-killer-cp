import { useState, useMemo, useCallback, useEffect } from 'react';
import { tagScreen, tagEvent } from '@/utils/clarityTracking';
import { useNavigate } from 'react-router-dom';
import { Plus, Download, Calendar, List, LayoutGrid } from 'lucide-react';
import { toast } from 'sonner';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  InspectionStats,
  InspectionFilters,
  InspectionTable,
  InspectionKanban,
  InspectionBulkActions,
  type InspectionFiltersState,
} from '@/components/inspection';
import {
  richInspections,
  calculateInspectionStats,
  exportInspectionsToCSV,
  downloadCSV,
  type RichInspection,
  type ExtendedInspectionStatus,
} from '@/data/mockInspections';

type ViewMode = 'table' | 'kanban';

const InspectionsEnhanced = () => {
  const navigate = useNavigate();
  useEffect(() => { tagScreen('portal-inspections'); }, []);
  
  // State
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [inspections, setInspections] = useState<RichInspection[]>(richInspections);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<InspectionFiltersState>({
    search: '',
    status: 'all',
    type: 'all',
    result: 'all',
    risk: 'all',
  });

  // Filtered inspections
  const filteredInspections = useMemo(() => {
    return inspections.filter((inspection) => {
      // Search filter
      if (filters.search) {
        const search = filters.search.toLowerCase();
        const matchesSearch =
          inspection.inspectionNumber.toLowerCase().includes(search) ||
          inspection.poNumber.toLowerCase().includes(search) ||
          inspection.productName.toLowerCase().includes(search) ||
          inspection.supplierName.toLowerCase().includes(search) ||
          inspection.factoryName.toLowerCase().includes(search);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status !== 'all' && inspection.status !== filters.status) {
        return false;
      }

      // Type filter
      if (filters.type !== 'all' && inspection.typeCode !== filters.type) {
        return false;
      }

      // Result filter
      if (filters.result !== 'all' && inspection.result !== filters.result) {
        return false;
      }

      // Risk filter
      if (filters.risk !== 'all' && inspection.riskLevel !== filters.risk) {
        return false;
      }

      return true;
    });
  }, [inspections, filters]);

  // Stats
  const stats = useMemo(() => calculateInspectionStats(filteredInspections), [filteredInspections]);

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status !== 'all') count++;
    if (filters.type !== 'all') count++;
    if (filters.result !== 'all') count++;
    if (filters.risk !== 'all') count++;
    return count;
  }, [filters]);

  // Handlers
  const handleStatusChange = useCallback((inspectionId: string, newStatus: ExtendedInspectionStatus) => {
    setInspections((prev) =>
      prev.map((i) =>
        i.id === inspectionId ? { ...i, status: newStatus, updatedAt: new Date().toISOString().split('T')[0] } : i
      )
    );
  }, []);

  const handleBulkStatusChange = useCallback((ids: string[], newStatus: ExtendedInspectionStatus) => {
    setInspections((prev) =>
      prev.map((i) =>
        ids.includes(i.id) ? { ...i, status: newStatus, updatedAt: new Date().toISOString().split('T')[0] } : i
      )
    );
    setSelectedIds(new Set());
  }, []);

  const handleExportAll = () => {
    const csvContent = exportInspectionsToCSV(filteredInspections);
    downloadCSV(csvContent, `all-inspections-${new Date().toISOString().split('T')[0]}.csv`);
    toast.success(`Exported ${filteredInspections.length} inspection(s) to CSV`);
  };

  const handleNewInspection = () => {
    navigate('/inspections/new');
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Inspections</h1>
            <p className="text-muted-foreground">
              Manage and track all quality inspections across your supply chain
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate('/inspections')}>
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </Button>
            <Button variant="outline" onClick={handleExportAll}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={handleNewInspection}>
              <Plus className="h-4 w-4 mr-2" />
              New Inspection
            </Button>
          </div>
        </div>

        {/* Stats */}
        <InspectionStats stats={stats} />

        {/* Filters & View Toggle */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <InspectionFilters
                filters={filters}
                onFiltersChange={setFilters}
                activeFilterCount={activeFilterCount}
              />

              {/* View Toggle */}
              <Tabs value={viewMode} onValueChange={(v) => { setViewMode(v as ViewMode); tagEvent('inspection_view', v); }}>
                <TabsList>
                  <TabsTrigger value="table" className="gap-1.5">
                    <List className="h-4 w-4" />
                    Table
                  </TabsTrigger>
                  <TabsTrigger value="kanban" className="gap-1.5">
                    <LayoutGrid className="h-4 w-4" />
                    Kanban
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        <InspectionBulkActions
          selectedIds={selectedIds}
          inspections={filteredInspections}
          onClearSelection={() => setSelectedIds(new Set())}
          onStatusChange={handleBulkStatusChange}
        />

        {/* Main Content */}
        {viewMode === 'table' ? (
          <InspectionTable
            inspections={filteredInspections}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
          />
        ) : (
          <InspectionKanban
            inspections={filteredInspections}
            onStatusChange={handleStatusChange}
          />
        )}
      </div>
    </AppLayout>
  );
};

export default InspectionsEnhanced;
