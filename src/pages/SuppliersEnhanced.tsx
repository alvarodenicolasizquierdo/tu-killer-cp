/**
 * SuppliersEnhanced - Enhanced Suppliers Directory Page
 * Features: Table view, Trends view, filters, bulk actions, CSV export, detail drawer
 */

import { useState, useMemo, useCallback, useEffect } from 'react';
import { tagScreen } from '@/utils/clarityTracking';
import { useNavigate } from 'react-router-dom';
import { Plus, Download, Inbox, List, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  SupplierStats,
  SupplierFilters,
  SupplierTable,
  SupplierBulkActions,
  SupplierDetailDrawer,
  SupplierPerformanceChart,
  type SupplierFiltersState,
} from '@/components/suppliers';
import {
  getAllSuppliers,
  calculateSupplierStats,
  getSupplierCountries,
  exportSuppliersToCSV,
  downloadCSV,
} from '@/data/mockSuppliers';
import type { RichSupplier } from '@/types/supplier';

type ViewMode = 'list' | 'trends';

const SuppliersEnhanced = () => {
  const navigate = useNavigate();
  useEffect(() => { tagScreen('portal-suppliers'); }, []);

  // State - load suppliers from localStorage + mock data
  const [suppliers] = useState<RichSupplier[]>(() => getAllSuppliers());
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedSupplier, setSelectedSupplier] = useState<RichSupplier | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<SupplierFiltersState>({
    search: '',
    status: 'all',
    tier: 'all',
    compliance: 'all',
    country: 'all',
  });

  // Derived data
  const countries = useMemo(() => getSupplierCountries(suppliers), [suppliers]);

  // Filtered suppliers
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((supplier) => {
      // Search filter
      if (filters.search) {
        const search = filters.search.toLowerCase();
        const matchesSearch =
          supplier.name.toLowerCase().includes(search) ||
          supplier.code.toLowerCase().includes(search) ||
          supplier.country.toLowerCase().includes(search) ||
          supplier.city?.toLowerCase().includes(search) ||
          supplier.primaryContact?.name.toLowerCase().includes(search) ||
          supplier.primaryContact?.email.toLowerCase().includes(search);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status !== 'all' && supplier.status !== filters.status) {
        return false;
      }

      // Tier filter
      if (filters.tier !== 'all' && supplier.tier !== filters.tier) {
        return false;
      }

      // Compliance filter
      if (filters.compliance !== 'all' && supplier.complianceStatus !== filters.compliance) {
        return false;
      }

      // Country filter
      if (filters.country !== 'all' && supplier.country !== filters.country) {
        return false;
      }

      return true;
    });
  }, [suppliers, filters]);

  // Stats
  const stats = useMemo(() => calculateSupplierStats(filteredSuppliers), [filteredSuppliers]);

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status !== 'all') count++;
    if (filters.tier !== 'all') count++;
    if (filters.compliance !== 'all') count++;
    if (filters.country !== 'all') count++;
    return count;
  }, [filters]);

  // Handlers
  const handleViewDetails = useCallback((supplier: RichSupplier) => {
    setSelectedSupplier(supplier);
    setDrawerOpen(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setDrawerOpen(false);
    setSelectedSupplier(null);
  }, []);

  const handleExportAll = () => {
    const csvContent = exportSuppliersToCSV(filteredSuppliers);
    downloadCSV(csvContent, `all-suppliers-${new Date().toISOString().split('T')[0]}.csv`);
    toast.success(`Exported ${filteredSuppliers.length} supplier(s) to CSV`);
  };

  const handleNewSupplier = () => {
    navigate('/suppliers/new');
  };

  const handleOpenInbox = () => {
    navigate('/suppliers/inbox');
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Suppliers</h1>
            <p className="text-muted-foreground">
              Manage supplier directory and performance
            </p>
            {/* View Toggle */}
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)} className="mt-3">
              <TabsList>
                <TabsTrigger value="list" className="gap-2">
                  <List className="h-4 w-4" />
                  List
                </TabsTrigger>
                <TabsTrigger value="trends" className="gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Trends
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleOpenInbox}>
              <Inbox className="h-4 w-4 mr-2" />
              Inbox
            </Button>
            <Button variant="outline" onClick={handleExportAll}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={handleNewSupplier}>
              <Plus className="h-4 w-4 mr-2" />
              Add Supplier
            </Button>
          </div>
        </div>

        {/* Stats */}
        <SupplierStats stats={stats} />

        {/* Filters - only show in list view */}
        {viewMode === 'list' && (
          <Card>
            <CardContent className="p-4">
              <SupplierFilters
                filters={filters}
                onFiltersChange={setFilters}
                countries={countries}
                activeFilterCount={activeFilterCount}
              />
            </CardContent>
          </Card>
        )}

        {/* Trends View */}
        {viewMode === 'trends' && (
          <SupplierPerformanceChart />
        )}

        {/* Bulk Actions - only show in list view */}
        {viewMode === 'list' && (
          <SupplierBulkActions
            selectedIds={selectedIds}
            suppliers={filteredSuppliers}
            onClearSelection={() => setSelectedIds(new Set())}
          />
        )}

        {/* Table - only show in list view */}
        {viewMode === 'list' && (
          <SupplierTable
            suppliers={filteredSuppliers}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            onViewDetails={handleViewDetails}
          />
        )}

        {/* Detail Drawer */}
        <SupplierDetailDrawer
          supplier={selectedSupplier}
          open={drawerOpen}
          onClose={handleCloseDrawer}
        />
      </div>
    </AppLayout>
  );
};

export default SuppliersEnhanced;
