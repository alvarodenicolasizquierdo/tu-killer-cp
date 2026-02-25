import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Target, 
  AlertCircle, 
  Zap, 
  Headphones, 
  CheckCircle2, 
  ChevronRight,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { EscalationPanel } from './EscalationPanel';

export interface GuidedResolutionData {
  id: string;
  title: string;
  intent: string;
  causes: string[];
  steps: {
    action: string;
    detail?: string;
  }[];
  // Hidden tags for Carlos AI intent matching (not displayed to users)
  tags?: string[];
  aiNotes?: {
    rootCauseTags: string[];
    confidence?: number;
    relatedIssues?: string[];
  };
}

interface GuidedResolutionProps {
  data: GuidedResolutionData;
  onEscalate?: () => void;
  onStepComplete?: (stepIndex: number) => void;
}

export function GuidedResolution({ data, onStepComplete }: GuidedResolutionProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [showEscalation, setShowEscalation] = useState(false);

  const handleStepClick = (index: number) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(index)) {
      newCompleted.delete(index);
    } else {
      newCompleted.add(index);
    }
    setCompletedSteps(newCompleted);
    onStepComplete?.(index);
  };

  const allStepsComplete = completedSteps.size === data.steps.length;

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        {/* TITLE */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs font-normal">
              <Clock className="w-3 h-3 mr-1" />
              ~60 sec fix
            </Badge>
          </div>
          <h1 className="text-2xl font-bold text-foreground leading-tight">
            {data.title}
          </h1>
        </motion.div>

        {/* SECTION 1: What you are trying to do */}
        <motion.section
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-l-4 border-l-primary bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Target className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-foreground mb-1">
                    What you are trying to do
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {data.intent}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* SECTION 2: Why this usually happens */}
        <motion.section
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-semibold text-foreground">
              Why this usually happens
            </h2>
          </div>
          <ul className="space-y-2 pl-6">
            {data.causes.map((cause, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="relative text-sm text-muted-foreground before:absolute before:-left-4 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-amber-500/60"
              >
                {cause}
              </motion.li>
            ))}
          </ul>
        </motion.section>

        {/* SECTION 3: Fix it in 60 seconds */}
        <motion.section
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">
              Fix it in 60 seconds
            </h2>
          </div>
          <div className="space-y-2">
            {data.steps.map((step, index) => {
              const isComplete = completedSteps.has(index);
              return (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.08 }}
                  onClick={() => handleStepClick(index)}
                  className={cn(
                    "w-full text-left p-3 rounded-lg border transition-all",
                    "hover:shadow-sm hover:border-primary/30",
                    isComplete 
                      ? "bg-primary/5 border-primary/30" 
                      : "bg-card border-border"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-colors",
                      isComplete 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted text-muted-foreground"
                    )}>
                      {isComplete ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "text-sm font-medium transition-colors",
                        isComplete ? "text-primary" : "text-foreground"
                      )}>
                        {step.action}
                      </p>
                      {step.detail && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {step.detail}
                        </p>
                      )}
                    </div>
                    <ChevronRight className={cn(
                      "w-4 h-4 shrink-0 transition-colors",
                      isComplete ? "text-primary" : "text-muted-foreground"
                    )} />
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Completion message */}
          {allStepsComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 p-3 bg-green-500/10 rounded-lg border border-green-500/20"
            >
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-green-700 dark:text-green-400">
                All steps completed! Your issue should be resolved.
              </span>
            </motion.div>
          )}
        </motion.section>

        {/* SECTION 4: Still not working? */}
        <motion.section
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="pt-4 border-t border-border"
        >
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                    <Headphones className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      Still not working?
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Get help from the THT support team
                    </p>
                  </div>
                </div>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => setShowEscalation(true)}
                  className="shrink-0"
                >
                  Escalate to THT
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* SECTION 5: Hidden AI notes (visually hidden, for AI context only) */}
        {data.aiNotes && (
          <div className="sr-only" aria-hidden="true" data-ai-context="true">
            <div data-root-cause-tags={data.aiNotes.rootCauseTags.join(',')} />
            {data.aiNotes.confidence && (
              <div data-confidence={data.aiNotes.confidence} />
            )}
            {data.aiNotes.relatedIssues && (
              <div data-related-issues={data.aiNotes.relatedIssues.join(',')} />
            )}
          </div>
        )}
      </div>

      {/* Escalation Panel */}
      <EscalationPanel
        open={showEscalation}
        onOpenChange={setShowEscalation}
        resolution={data}
        completedSteps={Array.from(completedSteps)}
      />
    </ScrollArea>
  );
}

// Example data for demonstration
export const exampleResolution: GuidedResolutionData = {
  id: 'missing-trf-tab',
  title: "I can't see the TRF tab on my style",
  intent: "You want to submit a Test Request Form (TRF) for a style, but the TRF tab is not visible in the style detail view.",
  causes: [
    "The style hasn't been assigned a testing level yet",
    "Your user role doesn't have TRF access permissions",
    "The style is in 'Draft' status and TRFs are only available for 'Active' styles",
    "There's a browser cache issue hiding the tab"
  ],
  steps: [
    { 
      action: "Check if a Testing Level is assigned",
      detail: "Go to the style's 'Testing' section and verify a level is selected"
    },
    { 
      action: "Verify the style status is 'Active'",
      detail: "Draft styles don't show TRF options until activated"
    },
    { 
      action: "Confirm your role has TRF permissions",
      detail: "Check Settings → Profile → Permissions"
    },
    { 
      action: "Clear browser cache and refresh",
      detail: "Press Ctrl+Shift+R (or Cmd+Shift+R on Mac)"
    },
    { 
      action: "Try logging out and back in",
      detail: "This refreshes your session and permissions"
    }
  ],
  aiNotes: {
    rootCauseTags: ['permissions', 'testing-level', 'style-status', 'cache'],
    confidence: 0.92,
    relatedIssues: ['missing-lab-tab', 'trf-submission-error', 'style-activation']
  }
};
