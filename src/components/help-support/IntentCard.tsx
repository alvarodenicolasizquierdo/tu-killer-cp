import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
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
    <motion.div
      className={cn(
        "group relative rounded-2xl border text-left transition-all overflow-hidden",
        "bg-card hover:shadow-lg",
        isActive 
          ? "border-primary shadow-md ring-2 ring-primary/20" 
          : "border-border hover:border-primary/40",
        isCompact ? "p-4" : "p-6"
      )}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Background gradient effect */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 transition-opacity duration-300",
        "group-hover:opacity-100",
        isActive && "opacity-100"
      )} />
      
      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative flex flex-col h-full">
        {/* Icon */}
        <div className={cn(
          "rounded-xl flex items-center justify-center transition-all duration-300 shrink-0",
          isCompact ? "w-12 h-12 mb-3" : "w-14 h-14 mb-4",
          isActive 
            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
            : "bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-lg group-hover:shadow-primary/25"
        )}>
          <Icon className={cn(isCompact ? "w-5 h-5" : "w-6 h-6")} strokeWidth={1.75} />
        </div>
        
        {/* Content */}
        <div className="flex-1 mb-4">
          <h4 className={cn(
            "font-semibold transition-colors mb-2",
            isCompact ? "text-base" : "text-lg",
            isActive ? "text-primary" : "text-foreground"
          )}>
            {title}
          </h4>
          
          <p className={cn(
            "text-muted-foreground leading-relaxed",
            isCompact ? "text-xs line-clamp-2" : "text-sm line-clamp-3"
          )}>
            {description}
          </p>
        </div>
        
        {/* Resolve Button */}
        <Button
          onClick={onClick}
          variant={isActive ? "default" : "outline"}
          className={cn(
            "w-full justify-between group/btn transition-all",
            isActive 
              ? "bg-primary hover:bg-primary/90" 
              : "border-primary/30 hover:bg-primary hover:text-primary-foreground hover:border-primary"
          )}
          size={isCompact ? "sm" : "default"}
        >
          <span className="font-medium">Resolve this</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
        </Button>
      </div>
      
      {/* Active state glow */}
      {isActive && (
        <motion.div
          layoutId="intent-active-glow"
          className="absolute inset-0 rounded-2xl ring-2 ring-primary/30 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}
    </motion.div>
  );
}

// Compact version for use in category listings
export function IntentCardCompact(props: Omit<IntentCardProps, 'variant'>) {
  return <IntentCard {...props} variant="compact" />;
}
