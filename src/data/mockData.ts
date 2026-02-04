import { User, TRF, Task, Supplier, LabSample, KPIData, Notification, Activity } from '@/types';

// Demo users for role switching
export const demoUsers: User[] = [
  {
    id: 'user-1',
    name: 'Sarah Chen',
    email: 'sarah.chen@retailco.com',
    role: 'buyer',
    avatar: 'SC',
    company: 'RetailCo',
    department: 'Quality Assurance'
  },
  {
    id: 'user-2',
    name: 'Marcus Wong',
    email: 'marcus@textilesupplier.com',
    role: 'supplier',
    avatar: 'MW',
    company: 'Textile Supplier Ltd',
    department: 'Operations'
  },
  {
    id: 'user-3',
    name: 'Dr. Elena Martinez',
    email: 'e.martinez@sgs.com',
    role: 'lab_technician',
    avatar: 'EM',
    company: 'SGS',
    department: 'Chemical Testing'
  },
  {
    id: 'user-4',
    name: 'James Richardson',
    email: 'j.richardson@retailco.com',
    role: 'manager',
    avatar: 'JR',
    company: 'RetailCo',
    department: 'Global Sourcing'
  },
  {
    id: 'user-5',
    name: 'Admin User',
    email: 'admin@sgs.com',
    role: 'admin',
    avatar: 'AU',
    company: 'SGS',
    department: 'Platform Admin'
  }
];

// TRF Mock Data
export const mockTRFs: TRF[] = [
  {
    id: 'trf-001',
    reference: 'TRF-2026-001234',
    productName: 'Cotton T-Shirt Collection SS26',
    supplier: 'Textile Supplier Ltd',
    factory: 'Dongguan Factory A',
    status: 'pending_review',
    priority: 'critical',
    progress: 85,
    dueDate: '2026-02-06',
    createdAt: '2026-01-15',
    updatedAt: '2026-02-04',
    assignee: 'Sarah Chen',
    category: 'Apparel',
    testCount: 12,
    passedTests: 10,
    failedTests: 1,
    riskScore: 72,
    slaRemaining: 24
  },
  {
    id: 'trf-002',
    reference: 'TRF-2026-001235',
    productName: 'Kids Denim Jeans',
    supplier: 'Denim Masters Co',
    factory: 'Vietnam Plant 2',
    status: 'in_progress',
    priority: 'at-risk',
    progress: 45,
    dueDate: '2026-02-08',
    createdAt: '2026-01-20',
    updatedAt: '2026-02-03',
    assignee: 'Lab Team A',
    category: 'Apparel',
    testCount: 18,
    passedTests: 6,
    failedTests: 2,
    riskScore: 58,
    slaRemaining: 72
  },
  {
    id: 'trf-003',
    reference: 'TRF-2026-001236',
    productName: 'Organic Baby Onesies',
    supplier: 'EcoTextile Inc',
    factory: 'Sustainable Mill 1',
    status: 'completed',
    priority: 'on-track',
    progress: 100,
    dueDate: '2026-02-01',
    createdAt: '2026-01-10',
    updatedAt: '2026-02-01',
    category: 'Infant Apparel',
    testCount: 24,
    passedTests: 24,
    failedTests: 0,
    riskScore: 12
  },
  {
    id: 'trf-004',
    reference: 'TRF-2026-001237',
    productName: 'Sports Bra Performance Line',
    supplier: 'ActiveWear Partners',
    factory: 'Shanghai Tech Facility',
    status: 'submitted',
    priority: 'on-track',
    progress: 10,
    dueDate: '2026-02-15',
    createdAt: '2026-02-01',
    updatedAt: '2026-02-04',
    category: 'Athletic Wear',
    testCount: 15,
    passedTests: 0,
    failedTests: 0,
    riskScore: 25,
    slaRemaining: 240
  },
  {
    id: 'trf-005',
    reference: 'TRF-2026-001238',
    productName: 'Winter Jacket Insulation',
    supplier: 'NorthTech Fabrics',
    factory: 'Jiangsu Factory B',
    status: 'draft',
    priority: 'info',
    progress: 5,
    dueDate: '2026-02-20',
    createdAt: '2026-02-03',
    updatedAt: '2026-02-04',
    category: 'Outerwear',
    testCount: 20,
    passedTests: 0,
    failedTests: 0
  },
  {
    id: 'trf-006',
    reference: 'TRF-2026-001239',
    productName: 'Silk Blouse Collection',
    supplier: 'Premium Silk Ltd',
    factory: 'Hangzhou Silk Mill',
    status: 'rejected',
    priority: 'critical',
    progress: 60,
    dueDate: '2026-02-02',
    createdAt: '2026-01-18',
    updatedAt: '2026-02-02',
    category: 'Formal Wear',
    testCount: 16,
    passedTests: 8,
    failedTests: 4,
    riskScore: 85
  }
];

// AI-Prioritized Tasks
export const mockTasks: Task[] = [
  {
    id: 'task-001',
    title: 'Approve TRF-2026-001234 - Critical SLA',
    description: 'Cotton T-Shirt Collection requires immediate approval. SLA expires in 24 hours.',
    priority: 'critical',
    type: 'approval',
    objectType: 'trf',
    objectId: 'trf-001',
    dueDate: '2026-02-05',
    slaRemaining: 24,
    aiRecommendation: 'Approve with conditions. Minor color deviation within tolerance.',
    aiConfidence: 87,
    isRead: false,
    createdAt: '2026-02-04T08:00:00Z'
  },
  {
    id: 'task-002',
    title: 'Review failed test results - Kids Denim',
    description: 'Formaldehyde levels slightly above threshold. Requires action.',
    priority: 'critical',
    type: 'review',
    objectType: 'trf',
    objectId: 'trf-002',
    dueDate: '2026-02-05',
    aiRecommendation: 'Request retest. Historical data shows 80% pass rate on retests.',
    aiConfidence: 72,
    isRead: false,
    createdAt: '2026-02-04T07:30:00Z'
  },
  {
    id: 'task-003',
    title: 'Upload missing COA documents',
    description: 'Certificate of Analysis required for Supplier #4521',
    priority: 'at-risk',
    type: 'upload',
    objectType: 'supplier',
    objectId: 'supplier-003',
    dueDate: '2026-02-07',
    isRead: true,
    createdAt: '2026-02-03T14:00:00Z'
  },
  {
    id: 'task-004',
    title: 'Certificate expiring - Textile Supplier Ltd',
    description: 'OEKO-TEX certificate expires in 15 days. Schedule renewal.',
    priority: 'at-risk',
    type: 'notification',
    objectType: 'certificate',
    objectId: 'cert-012',
    dueDate: '2026-02-19',
    isRead: true,
    createdAt: '2026-02-02T09:00:00Z'
  },
  {
    id: 'task-005',
    title: 'New inspection scheduled',
    description: 'Factory audit for Dongguan Factory A - Prepare documentation',
    priority: 'on-track',
    type: 'action',
    objectType: 'inspection',
    objectId: 'insp-008',
    dueDate: '2026-02-12',
    isRead: false,
    createdAt: '2026-02-04T06:00:00Z'
  }
];

// Suppliers
export const mockSuppliers: Supplier[] = [
  {
    id: 'supplier-001',
    name: 'Textile Supplier Ltd',
    country: 'China',
    factoryCount: 3,
    status: 'active',
    complianceScore: 92,
    qualityScore: 88,
    deliveryScore: 95,
    lastAudit: '2025-11-15',
    certificatesExpiring: 1,
    openTRFs: 4
  },
  {
    id: 'supplier-002',
    name: 'Denim Masters Co',
    country: 'Vietnam',
    factoryCount: 2,
    status: 'at-risk',
    complianceScore: 74,
    qualityScore: 79,
    deliveryScore: 68,
    lastAudit: '2025-09-20',
    certificatesExpiring: 2,
    openTRFs: 2
  },
  {
    id: 'supplier-003',
    name: 'EcoTextile Inc',
    country: 'India',
    factoryCount: 1,
    status: 'active',
    complianceScore: 98,
    qualityScore: 96,
    deliveryScore: 92,
    lastAudit: '2025-12-10',
    certificatesExpiring: 0,
    openTRFs: 1
  },
  {
    id: 'supplier-004',
    name: 'ActiveWear Partners',
    country: 'China',
    factoryCount: 4,
    status: 'active',
    complianceScore: 85,
    qualityScore: 90,
    deliveryScore: 88,
    lastAudit: '2025-10-05',
    certificatesExpiring: 0,
    openTRFs: 3
  }
];

// Lab Samples
export const mockLabSamples: LabSample[] = [
  {
    id: 'sample-001',
    trfReference: 'TRF-2026-001234',
    sampleType: 'Fabric Swatch',
    status: 'testing',
    priority: 'critical',
    receivedDate: '2026-02-01',
    dueDate: '2026-02-05',
    assignee: 'Dr. Elena Martinez',
    testType: 'Chemical Analysis',
    progress: 75
  },
  {
    id: 'sample-002',
    trfReference: 'TRF-2026-001235',
    sampleType: 'Denim Panel',
    status: 'testing',
    priority: 'at-risk',
    receivedDate: '2026-02-02',
    dueDate: '2026-02-06',
    assignee: 'Dr. Elena Martinez',
    testType: 'Durability Testing',
    progress: 40
  },
  {
    id: 'sample-003',
    trfReference: 'TRF-2026-001237',
    sampleType: 'Elastic Band',
    status: 'queued',
    priority: 'on-track',
    receivedDate: '2026-02-04',
    dueDate: '2026-02-12',
    testType: 'Tensile Strength',
    progress: 0
  },
  {
    id: 'sample-004',
    trfReference: 'TRF-2026-001238',
    sampleType: 'Insulation Material',
    status: 'received',
    priority: 'on-track',
    receivedDate: '2026-02-04',
    dueDate: '2026-02-15',
    testType: 'Thermal Testing',
    progress: 0
  }
];

// KPI Data by Role
export const buyerKPIs: KPIData[] = [
  { label: 'Pending Approvals', value: 12, change: 3, changeDirection: 'up', status: 'at-risk' },
  { label: 'On-Time Delivery', value: '94%', target: 95, status: 'on-track' },
  { label: 'Quality Pass Rate', value: '87%', change: -2, changeDirection: 'down', status: 'at-risk' },
  { label: 'Suppliers At Risk', value: 2, status: 'critical' }
];

export const labKPIs: KPIData[] = [
  { label: 'Tests Today', value: 24, change: 8, changeDirection: 'up', status: 'on-track' },
  { label: 'SLA Compliance', value: '96%', target: 95, status: 'on-track' },
  { label: 'Queue Depth', value: 48, status: 'at-risk' },
  { label: 'Avg Turnaround', value: '3.2 days', status: 'on-track' }
];

export const managerKPIs: KPIData[] = [
  { label: 'Active TRFs', value: 156, change: 12, changeDirection: 'up', status: 'on-track' },
  { label: 'Compliance Score', value: '92%', target: 90, status: 'on-track' },
  { label: 'Cost Savings', value: '$125K', change: 15, changeDirection: 'up', status: 'on-track' },
  { label: 'Critical Issues', value: 3, status: 'critical' }
];

// Notifications
export const mockNotifications: Notification[] = [
  {
    id: 'notif-001',
    type: 'warning',
    title: 'SLA Breach Warning',
    message: 'TRF-2026-001234 will breach SLA in 24 hours',
    timestamp: '2026-02-04T08:00:00Z',
    isRead: false,
    priority: 'critical',
    actionUrl: '/trfs/trf-001'
  },
  {
    id: 'notif-002',
    type: 'error',
    title: 'Test Failed',
    message: 'Formaldehyde test failed for Kids Denim Jeans',
    timestamp: '2026-02-04T07:30:00Z',
    isRead: false,
    priority: 'critical',
    actionUrl: '/trfs/trf-002'
  },
  {
    id: 'notif-003',
    type: 'info',
    title: 'New Regulation Update',
    message: 'EU REACH regulations updated. Review required.',
    timestamp: '2026-02-03T14:00:00Z',
    isRead: true,
    priority: 'at-risk'
  },
  {
    id: 'notif-004',
    type: 'success',
    title: 'TRF Approved',
    message: 'Organic Baby Onesies TRF has been approved',
    timestamp: '2026-02-01T16:00:00Z',
    isRead: true,
    priority: 'on-track'
  }
];

// Activity Feed
export const mockActivities: Activity[] = [
  {
    id: 'act-001',
    type: 'test_result',
    actor: 'Dr. Elena Martinez',
    action: 'uploaded test results for',
    target: 'TRF-2026-001234',
    timestamp: '2026-02-04T09:15:00Z'
  },
  {
    id: 'act-002',
    type: 'status_change',
    actor: 'System',
    action: 'changed status to Pending Review for',
    target: 'TRF-2026-001234',
    timestamp: '2026-02-04T09:10:00Z'
  },
  {
    id: 'act-003',
    type: 'comment',
    actor: 'Marcus Wong',
    action: 'commented on',
    target: 'TRF-2026-001235',
    timestamp: '2026-02-04T08:45:00Z',
    metadata: { comment: 'Sample shipped via DHL. Tracking: 1234567890' }
  },
  {
    id: 'act-004',
    type: 'approval',
    actor: 'Sarah Chen',
    action: 'approved',
    target: 'TRF-2026-001236',
    timestamp: '2026-02-01T16:00:00Z'
  },
  {
    id: 'act-005',
    type: 'upload',
    actor: 'Textile Supplier Ltd',
    action: 'uploaded COA for',
    target: 'Product Batch #4521',
    timestamp: '2026-02-01T14:30:00Z'
  }
];

// AI Chat demo responses
export const aiDemoResponses: Record<string, { response: string; suggestions: string[] }> = {
  'overdue': {
    response: `Based on your current portfolio, I found **3 overdue TRFs**:\n\n1. **TRF-2026-001234** - Cotton T-Shirt Collection (SLA: 24h remaining)\n2. **TRF-2026-001239** - Silk Blouse Collection (Rejected - requires resubmission)\n3. **TRF-2026-001235** - Kids Denim Jeans (At risk - formaldehyde retest pending)\n\nRecommendation: Prioritize TRF-001234 for immediate approval to avoid SLA breach.`,
    suggestions: ['Show me TRF-001234 details', 'What caused the failures?', 'Schedule a call with supplier']
  },
  'failed': {
    response: `In the last 7 days, there were **4 failed tests**:\n\n| TRF | Test | Result | Action |\n|-----|------|--------|--------|\n| TRF-001235 | Formaldehyde | 78 ppm (limit: 75) | Retest scheduled |\n| TRF-001239 | Color Fastness | Grade 2 (min: 3) | Supplier notified |\n| TRF-001239 | Tensile Strength | -15% from spec | Root cause analysis |\n| TRF-001239 | pH Level | 9.2 (limit: 9.0) | Wash process review |\n\nPattern detected: 3/4 failures from Silk Blouse Collection suggest a systematic issue at Hangzhou Silk Mill.`,
    suggestions: ['Show supplier scorecard', 'View failure trends', 'Generate exception report']
  },
  'supplier': {
    response: `**Supplier Risk Summary:**\n\n🔴 **High Risk (2)**\n- Denim Masters Co - Compliance: 74% ↓\n- Hangzhou Silk Mill - 4 test failures this month\n\n🟡 **Medium Risk (1)**\n- Premium Silk Ltd - Certificate expiring in 30 days\n\n🟢 **Low Risk (12)**\n- All other suppliers meeting KPIs\n\nAI Recommendation: Schedule urgent audit for Denim Masters Co. Historical data shows 85% improvement after interventions.`,
    suggestions: ['View Denim Masters details', 'Schedule audit', 'Compare with last quarter']
  },
  'default': {
    response: `I can help you with:\n\n• **TRF Status** - "Show me overdue TRFs"\n• **Test Results** - "What tests failed this week?"\n• **Suppliers** - "Which suppliers have expiring certificates?"\n• **Analytics** - "Show me quality trends"\n• **Actions** - "What should I prioritize today?"\n\nHow can I assist you?`,
    suggestions: ['Show my pending approvals', 'Summarize today\'s priorities', 'View analytics dashboard']
  }
};
