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
        "p-4 border-b",
        hasActiveScenario ? "bg-amber-100/50 border-amber-200" : "bg-muted/30"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center",
              hasActiveScenario ? "bg-amber-500" : "bg-muted"
            )}>
              <FlaskConical className={cn(
                "w-4 h-4",
                hasActiveScenario ? "text-white" : "text-muted-foreground"
              )} />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Regulatory Horizon</h3>
              <p className="text-xs text-muted-foreground">What-if scenario simulation</p>
            </div>
          </div>
          {hasActiveScenario && (
            <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-300">
              Simulation Active
            </Badge>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 space-y-4">
        {/* DPP Enforcement Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="dpp-toggle" className="text-sm font-medium">
              DPP Enforced Tomorrow
            </Label>
            <p className="text-xs text-muted-foreground">
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
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">
              Regulation Threshold Change
            </Label>
            <span className="text-sm font-mono text-muted-foreground">
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
          <p className="text-xs text-muted-foreground">
            Simulate stricter chemical/safety thresholds
          </p>
        </div>
      </div>

      {/* Impact Display */}
      {hasActiveScenario && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="border-t border-amber-200 bg-amber-50/80 p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-semibold text-amber-800">Simulated Impact</span>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/60 rounded-lg p-3 border border-amber-200">
              <div className="flex items-center gap-1.5 text-red-600 mb-1">
                <TrendingDown className="w-4 h-4" />
                <span className="text-lg font-bold">{impact.readinessChange}%</span>
              </div>
              <span className="text-xs text-muted-foreground">Readiness Change</span>
            </div>
            
            <div className="bg-white/60 rounded-lg p-3 border border-amber-200">
              <div className="flex items-center gap-1.5 text-red-600 mb-1">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-lg font-bold">+{impact.newCriticalTasks}</span>
              </div>
              <span className="text-xs text-muted-foreground">New Critical Tasks</span>
            </div>
            
            <div className="bg-white/60 rounded-lg p-3 border border-amber-200">
              <div className="flex items-center gap-1.5 text-amber-600 mb-1">
                <Package className="w-4 h-4" />
                <span className="text-lg font-bold">{impact.affectedProducts}</span>
              </div>
              <span className="text-xs text-muted-foreground">Products Affected</span>
            </div>
            
            <div className="bg-white/60 rounded-lg p-3 border border-amber-200">
              <div className="flex items-center gap-1.5 text-amber-600 mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-lg font-bold">{impact.estimatedRemediationDays}d</span>
              </div>
              <span className="text-xs text-muted-foreground">Est. Remediation</span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
