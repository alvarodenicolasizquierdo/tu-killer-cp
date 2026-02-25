import { useState } from 'react';
import { workflowRegistry } from '@/docs/registry';
import { WorkflowRegistryEntry } from '@/docs/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Play, AlertTriangle, Bot, ArrowRight, GitBranch } from 'lucide-react';
import { cn } from '@/lib/utils';

const actorColors: Record<string, string> = {
  buyer: 'bg-blue-100 text-blue-700 border-blue-200',
  supplier: 'bg-amber-100 text-amber-700 border-amber-200',
  lab_technician: 'bg-purple-100 text-purple-700 border-purple-200',
  manager: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  admin: 'bg-red-100 text-red-700 border-red-200',
  system: 'bg-gray-100 text-gray-700 border-gray-200',
  ai: 'bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 border-violet-200',
};

const severityColors: Record<string, string> = {
  low: 'bg-blue-100 text-blue-700',
  medium: 'bg-amber-100 text-amber-700',
  high: 'bg-orange-100 text-orange-700',
  critical: 'bg-red-100 text-red-700',
};

export function WorkflowsTab() {
  const [expandedWorkflow, setExpandedWorkflow] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold">User Journey Workflows</h3>
        <p className="text-sm text-muted-foreground">
          {workflowRegistry.length} key workflows documented with steps, decision points, and AI involvement.
        </p>
      </div>

      {/* Workflow List */}
      <div className="space-y-4">
        {workflowRegistry.map((workflow) => (
          <WorkflowCard
            key={workflow.id}
            workflow={workflow}
            isExpanded={expandedWorkflow === workflow.id}
            onToggle={() => setExpandedWorkflow(expandedWorkflow === workflow.id ? null : workflow.id)}
          />
        ))}
      </div>
    </div>
  );
}

interface WorkflowCardProps {
  workflow: WorkflowRegistryEntry;
  isExpanded: boolean;
  onToggle: () => void;
}

function WorkflowCard({ workflow, isExpanded, onToggle }: WorkflowCardProps) {
  return (
    <Card className={cn("transition-all", isExpanded && "ring-2 ring-primary/20")}>
      <Collapsible open={isExpanded} onOpenChange={onToggle}>
        <CollapsibleTrigger className="w-full">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {isExpanded ? (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="text-left">
                  <CardTitle className="text-base">{workflow.name}</CardTitle>
                  <CardDescription className="mt-1">{workflow.description}</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant="outline" className="text-xs">
                  {workflow.steps.length} steps
                </Badge>
                {workflow.aiMoments.filter(m => m.type === 'assists').length > 0 && (
                  <Badge variant="secondary" className="text-xs bg-violet-100 text-violet-700">
                    <Bot className="h-3 w-3 mr-1" />
                    AI Assisted
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0 space-y-6">
            {/* Trigger */}
            <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
              <Play className="h-4 w-4 text-primary mt-0.5" />
              <div>
                <span className="text-sm font-medium">Trigger:</span>
                <p className="text-sm text-muted-foreground">{workflow.trigger}</p>
              </div>
            </div>

            {/* Steps */}
            <div>
              <h4 className="text-sm font-medium mb-3">Workflow Steps</h4>
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-4 top-6 bottom-6 w-0.5 bg-border" />
                
                <div className="space-y-4">
                  {workflow.steps.map((step, index) => (
                    <div key={step.id} className="relative flex items-start gap-4">
                      {/* Step number circle */}
                      <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-background border-2 border-primary text-sm font-medium">
                        {step.order}
                      </div>
                      
                      <div className="flex-1 pb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium">{step.name}</span>
                          <Badge className={cn("text-xs border", actorColors[step.actor])}>
                            {step.actor}
                          </Badge>
                          {step.expectedDuration && (
                            <span className="text-xs text-muted-foreground">
                              ({step.expectedDuration})
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                        
                        {/* Decision point after this step */}
                        {workflow.decisionPoints
                          .filter(dp => dp.afterStepId === step.id)
                          .map(dp => (
                            <div key={dp.id} className="mt-3 ml-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <GitBranch className="h-4 w-4 text-amber-600" />
                                <span className="text-sm font-medium text-amber-800">Decision Point</span>
                              </div>
                              <p className="text-sm text-amber-700 mb-2">{dp.condition}</p>
                              <div className="space-y-1">
                                {dp.outcomes.map((outcome, i) => (
                                  <div key={i} className="flex items-center gap-2 text-sm text-amber-700">
                                    <ArrowRight className="h-3 w-3" />
                                    <span>{outcome.label}</span>
                                    <span className="text-amber-500">→</span>
                                    <code className="text-xs bg-amber-100 px-1 rounded">{outcome.nextStepId}</code>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Failure Modes */}
            {workflow.failureModes.length > 0 && (
              <div>
                <h4 className="text-sm font-medium flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  Failure Modes & Recovery
                </h4>
                <div className="space-y-3">
                  {workflow.failureModes.map((fm) => (
                    <div key={fm.id} className="p-3 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={cn("text-xs", severityColors[fm.severity])}>
                          {fm.severity.toUpperCase()}
                        </Badge>
                        <span className="text-sm text-muted-foreground">at {fm.atStepId}</span>
                      </div>
                      <p className="text-sm font-medium">{fm.description}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        <span className="font-medium">Recovery:</span> {fm.recovery}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Moments */}
            {workflow.aiMoments.length > 0 && (
              <div>
                <h4 className="text-sm font-medium flex items-center gap-2 mb-3">
                  <Bot className="h-4 w-4 text-violet-500" />
                  AI Involvement
                </h4>
                <div className="space-y-3">
                  {workflow.aiMoments.map((ai) => (
                    <div 
                      key={ai.id} 
                      className={cn(
                        "p-3 border rounded-lg",
                        ai.type === 'assists' ? 'bg-violet-50 border-violet-200' : 'bg-gray-50 border-gray-200'
                      )}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={ai.type === 'assists' ? 'default' : 'secondary'} className="text-xs">
                          {ai.type === 'assists' ? '🤖 AI Assists' : '🔇 AI Silent'}
                        </Badge>
                        <span className="text-sm text-muted-foreground">at {ai.stepId}</span>
                      </div>
                      <p className="text-sm">{ai.description}</p>
                      {ai.reasoning && (
                        <p className="text-sm text-muted-foreground mt-1">
                          <span className="font-medium">Reasoning:</span> {ai.reasoning}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Outputs */}
            <div>
              <h4 className="text-sm font-medium mb-2">Outputs</h4>
              <div className="flex flex-wrap gap-2">
                {workflow.outputs.map((output, i) => (
                  <Badge key={i} variant="outline">
                    {output}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
