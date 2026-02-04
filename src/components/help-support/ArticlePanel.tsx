import { HelpArticle } from '@/data/helpKnowledgeBase';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Lightbulb, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

// Legacy article format for backward compatibility
interface LegacyArticle {
  id: string;
  title: string;
  categoryId: string;
  intentId?: string;
  steps: {
    title: string;
    content: string;
    tip?: string;
  }[];
  relatedArticles?: string[];
}

interface ArticlePanelProps {
  article: LegacyArticle | null;
  articles: LegacyArticle[];
  onSelectRelated: (articleId: string) => void;
}

export function ArticlePanel({ article, articles, onSelectRelated }: ArticlePanelProps) {
  if (!article) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center p-8 max-w-sm">
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">What do you need help with?</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Select an issue above or browse categories to get step-by-step guidance.
          </p>
        </div>
      </div>
    );
  }

  const relatedArticles = article.relatedArticles
    ?.map(id => articles.find(a => a.id === id))
    .filter(Boolean) as LegacyArticle[];

  return (
    <ScrollArea className="h-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={article.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="p-6"
        >
          {/* Header - Stripe docs style */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
                {article.steps.length} steps
              </span>
            </div>
            <h2 className="text-xl font-semibold text-foreground tracking-tight">
              {article.title}
            </h2>
          </div>

          {/* Steps - Clean numbered list like Stripe/Linear */}
          <div className="space-y-0">
            {article.steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.06 }}
                className="relative"
              >
                {/* Vertical connector line */}
                {index < article.steps.length - 1 && (
                  <div className="absolute left-[15px] top-[36px] bottom-0 w-px bg-border" />
                )}
                
                <div className="flex gap-4 pb-6">
                  {/* Step number */}
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0",
                    "bg-muted text-muted-foreground border border-border"
                  )}>
                    {index + 1}
                  </div>
                  
                  {/* Step content */}
                  <div className="flex-1 pt-1">
                    <h4 className="font-medium text-foreground mb-1.5">
                      {step.title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.content}
                    </p>
                    
                    {/* Tip - Notion style callout */}
                    {step.tip && (
                      <div className="mt-3 flex items-start gap-2 p-3 bg-amber-500/5 rounded-md border border-amber-500/10">
                        <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-700 dark:text-amber-400">
                          {step.tip}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Completion indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: article.steps.length * 0.06 }}
            className="flex items-center gap-3 p-4 bg-emerald-500/5 rounded-lg border border-emerald-500/10 mt-2"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <p className="text-sm text-emerald-700 dark:text-emerald-400">
              Follow these steps to complete the task
            </p>
          </motion.div>

          {/* Related - Linear style links */}
          {relatedArticles && relatedArticles.length > 0 && (
            <div className="mt-8 pt-6 border-t border-border">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Related
              </h4>
              <div className="space-y-1">
                {relatedArticles.map(related => (
                  <button
                    key={related.id}
                    onClick={() => onSelectRelated(related.id)}
                    className="w-full flex items-center justify-between gap-2 p-2.5 -mx-2.5 rounded-md text-left hover:bg-muted transition-colors group"
                  >
                    <span className="text-sm font-medium text-foreground/90 group-hover:text-foreground">
                      {related.title}
                    </span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </ScrollArea>
  );
}
