/**
 * Supplier Types
 * Extended supplier management types for the enhanced Suppliers module
 */

// Supplier tier levels for classification
export type SupplierTier = 'strategic' | 'preferred' | 'approved' | 'probation';

// Supplier compliance status
export type SupplierComplianceStatus = 'compliant' | 'at_risk' | 'non_compliant' | 'pending_audit';

// Supplier status (active/inactive)
export type SupplierStatus = 'active' | 'at-risk' | 'inactive';

// Task priority levels
export type SupplierTaskPriority = 'urgent' | 'high' | 'normal' | 'low';

// Task status
export type SupplierTaskStatus = 'pending' | 'in_progress' | 'completed' | 'overdue' | 'cancelled';

// Task types for supplier inbox
export type SupplierTaskType = 
  | 'questionnaire_response'
  | 'document_request'
  | 'corrective_action'
  | 'audit_scheduled'
  | 'certificate_renewal'
  | 'onboarding_review'
  | 'performance_review';

// Certification type
export interface SupplierCertification {
  id: string;
  name: string;
  issuer: string;
  issuedDate: string;
  expiryDate: string;
  status: 'valid' | 'expiring_soon' | 'expired';
  documentUrl?: string;
}

// Supplier contact
export interface SupplierContact {
  id: string;
  name: string;
  role: string;
  email: string;
  phone?: string;
  isPrimary?: boolean;
}

// Supplier specialization
export interface SupplierSpecialization {
  id: string;
  name: string;
  category: string;
}

// Extended supplier type for the enhanced module
export interface RichSupplier {
  id: string;
  code: string;
  name: string;
  country: string;
  city?: string;
  factoryCount: number;
  status: SupplierStatus;
  tier: SupplierTier;
  complianceStatus: SupplierComplianceStatus;
  
  // Scores
  overallScore: number;
  complianceScore: number;
  qualityScore: number;
  deliveryScore: number;
  
  // Contacts
  contacts: SupplierContact[];
  primaryContact?: SupplierContact;
  
  // Certifications
  certifications: SupplierCertification[];
  certificatesExpiring: number;
  
  // Specializations
  specializations: SupplierSpecialization[];
  
  // Activity metrics
  openTRFs: number;
  activeStyles: number;
  passRate: number;
  
  // Audit info
  lastAuditDate?: string;
  nextAuditDate?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  onboardedAt?: string;
}

// Supplier task for inbox
export interface SupplierTask {
  id: string;
  supplierId: string;
  supplierName: string;
  type: SupplierTaskType;
  title: string;
  description: string;
  priority: SupplierTaskPriority;
  status: SupplierTaskStatus;
  dueDate: string;
  slaHours?: number;
  assignee?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

// Filter state for suppliers list
export interface SupplierFiltersState {
  search: string;
  status: 'all' | SupplierStatus;
  tier: 'all' | SupplierTier;
  compliance: 'all' | SupplierComplianceStatus;
  country: 'all' | string;
}

// Stats for supplier dashboard
export interface SupplierStats {
  total: number;
  compliant: number;
  atRisk: number;
  nonCompliant: number;
  pendingAudit: number;
  avgScore: number;
  activeStyles: number;
}

// Form data for supplier creation
export interface SupplierFormData {
  // Step 1: Company Info
  companyName: string;
  companyCode: string;
  country: string;
  city: string;
  factoryCount: number;
  
  // Step 2: Contacts
  contacts: Omit<SupplierContact, 'id'>[];
  
  // Step 3: Tier & Compliance
  tier: SupplierTier;
  complianceStatus: SupplierComplianceStatus;
  
  // Step 4: Certifications
  certifications: Omit<SupplierCertification, 'id' | 'status'>[];
  
  // Step 5: Specializations
  specializations: string[];
}
