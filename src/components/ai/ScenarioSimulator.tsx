import { motion } from 'framer-motion';
import { FlaskConical, AlertTriangle, TrendingDown, Clock, Package } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScenarioState, ScenarioImpact } from '@/types/ai-context';
import { cn } from '@/lib/utils';

interface ScenarioSimulatorProps {
  scenarioState: ScenarioState;
  onScenarioChange: (state: ScenarioState) => void;
  impact: ScenarioImpact;
}

export function ScenarioSimulator({ scenarioState, onScenarioChange, impact }: ScenarioSimulatorProps) {
  const hasActiveScenario = scenarioState.dppEnforced || scenarioState.regulationThreshold > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-xl border-2 overflow-hidden transition-colors",
        hasActiveScenario ? "border-amber-400 bg-amber-50/50" : "border-border bg-card"
      )}
    >
      {/* Header */}
      <div className={cn(
        "p-3 md:p-4 border-b",
        hasActiveScenario ? "bg-amber-100/50 border-amber-200" : "bg-muted/30"
      )}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center shrink-0",
              hasActiveScenario ? "bg-amber-500" : "bg-muted"
            )}>
              <FlaskConical className={cn(
                "w-3.5 md:w-4 h-3.5 md:h-4",
                hasActiveScenario ? "text-white" : "text-muted-foreground"
              )} />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-sm md:text-base text-foreground">Regulatory Horizon</h3>
              <p className="text-[10px] md:text-xs text-muted-foreground hidden sm:block">What-if scenario simulation</p>
            </div>
          </div>
          {hasActiveScenario && (
            <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-300 text-[10px] md:text-xs shrink-0">
              Active
            </Badge>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="p-3 md:p-4 space-y-3 md:space-y-4">
        {/* DPP Enforcement Toggle */}
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-0.5 min-w-0">
            <Label htmlFor="dpp-toggle" className="text-xs md:text-sm font-medium">
              DPP Enforced Tomorrow
            </Label>
            <p className="text-[10px] md:text-xs text-muted-foreground hidden sm:block">
              Simulate Digital Product Passport becoming mandatory
            </p>
          </div>
          <Switch
            id="dpp-toggle"
            checked={scenarioState.dppEnforced}
            onCheckedChange={(checked) => 
              onScenarioChange({ ...scenarioState, dppEnforced: checked })
            }
          />
        </div>

        {/* Threshold Slider */}
        <div className="space-y-2 md:space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs md:text-sm font-medium">
              Threshold Change
            </Label>
            <span className="text-xs md:text-sm font-mono text-muted-foreground">
              +{scenarioState.regulationThreshold}%
            </span>
          </div>
          <Slider
            value={[scenarioState.regulationThreshold]}
            onValueChange={([value]) => 
              onScenarioChange({ ...scenarioState, regulationThreshold: value })
            }
            max={50}
            step={5}
            className="w-full"
          />
          <p className="text-[10px] md:text-xs text-muted-foreground hidden sm:block">
            Simulate stricter chemical/safety thresholds
          </p>
        </div>
      </div>

      {/* Impact Display */}
      {hasActiveScenario && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="border-t border-amber-200 bg-amber-50/80 p-3 md:p-4"
        >
          <div className="flex items-center gap-1.5 md:gap-2 mb-2 md:mb-3">
            <AlertTriangle className="w-3.5 md:w-4 h-3.5 md:h-4 text-amber-600" />
            <span className="text-xs md:text-sm font-semibold text-amber-800">Simulated Impact</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 md:gap-3">
            <div className="bg-white/60 rounded-lg p-2 md:p-3 border border-amber-200">
              <div className="flex items-center gap-1 md:gap-1.5 text-red-600 mb-0.5 md:mb-1">
                <TrendingDown className="w-3 md:w-4 h-3 md:h-4" />
                <span className="text-sm md:text-lg font-bold">{impact.readinessChange}%</span>
              </div>
              <span className="text-[10px] md:text-xs text-muted-foreground">Readiness</span>
            </div>
            
            <div className="bg-white/60 rounded-lg p-2 md:p-3 border border-amber-200">
              <div className="flex items-center gap-1 md:gap-1.5 text-red-600 mb-0.5 md:mb-1">
                <AlertTriangle className="w-3 md:w-4 h-3 md:h-4" />
                <span className="text-sm md:text-lg font-bold">+{impact.newCriticalTasks}</span>
              </div>
              <span className="text-[10px] md:text-xs text-muted-foreground">Critical Tasks</span>
            </div>
            
            <div className="bg-white/60 rounded-lg p-2 md:p-3 border border-amber-200">
              <div className="flex items-center gap-1 md:gap-1.5 text-amber-600 mb-0.5 md:mb-1">
                <Package className="w-3 md:w-4 h-3 md:h-4" />
                <span className="text-sm md:text-lg font-bold">{impact.affectedProducts}</span>
              </div>
              <span className="text-[10px] md:text-xs text-muted-foreground">Products</span>
            </div>
            
            <div className="bg-white/60 rounded-lg p-2 md:p-3 border border-amber-200">
              <div className="flex items-center gap-1 md:gap-1.5 text-amber-600 mb-0.5 md:mb-1">
                <Clock className="w-3 md:w-4 h-3 md:h-4" />
                <span className="text-sm md:text-lg font-bold">{impact.estimatedRemediationDays}d</span>
              </div>
              <span className="text-[10px] md:text-xs text-muted-foreground">Remediation</span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
