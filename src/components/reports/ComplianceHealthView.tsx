/**
 * ComplianceHealthView - Compliance metrics and trends across categories
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { TrendingUp, TrendingDown, Minus, CheckCircle2, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { complianceMetrics, complianceTimeline } from '@/data/mockReports';

export function ComplianceHealthView() {
  const overallScore = Math.round(
    complianceMetrics.reduce((acc, m) => acc + m.score, 0) / complianceMetrics.length
  );

  const radarData = complianceMetrics.map(m => ({
    subject: m.category.split(' ')[0],
    score: m.score,
    fullMark: 100,
  }));

  return (
    <div className="space-y-6">
      {/* Overall Compliance Score */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-1">
          <CardContent className="p-6 flex flex-col items-center justify-center h-full">
            <ShieldCheck className="w-12 h-12 text-emerald-500 mb-4" />
            <p className="text-sm text-muted-foreground mb-2">Overall Compliance Score</p>
            <p className="text-5xl font-bold text-emerald-600">{overallScore}%</p>
            <div className="flex items-center gap-1 mt-2 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">+4% this quarter</span>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Compliance Score Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={complianceTimeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis domain={[70, 100]} tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value: number) => [`${value}%`, 'Score']}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="hsl(var(--chart-2))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--chart-2))', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Compliance by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {complianceMetrics.map((metric) => (
                <div key={metric.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{metric.category}</span>
                      {metric.trend === 'up' && (
                        <div className="flex items-center text-emerald-600">
                          <TrendingUp className="w-3 h-3" />
                          <span className="text-xs">+{metric.change}%</span>
                        </div>
                      )}
                      {metric.trend === 'down' && (
                        <div className="flex items-center text-destructive">
                          <TrendingDown className="w-3 h-3" />
                          <span className="text-xs">{metric.change}%</span>
                        </div>
                      )}
                      {metric.trend === 'stable' && (
                        <div className="flex items-center text-muted-foreground">
                          <Minus className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <span className={cn(
                      "font-bold",
                      metric.score >= 90 && "text-emerald-600",
                      metric.score >= 80 && metric.score < 90 && "text-amber-600",
                      metric.score < 80 && "text-destructive"
                    )}>
                      {metric.score}%
                    </span>
                  </div>
                  <Progress 
                    value={metric.score} 
                    className={cn(
                      "h-2",
                      metric.score >= 90 && "[&>div]:bg-emerald-500",
                      metric.score >= 80 && metric.score < 90 && "[&>div]:bg-amber-500",
                      metric.score < 80 && "[&>div]:bg-destructive"
                    )} 
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Compliance Radar</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="hsl(var(--chart-2))"
                  fill="hsl(var(--chart-2))"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              <div>
                <p className="text-2xl font-bold">42</p>
                <p className="text-sm text-muted-foreground">Compliant Suppliers</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                <span className="text-amber-600 font-bold">!</span>
              </div>
              <div>
                <p className="text-2xl font-bold">8</p>
                <p className="text-sm text-muted-foreground">Pending Review</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                <span className="text-destructive font-bold">×</span>
              </div>
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">Non-Compliant</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="h-8 px-3">
                <span className="text-lg font-bold">97%</span>
              </Badge>
              <div>
                <p className="text-sm font-medium">Target Met</p>
                <p className="text-xs text-muted-foreground">Q1 2025</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
