import { useState, useMemo, useEffect } from 'react';
import { tagScreen } from '@/utils/clarityTracking';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Package, 
  Layers, 
  TestTube2, 
  Tag, 
  FileCheck, 
  CheckCircle2,
  AlertTriangle,
  Clock,
  Lock,
  Unlock,
  Plus,
  Upload,
  Send,
  Brain,
  ChevronRight,
  ExternalLink,
  Info,
  Beaker,
  FlaskConical,
  Zap,
  Home
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { AIAssistPanel } from '@/components/ai/AIAssistPanel';
import { mockCollections, mockComponents, getCollectionStatusInfo, canUserApprove, careSymbols } from '@/data/stylesData';
import { cn } from '@/lib/utils';
import { useUser } from '@/contexts/UserContext';
import { AIAssistSuggestion, TestingLevel } from '@/types/styles';
import { generateTRFCreationSuggestions, generateTestPlanSuggestions } from '@/lib/aiTestPlanSuggestions';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ComponentAreaValidator, ComponentAreaSummary, getComponentTestingRequirement } from '@/components/validation/ComponentAreaValidator';
import { DisabledButtonHelp } from '@/components/help/InlineHelpTooltip';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export default function StyleDetail() {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useUser();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => { tagScreen('portal-style-detail'); }, []);

  const collection = useMemo(() => {
    return mockCollections.find(c => c.id === id);
  }, [id]);

  const linkedComponents = useMemo(() => {
    if (!collection) return [];
    return mockComponents.filter(c => collection.componentIds.includes(c.id));
  }, [collection]);

  // AI suggestions based on collection state
  const aiSuggestions: AIAssistSuggestion[] = useMemo(() => {
    if (!collection) return [];
    const suggestions: AIAssistSuggestion[] = [];

    // Determine next testing level needed
    let nextTestingLevel: TestingLevel = 'Base';
    if (collection.baseTesting.status === 'approved') {
      nextTestingLevel = 'Bulk';
    }
    if (collection.bulkTesting.status === 'approved') {
      nextTestingLevel = 'Garment';
    }

    // Get intelligent test plan suggestions
    const { tests, labs, confidence } = generateTestPlanSuggestions(
      collection, 
      nextTestingLevel, 
      linkedComponents
    );

    // Main test plan pre-fill suggestion
    if (tests.length > 0 && (
      collection.baseTesting.status === 'not_started' ||
      (collection.baseTesting.status === 'approved' && collection.bulkTesting.status === 'not_started') ||
      (collection.bulkTesting.status === 'approved' && collection.garmentTesting.status === 'not_started')
    )) {
      const requiredTests = tests.filter(t => t.priority === 'required');
      const fabricCount = linkedComponents.filter(c => c.type === 'Fabric').length;
      const trimCount = linkedComponents.filter(c => c.type === 'Trim').length;

      suggestions.push({
        id: `prefill-${nextTestingLevel.toLowerCase()}-tests`,
        type: 'test_plan',
        title: `Pre-fill ${nextTestingLevel} Test Plan`,
        description: `${requiredTests.length} tests recommended for ${collection.name}`,
        confidence,
        reasoning: [
          `Analyzed ${linkedComponents.length} components: ${fabricCount} fabric(s), ${trimCount} trim(s)`,
          `Construction type: ${linkedComponents[0]?.construction || 'Mixed'}`,
          `Department: ${collection.department} - specific requirements applied`,
          `Estimated turnaround: ${Math.max(...tests.map(t => t.estimatedDays))} days at ${labs[0]?.labName || 'recommended lab'}`
        ],
        suggestedValues: {
          tests: tests.map(t => ({
            name: t.testName,
            code: t.testCode,
            priority: t.priority
          })),
          lab: labs[0]?.labName
        },
        action: { label: 'Apply to TRF', type: 'apply' }
      });

      // Lab assignment suggestion
      if (labs.length > 0) {
        suggestions.push({
          id: 'lab-assignment',
          type: 'test_plan',
          title: `Assign to ${labs[0].labName}`,
          description: `${labs[0].matchScore}% capability match`,
          confidence: labs[0].matchScore,
          reasoning: [
            `Capabilities: ${labs[0].capabilities.join(', ')}`,
            `Turnaround: ${labs[0].turnaround}`,
            `Prior success with ${collection.supplierName}: 92%`
          ],
          action: { label: 'Select Lab', type: 'apply' }
        });
      }
    }

    // Component suggestions
    if (collection.componentIds.length < 3 && !collection.baseTesting.isLocked) {
      suggestions.push({
        id: 'add-components',
        type: 'component_set',
        title: 'Add recommended components',
        description: `Based on ${collection.department}, you may need additional components`,
        confidence: 78,
        reasoning: [
          `Similar ${collection.department} products typically have 3-5 components`,
          'Consider adding lining or trim components for completeness',
          'More components = better DPP passport coverage'
        ],
        action: { label: 'View Suggestions', type: 'apply' }
      });
    }

    // High area component warning
    const highAreaNonFabric = linkedComponents.filter(c => c.areaPercentage > 10 && c.type !== 'Fabric');
    if (highAreaNonFabric.length > 0) {
      suggestions.push({
        id: 'high-area-warning',
        type: 'approval_block',
        title: `High-area components need full testing`,
        description: `${highAreaNonFabric.length} non-fabric component(s) exceed 10% area`,
        confidence: 100,
        reasoning: highAreaNonFabric.map(c => 
          `${c.name} (${c.type}): ${c.areaPercentage}% area requires full testing per policy`
        )
      });
    }

    // Testing level gate warnings
    if (collection.baseTesting.status !== 'approved' && collection.status !== 'draft' && collection.status !== 'components_pending') {
      suggestions.push({
        id: 'base-gate',
        type: 'approval_block',
        title: 'Base approval required',
        description: 'Bulk and Garment testing are blocked until Base is approved',
        confidence: 100,
        reasoning: [
          'Base testing validates core component compliance',
          'Proceeding without Base approval increases rejection risk',
          'Current Base status: ' + collection.baseTesting.status
        ]
      });
    }

    // Care label suggestions
    if (!collection.careLabelPackage && collection.bulkTesting.status === 'approved') {
      const primaryFabric = linkedComponents.find(c => c.type === 'Fabric');
      const isCotton = primaryFabric?.composition.toLowerCase().includes('cotton');
      const isPolyester = primaryFabric?.composition.toLowerCase().includes('polyester');
      
      suggestions.push({
        id: 'care-label-suggest',
        type: 'care_label',
        title: 'Pre-fill care labels',
        description: 'AI suggests care symbols based on component materials',
        confidence: 89,
        reasoning: [
          `Primary material: ${primaryFabric?.composition || 'Not set'}`,
          isCotton ? 'Cotton composition: Standard wash at 30-40°C recommended' : 
          isPolyester ? 'Polyester composition: Low heat tumble dry safe' : 
          'Mixed materials: Conservative care instructions applied',
          'Care instructions affect consumer safety compliance'
        ],
        suggestedValues: {
          symbols: isCotton 
            ? ['wash-30', 'no-bleach', 'tumble-low', 'iron-med']
            : ['wash-40', 'no-bleach', 'tumble-low', 'iron-med']
        },
        action: { label: 'Apply Suggestions', type: 'apply' }
      });
    }

    // GSW guidance
    if (collection.status === 'gsw_pending' && !collection.gswSubmission?.submittedTo) {
      suggestions.push({
        id: 'gsw-tech',
        type: 'gsw_tech',
        title: 'Recommended Garment Tech',
        description: 'AI suggests the appropriate garment technician for GSW review',
        confidence: 91,
        reasoning: [
          `Department: ${collection.department}`,
          'Historical submissions to Jennifer Wu have 94% first-pass rate',
          'Current workload: 3 pending reviews'
        ],
        suggestedValues: {
          garmentTech: 'Jennifer Wu'
        },
        action: { label: 'Set Garment Tech', type: 'apply' }
      });
    }

    // Fast-track eligibility
    if (collection.riskScore < 25 && collection.supplierName.includes('Eco')) {
      suggestions.push({
        id: 'fast-track',
        type: 'test_plan',
        title: 'Eligible for Fast-Track Testing',
        description: 'Low risk + preferred supplier qualifies for expedited timeline',
        confidence: 92,
        reasoning: [
          `Risk score ${collection.riskScore} is below fast-track threshold (25)`,
          `${collection.supplierName} has 98% pass rate`,
          'Can reduce testing cycle by 3-5 days'
        ],
        suggestedValues: {
          fastTrack: true
        },
        action: { label: 'Enable Fast-Track', type: 'apply' }
      });
    }

    // Approval eligibility check
    const canApproveBase = canUserApprove(currentUser.id, 'base');
    
    if (collection.baseTesting.status === 'passed' && !canApproveBase) {
      suggestions.push({
        id: 'approval-block',
        type: 'approval_block',
        title: 'Approval permission required',
        description: 'Your entitlement level does not permit Base approval',
        confidence: 100,
        reasoning: [
          `Your level: ${currentUser.role === 'lab_technician' ? 'Bronze' : 'None'}`,
          'Base approval requires Silver or Gold level',
          'Route to Sarah Chen or Mark Richardson for approval'
        ]
      });
    }

    return suggestions;
  }, [collection, linkedComponents, currentUser]);

  if (!collection) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Package className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Collection not found</h2>
          <Link to="/styles">
            <Button variant="outline">Back to Styles</Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  const statusInfo = getCollectionStatusInfo(collection.status);
  const testingProgress = (() => {
    let completed = 0;
    if (collection.baseTesting.status === 'approved') completed++;
    if (collection.bulkTesting.status === 'approved') completed++;
    if (collection.garmentTesting.status === 'approved') completed++;
    return (completed / 3) * 100;
  })();

  const renderTestingLevelCard = (level: TestingLevel, state: typeof collection.baseTesting, isBlocked: boolean) => {
    const statusColors = {
      not_started: 'bg-muted text-muted-foreground',
      submitted: 'bg-blue-100 text-blue-700',
      in_progress: 'bg-indigo-100 text-indigo-700',
      passed: 'bg-amber-100 text-amber-700',
      failed: 'bg-red-100 text-red-700',
      approved: 'bg-emerald-100 text-emerald-700'
    };

    return (
      <Card className={cn(
        "relative overflow-hidden",
        isBlocked && "opacity-60"
      )}>
        {isBlocked && (
          <div className="absolute inset-0 bg-muted/50 flex items-center justify-center z-10">
            <div className="bg-background rounded-lg px-4 py-2 shadow-lg flex items-center gap-2">
              <Lock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Blocked by {level === 'Bulk' ? 'Base' : 'Bulk'} approval</span>
            </div>
          </div>
        )}
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TestTube2 className="w-5 h-5 text-primary" />
              <CardTitle className="text-base">{level} Testing</CardTitle>
            </div>
            <Badge className={statusColors[state.status]}>
              {state.status.replace('_', ' ')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {state.trfId && (
            <Link to={`/trfs/${state.trfId}`} className="flex items-center gap-2 text-sm text-primary hover:underline">
              <ExternalLink className="w-3.5 h-3.5" />
              View TRF: {state.trfId}
            </Link>
          )}
          {state.approvedAt && (
            <div className="text-sm">
              <span className="text-muted-foreground">Approved: </span>
              <span>{new Date(state.approvedAt).toLocaleDateString()}</span>
              <span className="text-muted-foreground"> by </span>
              <span>{state.approvedBy}</span>
            </div>
          )}
          {state.expiryDate && (
            <div className="text-sm">
              <span className="text-muted-foreground">Expires: </span>
              <span>{new Date(state.expiryDate).toLocaleDateString()}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {state.isLocked ? (
              <>
                <Lock className="w-3.5 h-3.5" />
                Components locked
              </>
            ) : (
              <>
                <Unlock className="w-3.5 h-3.5" />
                Components editable
              </>
            )}
          </div>
          {!isBlocked && state.status === 'not_started' && (
            <Button size="sm" className="w-full gap-2">
              <Plus className="w-4 h-4" />
              Create TRF
            </Button>
          )}
          {!isBlocked && state.status === 'passed' && (
            canUserApprove(currentUser.id, level.toLowerCase() as any) ? (
              <Button size="sm" className="w-full gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Approve {level}
              </Button>
            ) : (
              <DisabledButtonHelp
                reason={`Your approval level doesn't permit ${level} approval. Only users with ${level}-level approval permissions can approve at this stage.`}
                action="Contact your admin to request elevated permissions."
              >
                <Button size="sm" className="w-full gap-2" disabled>
                  <CheckCircle2 className="w-4 h-4" />
                  Approve {level}
                </Button>
              </DisabledButtonHelp>
            )
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <AppLayout>
      {/* Breadcrumb Navigation */}
      <Breadcrumb className="mb-4 overflow-x-auto">
        <BreadcrumbList className="flex-nowrap">
          <BreadcrumbItem className="hidden sm:inline-flex">
            <BreadcrumbLink asChild>
              <Link to="/" className="flex items-center gap-1">
                <Home className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Dashboard</span>
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden sm:block" />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/styles">Styles</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{collection.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Back Button */}
      <div className="mb-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/styles" className="inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Styles
          </Link>
        </Button>
      </div>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Package className="w-7 h-7 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-foreground">{collection.name}</h1>
              <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{collection.supplierName}</span>
              <span>•</span>
              <span>{collection.season}</span>
              <span>•</span>
              <span>{collection.department}</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <ExternalLink className="w-4 h-4" />
            Clone for Next Season
          </Button>
          {collection.status === 'gsw_pending' && (
            <Button className="gap-2 bg-gradient-to-r from-ai-primary to-ai-secondary">
              <Send className="w-4 h-4" />
              Submit GSW
            </Button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="flex items-center gap-6">
            <div className="flex-1">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-muted-foreground">{Math.round(testingProgress)}% complete</span>
              </div>
              <Progress value={testingProgress} className="h-2" />
            </div>
            <div className="flex gap-4 text-sm">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{collection.readinessScore}%</p>
                <p className="text-xs text-muted-foreground">Readiness</p>
              </div>
              <Separator orientation="vertical" className="h-12" />
              <div className="text-center">
                <p className={cn(
                  "text-2xl font-bold",
                  collection.riskScore > 50 ? "text-amber-600" : "text-emerald-600"
                )}>{collection.riskScore}</p>
                <p className="text-xs text-muted-foreground">Risk Score</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="components">Components ({linkedComponents.length})</TabsTrigger>
              <TabsTrigger value="testing">Testing Levels</TabsTrigger>
              <TabsTrigger value="care-labels">Care Labels</TabsTrigger>
              <TabsTrigger value="gsw">GSW</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* Quick Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Collection Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Brand</p>
                      <p className="font-medium">{collection.brand}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Department</p>
                      <p className="font-medium">{collection.department}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Supplier</p>
                      <p className="font-medium">{collection.supplierName}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Factories</p>
                      <p className="font-medium">{collection.factories.join(', ')}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Created</p>
                      <p className="font-medium">{new Date(collection.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Last Updated</p>
                      <p className="font-medium">{new Date(collection.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Testing Summary */}
              <div className="grid grid-cols-3 gap-4">
                {renderTestingLevelCard('Base', collection.baseTesting, false)}
                {renderTestingLevelCard('Bulk', collection.bulkTesting, collection.baseTesting.status !== 'approved')}
                {renderTestingLevelCard('Garment', collection.garmentTesting, collection.bulkTesting.status !== 'approved')}
              </div>
            </TabsContent>

            <TabsContent value="components" className="space-y-4">
              {/* Component Area Summary */}
              <ComponentAreaSummary components={linkedComponents} />

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">Linked Components</CardTitle>
                      <CardDescription>Components linked to this collection</CardDescription>
                    </div>
                    {collection.baseTesting.isLocked ? (
                      <DisabledButtonHelp
                        reason="Components are locked after Base approval to maintain testing integrity."
                        action="Create a new style version to modify components."
                      >
                        <Button size="sm" variant="outline" className="gap-2" disabled>
                          <Plus className="w-4 h-4" />
                          Link Component
                        </Button>
                      </DisabledButtonHelp>
                    ) : (
                      <Button size="sm" variant="outline" className="gap-2">
                        <Plus className="w-4 h-4" />
                        Link Component
                      </Button>
                    )}
                  </div>
                  {collection.baseTesting.isLocked && (
                    <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 rounded-md px-3 py-2 mt-2">
                      <Lock className="w-3.5 h-3.5" />
                      Components are locked after Base approval
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {linkedComponents.map((component) => {
                      const requirement = getComponentTestingRequirement(component);
                      const isOverThreshold = component.type !== 'Fabric' && component.areaPercentage > 10;
                      
                      return (
                        <div 
                          key={component.id}
                          className={cn(
                            "flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors",
                            isOverThreshold && "border-warning/30 bg-warning/5"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-10 h-10 rounded-lg flex items-center justify-center",
                              isOverThreshold ? "bg-warning/10" : "bg-primary/10"
                            )}>
                              <Layers className={cn(
                                "w-5 h-5",
                                isOverThreshold ? "text-warning" : "text-primary"
                              )} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{component.name}</p>
                                {isOverThreshold && (
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <AlertTriangle className="h-4 w-4 text-warning" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      Exceeds 10% area threshold - requires full testing
                                    </TooltipContent>
                                  </Tooltip>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {component.type} • {component.composition} • {component.construction}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <ComponentAreaValidator component={component} compact />
                            {requirement.requiresFullTesting && (
                              <Badge 
                                variant={isOverThreshold ? "destructive" : "outline"} 
                                className={cn(
                                  "text-xs",
                                  isOverThreshold && "bg-warning/10 text-warning border-warning/30 hover:bg-warning/20"
                                )}
                              >
                                Full Testing
                              </Badge>
                            )}
                            <Badge variant="secondary">{component.supplierName}</Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="testing" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {renderTestingLevelCard('Base', collection.baseTesting, false)}
                {renderTestingLevelCard('Bulk', collection.bulkTesting, collection.baseTesting.status !== 'approved')}
                {renderTestingLevelCard('Garment', collection.garmentTesting, collection.bulkTesting.status !== 'approved')}
              </div>
            </TabsContent>

            <TabsContent value="care-labels" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">Care Label Package</CardTitle>
                      <CardDescription>Care symbols and washing instructions</CardDescription>
                    </div>
                    {!collection.careLabelPackage && (
                      <Button size="sm" className="gap-2">
                        <Plus className="w-4 h-4" />
                        Create Care Labels
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {collection.careLabelPackage ? (
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium mb-2">Care Symbols</p>
                        <div className="flex gap-2">
                          {collection.careLabelPackage.symbols.map((symbol) => (
                            <Tooltip key={symbol.id}>
                              <TooltipTrigger>
                                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-xl">
                                  {symbol.icon}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>{symbol.description}</TooltipContent>
                            </Tooltip>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Care Wording</p>
                        <p className="text-sm text-muted-foreground">{collection.careLabelPackage.careWording}</p>
                      </div>
                      {collection.careLabelPackage.hangerSpec && (
                        <div>
                          <p className="text-sm font-medium mb-1">Hanger Spec</p>
                          <p className="text-sm text-muted-foreground">{collection.careLabelPackage.hangerSpec}</p>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        {collection.careLabelPackage.isComplete ? (
                          <Badge className="bg-emerald-100 text-emerald-700">Complete</Badge>
                        ) : (
                          <Badge className="bg-amber-100 text-amber-700">Incomplete</Badge>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Tag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No care labels configured yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="gsw" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">Gold Seal Workbook</CardTitle>
                      <CardDescription>Final approval documentation</CardDescription>
                    </div>
                    {!collection.gswSubmission && (
                      <Button size="sm" className="gap-2">
                        <Upload className="w-4 h-4" />
                        Upload GSW
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {collection.gswSubmission ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <FileCheck className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{collection.gswSubmission.fileName}</p>
                            <p className="text-xs text-muted-foreground">
                              v{collection.gswSubmission.version} • {collection.gswSubmission.fileSize}
                            </p>
                          </div>
                        </div>
                        <Badge className={cn(
                          collection.gswSubmission.status === 'approved' 
                            ? "bg-emerald-100 text-emerald-700"
                            : collection.gswSubmission.status === 'submitted'
                              ? "bg-blue-100 text-blue-700"
                              : "bg-muted text-muted-foreground"
                        )}>
                          {collection.gswSubmission.status}
                        </Badge>
                      </div>

                      {collection.gswSubmission.submittedTo && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Submitted to: </span>
                          <span>{collection.gswSubmission.submittedTo}</span>
                        </div>
                      )}

                      {/* Audit Trail */}
                      <div>
                        <p className="text-sm font-medium mb-2">Audit Trail</p>
                        <div className="space-y-2">
                          {collection.gswSubmission.auditTrail.map((event) => (
                            <div key={event.id} className="flex items-start gap-3 text-sm">
                              <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                              <div>
                                <p>{event.action}</p>
                                <p className="text-xs text-muted-foreground">
                                  {event.actor} • {new Date(event.timestamp).toLocaleString()}
                                </p>
                                {event.notes && (
                                  <p className="text-xs text-muted-foreground mt-1">{event.notes}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {collection.gswSubmission.status === 'uploaded' && (
                        <Button className="w-full gap-2">
                          <Send className="w-4 h-4" />
                          Submit for Approval
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-2">No GSW uploaded yet</p>
                      <p className="text-xs text-muted-foreground">
                        GSW can be uploaded after all testing levels are approved
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* AI Assist Panel */}
        <div className="space-y-4">
          <AIAssistPanel
            suggestions={aiSuggestions}
            context="Style Assistant"
            onApplySuggestion={(s) => console.log('Applied:', s)}
            onDismissSuggestion={(s) => console.log('Dismissed:', s)}
          />

          {/* DPP Passport Status */}
          {collection.dppPassportId && (
            <Card className="border-2 border-emerald-200 bg-emerald-50/50">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <CardTitle className="text-base text-emerald-700">DPP Passport Ready</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-emerald-600 mb-3">
                  All required evidence collected and verified
                </p>
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <ExternalLink className="w-4 h-4" />
                  View Passport
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
