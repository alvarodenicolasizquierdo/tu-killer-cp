// Documentation System Type Definitions for CARLOS
// Single source of truth for the As-Built Documentation module

import { UserRole } from '@/types';

// ============================================
// SCREEN REGISTRY TYPES
// ============================================

export interface UISectionDef {
  id: string;
  type: 'card' | 'table' | 'modal' | 'form' | 'panel' | 'widget' | 'list' | 'grid' | 'tabs' | 'drawer';
  name: string;
  description: string;
  isConditional?: boolean;
  conditionDescription?: string;
}

export interface ActionDef {
  id: string;
  label: string;
  trigger: 'click' | 'submit' | 'drag' | 'keyboard' | 'auto';
  sideEffects: string[];
  requiresConfirmation?: boolean;
  roleRestricted?: UserRole[];
}

export interface ValidationDef {
  field: string;
  rules: string[];
  errorMessage: string;
}

export interface StateDef {
  state: 'empty' | 'loading' | 'error' | 'success' | 'partial';
  description: string;
  uiRepresentation: string;
}

export interface EntityUsage {
  entityId: string;
  entityName: string;
  fields: string[];
  operation: 'read' | 'write' | 'both';
}

export interface AuditEventDef {
  event: string;
  trigger: string;
  dataLogged: string[];
}

export interface HelpContentDef {
  type: 'faq' | 'tooltip' | 'guide';
  question?: string;
  content: string;
  location?: string;
}

export interface ScreenRegistryEntry {
  id: string;
  name: string;
  route: string;
  description: string;
  primaryPersona: UserRole;
  otherPersonas: UserRole[];
  jobsToBeDone: string[];
  uiSections: UISectionDef[];
  actions: ActionDef[];
  validations: ValidationDef[];
  states: StateDef[];
  dataEntitiesUsed: EntityUsage[];
  auditEvents: AuditEventDef[];
  helpContent: HelpContentDef[];
  sourceFile: string;
  registeredAt: string;
  lastUpdated: string;
}

// ============================================
// WORKFLOW REGISTRY TYPES
// ============================================

export interface WorkflowStep {
  id: string;
  order: number;
  name: string;
  description: string;
  actor: UserRole | 'system' | 'ai';
  screenId?: string;
  expectedDuration?: string;
}

export interface DecisionPoint {
  id: string;
  afterStepId: string;
  condition: string;
  outcomes: {
    label: string;
    nextStepId: string;
  }[];
}

export interface FailureMode {
  id: string;
  atStepId: string;
  description: string;
  recovery: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface AIMoment {
  id: string;
  stepId: string;
  type: 'assists' | 'silent';
  description: string;
  reasoning?: string;
}

export interface WorkflowRegistryEntry {
  id: string;
  name: string;
  description: string;
  trigger: string;
  steps: WorkflowStep[];
  decisionPoints: DecisionPoint[];
  failureModes: FailureMode[];
  aiMoments: AIMoment[];
  outputs: string[];
  relatedScreenIds: string[];
  registeredAt: string;
  lastUpdated: string;
}

// ============================================
// DATA MODEL TYPES
// ============================================

export interface FieldDef {
  name: string;
  type: string;
  required: boolean;
  description: string;
  enumRef?: string;
  defaultValue?: string;
  isUnknown?: boolean;
  unknownLocation?: string;
}

export interface EnumDef {
  id: string;
  name: string;
  values: {
    value: string;
    description: string;
  }[];
  sourceFile: string;
}

export interface RelationshipDef {
  id: string;
  from: string;
  to: string;
  type: '1:1' | '1:many' | 'many:many';
  description: string;
  throughEntity?: string;
}

export interface DataEntityDef {
  id: string;
  name: string;
  description: string;
  fields: FieldDef[];
  sourceFile: string;
  dppRelevance?: string;
  isUnknown?: boolean;
  unknownLocation?: string;
  registeredAt: string;
  lastUpdated: string;
}

// ============================================
// ROLES & ENTITLEMENTS TYPES
// ============================================

export interface RoleDef {
  role: UserRole;
  displayName: string;
  description: string;
  primaryResponsibilities: string[];
  accessibleScreens: string[];
}

export interface ApprovalMatrixEntry {
  level: 'None' | 'Bronze' | 'Silver' | 'Gold';
  displayName: string;
  description: string;
  permissions: {
    careLabels: boolean;
    baseTesting: boolean;
    bulkTesting: boolean;
    garmentTesting: boolean;
  };
}

export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  defaultValue: boolean;
  affectedScreens: string[];
}

// ============================================
// EXPORT TYPES
// ============================================

export interface DocumentationExport {
  meta: {
    exportedAt: string;
    version: string;
    appName: string;
    totalScreens: number;
    totalWorkflows: number;
    totalEntities: number;
  };
  screens: ScreenRegistryEntry[];
  workflows: WorkflowRegistryEntry[];
  dataModel: {
    entities: DataEntityDef[];
    enums: EnumDef[];
    relationships: RelationshipDef[];
  };
  roles: {
    definitions: RoleDef[];
    approvalMatrix: ApprovalMatrixEntry[];
    featureFlags: FeatureFlag[];
  };
}

// ============================================
// REGISTRY INTERFACE
// ============================================

export interface DocumentationRegistry {
  screens: ScreenRegistryEntry[];
  workflows: WorkflowRegistryEntry[];
  entities: DataEntityDef[];
  enums: EnumDef[];
  relationships: RelationshipDef[];
  roles: RoleDef[];
  approvalMatrix: ApprovalMatrixEntry[];
  featureFlags: FeatureFlag[];
}
