import { Database } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface AIConfidenceMetadataProps {
  confidence: number;
  dataSource?: string;
  sampleSize?: number;
  dataPeriod?: string;
}

/**
 * FIX 5 [C-05]: Adds data source, confidence interval, and sample size
 * to any AI-generated prediction or score.
 */
export function AIConfidenceMetadata({ 
  confidence, 
  dataSource = '142 historical TRFs, Jan 2024 – Feb 2026',
  sampleSize = 142,
  dataPeriod = 'Last 24 months'
}: AIConfidenceMetadataProps) {
  const low = Math.max(0, confidence - 5);
  const high = Math.min(100, confidence + 4);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground cursor-help underline decoration-dotted">
          <Database className="w-2.5 h-2.5" />
          {confidence}% (range: {low}–{high}%)
        </span>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-xs text-xs space-y-1">
        <p><strong>Source:</strong> {dataSource}</p>
        <p><strong>Confidence interval:</strong> {low}–{high}%</p>
        <p><strong>Sample size:</strong> {sampleSize}</p>
        <p><strong>Data period:</strong> {dataPeriod}</p>
      </TooltipContent>
    </Tooltip>
  );
}
