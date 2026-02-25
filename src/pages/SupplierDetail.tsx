/**
 * SupplierDetail - Full supplier detail page
 * Shows comprehensive supplier information including scores, contacts, certifications, and linked styles
 */

import { useMemo, useEffect } from 'react';
import { tagScreen } from '@/utils/clarityTracking';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Factory, Mail, Phone, Calendar, Award, Package, FileText, Send, ExternalLink, TrendingUp, TrendingDown, AlertTriangle, Building2 } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SupplierTierBadge } from '@/components/suppliers/SupplierTierBadge';
import { SupplierComplianceBadge } from '@/components/suppliers/SupplierComplianceBadge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { getSupplierById, getSupplierTasks, getLinkedStyles } from '@/data/mockSuppliers';

const SupplierDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => { tagScreen('portal-supplier-detail'); }, []);

  const supplier = useMemo(() => getSupplierById(id || ''), [id]);
  const tasks = useMemo(() => getSupplierTasks(id || ''), [id]);
  const linkedStyles = useMemo(() => getLinkedStyles(id || ''), [id]);

  if (!supplier) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <h1 className="text-2xl font-bold mb-2">Supplier Not Found</h1>
          <p className="text-muted-foreground mb-4">The supplier you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/suppliers')}>Back to Suppliers</Button>
        </div>
      </AppLayout>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600';
    if (score >= 75) return 'text-amber-600';
    return 'text-red-600';
  };

  const handleSendQuestionnaire = () => {
    toast.success('Questionnaire invitation sent', {
      description: `Sent to ${supplier.primaryContact?.email}`,
    });
  };

  const recentTasks = tasks.slice(0, 5);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/suppliers')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <div className="flex items-start gap-4">
              <div className={cn(
                "w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold shrink-0",
                supplier.status === 'active' && "bg-emerald-100 text-emerald-700",
                supplier.status === 'at-risk' && "bg-amber-100 text-amber-700",
                supplier.status === 'inactive' && "bg-gray-100 text-gray-700"
              )}>
                {supplier.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">{supplier.name}</h1>
                <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {supplier.city ? `${supplier.city}, ${supplier.country}` : supplier.country}
                  <span className="text-muted-foreground">•</span>
                  <span className="text-sm">{supplier.code}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <SupplierTierBadge tier={supplier.tier} />
                  <SupplierComplianceBadge status={supplier.complianceStatus} />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2" onClick={handleSendQuestionnaire}>
                  <Send className="w-4 h-4" />
                  Send Questionnaire
                </Button>
                <Button variant="outline" className="gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Request Documents
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Score Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className={cn("text-3xl font-bold", getScoreColor(supplier.overallScore))}>
                {supplier.overallScore}%
              </p>
              <p className="text-sm text-muted-foreground">Overall Score</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className={cn("text-3xl font-bold", getScoreColor(supplier.complianceScore))}>
                {supplier.complianceScore}%
              </p>
              <p className="text-sm text-muted-foreground">Compliance</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className={cn("text-3xl font-bold", getScoreColor(supplier.qualityScore))}>
                {supplier.qualityScore}%
              </p>
              <p className="text-sm text-muted-foreground">Quality</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className={cn("text-3xl font-bold", getScoreColor(supplier.deliveryScore))}>
                {supplier.deliveryScore}%
              </p>
              <p className="text-sm text-muted-foreground">Delivery</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="styles">Linked Styles ({linkedStyles.length})</TabsTrigger>
            <TabsTrigger value="tasks">Tasks ({tasks.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Activity Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                      <Package className="w-5 h-5 text-violet-600" />
                      <div>
                        <p className="text-lg font-bold">{supplier.activeStyles}</p>
                        <p className="text-xs text-muted-foreground">Active Styles</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-lg font-bold">{supplier.openTRFs}</p>
                        <p className="text-xs text-muted-foreground">Open TRFs</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                      <Factory className="w-5 h-5 text-slate-600" />
                      <div>
                        <p className="text-lg font-bold">{supplier.factoryCount}</p>
                        <p className="text-xs text-muted-foreground">Factories</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Pass Rate</span>
                      <span className="font-medium">{supplier.passRate}%</span>
                    </div>
                    <Progress value={supplier.passRate} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Audit Schedule */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Audit Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {supplier.lastAuditDate && (
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                      <span className="text-muted-foreground">Last Audit</span>
                      <span className="font-medium">{new Date(supplier.lastAuditDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  {supplier.nextAuditDate && (
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                      <span className="text-muted-foreground">Next Audit</span>
                      <span className="font-medium">{new Date(supplier.nextAuditDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  {supplier.onboardedAt && (
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                      <span className="text-muted-foreground">Onboarded</span>
                      <span className="font-medium">{new Date(supplier.onboardedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Specializations */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Specializations</CardTitle>
                </CardHeader>
                <CardContent>
                  {supplier.specializations.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {supplier.specializations.map((spec) => (
                        <Badge key={spec.id} variant="secondary" className="gap-1">
                          {spec.name}
                          <span className="text-xs text-muted-foreground">({spec.category})</span>
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No specializations defined</p>
                  )}
                </CardContent>
              </Card>

              {/* Recent Tasks */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  {recentTasks.length > 0 ? (
                    <div className="space-y-3">
                      {recentTasks.map((task) => (
                        <div key={task.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{task.title}</p>
                            <p className="text-xs text-muted-foreground">Due {new Date(task.dueDate).toLocaleDateString()}</p>
                          </div>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              'text-xs ml-2',
                              task.status === 'pending' && 'bg-slate-100 text-slate-700',
                              task.status === 'in_progress' && 'bg-blue-100 text-blue-700',
                              task.status === 'completed' && 'bg-emerald-100 text-emerald-700',
                              task.status === 'overdue' && 'bg-red-100 text-red-700',
                            )}
                          >
                            {task.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No recent tasks</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="certifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Certifications ({supplier.certifications.length})
                </CardTitle>
                <CardDescription>
                  {supplier.certificatesExpiring > 0 && (
                    <span className="text-amber-600">{supplier.certificatesExpiring} certification(s) expiring soon</span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {supplier.certifications.length > 0 ? (
                  <div className="space-y-3">
                    {supplier.certifications.map((cert) => (
                      <div key={cert.id} className="flex items-center justify-between p-4 rounded-lg border">
                        <div>
                          <p className="font-medium">{cert.name}</p>
                          <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Issued: {new Date(cert.issuedDate).toLocaleDateString()} • 
                            Expires: {new Date(cert.expiryDate).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={cn(
                            'text-sm',
                            cert.status === 'valid' && 'bg-emerald-100 text-emerald-700 border-emerald-200',
                            cert.status === 'expiring_soon' && 'bg-amber-100 text-amber-700 border-amber-200',
                            cert.status === 'expired' && 'bg-red-100 text-red-700 border-red-200',
                          )}
                        >
                          {cert.status === 'valid' ? 'Valid' : cert.status === 'expiring_soon' ? 'Expiring Soon' : 'Expired'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No certifications on file</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contacts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Contacts ({supplier.contacts.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {supplier.contacts.map((contact) => (
                    <div key={contact.id} className="flex items-start justify-between p-4 rounded-lg border">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{contact.name}</p>
                          {contact.isPrimary && (
                            <Badge variant="secondary" className="text-xs">Primary</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{contact.role}</p>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <a href={`mailto:${contact.email}`} className="text-primary hover:underline">
                            {contact.email}
                          </a>
                        </div>
                        {contact.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            {contact.phone}
                          </div>
                        )}
                      </div>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Send className="w-3 h-3" />
                        Email
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="styles" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Linked Styles ({linkedStyles.length})</CardTitle>
                <CardDescription>Styles associated with this supplier</CardDescription>
              </CardHeader>
              <CardContent>
                {linkedStyles.length > 0 ? (
                  <div className="space-y-3">
                    {linkedStyles.map((style) => (
                      <div 
                        key={style.id} 
                        className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 cursor-pointer"
                        onClick={() => navigate(`/styles/${style.id}`)}
                      >
                        <div>
                          <p className="font-medium">{style.name}</p>
                          <p className="text-sm text-muted-foreground">{style.season} • {style.brand}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{style.status.replace('_', ' ')}</Badge>
                          <ExternalLink className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No styles linked to this supplier</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Tasks ({tasks.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {tasks.length > 0 ? (
                  <div className="space-y-3">
                    {tasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex-1">
                          <p className="font-medium">{task.title}</p>
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                            {task.assignee && ` • Assigned to: ${task.assignee}`}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="outline" 
                            className={cn(
                              task.priority === 'urgent' && 'bg-red-100 text-red-700',
                              task.priority === 'high' && 'bg-orange-100 text-orange-700',
                              task.priority === 'normal' && 'bg-blue-100 text-blue-700',
                              task.priority === 'low' && 'bg-slate-100 text-slate-600',
                            )}
                          >
                            {task.priority}
                          </Badge>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              task.status === 'pending' && 'bg-slate-100 text-slate-700',
                              task.status === 'in_progress' && 'bg-blue-100 text-blue-700',
                              task.status === 'completed' && 'bg-emerald-100 text-emerald-700',
                              task.status === 'overdue' && 'bg-red-100 text-red-700',
                            )}
                          >
                            {task.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No tasks for this supplier</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default SupplierDetail;
