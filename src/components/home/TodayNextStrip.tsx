import { AlertCircle, Clock, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface TodayNextStripProps {
  /** Number of items needing attention, or undefined if not available */
  needsAttention?: number;
  /** Number of overdue items, or undefined if not available */
  overdue?: number;
  /** Number of upcoming items, or undefined if not available */
  upcoming?: number;
}

interface TileProps {
  label: string;
  value: number | undefined;
  icon: React.ReactNode;
  variant: 'attention' | 'overdue' | 'upcoming';
  index: number;
}

function StatusTile({ label, value, icon, variant, index }: TileProps) {
  const hasValue = typeof value === 'number';
  
  const variantStyles = {
    attention: 'border-amber-200 bg-amber-50/50',
    overdue: 'border-red-200 bg-red-50/50',
    upcoming: 'border-blue-200 bg-blue-50/50',
  };

  const iconStyles = {
    attention: 'text-amber-600 bg-amber-100',
    overdue: 'text-red-600 bg-red-100',
    upcoming: 'text-blue-600 bg-blue-100',
  };

  const valueStyles = {
    attention: 'text-amber-700',
    overdue: 'text-red-700',
    upcoming: 'text-blue-700',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg border transition-colors",
        variantStyles[variant]
      )}
    >
      <div className={cn(
        "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
        iconStyles[variant]
      )}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
        <p className={cn(
          "text-lg font-semibold tabular-nums",
          hasValue ? valueStyles[variant] : "text-muted-foreground"
        )}>
          {hasValue ? value : '—'}
        </p>
      </div>
    </motion.div>
  );
}

export function TodayNextStrip({ needsAttention, overdue, upcoming }: TodayNextStripProps) {
  return (
    <Card className="border-dashed border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <h3 className="text-sm font-semibold text-foreground">Today / Next</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <StatusTile
            label="Needs attention"
            value={needsAttention}
            icon={<AlertCircle className="w-4 h-4" />}
            variant="attention"
            index={0}
          />
          <StatusTile
            label="Overdue"
            value={overdue}
            icon={<Clock className="w-4 h-4" />}
            variant="overdue"
            index={1}
          />
          <StatusTile
            label="Upcoming"
            value={upcoming}
            icon={<Calendar className="w-4 h-4" />}
            variant="upcoming"
            index={2}
          />
        </div>
      </CardContent>
    </Card>
  );
}
