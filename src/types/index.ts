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

// AI Chat types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestions?: string[];
  sources?: { label: string; url: string }[];
}
