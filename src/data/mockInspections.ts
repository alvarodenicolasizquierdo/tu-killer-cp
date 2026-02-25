// Extended Inspection Mock Data for feature-rich inspections module
// This file provides rich inspection data with results, defects, risk levels, and scores

import { Priority } from '@/types';

// Inspection-specific types that extend base types
export type InspectionTypeCode = 'PPI' | 'DPI' | 'FRI' | 'CLI' | 'FA';
export type InspectionResult = 'pass' | 'fail' | 'conditional' | 'pending';
export type RiskLevel = 'low' | 'medium' | 'high';
export type ExtendedInspectionStatus = 'scheduled' | 'in_progress' | 'pending_review' | 'completed' | 'cancelled' | 'on_hold';

export interface InspectionDefect {
  id: string;
  category: 'critical' | 'major' | 'minor';
  description: string;
  quantity: number;
  location?: string;
  photoUrl?: string;
}

export interface RichInspection {
  id: string;
  inspectionNumber: string; // e.g., INS-2026-0001
  poNumber: string;
  productName: string;
  typeCode: InspectionTypeCode;
  type: string; // Full type name
  supplierId: string;
  supplierName: string;
  factoryId: string;
  factoryName: string;
  factoryLocation: string;
  inspectorId: string;
  inspectorName: string;
  inspectorAvatar?: string;
  scheduledDate: string;
  completedDate?: string;
  status: ExtendedInspectionStatus;
  result: InspectionResult;
  riskLevel: RiskLevel;
  score?: number; // 0-100 percentage
  priority: Priority;
  sampleSize?: number;
  defectsFound?: number;
  defects?: InspectionDefect[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Avatar imports for inspectors
import alvaroAvatar from '@/assets/avatars/alvaro.jpg';
import karukaAvatar from '@/assets/avatars/karuka.webp';
import ammAvatar from '@/assets/avatars/amm.jpg';
import saritaAvatar from '@/assets/avatars/sarita.jpg';
import markAvatar from '@/assets/avatars/mark.png';

// Inspection type labels
export const inspectionTypeLabels: Record<InspectionTypeCode, string> = {
  'PPI': 'Pre-Production Inspection',
  'DPI': 'During Production Inspection',
  'FRI': 'Final Random Inspection',
  'CLI': 'Container Loading Inspection',
  'FA': 'Factory Audit',
};

// Rich inspection data matching reference app
export const richInspections: RichInspection[] = [
  {
    id: 'ins-001',
    inspectionNumber: 'INS-2026-0001',
    poNumber: 'PO-2026-1234',
    productName: 'Cotton T-Shirt',
    typeCode: 'FRI',
    type: 'Final Random Inspection',
    supplierId: 'supplier-001',
    supplierName: 'TextilePro Inc',
    factoryId: 'factory-001',
    factoryName: 'TextilePro Factory A',
    factoryLocation: 'Vietnam',
    inspectorId: 'user-001',
    inspectorName: 'John Smith',
    inspectorAvatar: alvaroAvatar,
    scheduledDate: '2026-01-27',
    completedDate: '2026-01-27',
    status: 'completed',
    result: 'pass',
    riskLevel: 'low',
    score: 94,
    priority: 'on-track',
    sampleSize: 200,
    defectsFound: 3,
    defects: [
      { id: 'd1', category: 'minor', description: 'Loose thread on hem', quantity: 2, location: 'Bottom hem' },
      { id: 'd2', category: 'minor', description: 'Slight color variation', quantity: 1, location: 'Collar' },
    ],
    notes: 'Excellent overall quality. Minor issues corrected on-site.',
    createdAt: '2026-01-20',
    updatedAt: '2026-01-27',
  },
  {
    id: 'ins-002',
    inspectionNumber: 'INS-2026-0002',
    poNumber: 'PO-2026-1235',
    productName: 'Denim Jacket',
    typeCode: 'DPI',
    type: 'During Production Inspection',
    supplierId: 'supplier-002',
    supplierName: 'BlueThread Textiles',
    factoryId: 'factory-002',
    factoryName: 'BlueThread Manufacturing',
    factoryLocation: 'Bangladesh',
    inspectorId: 'user-002',
    inspectorName: 'Sarah Chen',
    inspectorAvatar: karukaAvatar,
    scheduledDate: '2026-02-02',
    status: 'in_progress',
    result: 'pending',
    riskLevel: 'medium',
    priority: 'at-risk',
    sampleSize: 150,
    createdAt: '2026-01-25',
    updatedAt: '2026-02-02',
  },
  {
    id: 'ins-003',
    inspectionNumber: 'INS-2026-0003',
    poNumber: 'PO-2026-1236',
    productName: "Children's Pajama Set",
    typeCode: 'FRI',
    type: 'Final Random Inspection',
    supplierId: 'supplier-003',
    supplierName: 'SafeGuard Manufacturing',
    factoryId: 'factory-003',
    factoryName: 'SafeGuard Plant 1',
    factoryLocation: 'China',
    inspectorId: 'user-003',
    inspectorName: 'Mike Johnson',
    inspectorAvatar: ammAvatar,
    scheduledDate: '2026-01-31',
    completedDate: '2026-01-31',
    status: 'pending_review',
    result: 'conditional',
    riskLevel: 'high',
    score: 72,
    priority: 'critical',
    sampleSize: 300,
    defectsFound: 12,
    defects: [
      { id: 'd3', category: 'major', description: 'Button attachment weak', quantity: 5, location: 'Front buttons' },
      { id: 'd4', category: 'major', description: 'Care label missing', quantity: 3, location: 'Inside collar' },
      { id: 'd5', category: 'minor', description: 'Thread ends visible', quantity: 4, location: 'Various' },
    ],
    notes: 'Conditional pass pending corrective action on button attachment.',
    createdAt: '2026-01-24',
    updatedAt: '2026-01-31',
  },
  {
    id: 'ins-004',
    inspectionNumber: 'INS-2026-0004',
    poNumber: 'PO-2026-1237',
    productName: 'Wool Winter Coat',
    typeCode: 'PPI',
    type: 'Pre-Production Inspection',
    supplierId: 'supplier-004',
    supplierName: 'LuxeLeather Co',
    factoryId: 'factory-004',
    factoryName: 'LuxeLeather Facility',
    factoryLocation: 'Turkey',
    inspectorId: 'user-001',
    inspectorName: 'John Smith',
    inspectorAvatar: alvaroAvatar,
    scheduledDate: '2026-02-09',
    status: 'scheduled',
    result: 'pending',
    riskLevel: 'low',
    priority: 'on-track',
    createdAt: '2026-02-01',
    updatedAt: '2026-02-01',
  },
  {
    id: 'ins-005',
    inspectionNumber: 'INS-2026-0005',
    poNumber: 'PO-2026-1238',
    productName: 'Baby Onesie',
    typeCode: 'FRI',
    type: 'Final Random Inspection',
    supplierId: 'supplier-005',
    supplierName: 'TinyTots Apparel',
    factoryId: 'factory-005',
    factoryName: 'TinyTots Production',
    factoryLocation: 'India',
    inspectorId: 'user-004',
    inspectorName: 'Lisa Wang',
    inspectorAvatar: saritaAvatar,
    scheduledDate: '2026-01-24',
    completedDate: '2026-01-24',
    status: 'completed',
    result: 'fail',
    riskLevel: 'high',
    score: 58,
    priority: 'critical',
    sampleSize: 250,
    defectsFound: 18,
    defects: [
      { id: 'd6', category: 'critical', description: 'Small parts detachment risk', quantity: 4, location: 'Snap buttons' },
      { id: 'd7', category: 'major', description: 'Seam strength below spec', quantity: 8, location: 'Side seams' },
      { id: 'd8', category: 'minor', description: 'Printing misalignment', quantity: 6, location: 'Front graphic' },
    ],
    notes: 'Failed due to safety concerns with snap buttons. Shipment on hold.',
    createdAt: '2026-01-17',
    updatedAt: '2026-01-24',
  },
  {
    id: 'ins-006',
    inspectionNumber: 'INS-2026-0006',
    poNumber: 'PO-2026-1239',
    productName: 'Athletic Shorts',
    typeCode: 'CLI',
    type: 'Container Loading Inspection',
    supplierId: 'supplier-006',
    supplierName: 'SportFlex Industries',
    factoryId: 'factory-006',
    factoryName: 'SportFlex Plant',
    factoryLocation: 'Indonesia',
    inspectorId: 'user-002',
    inspectorName: 'Sarah Chen',
    inspectorAvatar: karukaAvatar,
    scheduledDate: '2026-02-14',
    status: 'scheduled',
    result: 'pending',
    riskLevel: 'low',
    priority: 'on-track',
    createdAt: '2026-02-05',
    updatedAt: '2026-02-05',
  },
  {
    id: 'ins-007',
    inspectionNumber: 'INS-2026-0007',
    poNumber: 'PO-2026-1240',
    productName: 'Silk Blouse',
    typeCode: 'FRI',
    type: 'Final Random Inspection',
    supplierId: 'supplier-007',
    supplierName: 'SilkRoad Textiles',
    factoryId: 'factory-007',
    factoryName: 'SilkRoad Weaving Mill',
    factoryLocation: 'China',
    inspectorId: 'user-003',
    inspectorName: 'Mike Johnson',
    inspectorAvatar: ammAvatar,
    scheduledDate: '2026-01-19',
    completedDate: '2026-01-19',
    status: 'completed',
    result: 'pass',
    riskLevel: 'low',
    score: 96,
    priority: 'on-track',
    sampleSize: 125,
    defectsFound: 1,
    notes: 'Excellent quality silk products. Minor packaging improvement suggested.',
    createdAt: '2026-01-12',
    updatedAt: '2026-01-19',
  },
  {
    id: 'ins-008',
    inspectionNumber: 'INS-2026-0008',
    poNumber: 'PO-2026-1241',
    productName: 'Leather Belt',
    typeCode: 'FA',
    type: 'Factory Audit',
    supplierId: 'supplier-004',
    supplierName: 'LuxeLeather Co',
    factoryId: 'factory-004',
    factoryName: 'LuxeLeather Facility',
    factoryLocation: 'Turkey',
    inspectorId: 'user-004',
    inspectorName: 'Lisa Wang',
    inspectorAvatar: saritaAvatar,
    scheduledDate: '2026-02-04',
    status: 'on_hold',
    result: 'pending',
    riskLevel: 'medium',
    priority: 'at-risk',
    notes: 'On hold pending documentation review.',
    createdAt: '2026-01-28',
    updatedAt: '2026-02-04',
  },
  {
    id: 'ins-009',
    inspectionNumber: 'INS-2026-0009',
    poNumber: 'PO-2026-1242',
    productName: 'Canvas Tote Bag',
    typeCode: 'FRI',
    type: 'Final Random Inspection',
    supplierId: 'supplier-008',
    supplierName: 'EcoBags Global',
    factoryId: 'factory-008',
    factoryName: 'EcoBags Production Center',
    factoryLocation: 'Philippines',
    inspectorId: 'user-001',
    inspectorName: 'John Smith',
    inspectorAvatar: alvaroAvatar,
    scheduledDate: '2026-01-21',
    completedDate: '2026-01-21',
    status: 'completed',
    result: 'pass',
    riskLevel: 'low',
    score: 91,
    priority: 'on-track',
    sampleSize: 180,
    defectsFound: 4,
    createdAt: '2026-01-14',
    updatedAt: '2026-01-21',
  },
  {
    id: 'ins-010',
    inspectionNumber: 'INS-2026-0010',
    poNumber: 'PO-2026-1243',
    productName: 'Running Shoes',
    typeCode: 'DPI',
    type: 'During Production Inspection',
    supplierId: 'supplier-006',
    supplierName: 'SportFlex Industries',
    factoryId: 'factory-009',
    factoryName: 'SportFlex Footwear',
    factoryLocation: 'China',
    inspectorId: 'user-002',
    inspectorName: 'Sarah Chen',
    inspectorAvatar: karukaAvatar,
    scheduledDate: '2026-02-02',
    status: 'in_progress',
    result: 'pending',
    riskLevel: 'medium',
    priority: 'at-risk',
    sampleSize: 100,
    createdAt: '2026-01-26',
    updatedAt: '2026-02-02',
  },
];

// Stats calculation helper
export function calculateInspectionStats(inspections: RichInspection[]) {
  const total = inspections.length;
  const scheduled = inspections.filter(i => i.status === 'scheduled').length;
  const inProgress = inspections.filter(i => i.status === 'in_progress').length;
  const pendingReview = inspections.filter(i => i.status === 'pending_review').length;
  const completed = inspections.filter(i => i.status === 'completed').length;
  const onHold = inspections.filter(i => i.status === 'on_hold').length;
  
  const passed = inspections.filter(i => i.result === 'pass').length;
  const failed = inspections.filter(i => i.result === 'fail').length;
  const conditional = inspections.filter(i => i.result === 'conditional').length;
  
  const highRisk = inspections.filter(i => i.riskLevel === 'high').length;
  const passRate = completed > 0 ? Math.round((passed / completed) * 100) : 0;

  return {
    total,
    scheduled,
    inProgress,
    pendingReview,
    completed,
    onHold,
    passed,
    failed,
    conditional,
    highRisk,
    passRate,
  };
}

// CSV export helper
export function exportInspectionsToCSV(inspections: RichInspection[]): string {
  const headers = [
    'Inspection #',
    'PO Number',
    'Product',
    'Type',
    'Supplier',
    'Factory',
    'Location',
    'Inspector',
    'Date',
    'Status',
    'Result',
    'Risk',
    'Score',
    'Defects',
  ];

  const rows = inspections.map(i => [
    i.inspectionNumber,
    i.poNumber,
    i.productName,
    i.typeCode,
    i.supplierName,
    i.factoryName,
    i.factoryLocation,
    i.inspectorName,
    i.scheduledDate,
    i.status,
    i.result,
    i.riskLevel,
    i.score?.toString() || '',
    i.defectsFound?.toString() || '0',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');

  return csvContent;
}

export function downloadCSV(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}
