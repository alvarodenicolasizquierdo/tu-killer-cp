import { motion } from 'framer-motion';
import { FileText, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TRF } from '@/types';
import { Progress } from '@/components/ui/progress';

interface DraftResumeWidgetProps {
  drafts: TRF[];
}

export function DraftResumeWidget({ drafts }: DraftResumeWidgetProps) {
  const recentDrafts = drafts.slice(0, 3);

  return (
    <div className="space-y-3">
      {recentDrafts.map((draft, index) => (
        <motion.div
          key={draft.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 cursor-pointer transition-colors group"
        >
          <div className="flex items-start gap-3">
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
              draft.priority === 'critical' && "bg-red-100",
              draft.priority === 'at-risk' && "bg-amber-100",
              draft.priority === 'on-track' && "bg-emerald-100",
              draft.priority === 'info' && "bg-blue-100"
            )}>
              <FileText className={cn(
                "w-5 h-5",
                draft.priority === 'critical' && "text-red-600",
                draft.priority === 'at-risk' && "text-amber-600",
                draft.priority === 'on-track' && "text-emerald-600",
                draft.priority === 'info' && "text-blue-600"
              )} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                  {draft.reference}
                </h4>
                <span className="text-xs text-muted-foreground shrink-0">
                  {draft.progress}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {draft.productName}
              </p>
              <Progress value={draft.progress} className="h-1.5 mt-2" />
            </div>
          </div>
        </motion.div>
      ))}

      {recentDrafts.length === 0 && (
        <div className="text-center py-6 text-muted-foreground">
          <CheckCircle className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
          <p className="text-sm">No drafts in progress</p>
        </div>
      )}
    </div>
  );
}
