import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DefectSummary {
  critical: number;
  major: number;
  minor: number;
  total: number;
}

interface InspectionDefectsSummaryProps {
  defects: DefectSummary;
  sampleSize?: number;
  className?: string;
}

export function InspectionDefectsSummary({ defects, sampleSize, className }: InspectionDefectsSummaryProps) {
  const defectRate = sampleSize && sampleSize > 0 
    ? Math.round((defects.total / sampleSize) * 100 * 10) / 10 
    : null;

  const categories = [
    {
      label: 'Critical',
      count: defects.critical,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-500/10',
      description: 'Safety or compliance issues',
    },
    {
      label: 'Major',
      count: defects.major,
      icon: AlertCircle,
      color: 'text-amber-600',
      bgColor: 'bg-amber-500/10',
      description: 'Functional defects',
    },
    {
      label: 'Minor',
      count: defects.minor,
      icon: Info,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
      description: 'Cosmetic issues',
    },
  ];

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Defects Summary</CardTitle>
          <Badge variant="outline">
            {defects.total} total
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Defect Rate */}
        {defectRate !== null && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Defect Rate</span>
              <span className={cn(
                'font-semibold',
                defectRate <= 2.5 ? 'text-emerald-600' :
                defectRate <= 5 ? 'text-amber-600' : 'text-red-600'
              )}>
                {defectRate}%
              </span>
            </div>
            <Progress 
              value={Math.min(defectRate * 10, 100)} 
              className="h-2"
            />
            <p className="text-xs text-muted-foreground">
              {sampleSize} samples inspected
            </p>
          </div>
        )}

        {/* Category Breakdown */}
        <div className="space-y-3 pt-2 border-t">
          {categories.map((category) => (
            <div key={category.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={cn('p-1.5 rounded', category.bgColor)}>
                  <category.icon className={cn('h-3.5 w-3.5', category.color)} />
                </div>
                <div>
                  <p className="text-sm font-medium">{category.label}</p>
                  <p className="text-xs text-muted-foreground">{category.description}</p>
                </div>
              </div>
              <span className={cn(
                'text-lg font-bold',
                category.count > 0 ? category.color : 'text-muted-foreground'
              )}>
                {category.count}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default InspectionDefectsSummary;
