import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {kpis.map((kpi, index) => (
        <motion.div
          key={kpi.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="p-4 rounded-lg bg-card border"
        >
          <p className="text-xs text-muted-foreground mb-1">{kpi.label}</p>
          <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
          <div className="flex items-center gap-1 mt-1">
            {kpi.change > 0 ? (
              <TrendingUp className="w-3 h-3 text-emerald-600" />
            ) : kpi.change < 0 ? (
              <TrendingDown className="w-3 h-3 text-red-600" />
            ) : (
              <Minus className="w-3 h-3 text-muted-foreground" />
            )}
            <span className={cn(
              "text-xs",
              kpi.change > 0 && "text-emerald-600",
              kpi.change < 0 && "text-red-600",
              kpi.change === 0 && "text-muted-foreground"
            )}>
              {kpi.change !== 0 && (kpi.change > 0 ? '+' : '')}{kpi.change}% {kpi.changeLabel}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
