import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  TestTube2, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Lock,
  ArrowRight,
  FileText,
  ChevronRight,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AIAssistPanel } from '@/components/ai/AIAssistPanel';
import { mockCollections } from '@/data/stylesData';
import { cn } from '@/lib/utils';
import { AIAssistSuggestion, TestingLevel as TLevel, ProductCollection } from '@/types/styles';
import { Link } from 'react-router-dom';

export default function TestingLevels() {
  const [activeLevel, setActiveLevel] = useState<TLevel>('Base');

  // Get collections at each testing level
  const collectionsByLevel = useMemo(() => {
    return {
      Base: mockCollections.filter(c => 
        c.baseTesting.status === 'in_progress' || 
        c.baseTesting.status === 'submitted' ||
        c.baseTesting.status === 'passed'
      ),
      Bulk: mockCollections.filter(c => 
        c.baseTesting.status === 'approved' && 
        (c.bulkTesting.status === 'in_progress' || 
         c.bulkTesting.status === 'submitted' ||
         c.bulkTesting.status === 'passed')
      ),
      Garment: mockCollections.filter(c => 
        c.bulkTesting.status === 'approved' && 
        (c.garmentTesting.status === 'in_progress' || 
         c.garmentTesting.status === 'submitted' ||
         c.garmentTesting.status === 'passed')
      )
    };
  }, []);

  // Stats
  const stats = useMemo(() => {
    const baseApproved = mockCollections.filter(c => c.baseTesting.status === 'approved').length;
    const bulkApproved = mockCollections.filter(c => c.bulkTesting.status === 'approved').length;
    const garmentApproved = mockCollections.filter(c => c.garmentTesting.status === 'approved').length;
    const blocked = mockCollections.filter(c => 
      c.status === 'bulk_testing' && c.baseTesting.status !== 'approved'
    ).length;

    return { baseApproved, bulkApproved, garmentApproved, blocked, total: mockCollections.length };
  }, []);

  // AI suggestions
  const aiSuggestions: AIAssistSuggestion[] = useMemo(() => {
    const suggestions: AIAssistSuggestion[] = [];

    // Check for blocked collections
    const blockedByBase = mockCollections.filter(c => 
      c.baseTesting.status !== 'approved' && c.bulkTesting.status !== 'not_started'
    );
    if (blockedByBase.length > 0) {
      suggestions.push({
        id: 'blocked-base',
        type: 'approval_block',
        title: `${blockedByBase.length} collection(s) blocked at Bulk`,
        description: 'Base approval is required before Bulk testing can proceed',
        confidence: 100,
        reasoning: [
          'Base testing validates core component compliance',
          'This gate prevents quality issues from propagating',
          'Prioritize Base approvals to unblock workflow'
        ]
      });
    }

    // SLA warnings
    const pendingApproval = mockCollections.filter(c => c.baseTesting.status === 'passed');
    if (pendingApproval.length > 0) {
      suggestions.push({
        id: 'pending-approval',
        type: 'test_plan',
        title: `${pendingApproval.length} passed tests awaiting approval`,
        description: 'Tests have passed but need final approval to proceed',
        confidence: 88,
        reasoning: [
          'Faster approvals reduce overall cycle time',
          'Delays in approval can affect production schedules',
          'Average approval time: 2.3 days'
        ],
        action: { label: 'View Pending', type: 'apply' }
      });
    }

    return suggestions;
  }, []);

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      not_started: 'bg-muted text-muted-foreground',
      submitted: 'bg-blue-100 text-blue-700',
      in_progress: 'bg-indigo-100 text-indigo-700',
      passed: 'bg-amber-100 text-amber-700',
      failed: 'bg-red-100 text-red-700',
      approved: 'bg-emerald-100 text-emerald-700'
    };
    return statusColors[status] || 'bg-muted text-muted-foreground';
  };

  const getTestingState = (collection: ProductCollection, level: TLevel) => {
    switch (level) {
      case 'Base':
        return collection.baseTesting;
      case 'Bulk':
        return collection.bulkTesting;
      case 'Garment':
        return collection.garmentTesting;
    }
  };

  const isBlocked = (collection: ProductCollection, level: TLevel) => {
    if (level === 'Bulk' && collection.baseTesting.status !== 'approved') return true;
    if (level === 'Garment' && collection.bulkTesting.status !== 'approved') return true;
    return false;
  };

  return (
    <AppLayout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Testing Levels</h1>
        <p className="text-muted-foreground">Manage Base → Bulk → Garment testing workflow</p>
      </div>

      {/* Workflow Progress */}
      <Card className="mb-6">
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mb-2",
                  "bg-emerald-100 text-emerald-700"
                )}>
                  {stats.baseApproved}
                </div>
                <p className="text-sm font-medium">Base</p>
                <p className="text-xs text-muted-foreground">Approved</p>
              </div>
              <ArrowRight className="w-6 h-6 text-muted-foreground" />
              <div className="text-center">
                <div className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mb-2",
                  "bg-indigo-100 text-indigo-700"
                )}>
                  {stats.bulkApproved}
                </div>
                <p className="text-sm font-medium">Bulk</p>
                <p className="text-xs text-muted-foreground">Approved</p>
              </div>
              <ArrowRight className="w-6 h-6 text-muted-foreground" />
              <div className="text-center">
                <div className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mb-2",
                  "bg-purple-100 text-purple-700"
                )}>
                  {stats.garmentApproved}
                </div>
                <p className="text-sm font-medium">Garment</p>
                <p className="text-xs text-muted-foreground">Approved</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                {stats.blocked > 0 && (
                  <Badge variant="destructive" className="gap-1">
                    <Lock className="w-3 h-3" />
                    {stats.blocked} Blocked
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {Math.round((stats.garmentApproved / stats.total) * 100)}% fully approved
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs value={activeLevel} onValueChange={(v) => setActiveLevel(v as TLevel)}>
            <TabsList className="mb-4">
              <TabsTrigger value="Base" className="gap-2">
                <TestTube2 className="w-4 h-4" />
                Base Testing
                <Badge variant="secondary" className="ml-1">{collectionsByLevel.Base.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="Bulk" className="gap-2">
                <TestTube2 className="w-4 h-4" />
                Bulk Testing
                <Badge variant="secondary" className="ml-1">{collectionsByLevel.Bulk.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="Garment" className="gap-2">
                <TestTube2 className="w-4 h-4" />
                Garment Testing
                <Badge variant="secondary" className="ml-1">{collectionsByLevel.Garment.length}</Badge>
              </TabsTrigger>
            </TabsList>

            {(['Base', 'Bulk', 'Garment'] as TLevel[]).map((level) => (
              <TabsContent key={level} value={level} className="space-y-4">
                {/* Gate Warning */}
                {level !== 'Base' && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3">
                    <Lock className="w-5 h-5 text-amber-600 shrink-0" />
                    <div>
                      <p className="font-medium text-amber-800">Gate Requirement</p>
                      <p className="text-sm text-amber-700">
                        {level === 'Bulk' 
                          ? 'Base testing must be approved before Bulk testing can proceed'
                          : 'Bulk testing must be approved before Garment testing can proceed'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Collections at this level */}
                <div className="space-y-3">
                  {collectionsByLevel[level].length === 0 ? (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <TestTube2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="font-semibold text-foreground mb-1">No collections at this stage</h3>
                        <p className="text-sm text-muted-foreground">
                          Collections will appear here when they reach {level} testing
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    collectionsByLevel[level].map((collection, index) => {
                      const testingState = getTestingState(collection, level);
                      const blocked = isBlocked(collection, level);

                      return (
                        <motion.div
                          key={collection.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Link to={`/styles/${collection.id}`}>
                            <Card className={cn(
                              "hover:shadow-md transition-all cursor-pointer",
                              blocked && "opacity-60"
                            )}>
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                      <TestTube2 className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                      <h3 className="font-semibold">{collection.name}</h3>
                                      <p className="text-xs text-muted-foreground">
                                        {collection.supplierName} • {collection.season}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    {blocked && (
                                      <Badge variant="outline" className="gap-1 text-amber-600 border-amber-200">
                                        <Lock className="w-3 h-3" />
                                        Blocked
                                      </Badge>
                                    )}
                                    <Badge className={getStatusBadge(testingState.status)}>
                                      {testingState.status.replace('_', ' ')}
                                    </Badge>
                                    {testingState.trfId && (
                                      <Badge variant="outline" className="gap-1">
                                        <FileText className="w-3 h-3" />
                                        TRF
                                      </Badge>
                                    )}
                                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* AI Assist Panel */}
        <div className="space-y-4">
          <AIAssistPanel
            suggestions={aiSuggestions}
            context="Testing Insights"
            onApplySuggestion={(s) => console.log('Applied:', s)}
            onDismissSuggestion={(s) => console.log('Dismissed:', s)}
          />

          {/* SLA Tracker */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <CardTitle className="text-base">SLA Tracker</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Base → Bulk</span>
                  <span className="font-medium">Avg: 5.2 days</span>
                </div>
                <Progress value={72} className="h-1.5" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Bulk → Garment</span>
                  <span className="font-medium">Avg: 3.8 days</span>
                </div>
                <Progress value={85} className="h-1.5" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Total Cycle Time</span>
                  <span className="font-medium">Avg: 12.4 days</span>
                </div>
                <Progress value={65} className="h-1.5" />
              </div>
            </CardContent>
          </Card>

          {/* Approval Stats */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-muted-foreground" />
                <CardTitle className="text-base">Approval Stats</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">First-pass rate</span>
                <span className="font-medium text-emerald-600">87%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Retest rate</span>
                <span className="font-medium text-amber-600">13%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Avg. approval time</span>
                <span className="font-medium">2.3 days</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
