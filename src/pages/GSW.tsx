import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  FileCheck, 
  Upload, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Search,
  Package,
  User,
  History,
  Download
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AIAssistPanel } from '@/components/ai/AIAssistPanel';
import { mockCollections } from '@/data/stylesData';
import { cn } from '@/lib/utils';
import { AIAssistSuggestion } from '@/types/styles';
import { Link } from 'react-router-dom';

export default function GSW() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filter collections by GSW status
  const collectionsWithGSW = useMemo(() => {
    return mockCollections.filter(c => 
      c.gswSubmission || c.status === 'gsw_pending' || c.status === 'approved'
    ).filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.supplierName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || 
        (c.gswSubmission?.status === statusFilter) ||
        (statusFilter === 'pending' && c.status === 'gsw_pending' && !c.gswSubmission);
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  // Stats
  const stats = useMemo(() => ({
    total: mockCollections.filter(c => c.status === 'gsw_pending' || c.status === 'approved').length,
    approved: mockCollections.filter(c => c.gswSubmission?.status === 'approved').length,
    pending: mockCollections.filter(c => c.status === 'gsw_pending' && !c.gswSubmission).length,
    submitted: mockCollections.filter(c => c.gswSubmission?.status === 'submitted').length,
    uploaded: mockCollections.filter(c => c.gswSubmission?.status === 'uploaded').length
  }), []);

  // AI suggestions
  const aiSuggestions: AIAssistSuggestion[] = useMemo(() => {
    const suggestions: AIAssistSuggestion[] = [];

    if (stats.pending > 0) {
      suggestions.push({
        id: 'gsw-pending',
        type: 'gsw_tech',
        title: `${stats.pending} collection(s) need GSW upload`,
        description: 'All testing passed - ready for GSW submission',
        confidence: 100,
        reasoning: [
          'Testing levels have been approved',
          'Care labels are complete',
          'Upload GSW to proceed to final approval'
        ]
      });
    }

    if (stats.uploaded > 0) {
      suggestions.push({
        id: 'gsw-uploaded',
        type: 'gsw_tech',
        title: `${stats.uploaded} GSW ready to submit`,
        description: 'Select garment tech and submit for approval',
        confidence: 92,
        reasoning: [
          'GSW files have been uploaded',
          'AI can suggest the best garment tech based on category',
          'Average approval time: 1.2 days'
        ],
        action: { label: 'Review & Submit', type: 'apply' }
      });
    }

    // Garment tech suggestion
    suggestions.push({
      id: 'tech-suggest',
      type: 'gsw_tech',
      title: 'Recommended: Jennifer Wu',
      description: 'Best garment tech for your pending submissions',
      confidence: 88,
      reasoning: [
        'Handles 45% of activewear category approvals',
        '94% first-pass approval rate',
        'Current workload: 3 pending reviews'
      ],
      action: { label: 'Assign', type: 'apply' }
    });

    return suggestions;
  }, [stats]);

  const getStatusBadge = (status?: string) => {
    if (!status) return 'bg-muted text-muted-foreground';
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-700',
      uploaded: 'bg-blue-100 text-blue-700',
      submitted: 'bg-indigo-100 text-indigo-700',
      approved: 'bg-emerald-100 text-emerald-700',
      rejected: 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-muted text-muted-foreground';
  };

  return (
    <AppLayout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Gold Seal Workbook (GSW)</h1>
        <p className="text-muted-foreground">Upload and track GSW submissions for final approval</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileCheck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
                <p className="text-xs text-muted-foreground">Need Upload</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Upload className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{stats.uploaded}</p>
                <p className="text-xs text-muted-foreground">Uploaded</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                <Send className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-indigo-600">{stats.submitted}</p>
                <p className="text-xs text-muted-foreground">Submitted</p>
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
                    placeholder="Search collections..."
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
                    <SelectItem value="pending">Need Upload</SelectItem>
                    <SelectItem value="uploaded">Uploaded</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Collections */}
          <div className="space-y-3">
            {collectionsWithGSW.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-1">No GSW submissions found</h3>
                  <p className="text-sm text-muted-foreground">
                    Collections will appear here when they complete testing
                  </p>
                </CardContent>
              </Card>
            ) : (
              collectionsWithGSW.map((collection, index) => (
                <motion.div
                  key={collection.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-md transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <Package className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{collection.name}</h3>
                            <p className="text-xs text-muted-foreground">
                              {collection.supplierName} • {collection.season}
                            </p>
                          </div>
                        </div>
                        <Badge className={getStatusBadge(collection.gswSubmission?.status || (collection.status === 'gsw_pending' ? 'pending' : undefined))}>
                          {collection.gswSubmission?.status || 'Pending Upload'}
                        </Badge>
                      </div>

                      {collection.gswSubmission ? (
                        <div className="mt-4 space-y-3">
                          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-3">
                              <FileCheck className="w-5 h-5 text-primary" />
                              <div>
                                <p className="font-medium text-sm">{collection.gswSubmission.fileName}</p>
                                <p className="text-xs text-muted-foreground">
                                  v{collection.gswSubmission.version} • {collection.gswSubmission.fileSize}
                                </p>
                              </div>
                            </div>
                            <Button size="sm" variant="ghost">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>

                          {collection.gswSubmission.submittedTo && (
                            <div className="flex items-center gap-2 text-sm">
                              <User className="w-4 h-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Submitted to:</span>
                              <span>{collection.gswSubmission.submittedTo}</span>
                            </div>
                          )}

                          {collection.gswSubmission.status === 'uploaded' && (
                            <Button className="w-full gap-2">
                              <Send className="w-4 h-4" />
                              Submit for Approval
                            </Button>
                          )}
                        </div>
                      ) : (
                        <div className="mt-4">
                          <Button variant="outline" className="w-full gap-2">
                            <Upload className="w-4 h-4" />
                            Upload GSW File
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* AI Assist Panel */}
        <div className="space-y-4">
          <AIAssistPanel
            suggestions={aiSuggestions}
            context="GSW Coach"
            onApplySuggestion={(s) => console.log('Applied:', s)}
            onDismissSuggestion={(s) => console.log('Dismissed:', s)}
          />

          {/* Garment Techs */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Garment Technicians</CardTitle>
              <CardDescription>Available for GSW review</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                    JW
                  </div>
                  <div>
                    <p className="text-sm font-medium">Jennifer Wu</p>
                    <p className="text-xs text-muted-foreground">3 pending</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700">94%</Badge>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                    MK
                  </div>
                  <div>
                    <p className="text-sm font-medium">Michael Kim</p>
                    <p className="text-xs text-muted-foreground">5 pending</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700">91%</Badge>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                    SL
                  </div>
                  <div>
                    <p className="text-sm font-medium">Sandra Lee</p>
                    <p className="text-xs text-muted-foreground">2 pending</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700">89%</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Completion Rate */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">GSW Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>This Month</span>
                  <span className="font-medium">{Math.round((stats.approved / Math.max(stats.total, 1)) * 100)}%</span>
                </div>
                <Progress value={(stats.approved / Math.max(stats.total, 1)) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
