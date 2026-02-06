/**
 * CollapsibleSection - Progressive disclosure component
 * Shows a limited number of items with "Show more / Show less" toggle
 * Used when NEW_IA_NAV_AND_HOME feature flag is enabled
 */

import { useState, ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CollapsibleSectionProps {
  /** All items to potentially display */
  children: ReactNode[];
  /** Number of items to show when collapsed (default: 5) */
  initialCount?: number;
  /** Label for the expand button (default: "Show more") */
  showMoreLabel?: string;
  /** Label for the collapse button (default: "Show less") */
  showLessLabel?: string;
  /** Additional class names for the container */
  className?: string;
  /** Whether to start expanded */
  defaultExpanded?: boolean;
}

export function CollapsibleSection({
  children,
  initialCount = 5,
  showMoreLabel = "Show more",
  showLessLabel = "Show less",
  className,
  defaultExpanded = false,
}: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  
  const items = Array.isArray(children) ? children : [children];
  const hasMore = items.length > initialCount;
  const visibleItems = isExpanded ? items : items.slice(0, initialCount);
  const hiddenCount = items.length - initialCount;

  if (!hasMore) {
    // No need for collapse logic if all items fit
    return <div className={className}>{items}</div>;
  }

  return (
    <div className={className}>
      <AnimatePresence initial={false}>
        {visibleItems.map((item, index) => (
          <motion.div
            key={index}
            initial={index >= initialCount ? { opacity: 0, height: 0 } : false}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {item}
          </motion.div>
        ))}
      </AnimatePresence>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "w-full mt-2 text-muted-foreground hover:text-foreground",
          "border border-dashed border-border hover:border-primary/30"
        )}
      >
        {isExpanded ? (
          <>
            <ChevronUp className="w-4 h-4 mr-1" />
            {showLessLabel}
          </>
        ) : (
          <>
            <ChevronDown className="w-4 h-4 mr-1" />
            {showMoreLabel} ({hiddenCount} more)
          </>
        )}
      </Button>
    </div>
  );
}

/**
 * Wrapper version that conditionally applies CollapsibleSection
 * based on feature flag state
 */
interface ConditionalCollapsibleProps extends CollapsibleSectionProps {
  /** Whether the collapsible behavior is enabled */
  enabled: boolean;
}

export function ConditionalCollapsible({
  enabled,
  children,
  ...props
}: ConditionalCollapsibleProps) {
  if (!enabled) {
    return <>{children}</>;
  }

  return <CollapsibleSection {...props}>{children}</CollapsibleSection>;
}
