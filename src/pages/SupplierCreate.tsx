/**
 * SupplierCreate - Multi-step supplier onboarding wizard
 * Steps: Company Info → Contacts → Tier/Compliance → Certifications → Specializations → Review
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Building2, Users, Shield, Award, Tag, ClipboardCheck } from 'lucide-react';
import { toast } from 'sonner';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { SupplierTier, SupplierComplianceStatus } from '@/types/supplier';

const steps = [
  { id: 1, title: 'Company Info', icon: Building2 },
  { id: 2, title: 'Contacts', icon: Users },
  { id: 3, title: 'Tier & Compliance', icon: Shield },
  { id: 4, title: 'Certifications', icon: Award },
  { id: 5, title: 'Specializations', icon: Tag },
  { id: 6, title: 'Review', icon: ClipboardCheck },
];

const specializations = [
  { id: 'cotton', name: 'Cotton Basics', category: 'Apparel' },
  { id: 'denim', name: 'Denim', category: 'Apparel' },
  { id: 'knits', name: 'Knit Fabrics', category: 'Textiles' },
  { id: 'woven', name: 'Woven Fabrics', category: 'Textiles' },
  { id: 'organic', name: 'Organic Cotton', category: 'Sustainable' },
  { id: 'recycled', name: 'Recycled Materials', category: 'Sustainable' },
  { id: 'performance', name: 'Performance Fabrics', category: 'Activewear' },
  { id: 'outerwear', name: 'Outerwear', category: 'Apparel' },
];

const certificationOptions = [
  'OEKO-TEX Standard 100',
  'ISO 9001:2015',
  'ISO 14001',
  'GOTS',
  'BSCI',
  'WRAP',
  'SA8000',
  'GRS',
];

interface FormData {
  companyName: string;
  companyCode: string;
  country: string;
  city: string;
  factoryCount: string;
  contactName: string;
  contactRole: string;
  contactEmail: string;
  contactPhone: string;
  tier: SupplierTier | '';
  complianceStatus: SupplierComplianceStatus | '';
  certifications: string[];
  specializations: string[];
  notes: string;
}

const SupplierCreate = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    companyCode: '',
    country: '',
    city: '',
    factoryCount: '1',
    contactName: '',
    contactRole: '',
    contactEmail: '',
    contactPhone: '',
    tier: '',
    complianceStatus: '',
    certifications: [],
    specializations: [],
    notes: '',
  });

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/suppliers');
    }
  };

  const handleSubmit = () => {
    // In a real app, this would add to the database
    // For now, we just show a success message
    toast.success('Supplier created successfully!', {
      description: `${formData.companyName} has been added to your supplier directory.`,
    });
    navigate('/suppliers');
  };

  const toggleCertification = (cert: string) => {
    const certs = formData.certifications.includes(cert)
      ? formData.certifications.filter(c => c !== cert)
      : [...formData.certifications, cert];
    updateFormData({ certifications: certs });
  };

  const toggleSpecialization = (specId: string) => {
    const specs = formData.specializations.includes(specId)
      ? formData.specializations.filter(s => s !== specId)
      : [...formData.specializations, specId];
    updateFormData({ specializations: specs });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => updateFormData({ companyName: e.target.value })}
                  placeholder="e.g., Textile Excellence Ltd"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyCode">Company Code *</Label>
                <Input
                  id="companyCode"
                  value={formData.companyCode}
                  onChange={(e) => updateFormData({ companyCode: e.target.value.toUpperCase() })}
                  placeholder="e.g., TEX-001"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Select 
                  value={formData.country} 
                  onValueChange={(value) => updateFormData({ country: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bangladesh">Bangladesh</SelectItem>
                    <SelectItem value="China">China</SelectItem>
                    <SelectItem value="India">India</SelectItem>
                    <SelectItem value="Indonesia">Indonesia</SelectItem>
                    <SelectItem value="Pakistan">Pakistan</SelectItem>
                    <SelectItem value="Portugal">Portugal</SelectItem>
                    <SelectItem value="Turkey">Turkey</SelectItem>
                    <SelectItem value="Vietnam">Vietnam</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => updateFormData({ city: e.target.value })}
                  placeholder="e.g., Dhaka"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="factoryCount">Number of Factories</Label>
              <Input
                id="factoryCount"
                type="number"
                min="1"
                value={formData.factoryCount}
                onChange={(e) => updateFormData({ factoryCount: e.target.value })}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactName">Contact Name *</Label>
                <Input
                  id="contactName"
                  value={formData.contactName}
                  onChange={(e) => updateFormData({ contactName: e.target.value })}
                  placeholder="e.g., Mohammed Rahman"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactRole">Role</Label>
                <Input
                  id="contactRole"
                  value={formData.contactRole}
                  onChange={(e) => updateFormData({ contactRole: e.target.value })}
                  placeholder="e.g., Quality Director"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Email *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => updateFormData({ contactEmail: e.target.value })}
                  placeholder="e.g., contact@supplier.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Phone</Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => updateFormData({ contactPhone: e.target.value })}
                  placeholder="e.g., +880 1234 567890"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Supplier Tier *</Label>
              <Select 
                value={formData.tier} 
                onValueChange={(value) => updateFormData({ tier: value as SupplierTier })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="strategic">Strategic - Top priority partners</SelectItem>
                  <SelectItem value="preferred">Preferred - Trusted partners</SelectItem>
                  <SelectItem value="approved">Approved - Qualified suppliers</SelectItem>
                  <SelectItem value="probation">Probation - Under evaluation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Compliance Status *</Label>
              <Select 
                value={formData.complianceStatus} 
                onValueChange={(value) => updateFormData({ complianceStatus: value as SupplierComplianceStatus })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select compliance status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compliant">Compliant - Meets all requirements</SelectItem>
                  <SelectItem value="at_risk">At Risk - Minor issues identified</SelectItem>
                  <SelectItem value="non_compliant">Non-Compliant - Major issues</SelectItem>
                  <SelectItem value="pending_audit">Pending Audit - Awaiting verification</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => updateFormData({ notes: e.target.value })}
                placeholder="Any additional notes about tier or compliance status..."
                rows={3}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Select all certifications the supplier currently holds. You can upload documents later.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {certificationOptions.map((cert) => (
                <div
                  key={cert}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
                    formData.certifications.includes(cert)
                      ? 'bg-primary/10 border-primary'
                      : 'hover:bg-muted/50'
                  )}
                  onClick={() => toggleCertification(cert)}
                >
                  <Checkbox checked={formData.certifications.includes(cert)} />
                  <span className="text-sm">{cert}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Select the supplier's areas of specialization.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {specializations.map((spec) => (
                <div
                  key={spec.id}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
                    formData.specializations.includes(spec.id)
                      ? 'bg-primary/10 border-primary'
                      : 'hover:bg-muted/50'
                  )}
                  onClick={() => toggleSpecialization(spec.id)}
                >
                  <Checkbox checked={formData.specializations.includes(spec.id)} />
                  <div>
                    <p className="text-sm font-medium">{spec.name}</p>
                    <p className="text-xs text-muted-foreground">{spec.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold mb-2">Company Information</h4>
                <dl className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Name:</dt>
                    <dd className="font-medium">{formData.companyName || '-'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Code:</dt>
                    <dd className="font-medium">{formData.companyCode || '-'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Location:</dt>
                    <dd className="font-medium">
                      {formData.city ? `${formData.city}, ${formData.country}` : formData.country || '-'}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Factories:</dt>
                    <dd className="font-medium">{formData.factoryCount}</dd>
                  </div>
                </dl>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-2">Primary Contact</h4>
                <dl className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Name:</dt>
                    <dd className="font-medium">{formData.contactName || '-'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Role:</dt>
                    <dd className="font-medium">{formData.contactRole || '-'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Email:</dt>
                    <dd className="font-medium">{formData.contactEmail || '-'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Phone:</dt>
                    <dd className="font-medium">{formData.contactPhone || '-'}</dd>
                  </div>
                </dl>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-2">Tier & Compliance</h4>
              <div className="flex gap-2">
                {formData.tier && (
                  <Badge variant="outline" className="capitalize">{formData.tier}</Badge>
                )}
                {formData.complianceStatus && (
                  <Badge variant="outline" className="capitalize">
                    {formData.complianceStatus.replace('_', ' ')}
                  </Badge>
                )}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-2">Certifications ({formData.certifications.length})</h4>
              <div className="flex flex-wrap gap-2">
                {formData.certifications.length > 0 ? (
                  formData.certifications.map(cert => (
                    <Badge key={cert} variant="secondary">{cert}</Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">No certifications selected</span>
                )}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-2">Specializations ({formData.specializations.length})</h4>
              <div className="flex flex-wrap gap-2">
                {formData.specializations.length > 0 ? (
                  formData.specializations.map(specId => {
                    const spec = specializations.find(s => s.id === specId);
                    return spec ? (
                      <Badge key={specId} variant="secondary">{spec.name}</Badge>
                    ) : null;
                  })
                ) : (
                  <span className="text-sm text-muted-foreground">No specializations selected</span>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Add New Supplier</h1>
            <p className="text-muted-foreground">Complete the onboarding wizard to add a supplier</p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;
            const Icon = step.icon;
            
            return (
              <div key={step.id} className="flex items-center">
                <div
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg transition-colors',
                    isActive && 'bg-primary text-primary-foreground',
                    isCompleted && 'bg-primary/20 text-primary',
                    !isActive && !isCompleted && 'text-muted-foreground'
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                  <span className="text-sm font-medium hidden md:inline">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    'w-8 h-0.5 mx-2',
                    isCompleted ? 'bg-primary' : 'bg-muted'
                  )} />
                )}
              </div>
            );
          })}
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
            <CardDescription>
              {currentStep === 1 && 'Enter basic company information'}
              {currentStep === 2 && 'Add primary contact details'}
              {currentStep === 3 && 'Set supplier tier and compliance status'}
              {currentStep === 4 && 'Select certifications held by the supplier'}
              {currentStep === 5 && 'Choose supplier specializations'}
              {currentStep === 6 && 'Review all information before creating the supplier'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </Button>
          
          {currentStep < steps.length ? (
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit}>
              <Check className="h-4 w-4 mr-2" />
              Create Supplier
            </Button>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default SupplierCreate;
