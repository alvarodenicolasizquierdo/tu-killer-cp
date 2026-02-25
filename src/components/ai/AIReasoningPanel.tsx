import { motion, AnimatePresence } from 'framer-motion';
import { Brain, AlertTriangle, FileCheck, Zap, X, ExternalLink } from 'lucide-react';
import { AIReasoning } from '@/types/ai-context';
import { Button } from '@/components/ui/button';
import { InternalOnly } from '@/components/demo';

interface AIReasoningPanelProps {
  reasoning: AIReasoning;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export function AIReasoningPanel({ reasoning, isOpen, onClose, title = 'AI Reasoning' }: AIReasoningPanelProps) {
  return (
    <InternalOnly>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed right-4 top-20 w-96 max-h-[calc(100vh-6rem)] overflow-y-auto z-50"
          >
            <div className="bg-card border border-ai-primary/30 rounded-xl shadow-xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-ai-primary to-ai-secondary p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-white" />
                    <h3 className="font-semibold text-white">{title}</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-white/80 hover:text-white hover:bg-white/10"
                    onClick={onClose}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="w-4 h-4" />
                    <h4 className="text-sm font-semibold">Why is this a problem?</h4>
                  </div>
                  <p className="text-sm text-muted-foreground pl-6">
                    {reasoning.whyProblem}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-blue-600">
                    <FileCheck className="w-4 h-4" />
                    <h4 className="text-sm font-semibold">Supporting Evidence</h4>
                  </div>
                  <ul className="space-y-1 pl-6">
                    {reasoning.evidence.map((item, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-amber-600">
                    <AlertTriangle className="w-4 h-4" />
                    <h4 className="text-sm font-semibold">If Ignored</h4>
                  </div>
                  <p className="text-sm text-muted-foreground pl-6">
                    {reasoning.consequenceIfIgnored}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <Zap className="w-4 h-4" />
                    <h4 className="text-sm font-semibold">Fastest Resolution</h4>
                  </div>
                  <p className="text-sm text-muted-foreground pl-6">
                    {reasoning.fastestFix}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-border p-3 bg-muted/30">
                <button className="w-full text-xs text-ai-primary hover:text-ai-primary/80 flex items-center justify-center gap-1">
                  View detailed analysis
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </InternalOnly>
  );
}
