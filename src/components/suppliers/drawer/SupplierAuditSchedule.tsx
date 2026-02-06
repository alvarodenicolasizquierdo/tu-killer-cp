import { Calendar } from 'lucide-react';

interface SupplierAuditScheduleProps {
  lastAuditDate?: string;
  nextAuditDate?: string;
}

export function SupplierAuditSchedule({ lastAuditDate, nextAuditDate }: SupplierAuditScheduleProps) {
  return (
    <div>
      <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
        <Calendar className="w-4 h-4" />
        Audit Schedule
      </h4>
      <div className="space-y-2 text-sm">
        {lastAuditDate && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Last Audit</span>
            <span>{new Date(lastAuditDate).toLocaleDateString()}</span>
          </div>
        )}
        {nextAuditDate && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Next Audit</span>
            <span className="font-medium">{new Date(nextAuditDate).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </div>
  );
}
