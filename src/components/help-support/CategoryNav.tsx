import { cn } from '@/lib/utils';
import { HelpCategory } from '@/pages/HelpSupport';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface CategoryNavProps {
  categories: HelpCategory[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string) => void;
}

export function CategoryNav({ categories, selectedCategory, onSelectCategory }: CategoryNavProps) {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm h-full">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-foreground">Categories</h3>
        <p className="text-xs text-muted-foreground mt-1">Browse by topic</p>
      </div>
      
      <ScrollArea className="h-[calc(100%-60px)]">
        <div className="p-2 space-y-1">
          {categories.map((category) => {
            const isActive = selectedCategory === category.id;
            const Icon = category.icon;
            
            return (
              <motion.button
                key={category.id}
                onClick={() => onSelectCategory(category.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all relative",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "hover:bg-muted text-foreground"
                )}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="category-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full"
                  />
                )}
                <Icon className={cn(
                  "w-4 h-4 shrink-0",
                  isActive ? "text-primary" : "text-muted-foreground"
                )} />
                <span className="flex-1 text-sm font-medium truncate">
                  {category.label}
                </span>
                <Badge 
                  variant="secondary" 
                  className={cn(
                    "text-xs",
                    isActive ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                  )}
                >
                  {category.articleCount}
                </Badge>
              </motion.button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
