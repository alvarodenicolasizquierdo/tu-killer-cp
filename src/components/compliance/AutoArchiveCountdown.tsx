import { AlertTriangle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AutoArchiveCountdownProps {
  /** Date the style was created or became inactive */
  createdDate: string;
  /** Auto-archive threshold in days */
  threshold?: number;
}

/**
 * FIX 8 [C-19]: Shows countdown when within 30 days of 90-day auto-archive.
 */
export function AutoArchiveCountdown({ createdDate, threshold = 90 }: AutoArchiveCountdownProps) {
  const created = new Date(createdDate);
  const archiveDate = new Date(created.getTime() + threshold * 24 * 60 * 60 * 1000);
  const now = new Date();
  const daysRemaining = Math.ceil((archiveDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  // Only show if within 30 days of threshold
  if (daysRemaining > 30 || daysRemaining < 0) return null;

  const isUrgent = daysRemaining <= 14;

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md",
      isUrgent
        ? "bg-red-100 text-red-700 border border-red-200"
        : "bg-amber-100 text-amber-700 border border-amber-200"
    )}>
      {isUrgent ? (
        <AlertTriangle className="w-3 h-3 shrink-0" />
      ) : (
        <Clock className="w-3 h-3 shrink-0" />
      )}
      {isUrgent ? '⚠️' : ''} Auto-archive in {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}
    </div>
  );
}
