import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { KPIData } from '@/types';

interface KPICardProps {
  data: KPIData;
  index?: number;
}

export function KPICard({ data, index = 0 }: KPICardProps) {
  const statusColors = {
    critical: 'border-l-priority-critical',
    'at-risk': 'border-l-priority-at-risk',
    'on-track': 'border-l-priority-on-track',
    info: 'border-l-priority-info'
  };

  const statusBg = {
    critical: 'bg-red-50',
    'at-risk': 'bg-amber-50',
    'on-track': 'bg-emerald-50',
    info: 'bg-blue-50'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        "kpi-card border-l-4",
        statusColors[data.status],
        statusBg[data.status]
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">{data.label}</p>
          <p className="text-3xl font-bold text-foreground tracking-[-0.02em] mt-1">{data.value}</p>
        </div>
        
        {data.change !== undefined && (
          <div className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
            data.changeDirection === 'up' && data.status !== 'critical' && "bg-emerald-100 text-emerald-700",
            data.changeDirection === 'down' && "bg-red-100 text-red-700",
            data.changeDirection === 'up' && data.status === 'critical' && "bg-red-100 text-red-700"
          )}>
            {data.changeDirection === 'up' ? (
              <ArrowUp className="w-3 h-3" />
            ) : data.changeDirection === 'down' ? (
              <ArrowDown className="w-3 h-3" />
            ) : null}
            {data.change}%
          </div>
        )}
      </div>

      {data.target && (
        <div className="mt-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Target: {data.target}%</span>
          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full transition-all",
                data.status === 'on-track' ? "bg-priority-on-track" : "bg-priority-at-risk"
              )}
              style={{ width: `${Math.min(100, (parseFloat(String(data.value)) / data.target) * 100)}%` }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}
