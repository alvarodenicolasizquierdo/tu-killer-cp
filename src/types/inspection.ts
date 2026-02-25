import { Priority } from './index';

export interface InspectionFinding {
  id: string;
  category: 'safety' | 'quality' | 'documentation' | 'process' | 'environmental' | 'social';
  severity: 'critical' | 'major' | 'minor' | 'observation';
  title: string;
  description: string;
  location?: string;
  photos?: string[];
  status: 'open' | 'in_progress' | 'resolved' | 'verified';
  correctiveAction?: CorrectiveAction;
  createdAt: string;
  resolvedAt?: string;
}

export interface CorrectiveAction {
  id: string;
  findingId: string;
  description: string;
  assignee: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  evidence?: string[];
  notes?: string;
  completedAt?: string;
}

export interface InspectionPhoto {
  id: string;
  url: string;
  caption?: string;
  findingId?: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface InspectionChecklist {
  id: string;
  category: string;
  items: {
    id: string;
    question: string;
    status: 'pass' | 'fail' | 'na' | 'pending';
    notes?: string;
  }[];
}

export interface ExtendedInspection {
  id: string;
  type: 'factory_audit' | 'quality_check' | 'social_compliance' | 'environmental' | 'pre_shipment';
  title: string;
  description?: string;
  factoryId: string;
  factoryName: string;
  supplierId: string;
  supplierName: string;
  location: string;
  scheduledDate: string;
  scheduledTime?: string;
  duration: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'postponed';
  priority: Priority;
  assignee?: string;
  auditorTeam?: string[];
  findings?: InspectionFinding[];
  photos?: InspectionPhoto[];
  checklists?: InspectionChecklist[];
  passRate?: number;
  notes?: string;
  createdAt: string;
  completedAt?: string;
  summary?: string;
}
