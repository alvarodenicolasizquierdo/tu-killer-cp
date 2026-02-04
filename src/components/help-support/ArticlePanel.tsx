import { HelpArticle } from '@/pages/HelpSupport';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Lightbulb, ArrowRight, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ArticlePanelProps {
  article: HelpArticle | null;
  articles: HelpArticle[];
  onSelectRelated: (articleId: string) => void;
}

export function ArticlePanel({ article, articles, onSelectRelated }: ArticlePanelProps) {
  if (!article) {
    return (
      <div className="bg-card rounded-xl border border-border shadow-sm h-full flex items-center justify-center">
        <div className="text-center p-8">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-foreground mb-2">Select a Topic</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            Click an intent card above or choose a category to view guided resolution steps.
          </p>
        </div>
      </div>
    );
  }

  const relatedArticles = article.relatedArticles
    ?.map(id => articles.find(a => a.id === id))
    .filter(Boolean) as HelpArticle[];

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm h-full flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-border">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Badge variant="secondary" className="mb-2 text-xs">
              Guided Resolution
            </Badge>
            <h2 className="text-xl font-semibold text-foreground">{article.title}</h2>
          </div>
          <Badge variant="outline" className="text-xs">
            {article.steps.length} steps
          </Badge>
        </div>
      </div>

      {/* Steps */}
      <ScrollArea className="flex-1 p-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {article.steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-l-4 border-l-primary/30 hover:border-l-primary transition-colors">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <div className="shrink-0">
                        <div className={cn(
                          "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold",
                          "bg-primary/10 text-primary"
                        )}>
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground mb-1">{step.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {step.content}
                        </p>
                        {step.tip && (
                          <div className="mt-3 flex items-start gap-2 p-2.5 bg-amber-500/10 rounded-lg border border-amber-500/20">
                            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-xs text-amber-700 dark:text-amber-400">
                              {step.tip}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Completion */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: article.steps.length * 0.1 }}
              className="flex items-center gap-2 p-4 bg-green-500/10 rounded-lg border border-green-500/20"
            >
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-green-700 dark:text-green-400">
                You're all set! Follow these steps to complete the task.
              </span>
            </motion.div>

            {/* Related Articles */}
            {relatedArticles && relatedArticles.length > 0 && (
              <div className="pt-4 border-t border-border">
                <h4 className="text-sm font-medium text-muted-foreground mb-3">
                  Related Topics
                </h4>
                <div className="space-y-2">
                  {relatedArticles.map(related => (
                    <Button
                      key={related.id}
                      variant="ghost"
                      className="w-full justify-between h-auto py-3 px-4 text-left"
                      onClick={() => onSelectRelated(related.id)}
                    >
                      <span className="text-sm">{related.title}</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </ScrollArea>
    </div>
  );
}
