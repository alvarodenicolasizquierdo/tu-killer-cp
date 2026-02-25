import { useState } from 'react';
import { tagEvent } from '@/utils/clarityTracking';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, Check, X, ChevronRight, Lightbulb, AlertTriangle, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { AIAssistSuggestion } from '@/types/styles';

interface AIAssistPanelProps {
  suggestions: AIAssistSuggestion[];
  onApplySuggestion?: (suggestion: AIAssistSuggestion) => void;
  onDismissSuggestion?: (suggestion: AIAssistSuggestion) => void;
  context?: string;
  isLoading?: boolean;
}

export function AIAssistPanel({
  suggestions,
  onApplySuggestion,
  onDismissSuggestion,
  context = 'AI Assist',
  isLoading = false
}: AIAssistPanelProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());

  const handleApply = (suggestion: AIAssistSuggestion) => {
    setAppliedIds(prev => new Set(prev).add(suggestion.id));
    tagEvent('ai_assist_apply', suggestion.type);
    onApplySuggestion?.(suggestion);
  };

  const getTypeIcon = (type: AIAssistSuggestion['type']) => {
    switch (type) {
      case 'component_set':
        return <Sparkles className="w-4 h-4" />;
      case 'test_plan':
        return <Lightbulb className="w-4 h-4" />;
      case 'care_label':
        return <Info className="w-4 h-4" />;
      case 'approval_block':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Brain className="w-4 h-4" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return 'text-emerald-600';
    if (confidence >= 70) return 'text-amber-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <Card className="border-2 border-dashed border-ai-primary/30 bg-ai-primary/5">
        <CardContent className="py-8">
          <div className="flex flex-col items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-ai-primary to-ai-secondary flex items-center justify-center"
            >
              <Brain className="w-5 h-5 text-white" />
            </motion.div>
            <p className="text-sm text-muted-foreground">AI is analyzing...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (suggestions.length === 0) {
    return (
      <Card className="border-2 border-dashed border-muted-foreground/20">
        <CardContent className="py-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <Brain className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">No suggestions yet</p>
              <p className="text-sm text-muted-foreground">AI will provide suggestions as you work</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-ai-primary/20 bg-gradient-to-br from-ai-primary/5 to-transparent">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-ai-primary to-ai-secondary flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div>
            <CardTitle className="text-base">{context}</CardTitle>
            <p className="text-xs text-muted-foreground">{suggestions.length} suggestion{suggestions.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <AnimatePresence>
          {suggestions.map((suggestion, index) => {
            const isExpanded = expandedId === suggestion.id;
            const isApplied = appliedIds.has(suggestion.id);
            
            return (
              <motion.div
                key={suggestion.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.05 }}
              >
                <div
                  className={cn(
                    "rounded-lg border transition-all",
                    isApplied 
                      ? "bg-emerald-50 border-emerald-200" 
                      : suggestion.type === 'approval_block'
                        ? "bg-amber-50 border-amber-200"
                        : "bg-background border-border hover:border-ai-primary/40"
                  )}
                >
                  {/* Header */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : suggestion.id)}
                    className="w-full px-4 py-3 flex items-center gap-3 text-left"
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                      isApplied 
                        ? "bg-emerald-100 text-emerald-600"
                        : suggestion.type === 'approval_block'
                          ? "bg-amber-100 text-amber-600"
                          : "bg-ai-primary/10 text-ai-primary"
                    )}>
                      {isApplied ? <Check className="w-4 h-4" /> : getTypeIcon(suggestion.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={cn(
                          "font-medium text-sm truncate",
                          isApplied && "text-emerald-700"
                        )}>
                          {suggestion.title}
                        </p>
                        {isApplied && (
                          <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs">
                            Applied
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {suggestion.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={cn("text-xs font-medium", getConfidenceColor(suggestion.confidence))}>
                        {suggestion.confidence}%
                      </span>
                      <ChevronRight className={cn(
                        "w-4 h-4 text-muted-foreground transition-transform",
                        isExpanded && "rotate-90"
                      )} />
                    </div>
                  </button>
                  
                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 pt-1 space-y-3 border-t border-border/50">
                          {/* Confidence Bar */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Confidence</span>
                              <span className={getConfidenceColor(suggestion.confidence)}>
                                {suggestion.confidence}%
                              </span>
                            </div>
                            <Progress value={suggestion.confidence} className="h-1.5" />
                          </div>
                          
                          {/* Reasoning */}
                          <div className="space-y-1.5">
                            <p className="text-xs font-medium text-muted-foreground">Why this suggestion?</p>
                            <ul className="space-y-1">
                              {suggestion.reasoning.map((reason, i) => (
                                <li key={i} className="text-xs text-foreground flex items-start gap-2">
                                  <span className="text-ai-primary mt-0.5">•</span>
                                  {reason}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          {/* Actions */}
                          {!isApplied && suggestion.type !== 'approval_block' && (
                            <div className="flex gap-2 pt-1">
                              <Button
                                size="sm"
                                onClick={() => handleApply(suggestion)}
                                className="flex-1 gap-1.5 bg-gradient-to-r from-ai-primary to-ai-secondary hover:opacity-90"
                              >
                                <Check className="w-3.5 h-3.5" />
                                Apply
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onDismissSuggestion?.(suggestion)}
                                className="gap-1.5"
                              >
                                <X className="w-3.5 h-3.5" />
                                Dismiss
                              </Button>
                            </div>
                          )}
                          
                          {suggestion.type === 'approval_block' && (
                            <div className="bg-amber-100 rounded-md p-2.5">
                              <p className="text-xs text-amber-800 font-medium">
                                Action Required: {suggestion.description}
                              </p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
