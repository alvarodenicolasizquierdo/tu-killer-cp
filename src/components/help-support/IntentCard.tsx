import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface IntentCardData {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
}

interface IntentCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  onClick: () => void;
  isActive?: boolean;
  variant?: 'default' | 'compact';
}

export function IntentCard({ 
  icon: Icon, 
  title, 
  description, 
  onClick, 
  isActive = false,
  variant = 'default'
}: IntentCardProps) {
  const isCompact = variant === 'compact';
  
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "group relative w-full text-left transition-all",
        "bg-card hover:bg-muted/50 border rounded-lg",
        isActive 
          ? "border-primary bg-primary/5 shadow-sm" 
          : "border-border/60 hover:border-border",
        isCompact ? "p-3" : "p-4"
      )}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <div className="flex items-start gap-3">
        {/* Icon - Linear style minimal container */}
        <div className={cn(
          "rounded-lg flex items-center justify-center shrink-0 transition-colors",
          isCompact ? "w-8 h-8" : "w-10 h-10",
          isActive 
            ? "bg-primary text-primary-foreground" 
            : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
        )}>
          <Icon className={cn(isCompact ? "w-4 h-4" : "w-5 h-5")} strokeWidth={1.5} />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className={cn(
              "font-medium truncate transition-colors",
              isCompact ? "text-sm" : "text-[15px]",
              isActive ? "text-primary" : "text-foreground"
            )}>
              {title}
            </h4>
            <ArrowRight className={cn(
              "w-4 h-4 shrink-0 transition-all",
              "text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5",
              isActive && "text-primary"
            )} />
          </div>
          
          {!isCompact && (
            <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
              {description}
            </p>
          )}
        </div>
      </div>
    </motion.button>
  );
}

// Compact version for use in category listings
export function IntentCardCompact(props: Omit<IntentCardProps, 'variant'>) {
  return <IntentCard {...props} variant="compact" />;
}
