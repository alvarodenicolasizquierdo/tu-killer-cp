import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, BarChart3, Users, Package, FileText } from 'lucide-react';
import { managerKPIs } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { LastUpdatedTimestamp } from '@/components/compliance/LastUpdatedTimestamp';
import { AIConfidenceMetadata } from '@/components/compliance/AIConfidenceMetadata';

export function ConfidenceDashboardWidget() {
  const overallConfidence = 87;
  const trend = 'up';
  
  return (
    <Card className="border-2 border-ai-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Executive Confidence Dashboard</CardTitle>
              <p className="text-xs text-muted-foreground">
                Real-time operational health overview
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <span className="text-2xl font-bold">{overallConfidence}%</span>
              <AIConfidenceMetadata confidence={overallConfidence} dataSource="Real-time operational metrics" sampleSize={312} />
            </div>
            {trend === 'up' ? (
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-500" />
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* KPI Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {managerKPIs.map((kpi) => (
            <div 
              key={kpi.label}
              className={cn(
                "p-3 rounded-lg border",
                kpi.status === 'critical' && "border-red-200 bg-red-50/50",
                kpi.status === 'at-risk' && "border-amber-200 bg-amber-50/30",
                kpi.status === 'on-track' && "border-emerald-200 bg-emerald-50/30"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">{kpi.label}</span>
                {kpi.status === 'critical' && <AlertTriangle className="w-3 h-3 text-red-500" />}
                {kpi.status === 'on-track' && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold">{kpi.value}</span>
                {kpi.change && (
                  <span className={cn(
                    "text-xs",
                    kpi.changeDirection === 'up' ? "text-emerald-600" : "text-red-600"
                  )}>
                    {kpi.changeDirection === 'up' ? '+' : '-'}{Math.abs(kpi.change)}%
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Quick Stats Row */}
        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">12 Active Suppliers</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Package className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">156 Products</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">24 Open TRFs</span>
            </div>
          </div>
          {/* FIX 9 [NEW]: Last-updated timestamp */}
          <LastUpdatedTimestamp />
        </div>
      </CardContent>
    </Card>
  );
}
