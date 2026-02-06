import { useState } from 'react';
import { Search, Filter, X, RotateCcw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import type { ExtendedInspectionStatus, InspectionResult, RiskLevel, InspectionTypeCode } from '@/data/mockInspections';

export interface InspectionFiltersState {
  search: string;
  status: ExtendedInspectionStatus | 'all';
  type: InspectionTypeCode | 'all';
  result: InspectionResult | 'all';
  risk: RiskLevel | 'all';
}

interface InspectionFiltersProps {
  filters: InspectionFiltersState;
  onFiltersChange: (filters: InspectionFiltersState) => void;
  activeFilterCount: number;
}

export function InspectionFilters({ filters, onFiltersChange, activeFilterCount }: InspectionFiltersProps) {
  const updateFilter = <K extends keyof InspectionFiltersState>(
    key: K,
    value: InspectionFiltersState[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const resetFilters = () => {
    onFiltersChange({
      search: '',
      status: 'all',
      type: 'all',
      result: 'all',
      risk: 'all',
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search inspections, PO, products..."
          value={filters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
          className="pl-9"
        />
        {filters.search && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
            onClick={() => updateFilter('search', '')}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Status Filter */}
      <Select
        value={filters.status}
        onValueChange={(value) => updateFilter('status', value as ExtendedInspectionStatus | 'all')}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="scheduled">Scheduled</SelectItem>
          <SelectItem value="in_progress">In Progress</SelectItem>
          <SelectItem value="pending_review">Pending Review</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="on_hold">On Hold</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>

      {/* Type Filter */}
      <Select
        value={filters.type}
        onValueChange={(value) => updateFilter('type', value as InspectionTypeCode | 'all')}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="PPI">PPI</SelectItem>
          <SelectItem value="DPI">DPI</SelectItem>
          <SelectItem value="FRI">FRI</SelectItem>
          <SelectItem value="CLI">CLI</SelectItem>
          <SelectItem value="FA">FA</SelectItem>
        </SelectContent>
      </Select>

      {/* Result Filter */}
      <Select
        value={filters.result}
        onValueChange={(value) => updateFilter('result', value as InspectionResult | 'all')}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Result" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Results</SelectItem>
          <SelectItem value="pass">Pass</SelectItem>
          <SelectItem value="fail">Fail</SelectItem>
          <SelectItem value="conditional">Conditional</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
        </SelectContent>
      </Select>

      {/* Risk Filter */}
      <Select
        value={filters.risk}
        onValueChange={(value) => updateFilter('risk', value as RiskLevel | 'all')}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Risk" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Risk</SelectItem>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="high">High</SelectItem>
        </SelectContent>
      </Select>

      {/* Reset */}
      {activeFilterCount > 0 && (
        <Button variant="ghost" size="icon" onClick={resetFilters} title="Reset filters">
          <RotateCcw className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

export default InspectionFilters;
