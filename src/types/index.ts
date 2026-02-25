// User Roles
export type UserRole = 
  | 'buyer' 
  | 'supplier' 
  | 'lab_technician' 
  | 'manager' 
  | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  avatarUrl?: string;
  company?: string;
  department?: string;
}

// Priority levels for task graph
export type Priority = 'critical' | 'at-risk' | 'on-track' | 'info';

// TRF (Test Request Form) types
export type TRFStatus = 
  | 'draft' 
  | 'submitted' 
  | 'in_progress' 
  | 'pending_review' 
  | 'approved' 
  | 'rejected' 
  | 'completed';

export interface TRFTimelineEvent {
  id: string;
  type: 'created' | 'submitted' | 'sample_received' | 'testing_started' | 'test_completed' | 'review_requested' | 'approved' | 'rejected' | 'comment' | 'document_uploaded' | 'retest_requested';
  title: string;
  description?: string;
  actor: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface TRFTest {
  id: string;
  name: string;
  category: string;
  status: 'pending' | 'in_progress' | 'passed' | 'failed' | 'retest';
  result?: string;
  threshold?: string;
  completedAt?: string;
  notes?: string;
}

export interface TRFDocument {
  id: string;
  name: string;
  type: 'coa' | 'test_report' | 'sample_photo' | 'specification' | 'other';
  uploadedBy: string;
  uploadedAt: string;
  size: string;
  url?: string;
}

export interface TRF {
  id: string;
  reference: string;
  productName: string;
  supplier: string;
  factory: string;
  status: TRFStatus;
  priority: Priority;
  progress: number;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  assignee?: string;
  category: string;
  testCount: number;
  passedTests: number;
  failedTests: number;
  riskScore?: number;
  slaRemaining?: number; // hours
  description?: string;
  productCode?: string;
  lotNumber?: string;
  sampleCount?: number;
  timeline?: TRFTimelineEvent[];
  tests?: TRFTest[];
  documents?: TRFDocument[];
}

// Task types for AI inbox
export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  type: 'approval' | 'review' | 'upload' | 'action' | 'notification';
  objectType: 'trf' | 'certificate' | 'inspection' | 'supplier' | 'test';
  objectId: string;
  dueDate?: string;
  slaRemaining?: number;
  aiRecommendation?: string;
  aiConfidence?: number;
  isRead: boolean;
  createdAt: string;
}

// Supplier types
export interface Supplier {
  id: string;
  name: string;
  email: string;
  contactPerson: string;
  country: string;
  factoryCount: number;
  status: 'active' | 'at-risk' | 'inactive';
  complianceScore: number;
  qualityScore: number;
  deliveryScore: number;
  lastAudit?: string;
  certificatesExpiring: number;
  openTRFs: number;
}

// Lab types
export interface LabSample {
  id: string;
  trfReference: string;
  sampleType: string;
  status: 'received' | 'queued' | 'testing' | 'completed' | 'on_hold';
  priority: Priority;
  receivedDate: string;
  dueDate: string;
  assignee?: string;
  testType: string;
  progress: number;
}

// Analytics types
export interface KPIData {
  label: string;
  value: number | string;
  change?: number;
  changeDirection?: 'up' | 'down' | 'neutral';
  target?: number;
  status: Priority;
}

// Notification types
export interface Notification {
  id: string;
  type: 'warning' | 'info' | 'success' | 'error';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  priority: Priority;
}

// Activity feed types
export interface Activity {
  id: string;
  type: 'trf_update' | 'test_result' | 'approval' | 'comment' | 'upload' | 'status_change';
  actor: string;
  action: string;
  target: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

// Product types
export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary?: boolean;
  uploadedAt?: string;
}

export interface Product {
  id: string;
  name: string;
  code: string;
  category: string;
  supplier: string;
  supplierId: string;
  description?: string;
  imageUrl?: string;
  images?: ProductImage[];
  status: 'active' | 'pending' | 'discontinued';
  complianceStatus: 'compliant' | 'pending_review' | 'non_compliant';
  lastTested?: string;
  activeTRFs: number;
  passRate: number;
  riskScore: number;
  specifications?: {
    material?: string;
    weight?: string;
    dimensions?: string;
    origin?: string;
  };
}

// Inspection types
export type InspectionType = 'factory_audit' | 'quality_check' | 'social_compliance' | 'environmental' | 'pre_shipment';
export type InspectionStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'postponed';

export interface Inspection {
  id: string;
  type: InspectionType;
  title: string;
  description?: string;
  factoryId: string;
  factoryName: string;
  supplierId: string;
  supplierName: string;
  location: string;
  scheduledDate: string;
  scheduledTime?: string;
  duration: number; // hours
  status: InspectionStatus;
  priority: Priority;
  assignee?: string;
  auditorTeam?: string[];
  findings?: number;
  passRate?: number;
  notes?: string;
  createdAt: string;
  completedAt?: string;
}

// AI Chat types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestions?: string[];
  sources?: { label: string; url: string }[];
}
