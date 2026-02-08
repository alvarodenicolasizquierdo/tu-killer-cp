import { formatDistanceToNow } from 'date-fns';

interface LastUpdatedTimestampProps {
  timestamp?: string;
}

/**
 * FIX 9 [NEW]: Shows last-updated timestamp for aggregate metrics.
 */
export function LastUpdatedTimestamp({ timestamp }: LastUpdatedTimestampProps) {
  const ts = timestamp || new Date().toISOString();
  const relative = formatDistanceToNow(new Date(ts), { addSuffix: true });

  return (
    <p className="text-[10px] text-muted-foreground mt-1">
      Last updated: {relative}
    </p>
  );
}
