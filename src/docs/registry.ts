// CARLOS Documentation Registry
// Single source of truth for all screens, workflows, and data model documentation
// Last updated: 2026-02-06

import {
  ScreenRegistryEntry,
  WorkflowRegistryEntry,
  DataEntityDef,
  EnumDef,
  RelationshipDef,
  RoleDef,
  ApprovalMatrixEntry,
  FeatureFlag,
  DocumentationRegistry,
} from './types';

// ============================================
// SCREEN REGISTRY
// ============================================

export const screenRegistry: ScreenRegistryEntry[] = [
  // Dashboard
  {
    id: 'dashboard',
    name: 'Dashboard',
    route: '/',
    description: 'AI-prioritized command center showing critical tasks, readiness scores, and role-adaptive widgets.',
    primaryPersona: 'buyer',
    otherPersonas: ['manager', 'admin', 'supplier', 'lab_technician'],
    jobsToBeDone: [
      'View AI-prioritized critical tasks requiring immediate action',
      'Monitor overall readiness score and confidence gaps',
      'Access quick actions for common workflows',
      'Review regulatory alerts and compliance status',
      'Track activity feed for recent platform events',
      'Navigate to detailed screens for deeper investigation',
    ],
    uiSections: [
      { id: 'kpi-summary', type: 'widget', name: 'KPI Summary Widget', description: 'High-level metrics with trend indicators' },
      { id: 'ai-task-list', type: 'list', name: 'AI Task Cards', description: 'Prioritized action items with AI reasoning' },
      { id: 'readiness-gauge', type: 'widget', name: 'Readiness Gauge', description: 'Circular gauge showing DPP readiness percentage' },
      { id: 'quick-actions', type: 'panel', name: 'Quick Actions', description: 'Shortcuts to common operations' },
      { id: 'activity-feed', type: 'list', name: 'Activity Feed', description: 'Chronological list of platform events' },
      { id: 'regulatory-alerts', type: 'card', name: 'Regulatory Alerts', description: 'Upcoming compliance deadlines and risks' },
      { id: 'confidence-dashboard', type: 'widget', name: 'Confidence Dashboard', description: 'DPP attribute coverage visualization', isConditional: true, conditionDescription: 'Visible to buyer and manager roles' },
      { id: 'supplier-dashboard', type: 'widget', name: 'Supplier Dashboard', description: 'Submission status for suppliers', isConditional: true, conditionDescription: 'Visible to supplier role only' },
      { id: 'lab-queue', type: 'widget', name: 'Lab Queue', description: 'Testing queue for lab technicians', isConditional: true, conditionDescription: 'Visible to lab_technician role only' },
    ],
    actions: [
      { id: 'approve-task', label: 'Approve', trigger: 'click', sideEffects: ['Updates TRF status', 'Logs audit event', 'Triggers notification'], roleRestricted: ['buyer', 'manager', 'admin'] },
      { id: 'reject-task', label: 'Reject', trigger: 'click', sideEffects: ['Updates TRF status', 'Logs audit event', 'Triggers notification'], requiresConfirmation: true },
      { id: 'view-details', label: 'View Details', trigger: 'click', sideEffects: ['Navigates to detail page'] },
      { id: 'widget-reorder', label: 'Reorder Widgets', trigger: 'drag', sideEffects: ['Persists widget layout preference'] },
    ],
    validations: [],
    states: [
      { state: 'loading', description: 'Initial data fetch', uiRepresentation: 'Skeleton loaders for each widget' },
      { state: 'empty', description: 'No critical tasks', uiRepresentation: 'Success illustration with "All clear" message' },
      { state: 'success', description: 'Data loaded with tasks', uiRepresentation: 'Full dashboard with prioritized tasks' },
      { state: 'error', description: 'Failed to fetch data', uiRepresentation: 'Error toast with retry option' },
    ],
    dataEntitiesUsed: [
      { entityId: 'task', entityName: 'Task', fields: ['id', 'title', 'priority', 'type', 'dueDate', 'aiRecommendation'], operation: 'read' },
      { entityId: 'readiness-score', entityName: 'ReadinessScore', fields: ['overall', 'trend', 'confidence', 'gaps'], operation: 'read' },
      { entityId: 'activity', entityName: 'Activity', fields: ['id', 'type', 'actor', 'action', 'timestamp'], operation: 'read' },
    ],
    auditEvents: [
      { event: 'task_approved', trigger: 'User clicks Approve on task card', dataLogged: ['taskId', 'userId', 'timestamp'] },
      { event: 'dashboard_viewed', trigger: 'Page load', dataLogged: ['userId', 'role', 'timestamp'] },
    ],
    helpContent: [
      { type: 'faq', question: 'How are tasks prioritized?', content: 'AI analyzes SLA deadlines, downstream impact, and regulatory exposure to compute priority scores.' },
      { type: 'tooltip', content: 'Readiness score reflects DPP attribute coverage across all active products.', location: 'readiness-gauge' },
    ],
    sourceFile: 'src/pages/Dashboard.tsx',
    registeredAt: '2026-02-06',
    lastUpdated: '2026-02-06',
  },

  // Styles
  {
    id: 'styles',
    name: 'Styles',
    route: '/styles',
    description: 'Product collection management with testing pipeline status, component linking, and DPP readiness tracking.',
    primaryPersona: 'buyer',
    otherPersonas: ['manager', 'admin'],
    jobsToBeDone: [
      'Browse all product collections (styles) in the pipeline',
      'Filter styles by status, season, brand, or risk level',
      'Monitor testing gate progression for each collection',
      'Identify blocked collections requiring action',
      'Create new product collections',
      'Navigate to detailed style view for management',
    ],
    uiSections: [
      { id: 'styles-header', type: 'panel', name: 'Header with Filters', description: 'Search, filter controls, and create button' },
      { id: 'styles-grid', type: 'grid', name: 'Style Cards Grid', description: 'Card-based display of collections with status indicators' },
      { id: 'styles-table', type: 'table', name: 'Styles Table View', description: 'Alternative table view for dense data', isConditional: true, conditionDescription: 'Toggle between grid/table view' },
    ],
    actions: [
      { id: 'create-style', label: 'New Style', trigger: 'click', sideEffects: ['Opens create modal', 'Creates draft collection'] },
      { id: 'filter-styles', label: 'Apply Filters', trigger: 'click', sideEffects: ['Filters displayed collections'] },
      { id: 'view-style', label: 'View Style', trigger: 'click', sideEffects: ['Navigates to style detail'] },
    ],
    validations: [],
    states: [
      { state: 'loading', description: 'Fetching collections', uiRepresentation: 'Skeleton card grid' },
      { state: 'empty', description: 'No collections found', uiRepresentation: 'Empty state with create CTA' },
      { state: 'success', description: 'Collections loaded', uiRepresentation: 'Populated grid/table' },
    ],
    dataEntitiesUsed: [
      { entityId: 'product-collection', entityName: 'ProductCollection', fields: ['id', 'name', 'season', 'brand', 'status', 'riskScore', 'readinessScore'], operation: 'read' },
    ],
    auditEvents: [
      { event: 'styles_viewed', trigger: 'Page load', dataLogged: ['userId', 'filters', 'timestamp'] },
      { event: 'style_created', trigger: 'Create button clicked', dataLogged: ['userId', 'collectionId', 'timestamp'] },
    ],
    helpContent: [
      { type: 'faq', question: 'What is a Style?', content: 'A Style represents a product collection going through the testing and approval pipeline.' },
    ],
    sourceFile: 'src/pages/Styles.tsx',
    registeredAt: '2026-02-06',
    lastUpdated: '2026-02-06',
  },

  // Style Detail
  {
    id: 'style-detail',
    name: 'Style Detail',
    route: '/styles/:id',
    description: 'Complete style management including component linking, testing gate progression, care labelling, and GSW submission.',
    primaryPersona: 'buyer',
    otherPersonas: ['manager', 'admin'],
    jobsToBeDone: [
      'View complete style information and current status',
      'Link and manage fabric/trim components',
      'Track testing level progression (Base → Bulk → Garment)',
      'Create and manage care label packages',
      'Upload and submit GSW for approval',
      'View AI recommendations and assessments',
      'Approve testing gates based on entitlement level',
    ],
    uiSections: [
      { id: 'style-header', type: 'panel', name: 'Style Header', description: 'Title, status badge, back navigation, and AI assessment strip' },
      { id: 'components-section', type: 'card', name: 'Components Card', description: 'Linked components with area percentages' },
      { id: 'testing-levels', type: 'tabs', name: 'Testing Levels', description: 'Base/Bulk/Garment testing tabs with TRF links' },
      { id: 'care-labels', type: 'card', name: 'Care Labelling', description: 'Symbol picker and care wording editor' },
      { id: 'gsw-section', type: 'card', name: 'GSW Submission', description: 'File upload, version history, and approval workflow' },
      { id: 'ai-assist', type: 'drawer', name: 'AI Assist Panel', description: 'Contextual AI recommendations and suggestions' },
    ],
    actions: [
      { id: 'link-component', label: 'Link Component', trigger: 'click', sideEffects: ['Opens component picker', 'Associates component with style'] },
      { id: 'submit-testing', label: 'Submit for Testing', trigger: 'click', sideEffects: ['Creates TRF', 'Updates status', 'Notifies lab'] },
      { id: 'approve-gate', label: 'Approve Gate', trigger: 'click', sideEffects: ['Locks testing level', 'Updates status', 'Logs audit'], roleRestricted: ['buyer', 'manager', 'admin'] },
      { id: 'upload-gsw', label: 'Upload GSW', trigger: 'click', sideEffects: ['Uploads file', 'Creates GSW submission record'] },
      { id: 'submit-gsw', label: 'Submit GSW', trigger: 'click', sideEffects: ['Notifies garment tech', 'Updates status'] },
    ],
    validations: [
      { field: 'componentAreaPercentage', rules: ['Sum must equal 100%', 'Components >10% require full testing'], errorMessage: 'Component area percentages must sum to 100%' },
      { field: 'careLabelSymbols', rules: ['At least one wash symbol required'], errorMessage: 'Please select at least one wash care symbol' },
    ],
    states: [
      { state: 'loading', description: 'Fetching style data', uiRepresentation: 'Skeleton sections' },
      { state: 'success', description: 'Style loaded', uiRepresentation: 'Full detail view' },
      { state: 'error', description: 'Style not found', uiRepresentation: '404 error with back link' },
    ],
    dataEntitiesUsed: [
      { entityId: 'product-collection', entityName: 'ProductCollection', fields: ['all'], operation: 'both' },
      { entityId: 'component', entityName: 'Component', fields: ['all'], operation: 'read' },
      { entityId: 'testing-level-state', entityName: 'TestingLevelState', fields: ['all'], operation: 'both' },
      { entityId: 'care-label-package', entityName: 'CareLabelPackage', fields: ['all'], operation: 'both' },
      { entityId: 'gsw-submission', entityName: 'GSWSubmission', fields: ['all'], operation: 'both' },
    ],
    auditEvents: [
      { event: 'component_linked', trigger: 'Component linked to style', dataLogged: ['styleId', 'componentId', 'userId', 'timestamp'] },
      { event: 'testing_gate_approved', trigger: 'Gate approval', dataLogged: ['styleId', 'level', 'userId', 'timestamp'] },
      { event: 'gsw_submitted', trigger: 'GSW submission', dataLogged: ['styleId', 'gswId', 'userId', 'timestamp'] },
    ],
    helpContent: [
      { type: 'faq', question: 'What are testing gates?', content: 'Testing gates (Base → Bulk → Garment) represent progressive quality checkpoints. Each gate must be approved before proceeding.' },
      { type: 'tooltip', content: 'Components with area >10% require full testing protocol.', location: 'components-section' },
    ],
    sourceFile: 'src/pages/StyleDetail.tsx',
    registeredAt: '2026-02-06',
    lastUpdated: '2026-02-06',
  },

  // Components
  {
    id: 'components',
    name: 'Components',
    route: '/components',
    description: 'Library of reusable fabric, trim, and lining components that can be linked to multiple styles.',
    primaryPersona: 'buyer',
    otherPersonas: ['manager', 'admin'],
    jobsToBeDone: [
      'Browse the component library',
      'Search and filter components by type, composition, or supplier',
      'Create new components with full specifications',
      'View which styles use a particular component',
      'Manage component test history and certifications',
    ],
    uiSections: [
      { id: 'components-filters', type: 'panel', name: 'Search & Filters', description: 'Type filter, search input, and create button' },
      { id: 'components-table', type: 'table', name: 'Components Table', description: 'Sortable table with component details' },
    ],
    actions: [
      { id: 'create-component', label: 'New Component', trigger: 'click', sideEffects: ['Opens create form', 'Creates component record'] },
      { id: 'edit-component', label: 'Edit', trigger: 'click', sideEffects: ['Opens edit form', 'Updates component'] },
      { id: 'view-usage', label: 'View Usage', trigger: 'click', sideEffects: ['Shows linked styles modal'] },
    ],
    validations: [
      { field: 'composition', rules: ['Required', 'Valid percentage format'], errorMessage: 'Please enter a valid composition' },
      { field: 'areaPercentage', rules: ['Number between 0-100'], errorMessage: 'Area percentage must be between 0 and 100' },
    ],
    states: [
      { state: 'loading', description: 'Fetching components', uiRepresentation: 'Table skeleton' },
      { state: 'empty', description: 'No components found', uiRepresentation: 'Empty state with create CTA' },
      { state: 'success', description: 'Components loaded', uiRepresentation: 'Populated table' },
    ],
    dataEntitiesUsed: [
      { entityId: 'component', entityName: 'Component', fields: ['all'], operation: 'both' },
    ],
    auditEvents: [
      { event: 'component_created', trigger: 'Component creation', dataLogged: ['componentId', 'userId', 'timestamp'] },
    ],
    helpContent: [
      { type: 'faq', question: 'What is a Component?', content: 'A Component is a reusable material (fabric, trim, lining) that can be linked to multiple product collections.' },
    ],
    sourceFile: 'src/pages/Components.tsx',
    registeredAt: '2026-02-06',
    lastUpdated: '2026-02-06',
  },

  // Testing Levels
  {
    id: 'testing-levels',
    name: 'Testing Levels',
    route: '/testing-levels',
    description: 'Overview of testing level status across all active collections with gate progression tracking.',
    primaryPersona: 'buyer',
    otherPersonas: ['manager', 'lab_technician'],
    jobsToBeDone: [
      'View testing pipeline status across all collections',
      'Identify bottlenecks in testing progression',
      'Track SLA compliance for testing gates',
      'Access TRF details for in-progress tests',
      'Monitor pass/fail rates by testing level',
    ],
    uiSections: [
      { id: 'testing-overview', type: 'card', name: 'Overview Cards', description: 'Summary metrics for each testing level' },
      { id: 'testing-pipeline', type: 'table', name: 'Pipeline Table', description: 'Collections with testing status columns' },
    ],
    actions: [
      { id: 'view-trf', label: 'View TRF', trigger: 'click', sideEffects: ['Navigates to TRF detail'] },
      { id: 'filter-level', label: 'Filter by Level', trigger: 'click', sideEffects: ['Filters table'] },
    ],
    validations: [],
    states: [
      { state: 'loading', description: 'Fetching data', uiRepresentation: 'Skeleton cards and table' },
      { state: 'success', description: 'Data loaded', uiRepresentation: 'Full pipeline view' },
    ],
    dataEntitiesUsed: [
      { entityId: 'product-collection', entityName: 'ProductCollection', fields: ['id', 'name', 'baseTesting', 'bulkTesting', 'garmentTesting'], operation: 'read' },
      { entityId: 'testing-level-state', entityName: 'TestingLevelState', fields: ['all'], operation: 'read' },
    ],
    auditEvents: [],
    helpContent: [
      { type: 'faq', question: 'What is the testing progression?', content: 'Products progress through Base → Bulk → Garment testing. Each level must pass before proceeding.' },
    ],
    sourceFile: 'src/pages/TestingLevels.tsx',
    registeredAt: '2026-02-06',
    lastUpdated: '2026-02-06',
  },

  // Inspections
  {
    id: 'inspections',
    name: 'Inspections',
    route: '/inspections',
    description: 'Factory audit and quality inspection scheduling with calendar and map views.',
    primaryPersona: 'buyer',
    otherPersonas: ['manager', 'admin'],
    jobsToBeDone: [
      'View scheduled inspections in calendar or map format',
      'Schedule new factory inspections',
      'Track inspection status and findings',
      'Assign auditors to inspections',
      'Drag-and-drop reschedule inspections',
      'View geographic distribution of inspections',
    ],
    uiSections: [
      { id: 'calendar-view', type: 'widget', name: 'Calendar View', description: 'Monthly calendar with inspection dots' },
      { id: 'map-view', type: 'widget', name: 'Map View', description: 'Geographic map with factory locations' },
      { id: 'inspection-list', type: 'list', name: 'Inspection List', description: 'Filterable list of inspections' },
      { id: 'schedule-form', type: 'modal', name: 'Schedule Inspection Form', description: 'Form to create new inspection' },
    ],
    actions: [
      { id: 'schedule-inspection', label: 'Schedule Inspection', trigger: 'click', sideEffects: ['Opens schedule form', 'Creates inspection'] },
      { id: 'reschedule', label: 'Reschedule', trigger: 'drag', sideEffects: ['Updates inspection date', 'Notifies assignees'] },
      { id: 'view-inspection', label: 'View Details', trigger: 'click', sideEffects: ['Navigates to inspection detail'] },
    ],
    validations: [
      { field: 'scheduledDate', rules: ['Required', 'Must be future date'], errorMessage: 'Please select a valid future date' },
      { field: 'factoryId', rules: ['Required'], errorMessage: 'Please select a factory' },
    ],
    states: [
      { state: 'loading', description: 'Fetching inspections', uiRepresentation: 'Calendar/map skeleton' },
      { state: 'success', description: 'Inspections loaded', uiRepresentation: 'Populated calendar/map' },
    ],
    dataEntitiesUsed: [
      { entityId: 'inspection', entityName: 'Inspection', fields: ['all'], operation: 'both' },
    ],
    auditEvents: [
      { event: 'inspection_scheduled', trigger: 'New inspection created', dataLogged: ['inspectionId', 'factoryId', 'userId', 'date'] },
      { event: 'inspection_rescheduled', trigger: 'Date changed', dataLogged: ['inspectionId', 'oldDate', 'newDate', 'userId'] },
    ],
    helpContent: [
      { type: 'faq', question: 'How do I reschedule an inspection?', content: 'Drag the inspection dot to a new date on the calendar, or use the edit button in the inspection details.' },
    ],
    sourceFile: 'src/pages/Inspections.tsx',
    registeredAt: '2026-02-06',
    lastUpdated: '2026-02-06',
  },

  // Inspection Detail
  {
    id: 'inspection-detail',
    name: 'Inspection Detail',
    route: '/inspections/:id',
    description: 'Detailed inspection view with findings, photos, and audit checklist.',
    primaryPersona: 'buyer',
    otherPersonas: ['manager', 'admin'],
    jobsToBeDone: [
      'View complete inspection information',
      'Review findings and non-conformances',
      'Access inspection photos and documents',
      'Track corrective action status',
      'Generate inspection reports',
    ],
    uiSections: [
      { id: 'inspection-header', type: 'panel', name: 'Header', description: 'Title, status, back navigation' },
      { id: 'findings', type: 'list', name: 'Findings List', description: 'List of inspection findings' },
      { id: 'photos', type: 'grid', name: 'Photo Gallery', description: 'Inspection photos' },
    ],
    actions: [
      { id: 'add-finding', label: 'Add Finding', trigger: 'click', sideEffects: ['Opens finding form'] },
      { id: 'generate-report', label: 'Generate Report', trigger: 'click', sideEffects: ['Creates PDF report'] },
    ],
    validations: [],
    states: [
      { state: 'loading', description: 'Fetching inspection', uiRepresentation: 'Skeleton' },
      { state: 'success', description: 'Inspection loaded', uiRepresentation: 'Full detail view' },
      { state: 'error', description: 'Not found', uiRepresentation: '404 error' },
    ],
    dataEntitiesUsed: [
      { entityId: 'inspection', entityName: 'Inspection', fields: ['all'], operation: 'both' },
    ],
    auditEvents: [],
    helpContent: [],
    sourceFile: 'src/pages/InspectionDetail.tsx',
    registeredAt: '2026-02-06',
    lastUpdated: '2026-02-06',
  },

  // Care Labelling
  {
    id: 'care-labelling',
    name: 'Care Labelling',
    route: '/care-labelling',
    description: 'Care label package management with symbol picker and care wording generation.',
    primaryPersona: 'buyer',
    otherPersonas: ['manager'],
    jobsToBeDone: [
      'Browse care label packages for all styles',
      'Create new care label packages',
      'Select care symbols from standard library',
      'Generate care wording based on symbols',
      'Preview label layouts',
    ],
    uiSections: [
      { id: 'care-labels-list', type: 'table', name: 'Care Labels Table', description: 'List of care label packages' },
      { id: 'symbol-picker', type: 'modal', name: 'Symbol Picker', description: 'Modal with care symbol selection' },
    ],
    actions: [
      { id: 'create-care-package', label: 'Create Package', trigger: 'click', sideEffects: ['Opens creator modal'] },
      { id: 'edit-symbols', label: 'Edit Symbols', trigger: 'click', sideEffects: ['Opens symbol picker'] },
    ],
    validations: [
      { field: 'symbols', rules: ['At least one symbol required'], errorMessage: 'Please select at least one care symbol' },
    ],
    states: [
      { state: 'loading', description: 'Fetching data', uiRepresentation: 'Table skeleton' },
      { state: 'success', description: 'Data loaded', uiRepresentation: 'Populated table' },
    ],
    dataEntitiesUsed: [
      { entityId: 'care-label-package', entityName: 'CareLabelPackage', fields: ['all'], operation: 'both' },
      { entityId: 'care-symbol', entityName: 'CareSymbol', fields: ['all'], operation: 'read' },
    ],
    auditEvents: [],
    helpContent: [],
    sourceFile: 'src/pages/CareLabelling.tsx',
    registeredAt: '2026-02-06',
    lastUpdated: '2026-02-06',
  },

  // GSW
  {
    id: 'gsw',
    name: 'GSW',
    route: '/gsw',
    description: 'Gold Seal Workbook submission and approval tracking.',
    primaryPersona: 'buyer',
    otherPersonas: ['manager', 'admin'],
    jobsToBeDone: [
      'View all GSW submissions and their status',
      'Upload new GSW files for collections',
      'Submit GSW for garment tech approval',
      'Track approval workflow progress',
      'View GSW audit history',
    ],
    uiSections: [
      { id: 'gsw-list', type: 'table', name: 'GSW Submissions Table', description: 'List of GSW submissions with status' },
      { id: 'upload-modal', type: 'modal', name: 'Upload Modal', description: 'GSW file upload form' },
    ],
    actions: [
      { id: 'upload-gsw', label: 'Upload GSW', trigger: 'click', sideEffects: ['Opens upload modal'] },
      { id: 'submit-gsw', label: 'Submit for Approval', trigger: 'click', sideEffects: ['Notifies garment tech'] },
    ],
    validations: [
      { field: 'file', rules: ['Required', 'Excel format only'], errorMessage: 'Please upload a valid Excel file' },
    ],
    states: [
      { state: 'loading', description: 'Fetching GSW data', uiRepresentation: 'Table skeleton' },
      { state: 'success', description: 'GSW data loaded', uiRepresentation: 'Populated table' },
    ],
    dataEntitiesUsed: [
      { entityId: 'gsw-submission', entityName: 'GSWSubmission', fields: ['all'], operation: 'both' },
    ],
    auditEvents: [
      { event: 'gsw_uploaded', trigger: 'File upload', dataLogged: ['gswId', 'fileName', 'userId', 'timestamp'] },
      { event: 'gsw_submitted', trigger: 'Submit for approval', dataLogged: ['gswId', 'submittedTo', 'userId', 'timestamp'] },
    ],
    helpContent: [
      { type: 'faq', question: 'What is a GSW?', content: 'Gold Seal Workbook is the final specification document submitted for garment tech approval before production.' },
    ],
    sourceFile: 'src/pages/GSW.tsx',
    registeredAt: '2026-02-06',
    lastUpdated: '2026-02-06',
  },

  // Approval Levels
  {
    id: 'approval-levels',
    name: 'Self-Approval Levels',
    route: '/approval-levels',
    description: 'Admin screen for configuring user self-approval entitlements.',
    primaryPersona: 'admin',
    otherPersonas: [],
    jobsToBeDone: [
      'View all users and their approval entitlement levels',
      'Configure approval levels (None/Bronze/Silver/Gold)',
      'Understand permission scope for each level',
      'Audit approval entitlement changes',
    ],
    uiSections: [
      { id: 'levels-matrix', type: 'table', name: 'Approval Matrix', description: 'User-level entitlement configuration' },
      { id: 'level-descriptions', type: 'card', name: 'Level Descriptions', description: 'Explanation of each approval tier' },
    ],
    actions: [
      { id: 'update-level', label: 'Update Level', trigger: 'click', sideEffects: ['Updates entitlement', 'Logs audit'], roleRestricted: ['admin'] },
    ],
    validations: [],
    states: [
      { state: 'loading', description: 'Fetching entitlements', uiRepresentation: 'Table skeleton' },
      { state: 'success', description: 'Entitlements loaded', uiRepresentation: 'Populated matrix' },
    ],
    dataEntitiesUsed: [
      { entityId: 'approval-entitlement', entityName: 'ApprovalEntitlement', fields: ['all'], operation: 'both' },
    ],
    auditEvents: [
      { event: 'approval_level_changed', trigger: 'Level update', dataLogged: ['userId', 'oldLevel', 'newLevel', 'adminId', 'timestamp'] },
    ],
    helpContent: [
      { type: 'faq', question: 'What can Bronze level approve?', content: 'Bronze level can only approve care label codes.' },
      { type: 'faq', question: 'What can Silver level approve?', content: 'Silver level can approve care labels, base testing, and bulk testing.' },
      { type: 'faq', question: 'What can Gold level approve?', content: 'Gold level can approve the full cycle including garment testing.' },
    ],
    sourceFile: 'src/pages/SelfApprovalLevels.tsx',
    registeredAt: '2026-02-06',
    lastUpdated: '2026-02-06',
  },

  // TRFs
  {
    id: 'trfs',
    name: 'TRFs',
    route: '/trfs',
    description: 'Test Request Form management with Kanban and table views.',
    primaryPersona: 'buyer',
    otherPersonas: ['lab_technician', 'manager'],
    jobsToBeDone: [
      'Browse all TRFs with filtering and search',
      'Track TRF status through the pipeline',
      'Create new test requests',
      'View TRF priority and SLA status',
      'Switch between Kanban and table views',
    ],
    uiSections: [
      { id: 'trfs-header', type: 'panel', name: 'Header with View Toggle', description: 'Search, filters, view toggle' },
      { id: 'kanban-view', type: 'widget', name: 'Kanban Board', description: 'TRF cards organized by status columns' },
      { id: 'table-view', type: 'table', name: 'Table View', description: 'Sortable table of TRFs' },
    ],
    actions: [
      { id: 'create-trf', label: 'New TRF', trigger: 'click', sideEffects: ['Opens TRF form', 'Creates draft TRF'] },
      { id: 'view-trf', label: 'View Details', trigger: 'click', sideEffects: ['Navigates to TRF detail'] },
      { id: 'drag-trf', label: 'Move TRF', trigger: 'drag', sideEffects: ['Updates TRF status'] },
    ],
    validations: [],
    states: [
      { state: 'loading', description: 'Fetching TRFs', uiRepresentation: 'Skeleton board/table' },
      { state: 'empty', description: 'No TRFs', uiRepresentation: 'Empty state with create CTA' },
      { state: 'success', description: 'TRFs loaded', uiRepresentation: 'Populated view' },
    ],
    dataEntitiesUsed: [
      { entityId: 'trf', entityName: 'TRF', fields: ['all'], operation: 'read' },
    ],
    auditEvents: [
      { event: 'trf_created', trigger: 'TRF creation', dataLogged: ['trfId', 'productId', 'userId', 'timestamp'] },
    ],
    helpContent: [
      { type: 'faq', question: 'What is a TRF?', content: 'A Test Request Form initiates the testing process for a product or component.' },
    ],
    sourceFile: 'src/pages/TRFs.tsx',
    registeredAt: '2026-02-06',
    lastUpdated: '2026-02-06',
  },

  // TRF Detail
  {
    id: 'trf-detail',
    name: 'TRF Detail',
    route: '/trfs/:id',
    description: 'Detailed TRF view with test results, timeline, documents, and approval workflow.',
    primaryPersona: 'buyer',
    otherPersonas: ['lab_technician', 'manager'],
    jobsToBeDone: [
      'View complete TRF information and current status',
      'Monitor test result progress',
      'Review timeline of events',
      'Access and upload documents',
      'Approve or reject TRF',
      'Request retest for failed items',
    ],
    uiSections: [
      { id: 'trf-header', type: 'panel', name: 'Header with AI Assessment', description: 'Title, status, AI strip' },
      { id: 'test-results', type: 'table', name: 'Test Results', description: 'Individual test results with pass/fail status' },
      { id: 'timeline', type: 'list', name: 'Timeline', description: 'Chronological event history' },
      { id: 'documents', type: 'grid', name: 'Documents', description: 'Attached files and uploads' },
      { id: 'approval-workflow', type: 'card', name: 'Approval Workflow', description: 'Approval actions and status' },
    ],
    actions: [
      { id: 'approve-trf', label: 'Approve', trigger: 'click', sideEffects: ['Updates status', 'Logs audit', 'Notifies stakeholders'], roleRestricted: ['buyer', 'manager', 'admin'] },
      { id: 'reject-trf', label: 'Reject', trigger: 'click', sideEffects: ['Updates status', 'Logs audit'], requiresConfirmation: true },
      { id: 'request-retest', label: 'Request Retest', trigger: 'click', sideEffects: ['Creates retest TRF', 'Notifies lab'] },
      { id: 'upload-document', label: 'Upload Document', trigger: 'click', sideEffects: ['Uploads file', 'Adds to documents list'] },
    ],
    validations: [
      { field: 'rejectionReason', rules: ['Required if rejecting'], errorMessage: 'Please provide a rejection reason' },
    ],
    states: [
      { state: 'loading', description: 'Fetching TRF', uiRepresentation: 'Skeleton' },
      { state: 'success', description: 'TRF loaded', uiRepresentation: 'Full detail view' },
      { state: 'error', description: 'TRF not found', uiRepresentation: '404 error' },
    ],
    dataEntitiesUsed: [
      { entityId: 'trf', entityName: 'TRF', fields: ['all'], operation: 'both' },
      { entityId: 'trf-test', entityName: 'TRFTest', fields: ['all'], operation: 'read' },
      { entityId: 'trf-document', entityName: 'TRFDocument', fields: ['all'], operation: 'both' },
      { entityId: 'trf-timeline-event', entityName: 'TRFTimelineEvent', fields: ['all'], operation: 'read' },
    ],
    auditEvents: [
      { event: 'trf_approved', trigger: 'TRF approval', dataLogged: ['trfId', 'userId', 'timestamp'] },
      { event: 'trf_rejected', trigger: 'TRF rejection', dataLogged: ['trfId', 'userId', 'reason', 'timestamp'] },
    ],
    helpContent: [
      { type: 'tooltip', content: 'Green indicates passed tests, red indicates failures.', location: 'test-results' },
    ],
    sourceFile: 'src/pages/TRFDetail.tsx',
    registeredAt: '2026-02-06',
    lastUpdated: '2026-02-06',
  },

  // Products
  {
    id: 'products',
    name: 'Products',
    route: '/products',
    description: 'Product catalog with compliance status and testing history.',
    primaryPersona: 'buyer',
    otherPersonas: ['manager', 'supplier'],
    jobsToBeDone: [
      'Browse product catalog',
      'Filter products by category, supplier, or compliance status',
      'Import products via CSV',
      'View product compliance and risk scores',
      'Navigate to product details',
    ],
    uiSections: [
      { id: 'products-filters', type: 'panel', name: 'Filters', description: 'Search, category filter, import button' },
      { id: 'products-table', type: 'table', name: 'Products Table', description: 'Sortable product list' },
      { id: 'csv-import', type: 'modal', name: 'CSV Import Dialog', description: 'Bulk product import' },
    ],
    actions: [
      { id: 'import-csv', label: 'Import CSV', trigger: 'click', sideEffects: ['Opens import dialog', 'Processes CSV', 'Creates products'] },
      { id: 'view-product', label: 'View Details', trigger: 'click', sideEffects: ['Navigates to product detail'] },
    ],
    validations: [
      { field: 'csvFile', rules: ['Valid CSV format'], errorMessage: 'Please upload a valid CSV file' },
    ],
    states: [
      { state: 'loading', description: 'Fetching products', uiRepresentation: 'Table skeleton' },
      { state: 'empty', description: 'No products', uiRepresentation: 'Empty state with import CTA' },
      { state: 'success', description: 'Products loaded', uiRepresentation: 'Populated table' },
    ],
    dataEntitiesUsed: [
      { entityId: 'product', entityName: 'Product', fields: ['all'], operation: 'both' },
    ],
    auditEvents: [
      { event: 'products_imported', trigger: 'CSV import', dataLogged: ['count', 'userId', 'timestamp'] },
    ],
    helpContent: [],
    sourceFile: 'src/pages/Products.tsx',
    registeredAt: '2026-02-06',
    lastUpdated: '2026-02-06',
  },

  // Product Detail
  {
    id: 'product-detail',
    name: 'Product Detail',
    route: '/products/:id',
    description: 'Detailed product view with testing history, images, and compliance information.',
    primaryPersona: 'buyer',
    otherPersonas: ['manager', 'supplier'],
    jobsToBeDone: [
      'View complete product information',
      'Review testing history and TRFs',
      'Manage product images',
      'View compliance status and risk score',
      'Access supplier information',
    ],
    uiSections: [
      { id: 'product-header', type: 'panel', name: 'Header', description: 'Product title, status, back navigation' },
      { id: 'image-gallery', type: 'widget', name: 'Image Gallery', description: 'Product image carousel' },
      { id: 'specifications', type: 'card', name: 'Specifications', description: 'Product specs and details' },
      { id: 'testing-history', type: 'table', name: 'Testing History', description: 'Related TRFs and results' },
    ],
    actions: [
      { id: 'upload-image', label: 'Upload Image', trigger: 'click', sideEffects: ['Uploads image', 'Updates gallery'] },
      { id: 'create-trf', label: 'Create TRF', trigger: 'click', sideEffects: ['Navigates to TRF creation'] },
    ],
    validations: [],
    states: [
      { state: 'loading', description: 'Fetching product', uiRepresentation: 'Skeleton' },
      { state: 'success', description: 'Product loaded', uiRepresentation: 'Full detail view' },
      { state: 'error', description: 'Product not found', uiRepresentation: '404 error' },
    ],
    dataEntitiesUsed: [
      { entityId: 'product', entityName: 'Product', fields: ['all'], operation: 'read' },
      { entityId: 'product-image', entityName: 'ProductImage', fields: ['all'], operation: 'both' },
    ],
    auditEvents: [],
    helpContent: [],
    sourceFile: 'src/pages/ProductDetail.tsx',
    registeredAt: '2026-02-06',
    lastUpdated: '2026-02-06',
  },

  // Suppliers
  {
    id: 'suppliers',
    name: 'Suppliers',
    route: '/suppliers',
    description: 'Supplier management with compliance scores and factory information.',
    primaryPersona: 'buyer',
    otherPersonas: ['manager', 'admin'],
    jobsToBeDone: [
      'Browse supplier directory',
      'View supplier compliance and quality scores',
      'Track certificate expiry dates',
      'Access factory information',
      'Monitor supplier risk levels',
    ],
    uiSections: [
      { id: 'suppliers-filters', type: 'panel', name: 'Filters', description: 'Search, status filter' },
      { id: 'suppliers-table', type: 'table', name: 'Suppliers Table', description: 'Supplier list with scores' },
    ],
    actions: [
      { id: 'view-supplier', label: 'View Details', trigger: 'click', sideEffects: ['Navigates to supplier detail'] },
      { id: 'add-supplier', label: 'Add Supplier', trigger: 'click', sideEffects: ['Opens supplier form'] },
    ],
    validations: [],
    states: [
      { state: 'loading', description: 'Fetching suppliers', uiRepresentation: 'Table skeleton' },
      { state: 'success', description: 'Suppliers loaded', uiRepresentation: 'Populated table' },
    ],
    dataEntitiesUsed: [
      { entityId: 'supplier', entityName: 'Supplier', fields: ['all'], operation: 'read' },
    ],
    auditEvents: [],
    helpContent: [],
    sourceFile: 'src/pages/Suppliers.tsx',
    registeredAt: '2026-02-06',
    lastUpdated: '2026-02-06',
  },

  // Lab
  {
    id: 'lab',
    name: 'Lab',
    route: '/lab',
    description: 'Lab technician dashboard for managing testing queue and sample processing.',
    primaryPersona: 'lab_technician',
    otherPersonas: ['manager'],
    jobsToBeDone: [
      'View testing queue with priority sorting',
      'Update sample status and test results',
      'Track SLA compliance for pending tests',
      'Assign samples to lab resources',
      'Record test observations and notes',
    ],
    uiSections: [
      { id: 'lab-queue', type: 'table', name: 'Testing Queue', description: 'Prioritized list of pending samples' },
      { id: 'sample-processing', type: 'modal', name: 'Sample Processing Form', description: 'Form to record test results' },
    ],
    actions: [
      { id: 'start-testing', label: 'Start Testing', trigger: 'click', sideEffects: ['Updates sample status', 'Starts timer'] },
      { id: 'record-results', label: 'Record Results', trigger: 'submit', sideEffects: ['Saves test results', 'Updates TRF'] },
    ],
    validations: [
      { field: 'testResult', rules: ['Required', 'Numeric value'], errorMessage: 'Please enter a valid test result' },
    ],
    states: [
      { state: 'loading', description: 'Fetching queue', uiRepresentation: 'Table skeleton' },
      { state: 'empty', description: 'No pending samples', uiRepresentation: 'Success state - queue clear' },
      { state: 'success', description: 'Queue loaded', uiRepresentation: 'Populated queue' },
    ],
    dataEntitiesUsed: [
      { entityId: 'lab-sample', entityName: 'LabSample', fields: ['all'], operation: 'both' },
    ],
    auditEvents: [
      { event: 'test_started', trigger: 'Testing initiated', dataLogged: ['sampleId', 'technicianId', 'timestamp'] },
      { event: 'result_recorded', trigger: 'Result saved', dataLogged: ['sampleId', 'result', 'technicianId', 'timestamp'] },
    ],
    helpContent: [],
    sourceFile: 'src/pages/Lab.tsx',
    registeredAt: '2026-02-06',
    lastUpdated: '2026-02-06',
  },

  // Analytics
  {
    id: 'analytics',
    name: 'Analytics',
    route: '/analytics',
    description: 'Executive analytics dashboard with KPIs, trends, and performance metrics.',
    primaryPersona: 'manager',
    otherPersonas: ['admin', 'buyer'],
    jobsToBeDone: [
      'View high-level KPI summary',
      'Analyze testing pass rates and trends',
      'Monitor supplier performance metrics',
      'Track SLA compliance over time',
      'Generate and export reports',
    ],
    uiSections: [
      { id: 'kpi-cards', type: 'grid', name: 'KPI Cards', description: 'Key metrics with trend indicators' },
      { id: 'charts', type: 'widget', name: 'Analytics Charts', description: 'Trend charts and visualizations' },
      { id: 'report-generator', type: 'panel', name: 'Report Generator', description: 'Export options' },
    ],
    actions: [
      { id: 'change-date-range', label: 'Change Date Range', trigger: 'click', sideEffects: ['Reloads data for new range'] },
      { id: 'export-report', label: 'Export Report', trigger: 'click', sideEffects: ['Generates and downloads report'] },
    ],
    validations: [],
    states: [
      { state: 'loading', description: 'Fetching analytics', uiRepresentation: 'Chart skeletons' },
      { state: 'success', description: 'Data loaded', uiRepresentation: 'Populated charts' },
    ],
    dataEntitiesUsed: [
      { entityId: 'kpi-data', entityName: 'KPIData', fields: ['all'], operation: 'read' },
    ],
    auditEvents: [
      { event: 'report_exported', trigger: 'Report download', dataLogged: ['reportType', 'dateRange', 'userId', 'timestamp'] },
    ],
    helpContent: [],
    sourceFile: 'src/pages/Analytics.tsx',
    registeredAt: '2026-02-06',
    lastUpdated: '2026-02-06',
  },

  // Support Center
  {
    id: 'support-center',
    name: 'Support Center',
    route: '/support-center',
    description: 'Unified help and support hub with AI assistant, knowledge base, and escalation.',
    primaryPersona: 'buyer',
    otherPersonas: ['supplier', 'lab_technician', 'manager', 'admin'],
    jobsToBeDone: [
      'Ask Carlos (AI) questions about the platform',
      'Browse knowledge base articles',
      'Access guided resolutions for common issues',
      'Submit support tickets',
      'View ticket status and history',
    ],
    uiSections: [
      { id: 'ask-carlos', type: 'panel', name: 'Ask Carlos', description: 'AI chat interface' },
      { id: 'knowledge-base', type: 'list', name: 'Knowledge Base', description: 'Searchable articles' },
      { id: 'guided-resolution', type: 'widget', name: 'Guided Resolution', description: 'Step-by-step troubleshooting' },
      { id: 'support-tickets', type: 'table', name: 'Support Tickets', description: 'Ticket list and creation' },
    ],
    actions: [
      { id: 'ask-question', label: 'Ask Carlos', trigger: 'submit', sideEffects: ['Sends message to AI', 'Displays response'] },
      { id: 'create-ticket', label: 'Submit Ticket', trigger: 'click', sideEffects: ['Creates support ticket'] },
    ],
    validations: [
      { field: 'ticketDescription', rules: ['Required', 'Min 10 characters'], errorMessage: 'Please describe your issue in detail' },
    ],
    states: [
      { state: 'loading', description: 'Loading support resources', uiRepresentation: 'Skeleton' },
      { state: 'success', description: 'Support center loaded', uiRepresentation: 'Full support interface' },
    ],
    dataEntitiesUsed: [
      { entityId: 'chat-message', entityName: 'ChatMessage', fields: ['all'], operation: 'both' },
    ],
    auditEvents: [],
    helpContent: [],
    sourceFile: 'src/pages/SupportCenter.tsx',
    registeredAt: '2026-02-06',
    lastUpdated: '2026-02-06',
  },

  // Settings
  {
    id: 'settings',
    name: 'Settings',
    route: '/settings',
    description: 'User and system settings configuration.',
    primaryPersona: 'buyer',
    otherPersonas: ['supplier', 'lab_technician', 'manager', 'admin'],
    jobsToBeDone: [
      'Update profile information',
      'Configure notification preferences',
      'Manage team members (admin only)',
      'Set display preferences',
    ],
    uiSections: [
      { id: 'profile-settings', type: 'form', name: 'Profile Settings', description: 'User profile form' },
      { id: 'notification-settings', type: 'form', name: 'Notification Settings', description: 'Email/push preferences' },
      { id: 'team-management', type: 'table', name: 'Team Management', description: 'User list for admins', isConditional: true, conditionDescription: 'Visible to admin role only' },
    ],
    actions: [
      { id: 'save-settings', label: 'Save Settings', trigger: 'submit', sideEffects: ['Persists settings', 'Shows confirmation'] },
    ],
    validations: [
      { field: 'email', rules: ['Required', 'Valid email format'], errorMessage: 'Please enter a valid email address' },
    ],
    states: [
      { state: 'loading', description: 'Fetching settings', uiRepresentation: 'Form skeleton' },
      { state: 'success', description: 'Settings loaded', uiRepresentation: 'Populated forms' },
    ],
    dataEntitiesUsed: [
      { entityId: 'user', entityName: 'User', fields: ['all'], operation: 'both' },
    ],
    auditEvents: [
      { event: 'settings_updated', trigger: 'Save clicked', dataLogged: ['userId', 'changedFields', 'timestamp'] },
    ],
    helpContent: [],
    sourceFile: 'src/pages/Settings.tsx',
    registeredAt: '2026-02-06',
    lastUpdated: '2026-02-06',
  },
];

// ============================================
// WORKFLOW REGISTRY
// ============================================

export const workflowRegistry: WorkflowRegistryEntry[] = [
  // TRF Lifecycle
  {
    id: 'wf-trf-lifecycle',
    name: 'TRF Lifecycle',
    description: 'Complete Test Request Form lifecycle from creation to approval/rejection.',
    trigger: 'User creates a new TRF or testing is initiated from a style',
    steps: [
      { id: 'step-1', order: 1, name: 'Create TRF', description: 'TRF is created in draft status', actor: 'buyer', screenId: 'trfs' },
      { id: 'step-2', order: 2, name: 'Submit TRF', description: 'TRF is submitted for testing', actor: 'buyer', screenId: 'trf-detail' },
      { id: 'step-3', order: 3, name: 'Receive Sample', description: 'Lab receives physical sample', actor: 'lab_technician', screenId: 'lab' },
      { id: 'step-4', order: 4, name: 'Conduct Testing', description: 'Lab performs required tests', actor: 'lab_technician', screenId: 'lab', expectedDuration: '2-5 days' },
      { id: 'step-5', order: 5, name: 'Record Results', description: 'Test results are recorded in system', actor: 'lab_technician', screenId: 'trf-detail' },
      { id: 'step-6', order: 6, name: 'Review Results', description: 'QA reviews test results', actor: 'buyer', screenId: 'trf-detail' },
      { id: 'step-7a', order: 7, name: 'Approve TRF', description: 'TRF is approved and closed', actor: 'buyer', screenId: 'trf-detail' },
      { id: 'step-7b', order: 7, name: 'Reject TRF', description: 'TRF is rejected with reason', actor: 'buyer', screenId: 'trf-detail' },
    ],
    decisionPoints: [
      { id: 'dp-1', afterStepId: 'step-5', condition: 'All tests pass?', outcomes: [{ label: 'Yes - all pass', nextStepId: 'step-6' }, { label: 'No - failures exist', nextStepId: 'step-6' }] },
      { id: 'dp-2', afterStepId: 'step-6', condition: 'Approve or reject?', outcomes: [{ label: 'Approve', nextStepId: 'step-7a' }, { label: 'Reject', nextStepId: 'step-7b' }] },
    ],
    failureModes: [
      { id: 'fm-1', atStepId: 'step-3', description: 'Sample not received within SLA', recovery: 'System sends reminder to supplier, escalates after 48h', severity: 'high' },
      { id: 'fm-2', atStepId: 'step-4', description: 'Test equipment failure', recovery: 'Reschedule test, notify stakeholders', severity: 'medium' },
      { id: 'fm-3', atStepId: 'step-5', description: 'Results outside expected range', recovery: 'Flag for retest, require supervisor confirmation', severity: 'high' },
    ],
    aiMoments: [
      { id: 'ai-1', stepId: 'step-6', type: 'assists', description: 'AI provides approval recommendation with confidence score and reasoning', reasoning: 'AI analyzes historical pass rates, supplier history, and result patterns' },
      { id: 'ai-2', stepId: 'step-7b', type: 'silent', description: 'AI does not suggest rejection reasons - human judgment required', reasoning: 'Rejection reasons require contextual understanding that AI should not automate' },
    ],
    outputs: ['Approved TRF with COA', 'Rejected TRF with reason', 'Updated testing level status on style'],
    relatedScreenIds: ['trfs', 'trf-detail', 'lab', 'style-detail'],
    registeredAt: '2026-02-06',
    lastUpdated: '2026-02-06',
  },

  // Testing Level Gate Progression
  {
    id: 'wf-testing-gates',
    name: 'Testing Level Gate Progression',
    description: 'Progressive testing gates from Base to Bulk to Garment level.',
    trigger: 'Style is created and components are linked',
    steps: [
      { id: 'step-1', order: 1, name: 'Link Components', description: 'Associate fabric/trim components with style', actor: 'buyer', screenId: 'style-detail' },
      { id: 'step-2', order: 2, name: 'Submit Base Testing', description: 'Create TRF for base level tests', actor: 'buyer', screenId: 'style-detail' },
      { id: 'step-3', order: 3, name: 'Base Testing Complete', description: 'Lab completes base tests', actor: 'lab_technician', screenId: 'lab' },
      { id: 'step-4', order: 4, name: 'Approve Base Gate', description: 'Buyer approves base testing gate', actor: 'buyer', screenId: 'style-detail' },
      { id: 'step-5', order: 5, name: 'Submit Bulk Testing', description: 'Create TRF for bulk level tests', actor: 'buyer', screenId: 'style-detail' },
      { id: 'step-6', order: 6, name: 'Bulk Testing Complete', description: 'Lab completes bulk tests', actor: 'lab_technician', screenId: 'lab' },
      { id: 'step-7', order: 7, name: 'Approve Bulk Gate', description: 'Buyer approves bulk testing gate', actor: 'buyer', screenId: 'style-detail' },
      { id: 'step-8', order: 8, name: 'Submit Garment Testing', description: 'Create TRF for garment level tests', actor: 'buyer', screenId: 'style-detail' },
      { id: 'step-9', order: 9, name: 'Garment Testing Complete', description: 'Lab completes garment tests', actor: 'lab_technician', screenId: 'lab' },
      { id: 'step-10', order: 10, name: 'Approve Garment Gate', description: 'Buyer approves final garment gate', actor: 'buyer', screenId: 'style-detail' },
    ],
    decisionPoints: [
      { id: 'dp-1', afterStepId: 'step-3', condition: 'Base tests pass?', outcomes: [{ label: 'Yes', nextStepId: 'step-4' }, { label: 'No', nextStepId: 'step-2' }] },
      { id: 'dp-2', afterStepId: 'step-6', condition: 'Bulk tests pass?', outcomes: [{ label: 'Yes', nextStepId: 'step-7' }, { label: 'No', nextStepId: 'step-5' }] },
    ],
    failureModes: [
      { id: 'fm-1', atStepId: 'step-4', description: 'User lacks approval entitlement', recovery: 'Route to user with appropriate entitlement level', severity: 'low' },
      { id: 'fm-2', atStepId: 'step-5', description: 'Attempting to skip base gate', recovery: 'System blocks progression, displays gate requirement', severity: 'high' },
    ],
    aiMoments: [
      { id: 'ai-1', stepId: 'step-1', type: 'assists', description: 'AI suggests component sets based on similar approved styles', reasoning: 'Pattern matching from historical data' },
      { id: 'ai-2', stepId: 'step-4', type: 'assists', description: 'AI provides gate approval recommendation', reasoning: 'Analyzes test results against thresholds' },
    ],
    outputs: ['Locked testing levels', 'Updated style status', 'Readiness score update'],
    relatedScreenIds: ['style-detail', 'testing-levels', 'lab'],
    registeredAt: '2026-02-06',
    lastUpdated: '2026-02-06',
  },

  // GSW Submission and Approval
  {
    id: 'wf-gsw-approval',
    name: 'GSW Submission and Approval',
    description: 'Gold Seal Workbook upload, submission, and garment tech approval workflow.',
    trigger: 'All testing gates approved, care labels complete',
    steps: [
      { id: 'step-1', order: 1, name: 'Upload GSW', description: 'Upload GSW Excel file', actor: 'buyer', screenId: 'style-detail' },
      { id: 'step-2', order: 2, name: 'Submit to Garment Tech', description: 'Submit GSW for approval', actor: 'buyer', screenId: 'gsw' },
      { id: 'step-3', order: 3, name: 'Review GSW', description: 'Garment tech reviews workbook', actor: 'manager', screenId: 'gsw' },
      { id: 'step-4a', order: 4, name: 'Approve GSW', description: 'GSW approved for production', actor: 'manager', screenId: 'gsw' },
      { id: 'step-4b', order: 4, name: 'Reject GSW', description: 'GSW rejected with feedback', actor: 'manager', screenId: 'gsw' },
    ],
    decisionPoints: [
      { id: 'dp-1', afterStepId: 'step-3', condition: 'GSW meets requirements?', outcomes: [{ label: 'Approve', nextStepId: 'step-4a' }, { label: 'Reject', nextStepId: 'step-4b' }] },
    ],
    failureModes: [
      { id: 'fm-1', atStepId: 'step-1', description: 'Invalid file format', recovery: 'Validate and reject with error message', severity: 'low' },
      { id: 'fm-2', atStepId: 'step-2', description: 'Testing gates not complete', recovery: 'Block submission, show gate requirements', severity: 'high' },
    ],
    aiMoments: [
      { id: 'ai-1', stepId: 'step-2', type: 'assists', description: 'AI suggests appropriate garment tech based on workload and expertise', reasoning: 'Load balancing and skill matching' },
      { id: 'ai-2', stepId: 'step-3', type: 'silent', description: 'AI does not auto-approve GSW - requires human judgment', reasoning: 'GSW approval has production implications requiring expert review' },
    ],
    outputs: ['Approved GSW', 'Style marked as approved', 'DPP passport updated'],
    relatedScreenIds: ['style-detail', 'gsw'],
    registeredAt: '2026-02-06',
    lastUpdated: '2026-02-06',
  },

  // Inspection Scheduling
  {
    id: 'wf-inspection-scheduling',
    name: 'Inspection Scheduling and Execution',
    description: 'Factory inspection scheduling, execution, and findings management.',
    trigger: 'User initiates inspection scheduling',
    steps: [
      { id: 'step-1', order: 1, name: 'Schedule Inspection', description: 'Select factory, date, and type', actor: 'buyer', screenId: 'inspections' },
      { id: 'step-2', order: 2, name: 'Assign Auditors', description: 'Assign audit team to inspection', actor: 'buyer', screenId: 'inspections' },
      { id: 'step-3', order: 3, name: 'Conduct Inspection', description: 'On-site inspection execution', actor: 'buyer', screenId: 'inspection-detail' },
      { id: 'step-4', order: 4, name: 'Record Findings', description: 'Document inspection findings', actor: 'buyer', screenId: 'inspection-detail' },
      { id: 'step-5', order: 5, name: 'Generate Report', description: 'Create inspection report', actor: 'buyer', screenId: 'inspection-detail' },
      { id: 'step-6', order: 6, name: 'Track Corrective Actions', description: 'Monitor CAR completion', actor: 'buyer', screenId: 'inspection-detail' },
    ],
    decisionPoints: [
      { id: 'dp-1', afterStepId: 'step-4', condition: 'Critical findings?', outcomes: [{ label: 'Yes - critical', nextStepId: 'step-5' }, { label: 'No findings', nextStepId: 'step-5' }] },
    ],
    failureModes: [
      { id: 'fm-1', atStepId: 'step-3', description: 'Factory access denied', recovery: 'Escalate to supplier management', severity: 'critical' },
      { id: 'fm-2', atStepId: 'step-6', description: 'CAR not completed in time', recovery: 'Auto-escalate, block future orders', severity: 'high' },
    ],
    aiMoments: [
      { id: 'ai-1', stepId: 'step-1', type: 'assists', description: 'AI suggests inspection timing based on risk score and history', reasoning: 'Risk-based scheduling optimization' },
    ],
    outputs: ['Inspection report', 'Updated factory compliance score', 'CAR tickets'],
    relatedScreenIds: ['inspections', 'inspection-detail'],
    registeredAt: '2026-02-06',
    lastUpdated: '2026-02-06',
  },

  // Component Linking
  {
    id: 'wf-component-linking',
    name: 'Component Linking and Testing',
    description: 'Linking reusable components to styles and determining testing requirements.',
    trigger: 'User opens style and initiates component linking',
    steps: [
      { id: 'step-1', order: 1, name: 'Select Components', description: 'Choose components from library', actor: 'buyer', screenId: 'style-detail' },
      { id: 'step-2', order: 2, name: 'Assign Area Percentages', description: 'Set area coverage for each component', actor: 'buyer', screenId: 'style-detail' },
      { id: 'step-3', order: 3, name: 'Validate Configuration', description: 'System validates area totals and testing requirements', actor: 'system', screenId: 'style-detail' },
      { id: 'step-4', order: 4, name: 'Confirm Linking', description: 'Save component configuration', actor: 'buyer', screenId: 'style-detail' },
    ],
    decisionPoints: [
      { id: 'dp-1', afterStepId: 'step-2', condition: 'Area >10%?', outcomes: [{ label: 'Yes - full testing required', nextStepId: 'step-3' }, { label: 'No - limited testing', nextStepId: 'step-3' }] },
    ],
    failureModes: [
      { id: 'fm-1', atStepId: 'step-3', description: 'Area percentages do not sum to 100%', recovery: 'Display validation error, block save', severity: 'medium' },
    ],
    aiMoments: [
      { id: 'ai-1', stepId: 'step-1', type: 'assists', description: 'AI suggests component sets based on similar styles', reasoning: 'Pattern matching from approved collections' },
    ],
    outputs: ['Linked components', 'Generated testing requirements'],
    relatedScreenIds: ['style-detail', 'components'],
    registeredAt: '2026-02-06',
    lastUpdated: '2026-02-06',
  },

  // Care Label Creation
  {
    id: 'wf-care-label',
    name: 'Care Label Package Creation',
    description: 'Creating care label packages with symbols and wording for styles.',
    trigger: 'User initiates care label creation for a style',
    steps: [
      { id: 'step-1', order: 1, name: 'Select Care Symbols', description: 'Choose symbols from standard library', actor: 'buyer', screenId: 'style-detail' },
      { id: 'step-2', order: 2, name: 'Generate Wording', description: 'System generates care instructions', actor: 'system', screenId: 'style-detail' },
      { id: 'step-3', order: 3, name: 'Review and Edit', description: 'Refine wording and add hanger spec', actor: 'buyer', screenId: 'style-detail' },
      { id: 'step-4', order: 4, name: 'Approve Care Package', description: 'Finalize care label configuration', actor: 'buyer', screenId: 'style-detail' },
    ],
    decisionPoints: [],
    failureModes: [
      { id: 'fm-1', atStepId: 'step-1', description: 'No wash symbol selected', recovery: 'Validation error requiring at least one wash symbol', severity: 'low' },
    ],
    aiMoments: [
      { id: 'ai-1', stepId: 'step-1', type: 'assists', description: 'AI suggests care symbols based on component composition', reasoning: 'Composition-based care requirements' },
      { id: 'ai-2', stepId: 'step-2', type: 'assists', description: 'AI generates care wording from selected symbols', reasoning: 'Symbol-to-text translation' },
    ],
    outputs: ['Complete care label package', 'Updated style status'],
    relatedScreenIds: ['style-detail', 'care-labelling'],
    registeredAt: '2026-02-06',
    lastUpdated: '2026-02-06',
  },

  // Self-Approval Workflow
  {
    id: 'wf-self-approval',
    name: 'Self-Approval Workflow',
    description: 'Entitlement-based self-approval for testing gates and care labels.',
    trigger: 'User attempts to approve a gate or care label',
    steps: [
      { id: 'step-1', order: 1, name: 'Check Entitlement', description: 'System verifies user approval level', actor: 'system', screenId: 'style-detail' },
      { id: 'step-2a', order: 2, name: 'Allow Approval', description: 'User can approve if entitled', actor: 'buyer', screenId: 'style-detail' },
      { id: 'step-2b', order: 2, name: 'Block and Route', description: 'Route to entitled approver', actor: 'system', screenId: 'style-detail' },
    ],
    decisionPoints: [
      { id: 'dp-1', afterStepId: 'step-1', condition: 'User has entitlement?', outcomes: [{ label: 'Yes', nextStepId: 'step-2a' }, { label: 'No', nextStepId: 'step-2b' }] },
    ],
    failureModes: [
      { id: 'fm-1', atStepId: 'step-2b', description: 'No entitled approvers available', recovery: 'Escalate to admin', severity: 'high' },
    ],
    aiMoments: [
      { id: 'ai-1', stepId: 'step-2b', type: 'assists', description: 'AI identifies and suggests appropriate approver based on workload', reasoning: 'Load balancing across entitled users' },
    ],
    outputs: ['Approved gate/label', 'Routed approval request'],
    relatedScreenIds: ['style-detail', 'approval-levels'],
    registeredAt: '2026-02-06',
    lastUpdated: '2026-02-06',
  },
];

// ============================================
// DATA MODEL REGISTRY
// ============================================

export const entityRegistry: DataEntityDef[] = [
  // User
  {
    id: 'user',
    name: 'User',
    description: 'Platform user with role and profile information.',
    fields: [
      { name: 'id', type: 'string', required: true, description: 'Unique user identifier' },
      { name: 'name', type: 'string', required: true, description: 'Full name' },
      { name: 'email', type: 'string', required: true, description: 'Email address' },
      { name: 'role', type: 'UserRole', required: true, description: 'User role', enumRef: 'user-role' },
      { name: 'avatar', type: 'string', required: false, description: 'Avatar initials' },
      { name: 'avatarUrl', type: 'string', required: false, description: 'Avatar image URL' },
      { name: 'company', type: 'string', required: false, description: 'Company name' },
      { name: 'department', type: 'string', required: false, description: 'Department' },
    ],
    sourceFile: 'src/types/index.ts',
    registeredAt: '2026-02-06',
    lastUpdated: '2026-02-06',
  },

  // TRF
  {
    id: 'trf',
    name: 'TRF',
    description: 'Test Request Form for initiating and tracking product/component testing.',
    fields: [
      { name: 'id', type: 'string', required: true, description: 'Unique TRF identifier' },
      { name: 'reference', type: 'string', required: true, description: 'TRF reference number' },
      { name: 'productName', type: 'string', required: true, description: 'Product being tested' },
      { name: 'supplier', type: 'string', required: true, description: 'Supplier name' },
      { name: 'factory', type: 'string', required: true, description: 'Factory name' },
      { name: 'status', type: 'TRFStatus', required: true, description: 'Current TRF status', enumRef: 'trf-status' },
      { name: 'priority', type: 'Priority', required: true, description: 'Priority level', enumRef: 'priority' },
      { name: 'progress', type: 'number', required: true, description: 'Completion percentage 0-100' },
      { name: 'dueDate', type: 'string', required: true, description: 'Due date ISO string' },
      { name: 'createdAt', type: 'string', required: true, description: 'Creation timestamp' },
      { name: 'updatedAt', type: 'string', required: true, description: 'Last update timestamp' },
      { name: 'assignee', type: 'string', required: false, description: 'Assigned user name' },
      { name: 'category', type: 'string', required: true, description: 'Test category' },
      { name: 'testCount', type: 'number', required: true, description: 'Total tests' },
      { name: 'passedTests', type: 'number', required: true, description: 'Passed test count' },
      { name: 'failedTests', type: 'number', required: true, description: 'Failed test count' },
      { name: 'riskScore', type: 'number', required: false, description: 'Risk score 0-100' },
      { name: 'slaRemaining', type: 'number', required: false, description: 'Hours until SLA breach' },
      { name: 'timeline', type: 'TRFTimelineEvent[]', required: false, description: 'Event timeline' },
      { name: 'tests', type: 'TRFTest[]', required: false, description: 'Individual test results' },
      { name: 'documents', type: 'TRFDocument[]', required: false, description: 'Attached documents' },
    ],
    sourceFile: 'src/types/index.ts',
    dppRelevance: 'TRF test results serve as verification evidence for DPP compliance claims.',
    registeredAt: '2026-02-06',
    lastUpdated: '2026-02-06',
  },

  // ProductCollection (Style)
  {
    id: 'product-collection',
    name: 'ProductCollection',
    description: 'A style/product collection progressing through testing and approval pipeline.',
    fields: [
      { name: 'id', type: 'string', required: true, description: 'Unique collection identifier' },
      { name: 'name', type: 'string', required: true, description: 'Collection name' },
      { name: 'season', type: 'string', required: true, description: 'Season code (SS26, FW26)' },
      { name: 'brand', type: 'string', required: true, description: 'Brand name' },
      { name: 'department', type: 'string', required: true, description: 'Department category' },
      { name: 'supplierId', type: 'string', required: true, description: 'Supplier ID reference' },
      { name: 'supplierName', type: 'string', required: true, description: 'Supplier display name' },
      { name: 'factories', type: 'string[]', required: true, description: 'Factory names' },
      { name: 'status', type: 'CollectionStatus', required: true, description: 'Pipeline status', enumRef: 'collection-status' },
      { name: 'riskScore', type: 'number', required: true, description: 'Risk score 0-100' },
      { name: 'readinessScore', type: 'number', required: true, description: 'DPP readiness 0-100' },
      { name: 'componentIds', type: 'string[]', required: true, description: 'Linked component IDs' },
      { name: 'baseTesting', type: 'TestingLevelState', required: true, description: 'Base testing state' },
      { name: 'bulkTesting', type: 'TestingLevelState', required: true, description: 'Bulk testing state' },
      { name: 'garmentTesting', type: 'TestingLevelState', required: true, description: 'Garment testing state' },
      { name: 'careLabelPackage', type: 'CareLabelPackage', required: false, description: 'Care label configuration' },
      { name: 'gswSubmission', type: 'GSWSubmission', required: false, description: 'GSW submission state' },
      { name: 'dppPassportId', type: 'string', required: false, description: 'Digital Product Passport ID' },
      { name: 'createdAt', type: 'string', required: true, description: 'Creation timestamp' },
      { name: 'updatedAt', type: 'string', required: true, description: 'Last update timestamp' },
    ],
    sourceFile: 'src/types/styles.ts',
    dppRelevance: 'ProductCollection serves as the root entity for DPP passport generation.',
    registeredAt: '2026-02-06',
    lastUpdated: '2026-02-06',
  },

  // Component
  {
    id: 'component',
    name: 'Component',
    description: 'Reusable fabric, trim, or lining that can be linked to multiple styles.',
    fields: [
      { name: 'id', type: 'string', required: true, description: 'Unique component identifier' },
      { name: 'name', type: 'string', required: true, description: 'Component name' },
      { name: 'type', type: 'ComponentType', required: true, description: 'Component category', enumRef: 'component-type' },
      { name: 'composition', type: 'string', required: true, description: 'Material composition' },
      { name: 'construction', type: 'string', required: true, description: 'Construction method' },
      { name: 'nominatedSource', type: 'string', required: false, description: 'Nominated source/mill' },
      { name: 'areaPercentage', type: 'number', required: true, description: 'Area coverage percentage' },
      { name: 'riskAssessmentRequired', type: 'boolean', required: true, description: 'Requires full testing if >10%' },
      { name: 'supplierId', type: 'string', required: true, description: 'Supplier ID' },
      { name: 'supplierName', type: 'string', required: true, description: 'Supplier name' },
      { name: 'createdAt', type: 'string', required: true, description: 'Creation timestamp' },
      { name: 'updatedAt', type: 'string', required: true, description: 'Last update timestamp' },
    ],
    sourceFile: 'src/types/styles.ts',
    dppRelevance: 'Components provide material provenance data for DPP traceability.',
    registeredAt: '2026-02-06',
    lastUpdated: '2026-02-06',
  },

  // TestingLevelState
  {
    id: 'testing-level-state',
    name: 'TestingLevelState',
    description: 'State of a testing level (Base/Bulk/Garment) for a collection.',
    fields: [
      { name: 'level', type: 'TestingLevel', required: true, description: 'Testing level', enumRef: 'testing-level' },
      { name: 'trfId', type: 'string', required: false, description: 'Associated TRF ID' },
      { name: 'status', type: 'string', required: true, description: 'Gate status' },
      { name: 'submittedAt', type: 'string', required: false, description: 'Submission timestamp' },
      { name: 'approvedAt', type: 'string', required: false, description: 'Approval timestamp' },
      { name: 'approvedBy', type: 'string', required: false, description: 'Approver name' },
      { name: 'expiryDate', type: 'string', required: false, description: 'Approval expiry date' },
      { name: 'isLocked', type: 'boolean', required: true, description: 'Gate locked after approval' },
    ],
    sourceFile: 'src/types/styles.ts',
    registeredAt: '2026-02-06',
    lastUpdated: '2026-02-06',
  },

  // CareLabelPackage
  {
    id: 'care-label-package',
    name: 'CareLabelPackage',
    description: 'Care label configuration with symbols and wording for a style.',
    fields: [
      { name: 'id', type: 'string', required: true, description: 'Package identifier' },
      { name: 'symbols', type: 'CareSymbol[]', required: true, description: 'Selected care symbols' },
      { name: 'careWording', type: 'string', required: true, description: 'Care instruction text' },
      { name: 'hangerSpec', type: 'string', required: false, description: 'Hanger specification code' },
      { name: 'labelInstructionRef', type: 'string', required: false, description: 'Label instruction reference' },
      { name: 'isComplete', type: 'boolean', required: true, description: 'Package completion status' },
      { name: 'createdAt', type: 'string', required: true, description: 'Creation timestamp' },
      { name: 'updatedAt', type: 'string', required: true, description: 'Last update timestamp' },
    ],
    sourceFile: 'src/types/styles.ts',
    registeredAt: '2026-02-06',
    lastUpdated: '2026-02-06',
  },

  // CareSymbol
  {
    id: 'care-symbol',
    name: 'CareSymbol',
    description: 'Standard care symbol with code and description.',
    fields: [
      { name: 'id', type: 'string', required: true, description: 'Symbol identifier' },
      { name: 'code', type: 'string', required: true, description: 'Symbol code' },
      { name: 'icon', type: 'string', required: true, description: 'Icon emoji or path' },
      { name: 'description', type: 'string', required: true, description: 'Symbol meaning' },
    ],
    sourceFile: 'src/types/styles.ts',
    registeredAt: '2026-02-06',
    lastUpdated: '2026-02-06',
  },

  // GSWSubmission
  {
    id: 'gsw-submission',
    name: 'GSWSubmission',
    description: 'Gold Seal Workbook submission and approval tracking.',
    fields: [
      { name: 'id', type: 'string', required: true, description: 'Submission identifier' },
      { name: 'fileName', type: 'string', required: true, description: 'Uploaded file name' },
      { name: 'fileSize', type: 'string', required: true, description: 'File size string' },
      { name: 'version', type: 'number', required: true, description: 'Version number' },
      { name: 'submittedTo', type: 'string', required: false, description: 'Garment tech name' },
      { name: 'submittedAt', type: 'string', required: false, description: 'Submission timestamp' },
      { name: 'approvedBy', type: 'string', required: false, description: 'Approver name' },
      { name: 'approvedAt', type: 'string', required: false, description: 'Approval timestamp' },
      { name: 'status', type: 'string', required: true, description: 'GSW status' },
      { name: 'auditTrail', type: 'GSWAuditEvent[]', required: true, description: 'Audit event log' },
    ],
    sourceFile: 'src/types/styles.ts',
    registeredAt: '2026-02-06',
    lastUpdated: '2026-02-06',
  },

  // ApprovalEntitlement
  {
    id: 'approval-entitlement',
    name: 'ApprovalEntitlement',
    description: 'User self-approval permission level.',
    fields: [
      { name: 'userId', type: 'string', required: true, description: 'User ID' },
      { name: 'level', type: 'ApprovalLevel', required: true, description: 'Entitlement tier', enumRef: 'approval-level' },
    ],
    sourceFile: 'src/types/styles.ts',
    registeredAt: '2026-02-06',
    lastUpdated: '2026-02-06',
  },

  // Supplier
  {
    id: 'supplier',
    name: 'Supplier',
    description: 'Supplier entity with compliance and quality scores.',
    fields: [
      { name: 'id', type: 'string', required: true, description: 'Supplier identifier' },
      { name: 'name', type: 'string', required: true, description: 'Supplier name' },
      { name: 'email', type: 'string', required: true, description: 'Contact email' },
      { name: 'contactPerson', type: 'string', required: true, description: 'Primary contact' },
      { name: 'country', type: 'string', required: true, description: 'Country' },
      { name: 'factoryCount', type: 'number', required: true, description: 'Number of factories' },
      { name: 'status', type: 'string', required: true, description: 'Supplier status' },
      { name: 'complianceScore', type: 'number', required: true, description: 'Compliance score 0-100' },
      { name: 'qualityScore', type: 'number', required: true, description: 'Quality score 0-100' },
      { name: 'deliveryScore', type: 'number', required: true, description: 'Delivery score 0-100' },
      { name: 'lastAudit', type: 'string', required: false, description: 'Last audit date' },
      { name: 'certificatesExpiring', type: 'number', required: true, description: 'Expiring certs count' },
      { name: 'openTRFs', type: 'number', required: true, description: 'Open TRF count' },
    ],
    sourceFile: 'src/types/index.ts',
    registeredAt: '2026-02-06',
    lastUpdated: '2026-02-06',
  },

  // Inspection
  {
    id: 'inspection',
    name: 'Inspection',
    description: 'Factory inspection scheduling and execution record.',
    fields: [
      { name: 'id', type: 'string', required: true, description: 'Inspection identifier' },
      { name: 'type', type: 'InspectionType', required: true, description: 'Inspection type', enumRef: 'inspection-type' },
      { name: 'title', type: 'string', required: true, description: 'Inspection title' },
      { name: 'description', type: 'string', required: false, description: 'Description' },
      { name: 'factoryId', type: 'string', required: true, description: 'Factory ID' },
      { name: 'factoryName', type: 'string', required: true, description: 'Factory name' },
      { name: 'supplierId', type: 'string', required: true, description: 'Supplier ID' },
      { name: 'supplierName', type: 'string', required: true, description: 'Supplier name' },
      { name: 'location', type: 'string', required: true, description: 'Location' },
      { name: 'scheduledDate', type: 'string', required: true, description: 'Scheduled date' },
      { name: 'scheduledTime', type: 'string', required: false, description: 'Scheduled time' },
      { name: 'duration', type: 'number', required: true, description: 'Duration in hours' },
      { name: 'status', type: 'InspectionStatus', required: true, description: 'Inspection status', enumRef: 'inspection-status' },
      { name: 'priority', type: 'Priority', required: true, description: 'Priority level', enumRef: 'priority' },
      { name: 'assignee', type: 'string', required: false, description: 'Assigned auditor' },
      { name: 'auditorTeam', type: 'string[]', required: false, description: 'Audit team' },
      { name: 'findings', type: 'number', required: false, description: 'Finding count' },
      { name: 'passRate', type: 'number', required: false, description: 'Pass rate percentage' },
      { name: 'notes', type: 'string', required: false, description: 'Notes' },
      { name: 'createdAt', type: 'string', required: true, description: 'Creation timestamp' },
      { name: 'completedAt', type: 'string', required: false, description: 'Completion timestamp' },
    ],
    sourceFile: 'src/types/index.ts',
    registeredAt: '2026-02-06',
    lastUpdated: '2026-02-06',
  },

  // Product
  {
    id: 'product',
    name: 'Product',
    description: 'Individual product/SKU in the catalog.',
    fields: [
      { name: 'id', type: 'string', required: true, description: 'Product identifier' },
      { name: 'name', type: 'string', required: true, description: 'Product name' },
      { name: 'code', type: 'string', required: true, description: 'Product code/SKU' },
      { name: 'category', type: 'string', required: true, description: 'Product category' },
      { name: 'supplier', type: 'string', required: true, description: 'Supplier name' },
      { name: 'supplierId', type: 'string', required: true, description: 'Supplier ID' },
      { name: 'description', type: 'string', required: false, description: 'Description' },
      { name: 'imageUrl', type: 'string', required: false, description: 'Primary image URL' },
      { name: 'images', type: 'ProductImage[]', required: false, description: 'Image gallery' },
      { name: 'status', type: 'string', required: true, description: 'Product status' },
      { name: 'complianceStatus', type: 'string', required: true, description: 'Compliance status' },
      { name: 'lastTested', type: 'string', required: false, description: 'Last test date' },
      { name: 'activeTRFs', type: 'number', required: true, description: 'Active TRF count' },
      { name: 'passRate', type: 'number', required: true, description: 'Pass rate percentage' },
      { name: 'riskScore', type: 'number', required: true, description: 'Risk score 0-100' },
      { name: 'specifications', type: 'object', required: false, description: 'Product specifications' },
    ],
    sourceFile: 'src/types/index.ts',
    registeredAt: '2026-02-06',
    lastUpdated: '2026-02-06',
  },

  // LabSample
  {
    id: 'lab-sample',
    name: 'LabSample',
    description: 'Physical sample in the lab testing queue.',
    fields: [
      { name: 'id', type: 'string', required: true, description: 'Sample identifier' },
      { name: 'trfReference', type: 'string', required: true, description: 'TRF reference' },
      { name: 'sampleType', type: 'string', required: true, description: 'Sample type' },
      { name: 'status', type: 'string', required: true, description: 'Sample status' },
      { name: 'priority', type: 'Priority', required: true, description: 'Priority level', enumRef: 'priority' },
      { name: 'receivedDate', type: 'string', required: true, description: 'Received date' },
      { name: 'dueDate', type: 'string', required: true, description: 'Due date' },
      { name: 'assignee', type: 'string', required: false, description: 'Assigned technician' },
      { name: 'testType', type: 'string', required: true, description: 'Test type' },
      { name: 'progress', type: 'number', required: true, description: 'Progress percentage' },
    ],
    sourceFile: 'src/types/index.ts',
    registeredAt: '2026-02-06',
    lastUpdated: '2026-02-06',
  },

  // Task (AI-computed)
  {
    id: 'task',
    name: 'Task',
    description: 'AI-prioritized task appearing in the dashboard inbox.',
    fields: [
      { name: 'id', type: 'string', required: true, description: 'Task identifier' },
      { name: 'title', type: 'string', required: true, description: 'Task title' },
      { name: 'description', type: 'string', required: true, description: 'Task description' },
      { name: 'priority', type: 'Priority', required: true, description: 'Priority level', enumRef: 'priority' },
      { name: 'type', type: 'string', required: true, description: 'Task type' },
      { name: 'objectType', type: 'string', required: true, description: 'Related object type' },
      { name: 'objectId', type: 'string', required: true, description: 'Related object ID' },
      { name: 'dueDate', type: 'string', required: false, description: 'Due date' },
      { name: 'slaRemaining', type: 'number', required: false, description: 'Hours until SLA breach' },
      { name: 'aiRecommendation', type: 'string', required: false, description: 'AI recommendation' },
      { name: 'aiConfidence', type: 'number', required: false, description: 'AI confidence 0-100' },
      { name: 'isRead', type: 'boolean', required: true, description: 'Read status' },
      { name: 'createdAt', type: 'string', required: true, description: 'Creation timestamp' },
    ],
    sourceFile: 'src/types/index.ts',
    registeredAt: '2026-02-06',
    lastUpdated: '2026-02-06',
  },

  // ReadinessScore
  {
    id: 'readiness-score',
    name: 'ReadinessScore',
    description: 'DPP attribute coverage and readiness metrics.',
    fields: [
      { name: 'overall', type: 'number', required: true, description: 'Overall readiness 0-100' },
      { name: 'trend', type: 'string', required: true, description: 'Trend direction' },
      { name: 'confidence', type: 'string', required: true, description: 'Confidence level' },
      { name: 'gaps', type: 'ReadinessGap[]', required: true, description: 'Coverage gaps' },
      { name: 'lastUpdated', type: 'string', required: true, description: 'Last update timestamp' },
    ],
    sourceFile: 'src/types/ai-context.ts',
    dppRelevance: 'ReadinessScore tracks DPP attribute coverage and compliance gaps.',
    registeredAt: '2026-02-06',
    lastUpdated: '2026-02-06',
  },

  // AIContext
  {
    id: 'ai-context',
    name: 'AIContext',
    description: 'Context object computed before UI rendering for AI decisions.',
    fields: [
      { name: 'userId', type: 'string', required: true, description: 'Current user ID' },
      { name: 'role', type: 'UserRole', required: true, description: 'User role', enumRef: 'user-role' },
      { name: 'criticalItems', type: 'number', required: true, description: 'Critical item count' },
      { name: 'upcomingRegulatoryRisk', type: 'string', required: true, description: 'Regulatory risk level' },
      { name: 'blockedDownstream', type: 'boolean', required: true, description: 'Has blocked dependencies' },
      { name: 'confidenceGap', type: 'string', required: true, description: 'Confidence gap level' },
      { name: 'historicalDelayPattern', type: 'string[]', required: true, description: 'Historical delay patterns' },
      { name: 'computedAt', type: 'string', required: true, description: 'Computation timestamp' },
    ],
    sourceFile: 'src/types/ai-context.ts',
    registeredAt: '2026-02-06',
    lastUpdated: '2026-02-06',
  },
];

// ============================================
// ENUM REGISTRY
// ============================================

export const enumRegistry: EnumDef[] = [
  {
    id: 'user-role',
    name: 'UserRole',
    values: [
      { value: 'buyer', description: 'Buyer / QA Manager - Primary user managing quality assurance' },
      { value: 'supplier', description: 'Supplier User - External supplier submitting documents' },
      { value: 'lab_technician', description: 'Lab Technician - SGS lab staff conducting tests' },
      { value: 'manager', description: 'Manager / Executive - Executive oversight and analytics' },
      { value: 'admin', description: 'System Admin - Platform configuration and administration' },
    ],
    sourceFile: 'src/types/index.ts',
  },
  {
    id: 'priority',
    name: 'Priority',
    values: [
      { value: 'critical', description: 'Requires immediate attention, SLA at risk' },
      { value: 'at-risk', description: 'Approaching SLA deadline, needs action' },
      { value: 'on-track', description: 'Progressing normally within SLA' },
      { value: 'info', description: 'Informational, no action required' },
    ],
    sourceFile: 'src/types/index.ts',
  },
  {
    id: 'trf-status',
    name: 'TRFStatus',
    values: [
      { value: 'draft', description: 'TRF created but not submitted' },
      { value: 'submitted', description: 'TRF submitted for testing' },
      { value: 'in_progress', description: 'Testing in progress' },
      { value: 'pending_review', description: 'Testing complete, awaiting review' },
      { value: 'approved', description: 'TRF approved' },
      { value: 'rejected', description: 'TRF rejected' },
      { value: 'completed', description: 'TRF closed/completed' },
    ],
    sourceFile: 'src/types/index.ts',
  },
  {
    id: 'collection-status',
    name: 'CollectionStatus',
    values: [
      { value: 'draft', description: 'Collection created, pending setup' },
      { value: 'components_pending', description: 'Waiting for component links' },
      { value: 'base_testing', description: 'Base testing in progress' },
      { value: 'bulk_testing', description: 'Bulk testing in progress' },
      { value: 'garment_testing', description: 'Final garment testing' },
      { value: 'care_labelling', description: 'Completing care labels' },
      { value: 'gsw_pending', description: 'Awaiting GSW approval' },
      { value: 'approved', description: 'Collection fully approved' },
      { value: 'rejected', description: 'Collection rejected' },
    ],
    sourceFile: 'src/types/styles.ts',
  },
  {
    id: 'component-type',
    name: 'ComponentType',
    values: [
      { value: 'Fabric', description: 'Main fabric material' },
      { value: 'Trim', description: 'Buttons, zippers, labels' },
      { value: 'Lining', description: 'Internal lining material' },
      { value: 'Pocketing', description: 'Pocket lining material' },
      { value: 'Other', description: 'Other component types' },
    ],
    sourceFile: 'src/types/styles.ts',
  },
  {
    id: 'testing-level',
    name: 'TestingLevel',
    values: [
      { value: 'Base', description: 'Initial base-level testing' },
      { value: 'Bulk', description: 'Bulk production testing' },
      { value: 'Garment', description: 'Final garment-level testing' },
    ],
    sourceFile: 'src/types/styles.ts',
  },
  {
    id: 'approval-level',
    name: 'ApprovalLevel',
    values: [
      { value: 'None', description: 'Cannot self-approve any items' },
      { value: 'Bronze', description: 'Can approve care codes only' },
      { value: 'Silver', description: 'Can approve care codes + base + bulk testing' },
      { value: 'Gold', description: 'Can approve full cycle including garment testing' },
    ],
    sourceFile: 'src/types/styles.ts',
  },
  {
    id: 'inspection-type',
    name: 'InspectionType',
    values: [
      { value: 'factory_audit', description: 'Full factory audit' },
      { value: 'quality_check', description: 'Quality spot check' },
      { value: 'social_compliance', description: 'Social compliance audit' },
      { value: 'environmental', description: 'Environmental audit' },
      { value: 'pre_shipment', description: 'Pre-shipment inspection' },
    ],
    sourceFile: 'src/types/index.ts',
  },
  {
    id: 'inspection-status',
    name: 'InspectionStatus',
    values: [
      { value: 'scheduled', description: 'Inspection scheduled' },
      { value: 'in_progress', description: 'Inspection in progress' },
      { value: 'completed', description: 'Inspection completed' },
      { value: 'cancelled', description: 'Inspection cancelled' },
      { value: 'postponed', description: 'Inspection postponed' },
    ],
    sourceFile: 'src/types/index.ts',
  },
];

// ============================================
// RELATIONSHIP REGISTRY
// ============================================

export const relationshipRegistry: RelationshipDef[] = [
  { id: 'rel-1', from: 'ProductCollection', to: 'Component', type: 'many:many', description: 'Styles link to multiple components via componentIds array' },
  { id: 'rel-2', from: 'ProductCollection', to: 'TestingLevelState', type: '1:1', description: 'Each style has one state per testing level (Base, Bulk, Garment)' },
  { id: 'rel-3', from: 'ProductCollection', to: 'CareLabelPackage', type: '1:1', description: 'Each style has one care label package' },
  { id: 'rel-4', from: 'ProductCollection', to: 'GSWSubmission', type: '1:1', description: 'Each style has one GSW submission' },
  { id: 'rel-5', from: 'ProductCollection', to: 'Supplier', type: '1:many', description: 'Many styles belong to one supplier' },
  { id: 'rel-6', from: 'TRF', to: 'TRFTest', type: '1:many', description: 'One TRF has many individual tests' },
  { id: 'rel-7', from: 'TRF', to: 'TRFDocument', type: '1:many', description: 'One TRF has many documents' },
  { id: 'rel-8', from: 'TRF', to: 'TRFTimelineEvent', type: '1:many', description: 'One TRF has many timeline events' },
  { id: 'rel-9', from: 'TestingLevelState', to: 'TRF', type: '1:1', description: 'Each testing level state links to one TRF' },
  { id: 'rel-10', from: 'CareLabelPackage', to: 'CareSymbol', type: '1:many', description: 'One package has many symbols' },
  { id: 'rel-11', from: 'GSWSubmission', to: 'GSWAuditEvent', type: '1:many', description: 'One GSW has many audit events' },
  { id: 'rel-12', from: 'User', to: 'ApprovalEntitlement', type: '1:1', description: 'Each user has one approval entitlement' },
  { id: 'rel-13', from: 'Supplier', to: 'Component', type: '1:many', description: 'One supplier provides many components' },
  { id: 'rel-14', from: 'Inspection', to: 'Supplier', type: '1:many', description: 'Many inspections belong to one supplier' },
  { id: 'rel-15', from: 'Product', to: 'ProductImage', type: '1:many', description: 'One product has many images' },
  { id: 'rel-16', from: 'LabSample', to: 'TRF', type: '1:many', description: 'Many samples belong to one TRF' },
];

// ============================================
// ROLES REGISTRY
// ============================================

export const rolesRegistry: RoleDef[] = [
  {
    role: 'buyer',
    displayName: 'Buyer / QA Manager',
    description: 'Primary user responsible for quality assurance, product testing, and supplier management.',
    primaryResponsibilities: [
      'Manage product collections through testing pipeline',
      'Review and approve TRFs and testing gates',
      'Link components and configure care labels',
      'Schedule and review factory inspections',
      'Monitor supplier compliance and risk',
    ],
    accessibleScreens: ['dashboard', 'styles', 'style-detail', 'components', 'testing-levels', 'inspections', 'inspection-detail', 'care-labelling', 'gsw', 'trfs', 'trf-detail', 'products', 'product-detail', 'suppliers', 'analytics', 'support-center', 'settings'],
  },
  {
    role: 'supplier',
    displayName: 'Supplier User',
    description: 'External supplier who submits documents and monitors submission status.',
    primaryResponsibilities: [
      'Submit required documents and samples',
      'Track submission status and feedback',
      'Respond to TRF requirements',
      'View inspection schedules and findings',
    ],
    accessibleScreens: ['dashboard', 'products', 'product-detail', 'support-center', 'settings'],
  },
  {
    role: 'lab_technician',
    displayName: 'Lab Technician',
    description: 'SGS laboratory staff who conducts physical testing and records results.',
    primaryResponsibilities: [
      'Process testing queue based on priority',
      'Conduct physical tests per protocol',
      'Record and validate test results',
      'Flag anomalies and request retests',
    ],
    accessibleScreens: ['dashboard', 'lab', 'trfs', 'trf-detail', 'support-center', 'settings'],
  },
  {
    role: 'manager',
    displayName: 'Manager / Executive',
    description: 'Executive user with oversight responsibilities and access to analytics.',
    primaryResponsibilities: [
      'Monitor overall quality metrics and KPIs',
      'Review team performance and SLA compliance',
      'Approve GSW submissions',
      'Access executive analytics and reports',
    ],
    accessibleScreens: ['dashboard', 'styles', 'style-detail', 'testing-levels', 'inspections', 'inspection-detail', 'gsw', 'trfs', 'trf-detail', 'products', 'product-detail', 'suppliers', 'lab', 'analytics', 'support-center', 'settings'],
  },
  {
    role: 'admin',
    displayName: 'System Admin',
    description: 'Platform administrator with full access including system configuration.',
    primaryResponsibilities: [
      'Configure user approval entitlements',
      'Manage platform settings and users',
      'Access documentation and system logs',
      'Full access to all platform features',
    ],
    accessibleScreens: ['dashboard', 'styles', 'style-detail', 'components', 'testing-levels', 'inspections', 'inspection-detail', 'care-labelling', 'gsw', 'approval-levels', 'trfs', 'trf-detail', 'products', 'product-detail', 'suppliers', 'lab', 'analytics', 'support-center', 'settings', 'documentation'],
  },
];

// ============================================
// APPROVAL MATRIX
// ============================================

export const approvalMatrix: ApprovalMatrixEntry[] = [
  {
    level: 'None',
    displayName: 'No Self-Approval',
    description: 'Cannot approve any testing gates or care labels. All approvals must be routed to entitled users.',
    permissions: { careLabels: false, baseTesting: false, bulkTesting: false, garmentTesting: false },
  },
  {
    level: 'Bronze',
    displayName: 'Bronze - Care Labels Only',
    description: 'Can self-approve care label packages only. Testing gates require routing.',
    permissions: { careLabels: true, baseTesting: false, bulkTesting: false, garmentTesting: false },
  },
  {
    level: 'Silver',
    displayName: 'Silver - Base & Bulk Testing',
    description: 'Can self-approve care labels, base testing, and bulk testing gates.',
    permissions: { careLabels: true, baseTesting: true, bulkTesting: true, garmentTesting: false },
  },
  {
    level: 'Gold',
    displayName: 'Gold - Full Cycle',
    description: 'Can self-approve the complete cycle including garment testing.',
    permissions: { careLabels: true, baseTesting: true, bulkTesting: true, garmentTesting: true },
  },
];

// ============================================
// FEATURE FLAGS
// ============================================

export const featureFlags: FeatureFlag[] = [
  {
    id: 'demo-mode',
    name: 'Demo Mode',
    description: 'Enables demo user switching in the sidebar for demonstration purposes.',
    defaultValue: true,
    affectedScreens: ['dashboard', 'settings'],
  },
  {
    id: 'ai-assist',
    name: 'AI Assist Panel',
    description: 'Shows AI suggestion panels and assessment strips on detail pages.',
    defaultValue: true,
    affectedScreens: ['dashboard', 'style-detail', 'trf-detail'],
  },
  {
    id: 'dpp-integration',
    name: 'DPP Integration',
    description: 'Enables Digital Product Passport features and readiness tracking.',
    defaultValue: true,
    affectedScreens: ['dashboard', 'style-detail', 'analytics'],
  },
  {
    id: 'map-view',
    name: 'Inspection Map View',
    description: 'Enables geographic map view for inspections.',
    defaultValue: true,
    affectedScreens: ['inspections'],
  },
];

// ============================================
// COMBINED REGISTRY EXPORT
// ============================================

export const documentationRegistry: DocumentationRegistry = {
  screens: screenRegistry,
  workflows: workflowRegistry,
  entities: entityRegistry,
  enums: enumRegistry,
  relationships: relationshipRegistry,
  roles: rolesRegistry,
  approvalMatrix: approvalMatrix,
  featureFlags: featureFlags,
};

export default documentationRegistry;
