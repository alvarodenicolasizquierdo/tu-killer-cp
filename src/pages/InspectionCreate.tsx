import { useState, useEffect } from 'react';
import { tagScreen } from '@/utils/clarityTracking';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { InspectionTypeCode, RiskLevel } from '@/data/mockInspections';
import { mockSuppliers } from '@/data/mockData';

interface FormData {
  poNumber: string;
  productName: string;
  typeCode: InspectionTypeCode | '';
  supplierId: string;
  factoryName: string;
  factoryLocation: string;
  inspectorName: string;
  riskLevel: RiskLevel;
  scheduledDate: Date | undefined;
  sampleSize: string;
  notes: string;
}

const InspectionCreate = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => { tagScreen('portal-inspection-create'); }, []);

  const [formData, setFormData] = useState<FormData>({
    poNumber: '',
    productName: '',
    typeCode: '',
    supplierId: '',
    factoryName: '',
    factoryLocation: '',
    inspectorName: '',
    riskLevel: 'low',
    scheduledDate: undefined,
    sampleSize: '',
    notes: '',
  });

  const inspectionTypes: { value: InspectionTypeCode; label: string }[] = [
    { value: 'PPI', label: 'Pre-Production Inspection (PPI)' },
    { value: 'DPI', label: 'During Production Inspection (DPI)' },
    { value: 'FRI', label: 'Final Random Inspection (FRI)' },
    { value: 'CLI', label: 'Container Loading Inspection (CLI)' },
    { value: 'FA', label: 'Factory Audit (FA)' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.poNumber || !formData.productName || !formData.typeCode || !formData.supplierId || !formData.scheduledDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast.success('Inspection scheduled successfully', {
        description: `${formData.productName} - ${format(formData.scheduledDate!, 'PPP')}`,
      });
      setIsSubmitting(false);
      navigate('/inspections');
    }, 1000);
  };

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Get supplier name for factory location hint
  const selectedSupplier = mockSuppliers.find((s) => s.id === formData.supplierId);

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">New Inspection</h1>
            <p className="text-muted-foreground">Schedule a new quality inspection</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Inspection Details</CardTitle>
              <CardDescription>Enter the details for the new inspection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* PO & Product */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="poNumber">PO Number *</Label>
                  <Input
                    id="poNumber"
                    placeholder="e.g., PO-2026-1234"
                    value={formData.poNumber}
                    onChange={(e) => updateField('poNumber', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="productName">Product Name *</Label>
                  <Input
                    id="productName"
                    placeholder="e.g., Cotton T-Shirt"
                    value={formData.productName}
                    onChange={(e) => updateField('productName', e.target.value)}
                  />
                </div>
              </div>

              {/* Type & Supplier */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Inspection Type *</Label>
                  <Select
                    value={formData.typeCode}
                    onValueChange={(value) => updateField('typeCode', value as InspectionTypeCode)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {inspectionTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Supplier *</Label>
                  <Select
                    value={formData.supplierId}
                    onValueChange={(value) => updateField('supplierId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockSuppliers.map((supplier) => (
                        <SelectItem key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Factory */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="factoryName">Factory Name</Label>
                  <Input
                    id="factoryName"
                    placeholder="e.g., Factory A"
                    value={formData.factoryName}
                    onChange={(e) => updateField('factoryName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="factoryLocation">Factory Location</Label>
                  <Input
                    id="factoryLocation"
                    placeholder={selectedSupplier ? `e.g., ${selectedSupplier.country}` : 'e.g., Vietnam'}
                    value={formData.factoryLocation}
                    onChange={(e) => updateField('factoryLocation', e.target.value)}
                  />
                </div>
              </div>

              {/* Date & Risk */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Scheduled Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !formData.scheduledDate && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.scheduledDate ? (
                          format(formData.scheduledDate, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.scheduledDate}
                        onSelect={(date) => updateField('scheduledDate', date)}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Risk Level</Label>
                  <Select
                    value={formData.riskLevel}
                    onValueChange={(value) => updateField('riskLevel', value as RiskLevel)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Risk</SelectItem>
                      <SelectItem value="medium">Medium Risk</SelectItem>
                      <SelectItem value="high">High Risk</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Inspector & Sample Size */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="inspectorName">Inspector</Label>
                  <Input
                    id="inspectorName"
                    placeholder="e.g., John Smith"
                    value={formData.inspectorName}
                    onChange={(e) => updateField('inspectorName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sampleSize">Sample Size</Label>
                  <Input
                    id="sampleSize"
                    type="number"
                    placeholder="e.g., 200"
                    value={formData.sampleSize}
                    onChange={(e) => updateField('sampleSize', e.target.value)}
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes or instructions..."
                  value={formData.notes}
                  onChange={(e) => updateField('notes', e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Scheduling...' : 'Schedule Inspection'}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
};

export default InspectionCreate;
