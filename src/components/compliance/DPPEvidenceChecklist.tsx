import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EvidenceItem {
  label: string;
  status: 'verified' | 'partial' | 'pending';
  detail?: string;
}

/**
 * FIX 4 [C-03]: Replace DPP percentage with evidence checklist.
 */
export function DPPEvidenceChecklist() {
  const items: EvidenceItem[] = [
    { label: 'Material composition data', status: 'verified' },
    { label: 'Supply chain traceability', status: 'partial', detail: '2 of 5 tiers mapped' },
    { label: 'Care instruction compliance', status: 'verified' },
    { label: 'Chemical compliance (REACH)', status: 'pending', detail: 'Pending lab results' },
    { label: 'Manufacturing location data', status: 'verified' },
    { label: 'Recycled content certification', status: 'pending', detail: 'Awaiting 3rd party cert' },
    { label: 'Product safety testing', status: 'partial', detail: '8 of 12 tests completed' },
  ];

  const verified = items.filter(i => i.status === 'verified').length;
  const deterministic = Math.round((verified / items.length) * 100);

  const StatusIcon = ({ status }: { status: EvidenceItem['status'] }) => {
    switch (status) {
      case 'verified': return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />;
      case 'partial': return <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />;
      case 'pending': return <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />;
    }
  };

  return (
    <div className="space-y-2">
      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">DPP Evidence Items</h5>
      <div className="space-y-1.5">
        {items.map((item) => (
          <div key={item.label} className="flex items-start gap-2 text-xs">
            <StatusIcon status={item.status} />
            <div className="min-w-0">
              <span className={cn(
                "font-medium",
                item.status === 'verified' ? 'text-foreground' : 'text-muted-foreground'
              )}>
                {item.label}
              </span>
              {item.detail && (
                <span className="text-muted-foreground"> — {item.detail}</span>
              )}
            </div>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-muted-foreground mt-2 pt-2 border-t border-border/50">
        {verified} of {items.length} evidence items verified ({deterministic}% deterministic) — remaining items require lab confirmation.
      </p>
    </div>
  );
}
