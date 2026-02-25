// Style/ProductCollection Types for CARLOS V5

export type ComponentType = 'Fabric' | 'Trim' | 'Lining' | 'Pocketing' | 'Other';
export type TestingLevel = 'Base' | 'Bulk' | 'Garment';
export type ApprovalLevel = 'None' | 'Bronze' | 'Silver' | 'Gold';
export type CollectionStatus = 'draft' | 'components_pending' | 'base_testing' | 'bulk_testing' | 'garment_testing' | 'care_labelling' | 'gsw_pending' | 'approved' | 'rejected';

// Component (Fabric/Trim/Lining) - reusable across products
export interface Component {
  id: string;
  name: string;
  type: ComponentType;
  composition: string;
  construction: string;
  nominatedSource?: string;
  areaPercentage: number; // >10% requires full testing
  riskAssessmentRequired: boolean;
  supplierId: string;
  supplierName: string;
  createdAt: string;
  updatedAt: string;
}

// Testing level state for a collection
export interface TestingLevelState {
  level: TestingLevel;
  trfId?: string;
  status: 'not_started' | 'submitted' | 'in_progress' | 'passed' | 'failed' | 'approved';
  submittedAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  expiryDate?: string;
  isLocked: boolean; // Once approved, components locked
}

// Care Label Package
export interface CareSymbol {
  id: string;
  code: string;
  icon: string;
  description: string;
}

export interface CareLabelPackage {
  id: string;
  symbols: CareSymbol[];
  careWording: string;
  hangerSpec?: string;
  labelInstructionRef?: string;
  isComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

// GSW (Gold Seal Workbook)
export interface GSWSubmission {
  id: string;
  fileName: string;
  fileSize: string;
  version: number;
  submittedTo?: string; // Garment tech
  submittedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  status: 'draft' | 'uploaded' | 'submitted' | 'approved' | 'rejected';
  auditTrail: GSWAuditEvent[];
}

export interface GSWAuditEvent {
  id: string;
  action: string;
  actor: string;
  timestamp: string;
  notes?: string;
}

// ProductCollection (Style)
export interface ProductCollection {
  id: string;
  name: string;
  season: string;
  brand: string;
  department: string;
  supplierId: string;
  supplierName: string;
  factories: string[];
  status: CollectionStatus;
  riskScore: number;
  readinessScore: number;
  
  // Linked components (N:M)
  componentIds: string[];
  
  // Testing levels
  baseTesting: TestingLevelState;
  bulkTesting: TestingLevelState;
  garmentTesting: TestingLevelState;
  
  // Care Labelling
  careLabelPackage?: CareLabelPackage;
  
  // GSW
  gswSubmission?: GSWSubmission;
  
  // DPP
  dppPassportId?: string;
  
  createdAt: string;
  updatedAt: string;
}

// Product/SKU within a collection
export interface StyleProduct {
  id: string;
  collectionId: string;
  sku: string;
  name: string;
  colorway: string;
  factory?: string; // Can override collection factory
  componentOverrides?: string[]; // Can override components
  status: 'active' | 'pending' | 'discontinued';
}

// Self-approval entitlements
export interface ApprovalEntitlement {
  userId: string;
  level: ApprovalLevel;
  // Bronze: Care codes only
  // Silver: Care codes + Base + Bulk
  // Gold: Care codes + Base + Bulk + Product/Garment
}

// AI Assist suggestion
export interface AIAssistSuggestion {
  id: string;
  type: 'component_set' | 'test_plan' | 'care_label' | 'gsw_tech' | 'approval_block';
  title: string;
  description: string;
  confidence: number;
  reasoning: string[];
  suggestedValues?: Record<string, unknown>;
  action?: {
    label: string;
    type: 'apply' | 'dismiss' | 'edit';
  };
}

// Gate status for workflow
export interface GateStatus {
  canProceed: boolean;
  blockedBy?: string;
  reason?: string;
  requiredAction?: string;
}
