import { 
  Component, 
  ProductCollection, 
  StyleProduct, 
  ApprovalEntitlement,
  CareLabelPackage,
  CareSymbol,
  GSWSubmission
} from '@/types/styles';

// Mock Care Symbols
export const careSymbols: CareSymbol[] = [
  { id: 'wash-30', code: 'W30', icon: '🧺', description: 'Machine wash at 30°C' },
  { id: 'wash-40', code: 'W40', icon: '🧺', description: 'Machine wash at 40°C' },
  { id: 'no-bleach', code: 'NB', icon: '⛔', description: 'Do not bleach' },
  { id: 'tumble-low', code: 'TL', icon: '🌀', description: 'Tumble dry low' },
  { id: 'iron-med', code: 'IM', icon: '🔥', description: 'Iron medium heat' },
  { id: 'dry-clean', code: 'DC', icon: '🧹', description: 'Professional dry clean' },
  { id: 'no-wring', code: 'NW', icon: '💧', description: 'Do not wring' },
  { id: 'flat-dry', code: 'FD', icon: '📏', description: 'Dry flat' },
];

// Mock Components Library
export const mockComponents: Component[] = [
  {
    id: 'comp-001',
    name: 'Organic Cotton Jersey 180gsm',
    type: 'Fabric',
    composition: '100% Organic Cotton',
    construction: 'Single Jersey Knit',
    nominatedSource: 'EcoMills Ltd',
    areaPercentage: 85,
    riskAssessmentRequired: true,
    supplierId: 'supplier-003',
    supplierName: 'EcoTextile Inc',
    createdAt: '2025-11-01',
    updatedAt: '2026-01-15'
  },
  {
    id: 'comp-002',
    name: 'Cotton Rib 1x1',
    type: 'Trim',
    composition: '95% Cotton, 5% Elastane',
    construction: '1x1 Rib Knit',
    areaPercentage: 8,
    riskAssessmentRequired: false,
    supplierId: 'supplier-001',
    supplierName: 'Textile Supplier Ltd',
    createdAt: '2025-10-20',
    updatedAt: '2026-01-10'
  },
  {
    id: 'comp-003',
    name: 'Polyester Lining 60gsm',
    type: 'Lining',
    composition: '100% Polyester',
    construction: 'Taffeta Weave',
    areaPercentage: 15,
    riskAssessmentRequired: true,
    supplierId: 'supplier-004',
    supplierName: 'ActiveWear Partners',
    createdAt: '2025-09-15',
    updatedAt: '2025-12-20'
  },
  {
    id: 'comp-004',
    name: 'Premium Denim 12oz',
    type: 'Fabric',
    composition: '98% Cotton, 2% Elastane',
    construction: 'Twill Weave',
    nominatedSource: 'Denim Masters Factory',
    areaPercentage: 90,
    riskAssessmentRequired: true,
    supplierId: 'supplier-002',
    supplierName: 'Denim Masters Co',
    createdAt: '2025-08-01',
    updatedAt: '2026-01-20'
  },
  {
    id: 'comp-005',
    name: 'Metal Button 15mm',
    type: 'Trim',
    composition: 'Brass alloy with nickel-free coating',
    construction: 'Die-cast',
    areaPercentage: 1,
    riskAssessmentRequired: false,
    supplierId: 'supplier-001',
    supplierName: 'Textile Supplier Ltd',
    createdAt: '2025-07-10',
    updatedAt: '2025-11-05'
  },
  {
    id: 'comp-006',
    name: 'Pocket Lining Cotton 80gsm',
    type: 'Pocketing',
    composition: '100% Cotton',
    construction: 'Plain Weave',
    areaPercentage: 5,
    riskAssessmentRequired: true, // Pocketing requires full testing
    supplierId: 'supplier-003',
    supplierName: 'EcoTextile Inc',
    createdAt: '2025-10-01',
    updatedAt: '2026-01-05'
  },
  {
    id: 'comp-007',
    name: 'Recycled Polyester Fleece 280gsm',
    type: 'Fabric',
    composition: '100% Recycled Polyester',
    construction: 'Brushed Fleece',
    nominatedSource: 'GreenTex Recycling',
    areaPercentage: 80,
    riskAssessmentRequired: true,
    supplierId: 'supplier-004',
    supplierName: 'ActiveWear Partners',
    createdAt: '2025-11-15',
    updatedAt: '2026-01-25'
  },
  {
    id: 'comp-008',
    name: 'YKK Zipper Coil #5',
    type: 'Trim',
    composition: 'Nylon coil, zinc alloy slider',
    construction: 'Continuous coil',
    areaPercentage: 2,
    riskAssessmentRequired: false,
    supplierId: 'supplier-001',
    supplierName: 'Textile Supplier Ltd',
    createdAt: '2025-06-20',
    updatedAt: '2025-09-15'
  }
];

// Mock Product Collections
export const mockCollections: ProductCollection[] = [
  {
    id: 'coll-001',
    name: 'Essential Cotton Tees SS26',
    season: 'SS26',
    brand: 'RetailCo Basics',
    department: 'Mens Casual',
    supplierId: 'supplier-001',
    supplierName: 'Textile Supplier Ltd',
    factories: ['Dongguan Factory A', 'Dongguan Factory B'],
    status: 'bulk_testing',
    riskScore: 24,
    readinessScore: 72,
    componentIds: ['comp-001', 'comp-002'],
    baseTesting: {
      level: 'Base',
      trfId: 'trf-001',
      status: 'approved',
      submittedAt: '2026-01-15',
      approvedAt: '2026-01-28',
      approvedBy: 'Sarah Chen',
      expiryDate: '2027-01-28',
      isLocked: true
    },
    bulkTesting: {
      level: 'Bulk',
      trfId: 'trf-007',
      status: 'in_progress',
      submittedAt: '2026-02-01',
      isLocked: false
    },
    garmentTesting: {
      level: 'Garment',
      status: 'not_started',
      isLocked: false
    },
    careLabelPackage: {
      id: 'cl-001',
      symbols: [careSymbols[0], careSymbols[2], careSymbols[4]],
      careWording: 'Machine wash cold with similar colors. Tumble dry low. Iron on medium if needed.',
      hangerSpec: 'HS-TSHIRT-M',
      labelInstructionRef: 'LI-2026-001',
      isComplete: true,
      createdAt: '2026-01-20',
      updatedAt: '2026-01-25'
    },
    createdAt: '2026-01-10',
    updatedAt: '2026-02-04'
  },
  {
    id: 'coll-002',
    name: 'Kids Denim Collection FW26',
    season: 'FW26',
    brand: 'RetailCo Kids',
    department: 'Kids Bottoms',
    supplierId: 'supplier-002',
    supplierName: 'Denim Masters Co',
    factories: ['Vietnam Plant 2'],
    status: 'base_testing',
    riskScore: 58,
    readinessScore: 35,
    componentIds: ['comp-004', 'comp-005', 'comp-006'],
    baseTesting: {
      level: 'Base',
      trfId: 'trf-002',
      status: 'in_progress',
      submittedAt: '2026-01-20',
      isLocked: false
    },
    bulkTesting: {
      level: 'Bulk',
      status: 'not_started',
      isLocked: false
    },
    garmentTesting: {
      level: 'Garment',
      status: 'not_started',
      isLocked: false
    },
    createdAt: '2026-01-18',
    updatedAt: '2026-02-03'
  },
  {
    id: 'coll-003',
    name: 'Eco Fleece Hoodies AW26',
    season: 'AW26',
    brand: 'RetailCo Active',
    department: 'Activewear',
    supplierId: 'supplier-004',
    supplierName: 'ActiveWear Partners',
    factories: ['Shanghai Tech Facility'],
    status: 'components_pending',
    riskScore: 42,
    readinessScore: 18,
    componentIds: ['comp-007', 'comp-008'],
    baseTesting: {
      level: 'Base',
      status: 'not_started',
      isLocked: false
    },
    bulkTesting: {
      level: 'Bulk',
      status: 'not_started',
      isLocked: false
    },
    garmentTesting: {
      level: 'Garment',
      status: 'not_started',
      isLocked: false
    },
    createdAt: '2026-02-01',
    updatedAt: '2026-02-04'
  },
  {
    id: 'coll-004',
    name: 'Organic Baby Essentials SS26',
    season: 'SS26',
    brand: 'RetailCo Baby',
    department: 'Infant Apparel',
    supplierId: 'supplier-003',
    supplierName: 'EcoTextile Inc',
    factories: ['Sustainable Mill 1'],
    status: 'approved',
    riskScore: 8,
    readinessScore: 98,
    componentIds: ['comp-001', 'comp-006'],
    baseTesting: {
      level: 'Base',
      trfId: 'trf-003',
      status: 'approved',
      submittedAt: '2026-01-05',
      approvedAt: '2026-01-18',
      approvedBy: 'Sarah Chen',
      expiryDate: '2027-01-18',
      isLocked: true
    },
    bulkTesting: {
      level: 'Bulk',
      trfId: 'trf-008',
      status: 'approved',
      submittedAt: '2026-01-20',
      approvedAt: '2026-01-28',
      approvedBy: 'Sarah Chen',
      isLocked: true
    },
    garmentTesting: {
      level: 'Garment',
      trfId: 'trf-009',
      status: 'approved',
      submittedAt: '2026-01-25',
      approvedAt: '2026-02-01',
      approvedBy: 'Sarah Chen',
      isLocked: true
    },
    careLabelPackage: {
      id: 'cl-002',
      symbols: [careSymbols[0], careSymbols[2], careSymbols[7]],
      careWording: 'Machine wash cold on gentle cycle. Do not bleach. Lay flat to dry.',
      hangerSpec: 'HS-BABY-S',
      labelInstructionRef: 'LI-2026-002',
      isComplete: true,
      createdAt: '2026-01-15',
      updatedAt: '2026-01-22'
    },
    gswSubmission: {
      id: 'gsw-001',
      fileName: 'GSW_Baby_Essentials_SS26_v2.xlsx',
      fileSize: '2.4 MB',
      version: 2,
      submittedTo: 'Jennifer Wu (Garment Tech)',
      submittedAt: '2026-02-02',
      approvedBy: 'Jennifer Wu',
      approvedAt: '2026-02-03',
      status: 'approved',
      auditTrail: [
        { id: 'gswat-001', action: 'File uploaded', actor: 'Sarah Chen', timestamp: '2026-02-01T10:00:00Z' },
        { id: 'gswat-002', action: 'Submitted for approval', actor: 'Sarah Chen', timestamp: '2026-02-02T09:00:00Z', notes: 'All tests passed, ready for GSW' },
        { id: 'gswat-003', action: 'Approved', actor: 'Jennifer Wu', timestamp: '2026-02-03T14:30:00Z', notes: 'GSW approved for production' }
      ]
    },
    dppPassportId: 'dpp-001',
    createdAt: '2026-01-02',
    updatedAt: '2026-02-03'
  },
  {
    id: 'coll-005',
    name: 'Performance Sports Bras SS26',
    season: 'SS26',
    brand: 'RetailCo Active',
    department: 'Womens Athletic',
    supplierId: 'supplier-004',
    supplierName: 'ActiveWear Partners',
    factories: ['Shanghai Tech Facility'],
    status: 'care_labelling',
    riskScore: 32,
    readinessScore: 65,
    componentIds: ['comp-003', 'comp-007'],
    baseTesting: {
      level: 'Base',
      trfId: 'trf-004',
      status: 'approved',
      submittedAt: '2026-01-18',
      approvedAt: '2026-01-30',
      approvedBy: 'Mark Richardson',
      expiryDate: '2027-01-30',
      isLocked: true
    },
    bulkTesting: {
      level: 'Bulk',
      trfId: 'trf-010',
      status: 'approved',
      submittedAt: '2026-01-31',
      approvedAt: '2026-02-02',
      approvedBy: 'Sarah Chen',
      isLocked: true
    },
    garmentTesting: {
      level: 'Garment',
      status: 'not_started',
      isLocked: false
    },
    createdAt: '2026-01-15',
    updatedAt: '2026-02-04'
  },
  {
    id: 'coll-006',
    name: 'Winter Outerwear Collection FW26',
    season: 'FW26',
    brand: 'RetailCo Premium',
    department: 'Outerwear',
    supplierId: 'supplier-001',
    supplierName: 'Textile Supplier Ltd',
    factories: ['Jiangsu Factory B'],
    status: 'gsw_pending',
    riskScore: 28,
    readinessScore: 88,
    componentIds: ['comp-003', 'comp-007', 'comp-008'],
    baseTesting: {
      level: 'Base',
      trfId: 'trf-005',
      status: 'approved',
      submittedAt: '2026-01-10',
      approvedAt: '2026-01-22',
      approvedBy: 'Sarah Chen',
      expiryDate: '2027-01-22',
      isLocked: true
    },
    bulkTesting: {
      level: 'Bulk',
      trfId: 'trf-011',
      status: 'approved',
      submittedAt: '2026-01-24',
      approvedAt: '2026-02-01',
      approvedBy: 'Mark Richardson',
      isLocked: true
    },
    garmentTesting: {
      level: 'Garment',
      trfId: 'trf-012',
      status: 'approved',
      submittedAt: '2026-02-01',
      approvedAt: '2026-02-03',
      approvedBy: 'Sarah Chen',
      isLocked: true
    },
    careLabelPackage: {
      id: 'cl-003',
      symbols: [careSymbols[1], careSymbols[2], careSymbols[5]],
      careWording: 'Professional dry clean only. Do not bleach. Do not tumble dry.',
      hangerSpec: 'HS-OUTERWEAR-L',
      labelInstructionRef: 'LI-2026-003',
      isComplete: true,
      createdAt: '2026-01-28',
      updatedAt: '2026-02-02'
    },
    gswSubmission: {
      id: 'gsw-002',
      fileName: 'GSW_Winter_Outerwear_FW26_v1.xlsx',
      fileSize: '3.1 MB',
      version: 1,
      status: 'uploaded',
      auditTrail: [
        { id: 'gswat-004', action: 'File uploaded', actor: 'Sarah Chen', timestamp: '2026-02-04T09:00:00Z' }
      ]
    },
    createdAt: '2026-01-05',
    updatedAt: '2026-02-04'
  }
];

// Mock Style Products (SKUs within collections)
export const mockStyleProducts: StyleProduct[] = [
  { id: 'sp-001', collectionId: 'coll-001', sku: 'TSC-SS26-WHT-S', name: 'Essential Cotton Tee', colorway: 'White', status: 'active' },
  { id: 'sp-002', collectionId: 'coll-001', sku: 'TSC-SS26-WHT-M', name: 'Essential Cotton Tee', colorway: 'White', status: 'active' },
  { id: 'sp-003', collectionId: 'coll-001', sku: 'TSC-SS26-BLK-S', name: 'Essential Cotton Tee', colorway: 'Black', status: 'active' },
  { id: 'sp-004', collectionId: 'coll-001', sku: 'TSC-SS26-NVY-M', name: 'Essential Cotton Tee', colorway: 'Navy', status: 'active' },
  { id: 'sp-005', collectionId: 'coll-002', sku: 'KDJ-FW26-BLU-4Y', name: 'Kids Slim Denim', colorway: 'Indigo Blue', status: 'pending' },
  { id: 'sp-006', collectionId: 'coll-002', sku: 'KDJ-FW26-BLK-6Y', name: 'Kids Slim Denim', colorway: 'Black Wash', status: 'pending' },
];

// Mock Approval Entitlements
export const mockApprovalEntitlements: ApprovalEntitlement[] = [
  { userId: 'user-1', level: 'Gold' },   // Sarah Chen - can approve everything
  { userId: 'user-2', level: 'None' },   // Marcus Wong (Supplier) - cannot self-approve
  { userId: 'user-3', level: 'Bronze' }, // Dr. Amm Martinez - care codes only
  { userId: 'user-4', level: 'Silver' }, // Mark Richardson - care + base + bulk
  { userId: 'user-5', level: 'Gold' },   // Hajra Khan (Admin) - can approve everything
];

// Helper function to get user's approval level
export function getUserApprovalLevel(userId: string): ApprovalEntitlement['level'] {
  const entitlement = mockApprovalEntitlements.find(e => e.userId === userId);
  return entitlement?.level || 'None';
}

// Helper function to check if user can approve at a given level
export function canUserApprove(userId: string, approvalType: 'care' | 'base' | 'bulk' | 'garment'): boolean {
  const level = getUserApprovalLevel(userId);
  
  switch (level) {
    case 'Gold':
      return true; // Can approve everything
    case 'Silver':
      return approvalType !== 'garment'; // Care + Base + Bulk
    case 'Bronze':
      return approvalType === 'care'; // Care only
    case 'None':
    default:
      return false;
  }
}

// Helper function to get status display info
export function getCollectionStatusInfo(status: ProductCollection['status']): { label: string; color: string; description: string } {
  const statusMap: Record<ProductCollection['status'], { label: string; color: string; description: string }> = {
    draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700', description: 'Collection created, pending setup' },
    components_pending: { label: 'Components Pending', color: 'bg-amber-100 text-amber-700', description: 'Waiting for component links' },
    base_testing: { label: 'Base Testing', color: 'bg-blue-100 text-blue-700', description: 'Base testing in progress' },
    bulk_testing: { label: 'Bulk Testing', color: 'bg-indigo-100 text-indigo-700', description: 'Bulk testing in progress' },
    garment_testing: { label: 'Garment Testing', color: 'bg-purple-100 text-purple-700', description: 'Final garment testing' },
    care_labelling: { label: 'Care Labelling', color: 'bg-teal-100 text-teal-700', description: 'Completing care labels' },
    gsw_pending: { label: 'GSW Pending', color: 'bg-orange-100 text-orange-700', description: 'Awaiting GSW approval' },
    approved: { label: 'Approved', color: 'bg-emerald-100 text-emerald-700', description: 'Collection fully approved' },
    rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700', description: 'Collection rejected' }
  };
  return statusMap[status];
}
