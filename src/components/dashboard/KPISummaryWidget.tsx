import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LastUpdatedTimestamp } from '@/components/compliance/LastUpdatedTimestamp';

interface KPI {
  label: string;
  value: string;
  change: number;
  changeLabel: string;
}

const kpis: KPI[] = [
  { label: 'TRFs In Progress', value: '24', change: 8, changeLabel: 'vs last week' },
  { label: 'Avg Turnaround', value: '4.2d', change: -12, changeLabel: 'improved' },
  { label: 'Pass Rate', value: '94%', change: 2, changeLabel: 'vs last month' },
  { label: 'Pending Approvals', value: '7', change: 0, changeLabel: 'no change' },
];

export function KPISummaryWidget() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
      {kpis.map((kpi, index) => (
        <motion.div
          key={kpi.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="p-2.5 md:p-4 rounded-lg bg-card border"
          whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
        >
          <p className="text-[10px] md:text-xs text-muted-foreground mb-0.5 md:mb-1 truncate">{kpi.label}</p>
          <p className="text-lg md:text-2xl font-bold text-foreground">{kpi.value}</p>
          <div className="flex items-center gap-1 mt-0.5 md:mt-1">
            {kpi.change > 0 ? (
              <TrendingUp className="w-3 h-3 text-emerald-600 shrink-0" />
            ) : kpi.change < 0 ? (
              <TrendingDown className="w-3 h-3 text-red-600 shrink-0" />
            ) : (
              <Minus className="w-3 h-3 text-muted-foreground shrink-0" />
            )}
            <span className={cn(
              "text-[10px] md:text-xs truncate",
              kpi.change > 0 && "text-emerald-600",
              kpi.change < 0 && "text-red-600",
              kpi.change === 0 && "text-muted-foreground"
            )}>
              {kpi.change !== 0 && (kpi.change > 0 ? '+' : '')}{kpi.change}%
              <span className="hidden sm:inline"> {kpi.changeLabel}</span>
            </span>
          </div>
          {/* FIX 9 [NEW]: Last-updated timestamp */}
          <LastUpdatedTimestamp />
        </motion.div>
      ))}
    </div>
  );
}
