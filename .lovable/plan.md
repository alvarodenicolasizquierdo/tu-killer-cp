

# As-Built Documentation Module: Implementation Plan

## Overview

This plan outlines the creation of a comprehensive "As-Built Documentation" module for the CARLOS platform. The module will serve as a single source of truth for documenting the application's screens, workflows, data models, and role-based behavior, with export capabilities for training AI agents and generating PRDs.

---

## Architecture Summary

```text
                    +---------------------------+
                    |    Documentation Page     |
                    |    (/documentation)       |
                    +---------------------------+
                              |
       +----------+-----------+-----------+----------+
       |          |           |           |          |
   +-------+  +-------+  +---------+  +-------+  +--------+
   |App Map|  | Roles |  |Workflows|  | Data  |  | Export |
   +-------+  +-------+  +---------+  | Model |  +--------+
       |          |           |       +-------+      |
       v          v           v           v          v
                    +---------------------------+
                    |   docs/registry.ts        |
                    |   (Single Source of Truth)|
                    +---------------------------+
```

---

## Deliverables

### 1. Navigation and Access Control

**File: `src/components/layout/Sidebar.tsx`**

- Add "Documentation" nav item with `BookMarked` icon
- Position it in the bottom section (with Support Center and Settings)
- Conditionally render only when `currentUser.role === 'admin'`

**Route: `/documentation`**

- Add route to `src/App.tsx`
- Wrap with admin role check (redirect non-admins to dashboard)

---

### 2. Registry File (Single Source of Truth)

**File: `src/docs/registry.ts`**

This is the core registry containing all screen and workflow documentation. Structure:

```typescript
// Screen Registry Entry
export interface ScreenRegistryEntry {
  id: string;
  name: string;
  route: string;
  primaryPersona: UserRole;
  otherPersonas: UserRole[];
  jobsToBeDone: string[];           // 3-7 bullets
  uiSections: UISectionDef[];       // cards/tables/modals/forms
  actions: ActionDef[];             // user actions + side effects
  validations: ValidationDef[];     // field rules + error messages
  states: StateDef[];               // empty/loading/error/success
  dataEntitiesUsed: EntityUsage[];  // which objects and fields appear
  auditEvents: AuditEventDef[];     // what should be logged
  helpContent: HelpContentDef[];    // FAQ snippets, tooltips
  registeredAt: string;
  lastUpdated: string;
}

// Workflow Registry Entry
export interface WorkflowRegistryEntry {
  id: string;
  name: string;
  trigger: string;
  steps: WorkflowStep[];
  decisionPoints: DecisionPoint[];
  failureModes: FailureMode[];
  aiMoments: AIMoment[];           // where AI helps, where it stays silent
  outputs: string[];
}

// Data Entity Registry
export interface DataEntityDef {
  id: string;
  name: string;
  description: string;
  fields: FieldDef[];
  enums: EnumDef[];
  relationships: RelationshipDef[];
  sourceFile: string;
  dppRelevance?: string;           // DPP mapping if applicable
}
```

**Auto-population Strategy:**

The registry will be pre-populated based on analysis of existing code:

| Source | Auto-Generated Data |
|--------|---------------------|
| `src/App.tsx` | Route list, page components |
| `src/types/*.ts` | Data entities, enums, field definitions |
| `src/pages/*.tsx` | Screen names, UI sections (partial) |
| `src/contexts/UserContext.tsx` | Role definitions |
| `src/data/stylesData.ts` | Approval levels, workflow data |

TODOs will be inserted where inference is ambiguous (marked with `TODO:` prefix).

---

### 3. Documentation Page and Tabs

**File: `src/pages/Documentation.tsx`**

A new page with 5 tabs:

#### Tab 1: App Map

Displays all registered screens with:
- Route path
- Purpose/description
- Primary persona
- Jobs to be done
- Link to drill into details

Visual: Table view with expandable rows or card grid

#### Tab 2: Roles and Entitlements

Documents:
- All 5 user roles with descriptions
- Self-approval levels (None/Bronze/Silver/Gold) with permissions matrix
- Feature flags (if any)
- Demo/declutter mode documentation

Visual: Role cards + permission matrix table

#### Tab 3: Workflows

Step-by-step user journeys including:
- TRF lifecycle (Draft -> Submitted -> In Progress -> Pending Review -> Approved/Rejected)
- Testing level gates (Base -> Bulk -> Garment)
- GSW submission workflow
- Inspection scheduling workflow
- Component linking workflow
- Care label creation workflow

Each workflow shows:
- Trigger condition
- Step sequence
- Decision points
- Failure modes
- AI involvement (helps vs. silent)
- Outputs

Visual: Vertical timeline/stepper with expandable details

#### Tab 4: Data Model

Interactive view of all data entities:
- Entity list with descriptions
- Field definitions (name, type, required, description)
- Enums with values
- Relationships (1:many, many:many)
- DPP relevance mapping
- "UNKNOWN" markers with file locations

Visual: Entity cards with expandable field tables + relationship diagram option

#### Tab 5: Export

Two export buttons:
- **Export JSON**: Generates `carlos_docs_pack.json`
- **Export Markdown**: Generates `carlos_docs_pack.md`

Both include:
- Full screen registry
- All workflows
- Complete data model
- Role definitions and permissions

---

### 4. New Component Files

```text
src/
├── docs/
│   ├── registry.ts           # Single source of truth
│   ├── types.ts              # Documentation type definitions
│   ├── autoPopulate.ts       # Auto-generation helpers
│   └── exporters.ts          # JSON and Markdown export functions
├── components/
│   └── documentation/
│       ├── AppMapTab.tsx
│       ├── RolesTab.tsx
│       ├── WorkflowsTab.tsx
│       ├── DataModelTab.tsx
│       ├── ExportTab.tsx
│       ├── ScreenDetailPanel.tsx
│       ├── WorkflowStepper.tsx
│       ├── EntityCard.tsx
│       └── index.ts
└── pages/
    └── Documentation.tsx
```

---

### 5. Registry Pre-Population

Based on codebase analysis, the registry will be pre-populated with:

**Screens (18 total):**

| ID | Name | Route | Primary Persona |
|----|------|-------|-----------------|
| dashboard | Dashboard | / | buyer |
| styles | Styles | /styles | buyer |
| style-detail | Style Detail | /styles/:id | buyer |
| components | Components | /components | buyer |
| testing-levels | Testing Levels | /testing-levels | buyer |
| inspections | Inspections | /inspections | buyer |
| inspection-detail | Inspection Detail | /inspections/:id | buyer |
| care-labelling | Care Labelling | /care-labelling | buyer |
| gsw | GSW | /gsw | buyer |
| approval-levels | Self-Approval Levels | /approval-levels | admin |
| trfs | TRFs | /trfs | buyer |
| trf-detail | TRF Detail | /trfs/:id | buyer |
| products | Products | /products | buyer |
| product-detail | Product Detail | /products/:id | buyer |
| suppliers | Suppliers | /suppliers | buyer |
| lab | Lab | /lab | lab_technician |
| analytics | Analytics | /analytics | manager |
| support-center | Support Center | /support-center | buyer |
| settings | Settings | /settings | buyer |

**Data Entities (15+ types from src/types/):**

- User, UserRole
- TRF, TRFStatus, TRFTimelineEvent, TRFTest, TRFDocument
- Task, Priority
- Supplier
- LabSample
- Product, ProductImage
- Inspection, InspectionType, InspectionStatus
- ProductCollection, Component, TestingLevelState
- CareLabelPackage, CareSymbol
- GSWSubmission
- ApprovalEntitlement, ApprovalLevel
- AIContext, AIComputedTask, ReadinessScore

**Roles:**

| Role | Display Name | Description |
|------|--------------|-------------|
| buyer | Buyer / QA Manager | Primary user managing quality assurance |
| supplier | Supplier User | External supplier submitting documents |
| lab_technician | Lab Technician | SGS lab staff conducting tests |
| manager | Manager / Executive | Executive oversight and analytics |
| admin | System Admin | Platform configuration and administration |

**Workflows (7 key workflows):**

1. TRF Lifecycle
2. Testing Level Gate Progression
3. GSW Submission and Approval
4. Inspection Scheduling and Execution
5. Component Linking and Testing
6. Care Label Package Creation
7. Self-Approval Workflow

---

### 6. Export Format Specifications

**JSON Export (`carlos_docs_pack.json`):**

```json
{
  "meta": {
    "exportedAt": "2026-02-06T...",
    "version": "1.0.0",
    "appName": "CARLOS"
  },
  "screens": [...ScreenRegistryEntry],
  "workflows": [...WorkflowRegistryEntry],
  "dataModel": {
    "entities": [...DataEntityDef],
    "enums": [...EnumDef],
    "relationships": [...RelationshipDef]
  },
  "roles": {
    "definitions": [...RoleDef],
    "approvalMatrix": {...ApprovalMatrix}
  }
}
```

**Markdown Export (`carlos_docs_pack.md`):**

```markdown
# CARLOS Documentation Pack
Exported: 2026-02-06

## Table of Contents
- App Map
- Roles and Entitlements
- Workflows
- Data Model

## App Map

### Dashboard
- **Route:** /
- **Primary Persona:** Buyer / QA Manager
- **Jobs To Be Done:**
  - View AI-prioritized critical tasks
  - Monitor readiness score
  ...

## Roles and Entitlements
...

## Workflows
...

## Data Model
...
```

---

## Technical Considerations

### Role-Based Access

- Documentation page visible only to admin role
- Implemented via conditional rendering in Sidebar
- Route protection in Documentation.tsx (redirect to / if not admin)

### TODO Markers

Where auto-inference is ambiguous, entries will include:

```typescript
{
  field: "TODO: Verify from src/components/dashboard/TaskCard.tsx"
}
```

### No Backend Dependencies

All documentation is static/client-side:
- No API calls required
- Export generates files via browser download
- Registry is a TypeScript file committed to repo

---

## Implementation Order

1. Create `src/docs/types.ts` - Type definitions for documentation
2. Create `src/docs/registry.ts` - Pre-populated registry with all screens, workflows, and data model
3. Create `src/docs/exporters.ts` - JSON and Markdown export functions
4. Create documentation UI components (5 tab components)
5. Create `src/pages/Documentation.tsx` - Main page with tabs
6. Update `src/App.tsx` - Add route
7. Update `src/components/layout/Sidebar.tsx` - Add nav item (admin only)
8. Update `src/components/layout/MobileSidebar.tsx` - Add nav item (admin only)

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/docs/types.ts` | Documentation type definitions |
| `src/docs/registry.ts` | Single source of truth registry |
| `src/docs/exporters.ts` | Export functions (JSON + MD) |
| `src/components/documentation/AppMapTab.tsx` | Screen inventory tab |
| `src/components/documentation/RolesTab.tsx` | Roles and permissions tab |
| `src/components/documentation/WorkflowsTab.tsx` | Workflow documentation tab |
| `src/components/documentation/DataModelTab.tsx` | Data model viewer tab |
| `src/components/documentation/ExportTab.tsx` | Export controls tab |
| `src/components/documentation/ScreenDetailPanel.tsx` | Expandable screen details |
| `src/components/documentation/WorkflowStepper.tsx` | Workflow visualization |
| `src/components/documentation/EntityCard.tsx` | Data entity display card |
| `src/components/documentation/index.ts` | Component exports |
| `src/pages/Documentation.tsx` | Main documentation page |

## Files to Modify

| File | Changes |
|------|---------|
| `src/App.tsx` | Add /documentation route |
| `src/components/layout/Sidebar.tsx` | Add Documentation nav item (admin only) |
| `src/components/layout/MobileSidebar.tsx` | Add Documentation nav item (admin only) |

---

## Success Criteria

When complete:
1. Admin users see "Documentation" in the sidebar
2. Documentation page has 5 functional tabs
3. App Map shows all 18+ screens with details
4. Roles tab shows 5 roles + approval matrix
5. Workflows tab shows 7 key workflows
6. Data Model tab shows 15+ entities with field definitions
7. Export JSON produces valid `carlos_docs_pack.json`
8. Export Markdown produces formatted `carlos_docs_pack.md`
9. All ambiguous items marked with TODO and file paths

