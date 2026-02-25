import { Component } from '@/types/styles';
import { AlertTriangle, CheckCircle2, Info, Percent, TestTube2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface ComponentAreaValidatorProps {
  component: Component;
  showDetails?: boolean;
  compact?: boolean;
}

const FULL_TESTING_THRESHOLD = 10; // >10% area requires full testing for non-fabric

export function getComponentTestingRequirement(component: Component): {
  requiresFullTesting: boolean;
  reason: string;
  severity: 'info' | 'warning' | 'error';
} {
  // Fabric always requires testing regardless of area
  if (component.type === 'Fabric') {
    return {
      requiresFullTesting: true,
      reason: 'All fabrics require full testing',
      severity: 'info'
    };
  }

  // Pocketing always requires full testing per policy
  if (component.type === 'Pocketing') {
    return {
      requiresFullTesting: true,
      reason: 'Pocketing always requires full testing per policy',
      severity: 'info'
    };
  }

  // Non-fabric components >10% area require full testing
  if (component.areaPercentage > FULL_TESTING_THRESHOLD) {
    return {
      requiresFullTesting: true,
      reason: `${component.type} exceeds ${FULL_TESTING_THRESHOLD}% area threshold (${component.areaPercentage}%)`,
      severity: 'warning'
    };
  }

  // Non-fabric components ≤10% may have reduced testing
  return {
    requiresFullTesting: false,
    reason: `${component.type} at ${component.areaPercentage}% area - reduced testing eligible`,
    severity: 'info'
  };
}

export function ComponentAreaValidator({ component, showDetails = false, compact = false }: ComponentAreaValidatorProps) {
  const requirement = getComponentTestingRequirement(component);
  const isOverThreshold = component.type !== 'Fabric' && component.areaPercentage > FULL_TESTING_THRESHOLD;
  
  if (compact) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn(
            "flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium",
            isOverThreshold 
              ? "bg-warning/10 text-warning border border-warning/20" 
              : requirement.requiresFullTesting 
                ? "bg-muted text-muted-foreground" 
                : "bg-success/10 text-success border border-success/20"
          )}>
            <Percent className="h-3 w-3" />
            <span>{component.areaPercentage}%</span>
            {isOverThreshold && <AlertTriangle className="h-3 w-3" />}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-1">
            <p className="font-medium">{requirement.requiresFullTesting ? 'Full Testing Required' : 'Reduced Testing Eligible'}</p>
            <p className="text-xs text-muted-foreground">{requirement.reason}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <div className={cn(
      "rounded-lg border p-3",
      isOverThreshold 
        ? "bg-warning/5 border-warning/30" 
        : requirement.requiresFullTesting 
          ? "bg-muted/50 border-border" 
          : "bg-success/5 border-success/30"
    )}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          {isOverThreshold ? (
            <div className="p-1.5 rounded-md bg-warning/10">
              <AlertTriangle className="h-4 w-4 text-warning" />
            </div>
          ) : requirement.requiresFullTesting ? (
            <div className="p-1.5 rounded-md bg-muted">
              <TestTube2 className="h-4 w-4 text-muted-foreground" />
            </div>
          ) : (
            <div className="p-1.5 rounded-md bg-success/10">
              <CheckCircle2 className="h-4 w-4 text-success" />
            </div>
          )}
          <div>
            <p className={cn(
              "text-sm font-medium",
              isOverThreshold ? "text-warning" : ""
            )}>
              {component.areaPercentage}% Area Coverage
            </p>
            <p className="text-xs text-muted-foreground">
              {requirement.reason}
            </p>
          </div>
        </div>
        <Badge 
          variant={isOverThreshold ? "destructive" : requirement.requiresFullTesting ? "secondary" : "outline"}
          className={cn(
            "text-xs",
            !isOverThreshold && !requirement.requiresFullTesting && "text-success border-success/30"
          )}
        >
          {requirement.requiresFullTesting ? 'Full Testing' : 'Reduced Testing'}
        </Badge>
      </div>
      
      {showDetails && (
        <div className="mt-3 pt-3 border-t border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-muted-foreground">Area threshold:</span>
            <span className="text-xs font-medium">{FULL_TESTING_THRESHOLD}%</span>
          </div>
          <div className="relative">
            <Progress 
              value={Math.min(component.areaPercentage, 100)} 
              className={cn(
                "h-2",
                isOverThreshold && "[&>div]:bg-warning"
              )}
            />
            <div 
              className="absolute top-0 h-2 w-0.5 bg-destructive/70"
              style={{ left: `${FULL_TESTING_THRESHOLD}%` }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-muted-foreground">0%</span>
            <span className="text-xs text-destructive/70">{FULL_TESTING_THRESHOLD}% threshold</span>
            <span className="text-xs text-muted-foreground">100%</span>
          </div>
        </div>
      )}
    </div>
  );
}

interface ComponentAreaSummaryProps {
  components: Component[];
}

export function ComponentAreaSummary({ components }: ComponentAreaSummaryProps) {
  const fullTestingRequired = components.filter(c => getComponentTestingRequirement(c).requiresFullTesting);
  const overThreshold = components.filter(c => 
    c.type !== 'Fabric' && c.areaPercentage > FULL_TESTING_THRESHOLD
  );
  const reducedTestingEligible = components.filter(c => !getComponentTestingRequirement(c).requiresFullTesting);

  if (components.length === 0) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground p-3 rounded-lg bg-muted/50">
        <Info className="h-4 w-4" />
        No components linked
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {overThreshold.length > 0 && (
        <div className="flex items-start gap-3 p-3 rounded-lg bg-warning/10 border border-warning/20">
          <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
          <div>
            <p className="text-sm font-medium text-warning">
              {overThreshold.length} component{overThreshold.length > 1 ? 's' : ''} exceed{overThreshold.length === 1 ? 's' : ''} 10% area threshold
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Non-fabric components with &gt;10% area coverage require full testing per policy
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {overThreshold.map(c => (
                <Badge key={c.id} variant="outline" className="text-xs text-warning border-warning/30">
                  {c.name} ({c.areaPercentage}%)
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-3 rounded-lg bg-muted/50">
          <p className="text-2xl font-bold">{components.length}</p>
          <p className="text-xs text-muted-foreground">Total Components</p>
        </div>
        <div className="p-3 rounded-lg bg-primary/5">
          <p className="text-2xl font-bold text-primary">{fullTestingRequired.length}</p>
          <p className="text-xs text-muted-foreground">Full Testing</p>
        </div>
        <div className="p-3 rounded-lg bg-success/5">
          <p className="text-2xl font-bold text-success">{reducedTestingEligible.length}</p>
          <p className="text-xs text-muted-foreground">Reduced Testing</p>
        </div>
      </div>
    </div>
  );
}
