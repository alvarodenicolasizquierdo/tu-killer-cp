import { TRFTest } from '@/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { CheckCircle, XCircle, Clock, Loader2, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

const statusConfig: Record<TRFTest['status'], { icon: React.ComponentType<{ className?: string }>; color: string; label: string }> = {
  passed: { icon: CheckCircle, color: 'text-emerald-500', label: 'Passed' },
  failed: { icon: XCircle, color: 'text-red-500', label: 'Failed' },
  pending: { icon: Clock, color: 'text-muted-foreground', label: 'Pending' },
  in_progress: { icon: Loader2, color: 'text-blue-500', label: 'In Progress' },
  retest: { icon: RotateCcw, color: 'text-amber-500', label: 'Retest' },
};

interface TRFTestResultsProps {
  tests: TRFTest[];
}

export function TRFTestResults({ tests }: TRFTestResultsProps) {
  // Group tests by category
  const categories = [...new Set(tests.map(t => t.category))];

  return (
    <div className="space-y-6">
      {categories.map((category, catIndex) => {
        const categoryTests = tests.filter(t => t.category === category);
        const passed = categoryTests.filter(t => t.status === 'passed').length;
        const total = categoryTests.length;

        return (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: catIndex * 0.1 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-sm">{category}</h4>
              <Badge variant="outline" className="text-xs">
                {passed}/{total} passed
              </Badge>
            </div>

            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[200px]">Test</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Threshold</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categoryTests.map((test, index) => {
                    const status = statusConfig[test.status];
                    const StatusIcon = status.icon;

                    return (
                      <TableRow key={test.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">{test.name}</p>
                            {test.notes && (
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {test.notes}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={cn(
                            "text-sm font-mono",
                            test.status === 'passed' && "text-emerald-600",
                            test.status === 'failed' && "text-red-600"
                          )}>
                            {test.result || '—'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground font-mono">
                            {test.threshold}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className={cn("flex items-center gap-1.5", status.color)}>
                            <StatusIcon className={cn(
                              "w-4 h-4",
                              test.status === 'in_progress' && "animate-spin"
                            )} />
                            <span className="text-xs font-medium">{status.label}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
