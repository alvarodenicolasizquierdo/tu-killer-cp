import { cn } from '@/lib/utils';
import { HelpCategory } from '@/pages/HelpSupport';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';
import { ChevronRight, TrendingUp } from 'lucide-react';
import { helpKnowledgeBase, getArticleById } from '@/data/helpKnowledgeBase';

interface CategoryNavProps {
  categories: HelpCategory[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string) => void;
  onArticleClick?: (articleId: string) => void;
}

// Popular topics - curated list of most common issues
const popularTopicIds = [
  'a_cannot_submit_trf_topsheet',
  'a_care_label_wrong',
  'a_send_to_lab_disabled',
  'a_fitlog_photos_missing',
];

export function CategoryNav({ 
  categories, 
  selectedCategory, 
  onSelectCategory,
  onArticleClick 
}: CategoryNavProps) {
  const popularTopics = popularTopicIds
    .map(id => getArticleById(id))
    .filter(Boolean);

  return (
    <div className="h-full flex flex-col">
      <div className="mb-3">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Browse by topic
        </h3>
      </div>
      
      <ScrollArea className="flex-1 -mx-1">
        <div className="px-1 space-y-0.5">
          {categories.map((category, index) => {
            const isActive = selectedCategory === category.id;
            const Icon = category.icon;
            
            return (
              <motion.button
                key={category.id}
                onClick={() => onSelectCategory(category.id)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-left transition-all group",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-foreground/80 hover:bg-muted hover:text-foreground"
                )}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <Icon className={cn(
                  "w-4 h-4 shrink-0 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )} strokeWidth={1.5} />
                <span className="flex-1 text-sm font-medium truncate">
                  {category.label}
                </span>
                <ChevronRight className={cn(
                  "w-3.5 h-3.5 shrink-0 transition-all",
                  isActive 
                    ? "text-primary opacity-100" 
                    : "text-muted-foreground/50 opacity-0 group-hover:opacity-100"
                )} />
              </motion.button>
            );
          })}
        </div>
      </ScrollArea>

      {/* Popular Topics Section */}
      {popularTopics.length > 0 && (
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center gap-1.5 mb-3">
            <TrendingUp className="w-3.5 h-3.5 text-primary" />
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Popular
            </h3>
          </div>
          <div className="space-y-1">
            {popularTopics.map((topic, index) => (
              <motion.button
                key={topic!.id}
                onClick={() => onArticleClick?.(topic!.id)}
                className="w-full text-left px-2 py-1.5 rounded text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors line-clamp-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 + index * 0.05 }}
              >
                {topic!.title.length > 35 ? topic!.title.slice(0, 35) + '...' : topic!.title}
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
