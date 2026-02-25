/**
 * Mock Suppliers Data
 * Rich supplier data for the enhanced Suppliers module
 * Supports localStorage persistence for created suppliers
 */

import type { 
  RichSupplier, 
  SupplierTask, 
  SupplierStats,
  SupplierCertification,
  SupplierContact,
  SupplierSpecialization 
} from '@/types/supplier';

// LocalStorage key for persisted suppliers
const SUPPLIERS_STORAGE_KEY = 'suppliers_data';
const SUPPLIER_STYLE_LINKS_KEY = 'supplier_style_links';

// Linked style type (lightweight mock)
export interface LinkedStyle {
  id: string;
  name: string;
  season: string;
  brand: string;
  status: string;
}

// Supplier-Style link mapping
export interface SupplierStyleLink {
  supplierId: string;
  styleIds: string[];
}

// Mock linked styles data (corresponds to mockCollections in stylesData.ts)
const mockLinkedStyles: Record<string, LinkedStyle[]> = {
  'sup-001': [
    { id: 'coll-001', name: 'Essential Cotton Tees SS26', season: 'SS26', brand: 'RetailCo Basics', status: 'bulk_testing' },
    { id: 'coll-006', name: 'Winter Outerwear Collection FW26', season: 'FW26', brand: 'RetailCo Premium', status: 'gsw_pending' },
  ],
  'sup-002': [
    { id: 'coll-002', name: 'Kids Denim Collection FW26', season: 'FW26', brand: 'RetailCo Kids', status: 'base_testing' },
  ],
  'sup-003': [
    { id: 'coll-004', name: 'Organic Baby Essentials SS26', season: 'SS26', brand: 'RetailCo Baby', status: 'approved' },
  ],
  'sup-004': [
    { id: 'coll-003', name: 'Eco Fleece Hoodies AW26', season: 'AW26', brand: 'RetailCo Active', status: 'components_pending' },
    { id: 'coll-005', name: 'Performance Sports Bras SS26', season: 'SS26', brand: 'RetailCo Active', status: 'care_labelling' },
  ],
};

// Certification templates
const certifications: Record<string, SupplierCertification[]> = {
  textile_excellence: [
    { id: 'cert-1', name: 'OEKO-TEX Standard 100', issuer: 'OEKO-TEX Association', issuedDate: '2025-03-15', expiryDate: '2026-03-15', status: 'valid' },
    { id: 'cert-2', name: 'ISO 9001:2015', issuer: 'Bureau Veritas', issuedDate: '2024-06-01', expiryDate: '2027-06-01', status: 'valid' },
    { id: 'cert-3', name: 'BSCI', issuer: 'amfori', issuedDate: '2025-01-10', expiryDate: '2026-01-10', status: 'expiring_soon' },
  ],
  dragon_fabrics: [
    { id: 'cert-4', name: 'ISO 9001:2015', issuer: 'THT', issuedDate: '2024-08-20', expiryDate: '2027-08-20', status: 'valid' },
    { id: 'cert-5', name: 'GOTS', issuer: 'Control Union', issuedDate: '2025-02-01', expiryDate: '2026-02-01', status: 'expiring_soon' },
  ],
  anatolian: [
    { id: 'cert-6', name: 'ISO 14001', issuer: 'TÜV', issuedDate: '2024-04-15', expiryDate: '2027-04-15', status: 'valid' },
    { id: 'cert-7', name: 'OEKO-TEX Standard 100', issuer: 'OEKO-TEX Association', issuedDate: '2024-11-01', expiryDate: '2025-11-01', status: 'valid' },
  ],
};

// Specialization templates
const specializations: Record<string, SupplierSpecialization[]> = {
  apparel: [
    { id: 'spec-1', name: 'Cotton Basics', category: 'Apparel' },
    { id: 'spec-2', name: 'Knit Fabrics', category: 'Textiles' },
  ],
  denim: [
    { id: 'spec-3', name: 'Denim', category: 'Apparel' },
    { id: 'spec-4', name: 'Stretch Fabrics', category: 'Textiles' },
  ],
  sustainable: [
    { id: 'spec-5', name: 'Organic Cotton', category: 'Sustainable' },
    { id: 'spec-6', name: 'Recycled Materials', category: 'Sustainable' },
  ],
  activewear: [
    { id: 'spec-7', name: 'Performance Fabrics', category: 'Activewear' },
    { id: 'spec-8', name: 'Moisture Wicking', category: 'Technical' },
  ],
};

// Mock suppliers data
export const richSuppliers: RichSupplier[] = [
  {
    id: 'sup-001',
    code: 'TEX-001',
    name: 'Textile Excellence Ltd',
    country: 'Bangladesh',
    city: 'Dhaka',
    factoryCount: 3,
    status: 'active',
    tier: 'strategic',
    complianceStatus: 'compliant',
    overallScore: 92,
    complianceScore: 94,
    qualityScore: 90,
    deliveryScore: 92,
    contacts: [
      { id: 'con-1', name: 'Mohammed Rahman', role: 'Quality Director', email: 'm.rahman@textileexcellence.com', phone: '+880 1234 567890', isPrimary: true },
      { id: 'con-2', name: 'Fatima Begum', role: 'Compliance Manager', email: 'f.begum@textileexcellence.com', isPrimary: false },
    ],
    primaryContact: { id: 'con-1', name: 'Mohammed Rahman', role: 'Quality Director', email: 'm.rahman@textileexcellence.com', phone: '+880 1234 567890', isPrimary: true },
    certifications: certifications.textile_excellence,
    certificatesExpiring: 1,
    specializations: [...specializations.apparel, ...specializations.sustainable],
    openTRFs: 4,
    activeStyles: 24,
    passRate: 94.2,
    lastAuditDate: '2025-11-15',
    nextAuditDate: '2026-05-15',
    createdAt: '2022-03-10',
    updatedAt: '2026-02-01',
    onboardedAt: '2022-03-15',
  },
  {
    id: 'sup-002',
    code: 'DRG-002',
    name: 'Dragon Fabrics Co',
    country: 'China',
    city: 'Shanghai',
    factoryCount: 5,
    status: 'active',
    tier: 'preferred',
    complianceStatus: 'compliant',
    overallScore: 88,
    complianceScore: 86,
    qualityScore: 90,
    deliveryScore: 88,
    contacts: [
      { id: 'con-3', name: 'Li Wei', role: 'General Manager', email: 'l.wei@dragonfabrics.cn', phone: '+86 21 1234 5678', isPrimary: true },
    ],
    primaryContact: { id: 'con-3', name: 'Li Wei', role: 'General Manager', email: 'l.wei@dragonfabrics.cn', phone: '+86 21 1234 5678', isPrimary: true },
    certifications: certifications.dragon_fabrics,
    certificatesExpiring: 1,
    specializations: specializations.denim,
    openTRFs: 2,
    activeStyles: 18,
    passRate: 91.5,
    lastAuditDate: '2025-09-20',
    nextAuditDate: '2026-03-20',
    createdAt: '2021-08-05',
    updatedAt: '2026-01-28',
    onboardedAt: '2021-08-10',
  },
  {
    id: 'sup-003',
    code: 'ANA-003',
    name: 'Anatolian Textiles',
    country: 'Turkey',
    city: 'Istanbul',
    factoryCount: 2,
    status: 'at-risk',
    tier: 'approved',
    complianceStatus: 'at_risk',
    overallScore: 85,
    complianceScore: 78,
    qualityScore: 88,
    deliveryScore: 89,
    contacts: [
      { id: 'con-4', name: 'Ahmet Yilmaz', role: 'Export Manager', email: 'a.yilmaz@anatoliantex.com', phone: '+90 212 555 1234', isPrimary: true },
    ],
    primaryContact: { id: 'con-4', name: 'Ahmet Yilmaz', role: 'Export Manager', email: 'a.yilmaz@anatoliantex.com', phone: '+90 212 555 1234', isPrimary: true },
    certifications: certifications.anatolian,
    certificatesExpiring: 0,
    specializations: specializations.apparel,
    openTRFs: 3,
    activeStyles: 12,
    passRate: 86.5,
    lastAuditDate: '2025-06-10',
    nextAuditDate: '2026-06-10',
    createdAt: '2023-01-15',
    updatedAt: '2026-01-20',
    onboardedAt: '2023-01-20',
  },
  {
    id: 'sup-004',
    code: 'VGS-004',
    name: 'Viet Garment Solutions',
    country: 'Vietnam',
    city: 'Ho Chi Minh City',
    factoryCount: 4,
    status: 'active',
    tier: 'strategic',
    complianceStatus: 'compliant',
    overallScore: 91,
    complianceScore: 92,
    qualityScore: 89,
    deliveryScore: 92,
    contacts: [
      { id: 'con-5', name: 'Nguyen Thi Mai', role: 'Quality Director', email: 'mai.nguyen@vietgarment.vn', phone: '+84 28 1234 5678', isPrimary: true },
    ],
    primaryContact: { id: 'con-5', name: 'Nguyen Thi Mai', role: 'Quality Director', email: 'mai.nguyen@vietgarment.vn', phone: '+84 28 1234 5678', isPrimary: true },
    certifications: [...certifications.textile_excellence],
    certificatesExpiring: 0,
    specializations: [...specializations.apparel, ...specializations.activewear],
    openTRFs: 5,
    activeStyles: 31,
    passRate: 93.8,
    lastAuditDate: '2025-12-01',
    nextAuditDate: '2026-06-01',
    createdAt: '2020-06-20',
    updatedAt: '2026-02-02',
    onboardedAt: '2020-06-25',
  },
  {
    id: 'sup-005',
    code: 'MTM-005',
    name: 'Mumbai Textile Mills',
    country: 'India',
    city: 'Mumbai',
    factoryCount: 2,
    status: 'at-risk',
    tier: 'approved',
    complianceStatus: 'at_risk',
    overallScore: 78,
    complianceScore: 72,
    qualityScore: 82,
    deliveryScore: 80,
    contacts: [
      { id: 'con-6', name: 'Priya Sharma', role: 'Operations Manager', email: 'p.sharma@mumbaitextile.in', phone: '+91 22 1234 5678', isPrimary: true },
    ],
    primaryContact: { id: 'con-6', name: 'Priya Sharma', role: 'Operations Manager', email: 'p.sharma@mumbaitextile.in', phone: '+91 22 1234 5678', isPrimary: true },
    certifications: certifications.anatolian,
    certificatesExpiring: 1,
    specializations: specializations.sustainable,
    openTRFs: 2,
    activeStyles: 8,
    passRate: 82.2,
    lastAuditDate: '2025-04-15',
    nextAuditDate: '2026-04-15',
    createdAt: '2023-09-10',
    updatedAt: '2026-01-15',
    onboardedAt: '2023-09-15',
  },
  {
    id: 'sup-006',
    code: 'PTC-006',
    name: 'Pacific Trim Co',
    country: 'Indonesia',
    city: 'Jakarta',
    factoryCount: 1,
    status: 'inactive',
    tier: 'probation',
    complianceStatus: 'non_compliant',
    overallScore: 65,
    complianceScore: 58,
    qualityScore: 70,
    deliveryScore: 67,
    contacts: [
      { id: 'con-7', name: 'Budi Santoso', role: 'Director', email: 'b.santoso@pacifictrim.id', phone: '+62 21 1234 5678', isPrimary: true },
    ],
    primaryContact: { id: 'con-7', name: 'Budi Santoso', role: 'Director', email: 'b.santoso@pacifictrim.id', phone: '+62 21 1234 5678', isPrimary: true },
    certifications: [],
    certificatesExpiring: 0,
    specializations: [],
    openTRFs: 1,
    activeStyles: 3,
    passRate: 71.4,
    lastAuditDate: '2025-01-20',
    createdAt: '2024-03-01',
    updatedAt: '2025-12-10',
    onboardedAt: '2024-03-05',
  },
  {
    id: 'sup-007',
    code: 'EFF-007',
    name: 'Euro Fashion Fabrics',
    country: 'Portugal',
    city: 'Porto',
    factoryCount: 2,
    status: 'active',
    tier: 'strategic',
    complianceStatus: 'compliant',
    overallScore: 96,
    complianceScore: 98,
    qualityScore: 95,
    deliveryScore: 95,
    contacts: [
      { id: 'con-8', name: 'Maria Santos', role: 'CEO', email: 'm.santos@eurofashion.pt', phone: '+351 22 123 4567', isPrimary: true },
    ],
    primaryContact: { id: 'con-8', name: 'Maria Santos', role: 'CEO', email: 'm.santos@eurofashion.pt', phone: '+351 22 123 4567', isPrimary: true },
    certifications: [...certifications.textile_excellence, ...certifications.anatolian],
    certificatesExpiring: 0,
    specializations: [...specializations.sustainable, ...specializations.apparel],
    openTRFs: 3,
    activeStyles: 15,
    passRate: 97.3,
    lastAuditDate: '2025-10-10',
    nextAuditDate: '2026-04-10',
    createdAt: '2019-11-15',
    updatedAt: '2026-02-03',
    onboardedAt: '2019-11-20',
  },
  {
    id: 'sup-008',
    code: 'KRK-008',
    name: 'Karachi Knits',
    country: 'Pakistan',
    city: 'Karachi',
    factoryCount: 3,
    status: 'active',
    tier: 'approved',
    complianceStatus: 'pending_audit',
    overallScore: 82,
    complianceScore: 80,
    qualityScore: 84,
    deliveryScore: 82,
    contacts: [
      { id: 'con-9', name: 'Ali Hassan', role: 'Quality Manager', email: 'a.hassan@karachiknits.pk', phone: '+92 21 1234 5678', isPrimary: true },
    ],
    primaryContact: { id: 'con-9', name: 'Ali Hassan', role: 'Quality Manager', email: 'a.hassan@karachiknits.pk', phone: '+92 21 1234 5678', isPrimary: true },
    certifications: certifications.dragon_fabrics,
    certificatesExpiring: 0,
    specializations: specializations.apparel,
    openTRFs: 2,
    activeStyles: 6,
    passRate: 85.3,
    lastAuditDate: '2025-02-20',
    nextAuditDate: '2026-02-20',
    createdAt: '2023-05-10',
    updatedAt: '2026-01-25',
    onboardedAt: '2023-05-15',
  },
];

// Mock supplier tasks for inbox
export const supplierTasks: SupplierTask[] = [
  {
    id: 'stask-001',
    supplierId: 'sup-003',
    supplierName: 'Anatolian Textiles',
    type: 'corrective_action',
    title: 'Submit Corrective Action Plan',
    description: 'BSCI audit findings require corrective action plan within 30 days. Focus on worker safety protocols.',
    priority: 'urgent',
    status: 'pending',
    dueDate: '2026-02-10',
    slaHours: 48,
    createdAt: '2026-02-04T08:00:00Z',
    updatedAt: '2026-02-04T08:00:00Z',
  },
  {
    id: 'stask-002',
    supplierId: 'sup-001',
    supplierName: 'Textile Excellence Ltd',
    type: 'certificate_renewal',
    title: 'BSCI Certificate Renewal',
    description: 'BSCI certificate expires on 2026-01-10. Schedule renewal audit immediately.',
    priority: 'urgent',
    status: 'in_progress',
    dueDate: '2026-02-15',
    slaHours: 72,
    assignee: 'Sarah Chen',
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-02-03T14:00:00Z',
  },
  {
    id: 'stask-003',
    supplierId: 'sup-005',
    supplierName: 'Mumbai Textile Mills',
    type: 'questionnaire_response',
    title: 'Complete Sustainability Questionnaire',
    description: 'Annual sustainability assessment questionnaire pending response. 15 questions remaining.',
    priority: 'high',
    status: 'pending',
    dueDate: '2026-02-20',
    slaHours: 120,
    createdAt: '2026-01-28T09:00:00Z',
    updatedAt: '2026-01-28T09:00:00Z',
  },
  {
    id: 'stask-004',
    supplierId: 'sup-006',
    supplierName: 'Pacific Trim Co',
    type: 'document_request',
    title: 'Submit Missing Certifications',
    description: 'Required documents: ISO 9001, OEKO-TEX Standard 100, factory license. Supplier on probation.',
    priority: 'high',
    status: 'overdue',
    dueDate: '2026-01-31',
    slaHours: 0,
    createdAt: '2026-01-15T11:00:00Z',
    updatedAt: '2026-02-01T08:00:00Z',
  },
  {
    id: 'stask-005',
    supplierId: 'sup-008',
    supplierName: 'Karachi Knits',
    type: 'audit_scheduled',
    title: 'Prepare for Scheduled Audit',
    description: 'Annual compliance audit scheduled for 2026-02-20. Prepare documentation package.',
    priority: 'normal',
    status: 'pending',
    dueDate: '2026-02-18',
    slaHours: 168,
    createdAt: '2026-02-02T14:00:00Z',
    updatedAt: '2026-02-02T14:00:00Z',
  },
  {
    id: 'stask-006',
    supplierId: 'sup-002',
    supplierName: 'Dragon Fabrics Co',
    type: 'performance_review',
    title: 'Quarterly Performance Review',
    description: 'Q1 2026 performance review meeting. Review quality metrics and delivery performance.',
    priority: 'normal',
    status: 'pending',
    dueDate: '2026-02-25',
    slaHours: 240,
    createdAt: '2026-02-01T16:00:00Z',
    updatedAt: '2026-02-01T16:00:00Z',
  },
  {
    id: 'stask-007',
    supplierId: 'sup-004',
    supplierName: 'Viet Garment Solutions',
    type: 'onboarding_review',
    title: 'New Factory Onboarding Review',
    description: 'Review onboarding documents for new factory in Da Nang. Capacity: 500 workers.',
    priority: 'normal',
    status: 'in_progress',
    dueDate: '2026-02-28',
    slaHours: 336,
    assignee: 'Mark Richardson',
    createdAt: '2026-01-25T10:00:00Z',
    updatedAt: '2026-02-02T09:00:00Z',
  },
  {
    id: 'stask-008',
    supplierId: 'sup-007',
    supplierName: 'Euro Fashion Fabrics',
    type: 'questionnaire_response',
    title: 'EU Due Diligence Questionnaire',
    description: 'New EU supply chain due diligence requirements. Complete environmental section.',
    priority: 'low',
    status: 'completed',
    dueDate: '2026-02-05',
    createdAt: '2026-01-20T08:00:00Z',
    updatedAt: '2026-02-03T16:00:00Z',
    completedAt: '2026-02-03T16:00:00Z',
  },
];

// Calculate supplier stats
export function calculateSupplierStats(suppliers: RichSupplier[]): SupplierStats {
  const total = suppliers.length;
  const compliant = suppliers.filter(s => s.complianceStatus === 'compliant').length;
  const atRisk = suppliers.filter(s => s.complianceStatus === 'at_risk').length;
  const nonCompliant = suppliers.filter(s => s.complianceStatus === 'non_compliant').length;
  const pendingAudit = suppliers.filter(s => s.complianceStatus === 'pending_audit').length;
  const avgScore = Math.round(suppliers.reduce((acc, s) => acc + s.overallScore, 0) / total);
  const activeStyles = suppliers.reduce((acc, s) => acc + s.activeStyles, 0);

  return {
    total,
    compliant,
    atRisk,
    nonCompliant,
    pendingAudit,
    avgScore,
    activeStyles,
  };
}

// Export suppliers to CSV
export function exportSuppliersToCSV(suppliers: RichSupplier[]): string {
  const headers = [
    'Code',
    'Name',
    'Country',
    'City',
    'Tier',
    'Status',
    'Compliance',
    'Overall Score',
    'Quality Score',
    'Delivery Score',
    'Pass Rate',
    'Active Styles',
    'Open TRFs',
    'Factories',
    'Primary Contact',
    'Contact Email',
  ];

  const rows = suppliers.map(s => [
    s.code,
    s.name,
    s.country,
    s.city || '',
    s.tier,
    s.status,
    s.complianceStatus,
    s.overallScore,
    s.qualityScore,
    s.deliveryScore,
    s.passRate,
    s.activeStyles,
    s.openTRFs,
    s.factoryCount,
    s.primaryContact?.name || '',
    s.primaryContact?.email || '',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');

  return csvContent;
}

// Download CSV helper
export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

// Get countries list from suppliers
export function getSupplierCountries(suppliers: RichSupplier[]): string[] {
  return [...new Set(suppliers.map(s => s.country))].sort();
}

// Get all suppliers (includes localStorage persisted ones)
export function getAllSuppliers(): RichSupplier[] {
  try {
    const stored = localStorage.getItem(SUPPLIERS_STORAGE_KEY);
    if (stored) {
      const customSuppliers: RichSupplier[] = JSON.parse(stored);
      return [...richSuppliers, ...customSuppliers];
    }
  } catch (e) {
    console.error('Error loading suppliers from localStorage:', e);
  }
  return richSuppliers;
}

// Add a new supplier (persists to localStorage)
export function addSupplier(supplier: RichSupplier): void {
  try {
    const stored = localStorage.getItem(SUPPLIERS_STORAGE_KEY);
    const customSuppliers: RichSupplier[] = stored ? JSON.parse(stored) : [];
    customSuppliers.push(supplier);
    localStorage.setItem(SUPPLIERS_STORAGE_KEY, JSON.stringify(customSuppliers));
  } catch (e) {
    console.error('Error saving supplier to localStorage:', e);
  }
}

// Get supplier by ID
export function getSupplierById(id: string): RichSupplier | undefined {
  const allSuppliers = getAllSuppliers();
  return allSuppliers.find(s => s.id === id);
}

// Get tasks for a specific supplier
export function getSupplierTasks(supplierId: string): SupplierTask[] {
  return supplierTasks.filter(t => t.supplierId === supplierId);
}

// Get linked styles for a supplier
export function getLinkedStyles(supplierId: string): LinkedStyle[] {
  return mockLinkedStyles[supplierId] || [];
}

// Get supplier IDs linked to a style
export function getSuppliersForStyle(styleId: string): string[] {
  const supplierIds: string[] = [];
  Object.entries(mockLinkedStyles).forEach(([supplierId, styles]) => {
    if (styles.some(s => s.id === styleId)) {
      supplierIds.push(supplierId);
    }
  });
  return supplierIds;
}

// Generate a unique supplier ID
export function generateSupplierId(): string {
  return `sup-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Generate a unique supplier code
export function generateSupplierCode(name: string): string {
  const prefix = name.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'X');
  const num = Math.floor(Math.random() * 900) + 100;
  return `${prefix}-${num}`;
}
