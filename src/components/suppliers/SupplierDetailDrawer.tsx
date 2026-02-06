import { useMemo } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  MapPin, 
  Factory, 
  Mail, 
  Phone, 
  Calendar, 
  Award, 
  Package, 
  FileText,
  Send,
  ExternalLink,
  Tag,
  Clock 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SupplierTierBadge } from './SupplierTierBadge';
import { SupplierComplianceBadge } from './SupplierComplianceBadge';
import { cn } from '@/lib/utils';
import { getSupplierTasks } from '@/data/mockSuppliers';
import type { RichSupplier } from '@/types/supplier';

interface SupplierDetailDrawerProps {
  supplier: RichSupplier | null;
  open: boolean;
  onClose: () => void;
}

export function SupplierDetailDrawer({ supplier, open, onClose }: SupplierDetailDrawerProps) {
  const navigate = useNavigate();
  
  // Get tasks for this supplier
  const recentTasks = useMemo(() => {
    if (!supplier) return [];
    return getSupplierTasks(supplier.id).slice(0, 3);
  }, [supplier]);

  if (!supplier) return null;

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600';
    if (score >= 75) return 'text-amber-600';
    return 'text-red-600';
  };

  const handleSendQuestionnaire = () => {
    window.open('https://suppllier-uki-questionnaire.manus.space/', '_blank');
  };

  const handleViewFullProfile = () => {
    onClose();
    navigate(`/suppliers/${supplier.id}`);
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <div className="flex items-start gap-4">
            <div className={cn(
              "w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold shrink-0",
              supplier.status === 'active' && "bg-emerald-100 text-emerald-700",
              supplier.status === 'at-risk' && "bg-amber-100 text-amber-700",
              supplier.status === 'inactive' && "bg-gray-100 text-gray-700"
            )}>
              {supplier.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex-1">
              <SheetTitle className="text-xl">{supplier.name}</SheetTitle>
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                {supplier.city ? `${supplier.city}, ${supplier.country}` : supplier.country}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <SupplierTierBadge tier={supplier.tier} />
                <SupplierComplianceBadge status={supplier.complianceStatus} />
              </div>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Scores */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Performance Scores</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className={cn("text-2xl font-bold", getScoreColor(supplier.overallScore))}>
                  {supplier.overallScore}%
                </p>
                <p className="text-xs text-muted-foreground">Overall</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className={cn("text-2xl font-bold", getScoreColor(supplier.complianceScore))}>
                  {supplier.complianceScore}%
                </p>
                <p className="text-xs text-muted-foreground">Compliance</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className={cn("text-2xl font-bold", getScoreColor(supplier.qualityScore))}>
                  {supplier.qualityScore}%
                </p>
                <p className="text-xs text-muted-foreground">Quality</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className={cn("text-2xl font-bold", getScoreColor(supplier.deliveryScore))}>
                  {supplier.deliveryScore}%
                </p>
                <p className="text-xs text-muted-foreground">Delivery</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Activity Stats */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Activity</h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                <Package className="w-4 h-4 text-violet-600" />
                <div>
                  <p className="font-semibold">{supplier.activeStyles}</p>
                  <p className="text-xs text-muted-foreground">Styles</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                <FileText className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="font-semibold">{supplier.openTRFs}</p>
                  <p className="text-xs text-muted-foreground">TRFs</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                <Factory className="w-4 h-4 text-slate-600" />
                <div>
                  <p className="font-semibold">{supplier.factoryCount}</p>
                  <p className="text-xs text-muted-foreground">Factories</p>
                </div>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-center justify-between text-sm mb-1">
                <span>Pass Rate</span>
                <span className="font-medium">{supplier.passRate}%</span>
              </div>
              <Progress value={supplier.passRate} className="h-2" />
            </div>
          </div>

          <Separator />

          {/* Primary Contact */}
          {supplier.primaryContact && (
            <div>
              <h4 className="text-sm font-semibold mb-3">Primary Contact</h4>
              <div className="space-y-2">
                <p className="font-medium">{supplier.primaryContact.name}</p>
                <p className="text-sm text-muted-foreground">{supplier.primaryContact.role}</p>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <a 
                    href={`mailto:${supplier.primaryContact.email}`} 
                    className="text-primary hover:underline"
                  >
                    {supplier.primaryContact.email}
                  </a>
                </div>
                {supplier.primaryContact.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    {supplier.primaryContact.phone}
                  </div>
                )}
              </div>
            </div>
          )}

          <Separator />

          {/* Certifications */}
          <div>
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Award className="w-4 h-4" />
              Certifications ({supplier.certifications.length})
            </h4>
            <div className="space-y-2">
              {supplier.certifications.map((cert) => (
                <div 
                  key={cert.id} 
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                >
                  <div>
                    <p className="text-sm font-medium">{cert.name}</p>
                    <p className="text-xs text-muted-foreground">{cert.issuer}</p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      'text-xs',
                      cert.status === 'valid' && 'bg-emerald-100 text-emerald-700 border-emerald-200',
                      cert.status === 'expiring_soon' && 'bg-amber-100 text-amber-700 border-amber-200',
                      cert.status === 'expired' && 'bg-red-100 text-red-700 border-red-200',
                    )}
                  >
                    {cert.status === 'valid' ? 'Valid' : cert.status === 'expiring_soon' ? 'Expiring Soon' : 'Expired'}
                  </Badge>
                </div>
              ))}
              {supplier.certifications.length === 0 && (
                <p className="text-sm text-muted-foreground">No certifications on file</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Specializations */}
          {supplier.specializations.length > 0 && (
            <>
              <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Specializations ({supplier.specializations.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {supplier.specializations.map((spec) => (
                    <Badge key={spec.id} variant="secondary">
                      {spec.name}
                    </Badge>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Recent Tasks Summary */}
          {recentTasks.length > 0 && (
            <>
              <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Recent Tasks ({recentTasks.length})
                </h4>
                <div className="space-y-2">
                  {recentTasks.map((task) => (
                    <div 
                      key={task.id} 
                      className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{task.title}</p>
                        <p className="text-xs text-muted-foreground">
                          Due {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          'text-xs ml-2',
                          task.status === 'pending' && 'bg-slate-100 text-slate-700',
                          task.status === 'in_progress' && 'bg-blue-100 text-blue-700',
                          task.status === 'completed' && 'bg-emerald-100 text-emerald-700',
                          task.status === 'overdue' && 'bg-red-100 text-red-700',
                        )}
                      >
                        {task.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Audit Info */}
          <div>
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Audit Schedule
            </h4>
            <div className="space-y-2 text-sm">
              {supplier.lastAuditDate && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Audit</span>
                  <span>{new Date(supplier.lastAuditDate).toLocaleDateString()}</span>
                </div>
              )}
              {supplier.nextAuditDate && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Next Audit</span>
                  <span className="font-medium">{new Date(supplier.nextAuditDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 flex gap-2">
            <Button className="flex-1 gap-2" onClick={handleSendQuestionnaire}>
              <Send className="w-4 h-4" />
              Send Questionnaire
            </Button>
            <Button variant="outline" className="gap-2" onClick={handleViewFullProfile}>
              <ExternalLink className="w-4 h-4" />
              View Full Profile
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
