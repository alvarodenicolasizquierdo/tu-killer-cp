import { useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { tagScreen } from '@/utils/clarityTracking';
import { useUser, getRoleDisplayName, getRoleGreeting } from '@/contexts/UserContext';
import { useAIContext } from '@/hooks/useAIContext';
import { useWidgetConfig } from '@/hooks/useWidgetConfig';
import { AITaskCard } from '@/components/ai/AITaskCard';
import { ReadinessGauge } from '@/components/ai/ReadinessGauge';
import { ScenarioSimulator } from '@/components/ai/ScenarioSimulator';
import { LabQueueWidget } from '@/components/dashboard/LabQueueWidget';
import { ConfidenceDashboardWidget } from '@/components/dashboard/ConfidenceDashboardWidget';
import { SupplierDashboardWidget } from '@/components/dashboard/SupplierDashboardWidget';
import { RegulatoryAlerts } from '@/components/dashboard/RegulatoryAlerts';
import { WidgetCatalog } from '@/components/dashboard/WidgetCatalog';
import { KPISummaryWidget } from '@/components/dashboard/KPISummaryWidget';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Target, AlertTriangle, Sparkles, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { mockActivities } from '@/data/mockData';
import { useFeatureFlag } from '@/config/featureFlags';
import { TodayNextStrip } from '@/components/home/TodayNextStrip';

export default function Dashboard() {
  const { currentUser } = useUser();
  useEffect(() => { tagScreen('portal-dashboard'); }, []);
  const newNavEnabled = useFeatureFlag('NEW_IA_NAV_AND_HOME');
  const { 
    context, 
    computedTasks, 
    readiness, 
    scenarioState, 
    setScenarioState, 
    scenarioImpact,
    layoutConfig,
    isComputing 
  } = useAIContext();

  const {
    widgets,
    enabledWidgets,
    toggleWidget,
    reorderWidgets,
    isWidgetEnabled,
  } = useWidgetConfig();

  // Filter tasks based on role relevance
  const prioritizedTasks = computedTasks.filter(t => {
    // Always include critical/at-risk
    if (t.priority !== 'critical' && t.priority !== 'at-risk') return false;
    
    // Role-specific filtering
    switch (currentUser.role) {
      case 'lab_technician':
        return t.objectType === 'trf';
      case 'supplier':
        return t.objectType === 'certificate' || t.objectType === 'supplier';
      case 'manager':
        return true; // Managers see everything
      default:
        return true;
    }
  });

  const hasActiveScenario = scenarioState.dppEnforced || scenarioState.regulationThreshold > 0;

  // Compute "Today / Next" metrics from existing data
  const todayNextMetrics = {
    needsAttention: context.criticalItems,
    overdue: computedTasks.filter(t => t.priority === 'critical').length,
    upcoming: computedTasks.filter(t => t.priority === 'at-risk').length,
  };

  if (isComputing) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-ai-primary to-ai-secondary flex items-center justify-center"
          >
            <Brain className="w-6 h-6 text-white" />
          </motion.div>
          <p className="text-muted-foreground">AI is analyzing your operational context...</p>
        </div>
      </AppLayout>
    );
  }

  // Get role-specific greeting
  const roleGreeting = getRoleGreeting(currentUser.role);

  // Render primary widget based on layoutConfig
  const renderPrimaryWidget = () => {
    switch (layoutConfig.primaryWidget) {
      case 'lab_queue':
        return <LabQueueWidget />;
      case 'confidence_dashboard':
        return <ConfidenceDashboardWidget />;
      default:
        return null; // Tasks widget is rendered separately
    }
  };

  // Check if we should show the default tasks widget
  const showTasksWidget = layoutConfig.primaryWidget === 'tasks' || isWidgetEnabled('tasks');

  // For supplier role, show supplier-specific dashboard
  const isSupplier = currentUser.role === 'supplier';

  // Render a widget by ID
  const renderWidget = (widgetId: string) => {
    switch (widgetId) {
      case 'regulatory_alerts':
        return <RegulatoryAlerts key={widgetId} />;
      case 'kpis':
        return <KPISummaryWidget key={widgetId} />;
      case 'activity_feed':
        return (
          <Card key={widgetId}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityFeed activities={mockActivities} />
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <AppLayout>
      {/* Today/Next Strip - Only shown when feature flag is enabled */}
      {newNavEnabled && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 md:mb-6"
        >
          <TodayNextStrip 
            needsAttention={todayNextMetrics.needsAttention}
            overdue={todayNextMetrics.overdue}
            upcoming={todayNextMetrics.upcoming}
          />
        </motion.div>
      )}

      {/* Context Header - Role-adaptive greeting with Widget Config */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 md:mb-6"
        data-tour="ai-context"
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="gap-1.5 bg-ai-primary/5 border-ai-primary/20 text-ai-primary text-xs">
                <User className="w-3 h-3" />
                {getRoleDisplayName(currentUser.role)}
              </Badge>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-[-0.02em] mb-1">
              {roleGreeting.split('!')[0]}!
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              {roleGreeting.split('!')[1]?.trim() || 'AI has analyzed your context to prioritize what matters.'}
            </p>
          </div>
          
          {/* Context Summary Badges + Widget Config */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap sm:shrink-0">
            {context.criticalItems > 0 && (
              <Badge variant="destructive" className="gap-1.5 py-1 text-xs">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                {context.criticalItems} Critical
              </Badge>
            )}
            {context.blockedDownstream && (
              <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200 gap-1.5 py-1 text-xs hidden sm:flex">
                <AlertTriangle className="w-3 h-3" />
                Downstream Blocked
              </Badge>
            )}
            <WidgetCatalog 
              widgets={widgets}
              onToggleWidget={toggleWidget}
              onReorderWidgets={reorderWidgets}
            />
          </div>
        </div>
      </motion.div>

      {/* Regulatory Alerts - Sticky at top if enabled */}
      {isWidgetEnabled('regulatory_alerts') && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <RegulatoryAlerts />
        </motion.div>
      )}

      {/* Scenario Warning Banner */}
      <AnimatePresence>
        {hasActiveScenario && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <div className="bg-amber-100 border border-amber-300 rounded-lg p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-amber-800">
                  Scenario Simulation Active: {scenarioState.dppEnforced ? 'DPP Enforced Tomorrow' : `+${scenarioState.regulationThreshold}% Stricter Thresholds`}
                </p>
                <p className="text-sm text-amber-700">
                  The data below reflects projected impact. {scenarioImpact.affectedProducts} products would be affected.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KPIs Widget - if enabled */}
      {isWidgetEnabled('kpis') && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <KPISummaryWidget />
        </motion.div>
      )}

      {/* Main Grid - AI assembles based on role context */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">
        {/* Primary Column - Role-specific content */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Supplier-specific dashboard */}
          {isSupplier && <SupplierDashboardWidget />}
          
          {/* Role-specific primary widget (Lab Queue or Confidence Dashboard) */}
          {!isSupplier && renderPrimaryWidget()}
          
          {/* Tasks widget - shown for buyer/admin or as secondary for other roles */}
          {(showTasksWidget || (!isSupplier && layoutConfig.primaryWidget !== 'tasks')) && (
            <Card className="border-2 border-ai-primary/20" data-tour="tasks-widget">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ai-primary to-ai-secondary flex items-center justify-center">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {currentUser.role === 'lab_technician' 
                          ? 'Your Testing Priorities' 
                          : currentUser.role === 'manager' 
                            ? 'Executive Action Items'
                            : 'What Matters Today'}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">
                        {prioritizedTasks.length} actions ranked by impact if ignored
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="gap-1 text-xs bg-ai-primary/5 border-ai-primary/20 text-ai-primary">
                      <Brain className="w-3 h-3" />
                      AI Prioritized
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {prioritizedTasks.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">All clear</h3>
                    <p className="text-sm text-muted-foreground">
                      {isSupplier 
                        ? 'No pending actions required from you right now.'
                        : 'No critical or at-risk items require your attention right now.'}
                    </p>
                  </motion.div>
                ) : (
                  prioritizedTasks.map((task, index) => (
                    <AITaskCard key={task.id} task={task} index={index} />
                  ))
                )}
              </CardContent>
            </Card>
          )}

          {/* Scenario Simulator - hide for suppliers */}
          {!isSupplier && (
            <div data-tour="scenario-simulator">
              <ScenarioSimulator
              scenarioState={scenarioState}
              onScenarioChange={setScenarioState}
                impact={scenarioImpact}
              />
            </div>
          )}

          {/* Activity Feed - if enabled */}
          {isWidgetEnabled('activity_feed') && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ActivityFeed activities={mockActivities} />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Readiness & Context */}
        <div className="space-y-4 md:space-y-6">
          {/* Readiness Gauge */}
          <Card data-tour="readiness-gauge">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-muted-foreground" />
                <CardTitle className="text-lg">
                  {isSupplier ? 'Your Compliance Status' : 'Readiness Overview'}
                </CardTitle>
              </div>
              <p className="text-xs text-muted-foreground">
                {isSupplier 
                  ? 'Your current compliance score and gaps'
                  : 'AI-computed compliance readiness'}
              </p>
            </CardHeader>
            <CardContent>
              <ReadinessGauge readiness={readiness} />
            </CardContent>
          </Card>

          {/* Context Object Display (for demo transparency) */}
          <Card className="bg-muted/30 border-dashed">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-muted-foreground" />
                <CardTitle className="text-sm text-muted-foreground">AI Context Object</CardTitle>
              </div>
              <p className="text-xs text-muted-foreground">
                UI is assembled from this context
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">role:</span>
                  <span className="text-foreground">{context.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">primary_widget:</span>
                  <span className="text-foreground">{layoutConfig.primaryWidget}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">critical_items:</span>
                  <span className={cn(
                    context.criticalItems > 0 ? "text-red-600" : "text-emerald-600"
                  )}>{context.criticalItems}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">regulatory_risk:</span>
                  <span className={cn(
                    context.upcomingRegulatoryRisk === 'high' || context.upcomingRegulatoryRisk === 'critical' 
                      ? "text-red-600" : "text-amber-600"
                  )}>{context.upcomingRegulatoryRisk}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">blocked_downstream:</span>
                  <span className={context.blockedDownstream ? "text-red-600" : "text-emerald-600"}>
                    {context.blockedDownstream ? 'true' : 'false'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">emphasis_areas:</span>
                  <span className="text-foreground">{layoutConfig.emphasisAreas.join(', ')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
