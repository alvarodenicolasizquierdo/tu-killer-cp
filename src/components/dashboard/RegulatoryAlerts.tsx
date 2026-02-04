import { motion } from 'framer-motion';
import { AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface RegulatoryAlert {
  id: string;
  title: string;
  message: string;
  type: 'warning' | 'info' | 'critical';
  date: string;
}

const alerts: RegulatoryAlert[] = [
  {
    id: '1',
    title: 'EU REACH Regulation Update',
    message: 'New restrictions on PFAS chemicals effective March 2026. Review your product testing requirements.',
    type: 'warning',
    date: '2026-02-01'
  },
  {
    id: '2',
    title: 'California Prop 65 Amendment',
    message: 'Updated warning label requirements for products sold in California.',
    type: 'info',
    date: '2026-01-28'
  }
];

export function RegulatoryAlerts() {
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  const visibleAlerts = alerts.filter(a => !dismissedIds.includes(a.id));

  if (visibleAlerts.length === 0) return null;

  return (
    <div className="space-y-2">
      {visibleAlerts.map((alert, index) => (
        <motion.div
          key={alert.id}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className={cn(
            "p-3 rounded-lg flex items-start gap-3",
            alert.type === 'critical' && "bg-red-50 border border-red-200",
            alert.type === 'warning' && "bg-amber-50 border border-amber-200",
            alert.type === 'info' && "bg-blue-50 border border-blue-200"
          )}
        >
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
            alert.type === 'critical' && "bg-red-100",
            alert.type === 'warning' && "bg-amber-100",
            alert.type === 'info' && "bg-blue-100"
          )}>
            {alert.type === 'info' ? (
              <Info className="w-4 h-4 text-blue-600" />
            ) : (
              <AlertTriangle className={cn(
                "w-4 h-4",
                alert.type === 'critical' && "text-red-600",
                alert.type === 'warning' && "text-amber-600"
              )} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className={cn(
              "font-medium text-sm",
              alert.type === 'critical' && "text-red-800",
              alert.type === 'warning' && "text-amber-800",
              alert.type === 'info' && "text-blue-800"
            )}>
              {alert.title}
            </h4>
            <p className={cn(
              "text-xs mt-0.5",
              alert.type === 'critical' && "text-red-700",
              alert.type === 'warning' && "text-amber-700",
              alert.type === 'info' && "text-blue-700"
            )}>
              {alert.message}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0"
            onClick={() => setDismissedIds([...dismissedIds, alert.id])}
          >
            <X className="w-4 h-4" />
          </Button>
        </motion.div>
      ))}
    </div>
  );
}
