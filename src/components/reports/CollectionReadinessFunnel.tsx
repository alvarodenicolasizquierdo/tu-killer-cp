import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Layers, 
  TestTube2, 
  Tag, 
  FileCheck, 
  CheckCircle2, 
  AlertTriangle,
  ChevronRight,
  TrendingDown,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { mockCollections } from '@/data/stylesData';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface FunnelStage {
  id: string;
  name: string;
  icon: React.ReactNode;
  count: number;
  blockedCount: number;
  blockedReason?: string;
  collections: typeof mockCollections;
  color: string;
  avgDaysBlocked?: number;
}

export function CollectionReadinessFunnel() {
  const funnelData = useMemo(() => {
    const stages: FunnelStage[] = [
      {
        id: 'components',
        name: 'Components Pending',
        icon: <Layers className="h-4 w-4" />,
        count: 0,
        blockedCount: 0,
        blockedReason: 'Missing or incomplete components',
        collections: [],
        color: 'hsl(var(--chart-1))',
        avgDaysBlocked: 0
      },
      {
        id: 'base',
        name: 'Base Testing Gate',
        icon: <TestTube2 className="h-4 w-4" />,
        count: 0,
        blockedCount: 0,
        blockedReason: 'Base approval required for Bulk',
        collections: [],
        color: 'hsl(var(--chart-2))',
        avgDaysBlocked: 0
      },
      {
        id: 'bulk',
        name: 'Bulk Testing',
        icon: <TestTube2 className="h-4 w-4" />,
        count: 0,
        blockedCount: 0,
        blockedReason: 'Bulk approval required for Garment',
        collections: [],
        color: 'hsl(var(--chart-3))',
        avgDaysBlocked: 0
      },
      {
        id: 'care',
        name: 'Care Labelling',
        icon: <Tag className="h-4 w-4" />,
        count: 0,
        blockedCount: 0,
        blockedReason: 'Care package incomplete',
        collections: [],
        color: 'hsl(var(--chart-4))',
        avgDaysBlocked: 0
      },
      {
        id: 'gsw',
        name: 'GSW Pending',
        icon: <FileCheck className="h-4 w-4" />,
        count: 0,
        blockedCount: 0,
        blockedReason: 'Awaiting Garment Tech approval',
        collections: [],
        color: 'hsl(var(--chart-5))',
        avgDaysBlocked: 0
      },
      {
        id: 'approved',
        name: 'Approved',
        icon: <CheckCircle2 className="h-4 w-4" />,
        count: 0,
        blockedCount: 0,
        collections: [],
        color: 'hsl(var(--success))'
      }
    ];

    // Categorize collections by their current bottleneck
    mockCollections.forEach(collection => {
      if (collection.status === 'approved') {
        stages[5].count++;
        stages[5].collections.push(collection);
      } else if (collection.status === 'gsw_pending') {
        stages[4].count++;
        stages[4].blockedCount++;
        stages[4].collections.push(collection);
      } else if (collection.status === 'care_labelling' || !collection.careLabelPackage?.isComplete) {
        if (collection.bulkTesting.status === 'approved') {
          stages[3].count++;
          stages[3].blockedCount++;
          stages[3].collections.push(collection);
        }
      } else if (collection.status === 'bulk_testing' || collection.bulkTesting.status !== 'approved') {
        if (collection.baseTesting.status === 'approved') {
          stages[2].count++;
          if (collection.bulkTesting.status !== 'approved') {
            stages[2].blockedCount++;
          }
          stages[2].collections.push(collection);
        }
      } else if (collection.status === 'base_testing' || collection.baseTesting.status !== 'approved') {
        stages[1].count++;
        stages[1].blockedCount++;
        stages[1].collections.push(collection);
      } else if (collection.status === 'components_pending' || collection.status === 'draft') {
        stages[0].count++;
        stages[0].blockedCount++;
        stages[0].collections.push(collection);
      }
    });

    // Simulate average days blocked
    stages[0].avgDaysBlocked = 3.2;
    stages[1].avgDaysBlocked = 5.4;
    stages[2].avgDaysBlocked = 4.1;
    stages[3].avgDaysBlocked = 2.8;
    stages[4].avgDaysBlocked = 6.7;

    return stages;
  }, []);

  const totalCollections = mockCollections.length;
  const totalBlocked = funnelData.reduce((sum, s) => sum + s.blockedCount, 0);
  const approvedCount = funnelData[5].count;
  const passThrough = totalCollections > 0 ? Math.round((approvedCount / totalCollections) * 100) : 0;

  // Calculate funnel widths (relative to max)
  const maxCount = Math.max(...funnelData.map(s => s.count), 1);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-primary" />
              Collection Readiness Funnel
            </CardTitle>
            <CardDescription>
              {totalBlocked} collections blocked across {funnelData.filter(s => s.blockedCount > 0).length} stages
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{passThrough}%</div>
            <div className="text-xs text-muted-foreground">Pass-through rate</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Funnel Visualization */}
        <div className="space-y-2">
          {funnelData.map((stage, index) => {
            const widthPercent = maxCount > 0 ? Math.max((stage.count / maxCount) * 100, 15) : 15;
            const isBottleneck = stage.blockedCount > 0 && stage.id !== 'approved';
            
            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="flex items-center gap-3">
                  {/* Stage Label */}
                  <div className="w-36 flex items-center gap-2 text-sm">
                    <div 
                      className={cn(
                        "p-1.5 rounded",
                        isBottleneck ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"
                      )}
                    >
                      {stage.icon}
                    </div>
                    <span className={cn(
                      "font-medium truncate",
                      isBottleneck && "text-destructive"
                    )}>
                      {stage.name}
                    </span>
                  </div>

                  {/* Funnel Bar */}
                  <div className="flex-1 relative">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            "h-10 rounded-md flex items-center justify-between px-3 cursor-pointer transition-all hover:opacity-80",
                            stage.id === 'approved' 
                              ? "bg-success/20 border border-success/30" 
                              : isBottleneck 
                                ? "bg-destructive/10 border border-destructive/20"
                                : "bg-muted border border-border"
                          )}
                          style={{ 
                            width: `${widthPercent}%`,
                            marginLeft: `${(100 - widthPercent) / 2}%`
                          }}
                        >
                          <span className={cn(
                            "font-semibold",
                            stage.id === 'approved' ? "text-success" : isBottleneck ? "text-destructive" : "text-foreground"
                          )}>
                            {stage.count}
                          </span>
                          {stage.blockedCount > 0 && stage.id !== 'approved' && (
                            <Badge variant="destructive" className="text-xs">
                              {stage.blockedCount} blocked
                            </Badge>
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        <div className="space-y-1">
                          <p className="font-medium">{stage.name}</p>
                          {stage.blockedReason && (
                            <p className="text-xs text-muted-foreground">{stage.blockedReason}</p>
                          )}
                          {stage.avgDaysBlocked && stage.avgDaysBlocked > 0 && (
                            <p className="text-xs flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Avg. {stage.avgDaysBlocked} days at this stage
                            </p>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  {/* Arrow */}
                  {index < funnelData.length - 1 && (
                    <ChevronRight className="h-4 w-4 text-muted-foreground/50 absolute right-0" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Blocked Collections Detail */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-warning" />
            Blocked Collections by Stage
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {funnelData.filter(s => s.blockedCount > 0 && s.id !== 'approved').map(stage => (
              <div 
                key={stage.id}
                className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded bg-destructive/10 text-destructive">
                      {stage.icon}
                    </div>
                    <span className="text-sm font-medium">{stage.name}</span>
                  </div>
                  <Badge variant="outline" className="text-destructive border-destructive/30">
                    {stage.blockedCount}
                  </Badge>
                </div>
                <div className="space-y-1">
                  {stage.collections.slice(0, 2).map(col => (
                    <Link 
                      key={col.id}
                      to={`/styles/${col.id}`}
                      className="block text-xs text-muted-foreground hover:text-primary truncate"
                    >
                      • {col.name}
                    </Link>
                  ))}
                  {stage.collections.length > 2 && (
                    <span className="text-xs text-muted-foreground">
                      +{stage.collections.length - 2} more
                    </span>
                  )}
                </div>
                {stage.avgDaysBlocked && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    Avg. {stage.avgDaysBlocked} days blocked
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold">{totalCollections}</div>
            <div className="text-xs text-muted-foreground">Total Collections</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-destructive">{totalBlocked}</div>
            <div className="text-xs text-muted-foreground">Currently Blocked</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success">{approvedCount}</div>
            <div className="text-xs text-muted-foreground">Fully Approved</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning">4.8</div>
            <div className="text-xs text-muted-foreground">Avg. Days to Clear</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
