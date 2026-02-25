import { Package, FileText, Factory } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface SupplierActivityProps {
  activeStyles: number;
  openTRFs: number;
  factoryCount: number;
  passRate: number;
}

export function SupplierActivity({ activeStyles, openTRFs, factoryCount, passRate }: SupplierActivityProps) {
  const stats = [
    { icon: Package, color: 'text-violet-600', value: activeStyles, label: 'Styles' },
    { icon: FileText, color: 'text-blue-600', value: openTRFs, label: 'TRFs' },
    { icon: Factory, color: 'text-slate-600', value: factoryCount, label: 'Factories' },
  ];

  return (
    <div>
      <h4 className="text-sm font-semibold mb-3">Activity</h4>
      <div className="grid grid-cols-3 gap-3">
        {stats.map(({ icon: Icon, color, value, label }) => (
          <div key={label} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
            <Icon className={`w-4 h-4 ${color}`} />
            <div>
              <p className="font-semibold">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3">
        <div className="flex items-center justify-between text-sm mb-1">
          <span>Pass Rate</span>
          <span className="font-medium">{passRate}%</span>
        </div>
        <Progress value={passRate} className="h-2" />
      </div>
    </div>
  );
}
