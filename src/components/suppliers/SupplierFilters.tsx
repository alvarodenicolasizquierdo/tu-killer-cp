import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, X } from 'lucide-react';
import type { SupplierTier, SupplierComplianceStatus, SupplierStatus } from '@/types/supplier';

export interface SupplierFiltersState {
  search: string;
  status: 'all' | SupplierStatus;
  tier: 'all' | SupplierTier;
  compliance: 'all' | SupplierComplianceStatus;
  country: 'all' | string;
}

interface SupplierFiltersProps {
  filters: SupplierFiltersState;
  onFiltersChange: (filters: SupplierFiltersState) => void;
  countries: string[];
  activeFilterCount: number;
}

export function SupplierFilters({
  filters,
  onFiltersChange,
  countries,
  activeFilterCount,
}: SupplierFiltersProps) {
  const handleReset = () => {
    onFiltersChange({
      search: '',
      status: 'all',
      tier: 'all',
      compliance: 'all',
      country: 'all',
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-3 flex-1">
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search suppliers, codes, locations..."
          value={filters.search}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          className="pl-10"
        />
      </div>

      {/* Status Filter */}
      <Select
        value={filters.status}
        onValueChange={(value) => onFiltersChange({ ...filters, status: value as SupplierFiltersState['status'] })}
      >
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="at-risk">At Risk</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>

      {/* Tier Filter */}
      <Select
        value={filters.tier}
        onValueChange={(value) => onFiltersChange({ ...filters, tier: value as SupplierFiltersState['tier'] })}
      >
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="All Tiers" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Tiers</SelectItem>
          <SelectItem value="strategic">Strategic</SelectItem>
          <SelectItem value="preferred">Preferred</SelectItem>
          <SelectItem value="approved">Approved</SelectItem>
          <SelectItem value="probation">Probation</SelectItem>
        </SelectContent>
      </Select>

      {/* Compliance Filter */}
      <Select
        value={filters.compliance}
        onValueChange={(value) => onFiltersChange({ ...filters, compliance: value as SupplierFiltersState['compliance'] })}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="All Compliance" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Compliance</SelectItem>
          <SelectItem value="compliant">Compliant</SelectItem>
          <SelectItem value="at_risk">At Risk</SelectItem>
          <SelectItem value="non_compliant">Non-Compliant</SelectItem>
          <SelectItem value="pending_audit">Pending Audit</SelectItem>
        </SelectContent>
      </Select>

      {/* Country Filter */}
      <Select
        value={filters.country}
        onValueChange={(value) => onFiltersChange({ ...filters, country: value })}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="All Countries" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Countries</SelectItem>
          {countries.map((country) => (
            <SelectItem key={country} value={country}>
              {country}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Reset */}
      {activeFilterCount > 0 && (
        <Button variant="ghost" size="sm" onClick={handleReset} className="gap-1">
          <X className="w-4 h-4" />
          Clear ({activeFilterCount})
        </Button>
      )}
    </div>
  );
}
