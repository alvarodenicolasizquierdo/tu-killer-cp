/**
 * SupplierPerformanceChart - 6-month performance trend chart for top suppliers
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Mock 6-month trend data for top suppliers
const trendData = [
  { month: 'Aug', 'Textile Excellence Ltd': 78, 'Viet Garment Solutions': 82, 'Dragon Fabrics Co': 80, 'Euro Fashion Fabrics': 92 },
  { month: 'Sep', 'Textile Excellence Ltd': 82, 'Viet Garment Solutions': 88, 'Dragon Fabrics Co': 83, 'Euro Fashion Fabrics': 94 },
  { month: 'Oct', 'Textile Excellence Ltd': 85, 'Viet Garment Solutions': 81, 'Dragon Fabrics Co': 76, 'Euro Fashion Fabrics': 81 },
  { month: 'Nov', 'Textile Excellence Ltd': 80, 'Viet Garment Solutions': 92, 'Dragon Fabrics Co': 88, 'Euro Fashion Fabrics': 96 },
  { month: 'Dec', 'Textile Excellence Ltd': 88, 'Viet Garment Solutions': 89, 'Dragon Fabrics Co': 85, 'Euro Fashion Fabrics': 90 },
  { month: 'Jan', 'Textile Excellence Ltd': 80, 'Viet Garment Solutions': 95, 'Dragon Fabrics Co': 91, 'Euro Fashion Fabrics': 88 },
];

const supplierColors = {
  'Textile Excellence Ltd': 'hsl(var(--primary))',
  'Viet Garment Solutions': 'hsl(142, 76%, 36%)', // green
  'Dragon Fabrics Co': 'hsl(187, 85%, 43%)', // cyan
  'Euro Fashion Fabrics': 'hsl(24, 95%, 53%)', // orange
};

export function SupplierPerformanceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Supplier Performance Comparison</CardTitle>
        <CardDescription>6-month score trends across top suppliers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
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
  );
}
