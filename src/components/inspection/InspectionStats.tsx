import { Card, CardContent } from '@/components/ui/card';
import { ClipboardCheck, Clock, Loader2, CheckCircle2, AlertTriangle, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InspectionStatsProps {
  stats: {
    total: number;
    scheduled: number;
    inProgress: number;
    completed: number;
    passRate: number;
    highRisk: number;
  };
}

export function InspectionStats({ stats }: InspectionStatsProps) {
  const statCards = [
    {
      label: 'Total',
      value: stats.total,
      icon: ClipboardCheck,
      color: 'text-foreground',
      bgColor: 'bg-muted/50',
    },
    {
      label: 'Scheduled',
      value: stats.scheduled,
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'In Progress',
      value: stats.inProgress,
      icon: Loader2,
      color: 'text-amber-600',
      bgColor: 'bg-amber-500/10',
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-500/10',
    },
    {
      label: 'Pass Rate',
      value: `${stats.passRate}%`,
      icon: TrendingUp,
      color: stats.passRate >= 80 ? 'text-emerald-600' : stats.passRate >= 60 ? 'text-amber-600' : 'text-red-600',
      bgColor: stats.passRate >= 80 ? 'bg-emerald-500/10' : stats.passRate >= 60 ? 'bg-amber-500/10' : 'bg-red-500/10',
    },
    {
      label: 'High Risk',
      value: stats.highRisk,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statCards.map((stat) => (
        <Card key={stat.label} className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={cn('p-2 rounded-lg', stat.bgColor)}>
                <stat.icon className={cn('h-5 w-5', stat.color)} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className={cn('text-xl font-bold', stat.color)}>{stat.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default InspectionStats;
