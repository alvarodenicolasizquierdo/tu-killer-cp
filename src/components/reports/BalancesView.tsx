/**
 * BalancesView - Resource allocation and usage tracking
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
} from 'recharts';
import { Wallet, TrendingUp, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { balanceData, balanceTrend } from '@/data/mockReports';

export function BalancesView() {
  return (
    <div className="space-y-6">
      {/* Balance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {balanceData.map((item) => {
          const usagePercent = (item.used / item.allocated) * 100;
          const isLow = item.remaining / item.allocated < 0.2;
          
          return (
            <Card key={item.category} className={cn(isLow && "border-amber-500")}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium">{item.category}</p>
                  {isLow && (
                    <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                      Low
                    </Badge>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">{item.remaining}</span>
                    <span className="text-sm text-muted-foreground">/ {item.allocated} {item.unit}</span>
                  </div>
                  <Progress 
                    value={usagePercent} 
                    className={cn(
                      "h-2",
                      usagePercent > 80 && "[&>div]:bg-amber-500",
                      usagePercent > 90 && "[&>div]:bg-destructive"
                    )} 
                  />
                  <p className="text-xs text-muted-foreground">
                    {item.used} used ({usagePercent.toFixed(0)}%)
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Usage Trend */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Usage Trend</CardTitle>
            <Badge variant="outline">Test Credits</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={balanceTrend}>
              <defs>
                <linearGradient id="colorUsed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} domain={[0, 1000]} />
              <Tooltip 
                formatter={(value: number, name: string) => {
                  if (name === 'used') return [value, 'Used'];
                  if (name === 'allocated') return [value, 'Allocated'];
                  return [value, name];
                }}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Area 
                type="monotone" 
                dataKey="used" 
                stroke="hsl(var(--chart-1))" 
                fillOpacity={1} 
                fill="url(#colorUsed)" 
                strokeWidth={2}
                name="used"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Breakdown */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Detailed Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {balanceData.map((item) => {
              const usagePercent = (item.used / item.allocated) * 100;
              const isLow = item.remaining / item.allocated < 0.2;
              
              return (
                <div key={item.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Wallet className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">{item.category}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      {isLow && (
                        <div className="flex items-center gap-1 text-amber-600">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-xs">Running low</span>
                        </div>
                      )}
                      <span className="text-sm text-muted-foreground">
                        {item.used} / {item.allocated} {item.unit}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Progress 
                        value={usagePercent} 
                        className={cn(
                          "h-3",
                          usagePercent > 80 && "[&>div]:bg-amber-500",
                          usagePercent > 90 && "[&>div]:bg-destructive"
                        )} 
                      />
                    </div>
                    <span className={cn(
                      "text-sm font-medium w-16 text-right",
                      usagePercent > 80 && "text-amber-600",
                      usagePercent > 90 && "text-destructive"
                    )}>
                      {usagePercent.toFixed(0)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Alert Card */}
      <Card className="border-l-4 border-l-amber-500">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="font-medium">Usage Projection</p>
              <p className="text-sm text-muted-foreground mt-1">
                At the current rate of consumption, Test Credits will be depleted by February 28, 2025. 
                Consider requesting an allocation increase or adjusting testing schedules.
              </p>
            </div>
            <Badge variant="outline" className="flex-shrink-0">Request More</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
