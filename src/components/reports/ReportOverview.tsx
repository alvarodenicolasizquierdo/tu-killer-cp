/**
 * ReportOverview - High-level KPI summary and quick metrics
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  FileText, 
  CheckCircle2, 
  Clock,
  AlertTriangle,
  Download,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const activityData = [
  { month: 'Sep', tests: 145, inspections: 42 },
  { month: 'Oct', tests: 162, inspections: 48 },
  { month: 'Nov', tests: 178, inspections: 52 },
  { month: 'Dec', tests: 156, inspections: 45 },
  { month: 'Jan', tests: 189, inspections: 58 },
  { month: 'Feb', tests: 201, inspections: 64 },
];

const weeklyProgress = [
  { week: 'W1', completed: 45, target: 50 },
  { week: 'W2', completed: 52, target: 50 },
  { week: 'W3', completed: 48, target: 50 },
  { week: 'W4', completed: 56, target: 50 },
];

export function ReportOverview() {
  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Overview Dashboard</h2>
          <p className="text-sm text-muted-foreground">Last updated: Feb 6, 2025 at 10:30 AM</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tests (MTD)</p>
                <p className="text-3xl font-bold">201</p>
              </div>
              <div className="flex items-center text-emerald-600">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm ml-1">+12%</span>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">vs 179 last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pass Rate</p>
                <p className="text-3xl font-bold text-emerald-600">94.2%</p>
              </div>
              <div className="flex items-center text-emerald-600">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm ml-1">+2.1%</span>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="text-xs text-muted-foreground">Above target of 92%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Turnaround</p>
                <p className="text-3xl font-bold">2.8 <span className="text-lg font-normal text-muted-foreground">days</span></p>
              </div>
              <div className="flex items-center text-emerald-600">
                <TrendingDown className="w-5 h-5" />
                <span className="text-sm ml-1">-0.3d</span>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Target: 3.0 days</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Open Issues</p>
                <p className="text-3xl font-bold">17</p>
              </div>
              <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                3 Critical
              </Badge>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span className="text-xs text-muted-foreground">5 pending review</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Trend */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Activity Trend</CardTitle>
              <Badge variant="outline">Last 6 months</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorTests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorInspections" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="tests" 
                  stroke="hsl(var(--chart-1))" 
                  fillOpacity={1} 
                  fill="url(#colorTests)" 
                  strokeWidth={2} 
                />
                <Area 
                  type="monotone" 
                  dataKey="inspections" 
                  stroke="hsl(var(--chart-2))" 
                  fillOpacity={1} 
                  fill="url(#colorInspections)" 
                  strokeWidth={2} 
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-6 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(var(--chart-1))' }} />
                <span className="text-sm text-muted-foreground">Tests</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(var(--chart-2))' }} />
                <span className="text-sm text-muted-foreground">Inspections</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Progress */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Weekly Progress</CardTitle>
              <Badge variant="outline">This month</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={weeklyProgress}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="completed" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} name="Completed" />
                <Bar dataKey="target" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} name="Target" />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-6 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(var(--chart-1))' }} />
                <span className="text-sm text-muted-foreground">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-muted" />
                <span className="text-sm text-muted-foreground">Target</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-primary/5">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-primary">53</p>
            <p className="text-sm text-muted-foreground">Active Suppliers</p>
          </CardContent>
        </Card>
        <Card className="bg-emerald-500/5">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-emerald-600">1,247</p>
            <p className="text-sm text-muted-foreground">Tests YTD</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-500/5">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-amber-600">12</p>
            <p className="text-sm text-muted-foreground">Pending Reviews</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-500/5">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">98.5%</p>
            <p className="text-sm text-muted-foreground">SLA Compliance</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
