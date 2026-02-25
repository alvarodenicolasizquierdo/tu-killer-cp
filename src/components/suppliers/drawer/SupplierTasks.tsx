import { Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue' | 'cancelled';
}

interface SupplierTasksProps {
  tasks: Task[];
}

const taskStatusStyles: Record<string, string> = {
  pending: 'bg-slate-100 text-slate-700',
  in_progress: 'bg-blue-100 text-blue-700',
  completed: 'bg-emerald-100 text-emerald-700',
  overdue: 'bg-red-100 text-red-700',
  cancelled: 'bg-gray-100 text-gray-700',
};

export function SupplierTasks({ tasks }: SupplierTasksProps) {
  if (tasks.length === 0) return null;

  return (
    <div>
      <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
        <Clock className="w-4 h-4" />
        Recent Tasks ({tasks.length})
      </h4>
      <div className="space-y-2">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{task.title}</p>
              <p className="text-xs text-muted-foreground">
                Due {new Date(task.dueDate).toLocaleDateString()}
              </p>
            </div>
            <Badge variant="outline" className={cn('text-xs ml-2', taskStatusStyles[task.status])}>
              {task.status.replace('_', ' ')}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
