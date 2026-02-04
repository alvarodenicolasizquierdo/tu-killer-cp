import { ReactNode } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { HelpCircle, Info, AlertCircle, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InlineHelpTooltipProps {
  children: ReactNode;
  content: string;
  title?: string;
  type?: 'info' | 'warning' | 'tip' | 'help';
  side?: 'top' | 'right' | 'bottom' | 'left';
  showIcon?: boolean;
  className?: string;
}

const iconMap = {
  info: Info,
  warning: AlertCircle,
  tip: Lightbulb,
  help: HelpCircle,
};

const colorMap = {
  info: 'text-primary',
  warning: 'text-amber-500',
  tip: 'text-accent',
  help: 'text-muted-foreground',
};

export function InlineHelpTooltip({
  children,
  content,
  title,
  type = 'help',
  side = 'top',
  showIcon = true,
  className,
}: InlineHelpTooltipProps) {
  const Icon = iconMap[type];

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <span className={cn("inline-flex items-center gap-1 cursor-help", className)}>
            {children}
            {showIcon && <Icon className={cn("h-3.5 w-3.5", colorMap[type])} />}
          </span>
        </TooltipTrigger>
        <TooltipContent side={side} className="max-w-[280px]">
          {title && <p className="font-medium text-sm mb-1">{title}</p>}
          <p className="text-xs">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Specialized component for disabled button explanations
interface DisabledButtonHelpProps {
  reason: string;
  action?: string;
  children: ReactNode;
}

export function DisabledButtonHelp({ reason, action, children }: DisabledButtonHelpProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <span className="inline-block">{children}</span>
        </TooltipTrigger>
        <TooltipContent className="max-w-[280px] p-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Why is this disabled?</p>
              <p className="text-xs text-muted-foreground mt-1">{reason}</p>
              {action && (
                <p className="text-xs text-primary mt-2 font-medium">{action}</p>
              )}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Component for inline contextual hints
interface ContextualHintProps {
  message: string;
  type?: 'info' | 'success' | 'warning';
  className?: string;
}

export function ContextualHint({ message, type = 'info', className }: ContextualHintProps) {
  const bgColor = {
    info: 'bg-primary/5 border-primary/20 text-primary',
    success: 'bg-emerald-500/5 border-emerald-500/20 text-emerald-600',
    warning: 'bg-amber-500/5 border-amber-500/20 text-amber-600',
  }[type];

  const Icon = type === 'success' ? Lightbulb : type === 'warning' ? AlertCircle : Info;

  return (
    <div className={cn(
      "flex items-start gap-2 p-2 rounded-md border text-xs",
      bgColor,
      className
    )}>
      <Icon className="h-3.5 w-3.5 shrink-0 mt-0.5" />
      <span>{message}</span>
    </div>
  );
}
