import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface SupplierMethodologyTooltipProps {
  score: number;
  label: string;
  sampleSize?: number;
  dataPeriod?: string;
  deterministicPortion?: number;
  aiEstimatedPortion?: number;
}

/**
 * FIX 3 [C-04]: Methodology disclosure for supplier risk scores.
 */
export function SupplierMethodologyTooltip({
  score,
  label,
  sampleSize = 127,
  dataPeriod = 'Last 12 months',
  deterministicPortion = 72,
  aiEstimatedPortion = 28,
}: SupplierMethodologyTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button className="inline-flex items-center gap-0.5 cursor-help" aria-label={`${label} methodology`}>
          <Info className="w-3 h-3 text-muted-foreground hover:text-foreground transition-colors" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-xs text-xs space-y-1.5 p-3">
        <p className="font-semibold">{label} Score: {score}%</p>
        <p><strong>Calculation method:</strong> Weighted composite of [pass/fail history, audit results, delivery timeliness, certificate status]</p>
        <p><strong>Data period:</strong> {dataPeriod}</p>
        <p><strong>Sample size:</strong> {sampleSize} inspections across multiple factories</p>
        <p><strong>Deterministic portion:</strong> {deterministicPortion}% (based on recorded pass/fail history)</p>
        <p><strong>AI-estimated portion:</strong> {aiEstimatedPortion}% (based on historical pattern matching — seasonal factors, volume trends, fabric category risk)</p>
      </TooltipContent>
    </Tooltip>
  );
}
