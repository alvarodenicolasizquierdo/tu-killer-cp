/**
 * AdminBadge - Visual indicator for admin mode
 * Only visible when user is admin AND NEW_IA_NAV_AND_HOME feature flag is enabled
 */

import { Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AdminBadgeProps {
  /** Additional class names */
  className?: string;
  /** Variant: 'header' for top bar, 'sidebar' for sidebar placement */
  variant?: 'header' | 'sidebar';
}

export function AdminBadge({ className, variant = 'header' }: AdminBadgeProps) {
  if (variant === 'sidebar') {
    return (
      <div className={cn(
        "flex items-center gap-1.5 px-2 py-1 rounded-md",
        "bg-priority-at-risk/10 border border-priority-at-risk/20",
        className
      )}>
        <Shield className="w-3 h-3 text-priority-at-risk" />
        <span className="text-xs font-medium text-priority-at-risk">Admin</span>
      </div>
    );
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1 bg-priority-at-risk/10 border-priority-at-risk/30 text-priority-at-risk hover:bg-priority-at-risk/20",
        className
      )}
    >
      <Shield className="w-3 h-3" />
      <span className="text-xs">Admin Mode</span>
    </Badge>
  );
}
