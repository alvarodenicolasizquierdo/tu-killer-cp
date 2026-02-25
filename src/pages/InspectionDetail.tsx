import { useState, useMemo, useEffect } from 'react';
import { tagScreen, tagEvent } from '@/utils/clarityTracking';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import {
  ArrowLeft, MapPin, Clock, User, Building2, Calendar, Users, 
  CheckCircle2, AlertTriangle, XCircle, Loader2, Camera, FileText,
  ClipboardCheck, AlertCircle, Shield, Leaf, Package, ChevronDown,
  ChevronRight, Plus, Image as ImageIcon, Home
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
import { motion, AnimatePresence } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { getInspectionDetail, mockInspectionDetails } from '@/data/inspectionDetailData';
import { mockInspections } from '@/data/mockData';
import { InspectionFinding, CorrectiveAction, InspectionChecklist } from '@/types/inspection';
import { InspectionWorkflowProgress, InspectionDefectsSummary } from '@/components/inspection';

interface LocationState {
  fromFactoryId?: string;
  fromFactoryName?: string;
}

const InspectionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState | null;
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedChecklists, setExpandedChecklists] = useState<Set<string>>(new Set());

  useEffect(() => { tagScreen('portal-inspection-detail'); tagEvent('inspection_detail_view', id || 'unknown'); }, [id]);

  // Try to get extended data, fall back to basic inspection data
  const extendedInspection = id ? getInspectionDetail(id) : undefined;
  const basicInspection = mockInspections.find(i => i.id === id);
  
  const inspection = extendedInspection || (basicInspection ? {
    ...basicInspection,
    findings: [],
    photos: [],
    checklists: [],
  } : undefined);

  if (!inspection) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
          <AlertTriangle className="h-12 w-12 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Inspection Not Found</h2>
          <p className="text-muted-foreground">The inspection you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/inspections')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Inspections
          </Button>
        </div>
      </AppLayout>
    );
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'factory_audit': return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'quality_check': return 'bg-emerald-500/10 text-emerald-600 border-emerald-200';
      case 'social_compliance': return 'bg-purple-500/10 text-purple-600 border-purple-200';
      case 'environmental': return 'bg-green-500/10 text-green-600 border-green-200';
      case 'pre_shipment': return 'bg-amber-500/10 text-amber-600 border-amber-200';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'factory_audit': return 'Factory Audit';
      case 'quality_check': return 'Quality Check';
      case 'social_compliance': return 'Social Compliance';
      case 'environmental': return 'Environmental';
      case 'pre_shipment': return 'Pre-Shipment';
      default: return type;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'factory_audit': return Building2;
      case 'quality_check': return ClipboardCheck;
      case 'social_compliance': return Users;
      case 'environmental': return Leaf;
      case 'pre_shipment': return Package;
      default: return ClipboardCheck;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-200">Scheduled</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-200 flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin" />In Progress</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-200 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" />Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-200">Cancelled</Badge>;
      case 'postponed':
        return <Badge variant="outline" className="bg-muted text-muted-foreground">Postponed</Badge>;
      default:
        return null;
    }
  };

  const getSeverityBadge = (severity: InspectionFinding['severity']) => {
    switch (severity) {
      case 'critical':
        return <Badge className="bg-red-600 text-white">Critical</Badge>;
      case 'major':
        return <Badge className="bg-amber-600 text-white">Major</Badge>;
      case 'minor':
        return <Badge className="bg-blue-600 text-white">Minor</Badge>;
      case 'observation':
        return <Badge variant="outline">Observation</Badge>;
    }
  };

  const getFindingStatusBadge = (status: InspectionFinding['status']) => {
    switch (status) {
      case 'open':
        return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-200">Open</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-200">In Progress</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-200">Resolved</Badge>;
      case 'verified':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-200">Verified</Badge>;
    }
  };

  const getCategoryIcon = (category: InspectionFinding['category']) => {
    switch (category) {
      case 'safety': return Shield;
      case 'quality': return ClipboardCheck;
      case 'documentation': return FileText;
      case 'process': return Package;
      case 'environmental': return Leaf;
      case 'social': return Users;
      default: return AlertCircle;
    }
  };

  const getChecklistStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
      case 'fail': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'na': return <span className="text-xs text-muted-foreground font-medium">N/A</span>;
      default: return <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />;
    }
  };

  const toggleChecklist = (id: string) => {
    setExpandedChecklists(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const findings = inspection.findings || [];
  const photos = inspection.photos || [];
  const checklists = inspection.checklists || [];
  
  const findingStats = useMemo(() => ({
    total: findings.length,
    open: findings.filter(f => f.status === 'open').length,
    inProgress: findings.filter(f => f.status === 'in_progress').length,
    resolved: findings.filter(f => f.status === 'resolved' || f.status === 'verified').length,
    critical: findings.filter(f => f.severity === 'critical').length,
    major: findings.filter(f => f.severity === 'major').length,
  }), [findings]);

  const checklistStats = useMemo(() => {
    const allItems = checklists.flatMap(c => c.items);
    return {
      total: allItems.length,
      passed: allItems.filter(i => i.status === 'pass').length,
      failed: allItems.filter(i => i.status === 'fail').length,
      pending: allItems.filter(i => i.status === 'pending').length,
    };
  }, [checklists]);

  const TypeIcon = getTypeIcon(inspection.type);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Breadcrumb Navigation */}
        <Breadcrumb className="overflow-x-auto">
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
                <Link to="/inspections">Inspections</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {locationState?.fromFactoryName && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem className="hidden md:inline-flex">
                  <BreadcrumbLink 
                    className="cursor-pointer truncate max-w-[150px]"
                    onClick={() => navigate('/inspections', { 
                      state: { openFactoryId: locationState.fromFactoryId } 
                    })}
                  >
                    {locationState.fromFactoryName}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{inspection.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/inspections')}
              className="w-fit"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Inspections
            </Button>
            {locationState?.fromFactoryId && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/inspections', { 
                  state: { openFactoryId: locationState.fromFactoryId } 
                })}
                className="w-fit"
              >
                <Building2 className="h-4 w-4 mr-2" />
                Back to {locationState.fromFactoryName || 'Factory'}
              </Button>
            )}
          </div>

          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3 flex-wrap">
                <Badge variant="outline" className={getTypeColor(inspection.type)}>
                  <TypeIcon className="h-3.5 w-3.5 mr-1" />
                  {getTypeLabel(inspection.type)}
                </Badge>
                {getStatusBadge(inspection.status)}
                {inspection.priority === 'critical' && (
                  <Badge className="bg-red-600 text-white">High Priority</Badge>
                )}
              </div>
              <h1 className="text-2xl font-bold">{inspection.title}</h1>
              {inspection.description && (
                <p className="text-muted-foreground max-w-2xl">{inspection.description}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              {inspection.status !== 'completed' && (
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Finding
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Scheduled</p>
                  <p className="font-semibold">{format(parseISO(inspection.scheduledDate), 'MMM d, yyyy')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Findings</p>
                  <p className="font-semibold">{findingStats.total} ({findingStats.open} open)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <ClipboardCheck className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Checklist</p>
                  <p className="font-semibold">{checklistStats.passed}/{checklistStats.total} passed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Camera className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Photos</p>
                  <p className="font-semibold">{photos.length} uploaded</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="findings" className="relative">
              Findings
              {findingStats.open > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">
                  {findingStats.open}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="checklist">Checklist</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Workflow Progress */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Workflow Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <InspectionWorkflowProgress currentStatus={inspection.status} />
              </CardContent>
            </Card>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Details Card */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Inspection Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Factory</p>
                        <p className="font-medium">{inspection.factoryName}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="font-medium">{inspection.location}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Time & Duration</p>
                        <p className="font-medium">{inspection.scheduledTime || '09:00'} • {inspection.duration} hours</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Lead Auditor</p>
                        <p className="font-medium">{inspection.assignee || 'Unassigned'}</p>
                      </div>
                    </div>
                  </div>

                  {inspection.auditorTeam && inspection.auditorTeam.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Audit Team</p>
                        <div className="flex flex-wrap gap-2">
                          {inspection.auditorTeam.map((member, idx) => (
                            <Badge key={idx} variant="secondary">{member}</Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {inspection.summary && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Summary</p>
                        <p className="text-sm">{inspection.summary}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Pass Rate Card (for completed) */}
              {inspection.status === 'completed' && inspection.passRate !== undefined && (
                <Card>
                  <CardHeader>
                    <CardTitle>Results</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-emerald-600">{inspection.passRate}%</div>
                      <p className="text-sm text-muted-foreground">Overall Pass Rate</p>
                    </div>
                    <Progress value={inspection.passRate} className="h-3" />
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Findings Resolved</span>
                        <span className="font-medium">{findingStats.resolved}/{findingStats.total}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Critical Issues</span>
                        <span className={`font-medium ${findingStats.critical > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                          {findingStats.critical}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Major Issues</span>
                        <span className={`font-medium ${findingStats.major > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                          {findingStats.major}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Findings Summary (for non-completed) */}
              {inspection.status !== 'completed' && findingStats.total > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Findings Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Open</span>
                        <Badge variant="outline" className="bg-red-500/10 text-red-600">{findingStats.open}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">In Progress</span>
                        <Badge variant="outline" className="bg-amber-500/10 text-amber-600">{findingStats.inProgress}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Resolved</span>
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600">{findingStats.resolved}</Badge>
                      </div>
                    </div>
                    <Separator />
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setActiveTab('findings')}
                    >
                      View All Findings
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Findings Tab */}
          <TabsContent value="findings" className="mt-6">
            <div className="space-y-4">
              {findings.length === 0 ? (
                <Card className="p-12 text-center">
                  <CheckCircle2 className="h-12 w-12 mx-auto text-emerald-500 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Findings</h3>
                  <p className="text-muted-foreground mb-4">No issues have been recorded for this inspection.</p>
                  {inspection.status !== 'completed' && (
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Record Finding
                    </Button>
                  )}
                </Card>
              ) : (
                findings.map((finding) => {
                  const CategoryIcon = getCategoryIcon(finding.category);
                  return (
                    <motion.div
                      key={finding.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Card className={`
                        ${finding.severity === 'critical' ? 'border-l-4 border-l-red-500' : ''}
                        ${finding.severity === 'major' ? 'border-l-4 border-l-amber-500' : ''}
                        ${finding.severity === 'minor' ? 'border-l-4 border-l-blue-500' : ''}
                      `}>
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3">
                              <div className="p-2 rounded-lg bg-muted">
                                <CategoryIcon className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <div>
                                <CardTitle className="text-base">{finding.title}</CardTitle>
                                <CardDescription className="mt-1">
                                  {finding.location && `📍 ${finding.location}`}
                                </CardDescription>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {getSeverityBadge(finding.severity)}
                              {getFindingStatusBadge(finding.status)}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-sm text-muted-foreground">{finding.description}</p>

                          {finding.correctiveAction && (
                            <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-sm">Corrective Action</h4>
                                <Badge 
                                  variant="outline"
                                  className={
                                    finding.correctiveAction.status === 'completed' 
                                      ? 'bg-emerald-500/10 text-emerald-600' 
                                      : finding.correctiveAction.status === 'overdue'
                                      ? 'bg-red-500/10 text-red-600'
                                      : 'bg-amber-500/10 text-amber-600'
                                  }
                                >
                                  {finding.correctiveAction.status.replace('_', ' ')}
                                </Badge>
                              </div>
                              <p className="text-sm">{finding.correctiveAction.description}</p>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <User className="h-3.5 w-3.5" />
                                  {finding.correctiveAction.assignee}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3.5 w-3.5" />
                                  Due: {format(parseISO(finding.correctiveAction.dueDate), 'MMM d, yyyy')}
                                </span>
                              </div>
                              {finding.correctiveAction.notes && (
                                <p className="text-sm text-muted-foreground italic">
                                  Note: {finding.correctiveAction.notes}
                                </p>
                              )}
                            </div>
                          )}

                          {!finding.correctiveAction && finding.status === 'open' && (
                            <Button variant="outline" size="sm">
                              <Plus className="h-4 w-4 mr-2" />
                              Add Corrective Action
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })
              )}
            </div>
          </TabsContent>

          {/* Checklist Tab */}
          <TabsContent value="checklist" className="mt-6">
            <div className="space-y-4">
              {checklists.length === 0 ? (
                <Card className="p-12 text-center">
                  <ClipboardCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Checklist Items</h3>
                  <p className="text-muted-foreground">No checklist has been configured for this inspection.</p>
                </Card>
              ) : (
                <>
                  {/* Progress Summary */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium">Overall Progress</span>
                        <span className="text-sm text-muted-foreground">
                          {checklistStats.passed + checklistStats.failed} of {checklistStats.total} items reviewed
                        </span>
                      </div>
                      <Progress 
                        value={((checklistStats.passed + checklistStats.failed) / checklistStats.total) * 100} 
                        className="h-2"
                      />
                      <div className="flex gap-4 mt-3 text-sm">
                        <span className="flex items-center gap-1.5 text-emerald-600">
                          <CheckCircle2 className="h-4 w-4" /> {checklistStats.passed} passed
                        </span>
                        <span className="flex items-center gap-1.5 text-red-600">
                          <XCircle className="h-4 w-4" /> {checklistStats.failed} failed
                        </span>
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" /> {checklistStats.pending} pending
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Checklist Categories */}
                  {checklists.map((checklist) => (
                    <Collapsible
                      key={checklist.id}
                      open={expandedChecklists.has(checklist.id)}
                      onOpenChange={() => toggleChecklist(checklist.id)}
                    >
                      <Card>
                        <CollapsibleTrigger asChild>
                          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <CardTitle className="text-base">{checklist.category}</CardTitle>
                                <Badge variant="secondary">
                                  {checklist.items.filter(i => i.status === 'pass').length}/{checklist.items.length}
                                </Badge>
                              </div>
                              {expandedChecklists.has(checklist.id) ? (
                                <ChevronDown className="h-5 w-5 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="h-5 w-5 text-muted-foreground" />
                              )}
                            </div>
                          </CardHeader>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <CardContent className="pt-0">
                            <div className="space-y-3">
                              {checklist.items.map((item) => (
                                <div 
                                  key={item.id}
                                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/30"
                                >
                                  <div className="mt-0.5">
                                    {getChecklistStatusIcon(item.status)}
                                  </div>
                                  <div className="flex-1">
                                    <p className={`text-sm ${item.status === 'fail' ? 'text-red-600' : ''}`}>
                                      {item.question}
                                    </p>
                                    {item.notes && (
                                      <p className="text-xs text-muted-foreground mt-1">{item.notes}</p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </CollapsibleContent>
                      </Card>
                    </Collapsible>
                  ))}
                </>
              )}
            </div>
          </TabsContent>

          {/* Photos Tab */}
          <TabsContent value="photos" className="mt-6">
            {photos.length === 0 ? (
              <Card className="p-12 text-center">
                <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Photos</h3>
                <p className="text-muted-foreground mb-4">No photos have been uploaded for this inspection.</p>
                {inspection.status !== 'completed' && (
                  <Button>
                    <Camera className="h-4 w-4 mr-2" />
                    Upload Photos
                  </Button>
                )}
              </Card>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {photos.map((photo) => (
                  <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    className="cursor-pointer"
                  >
                    <Card className="overflow-hidden">
                      <div className="aspect-square bg-muted relative">
                        <img 
                          src={photo.url} 
                          alt={photo.caption || 'Inspection photo'}
                          className="w-full h-full object-cover"
                        />
                        {photo.findingId && (
                          <Badge className="absolute top-2 right-2 bg-amber-600">
                            Finding
                          </Badge>
                        )}
                      </div>
                      <CardContent className="p-3">
                        {photo.caption && (
                          <p className="text-sm font-medium line-clamp-2">{photo.caption}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {photo.uploadedBy} • {format(parseISO(photo.uploadedAt), 'MMM d, h:mm a')}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default InspectionDetail;
