import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Factory, FileText, Upload, Clock, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';
import { mockTRFs } from '@/data/mockData';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function SupplierDashboardWidget() {
  // For supplier view, show their TRFs and pending actions
  const supplierTRFs = mockTRFs.filter(t => t.supplier === 'Textile Supplier Ltd');
  const pendingUploads = 2;
  const pendingApprovals = supplierTRFs.filter(t => t.status === 'pending_review').length;
  
  return (
    <Card className="border-2 border-ai-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Factory className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Your Submission Status</CardTitle>
              <p className="text-xs text-muted-foreground">
                Track your TRFs and compliance requirements
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Summary */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
            <p className="text-lg font-bold text-emerald-700">3</p>
            <p className="text-xs text-emerald-600">Approved</p>
          </div>
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-center">
            <Clock className="w-5 h-5 text-amber-600 mx-auto mb-1" />
            <p className="text-lg font-bold text-amber-700">{pendingApprovals}</p>
            <p className="text-xs text-amber-600">In Review</p>
          </div>
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-center">
            <AlertTriangle className="w-5 h-5 text-red-600 mx-auto mb-1" />
            <p className="text-lg font-bold text-red-700">{pendingUploads}</p>
            <p className="text-xs text-red-600">Action Needed</p>
          </div>
        </div>
        
        {/* Pending Actions */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Required Actions</h4>
          
          <div className="p-3 rounded-lg border border-amber-200 bg-amber-50/50 flex items-center gap-3">
            <Upload className="w-5 h-5 text-amber-600 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium">Upload Certificate of Analysis</p>
              <p className="text-xs text-muted-foreground">Required for TRF-2026-001234</p>
            </div>
            <Button size="sm" variant="outline">
              Upload
            </Button>
          </div>
          
          <div className="p-3 rounded-lg border border-amber-200 bg-amber-50/50 flex items-center gap-3">
            <FileText className="w-5 h-5 text-amber-600 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium">Complete Supplier Questionnaire</p>
              <p className="text-xs text-muted-foreground">Annual compliance update required</p>
            </div>
            <Button size="sm" variant="outline">
              Start
            </Button>
          </div>
        </div>
        
        <Button variant="outline" className="w-full" asChild>
          <Link to="/trfs">
            View All Submissions
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
