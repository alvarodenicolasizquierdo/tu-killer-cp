import { UserRole, Priority } from './index';

// AI Context Object - computed before UI renders
export interface AIContext {
  userId: string;
  role: UserRole;
  criticalItems: number;
  upcomingRegulatoryRisk: 'low' | 'medium' | 'high' | 'critical';
  blockedDownstream: boolean;
  confidenceGap: 'low' | 'medium' | 'high';
  historicalDelayPattern: string[];
  computedAt: string;
}

// AI-computed task with full reasoning
export interface AIComputedTask {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  impactScore: number; // 0-100, computed by AI based on downstream effects
  urgencyScore: number; // 0-100, based on SLA/deadline pressure
  riskScore: number; // 0-100, regulatory/compliance exposure
  dependencyChain: string[]; // IDs of blocked items if this isn't resolved
  slaHoursRemaining?: number;
  objectType: 'trf' | 'product' | 'supplier' | 'inspection' | 'certificate';
  objectId: string;
  
  // AI reasoning - mandatory for TIC explainability
  reasoning: AIReasoning;
  
  // Recommended action
  recommendedAction: {
    label: string;
    type: 'approve' | 'review' | 'escalate' | 'request_info' | 'schedule';
    confidence: number;
  };
}

// Explainability is first-class
export interface AIReasoning {
  whyProblem: string;
  evidence: string[];
  consequenceIfIgnored: string;
  fastestFix: string;
}

// Readiness & Confidence - DPP attribute coverage
export interface ReadinessScore {
  overall: number; // 0-100
  trend: 'improving' | 'stable' | 'declining';
  confidence: 'low' | 'medium' | 'high';
  gaps: ReadinessGap[];
  lastUpdated: string;
}

export interface ReadinessGap {
  attribute: string;
  severity: 'critical' | 'major' | 'minor';
  reason: string;
  estimatedResolutionDays: number;
  owner?: string;
}

// Scenario simulation
export interface ScenarioState {
  dppEnforced: boolean;
  regulationThreshold: number; // percentage stricter
  supplierFailureSimulated?: string; // supplier ID
}

export interface ScenarioImpact {
  readinessChange: number; // delta from current
  newCriticalTasks: number;
  affectedProducts: number;
  estimatedRemediationDays: number;
}

// AI Assessment for object pages
export interface AIAssessment {
  objectType: 'product' | 'trf' | 'supplier' | 'inspection';
  objectId: string;
  readiness: number;
  readinessTrend: 'up' | 'down' | 'stable';
  confidence: 'low' | 'medium' | 'high';
  primaryRisk: string;
  recommendation: string;
  estimatedResolutionDays?: number;
}

// Layout configuration based on AI context
export interface LayoutConfig {
  primaryWidget: 'tasks' | 'lab_queue' | 'regulatory_horizon' | 'confidence_dashboard';
  secondaryWidgets: string[];
  emphasisAreas: ('regulatory' | 'quality' | 'suppliers' | 'lab')[];
}
