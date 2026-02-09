import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { mockTRFs } from '@/data/mockData';
import { TRFStatus, Priority } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { TRFTimeline } from '@/components/trf/TRFTimeline';
import { TRFTestResults } from '@/components/trf/TRFTestResults';
import { TRFDocuments } from '@/components/trf/TRFDocuments';
import { TRFApprovalWorkflow } from '@/components/trf/TRFApprovalWorkflow';
import { AIAssessmentStrip } from '@/components/ai/AIAssessmentStrip';
import { 
  ArrowLeft, 
  ChevronDown,
  Clock,
  Building2,
  Factory,
  Package,
  FileText,
  TestTube,
  History,
  CheckSquare,
  AlertTriangle,
  Calendar,
  User,
  ExternalLink,
  Printer,
  Share2,
  Home
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useState } from 'react';

const statusConfig: Record<TRFStatus, { label: string; color: string }> = {
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700 border-gray-200' },
  submitted: { label: 'Submitted', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  pending_review: { label: 'Pending Review', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  approved: { label: 'Approved', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700 border-red-200' },
  completed: { label: 'Completed', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
};

const priorityConfig: Record<Priority, { label: string; color: string }> = {
  critical: { label: 'Critical', color: 'bg-red-500' },
  'at-risk': { label: 'At Risk', color: 'bg-amber-500' },
  'on-track': { label: 'On Track', color: 'bg-emerald-500' },
  info: { label: 'Info', color: 'bg-blue-500' },
};

interface CollapsibleSectionProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  defaultOpen?: boolean;
  badge?: string;
  children: React.ReactNode;
}

function CollapsibleSection({ title, icon: Icon, defaultOpen = true, badge, children }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card>
        <CollapsibleTrigger className="w-full">
          <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-muted-foreground" />
                <CardTitle className="text-base tracking-[-0.01em]">{title}</CardTitle>
                {badge && (
                  <Badge variant="secondary" className="text-xs">
                    {badge}
                  </Badge>
                )}
              </div>
              <ChevronDown className={cn(
                "w-4 h-4 text-muted-foreground transition-transform duration-200",
                isOpen && "rotate-180"
              )} />
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">
            {children}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

export default function TRFDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find TRF by ID - handle both 'trf-001' format and URL format
  const trf = mockTRFs.find(t => t.id === id || t.id === `trf-${id?.replace('trf-', '')}`);

  if (!trf) {
    return (
      <AppLayout title="TRF Not Found">
        <div className="flex flex-col items-center justify-center py-16">
          <AlertTriangle className="w-12 h-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">TRF Not Found</h2>
          <p className="text-muted-foreground mb-4">The requested TRF could not be found.</p>
          <Button onClick={() => navigate('/trfs')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to TRFs
          </Button>
        </div>
      </AppLayout>
    );
  }

  const status = statusConfig[trf.status];
  const priority = priorityConfig[trf.priority];

  // Use detailed data if available, otherwise use defaults
  const timeline = trf.timeline || [];
  const tests = trf.tests || [];
  const documents = trf.documents || [];

  return (
    <AppLayout 
      title={trf.reference}
      subtitle={trf.productName}
    >
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
              <Link to="/trfs">TRFs</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{trf.reference}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Back button and actions */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/trfs')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to TRFs
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <ExternalLink className="w-4 h-4 mr-2" />
            Open in Portal
          </Button>
        </div>
      </div>

      {/* AI Assessment Strip */}
      <AIAssessmentStrip
        assessment={{
          objectType: 'trf',
          objectId: trf.id,
          readiness: trf.progress,
          readinessTrend: trf.progress >= 80 ? 'up' : trf.progress >= 50 ? 'stable' : 'down',
          confidence: trf.failedTests === 0 && trf.passedTests > 0 
            ? 'high' 
            : trf.failedTests > 0 
              ? 'low' 
              : 'medium',
          primaryRisk: trf.failedTests > 0
            ? `${trf.failedTests} test(s) failed - requires attention`
            : trf.slaRemaining && trf.slaRemaining <= 24
              ? 'SLA deadline approaching'
              : trf.status === 'pending_review'
                ? 'Awaiting approval review'
                : 'No critical issues detected',
          recommendation: trf.failedTests > 0
            ? 'Review failed tests and initiate retest protocol'
            : trf.slaRemaining && trf.slaRemaining <= 24
              ? 'Prioritize completion to meet SLA deadline'
              : trf.status === 'pending_review'
                ? 'Submit for final approval to complete workflow'
                : `Continue testing - ${trf.testCount - trf.passedTests - trf.failedTests} tests remaining`,
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main content - 2 columns */}
        <div className="lg:col-span-2 space-y-5">
          {/* Header Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className={cn("gap-1", status.color)}>
                        {status.label}
                      </Badge>
                      <div className={cn("w-2 h-2 rounded-full", priority.color)} />
                      <span className="text-xs text-muted-foreground">{priority.label}</span>
                    </div>
                    <h1 className="text-xl font-semibold tracking-[-0.02em]">{trf.productName}</h1>
                    {trf.description && (
                      <p className="text-sm text-muted-foreground mt-1">{trf.description}</p>
                    )}
                  </div>
                  {trf.slaRemaining && trf.slaRemaining <= 48 && (
                    <Badge variant="destructive" className="animate-pulse">
                      <Clock className="w-3 h-3 mr-1" />
                      {trf.slaRemaining}h SLA
                    </Badge>
                  )}
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Testing Progress</span>
                    <span className="font-medium">{trf.progress}%</span>
                  </div>
                  <Progress value={trf.progress} className="h-2" />
                </div>

                {/* Meta grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Supplier</p>
                      <p className="text-sm font-medium">{trf.supplier}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Factory className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Factory</p>
                      <p className="text-sm font-medium">{trf.factory}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Due Date</p>
                      <p className="text-sm font-medium">{format(new Date(trf.dueDate), 'MMM d, yyyy')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Assignee</p>
                      <p className="text-sm font-medium">{trf.assignee || 'Unassigned'}</p>
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Additional info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-sm">
                  <div>
                    <p className="text-muted-foreground">Product Code</p>
                    <p className="font-mono">{trf.productCode || '—'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Lot Number</p>
                    <p className="font-mono">{trf.lotNumber || '—'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Sample Count</p>
                    <p>{trf.sampleCount || '—'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Category</p>
                    <p>{trf.category}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Test Results */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <CollapsibleSection 
              title="Test Results" 
              icon={TestTube}
              badge={`${trf.passedTests}/${trf.testCount} passed`}
            >
              {tests.length > 0 ? (
                <TRFTestResults tests={tests} />
              ) : (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No test results available yet.
                </p>
              )}
            </CollapsibleSection>
          </motion.div>

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <CollapsibleSection 
              title="Activity Timeline" 
              icon={History}
              badge={`${timeline.length} events`}
            >
              {timeline.length > 0 ? (
                <TRFTimeline events={timeline} />
              ) : (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No timeline events available.
                </p>
              )}
            </CollapsibleSection>
          </motion.div>

          {/* Documents */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <CollapsibleSection 
              title="Documents" 
              icon={FileText}
              badge={`${documents.length} files`}
              defaultOpen={false}
            >
              {documents.length > 0 ? (
                <TRFDocuments documents={documents} />
              ) : (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No documents uploaded yet.
                </p>
              )}
            </CollapsibleSection>
          </motion.div>
        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-5">
          {/* Approval Workflow */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-muted-foreground" />
                  <CardTitle className="text-base tracking-[-0.01em]">Approval Workflow</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <TRFApprovalWorkflow trf={trf} />
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-base tracking-[-0.01em]">Test Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Tests</span>
                    <span className="font-medium">{trf.testCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-emerald-600">Passed</span>
                    <span className="font-medium text-emerald-600">{trf.passedTests}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-red-600">Failed</span>
                    <span className="font-medium text-red-600">{trf.failedTests}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Pending</span>
                    <span className="font-medium">{trf.testCount - trf.passedTests - trf.failedTests}</span>
                  </div>
                  {trf.riskScore !== undefined && (
                    <>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Risk Score</span>
                        <Badge variant={trf.riskScore > 70 ? "destructive" : trf.riskScore > 40 ? "secondary" : "outline"}>
                          {trf.riskScore}%
                        </Badge>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Related TRFs */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-base tracking-[-0.01em]">Related TRFs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mockTRFs
                    .filter(t => t.id !== trf.id && t.supplier === trf.supplier)
                    .slice(0, 3)
                    .map(relatedTrf => (
                      <Button
                        key={relatedTrf.id}
                        variant="ghost"
                        className="w-full justify-start h-auto py-2"
                        onClick={() => navigate(`/trfs/${relatedTrf.id}`)}
                      >
                        <div className="text-left">
                          <p className="text-sm font-medium">{relatedTrf.reference}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {relatedTrf.productName}
                          </p>
                        </div>
                      </Button>
                    ))}
                  {mockTRFs.filter(t => t.id !== trf.id && t.supplier === trf.supplier).length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-2">
                      No related TRFs found
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
