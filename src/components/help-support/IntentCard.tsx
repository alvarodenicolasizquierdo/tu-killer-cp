import { HelpIntent } from '@/pages/HelpSupport';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface IntentCardProps {
  intent: HelpIntent;
  onClick: () => void;
  isActive: boolean;
}

export function IntentCard({ intent, onClick, isActive }: IntentCardProps) {
  const Icon = intent.icon;
  
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "group relative p-4 rounded-xl border text-left transition-all overflow-hidden",
        isActive 
          ? "bg-primary/10 border-primary shadow-md" 
          : "bg-card border-border hover:border-primary/50 hover:shadow-sm"
      )}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Background gradient on hover */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity",
        "group-hover:opacity-100",
        isActive && "opacity-100"
      )} />
      
      <div className="relative">
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-colors",
          isActive 
            ? "bg-primary text-primary-foreground" 
            : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
        )}>
          <Icon className="w-5 h-5" />
        </div>
        
        <h4 className={cn(
          "font-medium text-sm mb-1 transition-colors",
          isActive ? "text-primary" : "text-foreground"
        )}>
          {intent.label}
        </h4>
        
        <p className="text-xs text-muted-foreground line-clamp-2">
          {intent.description}
        </p>
      </div>
      
      {/* Active indicator */}
      {isActive && (
        <motion.div
          layoutId="intent-active"
          className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full"
        />
      )}
    </motion.button>
  );
}
