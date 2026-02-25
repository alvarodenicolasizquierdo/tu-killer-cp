import { useState, useMemo, useEffect } from 'react';
import { tagScreen } from '@/utils/clarityTracking';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  LayoutGrid, 
  List,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Package,
  Layers,
  TestTube2,
  Tag,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Brain
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AIAssistPanel } from '@/components/ai/AIAssistPanel';
import { mockCollections, getCollectionStatusInfo } from '@/data/stylesData';
import { cn } from '@/lib/utils';
import { AIAssistSuggestion, ProductCollection } from '@/types/styles';
import { useFeatureFlag } from '@/config/featureFlags';
import { AutoArchiveCountdown } from '@/components/compliance/AutoArchiveCountdown';

export default function Styles() {
  useEffect(() => { tagScreen('portal-styles'); }, []);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [seasonFilter, setSeasonFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAllCollections, setShowAllCollections] = useState(false);
  const newNavEnabled = useFeatureFlag('NEW_IA_NAV_AND_HOME');

  const filteredCollections = useMemo(() => {
    return mockCollections.filter(collection => {
      const matchesSearch = collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        collection.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        collection.department.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || collection.status === statusFilter;
      const matchesSeason = seasonFilter === 'all' || collection.season === seasonFilter;
      return matchesSearch && matchesStatus && matchesSeason;
    });
  }, [searchQuery, statusFilter, seasonFilter]);

  // Progressive disclosure: show top 5 by default when flag is enabled
  const initialDisplayCount = 5;
  const hasMoreCollections = filteredCollections.length > initialDisplayCount;
  const displayedCollections = (newNavEnabled && !showAllCollections && hasMoreCollections)
    ? filteredCollections.slice(0, initialDisplayCount)
    : filteredCollections;
  const hiddenCount = filteredCollections.length - initialDisplayCount;

  // Generate AI suggestions based on current state
  const aiSuggestions: AIAssistSuggestion[] = useMemo(() => {
    const suggestions: AIAssistSuggestion[] = [];
    
    // Check for collections blocked at gates
    const blockedAtBase = mockCollections.filter(c => c.status === 'base_testing' && c.baseTesting.status === 'in_progress');
    if (blockedAtBase.length > 0) {
      suggestions.push({
        id: 'blocked-base',
        type: 'approval_block',
        title: `${blockedAtBase.length} collection(s) pending Base approval`,
        description: 'Bulk testing is blocked until Base testing is approved',
        confidence: 100,
        reasoning: [
          'Base approval is required before Bulk testing can begin',
          'This gate prevents quality issues from propagating downstream',
          `Collections affected: ${blockedAtBase.map(c => c.name).join(', ')}`
        ]
      });
    }

    // GSW pending suggestions
    const gswPending = mockCollections.filter(c => c.status === 'gsw_pending');
    if (gswPending.length > 0) {
      suggestions.push({
        id: 'gsw-pending',
        type: 'gsw_tech',
        title: `${gswPending.length} collection(s) awaiting GSW`,
        description: 'Upload and submit Gold Seal Workbook to complete approval',
        confidence: 88,
        reasoning: [
          'All testing levels have been approved',
          'Care labelling is complete',
          'GSW submission is the final step before production'
        ],
        action: { label: 'View Collections', type: 'apply' }
      });
    }

    // Component suggestions for new collections
    const componentsPending = mockCollections.filter(c => c.status === 'components_pending');
    if (componentsPending.length > 0) {
      suggestions.push({
        id: 'components-needed',
        type: 'component_set',
        title: 'Auto-suggest components for new collections',
        description: 'AI can recommend component sets based on product type and history',
        confidence: 82,
        reasoning: [
          `${componentsPending.length} collection(s) need component links`,
          'Similar products in past seasons used comparable materials',
          'Auto-suggestion reduces setup time by ~65%'
        ],
        action: { label: 'Review Suggestions', type: 'apply' }
      });
    }

    return suggestions;
  }, []);

  // Summary stats
  const stats = useMemo(() => ({
    total: mockCollections.length,
    approved: mockCollections.filter(c => c.status === 'approved').length,
    inProgress: mockCollections.filter(c => !['approved', 'rejected', 'draft'].includes(c.status)).length,
    atRisk: mockCollections.filter(c => c.riskScore > 50).length
  }), []);

  const getStatusIcon = (status: ProductCollection['status']) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'rejected':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'gsw_pending':
      case 'care_labelling':
        return <Clock className="w-4 h-4 text-amber-500" />;
      default:
        return <TestTube2 className="w-4 h-4 text-blue-500" />;
    }
  };

  const getTestingProgress = (collection: ProductCollection) => {
    let completed = 0;
    if (collection.baseTesting.status === 'approved') completed++;
    if (collection.bulkTesting.status === 'approved') completed++;
    if (collection.garmentTesting.status === 'approved') completed++;
    return (completed / 3) * 100;
  };

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Styles / Collections</h1>
          <p className="text-muted-foreground">Manage product collections and their testing lifecycle</p>
        </div>
        <Button className="gap-2 bg-gradient-to-r from-ai-primary to-ai-secondary hover:opacity-90">
          <Plus className="w-4 h-4" />
          New Collection
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Collections</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-600">{stats.approved}</p>
                <p className="text-xs text-muted-foreground">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <TestTube2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600">{stats.atRisk}</p>
                <p className="text-xs text-muted-foreground">At Risk</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="py-4">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search collections, suppliers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-[160px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="components_pending">Components Pending</SelectItem>
                    <SelectItem value="base_testing">Base Testing</SelectItem>
                    <SelectItem value="bulk_testing">Bulk Testing</SelectItem>
                    <SelectItem value="garment_testing">Garment Testing</SelectItem>
                    <SelectItem value="care_labelling">Care Labelling</SelectItem>
                    <SelectItem value="gsw_pending">GSW Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={seasonFilter} onValueChange={setSeasonFilter}>
                  <SelectTrigger className="w-full md:w-[120px]">
                    <SelectValue placeholder="Season" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Seasons</SelectItem>
                    <SelectItem value="SS26">SS26</SelectItem>
                    <SelectItem value="FW26">FW26</SelectItem>
                    <SelectItem value="AW26">AW26</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex gap-1 border rounded-md p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="h-8 w-8 p-0"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="h-8 w-8 p-0"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Collections Grid/List */}
          <div className={cn(
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 gap-4" 
              : "space-y-3"
          )}>
            {displayedCollections.map((collection, index) => {
              const statusInfo = getCollectionStatusInfo(collection.status);
              const testingProgress = getTestingProgress(collection);
              
              return (
                <motion.div
                  key={collection.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Link to={`/styles/${collection.id}`}>
                    <Card className="hover:shadow-md hover:border-primary/30 transition-all cursor-pointer">
                      <CardContent className={cn("p-4", viewMode === 'list' && "flex items-center gap-4")}>
                        {/* Header */}
                        <div className={cn("flex items-start justify-between gap-3", viewMode === 'list' && "flex-1")}>
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                              <Package className="w-5 h-5 text-primary" />
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-semibold text-foreground truncate">{collection.name}</h3>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>{collection.supplierName}</span>
                                <span>•</span>
                                <span>{collection.season}</span>
                              </div>
                            </div>
                          </div>
                          <Badge className={cn("shrink-0", statusInfo.color)}>
                            {statusInfo.label}
                          </Badge>
                        </div>

                        {viewMode === 'grid' && (
                          <>
                            {/* Progress */}
                            <div className="mt-4 space-y-2">
                              <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">Testing Progress</span>
                                <span className="font-medium">{Math.round(testingProgress)}%</span>
                              </div>
                              <Progress value={testingProgress} className="h-1.5" />
                            </div>

                            {/* Testing Levels */}
                            <div className="mt-3 flex gap-2">
                              <div className={cn(
                                "flex-1 rounded-md p-2 text-center text-xs",
                                collection.baseTesting.status === 'approved' 
                                  ? "bg-emerald-100 text-emerald-700" 
                                  : collection.baseTesting.status === 'in_progress'
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-muted text-muted-foreground"
                              )}>
                                Base
                              </div>
                              <div className={cn(
                                "flex-1 rounded-md p-2 text-center text-xs",
                                collection.bulkTesting.status === 'approved' 
                                  ? "bg-emerald-100 text-emerald-700" 
                                  : collection.bulkTesting.status === 'in_progress'
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-muted text-muted-foreground"
                              )}>
                                Bulk
                              </div>
                              <div className={cn(
                                "flex-1 rounded-md p-2 text-center text-xs",
                                collection.garmentTesting.status === 'approved' 
                                  ? "bg-emerald-100 text-emerald-700" 
                                  : collection.garmentTesting.status === 'in_progress'
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-muted text-muted-foreground"
                              )}>
                                Garment
                              </div>
                            </div>

                            {/* Footer */}
                            <div className="mt-3 flex items-center justify-between text-xs">
                              <div className="flex items-center gap-3 flex-wrap">
                                <span className="flex items-center gap-1 text-muted-foreground">
                                  <Layers className="w-3.5 h-3.5" />
                                  {collection.componentIds.length} components
                                </span>
                                {collection.careLabelPackage?.isComplete && (
                                  <span className="flex items-center gap-1 text-emerald-600">
                                    <Tag className="w-3.5 h-3.5" />
                                    Care labels
                                  </span>
                                )}
                                {collection.gswSubmission?.status === 'approved' && (
                                  <span className="flex items-center gap-1 text-emerald-600">
                                    <FileCheck className="w-3.5 h-3.5" />
                                    GSW
                                  </span>
                                )}
                              </div>
                              <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            </div>
                            {/* FIX 8 [C-19]: Auto-archive countdown */}
                            <AutoArchiveCountdown createdDate={collection.createdAt || '2025-12-15'} />
                          </>
                        )}

                        {viewMode === 'list' && (
                          <div className="flex items-center gap-6">
                            <div className="w-32">
                              <Progress value={testingProgress} className="h-1.5" />
                              <p className="text-xs text-muted-foreground mt-1">{Math.round(testingProgress)}% complete</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Layers className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">{collection.componentIds.length}</span>
                            </div>
                            <div className={cn(
                              "text-sm font-medium",
                              collection.riskScore > 50 ? "text-amber-600" : "text-emerald-600"
                            )}>
                              {collection.readinessScore}% ready
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Progressive Disclosure: Show more/less button */}
          {newNavEnabled && hasMoreCollections && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAllCollections(!showAllCollections)}
              className="w-full text-muted-foreground hover:text-foreground border border-dashed border-border hover:border-primary/30"
            >
              {showAllCollections ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-1" />
                  Show fewer collections
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-1" />
                  Show more collections ({hiddenCount} more)
                </>
              )}
            </Button>
          )}

          {filteredCollections.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-1">No collections found</h3>
                <p className="text-sm text-muted-foreground">Try adjusting your filters or create a new collection</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* AI Assist Panel */}
        <div className="space-y-4">
          <AIAssistPanel
            suggestions={aiSuggestions}
            context="Collection Insights"
            onApplySuggestion={(s) => console.log('Applied:', s)}
            onDismissSuggestion={(s) => console.log('Dismissed:', s)}
          />

          {/* Quick Stats Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Workflow Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Base Testing</span>
                <span className="font-medium">{mockCollections.filter(c => c.baseTesting.status === 'approved').length}/{mockCollections.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Bulk Testing</span>
                <span className="font-medium">{mockCollections.filter(c => c.bulkTesting.status === 'approved').length}/{mockCollections.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Garment Testing</span>
                <span className="font-medium">{mockCollections.filter(c => c.garmentTesting.status === 'approved').length}/{mockCollections.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">GSW Approved</span>
                <span className="font-medium">{mockCollections.filter(c => c.gswSubmission?.status === 'approved').length}/{mockCollections.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
