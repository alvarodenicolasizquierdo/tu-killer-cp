import { Info } from 'lucide-react';

/**
 * FIX 5 [C-05]: Mandatory disclaimer for all AI predictions.
 */
export function AIDisclaimerLine() {
  return (
    <p className="text-[10px] text-muted-foreground italic flex items-center gap-1 mt-1">
      <Info className="w-2.5 h-2.5 shrink-0" />
      AI suggestion only — human review required for all approval decisions.
    </p>
  );
}
