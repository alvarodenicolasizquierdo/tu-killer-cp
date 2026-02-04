import { 
  FileText, 
  Package, 
  FlaskConical, 
  ClipboardCheck, 
  Factory, 
  Shield, 
  Users, 
  BarChart3,
  Settings,
  CheckCircle2,
  AlertTriangle,
  Clock,
  HelpCircle,
  BookOpen,
  Video,
  MessageSquare,
  Lightbulb,
  LucideIcon
} from 'lucide-react';

export interface HelpArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: HelpCategory;
  tags: string[];
  objectTypes: string[]; // TRF, Component, Style, etc.
  roles: string[]; // buyer, supplier, lab_technician, etc.
  source?: {
    type: 'email' | 'webinar' | 'guide' | 'sop';
    reference: string;
    date: string;
  };
  relatedArticles?: string[];
  viewCount: number;
  helpfulCount: number;
  lastUpdated: string;
}

export interface ContextualQuestion {
  id: string;
  question: string;
  answer: string;
  confidence: number; // 0-100
  screenContext: string; // route/page identifier
  objectType?: string;
  source?: {
    type: 'email' | 'webinar' | 'guide' | 'ai' | 'sop';
    reference: string;
  };
  askedCount: number;
}

export interface KnownIssue {
  id: string;
  title: string;
  description: string;
  status: 'investigating' | 'in_progress' | 'resolved';
  affectedScreens: string[];
  workaround?: string;
  reportedAt: string;
  resolvedAt?: string;
}

export interface RecentChange {
  id: string;
  title: string;
  description: string;
  type: 'feature' | 'improvement' | 'fix';
  relatedScreens: string[];
  date: string;
}

export type HelpCategory = 
  | 'getting_started'
  | 'trfs'
  | 'testing'
  | 'approvals'
  | 'suppliers'
  | 'components'
  | 'care_labelling'
  | 'gsw'
  | 'reporting'
  | 'admin';

export const helpCategories: Record<HelpCategory, { label: string; icon: LucideIcon; description: string }> = {
  getting_started: { 
    label: 'Getting Started', 
    icon: BookOpen, 
    description: 'New to CARLOS? Start here.' 
  },
  trfs: { 
    label: 'Test Request Forms', 
    icon: FileText, 
    description: 'Creating, managing, and tracking TRFs.' 
  },
  testing: { 
    label: 'Testing & Labs', 
    icon: FlaskConical, 
    description: 'Understanding testing levels, results, and lab workflows.' 
  },
  approvals: { 
    label: 'Approvals', 
    icon: CheckCircle2, 
    description: 'Approval workflows, self-approval levels, and permissions.' 
  },
  suppliers: { 
    label: 'Suppliers', 
    icon: Users, 
    description: 'Managing suppliers, certificates, and compliance.' 
  },
  components: { 
    label: 'Components', 
    icon: Package, 
    description: 'Component library, linking, and testing requirements.' 
  },
  care_labelling: { 
    label: 'Care Labelling', 
    icon: ClipboardCheck, 
    description: 'Care label packages, symbols, and compliance.' 
  },
  gsw: { 
    label: 'GSW', 
    icon: Factory, 
    description: 'Garment Specification Workbook submissions.' 
  },
  reporting: { 
    label: 'Reports & Analytics', 
    icon: BarChart3, 
    description: 'Understanding dashboards and generating reports.' 
  },
  admin: { 
    label: 'Admin & Settings', 
    icon: Settings, 
    description: 'System configuration and user management.' 
  },
};

// Screen-specific help context mapping
export const screenHelpContext: Record<string, {
  title: string;
  description: string;
  primaryCategory: HelpCategory;
  commonQuestionIds: string[];
  tipOfTheDay?: string;
}> = {
  '/': {
    title: 'Dashboard',
    description: 'Your personalized command center showing prioritized tasks and key metrics.',
    primaryCategory: 'getting_started',
    commonQuestionIds: ['q-001', 'q-002', 'q-003'],
    tipOfTheDay: 'Click on any KPI card to drill down into detailed data.'
  },
  '/trfs': {
    title: 'Test Request Forms',
    description: 'Manage all your TRFs in one place.',
    primaryCategory: 'trfs',
    commonQuestionIds: ['q-004', 'q-005', 'q-006'],
    tipOfTheDay: 'Use the status filters to quickly find TRFs needing your attention.'
  },
  '/styles': {
    title: 'Styles',
    description: 'Browse and manage product collections and styles.',
    primaryCategory: 'components',
    commonQuestionIds: ['q-007', 'q-008', 'q-009'],
    tipOfTheDay: 'Link components to styles to automatically inherit testing requirements.'
  },
  '/components': {
    title: 'Component Library',
    description: 'Centralized library of all tested and approved components.',
    primaryCategory: 'components',
    commonQuestionIds: ['q-010', 'q-011', 'q-012'],
    tipOfTheDay: 'Components with area >10% require full testing by policy.'
  },
  '/testing-levels': {
    title: 'Testing Levels',
    description: 'Understand Base, Bulk, and Product testing gates.',
    primaryCategory: 'testing',
    commonQuestionIds: ['q-013', 'q-014', 'q-015'],
    tipOfTheDay: 'Base approval is required before Bulk testing can begin.'
  },
  '/care-labelling': {
    title: 'Care Labelling',
    description: 'Manage care label packages and ensure compliance.',
    primaryCategory: 'care_labelling',
    commonQuestionIds: ['q-016', 'q-017', 'q-018'],
    tipOfTheDay: 'AI can suggest care instructions based on fabric composition.'
  },
  '/gsw': {
    title: 'Garment Specification Workbook',
    description: 'Upload and submit GSW documents for approval.',
    primaryCategory: 'gsw',
    commonQuestionIds: ['q-019', 'q-020'],
    tipOfTheDay: 'GSW submission is the final gate before production approval.'
  },
  '/suppliers': {
    title: 'Suppliers',
    description: 'Monitor supplier compliance and performance.',
    primaryCategory: 'suppliers',
    commonQuestionIds: ['q-021', 'q-022', 'q-023', 'q-031', 'q-032'],
    tipOfTheDay: 'Send sustainability questionnaires to suppliers before their annual review to maintain compliance.'
  },
  '/analytics': {
    title: 'Analytics & Reports',
    description: 'Data insights and operational reporting.',
    primaryCategory: 'reporting',
    commonQuestionIds: ['q-024', 'q-025', 'q-033', 'q-034', 'q-035'],
    tipOfTheDay: 'Use the Collection Readiness Funnel to identify bottlenecks before they impact launch dates.'
  },
  '/settings': {
    title: 'Settings',
    description: 'Configure your preferences and system settings.',
    primaryCategory: 'admin',
    commonQuestionIds: ['q-026', 'q-027'],
  },
  '/self-approval-levels': {
    title: 'Self-Approval Levels',
    description: 'Configure approval entitlements (None/Bronze/Silver/Gold).',
    primaryCategory: 'approvals',
    commonQuestionIds: ['q-028', 'q-029', 'q-030'],
    tipOfTheDay: 'Higher approval levels reduce cycle time but require governance training.'
  },
};

// Mock knowledge base articles
export const mockArticles: HelpArticle[] = [
  {
    id: 'art-001',
    title: 'Understanding TRF Statuses',
    summary: 'Learn what each TRF status means and what actions are required.',
    content: `## TRF Status Guide

A TRF (Test Request Form) moves through several statuses during its lifecycle:

### Draft
The TRF has been created but not yet submitted. You can still edit all fields.

### Submitted
The TRF has been sent for testing. Samples should be dispatched to the lab.

### In Progress
The lab has received samples and testing has begun.

### Pending Review
All tests are complete and the TRF is awaiting buyer approval.

### Approved
The TRF has been approved and products can proceed to the next stage.

### Rejected
One or more tests failed or the TRF was rejected. Review the comments for next steps.`,
    category: 'trfs',
    tags: ['status', 'workflow', 'basics'],
    objectTypes: ['trf'],
    roles: ['buyer', 'supplier', 'lab_technician', 'manager'],
    source: {
      type: 'guide',
      reference: 'CARLOS User Guide v2.1',
      date: '2025-11-15'
    },
    viewCount: 1245,
    helpfulCount: 892,
    lastUpdated: '2025-12-01'
  },
  {
    id: 'art-002',
    title: 'Why can\'t I approve this TRF?',
    summary: 'Understanding approval permissions and self-approval levels.',
    content: `## Approval Permissions

Your ability to approve TRFs depends on your **Self-Approval Level**:

### None
You cannot approve any TRFs. All approvals must go to a higher-level user.

### Bronze
You can approve TRFs with risk score below 30 and no failed tests.

### Silver
You can approve TRFs with risk score below 60 and minor deviations only.

### Gold
You can approve most TRFs except those flagged for governance review.

### Checking Your Level
Go to **Settings > Approval Levels** to see your current entitlement.

### Requesting an Upgrade
Contact your admin or governance team to request a level upgrade.`,
    category: 'approvals',
    tags: ['permissions', 'self-approval', 'governance'],
    objectTypes: ['trf', 'approval'],
    roles: ['buyer', 'manager'],
    source: {
      type: 'email',
      reference: 'Leo - Approval Policy Update, Mar 2025',
      date: '2025-03-15'
    },
    viewCount: 2341,
    helpfulCount: 1876,
    lastUpdated: '2025-12-15'
  },
  {
    id: 'art-003',
    title: 'Base vs Bulk vs Product Testing',
    summary: 'Understanding the three testing gates and when each applies.',
    content: `## Testing Levels Explained

CARLOS enforces a three-gate testing approach:

### Base Testing
- Tests the raw material/component
- Must pass before any bulk production
- Covers chemical safety, basic physical properties

### Bulk Testing
- Tests production samples
- Only available after Base approval
- Focuses on consistency and durability

### Product Testing
- Tests the finished garment
- Final gate before shipment
- Includes fit, labelling, and final inspection

### Key Rule
**Bulk testing is blocked until Base is approved.** This prevents wasted testing costs on materials that may fail initial screening.`,
    category: 'testing',
    tags: ['testing levels', 'gates', 'workflow'],
    objectTypes: ['trf', 'component', 'style'],
    roles: ['buyer', 'supplier', 'lab_technician'],
    source: {
      type: 'webinar',
      reference: 'Testing Best Practices - Jan 2025 Webinar',
      date: '2025-01-20'
    },
    viewCount: 1567,
    helpfulCount: 1234,
    lastUpdated: '2025-11-28'
  },
  {
    id: 'art-004',
    title: 'Component Area Percentage Rules',
    summary: 'Why some components require full testing based on garment area.',
    content: `## Component Testing Policy

Not all components require the same level of testing. The rule is:

### Area Threshold
Components covering **more than 10%** of the total garment area require **full testing**.

### Why This Matters
- Safety: Larger areas = more skin contact
- Performance: Major components affect overall product quality
- Compliance: Regulations often focus on primary materials

### Examples
- Main fabric (85%) → Full testing required
- Pocket lining (8%) → Reduced testing eligible
- Trim (3%) → Reduced testing eligible
- Large appliqué (15%) → Full testing required

### Override Requests
If you believe a component is incorrectly categorized, contact Quality Assurance.`,
    category: 'components',
    tags: ['area percentage', 'testing policy', 'rules'],
    objectTypes: ['component'],
    roles: ['buyer', 'supplier'],
    source: {
      type: 'sop',
      reference: 'SOP-QA-017 Component Testing Policy',
      date: '2025-06-01'
    },
    viewCount: 876,
    helpfulCount: 654,
    lastUpdated: '2025-10-15'
  },
  {
    id: 'art-005',
    title: 'Generating Care Labels',
    summary: 'How to create compliant care label packages for your products.',
    content: `## Care Label Creation

Care labels must meet regulatory requirements for each target market.

### Required Information
- Fiber content (with percentages)
- Care symbols (wash, bleach, dry, iron, professional care)
- Country of origin
- Manufacturer identification

### AI Suggestions
CARLOS AI can suggest care instructions based on:
- Fabric composition
- Previous similar products
- Market-specific requirements

### Validation
Before finalizing, ensure:
- All mandatory fields are complete
- Symbols match the written instructions
- Market-specific variations are created

### Approval
Care label packages require approval before production marking.`,
    category: 'care_labelling',
    tags: ['care labels', 'compliance', 'symbols'],
    objectTypes: ['care_label', 'style'],
    roles: ['buyer', 'supplier'],
    source: {
      type: 'guide',
      reference: 'Care Labelling Handbook v3.0',
      date: '2025-09-01'
    },
    viewCount: 1123,
    helpfulCount: 901,
    lastUpdated: '2025-11-30'
  },
];

// Contextual questions - what people ask on specific screens
export const contextualQuestions: ContextualQuestion[] = [
  // Dashboard questions
  {
    id: 'q-001',
    question: 'Why is this task marked as critical?',
    answer: 'Tasks are marked critical based on SLA remaining time (< 24 hours) and downstream impact. Critical tasks can block shipments or launch dates if not resolved promptly.',
    confidence: 95,
    screenContext: '/',
    source: { type: 'ai', reference: 'Context-aware analysis' },
    askedCount: 342
  },
  {
    id: 'q-002',
    question: 'How is the readiness score calculated?',
    answer: 'The readiness score combines: component testing status (30%), TRF approval rate (25%), supplier compliance (20%), care labelling completeness (15%), and GSW submission status (10%).',
    confidence: 90,
    screenContext: '/',
    source: { type: 'webinar', reference: 'Q4 2025 Metrics Webinar' },
    askedCount: 256
  },
  {
    id: 'q-003',
    question: 'What does the AI confidence percentage mean?',
    answer: 'AI confidence indicates how certain the system is about a recommendation. Above 85% means the recommendation is based on strong historical patterns. Below 70% means manual review is advised.',
    confidence: 92,
    screenContext: '/',
    source: { type: 'guide', reference: 'AI Features Guide' },
    askedCount: 189
  },
  // TRF questions
  {
    id: 'q-004',
    question: 'How do I resubmit a failed TRF?',
    answer: 'Click "Create Retest Request" on the failed TRF. This creates a linked TRF that retains the original context but allows updated samples to be submitted.',
    confidence: 98,
    screenContext: '/trfs',
    objectType: 'trf',
    source: { type: 'email', reference: 'Leo - Retest Process, Feb 2025' },
    askedCount: 567
  },
  {
    id: 'q-005',
    question: 'Why is my TRF stuck in pending?',
    answer: 'Common reasons: 1) Awaiting approver action, 2) Missing required documents, 3) Approver doesn\'t have sufficient entitlement level. Check the TRF timeline for specific blockers.',
    confidence: 88,
    screenContext: '/trfs',
    objectType: 'trf',
    source: { type: 'ai', reference: 'Pattern analysis' },
    askedCount: 423
  },
  {
    id: 'q-006',
    question: 'What is the SLA for TRF approval?',
    answer: 'Standard SLA is 48 hours from test completion. Critical items have 24-hour SLA. SLA timers are visible on each TRF card and in the task list.',
    confidence: 95,
    screenContext: '/trfs',
    objectType: 'trf',
    source: { type: 'sop', reference: 'SLA Policy Document' },
    askedCount: 312
  },
  // Component questions
  {
    id: 'q-010',
    question: 'Why can\'t I unlink this component?',
    answer: 'Components cannot be unlinked after Base testing has been approved. This prevents changes that would invalidate completed tests. Contact QA if you need an exception.',
    confidence: 97,
    screenContext: '/components',
    objectType: 'component',
    source: { type: 'sop', reference: 'Component Management SOP' },
    askedCount: 234
  },
  {
    id: 'q-011',
    question: 'How do I add a new component to the library?',
    answer: 'Click "Add Component" and fill in the required fields: material type, supplier, composition, and upload specifications. New components require Base testing before they can be linked to styles.',
    confidence: 94,
    screenContext: '/components',
    objectType: 'component',
    source: { type: 'guide', reference: 'Component Library Guide' },
    askedCount: 156
  },
  // Testing levels questions  
  {
    id: 'q-013',
    question: 'Why is Bulk testing disabled?',
    answer: 'Bulk testing is blocked until Base approval is complete. This is a mandatory gate to prevent testing production samples from materials that haven\'t passed initial screening.',
    confidence: 99,
    screenContext: '/testing-levels',
    objectType: 'testing',
    source: { type: 'sop', reference: 'Testing Gates Policy' },
    askedCount: 456
  },
  {
    id: 'q-014',
    question: 'What tests are included in Base testing?',
    answer: 'Base testing typically includes: chemical safety (formaldehyde, pH, AZO dyes), basic physical properties (tensile strength, color fastness), and fiber composition verification.',
    confidence: 93,
    screenContext: '/testing-levels',
    objectType: 'testing',
    source: { type: 'webinar', reference: 'Testing Standards Webinar' },
    askedCount: 298
  },
  // Supplier questions
  {
    id: 'q-021',
    question: 'How do I invite a supplier to complete the sustainability questionnaire?',
    answer: 'Click the "Invite to Questionnaire" button on any supplier row. This sends an automated email with a link to the sustainability questionnaire. You can track response status in the supplier profile.',
    confidence: 96,
    screenContext: '/suppliers',
    objectType: 'supplier',
    source: { type: 'guide', reference: 'Supplier Engagement Guide' },
    askedCount: 312
  },
  {
    id: 'q-022',
    question: 'What do the supplier compliance percentages mean?',
    answer: 'Compliance percentage reflects: valid certifications (40%), questionnaire completion (25%), on-time document submissions (20%), and historical test pass rates (15%). Suppliers below 70% are flagged for review.',
    confidence: 94,
    screenContext: '/suppliers',
    objectType: 'supplier',
    source: { type: 'sop', reference: 'Supplier Compliance Framework' },
    askedCount: 278
  },
  {
    id: 'q-023',
    question: 'Why is a supplier marked as "At Risk"?',
    answer: 'Suppliers are flagged At Risk when: compliance score drops below 60%, certificates are expired or expiring within 30 days, or they have 3+ failed TRFs in the last quarter. Click the supplier to see specific issues.',
    confidence: 92,
    screenContext: '/suppliers',
    objectType: 'supplier',
    source: { type: 'ai', reference: 'Risk pattern analysis' },
    askedCount: 198
  },
  {
    id: 'q-031',
    question: 'How do I add a new supplier to the system?',
    answer: 'Click "Add Supplier" and enter required details: company name, contact info, and primary product categories. New suppliers must complete the sustainability questionnaire and upload required certifications before being approved for orders.',
    confidence: 95,
    screenContext: '/suppliers',
    objectType: 'supplier',
    source: { type: 'guide', reference: 'Supplier Onboarding Guide' },
    askedCount: 167
  },
  {
    id: 'q-032',
    question: 'What certifications are required for suppliers?',
    answer: 'Required certifications depend on product category. Apparel suppliers typically need: OEKO-TEX or GOTS (for sustainability), ISO 9001 (quality), and any market-specific certifications (e.g., REACH for EU). Check the supplier profile for specific requirements.',
    confidence: 91,
    screenContext: '/suppliers',
    objectType: 'supplier',
    source: { type: 'sop', reference: 'Supplier Certification Requirements' },
    askedCount: 145
  },
  // Analytics questions
  {
    id: 'q-024',
    question: 'How is the Collection Readiness Funnel calculated?',
    answer: 'The funnel shows progression through lifecycle stages: Components Ready → TRFs Submitted → Testing Complete → Approved. Each bar shows the count and percentage of styles at that stage. Click any stage to drill down.',
    confidence: 93,
    screenContext: '/analytics',
    objectType: 'report',
    source: { type: 'guide', reference: 'Analytics Dashboard Guide' },
    askedCount: 234
  },
  {
    id: 'q-025',
    question: 'What does the TRF Turnaround Time chart show?',
    answer: 'This chart displays average time from TRF submission to approval, broken down by testing level (Base, Bulk, Product). Compare against SLA targets (dashed lines) to identify bottlenecks. Hover for specific values.',
    confidence: 91,
    screenContext: '/analytics',
    objectType: 'report',
    source: { type: 'webinar', reference: 'Q4 Metrics Webinar' },
    askedCount: 189
  },
  {
    id: 'q-033',
    question: 'Can I export analytics data for reporting?',
    answer: 'Yes, click the export icon in the top-right of any chart to download as CSV or PDF. For full dashboard exports, use the "Export All" button. Data exports are available for the selected date range only.',
    confidence: 97,
    screenContext: '/analytics',
    objectType: 'report',
    source: { type: 'guide', reference: 'Analytics Export Guide' },
    askedCount: 156
  },
  {
    id: 'q-034',
    question: 'Why are some analytics charts showing incomplete data?',
    answer: 'Charts may show partial data if: the date range includes future dates, data is still being processed (allow 24h for recent data), or you lack permissions for certain categories. Check the "Data as of" timestamp for currency.',
    confidence: 88,
    screenContext: '/analytics',
    objectType: 'report',
    source: { type: 'ai', reference: 'Data availability analysis' },
    askedCount: 112
  },
  {
    id: 'q-035',
    question: 'How do I compare performance across different time periods?',
    answer: 'Use the date range selector to choose your primary period, then toggle "Compare to Previous Period" to overlay historical data. You can compare week-over-week, month-over-month, or custom ranges.',
    confidence: 94,
    screenContext: '/analytics',
    objectType: 'report',
    source: { type: 'guide', reference: 'Analytics Comparison Features' },
    askedCount: 134
  },
  // Approval questions
  {
    id: 'q-028',
    question: 'What\'s the difference between Bronze and Silver approval?',
    answer: 'Bronze: Approve low-risk TRFs (score < 30) with no failures. Silver: Approve medium-risk TRFs (score < 60) with minor deviations. Gold: Most TRFs except governance-flagged items.',
    confidence: 96,
    screenContext: '/self-approval-levels',
    objectType: 'approval',
    source: { type: 'email', reference: 'Governance Team - Approval Matrix' },
    askedCount: 387
  },
  {
    id: 'q-029',
    question: 'How do I get upgraded to a higher approval level?',
    answer: 'Upgrades require: 1) Completing governance training, 2) Demonstrated accuracy on current level (>95% valid approvals), 3) Manager endorsement. Submit request via Settings > Approval Levels.',
    confidence: 91,
    screenContext: '/self-approval-levels',
    objectType: 'approval',
    source: { type: 'guide', reference: 'Approval Entitlement Guide' },
    askedCount: 245
  },
];

// Known issues and recent changes
export const knownIssues: KnownIssue[] = [
  {
    id: 'issue-001',
    title: 'Slow loading on Analytics page',
    description: 'Some users experience delayed loading when viewing large date ranges in Analytics.',
    status: 'in_progress',
    affectedScreens: ['/analytics'],
    workaround: 'Try reducing the date range to 30 days or less.',
    reportedAt: '2026-01-28'
  },
  {
    id: 'issue-002',
    title: 'PDF export occasionally times out',
    description: 'TRF exports to PDF may time out for TRFs with more than 20 tests.',
    status: 'investigating',
    affectedScreens: ['/trfs'],
    workaround: 'Use the "Export as CSV" option as an alternative.',
    reportedAt: '2026-02-01'
  }
];

export const recentChanges: RecentChange[] = [
  {
    id: 'change-001',
    title: 'Component Area Validation',
    description: 'New visual indicators show which components require full testing based on area percentage.',
    type: 'feature',
    relatedScreens: ['/components', '/styles'],
    date: '2026-02-04'
  },
  {
    id: 'change-002',
    title: 'Collection Readiness Funnel',
    description: 'New report showing bottlenecks across the collection lifecycle.',
    type: 'feature',
    relatedScreens: ['/analytics'],
    date: '2026-02-03'
  },
  {
    id: 'change-003',
    title: 'Improved AI Recommendations',
    description: 'AI suggestions now include confidence scores and source references.',
    type: 'improvement',
    relatedScreens: ['/'],
    date: '2026-02-01'
  }
];

// Role-specific help tips
export const roleSpecificTips: Record<string, string[]> = {
  buyer: [
    'Use the Dashboard to prioritize your daily approvals',
    'Set up notification preferences to never miss an SLA',
    'Check supplier compliance scores before placing new orders'
  ],
  supplier: [
    'Upload certificates before they expire to avoid blocks',
    'Track your TRF submissions in the Supplier Dashboard',
    'Respond to document requests within 24 hours to maintain good standing'
  ],
  lab_technician: [
    'Use the Lab Queue widget to prioritize samples by SLA',
    'Add notes to test results for context on deviations',
    'Flag uncertain results for supervisor review'
  ],
  manager: [
    'Review the Confidence Dashboard for team performance',
    'Use Analytics to identify systemic issues',
    'Configure approval levels to balance speed and governance'
  ],
  admin: [
    'Regularly audit self-approval level assignments',
    'Review AI confidence override rates for training needs',
    'Export compliance reports for governance meetings'
  ]
};
