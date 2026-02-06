import { useMemo } from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Send, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getSupplierTasks } from '@/data/mockSuppliers';
import type { RichSupplier } from '@/types/supplier';
import {
  SupplierDrawerHeader,
  SupplierScores,
  SupplierActivity,
  SupplierContact,
  SupplierCertifications,
  SupplierSpecializations,
  SupplierTasks,
  SupplierAuditSchedule,
} from './drawer';

interface SupplierDetailDrawerProps {
  supplier: RichSupplier | null;
  open: boolean;
  onClose: () => void;
}

export function SupplierDetailDrawer({ supplier, open, onClose }: SupplierDetailDrawerProps) {
  const navigate = useNavigate();

  const recentTasks = useMemo(() => {
    if (!supplier) return [];
    return getSupplierTasks(supplier.id).slice(0, 3);
  }, [supplier]);

  if (!supplier) return null;

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
        <SupplierDrawerHeader supplier={supplier} />

        <div className="mt-6 space-y-6">
          <SupplierScores
            overallScore={supplier.overallScore}
            complianceScore={supplier.complianceScore}
            qualityScore={supplier.qualityScore}
            deliveryScore={supplier.deliveryScore}
          />

          <Separator />

          <SupplierActivity
            activeStyles={supplier.activeStyles}
            openTRFs={supplier.openTRFs}
            factoryCount={supplier.factoryCount}
            passRate={supplier.passRate}
          />

          <Separator />

          {supplier.primaryContact && (
            <>
              <SupplierContact contact={supplier.primaryContact} />
              <Separator />
            </>
          )}

          <SupplierCertifications certifications={supplier.certifications} />

          <Separator />

          {supplier.specializations.length > 0 && (
            <>
              <SupplierSpecializations specializations={supplier.specializations} />
              <Separator />
            </>
          )}

          {recentTasks.length > 0 && (
            <>
              <SupplierTasks tasks={recentTasks} />
              <Separator />
            </>
          )}

          <SupplierAuditSchedule
            lastAuditDate={supplier.lastAuditDate}
            nextAuditDate={supplier.nextAuditDate}
          />

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
