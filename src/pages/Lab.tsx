import { useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { tagScreen } from '@/utils/clarityTracking';
import { mockLabSamples } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Search, 
  Filter, 
  FlaskConical,
  Clock,
  AlertTriangle,
  CheckCircle,
  Play,
  Pause,
  MoreVertical,
  Beaker,
  Thermometer,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { LabSample } from '@/types';
import { format } from 'date-fns';

const statusConfig = {
  received: { label: 'Received', color: 'bg-blue-100 text-blue-700', icon: FlaskConical },
  queued: { label: 'Queued', color: 'bg-gray-100 text-gray-700', icon: Clock },
  testing: { label: 'Testing', color: 'bg-purple-100 text-purple-700', icon: Beaker },
  completed: { label: 'Completed', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
  on_hold: { label: 'On Hold', color: 'bg-amber-100 text-amber-700', icon: Pause },
};

function SampleCard({ sample, index }: { sample: LabSample; index: number }) {
  const status = statusConfig[sample.status];
  const StatusIcon = status.icon;

  const priorityColors = {
    critical: 'border-l-red-500',
    'at-risk': 'border-l-amber-500',
    'on-track': 'border-l-emerald-500',
    info: 'border-l-blue-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className={cn(
        "border-l-4 hover:shadow-md transition-shadow cursor-pointer",
        priorityColors[sample.priority]
      )}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                sample.priority === 'critical' && "bg-red-100",
                sample.priority === 'at-risk' && "bg-amber-100",
                sample.priority === 'on-track' && "bg-emerald-100",
                sample.priority === 'info' && "bg-blue-100"
              )}>
                <Beaker className={cn(
                  "w-5 h-5",
                  sample.priority === 'critical' && "text-red-600",
                  sample.priority === 'at-risk' && "text-amber-600",
                  sample.priority === 'on-track' && "text-emerald-600",
                  sample.priority === 'info' && "text-blue-600"
                )} />
              </div>
              <div>
                <h4 className="font-medium text-sm">{sample.trfReference}</h4>
                <p className="text-xs text-muted-foreground">{sample.sampleType}</p>
              </div>
            </div>
            <Badge variant="outline" className={cn("gap-1 text-xs", status.color)}>
              <StatusIcon className="w-3 h-3" />
              {status.label}
            </Badge>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Test Type</span>
              <span className="font-medium">{sample.testType}</span>
            </div>

            {sample.status === 'testing' && (
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{sample.progress}%</span>
                </div>
                <Progress value={sample.progress} className="h-1.5" />
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-border">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                Due: {format(new Date(sample.dueDate), 'MMM d')}
              </div>
              {sample.assignee && (
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                      {sample.assignee.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">{sample.assignee.split(' ')[0]}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          {sample.status === 'queued' && (
            <div className="mt-3 pt-3 border-t border-border">
              <Button size="sm" className="w-full gap-2">
                <Play className="w-3 h-3" />
                Start Testing
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function Lab() {
  useEffect(() => { tagScreen('portal-lab'); }, []);
  const queuedSamples = mockLabSamples.filter(s => s.status === 'queued' || s.status === 'received');
  const testingSamples = mockLabSamples.filter(s => s.status === 'testing');

  return (
    <AppLayout title="Lab Operations" subtitle="Manage testing queue, track samples, and record results">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search samples, TRFs, test types..." className="pl-10" />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>
        <Button className="ai-gradient border-0">
          <FlaskConical className="w-4 h-4 mr-2" />
          Receive Sample
        </Button>
      </div>

      {/* Lab Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Queue Depth</p>
                <p className="text-2xl font-bold">{queuedSamples.length}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Testing</p>
                <p className="text-2xl font-bold text-purple-600">{testingSamples.length}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Beaker className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed Today</p>
                <p className="text-2xl font-bold text-emerald-600">12</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">SLA Compliance</p>
                <p className="text-2xl font-bold">96%</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Testing Queue */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-muted-foreground" />
                Testing Queue
              </CardTitle>
              <Badge variant="secondary">{queuedSamples.length} samples</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 max-h-[500px] overflow-y-auto scrollbar-thin">
            {queuedSamples.map((sample, index) => (
              <SampleCard key={sample.id} sample={sample} index={index} />
            ))}
            {queuedSamples.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
                <p>Queue is empty</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Currently Testing */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Beaker className="w-5 h-5 text-purple-500" />
                Currently Testing
              </CardTitle>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                {testingSamples.length} active
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 max-h-[500px] overflow-y-auto scrollbar-thin">
            {testingSamples.map((sample, index) => (
              <SampleCard key={sample.id} sample={sample} index={index} />
            ))}
            {testingSamples.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <FlaskConical className="w-8 h-8 mx-auto mb-2" />
                <p>No tests in progress</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
