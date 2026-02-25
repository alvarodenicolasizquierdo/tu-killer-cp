import { User, TRF, Task, Supplier, LabSample, KPIData, Notification, Activity, TRFTimelineEvent, TRFTest, TRFDocument, Product, ProductImage, Inspection } from '@/types';

// Import avatar images
import karukaAvatar from '@/assets/avatars/karuka.webp';
import alvaroAvatar from '@/assets/avatars/alvaro.jpg';
import ammAvatar from '@/assets/avatars/amm.jpg';
import saritaAvatar from '@/assets/avatars/sarita.jpg';
import markAvatar from '@/assets/avatars/mark.png';
import hajraAvatar from '@/assets/avatars/hajra.png';

// Demo users for role switching
export const demoUsers: User[] = [
  {
    id: 'user-1',
    name: 'Sarah Chen',
    email: 'sarah.chen@retailco.com',
    role: 'buyer',
    avatar: 'SC',
    avatarUrl: karukaAvatar,
    company: 'RetailCo',
    department: 'Quality Assurance'
  },
  {
    id: 'user-2',
    name: 'Marcus Wong',
    email: 'marcus@textilesupplier.com',
    role: 'supplier',
    avatar: 'MW',
    avatarUrl: alvaroAvatar,
    company: 'Textile Supplier Ltd',
    department: 'Operations'
  },
  {
    id: 'user-3',
    name: 'Dr. Amm Martinez',
    email: 'e.martinez@tht.com',
    role: 'lab_technician',
    avatar: 'AM',
    avatarUrl: ammAvatar,
    company: 'THT',
    department: 'Chemical Testing'
  },
  {
    id: 'user-4',
    name: 'Mark Richardson',
    email: 'j.richardson@retailco.com',
    role: 'manager',
    avatar: 'MR',
    avatarUrl: markAvatar,
    company: 'RetailCo',
    department: 'Global Sourcing'
  },
  {
    id: 'user-5',
    name: 'Hajra Khan',
    email: 'hajra@tht.com',
    role: 'admin',
    avatar: 'HK',
    avatarUrl: hajraAvatar,
    company: 'THT',
    department: 'Platform Admin'
  }
];

// Timeline events for TRF detail
const trfTimeline: TRFTimelineEvent[] = [
  {
    id: 'event-001',
    type: 'created',
    title: 'TRF Created',
    description: 'Test Request Form initiated for Cotton T-Shirt Collection SS26',
    actor: 'Sarah Chen',
    timestamp: '2026-01-15T09:00:00Z'
  },
  {
    id: 'event-002',
    type: 'submitted',
    title: 'TRF Submitted',
    description: 'Request submitted for lab processing',
    actor: 'Sarah Chen',
    timestamp: '2026-01-15T14:30:00Z'
  },
  {
    id: 'event-003',
    type: 'sample_received',
    title: 'Sample Received',
    description: '3 fabric swatches received at THT Hong Kong lab',
    actor: 'Lab Reception',
    timestamp: '2026-01-18T10:15:00Z'
  },
  {
    id: 'event-004',
    type: 'testing_started',
    title: 'Testing Initiated',
    description: 'Chemical analysis and physical testing commenced',
    actor: 'Dr. Elena Martinez',
    timestamp: '2026-01-20T08:00:00Z'
  },
  {
    id: 'event-005',
    type: 'test_completed',
    title: 'Physical Tests Completed',
    description: 'Tensile strength, pilling, and color fastness tests passed',
    actor: 'Lab Team A',
    timestamp: '2026-01-28T16:00:00Z'
  },
  {
    id: 'event-006',
    type: 'test_completed',
    title: 'Chemical Tests Completed',
    description: '10 of 12 tests completed. Minor deviation noted on pH level.',
    actor: 'Dr. Elena Martinez',
    timestamp: '2026-02-02T11:30:00Z'
  },
  {
    id: 'event-007',
    type: 'document_uploaded',
    title: 'Test Report Uploaded',
    description: 'Preliminary test report uploaded for review',
    actor: 'Dr. Elena Martinez',
    timestamp: '2026-02-03T14:00:00Z'
  },
  {
    id: 'event-008',
    type: 'comment',
    title: 'Review Comment',
    description: 'pH deviation (9.1 vs 9.0 threshold) is within acceptable variance. Recommend approval with notation.',
    actor: 'Lab Supervisor',
    timestamp: '2026-02-04T09:00:00Z'
  },
  {
    id: 'event-009',
    type: 'review_requested',
    title: 'Review Requested',
    description: 'TRF sent to buyer for final approval',
    actor: 'System',
    timestamp: '2026-02-04T09:15:00Z'
  }
];

// Test results for TRF detail
const trfTests: TRFTest[] = [
  { id: 'test-001', name: 'Formaldehyde Content', category: 'Chemical', status: 'passed', result: '< 20 ppm', threshold: '< 75 ppm', completedAt: '2026-02-02T10:00:00Z' },
  { id: 'test-002', name: 'pH Level', category: 'Chemical', status: 'passed', result: '9.1', threshold: '4.0 - 9.0', completedAt: '2026-02-02T10:30:00Z', notes: 'Slight deviation within acceptable variance' },
  { id: 'test-003', name: 'AZO Dyes', category: 'Chemical', status: 'passed', result: 'Not Detected', threshold: '< 30 ppm', completedAt: '2026-02-02T11:00:00Z' },
  { id: 'test-004', name: 'Heavy Metals (Lead)', category: 'Chemical', status: 'passed', result: '< 10 ppm', threshold: '< 90 ppm', completedAt: '2026-02-02T11:30:00Z' },
  { id: 'test-005', name: 'Tensile Strength', category: 'Physical', status: 'passed', result: '385 N', threshold: '> 200 N', completedAt: '2026-01-28T14:00:00Z' },
  { id: 'test-006', name: 'Tear Strength', category: 'Physical', status: 'passed', result: '28 N', threshold: '> 15 N', completedAt: '2026-01-28T14:30:00Z' },
  { id: 'test-007', name: 'Pilling Resistance', category: 'Physical', status: 'passed', result: 'Grade 4', threshold: '≥ Grade 3', completedAt: '2026-01-28T15:00:00Z' },
  { id: 'test-008', name: 'Color Fastness (Washing)', category: 'Color', status: 'passed', result: 'Grade 4-5', threshold: '≥ Grade 4', completedAt: '2026-01-28T15:30:00Z' },
  { id: 'test-009', name: 'Color Fastness (Light)', category: 'Color', status: 'passed', result: 'Grade 5', threshold: '≥ Grade 4', completedAt: '2026-01-28T16:00:00Z' },
  { id: 'test-010', name: 'Color Fastness (Rubbing)', category: 'Color', status: 'passed', result: 'Grade 4', threshold: '≥ Grade 3', completedAt: '2026-01-28T16:00:00Z' },
  { id: 'test-011', name: 'Dimensional Stability', category: 'Physical', status: 'in_progress', threshold: '< 5% shrinkage' },
  { id: 'test-012', name: 'Fiber Composition', category: 'Composition', status: 'pending', threshold: '100% Cotton (±3%)' },
];

// Documents for TRF detail
const trfDocuments: TRFDocument[] = [
  { id: 'doc-001', name: 'Product Specification Sheet.pdf', type: 'specification', uploadedBy: 'Sarah Chen', uploadedAt: '2026-01-15T09:05:00Z', size: '2.4 MB' },
  { id: 'doc-002', name: 'Sample Photos.zip', type: 'sample_photo', uploadedBy: 'Marcus Wong', uploadedAt: '2026-01-17T11:30:00Z', size: '15.8 MB' },
  { id: 'doc-003', name: 'Certificate of Analysis - Raw Material.pdf', type: 'coa', uploadedBy: 'Textile Supplier Ltd', uploadedAt: '2026-01-18T08:00:00Z', size: '1.2 MB' },
  { id: 'doc-004', name: 'Preliminary Test Report.pdf', type: 'test_report', uploadedBy: 'Dr. Elena Martinez', uploadedAt: '2026-02-03T14:00:00Z', size: '3.8 MB' },
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
    slaRemaining: 24,
    description: 'Spring/Summer 2026 Cotton T-Shirt collection testing for EU and US markets. Includes basic tees, v-necks, and crew neck styles in 8 colorways.',
    productCode: 'TSC-SS26-001',
    lotNumber: 'LOT-2026-001234',
    sampleCount: 3,
    timeline: trfTimeline,
    tests: trfTests,
    documents: trfDocuments
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
    slaRemaining: 72,
    description: 'Kids denim collection ages 4-14. Stretch denim with reinforced knees.',
    productCode: 'KDJ-2026-002',
    lotNumber: 'LOT-2026-001235',
    sampleCount: 5
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
    riskScore: 12,
    description: 'GOTS certified organic cotton onesies for newborns 0-12 months.',
    productCode: 'OBO-2026-003',
    lotNumber: 'LOT-2026-001236',
    sampleCount: 8
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
    slaRemaining: 240,
    description: 'High-impact sports bras with moisture-wicking technology.',
    productCode: 'SBP-2026-004',
    lotNumber: 'LOT-2026-001237',
    sampleCount: 4
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
    failedTests: 0,
    description: 'Synthetic down alternative insulation for winter outerwear.',
    productCode: 'WJI-2026-005',
    lotNumber: 'LOT-2026-001238',
    sampleCount: 2
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
    riskScore: 85,
    description: 'Premium silk blouse collection for professional wear.',
    productCode: 'SBC-2026-006',
    lotNumber: 'LOT-2026-001239',
    sampleCount: 6
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
    aiRecommendation: 'High priority for review — SLA deadline approaching. Suggested review order based on submission date.',
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
    aiRecommendation: 'Suggested review order: prioritise retest request based on historical 80% pass rate on retests.',
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
    email: 'procurement@textilesupplier.cn',
    contactPerson: 'Li Wei',
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
    email: 'quality@denimmasters.vn',
    contactPerson: 'Nguyen Thi Mai',
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
    email: 'sustainability@ecotextile.in',
    contactPerson: 'Priya Sharma',
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
    email: 'compliance@activewear.cn',
    contactPerson: 'Zhang Chen',
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

// Products
export const mockProducts: Product[] = [
  {
    id: 'prod-001',
    name: 'Cotton T-Shirt Collection SS26',
    code: 'TSC-SS26-001',
    category: 'Apparel',
    supplier: 'Textile Supplier Ltd',
    supplierId: 'supplier-001',
    description: 'Premium cotton t-shirts for Spring/Summer 2026. Available in 8 colorways including basic tees, v-necks, and crew necks.',
    status: 'active',
    complianceStatus: 'pending_review',
    lastTested: '2026-02-04',
    activeTRFs: 1,
    passRate: 83,
    riskScore: 72,
    images: [
      { id: 'img-001-1', url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600', alt: 'White cotton t-shirt front view', isPrimary: true },
      { id: 'img-001-2', url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600', alt: 'Cotton t-shirt stack' },
      { id: 'img-001-3', url: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600', alt: 'T-shirt on hanger' },
      { id: 'img-001-4', url: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600', alt: 'T-shirt fabric close-up' }
    ],
    specifications: {
      material: '100% Organic Cotton',
      weight: '180 GSM',
      dimensions: 'S-3XL',
      origin: 'China'
    }
  },
  {
    id: 'prod-002',
    name: 'Kids Denim Jeans',
    code: 'KDJ-2026-002',
    category: 'Apparel',
    supplier: 'Denim Masters Co',
    supplierId: 'supplier-002',
    description: 'Stretch denim jeans for kids ages 4-14 with reinforced knees for durability.',
    status: 'active',
    complianceStatus: 'pending_review',
    lastTested: '2026-02-03',
    activeTRFs: 1,
    passRate: 67,
    riskScore: 58,
    images: [
      { id: 'img-002-1', url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600', alt: 'Kids denim jeans', isPrimary: true },
      { id: 'img-002-2', url: 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=600', alt: 'Denim fabric texture' }
    ],
    specifications: {
      material: '98% Cotton, 2% Elastane',
      weight: '320 GSM',
      dimensions: 'Ages 4-14',
      origin: 'Vietnam'
    }
  },
  {
    id: 'prod-003',
    name: 'Organic Baby Onesies',
    code: 'OBO-2026-003',
    category: 'Infant Apparel',
    supplier: 'EcoTextile Inc',
    supplierId: 'supplier-003',
    description: 'GOTS certified organic cotton onesies for newborns 0-12 months.',
    status: 'active',
    complianceStatus: 'compliant',
    lastTested: '2026-02-01',
    activeTRFs: 0,
    passRate: 100,
    riskScore: 12,
    images: [
      { id: 'img-003-1', url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600', alt: 'Baby onesie', isPrimary: true }
    ],
    specifications: {
      material: '100% GOTS Organic Cotton',
      weight: '160 GSM',
      dimensions: '0-12 months',
      origin: 'India'
    }
  },
  {
    id: 'prod-004',
    name: 'Sports Bra Performance Line',
    code: 'SBP-2026-004',
    category: 'Athletic Wear',
    supplier: 'ActiveWear Partners',
    supplierId: 'supplier-004',
    description: 'High-impact sports bras with moisture-wicking technology for intense workouts.',
    status: 'active',
    complianceStatus: 'pending_review',
    lastTested: '2026-02-04',
    activeTRFs: 1,
    passRate: 0,
    riskScore: 25,
    specifications: {
      material: '85% Polyester, 15% Spandex',
      weight: '220 GSM',
      dimensions: 'XS-XL',
      origin: 'China'
    }
  },
  {
    id: 'prod-005',
    name: 'Winter Jacket Insulation',
    code: 'WJI-2026-005',
    category: 'Outerwear',
    supplier: 'NorthTech Fabrics',
    supplierId: 'supplier-001',
    description: 'Synthetic down alternative insulation for winter outerwear.',
    status: 'pending',
    complianceStatus: 'pending_review',
    lastTested: undefined,
    activeTRFs: 1,
    passRate: 0,
    riskScore: 35,
    specifications: {
      material: '100% Recycled Polyester Fill',
      weight: '120 GSM',
      dimensions: 'N/A',
      origin: 'China'
    }
  },
  {
    id: 'prod-006',
    name: 'Silk Blouse Collection',
    code: 'SBC-2026-006',
    category: 'Formal Wear',
    supplier: 'Premium Silk Ltd',
    supplierId: 'supplier-001',
    description: 'Premium silk blouses for professional wear.',
    status: 'active',
    complianceStatus: 'non_compliant',
    lastTested: '2026-02-02',
    activeTRFs: 0,
    passRate: 50,
    riskScore: 85,
    specifications: {
      material: '100% Mulberry Silk',
      weight: '16 Momme',
      dimensions: 'XS-XXL',
      origin: 'China'
    }
  },
  {
    id: 'prod-007',
    name: 'Eco-Friendly Sneakers',
    code: 'EFS-2026-007',
    category: 'Footwear',
    supplier: 'EcoTextile Inc',
    supplierId: 'supplier-003',
    description: 'Sustainable sneakers made from recycled ocean plastics and organic cotton.',
    status: 'active',
    complianceStatus: 'compliant',
    lastTested: '2026-01-28',
    activeTRFs: 0,
    passRate: 95,
    riskScore: 15,
    specifications: {
      material: 'Recycled PET, Organic Cotton Upper',
      weight: '280g per shoe',
      dimensions: 'EU 36-46',
      origin: 'India'
    }
  },
  {
    id: 'prod-008',
    name: 'Yoga Leggings Pro',
    code: 'YLP-2026-008',
    category: 'Athletic Wear',
    supplier: 'ActiveWear Partners',
    supplierId: 'supplier-004',
    description: 'High-waisted yoga leggings with 4-way stretch and hidden pocket.',
    status: 'active',
    complianceStatus: 'compliant',
    lastTested: '2026-01-25',
    activeTRFs: 0,
    passRate: 92,
    riskScore: 18,
    specifications: {
      material: '75% Nylon, 25% Spandex',
      weight: '280 GSM',
      dimensions: 'XS-2XL',
      origin: 'China'
    }
  }
];

// Inspections
export const mockInspections: Inspection[] = [
  {
    id: 'insp-001',
    type: 'factory_audit',
    title: 'Annual Factory Audit - Dongguan Factory A',
    description: 'Comprehensive annual audit covering quality systems, safety protocols, and worker welfare.',
    factoryId: 'factory-001',
    factoryName: 'Dongguan Factory A',
    supplierId: 'supplier-001',
    supplierName: 'Textile Supplier Ltd',
    location: 'Dongguan, Guangdong, China',
    scheduledDate: '2026-02-12',
    scheduledTime: '09:00',
    duration: 8,
    status: 'scheduled',
    priority: 'critical',
    assignee: 'James Richardson',
    auditorTeam: ['James Richardson', 'Local Auditor'],
    createdAt: '2026-02-01'
  },
  {
    id: 'insp-002',
    type: 'quality_check',
    title: 'Pre-Shipment Quality Inspection',
    description: 'Quality inspection for Cotton T-Shirt Collection SS26 before shipment.',
    factoryId: 'factory-001',
    factoryName: 'Dongguan Factory A',
    supplierId: 'supplier-001',
    supplierName: 'Textile Supplier Ltd',
    location: 'Dongguan, Guangdong, China',
    scheduledDate: '2026-02-08',
    scheduledTime: '10:00',
    duration: 4,
    status: 'scheduled',
    priority: 'at-risk',
    assignee: 'Sarah Chen',
    createdAt: '2026-02-03'
  },
  {
    id: 'insp-003',
    type: 'social_compliance',
    title: 'Social Compliance Audit',
    description: 'Audit for worker conditions, wages, and labor practices compliance.',
    factoryId: 'factory-002',
    factoryName: 'Vietnam Plant 2',
    supplierId: 'supplier-002',
    supplierName: 'Denim Masters Co',
    location: 'Ho Chi Minh City, Vietnam',
    scheduledDate: '2026-02-15',
    scheduledTime: '08:30',
    duration: 6,
    status: 'scheduled',
    priority: 'on-track',
    assignee: 'External Auditor',
    auditorTeam: ['External Auditor', 'Local Representative'],
    createdAt: '2026-01-28'
  },
  {
    id: 'insp-004',
    type: 'environmental',
    title: 'Environmental Compliance Review',
    description: 'Review of waste management, water usage, and emissions compliance.',
    factoryId: 'factory-003',
    factoryName: 'Sustainable Mill 1',
    supplierId: 'supplier-003',
    supplierName: 'EcoTextile Inc',
    location: 'Mumbai, India',
    scheduledDate: '2026-02-20',
    scheduledTime: '09:00',
    duration: 5,
    status: 'scheduled',
    priority: 'on-track',
    assignee: 'Dr. Elena Martinez',
    createdAt: '2026-02-01'
  },
  {
    id: 'insp-005',
    type: 'factory_audit',
    title: 'Quarterly Audit - Shanghai Tech Facility',
    description: 'Quarterly review of production capabilities and quality management systems.',
    factoryId: 'factory-004',
    factoryName: 'Shanghai Tech Facility',
    supplierId: 'supplier-004',
    supplierName: 'ActiveWear Partners',
    location: 'Shanghai, China',
    scheduledDate: '2026-02-05',
    scheduledTime: '09:00',
    duration: 6,
    status: 'in_progress',
    priority: 'at-risk',
    assignee: 'James Richardson',
    auditorTeam: ['James Richardson'],
    findings: 3,
    createdAt: '2026-01-20'
  },
  {
    id: 'insp-006',
    type: 'pre_shipment',
    title: 'Pre-Shipment Inspection - Kids Denim',
    description: 'Final inspection before shipment of Kids Denim Jeans order.',
    factoryId: 'factory-002',
    factoryName: 'Vietnam Plant 2',
    supplierId: 'supplier-002',
    supplierName: 'Denim Masters Co',
    location: 'Ho Chi Minh City, Vietnam',
    scheduledDate: '2026-01-30',
    scheduledTime: '14:00',
    duration: 3,
    status: 'completed',
    priority: 'on-track',
    assignee: 'Sarah Chen',
    findings: 2,
    passRate: 94,
    notes: 'Minor stitching issues on 3% of samples. Corrective action implemented.',
    createdAt: '2026-01-25',
    completedAt: '2026-01-30'
  },
  {
    id: 'insp-007',
    type: 'quality_check',
    title: 'In-Line Quality Check',
    description: 'Mid-production quality check for Yoga Leggings line.',
    factoryId: 'factory-004',
    factoryName: 'Shanghai Tech Facility',
    supplierId: 'supplier-004',
    supplierName: 'ActiveWear Partners',
    location: 'Shanghai, China',
    scheduledDate: '2026-01-28',
    scheduledTime: '11:00',
    duration: 4,
    status: 'completed',
    priority: 'on-track',
    assignee: 'Lab Team A',
    findings: 0,
    passRate: 98,
    notes: 'All quality metrics within acceptable range. Production approved to continue.',
    createdAt: '2026-01-22',
    completedAt: '2026-01-28'
  },
  {
    id: 'insp-008',
    type: 'factory_audit',
    title: 'Follow-Up Audit - Denim Masters',
    description: 'Follow-up audit to verify corrective actions from previous findings.',
    factoryId: 'factory-002',
    factoryName: 'Vietnam Plant 2',
    supplierId: 'supplier-002',
    supplierName: 'Denim Masters Co',
    location: 'Ho Chi Minh City, Vietnam',
    scheduledDate: '2026-02-25',
    scheduledTime: '09:00',
    duration: 4,
    status: 'scheduled',
    priority: 'critical',
    assignee: 'James Richardson',
    auditorTeam: ['James Richardson', 'External Auditor'],
    createdAt: '2026-02-02'
  },
  {
    id: 'insp-009',
    type: 'quality_check',
    title: 'Raw Material Inspection',
    description: 'Inspection of incoming raw materials for Winter Jacket production.',
    factoryId: 'factory-005',
    factoryName: 'Jiangsu Factory B',
    supplierId: 'supplier-005',
    supplierName: 'NorthTech Fabrics',
    location: 'Jiangsu, China',
    scheduledDate: '2026-02-10',
    scheduledTime: '10:00',
    duration: 3,
    status: 'in_progress',
    priority: 'on-track',
    assignee: 'Lab Team A',
    findings: 1,
    createdAt: '2026-02-05'
  },
  {
    id: 'insp-010',
    type: 'social_compliance',
    title: 'Annual Social Audit - EcoTextile',
    description: 'Annual comprehensive social compliance audit.',
    factoryId: 'factory-003',
    factoryName: 'Sustainable Mill 1',
    supplierId: 'supplier-003',
    supplierName: 'EcoTextile Inc',
    location: 'Mumbai, India',
    scheduledDate: '2026-01-20',
    scheduledTime: '09:00',
    duration: 8,
    status: 'completed',
    priority: 'on-track',
    assignee: 'External Auditor',
    auditorTeam: ['External Auditor', 'James Richardson'],
    findings: 1,
    passRate: 96,
    notes: 'Minor documentation issue resolved on-site. Factory maintains excellent standards.',
    createdAt: '2026-01-10',
    completedAt: '2026-01-20'
  },
  {
    id: 'insp-011',
    type: 'pre_shipment',
    title: 'Pre-Shipment - Organic Baby Onesies',
    description: 'Final inspection before shipment of organic baby clothing line.',
    factoryId: 'factory-003',
    factoryName: 'Sustainable Mill 1',
    supplierId: 'supplier-003',
    supplierName: 'EcoTextile Inc',
    location: 'Mumbai, India',
    scheduledDate: '2026-01-25',
    scheduledTime: '14:00',
    duration: 3,
    status: 'completed',
    priority: 'on-track',
    assignee: 'Sarah Chen',
    findings: 0,
    passRate: 100,
    notes: 'All items passed inspection. Excellent quality throughout the order.',
    createdAt: '2026-01-18',
    completedAt: '2026-01-25'
  },
  {
    id: 'insp-012',
    type: 'factory_audit',
    title: 'Initial Factory Qualification',
    description: 'Initial qualification audit for new potential supplier.',
    factoryId: 'factory-006',
    factoryName: 'Premium Silk Mill',
    supplierId: 'supplier-006',
    supplierName: 'Premium Silk Ltd',
    location: 'Hangzhou, China',
    scheduledDate: '2026-02-18',
    scheduledTime: '09:00',
    duration: 8,
    status: 'postponed',
    priority: 'at-risk',
    assignee: 'James Richardson',
    notes: 'Postponed due to factory renovation. Rescheduling for March.',
    createdAt: '2026-01-15'
  },
  {
    id: 'insp-013',
    type: 'environmental',
    title: 'Environmental Audit - Cancelled',
    description: 'Environmental compliance audit.',
    factoryId: 'factory-002',
    factoryName: 'Vietnam Plant 2',
    supplierId: 'supplier-002',
    supplierName: 'Denim Masters Co',
    location: 'Ho Chi Minh City, Vietnam',
    scheduledDate: '2026-02-01',
    scheduledTime: '09:00',
    duration: 5,
    status: 'cancelled',
    priority: 'info',
    assignee: 'External Auditor',
    notes: 'Cancelled - merged with comprehensive social compliance audit.',
    createdAt: '2026-01-10'
  },
  // Additional completed inspections with detailed findings
  {
    id: 'insp-014',
    type: 'factory_audit',
    title: 'Comprehensive Audit - Textile Supplier HQ',
    description: 'Full factory audit covering production, quality, safety, and environmental systems.',
    factoryId: 'factory-001',
    factoryName: 'Dongguan Factory A',
    supplierId: 'supplier-001',
    supplierName: 'Textile Supplier Ltd',
    location: 'Dongguan, Guangdong, China',
    scheduledDate: '2026-01-15',
    scheduledTime: '08:00',
    duration: 8,
    status: 'completed',
    priority: 'on-track',
    assignee: 'James Richardson',
    auditorTeam: ['James Richardson', 'Dr. Elena Martinez'],
    findings: 4,
    passRate: 89,
    notes: 'Good overall performance. Minor findings in waste management and PPE usage. Corrective action plan submitted.',
    createdAt: '2026-01-05',
    completedAt: '2026-01-15'
  },
  {
    id: 'insp-015',
    type: 'quality_check',
    title: 'Final QC - Sports Bra Collection',
    description: 'Final quality control before shipping Sports Bra Performance Line.',
    factoryId: 'factory-004',
    factoryName: 'Shanghai Tech Facility',
    supplierId: 'supplier-004',
    supplierName: 'ActiveWear Partners',
    location: 'Shanghai, China',
    scheduledDate: '2026-01-22',
    scheduledTime: '09:00',
    duration: 5,
    status: 'completed',
    priority: 'on-track',
    assignee: 'Sarah Chen',
    findings: 1,
    passRate: 97,
    notes: 'Minor label alignment issue on 2% of units. Corrected on-site.',
    createdAt: '2026-01-15',
    completedAt: '2026-01-22'
  },
  // Additional in-progress inspections
  {
    id: 'insp-016',
    type: 'social_compliance',
    title: 'Urgent Worker Safety Review',
    description: 'Emergency review triggered by incident report at Bangladesh facility.',
    factoryId: 'factory-007',
    factoryName: 'Dhaka Textile Hub',
    supplierId: 'supplier-007',
    supplierName: 'Bengal Fabrics Ltd',
    location: 'Dhaka, Bangladesh',
    scheduledDate: '2026-02-04',
    scheduledTime: '07:00',
    duration: 10,
    status: 'in_progress',
    priority: 'critical',
    assignee: 'External Auditor',
    auditorTeam: ['External Auditor', 'Safety Specialist', 'Local Representative'],
    findings: 5,
    createdAt: '2026-02-03'
  },
  {
    id: 'insp-017',
    type: 'pre_shipment',
    title: 'Pre-Shipment - Winter Jacket Line',
    description: 'Final pre-shipment inspection for thermal jacket collection.',
    factoryId: 'factory-005',
    factoryName: 'Jiangsu Factory B',
    supplierId: 'supplier-005',
    supplierName: 'NorthTech Fabrics',
    location: 'Jiangsu, China',
    scheduledDate: '2026-02-06',
    scheduledTime: '13:00',
    duration: 4,
    status: 'in_progress',
    priority: 'at-risk',
    assignee: 'Lab Team A',
    findings: 2,
    createdAt: '2026-02-01'
  },
  // Additional critical inspections
  {
    id: 'insp-018',
    type: 'factory_audit',
    title: 'Critical Re-Audit - Silk Mill',
    description: 'Mandatory re-audit following failed initial qualification. Multiple non-conformances identified.',
    factoryId: 'factory-006',
    factoryName: 'Premium Silk Mill',
    supplierId: 'supplier-006',
    supplierName: 'Premium Silk Ltd',
    location: 'Hangzhou, China',
    scheduledDate: '2026-02-07',
    scheduledTime: '08:00',
    duration: 8,
    status: 'scheduled',
    priority: 'critical',
    assignee: 'James Richardson',
    auditorTeam: ['James Richardson', 'External Auditor', 'Quality Specialist'],
    createdAt: '2026-02-01'
  },
  {
    id: 'insp-019',
    type: 'environmental',
    title: 'Wastewater Compliance Check',
    description: 'Urgent environmental inspection following regulatory notice about wastewater discharge.',
    factoryId: 'factory-002',
    factoryName: 'Vietnam Plant 2',
    supplierId: 'supplier-002',
    supplierName: 'Denim Masters Co',
    location: 'Ho Chi Minh City, Vietnam',
    scheduledDate: '2026-02-09',
    scheduledTime: '08:00',
    duration: 6,
    status: 'scheduled',
    priority: 'critical',
    assignee: 'Dr. Elena Martinez',
    auditorTeam: ['Dr. Elena Martinez', 'Environmental Specialist'],
    createdAt: '2026-02-04'
  },
  // More completed with varied pass rates
  {
    id: 'insp-020',
    type: 'quality_check',
    title: 'Batch QC - Denim Wash Test',
    description: 'Quality check on new wash treatment for denim products.',
    factoryId: 'factory-002',
    factoryName: 'Vietnam Plant 2',
    supplierId: 'supplier-002',
    supplierName: 'Denim Masters Co',
    location: 'Ho Chi Minh City, Vietnam',
    scheduledDate: '2026-01-18',
    scheduledTime: '10:00',
    duration: 4,
    status: 'completed',
    priority: 'at-risk',
    assignee: 'Lab Team A',
    findings: 6,
    passRate: 72,
    notes: 'Multiple color bleeding issues detected. Wash process requires adjustment. Hold placed on production.',
    createdAt: '2026-01-12',
    completedAt: '2026-01-18'
  },
  {
    id: 'insp-021',
    type: 'social_compliance',
    title: 'Worker Welfare Assessment',
    description: 'Routine assessment of worker accommodation and welfare facilities.',
    factoryId: 'factory-007',
    factoryName: 'Dhaka Textile Hub',
    supplierId: 'supplier-007',
    supplierName: 'Bengal Fabrics Ltd',
    location: 'Dhaka, Bangladesh',
    scheduledDate: '2026-01-10',
    scheduledTime: '09:00',
    duration: 6,
    status: 'completed',
    priority: 'at-risk',
    assignee: 'External Auditor',
    auditorTeam: ['External Auditor', 'Local Representative'],
    findings: 8,
    passRate: 65,
    notes: 'Significant concerns with dormitory conditions and fire safety. Immediate corrective action required.',
    createdAt: '2026-01-03',
    completedAt: '2026-01-10'
  },
  {
    id: 'insp-022',
    type: 'factory_audit',
    title: 'ISO 9001 Compliance Audit',
    description: 'Annual ISO 9001 quality management system compliance verification.',
    factoryId: 'factory-004',
    factoryName: 'Shanghai Tech Facility',
    supplierId: 'supplier-004',
    supplierName: 'ActiveWear Partners',
    location: 'Shanghai, China',
    scheduledDate: '2026-01-08',
    scheduledTime: '09:00',
    duration: 8,
    status: 'completed',
    priority: 'on-track',
    assignee: 'External Auditor',
    auditorTeam: ['External Auditor', 'ISO Specialist'],
    findings: 2,
    passRate: 95,
    notes: 'Minor documentation gaps in calibration records. Overall excellent compliance.',
    createdAt: '2025-12-20',
    completedAt: '2026-01-08'
  }
];

// Factory locations for map view
export const factoryLocations = [
  { id: 'factory-001', name: 'Dongguan Factory A', supplier: 'Textile Supplier Ltd', lat: 23.0489, lng: 113.7447, country: 'China', inspectionCount: 3, status: 'active' as const },
  { id: 'factory-002', name: 'Vietnam Plant 2', supplier: 'Denim Masters Co', lat: 10.8231, lng: 106.6297, country: 'Vietnam', inspectionCount: 5, status: 'at-risk' as const },
  { id: 'factory-003', name: 'Sustainable Mill 1', supplier: 'EcoTextile Inc', lat: 19.0760, lng: 72.8777, country: 'India', inspectionCount: 3, status: 'active' as const },
  { id: 'factory-004', name: 'Shanghai Tech Facility', supplier: 'ActiveWear Partners', lat: 31.2304, lng: 121.4737, country: 'China', inspectionCount: 4, status: 'active' as const },
  { id: 'factory-005', name: 'Jiangsu Factory B', supplier: 'NorthTech Fabrics', lat: 32.0617, lng: 118.7778, country: 'China', inspectionCount: 2, status: 'active' as const },
  { id: 'factory-006', name: 'Premium Silk Mill', supplier: 'Premium Silk Ltd', lat: 30.2741, lng: 120.1551, country: 'China', inspectionCount: 2, status: 'at-risk' as const },
  { id: 'factory-007', name: 'Dhaka Textile Hub', supplier: 'Bengal Fabrics Ltd', lat: 23.8103, lng: 90.4125, country: 'Bangladesh', inspectionCount: 2, status: 'critical' as const },
];
