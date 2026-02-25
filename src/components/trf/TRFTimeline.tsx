import { TRFTimelineEvent } from '@/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { 
  FileText, 
  Send, 
  Package, 
  TestTube, 
  CheckCircle, 
  Clock, 
  MessageSquare, 
  Upload, 
  RotateCcw,
  XCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const eventIconMap: Record<TRFTimelineEvent['type'], React.ComponentType<{ className?: string }>> = {
  created: FileText,
  submitted: Send,
  sample_received: Package,
  testing_started: TestTube,
  test_completed: CheckCircle,
  review_requested: Clock,
  approved: CheckCircle,
  rejected: XCircle,
  comment: MessageSquare,
  document_uploaded: Upload,
  retest_requested: RotateCcw,
};

const eventColorMap: Record<TRFTimelineEvent['type'], string> = {
  created: 'bg-blue-500',
  submitted: 'bg-indigo-500',
  sample_received: 'bg-purple-500',
  testing_started: 'bg-cyan-500',
  test_completed: 'bg-emerald-500',
  review_requested: 'bg-amber-500',
  approved: 'bg-green-500',
  rejected: 'bg-red-500',
  comment: 'bg-slate-500',
  document_uploaded: 'bg-violet-500',
  retest_requested: 'bg-orange-500',
};

interface TRFTimelineProps {
  events: TRFTimelineEvent[];
}

export function TRFTimeline({ events }: TRFTimelineProps) {
  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

      <div className="space-y-4">
        {sortedEvents.map((event, index) => {
          const Icon = eventIconMap[event.type];
          const color = eventColorMap[event.type];

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative flex gap-4 pl-10"
            >
              {/* Icon */}
              <div
                className={cn(
                  "absolute left-0 w-8 h-8 rounded-full flex items-center justify-center",
                  color
                )}
              >
                <Icon className="w-4 h-4 text-white" />
              </div>

              {/* Content */}
              <div className="flex-1 pb-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-medium text-sm">{event.title}</h4>
                    {event.description && (
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {event.description}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      by {event.actor}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {format(new Date(event.timestamp), 'MMM d, h:mm a')}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
