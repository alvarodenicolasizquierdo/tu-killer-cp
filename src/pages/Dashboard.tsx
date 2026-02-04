import { AppLayout } from '@/components/layout/AppLayout';
import { useUser, getRoleGreeting } from '@/contexts/UserContext';
import { KPICard } from '@/components/dashboard/KPICard';
import { TaskCard } from '@/components/dashboard/TaskCard';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { DraftResumeWidget } from '@/components/dashboard/DraftResumeWidget';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RegulatoryAlerts } from '@/components/dashboard/RegulatoryAlerts';
import { 
  mockTasks, 
  mockTRFs, 
  mockActivities, 
  buyerKPIs, 
  labKPIs, 
  managerKPIs 
} from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Inbox, Clock, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { currentUser } = useUser();
  const greeting = getRoleGreeting(currentUser.role);

  // Get role-specific KPIs
  const getKPIs = () => {
    switch (currentUser.role) {
      case 'lab_technician':
        return labKPIs;
      case 'manager':
      case 'admin':
        return managerKPIs;
      default:
        return buyerKPIs;
    }
  };

  const kpis = getKPIs();

  // Filter tasks based on role (in a real app, this would be server-side)
  const relevantTasks = mockTasks.slice(0, 5);
  const criticalTasks = relevantTasks.filter(t => t.priority === 'critical');
  const atRiskTasks = relevantTasks.filter(t => t.priority === 'at-risk');
  const onTrackTasks = relevantTasks.filter(t => t.priority === 'on-track' || t.priority === 'info');

  const drafts = mockTRFs.filter(t => t.status === 'draft' || t.status === 'in_progress');

  return (
    <AppLayout>
      {/* Greeting & Quick Actions */}
      <div className="mb-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Welcome back, {currentUser.name.split(' ')[0]}
            </h1>
            <p className="text-muted-foreground mt-1">{greeting}</p>
          </div>
          <QuickActions />
        </motion.div>
      </div>

      {/* Regulatory Alerts */}
      <div className="mb-6">
        <RegulatoryAlerts />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map((kpi, index) => (
          <KPICard key={kpi.label} data={kpi} index={index} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI-Prioritized Inbox */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg ai-gradient flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">AI-Prioritized Inbox</CardTitle>
                    <p className="text-xs text-muted-foreground">
                      Tasks ranked by urgency and impact
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive" className="gap-1">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    {criticalTasks.length} Critical
                  </Badge>
                  <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-200">
                    {atRiskTasks.length} At Risk
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[600px] overflow-y-auto scrollbar-thin">
              {/* Critical Tasks */}
              {criticalTasks.length > 0 && (
                <div className="space-y-2">
                  {criticalTasks.map((task, index) => (
                    <TaskCard key={task.id} task={task} index={index} />
                  ))}
                </div>
              )}

              {/* At Risk Tasks */}
              {atRiskTasks.length > 0 && (
                <div className="space-y-2">
                  {atRiskTasks.map((task, index) => (
                    <TaskCard key={task.id} task={task} index={index + criticalTasks.length} />
                  ))}
                </div>
              )}

              {/* Other Tasks */}
              {onTrackTasks.length > 0 && (
                <div className="space-y-2">
                  {onTrackTasks.map((task, index) => (
                    <TaskCard key={task.id} task={task} index={index + criticalTasks.length + atRiskTasks.length} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Draft Resume Widget */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <CardTitle className="text-lg">Resume Drafts</CardTitle>
              </div>
              <p className="text-xs text-muted-foreground">
                Continue where you left off
              </p>
            </CardHeader>
            <CardContent>
              <DraftResumeWidget drafts={drafts} />
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-muted-foreground" />
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="max-h-[400px] overflow-y-auto scrollbar-thin">
              <ActivityFeed activities={mockActivities} />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
