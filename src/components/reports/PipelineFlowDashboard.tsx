/**
 * PipelineFlowDashboard - Visual pipeline stages and flow metrics
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { ArrowRight, Clock, Package, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { pipelineData, pipelineByType } from '@/data/mockReports';

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
];

export function PipelineFlowDashboard() {
  const totalInPipeline = pipelineData.filter(p => p.stage !== 'Completed').reduce((acc, p) => acc + p.count, 0);
  const totalValue = pipelineData.reduce((acc, p) => acc + p.value, 0);

  return (
    <div className="space-y-6">
      {/* Pipeline Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{totalInPipeline}</p>
                <p className="text-sm text-muted-foreground">Items in Pipeline</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-emerald-500" />
              <div>
                <p className="text-2xl font-bold">${(totalValue / 1000).toFixed(1)}K</p>
                <p className="text-sm text-muted-foreground">Total Value</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-amber-500" />
              <div>
                <p className="text-2xl font-bold">3.2 days</p>
                <p className="text-sm text-muted-foreground">Avg. Cycle Time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Badge className="h-8 px-3 bg-emerald-100 text-emerald-700">
                <span className="text-lg font-bold">156</span>
              </Badge>
              <div>
                <p className="text-sm font-medium">Completed</p>
                <p className="text-xs text-muted-foreground">This month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Flow Visualization */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Pipeline Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between overflow-x-auto pb-4">
            {pipelineData.filter(p => p.stage !== 'Completed').map((stage, index, arr) => (
              <motion.div 
                key={stage.stage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center"
              >
                <div className={cn(
                  "flex flex-col items-center p-4 rounded-lg border-2 min-w-[140px]",
                  index === 0 && "border-primary bg-primary/5",
                  index === 1 && "border-amber-500 bg-amber-500/5",
                  index === 2 && "border-blue-500 bg-blue-500/5",
                  index === 3 && "border-emerald-500 bg-emerald-500/5",
                )}>
                  <p className="text-3xl font-bold">{stage.count}</p>
                  <p className="text-xs text-center text-muted-foreground mt-1 whitespace-nowrap">
                    {stage.stage}
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{stage.avgDays}d avg</span>
                  </div>
                </div>
                {index < arr.length - 1 && (
                  <ArrowRight className="w-6 h-6 mx-2 text-muted-foreground flex-shrink-0" />
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline by Stage */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Items by Stage</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={pipelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="stage" 
                  tick={{ fontSize: 10 }} 
                  angle={-20}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value: number, name: string) => {
                    if (name === 'count') return [value, 'Items'];
                    if (name === 'value') return [`$${value}`, 'Value'];
                    return [value, name];
                  }}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="count" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pipeline by Type */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Distribution by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={220}>
                <PieChart>
                  <Pie
                    data={pipelineByType}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="count"
                  >
                    {pipelineByType.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-3">
                {pipelineByType.map((item, index) => (
                  <div key={item.type} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm">{item.type}</span>
                    </div>
                    <span className="text-sm font-medium">{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottleneck Alert */}
      <Card className="border-l-4 border-l-amber-500">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="font-medium">Potential Bottleneck Detected</p>
              <p className="text-sm text-muted-foreground mt-1">
                "Testing In Progress" stage has an average time of 3.5 days, which is 25% higher than the target of 2.8 days. 
                Consider reviewing capacity or prioritization in this stage.
              </p>
            </div>
            <Badge variant="outline" className="flex-shrink-0">View Details</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
