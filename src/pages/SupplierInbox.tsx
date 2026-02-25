/**
 * SupplierInbox - Task inbox with priority groups and SLA indicators
 */

import { useState, useMemo, useEffect } from 'react';
import { tagScreen } from '@/utils/clarityTracking';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, AlertTriangle, CheckCircle, Play, FileText, Send, Calendar, User, Search } from 'lucide-react';
import { toast } from 'sonner';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { supplierTasks } from '@/data/mockSuppliers';
import type { SupplierTask, SupplierTaskPriority, SupplierTaskStatus } from '@/types/supplier';

const priorityConfig: Record<SupplierTaskPriority, { label: string; className: string; icon: typeof AlertTriangle }> = {
  urgent: { label: 'Urgent', className: 'bg-red-100 text-red-700 border-red-200', icon: AlertTriangle },
  high: { label: 'High', className: 'bg-orange-100 text-orange-700 border-orange-200', icon: AlertTriangle },
  normal: { label: 'Normal', className: 'bg-blue-100 text-blue-700 border-blue-200', icon: Clock },
  low: { label: 'Low', className: 'bg-slate-100 text-slate-600 border-slate-200', icon: Clock },
};

const statusConfig: Record<SupplierTaskStatus, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-slate-100 text-slate-700' },
  in_progress: { label: 'In Progress', className: 'bg-blue-100 text-blue-700' },
  completed: { label: 'Completed', className: 'bg-emerald-100 text-emerald-700' },
  overdue: { label: 'Overdue', className: 'bg-red-100 text-red-700' },
  cancelled: { label: 'Cancelled', className: 'bg-gray-100 text-gray-500' },
};

const typeIcons: Record<string, typeof FileText> = {
  questionnaire_response: FileText,
  document_request: FileText,
  corrective_action: AlertTriangle,
  audit_scheduled: Calendar,
  certificate_renewal: CheckCircle,
  onboarding_review: User,
  performance_review: User,
};

function TaskCard({ task, onStatusChange }: { task: SupplierTask; onStatusChange: (task: SupplierTask, status: SupplierTaskStatus) => void }) {
  const priority = priorityConfig[task.priority];
  const status = statusConfig[task.status];
  const TypeIcon = typeIcons[task.type] || FileText;

  const getSLADisplay = () => {
    if (task.status === 'completed' || task.status === 'cancelled') return null;
    if (task.status === 'overdue') {
      return (
        <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200 gap-1">
          <AlertTriangle className="w-3 h-3" />
          Overdue
        </Badge>
      );
    }
    if (task.slaHours !== undefined) {
      const hoursRemaining = task.slaHours;
      const days = Math.floor(hoursRemaining / 24);
      const hours = hoursRemaining % 24;
      
      return (
        <Badge 
          variant="outline" 
          className={cn(
            'gap-1',
            hoursRemaining <= 24 ? 'bg-red-100 text-red-700 border-red-200' :
            hoursRemaining <= 72 ? 'bg-amber-100 text-amber-700 border-amber-200' :
            'bg-slate-100 text-slate-600 border-slate-200'
          )}
        >
          <Clock className="w-3 h-3" />
          {days > 0 ? `${days}d ${hours}h` : `${hours}h`}
        </Badge>
      );
    }
    return null;
  };

  const handleStart = () => {
    onStatusChange(task, 'in_progress');
    toast.success('Task started', { description: task.title });
  };

  const handleComplete = () => {
    onStatusChange(task, 'completed');
    toast.success('Task completed', { description: task.title });
  };

  return (
    <Card className={cn(
      'transition-all hover:shadow-md',
      task.status === 'overdue' && 'border-red-200 bg-red-50/50'
    )}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className={cn(
            'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
            priority.className
          )}>
            <TypeIcon className="w-5 h-5" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h4 className="font-medium text-sm line-clamp-1">{task.title}</h4>
              {getSLADisplay()}
            </div>
            
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {task.description}
            </p>
            
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{task.supplierName}</span>
              <span>•</span>
              <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
              {task.assignee && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {task.assignee}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="outline" className={status.className}>
              {status.label}
            </Badge>
            
            {task.status === 'pending' && (
              <Button size="sm" variant="outline" onClick={handleStart} className="gap-1">
                <Play className="w-3 h-3" />
                Start
              </Button>
            )}
            
            {task.status === 'in_progress' && (
              <Button size="sm" onClick={handleComplete} className="gap-1">
                <CheckCircle className="w-3 h-3" />
                Complete
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PrioritySection({ title, tasks, priority, onStatusChange }: { 
  title: string; 
  tasks: SupplierTask[]; 
  priority: SupplierTaskPriority;
  onStatusChange: (task: SupplierTask, status: SupplierTaskStatus) => void;
}) {
  const config = priorityConfig[priority];
  
  if (tasks.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Badge variant="outline" className={cn('gap-1', config.className)}>
          <config.icon className="w-3 h-3" />
          {title}
        </Badge>
        <span className="text-sm text-muted-foreground">({tasks.length})</span>
      </div>
      <div className="space-y-3">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} onStatusChange={onStatusChange} />
        ))}
      </div>
    </div>
  );
}

const SupplierInbox = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<SupplierTask[]>(supplierTasks);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => { tagScreen('portal-supplier-inbox'); }, []);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    let result = tasks;

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(t => 
        t.title.toLowerCase().includes(searchLower) ||
        t.supplierName.toLowerCase().includes(searchLower) ||
        t.description.toLowerCase().includes(searchLower)
      );
    }

    // Tab filter
    if (activeTab === 'pending') {
      result = result.filter(t => t.status === 'pending' || t.status === 'overdue');
    } else if (activeTab === 'in_progress') {
      result = result.filter(t => t.status === 'in_progress');
    } else if (activeTab === 'completed') {
      result = result.filter(t => t.status === 'completed');
    }

    return result;
  }, [tasks, search, activeTab]);

  // Group by priority
  const tasksByPriority = useMemo(() => ({
    urgent: filteredTasks.filter(t => t.priority === 'urgent' || t.status === 'overdue'),
    high: filteredTasks.filter(t => t.priority === 'high' && t.status !== 'overdue'),
    normal: filteredTasks.filter(t => t.priority === 'normal'),
    low: filteredTasks.filter(t => t.priority === 'low'),
  }), [filteredTasks]);

  // Stats
  const stats = useMemo(() => ({
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    overdue: tasks.filter(t => t.status === 'overdue').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  }), [tasks]);

  const handleStatusChange = (task: SupplierTask, newStatus: SupplierTaskStatus) => {
    setTasks(prev => prev.map(t => 
      t.id === task.id 
        ? { ...t, status: newStatus, updatedAt: new Date().toISOString(), completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined }
        : t
    ));
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/suppliers')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Supplier Inbox</h1>
            <p className="text-muted-foreground">Manage supplier tasks and action items</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                <FileText className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Tasks</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Play className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
                <p className="text-xs text-muted-foreground">Overdue</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-600">{stats.completed}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Tabs */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="in_progress">In Progress</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {/* Task Lists */}
        <div className="space-y-6">
          <PrioritySection 
            title="Urgent" 
            tasks={tasksByPriority.urgent} 
            priority="urgent" 
            onStatusChange={handleStatusChange}
          />
          <PrioritySection 
            title="High Priority" 
            tasks={tasksByPriority.high} 
            priority="high" 
            onStatusChange={handleStatusChange}
          />
          <PrioritySection 
            title="Normal" 
            tasks={tasksByPriority.normal} 
            priority="normal" 
            onStatusChange={handleStatusChange}
          />
          <PrioritySection 
            title="Low Priority" 
            tasks={tasksByPriority.low} 
            priority="low" 
            onStatusChange={handleStatusChange}
          />

          {filteredTasks.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No tasks found matching your criteria</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default SupplierInbox;
