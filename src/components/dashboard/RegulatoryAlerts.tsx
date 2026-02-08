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
    message: 'New restrictions on PFAS chemicals effective March 2026 (as announced). Review your product testing requirements.',
    type: 'warning',
    date: '2026-02-01'
  },
  {
    id: '2',
    title: 'California Prop 65 Amendment',
    message: 'Updated warning label requirements for products sold in California. Effective date: Q2 2026 (as announced).',
    type: 'info',
    date: '2026-01-28'
  }
];

export function RegulatoryAlerts() {
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  const visibleAlerts = alerts.filter(a => !dismissedIds.includes(a.id));

  if (visibleAlerts.length === 0) return null;

  return (
    <div className="space-y-1.5 md:space-y-2">
      {visibleAlerts.map((alert, index) => (
        <motion.div
          key={alert.id}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className={cn(
            "p-2 md:p-3 rounded-lg flex items-start gap-2 md:gap-3",
            alert.type === 'critical' && "bg-red-50 border border-red-200",
            alert.type === 'warning' && "bg-amber-50 border border-amber-200",
            alert.type === 'info' && "bg-blue-50 border border-blue-200"
          )}
        >
          <div className={cn(
            "w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center shrink-0",
            alert.type === 'critical' && "bg-red-100",
            alert.type === 'warning' && "bg-amber-100",
            alert.type === 'info' && "bg-blue-100"
          )}>
            {alert.type === 'info' ? (
              <Info className="w-3 md:w-4 h-3 md:h-4 text-blue-600" />
            ) : (
              <AlertTriangle className={cn(
                "w-3 md:w-4 h-3 md:h-4",
                alert.type === 'critical' && "text-red-600",
                alert.type === 'warning' && "text-amber-600"
              )} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className={cn(
              "font-medium text-xs md:text-sm",
              alert.type === 'critical' && "text-red-800",
              alert.type === 'warning' && "text-amber-800",
              alert.type === 'info' && "text-blue-800"
            )}>
              {alert.title}
            </h4>
            <p className={cn(
              "text-[10px] md:text-xs mt-0.5 line-clamp-2",
              alert.type === 'critical' && "text-red-700",
              alert.type === 'warning' && "text-amber-700",
              alert.type === 'info' && "text-blue-700"
            )}>
              {alert.message}
            </p>
            {/* FIX 6 [C-06]: Regulatory date disclaimer */}
            <p className="text-[9px] md:text-[10px] mt-0.5 text-muted-foreground italic">
              Dates reflect publicly announced regulatory timelines and are subject to change. Not an AI prediction.
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 md:h-7 md:w-7 shrink-0"
            onClick={() => setDismissedIds([...dismissedIds, alert.id])}
          >
            <X className="w-3.5 md:w-4 h-3.5 md:h-4" />
          </Button>
        </motion.div>
      ))}
    </div>
  );
}
