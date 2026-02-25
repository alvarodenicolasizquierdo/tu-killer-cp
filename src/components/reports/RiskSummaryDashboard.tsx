/**
 * RiskSummaryDashboard - Risk overview with country breakdown and factory distribution
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
} from 'recharts';
import { 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle2, 
  TrendingDown,
  TrendingUp,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  riskByCountry, 
  factoryRiskDistribution, 
  riskSummaryStats,
  riskFactories,
} from '@/data/mockReports';

export function RiskSummaryDashboard() {
  const [riskFilter, setRiskFilter] = useState<'all' | 'high' | 'medium'>('all');
  const [expandedItems, setExpandedItems] = useState(false);

  const filteredFactories = riskFactories.filter(f => {
    if (riskFilter === 'all') return true;
    return f.riskLevel === riskFilter;
  });

  return (
    <div className="space-y-6">
      {/* Risk Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-destructive">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High Risk</p>
                <p className="text-3xl font-bold text-destructive">{riskSummaryStats.highRisk}</p>
                <p className="text-xs text-muted-foreground mt-1">Factories requiring immediate action</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-destructive opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Medium Risk</p>
                <p className="text-3xl font-bold text-amber-600">{riskSummaryStats.mediumRisk}</p>
                <p className="text-xs text-muted-foreground mt-1">Factories to monitor closely</p>
              </div>
              <AlertCircle className="w-8 h-8 text-amber-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Low Risk</p>
                <p className="text-3xl font-bold text-emerald-600">{riskSummaryStats.lowRisk}</p>
                <p className="text-xs text-muted-foreground mt-1">Factories in good standing</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-emerald-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Risk Score</p>
                <p className="text-3xl font-bold">{riskSummaryStats.avgRiskScore}</p>
                <div className="flex items-center gap-1 mt-1 text-emerald-600">
                  <TrendingDown className="w-3 h-3" />
                  <span className="text-xs">{riskSummaryStats.riskScoreChange} from last month</span>
                </div>
              </div>
              <AlertTriangle className="w-8 h-8 text-muted-foreground opacity-30" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical Issues</p>
                <p className="text-2xl font-bold">{riskSummaryStats.criticalIssues}</p>
              </div>
              <Badge variant="destructive">Needs Attention</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm text-muted-foreground">Overall Pass Rate</p>
                <p className="text-2xl font-bold">{riskSummaryStats.overallPassRate}%</p>
              </div>
              <div className="flex items-center gap-1 text-emerald-600">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">+{riskSummaryStats.passRateChange}%</span>
              </div>
            </div>
            <Progress value={riskSummaryStats.overallPassRate} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Failed Inspections</p>
                <p className="text-2xl font-bold">{riskSummaryStats.failedInspections}</p>
              </div>
              <Badge variant="outline">Last 30 days</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk by Country */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Risk by Country</CardTitle>
              <Badge variant="outline">Avg Score</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={riskByCountry} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                <YAxis dataKey="country" type="category" tick={{ fontSize: 12 }} width={90} />
                <Tooltip 
                  formatter={(value: number) => [`${value}`, 'Avg Score']}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar 
                  dataKey="avgScore" 
                  radius={[0, 4, 4, 0]}
                  fill="hsl(var(--chart-1))"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Factory Risk Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Factory Risk Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {factoryRiskDistribution.map((item) => (
                <div key={item.range} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.range}</span>
                    <span className="text-muted-foreground">{item.count} factories</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.count / 12) * 100}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between pt-4 border-t">
                <span className="font-medium">Total Factories</span>
                <span className="text-lg font-bold">12</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Items Requiring Action */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Risk Items Requiring Action</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Click to expand for details and actions</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant={riskFilter === 'all' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setRiskFilter('all')}
              >
                All
              </Button>
              <Button 
                variant={riskFilter === 'high' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setRiskFilter('high')}
              >
                High
              </Button>
              <Button 
                variant={riskFilter === 'medium' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setRiskFilter('medium')}
              >
                Medium
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredFactories.slice(0, expandedItems ? undefined : 4).map((factory) => (
              <div 
                key={factory.id}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg border",
                  factory.riskLevel === 'high' && "border-l-4 border-l-destructive bg-destructive/5",
                  factory.riskLevel === 'medium' && "border-l-4 border-l-amber-500 bg-amber-500/5",
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    factory.riskLevel === 'high' && "bg-destructive/10",
                    factory.riskLevel === 'medium' && "bg-amber-500/10",
                  )}>
                    <span className={cn(
                      "text-sm font-bold",
                      factory.riskLevel === 'high' && "text-destructive",
                      factory.riskLevel === 'medium' && "text-amber-600",
                    )}>
                      {factory.riskScore}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{factory.name}</p>
                    <p className="text-sm text-muted-foreground">{factory.id} • {factory.country}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{factory.criticalIssues} critical issues</p>
                    <p className="text-xs text-muted-foreground">{factory.openActions} open actions</p>
                  </div>
                  <Badge variant={factory.riskLevel === 'high' ? 'destructive' : 'secondary'}>
                    {factory.riskLevel}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          {filteredFactories.length > 4 && (
            <Button 
              variant="ghost" 
              className="w-full mt-4"
              onClick={() => setExpandedItems(!expandedItems)}
            >
              {expandedItems ? (
                <>Show Less <ChevronUp className="w-4 h-4 ml-1" /></>
              ) : (
                <>Show All ({filteredFactories.length}) <ChevronDown className="w-4 h-4 ml-1" /></>
              )}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
