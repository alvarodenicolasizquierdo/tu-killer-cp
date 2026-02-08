import { motion } from 'framer-motion';
import { Clock, AlertTriangle, CheckCircle, FileText, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Task } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useBuyerReadOnly } from '@/hooks/useBuyerReadOnly';
import { AIConfidenceMetadata } from '@/components/compliance/AIConfidenceMetadata';
import { AIDisclaimerLine } from '@/components/compliance/AIDisclaimerLine';

interface TaskCardProps {
  task: Task;
  index?: number;
}

export function TaskCard({ task, index = 0 }: TaskCardProps) {
  const { isBuyerReadOnly } = useBuyerReadOnly();
  const priorityStyles = {
    critical: {
      border: 'border-l-priority-critical',
      bg: 'bg-red-50/50',
      badge: 'bg-red-100 text-red-700 border-red-200'
    },
    'at-risk': {
      border: 'border-l-priority-at-risk',
      bg: 'bg-amber-50/50',
      badge: 'bg-amber-100 text-amber-700 border-amber-200'
    },
    'on-track': {
      border: 'border-l-priority-on-track',
      bg: 'bg-emerald-50/50',
      badge: 'bg-emerald-100 text-emerald-700 border-emerald-200'
    },
    info: {
      border: 'border-l-priority-info',
      bg: 'bg-blue-50/50',
      badge: 'bg-blue-100 text-blue-700 border-blue-200'
    }
  };

  const styles = priorityStyles[task.priority];

  const typeIcons = {
    approval: CheckCircle,
    review: FileText,
    upload: FileText,
    action: AlertTriangle,
    notification: AlertTriangle
  };

  const TypeIcon = typeIcons[task.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        "task-card border-l-4",
        styles.border,
        styles.bg,
        !task.isRead && "ring-1 ring-primary/20"
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
          task.priority === 'critical' && "bg-red-100",
          task.priority === 'at-risk' && "bg-amber-100",
          task.priority === 'on-track' && "bg-emerald-100",
          task.priority === 'info' && "bg-blue-100"
        )}>
          <TypeIcon className={cn(
            "w-4 h-4",
            task.priority === 'critical' && "text-red-600",
            task.priority === 'at-risk' && "text-amber-600",
            task.priority === 'on-track' && "text-emerald-600",
            task.priority === 'info' && "text-blue-600"
          )} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className={cn(
              "font-medium text-sm",
              !task.isRead ? "text-foreground" : "text-muted-foreground"
            )}>
              {task.title}
            </h4>
            <Badge variant="outline" className={cn("shrink-0 text-xs", styles.badge)}>
              {task.priority === 'critical' ? 'Critical' : 
               task.priority === 'at-risk' ? 'At Risk' : 
               task.priority === 'on-track' ? 'On Track' : 'Info'}
            </Badge>
          </div>
          
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {task.description}
          </p>

          {/* SLA Indicator */}
          {task.slaRemaining !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              <Clock className={cn(
                "w-3 h-3",
                task.slaRemaining <= 24 ? "text-red-500" : "text-muted-foreground"
              )} />
              <span className={cn(
                "text-xs",
                task.slaRemaining <= 24 ? "text-red-600 font-medium" : "text-muted-foreground"
              )}>
                {task.slaRemaining}h remaining
              </span>
            </div>
          )}

          {/* AI Review Prioritisation [FIX 2: C-02] */}
          {task.aiRecommendation && (
            <div className="mt-3 p-2 rounded-md bg-gradient-to-r from-ai-primary/5 to-ai-secondary/5 border border-ai-primary/10">
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3 h-3 text-ai-primary" />
                <span className="text-xs font-medium text-ai-primary">AI Review Prioritisation</span>
              </div>
              {task.aiConfidence && (
                <AIConfidenceMetadata confidence={task.aiConfidence} />
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {task.type === 'approval' 
                  ? `High priority for review — approaching SLA deadline`
                  : task.aiRecommendation.replace(/approve|reject|approve with conditions/gi, 'review')}
              </p>
              <AIDisclaimerLine />
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions — hidden for Buyer role [FIX 1: C-01] */}
      {!isBuyerReadOnly && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
          <Button size="sm" variant="default" className="h-7 text-xs">
            {task.type === 'approval' ? 'Review & Approve' : 
             task.type === 'review' ? 'Open Details' :
             task.type === 'upload' ? 'Upload Files' : 'Take Action'}
          </Button>
          <Button size="sm" variant="ghost" className="h-7 text-xs text-muted-foreground">
            Dismiss
          </Button>
        </div>
      )}
    </motion.div>
  );
}
