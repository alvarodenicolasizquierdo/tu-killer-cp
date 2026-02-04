import { useState, useCallback, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { HelpCategory } from '@/pages/HelpSupport';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';
import { ChevronRight, TrendingUp } from 'lucide-react';
import { getArticleById } from '@/data/helpKnowledgeBase';

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

  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Total navigable items: categories + popular topics
  const totalItems = categories.length + popularTopics.length;

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!['ArrowUp', 'ArrowDown', 'Enter', 'Escape', 'Home', 'End'].includes(e.key)) return;
    
    e.preventDefault();

    if (e.key === 'Escape') {
      setFocusedIndex(-1);
      containerRef.current?.blur();
      return;
    }

    if (e.key === 'Home') {
      setFocusedIndex(0);
    } else if (e.key === 'End') {
      setFocusedIndex(totalItems - 1);
    } else if (e.key === 'ArrowDown') {
      setFocusedIndex(prev => (prev < totalItems - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      setFocusedIndex(prev => (prev > 0 ? prev - 1 : totalItems - 1));
    } else if (e.key === 'Enter' && focusedIndex >= 0) {
      if (focusedIndex < categories.length) {
        onSelectCategory(categories[focusedIndex].id);
      } else {
        const topicIndex = focusedIndex - categories.length;
        const topic = popularTopics[topicIndex];
        if (topic) {
          onArticleClick?.(topic.id);
        }
      }
    }
  }, [focusedIndex, totalItems, categories, popularTopics, onSelectCategory, onArticleClick]);

  // Scroll focused item into view
  useEffect(() => {
    if (focusedIndex >= 0 && itemRefs.current[focusedIndex]) {
      itemRefs.current[focusedIndex]?.scrollIntoView({ 
        block: 'nearest', 
        behavior: 'smooth' 
      });
    }
  }, [focusedIndex]);

  const setItemRef = (index: number) => (el: HTMLButtonElement | null) => {
    itemRefs.current[index] = el;
  };

  return (
    <div 
      ref={containerRef}
      className="h-full flex flex-col focus:outline-none"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onFocus={() => focusedIndex === -1 && setFocusedIndex(0)}
      onBlur={(e) => {
        if (!containerRef.current?.contains(e.relatedTarget)) {
          setFocusedIndex(-1);
        }
      }}
      role="listbox"
      aria-label="Help categories and popular topics"
    >
      <div className="mb-3">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Browse by topic
        </h3>
      </div>
      
      <ScrollArea className="flex-1 -mx-1">
        <div className="px-1 space-y-0.5" role="group" aria-label="Categories">
          {categories.map((category, index) => {
            const isActive = selectedCategory === category.id;
            const isFocused = focusedIndex === index;
            const Icon = category.icon;
            
            return (
              <motion.button
                key={category.id}
                ref={setItemRef(index)}
                onClick={() => onSelectCategory(category.id)}
                onMouseEnter={() => setFocusedIndex(index)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-left transition-all group",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-foreground/80 hover:bg-muted hover:text-foreground",
                  isFocused && !isActive && "ring-2 ring-primary/50 bg-muted/50"
                )}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                role="option"
                aria-selected={isActive}
                tabIndex={-1}
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
                    : "text-muted-foreground/50 opacity-0 group-hover:opacity-100",
                  isFocused && "opacity-100"
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
          <div className="space-y-1" role="group" aria-label="Popular topics">
            {popularTopics.map((topic, index) => {
              const itemIndex = categories.length + index;
              const isFocused = focusedIndex === itemIndex;
              
              return (
                <motion.button
                  key={topic!.id}
                  ref={setItemRef(itemIndex)}
                  onClick={() => onArticleClick?.(topic!.id)}
                  onMouseEnter={() => setFocusedIndex(itemIndex)}
                  className={cn(
                    "w-full text-left px-2 py-1.5 rounded text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors line-clamp-2",
                    isFocused && "ring-2 ring-primary/50 bg-muted/50 text-foreground"
                  )}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  role="option"
                  aria-selected={false}
                  tabIndex={-1}
                >
                  {topic!.title.length > 35 ? topic!.title.slice(0, 35) + '...' : topic!.title}
                </motion.button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
