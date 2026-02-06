import { cn } from '@/lib/utils';

interface SupplierScoresProps {
  overallScore: number;
  complianceScore: number;
  qualityScore: number;
  deliveryScore: number;
}

function getScoreColor(score: number) {
  if (score >= 90) return 'text-emerald-600';
  if (score >= 75) return 'text-amber-600';
  return 'text-red-600';
}

export function SupplierScores({ overallScore, complianceScore, qualityScore, deliveryScore }: SupplierScoresProps) {
  const scores = [
    { value: overallScore, label: 'Overall' },
    { value: complianceScore, label: 'Compliance' },
    { value: qualityScore, label: 'Quality' },
    { value: deliveryScore, label: 'Delivery' },
  ];

  return (
    <div>
      <h4 className="text-sm font-semibold mb-3">Performance Scores</h4>
      <div className="grid grid-cols-2 gap-4">
        {scores.map(({ value, label }) => (
          <div key={label} className="text-center p-3 rounded-lg bg-muted/50">
            <p className={cn("text-2xl font-bold", getScoreColor(value))}>{value}%</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
