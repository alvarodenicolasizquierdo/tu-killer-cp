import { cn } from '@/lib/utils';
import { HelpCategory } from '@/pages/HelpSupport';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface CategoryNavProps {
  categories: HelpCategory[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string) => void;
}

export function CategoryNav({ categories, selectedCategory, onSelectCategory }: CategoryNavProps) {
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
    </div>
  );
}
