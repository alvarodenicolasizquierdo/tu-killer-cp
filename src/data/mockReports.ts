/**
 * Mock data for Insights/Reports module
 * Generates realistic mock data for risk, compliance, pipeline, and transaction reports
 */

// Types
export interface RiskFactory {
  id: string;
  name: string;
  country: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  lastAudit: string;
  criticalIssues: number;
  openActions: number;
}

export interface ComplianceMetric {
  category: string;
  score: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

export interface PipelineItem {
  stage: string;
  count: number;
  value: number;
  avgDays: number;
}

export interface Transaction {
  id: string;
  date: string;
  type: 'test_request' | 'inspection' | 'audit' | 'certification';
  reference: string;
  supplier: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  amount: number;
  currency: string;
}

export interface BalanceItem {
  category: string;
  allocated: number;
  used: number;
  remaining: number;
  unit: string;
}

// Risk data by country
export const riskByCountry = [
  { country: 'India', avgScore: 72, factories: 3 },
  { country: 'Cambodia', avgScore: 58, factories: 2 },
  { country: 'Pakistan', avgScore: 52, factories: 2 },
  { country: 'Bangladesh', avgScore: 48, factories: 2 },
  { country: 'China', avgScore: 42, factories: 1 },
  { country: 'Indonesia', avgScore: 35, factories: 1 },
  { country: 'Turkey', avgScore: 28, factories: 2 },
  { country: 'Philippines', avgScore: 25, factories: 1 },
];

// Factory risk distribution
export const factoryRiskDistribution = [
  { range: 'Low Risk (0-30)', count: 6, color: 'hsl(var(--chart-2))' },
  { range: 'Medium Risk (31-60)', count: 4, color: 'hsl(var(--chart-4))' },
  { range: 'High Risk (61-100)', count: 2, color: 'hsl(var(--destructive))' },
];

// Risk summary stats
export const riskSummaryStats = {
  highRisk: 2,
  mediumRisk: 4,
  lowRisk: 6,
  avgRiskScore: 38,
  riskScoreChange: -5,
  criticalIssues: 17,
  overallPassRate: 86,
  passRateChange: 2.3,
  failedInspections: 1,
};

// Sample factories with risk data
export const riskFactories: RiskFactory[] = [
  { id: 'FAC-001', name: 'Sunrise Textiles', country: 'India', riskScore: 78, riskLevel: 'high', lastAudit: '2024-12-15', criticalIssues: 5, openActions: 8 },
  { id: 'FAC-002', name: 'Golden Thread Mills', country: 'India', riskScore: 72, riskLevel: 'high', lastAudit: '2025-01-10', criticalIssues: 4, openActions: 6 },
  { id: 'FAC-003', name: 'Khmer Garments', country: 'Cambodia', riskScore: 58, riskLevel: 'medium', lastAudit: '2025-01-20', criticalIssues: 2, openActions: 4 },
  { id: 'FAC-004', name: 'Lahore Apparel', country: 'Pakistan', riskScore: 52, riskLevel: 'medium', lastAudit: '2024-11-30', criticalIssues: 3, openActions: 5 },
  { id: 'FAC-005', name: 'Dhaka Fashions', country: 'Bangladesh', riskScore: 45, riskLevel: 'medium', lastAudit: '2025-01-05', criticalIssues: 1, openActions: 3 },
  { id: 'FAC-006', name: 'Shanghai Quality', country: 'China', riskScore: 28, riskLevel: 'low', lastAudit: '2025-01-25', criticalIssues: 0, openActions: 1 },
];

// Compliance metrics
export const complianceMetrics: ComplianceMetric[] = [
  { category: 'Chemical Safety', score: 94, trend: 'up', change: 3 },
  { category: 'Labor Standards', score: 88, trend: 'stable', change: 0 },
  { category: 'Environmental', score: 82, trend: 'up', change: 5 },
  { category: 'Product Safety', score: 91, trend: 'down', change: -2 },
  { category: 'Documentation', score: 96, trend: 'up', change: 1 },
];

export const complianceTimeline = [
  { month: 'Sep', score: 84 },
  { month: 'Oct', score: 86 },
  { month: 'Nov', score: 85 },
  { month: 'Dec', score: 88 },
  { month: 'Jan', score: 90 },
  { month: 'Feb', score: 92 },
];

// Pipeline data
export const pipelineData: PipelineItem[] = [
  { stage: 'Sample Received', count: 45, value: 12500, avgDays: 1.2 },
  { stage: 'Testing In Progress', count: 32, value: 8800, avgDays: 3.5 },
  { stage: 'Under Review', count: 18, value: 4950, avgDays: 1.8 },
  { stage: 'Pending Approval', count: 12, value: 3300, avgDays: 0.8 },
  { stage: 'Completed', count: 156, value: 42900, avgDays: 0 },
];

export const pipelineByType = [
  { type: 'Chemical Testing', count: 89, percentage: 34 },
  { type: 'Physical Testing', count: 72, percentage: 27 },
  { type: 'Safety Testing', count: 58, percentage: 22 },
  { type: 'Performance Testing', count: 44, percentage: 17 },
];

// Transactions
export const generateTransactions = (count: number = 150): Transaction[] => {
  const types: Transaction['type'][] = ['test_request', 'inspection', 'audit', 'certification'];
  const statuses: Transaction['status'][] = ['pending', 'in_progress', 'completed', 'failed'];
  const suppliers = ['Sunrise Textiles', 'Golden Thread Mills', 'Khmer Garments', 'Lahore Apparel', 'Dhaka Fashions', 'Shanghai Quality'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `TXN-${String(i + 1).padStart(5, '0')}`,
    date: new Date(2025, 0, 15 + Math.floor(Math.random() * 22)).toISOString().split('T')[0],
    type: types[Math.floor(Math.random() * types.length)],
    reference: `REF-${String(1000 + i).padStart(6, '0')}`,
    supplier: suppliers[Math.floor(Math.random() * suppliers.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    amount: Math.floor(Math.random() * 5000) + 500,
    currency: 'USD',
  }));
};

export const transactions = generateTransactions();

// Balances
export const balanceData: BalanceItem[] = [
  { category: 'Test Credits', allocated: 1000, used: 687, remaining: 313, unit: 'credits' },
  { category: 'Inspection Hours', allocated: 500, used: 342, remaining: 158, unit: 'hours' },
  { category: 'Audit Days', allocated: 50, used: 38, remaining: 12, unit: 'days' },
  { category: 'Certification Quota', allocated: 100, used: 78, remaining: 22, unit: 'certs' },
];

export const balanceTrend = [
  { month: 'Sep', used: 520, allocated: 1000 },
  { month: 'Oct', used: 580, allocated: 1000 },
  { month: 'Nov', used: 610, allocated: 1000 },
  { month: 'Dec', used: 645, allocated: 1000 },
  { month: 'Jan', used: 670, allocated: 1000 },
  { month: 'Feb', used: 687, allocated: 1000 },
];

// Custom report definitions
export interface CustomReport {
  id: string;
  name: string;
  description: string;
  lastRun: string;
  schedule: string | null;
  createdBy: string;
}

export const customReports: CustomReport[] = [
  { id: 'RPT-001', name: 'Weekly Supplier Performance', description: 'Aggregated supplier metrics and trends', lastRun: '2025-02-05', schedule: 'Weekly', createdBy: 'System' },
  { id: 'RPT-002', name: 'Monthly Compliance Summary', description: 'Compliance scores across all categories', lastRun: '2025-02-01', schedule: 'Monthly', createdBy: 'Admin' },
  { id: 'RPT-003', name: 'Test Turnaround Analysis', description: 'Average turnaround times by test type', lastRun: '2025-02-04', schedule: null, createdBy: 'Quality Team' },
  { id: 'RPT-004', name: 'Risk Heatmap by Region', description: 'Geographic risk distribution', lastRun: '2025-01-28', schedule: 'Monthly', createdBy: 'System' },
];
