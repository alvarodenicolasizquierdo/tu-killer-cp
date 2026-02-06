import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Calendar,
  Filter
} from 'lucide-react';
import { motion } from 'framer-motion';
import { CollectionReadinessFunnel } from '@/components/reports/CollectionReadinessFunnel';

const trfTrendData = [
  { month: 'Sep', submitted: 45, completed: 42, rejected: 3 },
  { month: 'Oct', submitted: 52, completed: 48, rejected: 4 },
  { month: 'Nov', submitted: 61, completed: 56, rejected: 5 },
  { month: 'Dec', submitted: 48, completed: 45, rejected: 3 },
  { month: 'Jan', submitted: 58, completed: 52, rejected: 6 },
  { month: 'Feb', submitted: 64, completed: 58, rejected: 4 },
];

const passRateData = [
  { name: 'Chemical', passRate: 92, tests: 234 },
  { name: 'Physical', passRate: 88, tests: 189 },
  { name: 'Flammability', passRate: 95, tests: 156 },
  { name: 'Durability', passRate: 85, tests: 201 },
  { name: 'Labeling', passRate: 97, tests: 178 },
];

const supplierDistribution = [
  { name: 'Active', value: 21, color: '#10B981' },
  { name: 'At Risk', value: 2, color: '#F59E0B' },
  { name: 'Inactive', value: 1, color: '#6B7280' },
];

const turnaroundData = [
  { week: 'W1', actual: 3.2, target: 3.5 },
  { week: 'W2', actual: 3.5, target: 3.5 },
  { week: 'W3', actual: 3.1, target: 3.5 },
  { week: 'W4', actual: 2.9, target: 3.5 },
  { week: 'W5', actual: 3.3, target: 3.5 },
  { week: 'W6', actual: 3.0, target: 3.5 },
];

export default function Analytics() {
  return (
    <AppLayout title="Analytics & Performance" subtitle="Monitor KPIs, trends, and operational insights">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total TRFs (MTD)</p>
                  <p className="text-3xl font-bold">156</p>
                </div>
                <div className="flex items-center text-emerald-600">
                  <TrendingUp className="w-5 h-5" />
                  <span className="text-sm ml-1">+12%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pass Rate</p>
                  <p className="text-3xl font-bold text-emerald-600">91.2%</p>
                </div>
                <div className="flex items-center text-emerald-600">
                  <TrendingUp className="w-5 h-5" />
                  <span className="text-sm ml-1">+2.3%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Turnaround</p>
                  <p className="text-3xl font-bold">3.1 <span className="text-lg font-normal text-muted-foreground">days</span></p>
                </div>
                <div className="flex items-center text-emerald-600">
                  <TrendingDown className="w-5 h-5" />
                  <span className="text-sm ml-1">-0.4d</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">SLA Compliance</p>
                  <p className="text-3xl font-bold">96.4%</p>
                </div>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                  On Target
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* TRF Trends */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <LineChartIcon className="w-5 h-5 text-muted-foreground" />
                TRF Volume Trends
              </CardTitle>
              <Badge variant="outline">Last 6 months</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={trfTrendData}>
                <defs>
                  <linearGradient id="colorSubmitted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="submitted" stroke="#3B82F6" fillOpacity={1} fill="url(#colorSubmitted)" strokeWidth={2} />
                <Area type="monotone" dataKey="completed" stroke="#10B981" fillOpacity={1} fill="url(#colorCompleted)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-6 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-sm text-muted-foreground">Submitted</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-sm text-muted-foreground">Completed</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pass Rate by Category */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-muted-foreground" />
                Pass Rate by Test Category
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={passRateData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={80} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Bar 
                  dataKey="passRate" 
                  fill="#3B82F6" 
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Supplier Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-muted-foreground" />
                Supplier Status Distribution
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={supplierDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {supplierDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-2">
              {supplierDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-muted-foreground">{item.name} ({item.value})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Turnaround Time */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                Turnaround Time (Days)
              </CardTitle>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                Below Target
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={turnaroundData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#F59E0B" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-6 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-blue-500" />
                <span className="text-sm text-muted-foreground">Actual</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-amber-500" style={{ borderStyle: 'dashed' }} />
                <span className="text-sm text-muted-foreground">Target (3.5 days)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Collection Readiness Funnel */}
      <div className="mb-6">
        <CollectionReadinessFunnel />
      </div>
    </AppLayout>
  );
}
