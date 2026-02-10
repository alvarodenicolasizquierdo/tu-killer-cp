import { useState, useEffect } from 'react';
import { tagScreen } from '@/utils/clarityTracking';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { mockTRFs } from '@/data/mockData';
import { TRF, TRFStatus, Priority } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Search, 
  Filter, 
  Plus, 
  LayoutGrid, 
  List, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  FileText,
  MoreHorizontal,
  ArrowUpDown,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useFeatureFlag } from '@/config/featureFlags';

const statusConfig: Record<TRFStatus, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700 border-gray-200', icon: FileText },
  submitted: { label: 'Submitted', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: FileText },
  in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Clock },
  pending_review: { label: 'Pending Review', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: AlertTriangle },
  approved: { label: 'Approved', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700 border-red-200', icon: AlertTriangle },
  completed: { label: 'Completed', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle },
};

const priorityConfig: Record<Priority, { label: string; color: string }> = {
  critical: { label: 'Critical', color: 'bg-red-500' },
  'at-risk': { label: 'At Risk', color: 'bg-amber-500' },
  'on-track': { label: 'On Track', color: 'bg-emerald-500' },
  info: { label: 'Info', color: 'bg-blue-500' },
};

function TRFTableRow({ trf, index, onClick }: { trf: TRF; index: number; onClick: () => void }) {
  const status = statusConfig[trf.status];
  const priority = priorityConfig[trf.priority];
  const StatusIcon = status.icon;

  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="group hover:bg-muted/50 cursor-pointer"
      onClick={onClick}
    >
      <TableCell>
        <div className="flex items-center gap-2">
          <div className={cn("w-1 h-8 rounded-full", priority.color)} />
          <div>
            <p className="font-medium text-sm">{trf.reference}</p>
            <p className="text-xs text-muted-foreground">{trf.category}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <p className="text-sm font-medium line-clamp-1">{trf.productName}</p>
        <p className="text-xs text-muted-foreground">{trf.supplier}</p>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className={cn("gap-1", status.color)}>
          <StatusIcon className="w-3 h-3" />
          {status.label}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Progress value={trf.progress} className="w-16 h-1.5" />
          <span className="text-xs text-muted-foreground">{trf.progress}%</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1.5">
          <span className="text-sm text-emerald-600">{trf.passedTests}</span>
          <span className="text-muted-foreground">/</span>
          {trf.failedTests > 0 && (
            <span className="text-sm text-red-600">{trf.failedTests}</span>
          )}
          <span className="text-xs text-muted-foreground">of {trf.testCount}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          {trf.slaRemaining && trf.slaRemaining <= 24 && (
            <Clock className="w-3 h-3 text-red-500" />
          )}
          <span className={cn(
            "text-sm",
            trf.slaRemaining && trf.slaRemaining <= 24 ? "text-red-600 font-medium" : "text-muted-foreground"
          )}>
            {format(new Date(trf.dueDate), 'MMM d, yyyy')}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </TableCell>
    </motion.tr>
  );
}

function TRFKanbanCard({ trf, index, onClick }: { trf: TRF; index: number; onClick: () => void }) {
  const priority = priorityConfig[trf.priority];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        "p-3 rounded-lg bg-card border border-border hover:border-primary/30",
        "hover:shadow-md cursor-pointer transition-all"
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-2">
        <Badge variant="outline" className="text-xs">
          {trf.reference}
        </Badge>
        <div className={cn("w-2 h-2 rounded-full", priority.color)} />
      </div>
      <h4 className="font-medium text-sm line-clamp-2 mb-2">{trf.productName}</h4>
      <p className="text-xs text-muted-foreground mb-3">{trf.supplier}</p>
      <div className="flex items-center justify-between">
        <Progress value={trf.progress} className="w-full h-1.5 mr-2" />
        <span className="text-xs text-muted-foreground shrink-0">{trf.progress}%</span>
      </div>
      {trf.slaRemaining && trf.slaRemaining <= 48 && (
        <div className="flex items-center gap-1 mt-2 text-xs text-red-600">
          <Clock className="w-3 h-3" />
          {trf.slaRemaining}h remaining
        </div>
      )}
    </motion.div>
  );
}

export default function TRFs() {
  const navigate = useNavigate();
  useEffect(() => { tagScreen('portal-trfs'); }, []);
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAllTRFs, setShowAllTRFs] = useState(false);
  const newNavEnabled = useFeatureFlag('NEW_IA_NAV_AND_HOME');

  const filteredTRFs = mockTRFs.filter(trf => {
    const matchesSearch = 
      trf.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trf.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trf.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || trf.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Progressive disclosure: show top 5 by default when flag is enabled
  const initialDisplayCount = 5;
  const hasMoreTRFs = filteredTRFs.length > initialDisplayCount;
  const displayedTRFs = (newNavEnabled && !showAllTRFs && hasMoreTRFs) 
    ? filteredTRFs.slice(0, initialDisplayCount) 
    : filteredTRFs;
  const hiddenCount = filteredTRFs.length - initialDisplayCount;

  // Group TRFs by status for Kanban view
  const kanbanColumns: { status: TRFStatus; title: string; trfs: TRF[] }[] = [
    { status: 'draft', title: 'Draft', trfs: filteredTRFs.filter(t => t.status === 'draft') },
    { status: 'submitted', title: 'Submitted', trfs: filteredTRFs.filter(t => t.status === 'submitted') },
    { status: 'in_progress', title: 'In Progress', trfs: filteredTRFs.filter(t => t.status === 'in_progress') },
    { status: 'pending_review', title: 'Pending Review', trfs: filteredTRFs.filter(t => t.status === 'pending_review') },
    { status: 'completed', title: 'Completed', trfs: filteredTRFs.filter(t => t.status === 'completed' || t.status === 'approved') },
  ];

  return (
    <AppLayout title="TRF Management" subtitle="Test Request Forms - Track, manage, and approve testing requests">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search TRFs, products, suppliers..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {Object.entries(statusConfig).map(([key, config]) => (
                <SelectItem key={key} value={key}>{config.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-lg p-1">
            <Button
              variant={viewMode === 'table' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'kanban' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('kanban')}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
          </div>
          <Button className="ai-gradient border-0">
            <Plus className="w-4 h-4 mr-2" />
            New TRF
          </Button>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'table' ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">
                    <Button variant="ghost" size="sm" className="gap-1 -ml-3">
                      Reference <ArrowUpDown className="w-3 h-3" />
                    </Button>
                  </TableHead>
                  <TableHead>Product / Supplier</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Tests</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedTRFs.map((trf, index) => (
                  <TRFTableRow key={trf.id} trf={trf} index={index} onClick={() => navigate(`/trfs/${trf.id}`)} />
                ))}
              </TableBody>
            </Table>
            
            {/* Progressive Disclosure: Show more/less button */}
            {newNavEnabled && hasMoreTRFs && (
              <div className="border-t border-border p-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAllTRFs(!showAllTRFs)}
                  className="w-full text-muted-foreground hover:text-foreground border border-dashed border-border hover:border-primary/30"
                >
                  {showAllTRFs ? (
                    <>
                      <ChevronUp className="w-4 h-4 mr-1" />
                      Show fewer TRFs
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 mr-1" />
                      Show more TRFs ({hiddenCount} more)
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {kanbanColumns.map((column) => (
            <div key={column.status} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm">{column.title}</h3>
                <Badge variant="secondary">{column.trfs.length}</Badge>
              </div>
              <div className="space-y-2 min-h-[200px] p-2 bg-muted/30 rounded-lg">
                {column.trfs.map((trf, index) => (
                  <TRFKanbanCard key={trf.id} trf={trf} index={index} onClick={() => navigate(`/trfs/${trf.id}`)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
