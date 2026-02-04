import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertTriangle, ChevronRight, Brain, Zap, GitBranch } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AIComputedTask } from '@/types/ai-context';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AIReasoningPanel } from './AIReasoningPanel';

interface AITaskCardProps {
  task: AIComputedTask;
  index?: number;
}

export function AITaskCard({ task, index = 0 }: AITaskCardProps) {
  const [showReasoning, setShowReasoning] = useState(false);

  const priorityStyles = {
    critical: {
      border: 'border-l-red-500',
      bg: 'bg-red-50/50',
      badge: 'bg-red-100 text-red-700 border-red-200'
    },
    'at-risk': {
      border: 'border-l-amber-500',
      bg: 'bg-amber-50/50',
      badge: 'bg-amber-100 text-amber-700 border-amber-200'
    },
    'on-track': {
      border: 'border-l-emerald-500',
      bg: 'bg-emerald-50/50',
      badge: 'bg-emerald-100 text-emerald-700 border-emerald-200'
    },
    info: {
      border: 'border-l-blue-500',
      bg: 'bg-blue-50/50',
      badge: 'bg-blue-100 text-blue-700 border-blue-200'
    }
  };

  const styles = priorityStyles[task.priority];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        className={cn(
          "rounded-lg border-l-4 border bg-card p-4 shadow-sm hover:shadow-md transition-shadow",
          styles.border,
          styles.bg
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-sm text-foreground">{task.title}</h4>
              <Badge variant="outline" className={cn("text-xs", styles.badge)}>
                {task.priority === 'critical' ? 'Critical' : 
                 task.priority === 'at-risk' ? 'At Risk' : 
                 task.priority === 'on-track' ? 'On Track' : 'Info'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
          </div>
          
          {/* Impact Score */}
          <div className="text-right shrink-0">
            <div className={cn(
              "text-lg font-bold",
              task.impactScore >= 80 ? "text-red-600" : 
              task.impactScore >= 60 ? "text-amber-600" : "text-emerald-600"
            )}>
              {task.impactScore}
            </div>
            <span className="text-xs text-muted-foreground">Impact</span>
          </div>
        </div>

        {/* Metrics Bar */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="text-center p-2 rounded bg-background/50">
            <div className="text-sm font-semibold text-foreground">{task.urgencyScore}</div>
            <div className="text-xs text-muted-foreground">Urgency</div>
          </div>
          <div className="text-center p-2 rounded bg-background/50">
            <div className="text-sm font-semibold text-foreground">{task.riskScore.toFixed(0)}</div>
            <div className="text-xs text-muted-foreground">Risk</div>
          </div>
          <div className="text-center p-2 rounded bg-background/50">
            <div className="text-sm font-semibold text-foreground">{task.recommendedAction.confidence}%</div>
            <div className="text-xs text-muted-foreground">AI Conf.</div>
          </div>
        </div>

        {/* SLA Warning */}
        {task.slaHoursRemaining !== undefined && (
          <div className="flex items-center gap-1.5 mb-3 py-1.5 px-2 rounded bg-red-100/50 border border-red-200">
            <Clock className={cn(
              "w-3.5 h-3.5",
              task.slaHoursRemaining <= 24 ? "text-red-500" : "text-amber-500"
            )} />
            <span className={cn(
              "text-xs font-medium",
              task.slaHoursRemaining <= 24 ? "text-red-600" : "text-amber-600"
            )}>
              {task.slaHoursRemaining}h remaining • SLA breach imminent
            </span>
          </div>
        )}

        {/* Dependency Chain */}
        {task.dependencyChain.length > 0 && (
          <div className="flex items-center gap-1.5 mb-3 text-muted-foreground">
            <GitBranch className="w-3.5 h-3.5" />
            <span className="text-xs">
              Blocks: {task.dependencyChain.join(' → ')}
            </span>
          </div>
        )}

        {/* AI Recommendation */}
        <div className="p-2.5 rounded-md bg-gradient-to-r from-ai-primary/5 to-ai-secondary/5 border border-ai-primary/10 mb-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Brain className="w-3.5 h-3.5 text-ai-primary" />
            <span className="text-xs font-medium text-ai-primary">AI Recommendation</span>
            <span className="text-xs text-muted-foreground">({task.recommendedAction.confidence}% confidence)</span>
          </div>
          <p className="text-xs text-muted-foreground">{task.reasoning.fastestFix}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <button
            onClick={() => setShowReasoning(true)}
            className="text-xs text-ai-primary hover:text-ai-primary/80 flex items-center gap-1"
          >
            <Brain className="w-3 h-3" />
            Why am I seeing this?
          </button>
          
          <Button size="sm" className="h-7 text-xs gap-1.5">
            <Zap className="w-3 h-3" />
            {task.recommendedAction.label}
            <ChevronRight className="w-3 h-3" />
          </Button>
        </div>
      </motion.div>

      <AIReasoningPanel
        reasoning={task.reasoning}
        isOpen={showReasoning}
        onClose={() => setShowReasoning(false)}
        title="AI Reasoning"
      />
    </>
  );
}
