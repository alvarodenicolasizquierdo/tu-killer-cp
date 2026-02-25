import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { mockSuppliers } from '@/data/mockData';
import { InspectionType } from '@/types';

interface InspectionFormProps {
  onClose: () => void;
}

const InspectionForm = ({ onClose }: InspectionFormProps) => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    title: '',
    type: '' as InspectionType | '',
    supplierId: '',
    factoryName: '',
    location: '',
    time: '09:00',
    duration: '4',
    assignee: '',
    description: '',
  });

  const inspectionTypes: { value: InspectionType; label: string }[] = [
    { value: 'factory_audit', label: 'Factory Audit' },
    { value: 'quality_check', label: 'Quality Check' },
    { value: 'social_compliance', label: 'Social Compliance' },
    { value: 'environmental', label: 'Environmental' },
    { value: 'pre_shipment', label: 'Pre-Shipment' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.type || !date || !formData.supplierId) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    // Mock submission
    toast({
      title: 'Inspection Scheduled',
      description: `${formData.title} has been scheduled for ${format(date, 'PPP')}.`,
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label htmlFor="title">Inspection Title *</Label>
          <Input
            id="title"
            placeholder="e.g., Annual Factory Audit"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="type">Inspection Type *</Label>
          <Select value={formData.type} onValueChange={(value: InspectionType) => setFormData({ ...formData, type: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {inspectionTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="supplier">Supplier *</Label>
          <Select value={formData.supplierId} onValueChange={(value) => setFormData({ ...formData, supplierId: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select supplier" />
            </SelectTrigger>
            <SelectContent>
              {mockSuppliers.map(sup => (
                <SelectItem key={sup.id} value={sup.id}>{sup.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="factory">Factory Name *</Label>
          <Input
            id="factory"
            placeholder="e.g., Dongguan Factory A"
            value={formData.factoryName}
            onChange={(e) => setFormData({ ...formData, factoryName: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="e.g., Dongguan, China"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
        </div>

        <div>
          <Label>Scheduled Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !date && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="duration">Duration (hrs)</Label>
            <Input
              id="duration"
              type="number"
              min="1"
              max="24"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            />
          </div>
        </div>

        <div className="col-span-2">
          <Label htmlFor="assignee">Assignee</Label>
          <Input
            id="assignee"
            placeholder="e.g., James Richardson"
            value={formData.assignee}
            onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
          />
        </div>

        <div className="col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Describe the inspection scope and objectives..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          Schedule Inspection
        </Button>
      </div>
    </form>
  );
};

export default InspectionForm;
