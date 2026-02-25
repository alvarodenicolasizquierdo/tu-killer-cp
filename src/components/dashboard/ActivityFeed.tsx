import { motion } from 'framer-motion';
import { FileText, CheckCircle, MessageSquare, Upload, Activity as ActivityIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Activity } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface ActivityFeedProps {
  activities: Activity[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const getIcon = (type: Activity['type']) => {
    switch (type) {
      case 'trf_update':
      case 'status_change':
        return FileText;
      case 'test_result':
        return ActivityIcon;
      case 'approval':
        return CheckCircle;
      case 'comment':
        return MessageSquare;
      case 'upload':
        return Upload;
      default:
        return FileText;
    }
  };

  const getIconColor = (type: Activity['type']) => {
    switch (type) {
      case 'approval':
        return 'text-emerald-500 bg-emerald-50';
      case 'test_result':
        return 'text-blue-500 bg-blue-50';
      case 'comment':
        return 'text-purple-500 bg-purple-50';
      case 'upload':
        return 'text-amber-500 bg-amber-50';
      default:
        return 'text-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => {
        const Icon = getIcon(activity.type);
        const iconColor = getIconColor(activity.type);

        return (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex gap-3"
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
              iconColor
            )}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm">
                <span className="font-medium text-foreground">{activity.actor}</span>
                {' '}
                <span className="text-muted-foreground">{activity.action}</span>
                {' '}
                <span className="font-medium text-primary">{activity.target}</span>
              </p>
              {activity.metadata?.comment && (
                <p className="text-xs text-muted-foreground mt-1 bg-muted/50 p-2 rounded-md">
                  "{String(activity.metadata.comment)}"
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
