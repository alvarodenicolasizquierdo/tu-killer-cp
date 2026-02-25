/**
 * SupplierPerformanceChart - 6-month performance trend charts for suppliers
 * Includes comparison chart and individual supplier trend cards
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock 6-month trend data for top suppliers
const trendData = [
  { month: 'Aug', 'Textile Excellence Ltd': 78, 'Viet Garment Solutions': 82, 'Dragon Fabrics Co': 80, 'Euro Fashion Fabrics': 92 },
  { month: 'Sep', 'Textile Excellence Ltd': 82, 'Viet Garment Solutions': 88, 'Dragon Fabrics Co': 83, 'Euro Fashion Fabrics': 94 },
  { month: 'Oct', 'Textile Excellence Ltd': 85, 'Viet Garment Solutions': 81, 'Dragon Fabrics Co': 76, 'Euro Fashion Fabrics': 81 },
  { month: 'Nov', 'Textile Excellence Ltd': 80, 'Viet Garment Solutions': 92, 'Dragon Fabrics Co': 88, 'Euro Fashion Fabrics': 96 },
  { month: 'Dec', 'Textile Excellence Ltd': 88, 'Viet Garment Solutions': 89, 'Dragon Fabrics Co': 85, 'Euro Fashion Fabrics': 90 },
  { month: 'Jan', 'Textile Excellence Ltd': 92, 'Viet Garment Solutions': 91, 'Dragon Fabrics Co': 88, 'Euro Fashion Fabrics': 88 },
];

// Individual supplier data with their own trend lines
const individualSupplierData = [
  {
    name: 'Textile Excellence Ltd',
    description: '6-month performance trend',
    currentScore: 92,
    change: 14,
    data: [
      { month: 'Aug', score: 78 },
      { month: 'Sep', score: 82 },
      { month: 'Oct', score: 85 },
      { month: 'Nov', score: 80 },
      { month: 'Dec', score: 88 },
      { month: 'Jan', score: 92 },
    ],
  },
  {
    name: 'Dragon Fabrics Co',
    description: '6-month performance trend',
    currentScore: 88,
    change: 8,
    data: [
      { month: 'Aug', score: 80 },
      { month: 'Sep', score: 83 },
      { month: 'Oct', score: 76 },
      { month: 'Nov', score: 88 },
      { month: 'Dec', score: 85 },
      { month: 'Jan', score: 88 },
    ],
  },
  {
    name: 'Anatolian Textiles',
    description: '6-month performance trend',
    currentScore: 85,
    change: 3,
    data: [
      { month: 'Aug', score: 82 },
      { month: 'Sep', score: 80 },
      { month: 'Oct', score: 83 },
      { month: 'Nov', score: 81 },
      { month: 'Dec', score: 84 },
      { month: 'Jan', score: 85 },
    ],
  },
  {
    name: 'Viet Garment Solutions',
    description: '6-month performance trend',
    currentScore: 91,
    change: 9,
    data: [
      { month: 'Aug', score: 82 },
      { month: 'Sep', score: 88 },
      { month: 'Oct', score: 81 },
      { month: 'Nov', score: 92 },
      { month: 'Dec', score: 89 },
      { month: 'Jan', score: 91 },
    ],
  },
  {
    name: 'Mumbai Textile Mills',
    description: '6-month performance trend',
    currentScore: 78,
    change: -4,
    data: [
      { month: 'Aug', score: 82 },
      { month: 'Sep', score: 79 },
      { month: 'Oct', score: 75 },
      { month: 'Nov', score: 80 },
      { month: 'Dec', score: 82 },
      { month: 'Jan', score: 78 },
    ],
  },
  {
    name: 'Pacific Trim Co',
    description: '6-month performance trend',
    currentScore: 65,
    change: -8,
    data: [
      { month: 'Aug', score: 73 },
      { month: 'Sep', score: 70 },
      { month: 'Oct', score: 68 },
      { month: 'Nov', score: 72 },
      { month: 'Dec', score: 68 },
      { month: 'Jan', score: 65 },
    ],
  },
];

const supplierColors = {
  'Textile Excellence Ltd': 'hsl(var(--primary))',
  'Viet Garment Solutions': 'hsl(142, 76%, 36%)',
  'Dragon Fabrics Co': 'hsl(187, 85%, 43%)',
  'Euro Fashion Fabrics': 'hsl(24, 95%, 53%)',
};

interface IndividualTrendCardProps {
  name: string;
  description: string;
  currentScore: number;
  change: number;
  data: { month: string; score: number }[];
}

function IndividualTrendCard({ name, description, currentScore, change, data }: IndividualTrendCardProps) {
  const isPositive = change >= 0;
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-sm">{name}</h3>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          <div className="text-right">
            <Badge 
              variant="outline" 
              className={cn(
                "text-xs gap-1 mb-1",
                isPositive ? "text-emerald-600 border-emerald-200 bg-emerald-50" : "text-red-600 border-red-200 bg-red-50"
              )}
            >
              {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {isPositive ? '+' : ''}{change} pts
            </Badge>
            <p className="text-2xl font-bold">{currentScore}</p>
            <p className="text-xs text-muted-foreground">Current</p>
          </div>
        </div>
        <div className="h-[100px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id={`gradient-${name.replace(/\s/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                domain={[50, 100]} 
                hide
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill={`url(#gradient-${name.replace(/\s/g, '')})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function SupplierPerformanceChart() {
  return (
    <div className="space-y-6">
      {/* Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Supplier Performance Comparison</CardTitle>
          <CardDescription>6-month score trends across top suppliers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <YAxis 
                  domain={[50, 100]} 
                  ticks={[50, 65, 80, 100]}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Legend />
                {Object.entries(supplierColors).map(([supplier, color]) => (
                  <Line
                    key={supplier}
                    type="monotone"
                    dataKey={supplier}
                    stroke={color}
                    strokeWidth={2}
                    dot={{ r: 4, fill: color }}
                    activeDot={{ r: 6 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Individual Supplier Trends */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Individual Supplier Trends</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {individualSupplierData.map((supplier) => (
            <IndividualTrendCard
              key={supplier.name}
              name={supplier.name}
              description={supplier.description}
              currentScore={supplier.currentScore}
              change={supplier.change}
              data={supplier.data}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
