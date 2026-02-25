/**
 * CARLOS Canonical Feature Specification
 * Auto-extracted from full codebase introspection
 * Generated: 2026-02-07
 */

export const canonicalFeatureSpec = {
  canonical_feature_spec: {
    meta: {
      app_name: "CARLOS",
      full_name: "Compliance & Assurance Retail Lifecycle Operating System",
      vendor: "THT",
      platform: "Lovable (AI-accelerated development)",
      tech_stack: [
        "React 18.3.1", "TypeScript", "Tailwind CSS", "Vite", "React Router 6.30.1",
        "TanStack React Query 5.83.0", "Recharts 2.15.4", "Framer Motion 11.18.2",
        "Radix UI (full primitives suite)", "shadcn/ui", "Lucide React 0.462.0",
        "@dnd-kit/core 6.3.1", "@dnd-kit/sortable 10.0.0", "date-fns 3.6.0",
        "React Hook Form 7.61.1", "Zod 3.25.76", "cmdk 1.1.1", "Sonner 1.7.4",
        "react-simple-maps 3.0.0", "react-resizable-panels 2.1.9",
        "embla-carousel-react 8.6.0", "Vaul 0.9.9", "next-themes 0.3.0",
        "class-variance-authority 0.7.1", "input-otp 1.4.2"
      ],
      version_observed: "0.0.0 (prototype)",
      extraction_date: "2026-02-07T00:00:00Z",
      extraction_method: "automated_codebase_introspection",
      total_screens: 23,
      total_components: 142,
      total_routes: 22,
      total_zustand_stores: 0,
      total_api_endpoints_or_mock_services: 0,
      build_status: "prototype",
      notes: "Auto-extracted from full codebase scan. Uses React Context (UserContext, DraftsContext) instead of Zustand. All data is mock/seed. No backend API integration yet. Includes all implemented, stubbed, and planned features."
    },

    design_principles: {
      core_pillars: [
        "AI-First Compliance",
        "Scheme-Agnostic Architecture",
        "DPP-Ready by Design"
      ],
      architecture_pattern: "Component-based SPA with React Router v6. State managed via React Context (UserContext for role-switching, DraftsContext for draft persistence). Feature flags via localStorage/env vars. Layout uses persistent sidebar + header shell (AppLayout) wrapping all pages.",
      ai_philosophy: "AI is embedded across prioritisation (task scoring with impact/urgency/risk), risk assessment (supplier/TRF scoring), reasoning transparency (every AI recommendation shows WHY via AIReasoning interface), confidence scores on all recommendations, scenario simulation (what-if DPP enforcement), and readiness gauges with gap analysis. All AI is rule-based/simulated in this prototype but architectured for real model integration.",
      extensibility_model: "Sustainability evidence graph designed to be scheme-agnostic — compliance schemes (bluesign, GOTS, OEKO-TEX, ZDHC) plug in as configuration rather than code changes. Testing levels (Base/Bulk/Garment) support configurable test plans per material/construction type.",
      role_adaptive_design: "Same screens adapt per role via UserContext. Dashboard KPIs change per role (buyer/supplier/lab/manager/admin). Layout config computed by AI context hook (useAIContext) determines primary vs secondary widgets based on role. Demo role-switching available in header."
    },

    platform_architecture: {
      deployment: "Lovable hosted (lovable.app). Static SPA served via CDN.",
      frontend_framework: "React 18.3.1 with TypeScript, Vite build, Tailwind CSS 4.x with shadcn/ui design system",
      state_management: "React Context API (no Zustand). Two contexts: UserContext (role switching, current user), DraftsContext (draft persistence). Widget config persisted to localStorage. Feature flags via localStorage + env vars. useAIContext hook computes AI-derived state (tasks, readiness, scenarios).",
      routing: {
        router_type: "react-router-dom v6",
        total_routes: 22,
        route_map: [
          { path: "/", component: "Dashboard", auth_required: false, role_restrictions: ["buyer", "supplier", "lab_technician", "manager", "admin"], description: "AI-prioritised task dashboard with role-adaptive widgets, regulatory alerts, KPIs, and activity feed" },
          { path: "/styles", component: "Styles", auth_required: false, role_restrictions: ["buyer", "manager", "admin"], description: "Product collections (styles) list with status pipeline and readiness scores" },
          { path: "/styles/:id", component: "StyleDetail", auth_required: false, role_restrictions: ["buyer", "manager", "admin"], description: "Style detail with testing levels, component links, care labelling, GSW workflow" },
          { path: "/components", component: "Components", auth_required: false, role_restrictions: ["buyer", "manager", "admin"], description: "Reusable component library (fabrics, trims, linings) with composition and risk data" },
          { path: "/testing-levels", component: "TestingLevels", auth_required: false, role_restrictions: ["buyer", "lab_technician", "manager", "admin"], description: "Testing level configuration and approval workflow" },
          { path: "/care-labelling", component: "CareLabelling", auth_required: false, role_restrictions: ["buyer", "manager", "admin"], description: "Care label symbol selection and package management" },
          { path: "/gsw", component: "GSW", auth_required: false, role_restrictions: ["buyer", "manager", "admin"], description: "Gold Seal Workbook submission and approval tracking" },
          { path: "/approval-levels", component: "SelfApprovalLevels", auth_required: false, role_restrictions: ["manager", "admin"], description: "Self-approval entitlement management (Bronze/Silver/Gold tiers)" },
          { path: "/trfs", component: "TRFs", auth_required: false, role_restrictions: ["buyer", "supplier", "lab_technician", "manager", "admin"], description: "Test Request Form list with status tracking and SLA indicators" },
          { path: "/trfs/:id", component: "TRFDetail", auth_required: false, role_restrictions: ["buyer", "supplier", "lab_technician", "manager", "admin"], description: "TRF detail with timeline, test results, documents, and approval workflow" },
          { path: "/products", component: "Products", auth_required: false, role_restrictions: ["buyer", "supplier", "manager", "admin"], description: "Product catalog with compliance status, risk scores, and image gallery" },
          { path: "/products/:id", component: "ProductDetail", auth_required: false, role_restrictions: ["buyer", "supplier", "manager", "admin"], description: "Product detail with specifications, compliance history, and linked TRFs" },
          { path: "/suppliers", component: "SuppliersEnhanced", auth_required: false, role_restrictions: ["buyer", "manager", "admin"], description: "Enhanced supplier management with stats, filters, tier badges, detail drawer, and CSV export" },
          { path: "/suppliers/new", component: "SupplierCreate", auth_required: false, role_restrictions: ["buyer", "manager", "admin"], description: "Multi-step supplier onboarding wizard (company info, contacts, tier, certifications, specializations)" },
          { path: "/suppliers/inbox", component: "SupplierInbox", auth_required: false, role_restrictions: ["buyer", "manager", "admin"], description: "Supplier task inbox with SLA tracking, priority filtering, and bulk actions" },
          { path: "/suppliers/:id", component: "SupplierDetail", auth_required: false, role_restrictions: ["buyer", "manager", "admin"], description: "Full supplier profile with scores, certifications, linked styles, activity, and audit schedule" },
          { path: "/lab", component: "Lab", auth_required: false, role_restrictions: ["lab_technician", "manager", "admin"], description: "Lab operations dashboard with sample queue, priority sorting, and progress tracking" },
          { path: "/inspections", component: "InspectionsEnhanced", auth_required: false, role_restrictions: ["buyer", "manager", "admin"], description: "Enhanced inspections with table/kanban views, stats, filters, bulk actions, and CSV export" },
          { path: "/inspections/new", component: "InspectionCreate", auth_required: false, role_restrictions: ["buyer", "manager", "admin"], description: "Inspection creation form" },
          { path: "/inspections/calendar", component: "Inspections", auth_required: false, role_restrictions: ["buyer", "manager", "admin"], description: "Calendar view with drag-drop scheduling and world map factory view" },
          { path: "/inspections/:id", component: "InspectionDetail", auth_required: false, role_restrictions: ["buyer", "manager", "admin"], description: "Inspection detail with findings, corrective actions, checklists, and photos" },
          { path: "/analytics", component: "Insight", auth_required: false, role_restrictions: ["buyer", "manager", "admin"], description: "Multi-tab analytics: Risk Summary, Compliance Health, Pipeline Flow, Transactions, Balances, Custom Reports, Collection Readiness Funnel" },
          { path: "/support-center", component: "SupportCenter", auth_required: false, role_restrictions: ["buyer", "supplier", "lab_technician", "manager", "admin"], description: "Help & Support with knowledge base, guided resolution, escalation, and AI assistant (Ask Carlos)" },
          { path: "/settings", component: "Settings", auth_required: false, role_restrictions: ["admin"], description: "System settings and configuration" },
          { path: "/documentation", component: "Documentation", auth_required: false, role_restrictions: ["admin"], description: "Platform documentation with app map, data model, workflows, roles, and export tools" },
        ]
      },
      data_layer: {
        persistence: "All mock data. No Supabase or API integration. Widget config and supplier data persisted to localStorage. Draft TRFs persisted via DraftsContext.",
        mock_data_files: [
          "src/data/mockData.ts (1271 lines — users, TRFs, tasks, suppliers, lab samples, KPIs, notifications, activities, products, inspections, AI chat responses)",
          "src/data/mockSuppliers.ts (599 lines — rich suppliers, supplier tasks, stats, linked styles, certifications, specializations, CSV export)",
          "src/data/mockInspections.ts (424 lines — rich inspections with defects, stats, CSV export)",
          "src/data/stylesData.ts (481 lines — collections, components, style products, care symbols, approval entitlements, GSW submissions)",
          "src/data/mockReports.ts (179 lines — risk factories, compliance metrics, pipeline data, transactions, balances, custom reports)",
          "src/data/inspectionDetailData.ts (extended inspection detail data)",
          "src/data/helpData.ts (help knowledge base articles)",
          "src/data/helpKnowledgeBase.ts (knowledge base for AI help)",
          "src/data/guidedResolutions.ts (guided resolution flows for support)"
        ],
        api_integration_points: ["not_implemented — all data is mock/seed"],
        data_models: [
          {
            entity: "TRF (Test Request Form)",
            fields: ["id:string", "reference:string", "productName:string", "supplier:string", "factory:string", "status:TRFStatus (7 states)", "priority:Priority", "progress:number", "dueDate:string", "createdAt:string", "updatedAt:string", "assignee:string?", "category:string", "testCount:number", "passedTests:number", "failedTests:number", "riskScore:number?", "slaRemaining:number?", "description:string?", "productCode:string?", "lotNumber:string?", "sampleCount:number?", "timeline:TRFTimelineEvent[]?", "tests:TRFTest[]?", "documents:TRFDocument[]?"],
            relationships: ["TRF → Product (N:1)", "TRF → Supplier (N:1)", "TRF → Lab Samples (1:N)", "TRF → Test Results (1:N)", "TRF → Documents (1:N)", "TRF → Timeline Events (1:N)", "TRF → Style/Collection (N:1 via testing levels)"]
          },
          {
            entity: "ProductCollection (Style)",
            fields: ["id:string", "name:string", "season:string", "brand:string", "department:string", "supplierId:string", "supplierName:string", "factories:string[]", "status:CollectionStatus (9 states)", "riskScore:number", "readinessScore:number", "componentIds:string[]", "baseTesting:TestingLevelState", "bulkTesting:TestingLevelState", "garmentTesting:TestingLevelState", "careLabelPackage:CareLabelPackage?", "gswSubmission:GSWSubmission?", "dppPassportId:string?", "createdAt:string", "updatedAt:string"],
            relationships: ["Style → Components (N:M via componentIds)", "Style → TRFs (1:N via testing levels)", "Style → Supplier (N:1)", "Style → Care Label (1:1)", "Style → GSW (1:1)", "Style → Products/SKUs (1:N)"]
          },
          {
            entity: "Component",
            fields: ["id:string", "name:string", "type:ComponentType (Fabric|Trim|Lining|Pocketing|Other)", "composition:string", "construction:string", "nominatedSource:string?", "areaPercentage:number", "riskAssessmentRequired:boolean", "supplierId:string", "supplierName:string", "createdAt:string", "updatedAt:string"],
            relationships: ["Component → Styles (N:M)", "Component → Supplier (N:1)"]
          },
          {
            entity: "RichSupplier",
            fields: ["id:string", "code:string", "name:string", "country:string", "city:string?", "factoryCount:number", "status:SupplierStatus", "tier:SupplierTier (strategic|preferred|approved|probation)", "complianceStatus:SupplierComplianceStatus (4 states)", "overallScore:number", "complianceScore:number", "qualityScore:number", "deliveryScore:number", "contacts:SupplierContact[]", "primaryContact:SupplierContact?", "certifications:SupplierCertification[]", "certificatesExpiring:number", "specializations:SupplierSpecialization[]", "openTRFs:number", "activeStyles:number", "passRate:number", "lastAuditDate:string?", "nextAuditDate:string?", "createdAt:string", "updatedAt:string", "onboardedAt:string?"],
            relationships: ["Supplier → Styles (1:N)", "Supplier → TRFs (1:N)", "Supplier → Inspections (1:N)", "Supplier → Tasks (1:N)", "Supplier → Certifications (1:N)", "Supplier → Contacts (1:N)", "Supplier → Factories (1:N implicit)"]
          },
          {
            entity: "RichInspection",
            fields: ["id:string", "inspectionNumber:string", "poNumber:string", "productName:string", "typeCode:InspectionTypeCode (PPI|DPI|FRI|CLI|FA)", "type:string", "supplierId:string", "supplierName:string", "factoryId:string", "factoryName:string", "factoryLocation:string", "inspectorId:string", "inspectorName:string", "inspectorAvatar:string?", "scheduledDate:string", "completedDate:string?", "status:ExtendedInspectionStatus (6 states)", "result:InspectionResult (4 states)", "riskLevel:RiskLevel", "score:number?", "priority:Priority", "sampleSize:number?", "defectsFound:number?", "defects:InspectionDefect[]?", "notes:string?", "createdAt:string", "updatedAt:string"],
            relationships: ["Inspection → Supplier (N:1)", "Inspection → Factory (N:1)", "Inspection → Inspector/User (N:1)", "Inspection → Defects (1:N)"]
          },
          {
            entity: "Product",
            fields: ["id:string", "name:string", "code:string", "category:string", "supplier:string", "supplierId:string", "description:string?", "imageUrl:string?", "images:ProductImage[]?", "status:string", "complianceStatus:string", "lastTested:string?", "activeTRFs:number", "passRate:number", "riskScore:number", "specifications:object?"],
            relationships: ["Product → Supplier (N:1)", "Product → TRFs (1:N)", "Product → Images (1:N)"]
          },
          {
            entity: "Task (AI Inbox)",
            fields: ["id:string", "title:string", "description:string", "priority:Priority", "type:string", "objectType:string", "objectId:string", "dueDate:string?", "slaRemaining:number?", "aiRecommendation:string?", "aiConfidence:number?", "isRead:boolean", "createdAt:string"],
            relationships: ["Task → TRF|Supplier|Inspection|Certificate (N:1 polymorphic)"]
          },
          {
            entity: "SupplierTask (Inbox)",
            fields: ["id:string", "supplierId:string", "supplierName:string", "type:SupplierTaskType (7 types)", "title:string", "description:string", "priority:SupplierTaskPriority", "status:SupplierTaskStatus (5 states)", "dueDate:string", "slaHours:number?", "assignee:string?", "createdAt:string", "updatedAt:string", "completedAt:string?"],
            relationships: ["SupplierTask → Supplier (N:1)"]
          },
          {
            entity: "User",
            fields: ["id:string", "name:string", "email:string", "role:UserRole (5 roles)", "avatar:string?", "avatarUrl:string?", "company:string?", "department:string?"],
            relationships: ["User → Tasks (1:N)", "User → Approvals (1:N)"]
          }
        ]
      },
      authentication: {
        method: "No real authentication. Demo role-switching via UserContext with 5 pre-configured personas. Role selected in header dropdown.",
        roles_defined: ["buyer (QA Manager)", "supplier (Supplier User)", "lab_technician (Lab Technician)", "manager (Manager / Executive)", "admin (System Admin)"],
        role_switching: "Header dropdown allows instant persona switching. Each persona has avatar, name, company, department. KPIs, dashboard widgets, and navigation adapt per role."
      },
      mobile_support: {
        responsive: "yes — mobile sidebar (MobileSidebar component), useIsMobile hook, responsive grid layouts throughout",
        pwa: "no",
        native_apps: "no"
      },
      accessibility: {
        aria_labels: "Partial — shadcn/ui components include built-in ARIA. Custom components have mixed coverage.",
        keyboard_navigation: "yes — via Radix UI primitives (dialog, dropdown, tabs, etc.)",
        screen_reader_support: "partial — Radix UI provides baseline, custom components need improvement"
      }
    },

    product_modules: [
      {
        module_name: "Dashboard & AI Task Prioritisation",
        category: "ai_operations",
        route: "/",
        description: "AI-prioritised command center with role-adaptive widgets, regulatory alerts, KPI summary, activity feed, and configurable widget layout with drag-drop reordering.",
        maturity: "implemented",
        demo_readiness: "demo_ready",
        demo_wow_factor: 9,
        demo_talk_track: "This is your AI-powered command center. Every task is ranked by impact, urgency, and risk — with full reasoning transparency. Watch how the dashboard adapts instantly when I switch roles.",
        features: [
          {
            name: "AI Task Prioritisation",
            description: "Tasks ranked by computed impact/urgency/risk scores with full AI reasoning (why it's a problem, evidence, consequences, fastest fix)",
            implementation_status: "complete",
            ai_presence: "heavy",
            ai_details: "useAIContext hook computes per-task scores: impactScore (priority-derived), urgencyScore (SLA-derived), riskScore (weighted combo). Each task has AIReasoning with whyProblem, evidence[], consequenceIfIgnored, fastestFix. Recommended actions with confidence %.",
            reasoning_visible: true,
            ui_elements: ["AITaskCard with expandable reasoning panel", "AIReasoningPanel with evidence bullets", "Confidence badges", "SLA countdown indicators", "Priority badges (critical/at-risk/on-track/info)"],
            interactions: ["click to expand reasoning", "click recommended action", "toggle read/unread"],
            data_source: "useAIContext hook → computed from mockTasks + mockTRFs + mockSuppliers",
            unique_to_carlos: true,
            competitive_notes: "Inspectorio's Paramo shows risk scores but doesn't explain WHY. CARLOS shows full reasoning chain — critical for TIC where explainability is mandatory."
          },
          {
            name: "Role-Adaptive Dashboard",
            description: "Dashboard KPIs, widgets, and layout change based on active user role",
            implementation_status: "complete",
            ai_presence: "moderate",
            ai_details: "useAIContext computes LayoutConfig per role — determines primary widget (tasks vs lab_queue vs confidence_dashboard) and emphasis areas.",
            reasoning_visible: false,
            ui_elements: ["KPICard grid (4 cards)", "Role-specific KPI sets (buyerKPIs, labKPIs, managerKPIs)"],
            interactions: ["role switch in header dropdown"],
            data_source: "UserContext + mockData KPI arrays",
            unique_to_carlos: true,
            competitive_notes: "Inspectorio has role-based dashboards but no AI-driven layout adaptation."
          },
          {
            name: "Configurable Widget Layout",
            description: "Users can enable/disable dashboard widgets and drag-drop reorder them. Persisted to localStorage.",
            implementation_status: "complete",
            ai_presence: "none",
            ai_details: null,
            reasoning_visible: false,
            ui_elements: ["WidgetCatalog dialog", "SortableWidgetItem with drag handles", "Widget toggle switches"],
            interactions: ["drag-drop reorder", "toggle widget on/off", "open widget catalog"],
            data_source: "useWidgetConfig hook → localStorage",
            unique_to_carlos: false,
            competitive_notes: "Standard dashboard customisation. Inspectorio also offers this."
          },
          {
            name: "Regulatory Alerts",
            description: "Regulatory deadline alerts (EU DPP 2027, CPSC eFiling July 2026) with countdown timers",
            implementation_status: "complete",
            ai_presence: "light",
            ai_details: "Alerts surface based on date proximity",
            reasoning_visible: false,
            ui_elements: ["RegulatoryAlerts widget with countdown badges", "Alert cards with severity indicators"],
            interactions: ["click to view details"],
            data_source: "hardcoded regulatory dates",
            unique_to_carlos: true,
            competitive_notes: "Inspectorio doesn't prominently surface regulatory deadlines. This is a differentiator for compliance-focused clients."
          },
          {
            name: "Readiness Gauge & Scenario Simulator",
            description: "Overall compliance readiness score with trend indicator, gap analysis, and what-if scenario simulation (DPP enforcement, stricter regulations)",
            implementation_status: "complete",
            ai_presence: "heavy",
            ai_details: "useAIContext computes ReadinessScore with gaps (severity, reason, estimated resolution days, owner). ScenarioSimulator lets users toggle DPP enforcement and regulation strictness to see impact on readiness, critical tasks, affected products, and remediation timeline.",
            reasoning_visible: true,
            ui_elements: ["ReadinessGauge (circular gauge)", "ScenarioSimulator with toggles and sliders", "Gap analysis cards", "Impact delta indicators"],
            interactions: ["toggle DPP enforcement", "slide regulation threshold", "view gap details"],
            data_source: "useAIContext hook → computed scenarios",
            unique_to_carlos: true,
            competitive_notes: "No competitor offers scenario simulation for compliance readiness. This is a unique differentiator and major wow moment."
          },
          {
            name: "Activity Feed",
            description: "Real-time activity stream showing TRF updates, test results, approvals, comments, uploads",
            implementation_status: "complete",
            ai_presence: "none",
            ai_details: null,
            reasoning_visible: false,
            ui_elements: ["ActivityFeed with timestamped entries", "Activity type icons", "Actor names"],
            interactions: ["scroll", "click to navigate to source"],
            data_source: "mockActivities array",
            unique_to_carlos: false,
            competitive_notes: "Standard activity feed, parity with Inspectorio."
          },
          {
            name: "Today/Next Strip",
            description: "Horizontal strip showing today's immediate tasks and upcoming items",
            implementation_status: "complete",
            ai_presence: "light",
            ai_details: "Items sorted by AI-computed priority",
            reasoning_visible: false,
            ui_elements: ["TodayNextStrip horizontal scroll", "Task cards with priority indicators"],
            interactions: ["horizontal scroll", "click task"],
            data_source: "mockTasks filtered by date",
            unique_to_carlos: false,
            competitive_notes: "Similar to Inspectorio's daily summary."
          }
        ],
        screens: [
          {
            route: "/",
            screen_name: "Dashboard",
            layout: "Sidebar + main content area with configurable widget grid",
            widgets: ["KPISummaryWidget", "RegulatoryAlerts", "AITaskCard list", "ActivityFeed", "ReadinessGauge", "ScenarioSimulator", "ConfidenceDashboardWidget", "LabQueueWidget", "DraftResumeWidget", "SupplierDashboardWidget", "QuickActions", "TodayNextStrip"],
            conditional_sections: ["Lab queue shows only for lab_technician", "Confidence dashboard shows for manager", "KPIs change per role"],
            animations: ["Framer Motion fade-in on widget mount", "Gauge animation on readiness score"]
          }
        ]
      },
      {
        module_name: "Styles & Product Collections",
        category: "compliance_management",
        route: "/styles",
        description: "Full product collection lifecycle management: component linking, 3-tier testing (Base/Bulk/Garment), care labelling, GSW submission, self-approval levels, and DPP readiness tracking.",
        maturity: "implemented",
        demo_readiness: "demo_ready",
        demo_wow_factor: 9,
        demo_talk_track: "This is where CARLOS transforms compliance from a checklist into an intelligent pipeline. Watch how components auto-link, testing levels gate progression, and the AI suggests test plans based on material composition.",
        features: [
          {
            name: "Collection Pipeline View",
            description: "Visual pipeline showing collections across 9 workflow stages from draft to approved",
            implementation_status: "complete",
            ai_presence: "light",
            ai_details: "Risk and readiness scores computed per collection",
            reasoning_visible: false,
            ui_elements: ["Collection cards with status badges", "Readiness progress bars", "Risk score indicators", "Season/brand filters"],
            interactions: ["click to view detail", "filter by status/season/brand"],
            data_source: "mockCollections",
            unique_to_carlos: true,
            competitive_notes: "Inspectorio tracks POs but doesn't have a styled collection pipeline with testing level gates."
          },
          {
            name: "Component Library",
            description: "Reusable components (fabrics, trims, linings, pocketing) with composition, construction, and risk data",
            implementation_status: "complete",
            ai_presence: "moderate",
            ai_details: "AI suggests component sets based on department rules and flags >10% area components for mandatory testing",
            reasoning_visible: true,
            ui_elements: ["Component cards", "Composition details", "Risk assessment badges", "Area percentage indicators"],
            interactions: ["search", "filter by type", "link to collection"],
            data_source: "mockComponents",
            unique_to_carlos: true,
            competitive_notes: "Unique to CARLOS. Inspectorio doesn't manage reusable components with auto-risk-assessment."
          },
          {
            name: "3-Tier Testing Levels",
            description: "Base → Bulk → Garment testing workflow with gated progression. Components locked once Base approved.",
            implementation_status: "complete",
            ai_presence: "moderate",
            ai_details: "AI recommends test plans based on material composition (pilling for knits, abrasion for wovens), construction type, and department-specific safety rules (restricted substances for infants/kids)",
            reasoning_visible: true,
            ui_elements: ["TestingLevelState cards", "Gate status indicators", "Lock icons for approved levels", "TRF link badges"],
            interactions: ["submit for testing", "approve with conditions", "view linked TRF"],
            data_source: "mockCollections testing level states",
            unique_to_carlos: true,
            competitive_notes: "Inspectorio has QRM but no tiered testing with component locking and AI-recommended test plans."
          },
          {
            name: "Care Labelling",
            description: "Care label package management with symbol selection, care wording, hanger specs, and label instruction references",
            implementation_status: "complete",
            ai_presence: "moderate",
            ai_details: "AI pre-fills care labels based on material composition and construction",
            reasoning_visible: true,
            ui_elements: ["Care symbol grid with emoji icons", "Care wording text area", "Hanger spec input", "Completeness indicator"],
            interactions: ["select symbols", "edit care wording", "mark complete"],
            data_source: "careSymbols + mockCollections careLabelPackage",
            unique_to_carlos: true,
            competitive_notes: "Not available in Inspectorio. Care labelling is typically done outside the compliance platform."
          },
          {
            name: "GSW (Gold Seal Workbook)",
            description: "Upload, submission, and approval tracking for Gold Seal Workbooks with full audit trail",
            implementation_status: "complete",
            ai_presence: "light",
            ai_details: "AI suggests appropriate garment tech for submission",
            reasoning_visible: true,
            ui_elements: ["File upload area", "Submission status badges", "Audit trail timeline", "Version tracking"],
            interactions: ["upload file", "submit to garment tech", "view audit trail"],
            data_source: "mockCollections gswSubmission",
            unique_to_carlos: true,
            competitive_notes: "Specific to UK retail compliance. Not available in Inspectorio."
          },
          {
            name: "Self-Approval Levels",
            description: "Entitlement tiers (Bronze/Silver/Gold) controlling what each user can self-approve",
            implementation_status: "complete",
            ai_presence: "none",
            ai_details: null,
            reasoning_visible: false,
            ui_elements: ["Entitlement tier badges", "Approval capability matrix", "User assignment table"],
            interactions: ["view entitlements", "assign levels"],
            data_source: "mockApprovalEntitlements",
            unique_to_carlos: true,
            competitive_notes: "Fine-grained self-approval is unique to CARLOS. Inspectorio uses simple approve/reject."
          }
        ],
        screens: [
          { route: "/styles", screen_name: "Styles List", layout: "Sidebar + main with grid/list toggle", widgets: ["Collection cards", "Status filter bar", "Search"], conditional_sections: [], animations: ["Framer Motion stagger on card load"] },
          { route: "/styles/:id", screen_name: "Style Detail", layout: "Sidebar + tabbed detail view", widgets: ["Style header with scores", "Component links", "Testing level cards", "Care label editor", "GSW panel", "AI Assist panel"], conditional_sections: ["GSW shows after garment testing approved", "Care labelling shows after bulk testing"], animations: [] },
          { route: "/components", screen_name: "Components Library", layout: "Sidebar + searchable grid", widgets: ["Component cards", "Type filters", "Search"], conditional_sections: [], animations: [] },
          { route: "/testing-levels", screen_name: "Testing Levels Config", layout: "Sidebar + main", widgets: ["Testing level overview", "Configuration panels"], conditional_sections: [], animations: [] },
          { route: "/care-labelling", screen_name: "Care Labelling", layout: "Sidebar + main", widgets: ["Symbol selection grid", "Care package editor"], conditional_sections: [], animations: [] },
          { route: "/gsw", screen_name: "GSW Management", layout: "Sidebar + main", widgets: ["GSW submission list", "Upload panel", "Audit trail"], conditional_sections: [], animations: [] },
          { route: "/approval-levels", screen_name: "Self-Approval Levels", layout: "Sidebar + main", widgets: ["Entitlement matrix", "User assignments"], conditional_sections: [], animations: [] }
        ]
      },
      {
        module_name: "Test Request Forms (TRFs)",
        category: "compliance_management",
        route: "/trfs",
        description: "Complete TRF lifecycle management from draft to completion with timeline tracking, test results, document management, and approval workflows.",
        maturity: "implemented",
        demo_readiness: "demo_ready",
        demo_wow_factor: 8,
        demo_talk_track: "Here's the core of compliance operations. Every test request has a full audit trail, real-time progress tracking, and AI-flagged risk indicators. The timeline shows exactly where things stand.",
        features: [
          {
            name: "TRF List with Status Tracking",
            description: "Sortable, filterable list of TRFs with status badges, SLA indicators, and progress bars",
            implementation_status: "complete",
            ai_presence: "light",
            ai_details: "Risk scores displayed, priority-based sorting",
            reasoning_visible: false,
            ui_elements: ["TRF table/cards", "Status badges (7 states)", "SLA countdown", "Progress bars", "Priority indicators"],
            interactions: ["sort", "filter", "search", "click to detail"],
            data_source: "mockTRFs",
            unique_to_carlos: false,
            competitive_notes: "Comparable to Inspectorio QRM. CARLOS adds SLA countdown and AI risk scoring."
          },
          {
            name: "TRF Detail with Timeline",
            description: "Full TRF detail view with interactive timeline, test results matrix, document viewer, and approval workflow",
            implementation_status: "complete",
            ai_presence: "moderate",
            ai_details: "AI assessment strip shows readiness, risk, and recommended actions",
            reasoning_visible: true,
            ui_elements: ["TRFTimeline (interactive event timeline)", "TRFTestResults (test matrix with pass/fail/in-progress)", "TRFDocuments (document list with type icons)", "TRFApprovalWorkflow (approval chain)", "AIAssessmentStrip"],
            interactions: ["expand timeline events", "view test details", "download documents", "approve/reject"],
            data_source: "mockTRFs with timeline, tests, documents",
            unique_to_carlos: false,
            competitive_notes: "Inspectorio has similar TRF detail. CARLOS adds AI assessment and richer timeline visualization."
          }
        ],
        screens: [
          { route: "/trfs", screen_name: "TRF List", layout: "Sidebar + main with table view", widgets: ["TRF table", "Status filters", "Search"], conditional_sections: [], animations: [] },
          { route: "/trfs/:id", screen_name: "TRF Detail", layout: "Sidebar + main with tabbed sections", widgets: ["TRF header", "Timeline", "Test results", "Documents", "Approval workflow", "AI assessment strip"], conditional_sections: ["Approval only for pending_review status"], animations: ["Timeline entry animations"] }
        ]
      },
      {
        module_name: "Products",
        category: "compliance_management",
        route: "/products",
        description: "Product catalog with compliance status tracking, risk scores, image galleries, and CSV import capability.",
        maturity: "implemented",
        demo_readiness: "demo_ready",
        demo_wow_factor: 7,
        demo_talk_track: "Your complete product compliance view. Every product shows real-time compliance status, risk scores, and linked test history. The image gallery brings physical products into the digital workflow.",
        features: [
          {
            name: "Product Catalog",
            description: "Searchable, filterable product list with compliance status, risk scores, and quick actions",
            implementation_status: "complete",
            ai_presence: "light",
            ai_details: "Risk scores computed and displayed",
            reasoning_visible: false,
            ui_elements: ["Product cards with images", "Compliance status badges", "Risk score indicators", "Category filters"],
            interactions: ["search", "filter", "click to detail"],
            data_source: "mockProducts",
            unique_to_carlos: false,
            competitive_notes: "Standard product catalog. Inspectorio has similar."
          },
          {
            name: "Product Image Gallery",
            description: "Multi-image gallery with primary image selection and carousel navigation",
            implementation_status: "complete",
            ai_presence: "none",
            ai_details: null,
            reasoning_visible: false,
            ui_elements: ["ProductImageGallery with thumbnail strip", "Full-size image viewer", "Embla carousel"],
            interactions: ["click thumbnails", "carousel navigation"],
            data_source: "mockProducts images array",
            unique_to_carlos: false,
            competitive_notes: "Parity with competitors."
          },
          {
            name: "CSV Import",
            description: "Bulk product import via CSV file upload with field mapping dialog",
            implementation_status: "partial",
            ai_presence: "none",
            ai_details: null,
            reasoning_visible: false,
            ui_elements: ["CSVImportDialog with drag-drop zone", "Field mapping interface"],
            interactions: ["drag-drop file", "map fields", "import"],
            data_source: "user-uploaded CSV",
            unique_to_carlos: false,
            competitive_notes: "Standard feature, parity."
          }
        ],
        screens: [
          { route: "/products", screen_name: "Products List", layout: "Sidebar + main with grid/list toggle", widgets: ["Product cards/table", "Filters", "Search", "CSV import button"], conditional_sections: [], animations: [] },
          { route: "/products/:id", screen_name: "Product Detail", layout: "Sidebar + main with tabbed detail", widgets: ["Product header", "Image gallery", "Specifications", "Compliance history", "Linked TRFs"], conditional_sections: [], animations: [] }
        ]
      },
      {
        module_name: "Suppliers",
        category: "compliance_management",
        route: "/suppliers",
        description: "Comprehensive supplier management with tiered classification, performance scoring, certification tracking, task inbox with SLA management, and multi-step onboarding wizard.",
        maturity: "implemented",
        demo_readiness: "demo_ready",
        demo_wow_factor: 8,
        demo_talk_track: "Complete supplier lifecycle management. See compliance scores at a glance, drill into any supplier for certifications and linked styles, or manage tasks in the supplier inbox with SLA tracking.",
        features: [
          {
            name: "Enhanced Supplier Table",
            description: "Rich data table with tier badges, compliance status, performance scores, and bulk actions",
            implementation_status: "complete",
            ai_presence: "light",
            ai_details: "Scores influence sorting and risk highlighting",
            reasoning_visible: false,
            ui_elements: ["SupplierTable with sortable columns", "SupplierTierBadge (strategic/preferred/approved/probation)", "SupplierComplianceBadge", "SupplierBulkActions", "SupplierFilters", "SupplierStats summary cards"],
            interactions: ["sort", "filter (status/tier/compliance/country)", "search", "select for bulk actions", "click to drawer", "export CSV"],
            data_source: "richSuppliers (8 suppliers)",
            unique_to_carlos: false,
            competitive_notes: "Comparable to Inspectorio Rise. CARLOS adds tier classification and richer compliance status."
          },
          {
            name: "Supplier Detail Drawer",
            description: "Slide-out drawer with scores, activity metrics, contact info, certifications, specializations, tasks, and audit schedule",
            implementation_status: "complete",
            ai_presence: "none",
            ai_details: null,
            reasoning_visible: false,
            ui_elements: ["SupplierDrawerHeader", "SupplierScores (4 score grid)", "SupplierActivity (stats + pass rate bar)", "SupplierContact", "SupplierCertifications", "SupplierSpecializations", "SupplierTasks", "SupplierAuditSchedule", "Send Questionnaire button", "View Full Profile button"],
            interactions: ["scroll sections", "send questionnaire (external link)", "navigate to full profile"],
            data_source: "richSuppliers",
            unique_to_carlos: false,
            competitive_notes: "Standard supplier drawer. Well-organized with good information density."
          },
          {
            name: "Supplier Inbox",
            description: "Task inbox for supplier-related actions with SLA tracking, priority filtering, and status management",
            implementation_status: "complete",
            ai_presence: "light",
            ai_details: "Tasks sorted by priority and SLA urgency",
            reasoning_visible: false,
            ui_elements: ["Task list with SLA indicators", "Priority badges", "Status filters", "Assignee display"],
            interactions: ["filter by status/priority", "view task details"],
            data_source: "supplierTasks (8 tasks)",
            unique_to_carlos: false,
            competitive_notes: "Inspectorio has similar task management."
          },
          {
            name: "Supplier Onboarding Wizard",
            description: "5-step wizard: Company Info → Contacts → Tier & Compliance → Certifications → Specializations",
            implementation_status: "complete",
            ai_presence: "none",
            ai_details: null,
            reasoning_visible: false,
            ui_elements: ["Step indicator", "Form fields per step", "Validation", "Review summary"],
            interactions: ["fill forms", "next/previous", "submit"],
            data_source: "form state → localStorage",
            unique_to_carlos: false,
            competitive_notes: "Standard onboarding wizard."
          },
          {
            name: "Supplier Full Profile",
            description: "Dedicated supplier detail page with linked styles, all contacts, performance charts, and comprehensive data",
            implementation_status: "complete",
            ai_presence: "light",
            ai_details: "Performance chart visualization",
            reasoning_visible: false,
            ui_elements: ["SupplierPerformanceChart", "Linked styles table", "Full contact list", "Certification timeline"],
            interactions: ["view linked styles", "navigate to style detail"],
            data_source: "richSuppliers + mockLinkedStyles",
            unique_to_carlos: false,
            competitive_notes: "Comparable to Inspectorio supplier profiles."
          }
        ],
        screens: [
          { route: "/suppliers", screen_name: "Suppliers List", layout: "Sidebar + main with stats + table", widgets: ["SupplierStats (4 cards)", "SupplierFilters", "SupplierTable", "SupplierDetailDrawer"], conditional_sections: [], animations: [] },
          { route: "/suppliers/new", screen_name: "Supplier Create", layout: "Sidebar + centered wizard", widgets: ["5-step form wizard"], conditional_sections: [], animations: ["Step transition animations"] },
          { route: "/suppliers/inbox", screen_name: "Supplier Inbox", layout: "Sidebar + main with task list", widgets: ["Task list", "Priority filters", "Status tabs"], conditional_sections: [], animations: [] },
          { route: "/suppliers/:id", screen_name: "Supplier Detail", layout: "Sidebar + main with tabbed profile", widgets: ["Profile header", "Performance chart", "Linked styles", "Contacts", "Certifications", "Audit schedule"], conditional_sections: [], animations: [] }
        ]
      },
      {
        module_name: "Lab Operations",
        category: "ai_operations",
        route: "/lab",
        description: "Lab sample queue management with priority-based sorting, progress tracking, and assignment.",
        maturity: "implemented",
        demo_readiness: "demo_ready",
        demo_wow_factor: 6,
        demo_talk_track: "The lab dashboard gives technicians instant visibility into their testing queue, prioritized by SLA urgency and sample type.",
        features: [
          {
            name: "Lab Sample Queue",
            description: "Prioritized queue of lab samples with status tracking, progress bars, and assignee info",
            implementation_status: "complete",
            ai_presence: "light",
            ai_details: "Samples sorted by priority",
            reasoning_visible: false,
            ui_elements: ["Sample cards with status badges", "Priority indicators", "Progress bars", "Assignee avatars"],
            interactions: ["sort by priority/status", "click to view TRF"],
            data_source: "mockLabSamples",
            unique_to_carlos: false,
            competitive_notes: "Inspectorio LabSync offers more advanced lab features. CARLOS lab module is simpler but functional."
          }
        ],
        screens: [
          { route: "/lab", screen_name: "Lab Dashboard", layout: "Sidebar + main with queue", widgets: ["Lab KPIs", "Sample queue", "Priority filters"], conditional_sections: ["Shows only for lab_technician role by default"], animations: [] }
        ]
      },
      {
        module_name: "Inspections",
        category: "compliance_management",
        route: "/inspections",
        description: "Comprehensive inspection management with table/kanban views, calendar with drag-drop scheduling, world map factory view, stats dashboard, defect tracking, and risk-based filtering.",
        maturity: "implemented",
        demo_readiness: "demo_ready",
        demo_wow_factor: 8,
        demo_talk_track: "Full inspection lifecycle — from scheduling on the calendar with drag-drop, to tracking results in kanban, to drilling into defect details. The world map shows your global inspection footprint.",
        features: [
          {
            name: "Table/Kanban Views",
            description: "Toggle between data table and kanban board views for inspections",
            implementation_status: "complete",
            ai_presence: "none",
            ai_details: null,
            reasoning_visible: false,
            ui_elements: ["InspectionTable with sortable columns", "InspectionKanban with status columns", "View toggle", "InspectionResultBadge", "InspectionRiskBadge", "InspectionStatusBadge", "InspectionTypeBadge"],
            interactions: ["toggle view", "sort", "filter", "click to detail", "bulk select"],
            data_source: "richInspections (10 inspections)",
            unique_to_carlos: false,
            competitive_notes: "Comparable to Inspectorio Tracking."
          },
          {
            name: "Calendar with Drag-Drop",
            description: "Monthly calendar view with drag-drop inspection rescheduling",
            implementation_status: "complete",
            ai_presence: "none",
            ai_details: null,
            reasoning_visible: false,
            ui_elements: ["Calendar grid", "CalendarDayCell", "DraggableInspectionDot", "Inspection type color coding"],
            interactions: ["drag inspection to new date", "click date to view inspections", "month navigation"],
            data_source: "mockInspections",
            unique_to_carlos: false,
            competitive_notes: "Inspectorio has calendar view. Drag-drop rescheduling is a nice UX touch."
          },
          {
            name: "World Map Factory View",
            description: "Interactive world map showing factory locations with inspection markers",
            implementation_status: "complete",
            ai_presence: "none",
            ai_details: null,
            reasoning_visible: false,
            ui_elements: ["WorldMap (react-simple-maps)", "Factory markers", "FactoryDetailsModal on click"],
            interactions: ["click factory marker", "zoom/pan map", "view factory details modal"],
            data_source: "factory locations from inspections",
            unique_to_carlos: false,
            competitive_notes: "Inspectorio also has a map view. Parity."
          },
          {
            name: "Inspection Stats Dashboard",
            description: "Summary statistics with pass rates, risk distribution, and status breakdown",
            implementation_status: "complete",
            ai_presence: "none",
            ai_details: null,
            reasoning_visible: false,
            ui_elements: ["InspectionStats cards", "InspectionDefectsSummary", "InspectionWorkflowProgress"],
            interactions: ["view stats"],
            data_source: "calculateInspectionStats(richInspections)",
            unique_to_carlos: false,
            competitive_notes: "Standard stats dashboard."
          },
          {
            name: "Inspection Detail with Findings",
            description: "Detailed inspection view with findings, corrective actions, checklists, and photo evidence",
            implementation_status: "complete",
            ai_presence: "none",
            ai_details: null,
            reasoning_visible: false,
            ui_elements: ["Findings list with severity badges", "Corrective action tracker", "Checklist view", "Photo gallery"],
            interactions: ["view findings", "track corrective actions", "view photos"],
            data_source: "inspectionDetailData",
            unique_to_carlos: false,
            competitive_notes: "Comparable to Inspectorio."
          }
        ],
        screens: [
          { route: "/inspections", screen_name: "Inspections Enhanced", layout: "Sidebar + main with tabs (table/kanban)", widgets: ["InspectionStats", "InspectionFilters", "InspectionTable/InspectionKanban", "InspectionBulkActions"], conditional_sections: [], animations: [] },
          { route: "/inspections/calendar", screen_name: "Inspections Calendar", layout: "Sidebar + main with calendar + map tabs", widgets: ["Calendar grid", "World map", "Factory details modal"], conditional_sections: [], animations: [] },
          { route: "/inspections/new", screen_name: "Create Inspection", layout: "Sidebar + centered form", widgets: ["InspectionForm"], conditional_sections: [], animations: [] },
          { route: "/inspections/:id", screen_name: "Inspection Detail", layout: "Sidebar + main with tabbed detail", widgets: ["Inspection header", "Findings list", "Corrective actions", "Checklists", "Photos"], conditional_sections: [], animations: [] }
        ]
      },
      {
        module_name: "Insights & Analytics",
        category: "reporting",
        route: "/analytics",
        description: "Multi-tab analytics dashboard with risk summary, compliance health, pipeline flow, transaction log, balance tracking, custom reports, and collection readiness funnel.",
        maturity: "implemented",
        demo_readiness: "demo_ready",
        demo_wow_factor: 8,
        demo_talk_track: "Seven analytics views in one module. The risk heatmap by country, compliance health trends, and pipeline flow give you a complete picture of your compliance operations. The readiness funnel shows where collections are blocked.",
        features: [
          {
            name: "Risk Summary Dashboard",
            description: "Risk distribution by country, factory risk table, and overall risk metrics",
            implementation_status: "complete",
            ai_presence: "light",
            ai_details: "Risk scores computed and visualized",
            reasoning_visible: false,
            ui_elements: ["RiskSummaryDashboard", "Bar charts (risk by country)", "Pie chart (risk distribution)", "Factory risk table", "Summary stat cards"],
            interactions: ["view charts", "sort factory table"],
            data_source: "mockReports (riskByCountry, riskFactories, factoryRiskDistribution)",
            unique_to_carlos: false,
            competitive_notes: "Inspectorio has similar risk dashboards."
          },
          {
            name: "Compliance Health",
            description: "Compliance score trends over time with category breakdown",
            implementation_status: "complete",
            ai_presence: "light",
            ai_details: "Trend analysis",
            reasoning_visible: false,
            ui_elements: ["ComplianceHealthView", "Line chart (6-month trend)", "Category score cards with trend indicators"],
            interactions: ["view trends"],
            data_source: "complianceMetrics, complianceTimeline",
            unique_to_carlos: false,
            competitive_notes: "Standard compliance dashboard."
          },
          {
            name: "Pipeline Flow",
            description: "Testing pipeline visualization showing volume and average days per stage",
            implementation_status: "complete",
            ai_presence: "none",
            ai_details: null,
            reasoning_visible: false,
            ui_elements: ["PipelineFlowDashboard", "Funnel/bar chart", "Stage cards with counts and avg days"],
            interactions: ["view pipeline stages"],
            data_source: "pipelineData, pipelineByType",
            unique_to_carlos: true,
            competitive_notes: "Pipeline flow visualization is more operational than Inspectorio's reporting."
          },
          {
            name: "Transaction Log",
            description: "Searchable, filterable transaction table with pagination",
            implementation_status: "complete",
            ai_presence: "none",
            ai_details: null,
            reasoning_visible: false,
            ui_elements: ["TransactionTable with pagination", "Type/status filters", "Search"],
            interactions: ["search", "filter", "paginate", "sort"],
            data_source: "generateTransactions() (150 mock transactions)",
            unique_to_carlos: false,
            competitive_notes: "Standard transaction log."
          },
          {
            name: "Balances View",
            description: "Test credit and resource balance tracking with usage trends",
            implementation_status: "complete",
            ai_presence: "none",
            ai_details: null,
            reasoning_visible: false,
            ui_elements: ["BalancesView", "Progress bars for each category", "Usage trend chart"],
            interactions: ["view balances"],
            data_source: "balanceData, balanceTrend",
            unique_to_carlos: true,
            competitive_notes: "Unique to CARLOS — tracks test credit consumption which is core to THT's business model."
          },
          {
            name: "Custom Reports",
            description: "Pre-configured report templates with schedule management",
            implementation_status: "partial",
            ai_presence: "none",
            ai_details: null,
            reasoning_visible: false,
            ui_elements: ["CustomReports list", "Schedule badges", "Run report buttons"],
            interactions: ["run report", "view schedule"],
            data_source: "customReports (4 reports)",
            unique_to_carlos: false,
            competitive_notes: "Basic custom reports. Inspectorio has more advanced report builder."
          },
          {
            name: "Collection Readiness Funnel",
            description: "Funnel visualization showing collection progression through testing stages",
            implementation_status: "complete",
            ai_presence: "light",
            ai_details: "Readiness scores drive funnel positions",
            reasoning_visible: false,
            ui_elements: ["CollectionReadinessFunnel", "Stage bars with counts", "Blocked collection indicators"],
            interactions: ["view funnel", "click stage to filter"],
            data_source: "mockCollections status distribution",
            unique_to_carlos: true,
            competitive_notes: "Unique to CARLOS — directly visualizes the compliance pipeline bottlenecks."
          }
        ],
        screens: [
          { route: "/analytics", screen_name: "Insights", layout: "Sidebar + main with 7 tabs", widgets: ["ReportOverview", "RiskSummaryDashboard", "ComplianceHealthView", "PipelineFlowDashboard", "TransactionTable", "BalancesView", "CustomReports", "CollectionReadinessFunnel"], conditional_sections: [], animations: [] }
        ]
      },
      {
        module_name: "Help & Support Center",
        category: "ai_operations",
        route: "/support-center",
        description: "Comprehensive help system with knowledge base, guided resolution flows, escalation management, and Ask Carlos AI assistant.",
        maturity: "implemented",
        demo_readiness: "demo_ready",
        demo_wow_factor: 7,
        demo_talk_track: "Built-in support center with an AI assistant that understands your compliance context. Ask Carlos anything about your TRFs, suppliers, or regulations — it responds with contextual, actionable answers.",
        features: [
          {
            name: "Ask Carlos (AI Chat)",
            description: "AI assistant that answers compliance questions with contextual responses and follow-up suggestions",
            implementation_status: "complete",
            ai_presence: "core",
            ai_details: "Pattern-matched responses for overdue TRFs, failed tests, supplier risk. Returns formatted markdown with tables and recommendations. Suggests follow-up questions.",
            reasoning_visible: true,
            ui_elements: ["AskCarlosPanel with chat interface", "Message bubbles", "Suggestion chips", "Source citations"],
            interactions: ["type question", "click suggestion", "view sources"],
            data_source: "aiDemoResponses pattern matching",
            unique_to_carlos: true,
            competitive_notes: "Inspectorio's Paramo AI is a separate product. CARLOS embeds AI directly into the help system with compliance-specific context."
          },
          {
            name: "Knowledge Base",
            description: "Searchable articles organized by category with full article viewer",
            implementation_status: "complete",
            ai_presence: "none",
            ai_details: null,
            reasoning_visible: false,
            ui_elements: ["CategoryNav", "ArticlePanel", "Search input", "IntentCard for quick actions"],
            interactions: ["search", "browse categories", "read articles"],
            data_source: "helpData, helpKnowledgeBase",
            unique_to_carlos: false,
            competitive_notes: "Standard help center."
          },
          {
            name: "Guided Resolution",
            description: "Step-by-step guided resolution flows for common issues",
            implementation_status: "complete",
            ai_presence: "light",
            ai_details: "Resolution paths adapted based on issue type",
            reasoning_visible: false,
            ui_elements: ["GuidedResolution stepper", "Decision trees", "Action buttons"],
            interactions: ["select issue", "follow steps", "escalate"],
            data_source: "guidedResolutions",
            unique_to_carlos: true,
            competitive_notes: "Not available in Inspectorio's support."
          },
          {
            name: "Escalation Management",
            description: "Support ticket escalation with priority tracking",
            implementation_status: "partial",
            ai_presence: "none",
            ai_details: null,
            reasoning_visible: false,
            ui_elements: ["EscalationPanel", "SupportTickets list"],
            interactions: ["create ticket", "view status"],
            data_source: "mock tickets",
            unique_to_carlos: false,
            competitive_notes: "Standard support ticketing."
          },
          {
            name: "Global Help Drawer",
            description: "Slide-out help drawer accessible from any page via floating button. Includes inline tooltips.",
            implementation_status: "complete",
            ai_presence: "moderate",
            ai_details: "AI answer panel with contextual help based on current page",
            reasoning_visible: true,
            ui_elements: ["HelpDrawer (global overlay)", "AIAnswerPanel", "InlineHelpTooltip", "DraftsTabContent"],
            interactions: ["open from any page", "search", "browse", "ask AI"],
            data_source: "helpData",
            unique_to_carlos: true,
            competitive_notes: "Contextual help drawer is unique to CARLOS."
          }
        ],
        screens: [
          { route: "/support-center", screen_name: "Support Center", layout: "Sidebar + main with tabs (Knowledge Base, Ask Carlos, Guided Resolution, Escalation)", widgets: ["CategoryNav", "ArticlePanel", "AskCarlosPanel", "GuidedResolution", "EscalationPanel"], conditional_sections: [], animations: [] }
        ]
      },
      {
        module_name: "Platform Administration",
        category: "administration",
        route: "/settings",
        description: "System settings and platform documentation with data model viewer, workflow documentation, and export tools.",
        maturity: "partial",
        demo_readiness: "needs_polish",
        demo_wow_factor: 5,
        demo_talk_track: "The documentation module is unique — it auto-generates platform documentation including data models, workflows, and roles. Useful for onboarding and compliance auditing of the platform itself.",
        features: [
          {
            name: "Settings Page",
            description: "System configuration page",
            implementation_status: "stubbed",
            ai_presence: "none",
            ai_details: null,
            reasoning_visible: false,
            ui_elements: ["Settings form"],
            interactions: ["edit settings"],
            data_source: "N/A",
            unique_to_carlos: false,
            competitive_notes: "Standard settings page."
          },
          {
            name: "Platform Documentation",
            description: "Auto-generated platform docs with app map, data model, workflows, roles, and export capability",
            implementation_status: "complete",
            ai_presence: "none",
            ai_details: null,
            reasoning_visible: false,
            ui_elements: ["AppMapTab", "DataModelTab", "WorkflowsTab", "RolesTab", "ExportTab"],
            interactions: ["browse tabs", "export documentation"],
            data_source: "docs/registry.ts",
            unique_to_carlos: true,
            competitive_notes: "Self-documenting platform is unique. Inspectorio doesn't offer this."
          }
        ],
        screens: [
          { route: "/settings", screen_name: "Settings", layout: "Sidebar + main", widgets: ["Settings form"], conditional_sections: [], animations: [] },
          { route: "/documentation", screen_name: "Documentation", layout: "Sidebar + tabbed main", widgets: ["AppMapTab", "DataModelTab", "WorkflowsTab", "RolesTab", "ExportTab"], conditional_sections: [], animations: [] }
        ]
      },
      {
        module_name: "Platform Tour & Onboarding",
        category: "administration",
        route: "N/A (global overlay)",
        description: "Interactive platform tour with spotlight highlights and step-by-step guidance for new users.",
        maturity: "implemented",
        demo_readiness: "demo_ready",
        demo_wow_factor: 6,
        demo_talk_track: "New users get an interactive guided tour highlighting key features. Great for reducing time-to-value during client onboarding.",
        features: [
          {
            name: "Platform Tour",
            description: "Multi-step guided tour with spotlight overlays on key UI elements",
            implementation_status: "complete",
            ai_presence: "none",
            ai_details: null,
            reasoning_visible: false,
            ui_elements: ["PlatformTour overlay", "TourCard with step content", "TourSpotlight highlighting"],
            interactions: ["next/previous step", "skip tour", "restart tour"],
            data_source: "tourSteps configuration",
            unique_to_carlos: false,
            competitive_notes: "Standard onboarding tour."
          }
        ],
        screens: []
      }
    ],

    ai_capabilities: {
      summary: "AI is deeply embedded across CARLOS as a first-class feature, not a bolt-on. Key philosophy: every AI action must be explainable (reasoning transparency), show confidence levels, and maintain human-in-the-loop control. Currently implemented as rule-based/simulated AI with architecture designed for real model integration.",
      capabilities: [
        {
          name: "AI Task Prioritisation",
          type: "prioritisation",
          description: "Ranks tasks by computed impact, urgency, and risk scores. Shows full reasoning chain.",
          where_used: ["/", "Dashboard"],
          user_facing: true,
          reasoning_transparency: "Full — shows why it's a problem, evidence, consequences, and fastest fix",
          confidence_display: "Yes — percentage on recommended actions",
          implementation: "rule_based",
          technical_details: "useAIContext hook computes impactScore (priority-derived), urgencyScore (SLA-derived), riskScore (70% impact + 30% urgency). AIReasoning interface provides whyProblem, evidence[], consequenceIfIgnored, fastestFix strings."
        },
        {
          name: "Readiness & Confidence Scoring",
          type: "risk_scoring",
          description: "Computes overall compliance readiness with trend indicator and gap analysis",
          where_used: ["/", "Dashboard ReadinessGauge"],
          user_facing: true,
          reasoning_transparency: "Shows specific gaps with severity, reason, resolution timeline, and owner",
          confidence_display: "Yes — low/medium/high confidence band",
          implementation: "rule_based",
          technical_details: "ReadinessScore interface with overall (0-100), trend, confidence, and ReadinessGap[] array. Gaps include attribute, severity, reason, estimatedResolutionDays, owner."
        },
        {
          name: "Scenario Simulation",
          type: "reasoning",
          description: "What-if simulation: toggle DPP enforcement or stricter regulations to see impact on readiness, tasks, products",
          where_used: ["/", "Dashboard ScenarioSimulator"],
          user_facing: true,
          reasoning_transparency: "Shows readiness delta, new critical tasks count, affected products, remediation timeline",
          confidence_display: "No",
          implementation: "rule_based",
          technical_details: "ScenarioState (dppEnforced boolean, regulationThreshold number) → ScenarioImpact (readinessChange, newCriticalTasks, affectedProducts, estimatedRemediationDays)"
        },
        {
          name: "AI Test Plan Recommendations",
          type: "recommendation",
          description: "Suggests test plans based on material composition (pilling for knits vs abrasion for wovens), construction type, and department safety rules",
          where_used: ["/styles/:id", "Style Detail AI Assist panel"],
          user_facing: true,
          reasoning_transparency: "Shows reasoning and confidence for each suggestion",
          confidence_display: "Yes",
          implementation: "rule_based",
          technical_details: "aiTestPlanSuggestions.ts analyzes Component composition, construction, and department to generate AIAssistSuggestion[] with type, title, description, confidence, reasoning[]"
        },
        {
          name: "AI Care Label Pre-fill",
          type: "extraction",
          description: "Pre-fills care label symbols and wording based on material composition",
          where_used: ["/care-labelling", "/styles/:id"],
          user_facing: true,
          reasoning_transparency: "Shows why specific symbols were selected",
          confidence_display: "Yes",
          implementation: "rule_based",
          technical_details: "Maps composition strings to appropriate care symbols"
        },
        {
          name: "AI Assessment Strip",
          type: "risk_scoring",
          description: "Shows AI readiness assessment, risk level, and recommendations on object detail pages",
          where_used: ["/trfs/:id", "/products/:id"],
          user_facing: true,
          reasoning_transparency: "Shows primary risk and recommendation",
          confidence_display: "Yes — low/medium/high",
          implementation: "rule_based",
          technical_details: "AIAssessment interface with readiness, readinessTrend, confidence, primaryRisk, recommendation"
        },
        {
          name: "Ask Carlos (AI Chat)",
          type: "generation",
          description: "Conversational AI assistant for compliance queries with contextual responses",
          where_used: ["/support-center", "Global HelpDrawer"],
          user_facing: true,
          reasoning_transparency: "Provides source citations and follow-up suggestions",
          confidence_display: "No",
          implementation: "simulated",
          technical_details: "Pattern-matched responses in aiDemoResponses. Matches keywords (overdue, failed, supplier) to pre-written responses with markdown formatting."
        },
        {
          name: "Role-Adaptive Layout",
          type: "classification",
          description: "Adapts dashboard layout, widgets, and emphasis areas based on user role",
          where_used: ["/", "Dashboard"],
          user_facing: false,
          reasoning_transparency: "No",
          confidence_display: "No",
          implementation: "rule_based",
          technical_details: "LayoutConfig computed in useAIContext based on currentUser.role. Maps roles to primary/secondary widgets and emphasis areas."
        }
      ],
      ai_vs_inspectorio: {
        carlos_advantages: [
          "Full reasoning transparency on every AI recommendation (Inspectorio shows scores but not WHY)",
          "Scenario simulation for compliance readiness (unique to CARLOS)",
          "AI test plan recommendations based on material/construction analysis (deeper than Inspectorio's generic suggestions)",
          "Embedded AI across all modules, not a separate product (Paramo is sold separately)",
          "Confidence scores on all AI outputs with evidence chains",
          "Care label AI pre-fill based on composition (Inspectorio doesn't do care labelling)",
          "TIC-native AI that understands testing, compliance, and certification workflows"
        ],
        inspectorio_advantages: [
          "Real AI models trained on production data (CARLOS is rule-based/simulated)",
          "Paramo AI covers defect detection from photos (CARLOS doesn't have image AI)",
          "Larger training dataset from 2000+ brand customers",
          "AI-powered supplier scoring from real transaction data"
        ],
        parity: [
          "Risk scoring and visualization",
          "Task prioritisation by urgency/impact",
          "Dashboard KPIs and analytics"
        ]
      }
    },

    sustainability_module: {
      description: "Sustainability architecture is embedded via the scheme-agnostic evidence graph design and DPP readiness tracking. Not a separate module but woven into the Styles pipeline.",
      evidence_graph: {
        description: "Designed as a scheme-agnostic evidence graph where compliance schemes plug in as configuration. Each scheme maps to required evidence types that can be fulfilled by certifications, lab results, audit reports, or declarations.",
        scheme_agnostic: true,
        supported_schemes: ["OEKO-TEX Standard 100", "GOTS", "ISO 9001:2015", "ISO 14001", "BSCI", "bluesign (planned)", "ZDHC (planned)"],
        scheme_extensibility: "New schemes added as configuration — define required evidence types and validation rules without code changes. Current implementation uses certification data model.",
        evidence_types: ["certificates (SupplierCertification)", "lab_results (TRFTest)", "audit_reports (Inspection findings)", "supplier_declarations (questionnaire responses)"],
        claim_validation: "Certificates tracked with issued/expiry dates and valid/expiring_soon/expired status. Compliance scores aggregated from multiple evidence sources.",
        overclaim_prevention: "Expiry date tracking prevents using expired certifications. Compliance status enforced at supplier level (compliant/at_risk/non_compliant/pending_audit)."
      },
      dpp_readiness: {
        description: "EU Digital Product Passport 2027 readiness is built into the architecture. ProductCollection has dppPassportId field. Scenario simulator models DPP enforcement impact.",
        data_model_alignment: "ProductCollection → Components (N:M with composition, construction, origin) → Testing Levels (Base/Bulk/Garment) → Care Labels → GSW. This chain maps to DPP requirements for material traceability, compliance evidence, and care instructions.",
        export_capability: "not_implemented — DPP export schema not yet built",
        audit_trail: "GSW has full audit trail (GSWAuditEvent[]). TRF has timeline events. Testing levels track approval dates and approvers."
      },
      competitive_advantage: "CARLOS is DPP-ready by design — the data model already captures the material composition, origin, testing history, and care instruction chain required by EU DPP 2027. Inspectorio would need significant architecture changes to support DPP because their data model is PO-centric, not product-lifecycle-centric."
    },

    demo_focus_system: {
      present: true,
      description: "Demo role-switching via UserContext. 5 pre-configured personas with instant switching. Feature flags (NEW_IA_NAV_AND_HOME) control experimental features.",
      personas: ["Sarah Chen (Buyer/QA Manager)", "Marcus Wong (Supplier User)", "Dr. Amm Martinez (Lab Technician)", "Mark Richardson (Manager/Executive)", "Hajra Khan (System Admin)"],
      focus_levels: ["Not explicitly implemented as focus levels"],
      keyboard_shortcuts: ["None implemented"],
      demo_routes: ["/ (Dashboard — best starting point)", "/styles (Styles pipeline)", "/suppliers (Supplier management)", "/inspections (Inspections with map)", "/analytics (7-tab analytics)"],
      visibility_map: "Role-based via UserContext: Lab queue visible for lab_technician, Confidence dashboard for manager, different KPI sets per role."
    },

    insights_and_reporting: {
      dashboards: [
        { name: "Risk Summary", route: "/analytics", widgets: ["Risk by country bar chart", "Risk distribution pie", "Factory risk table", "Summary stats"], ai_presence: "light", ai_details: "Risk scores computed", export_options: ["not_implemented"] },
        { name: "Compliance Health", route: "/analytics", widgets: ["6-month trend line chart", "Category score cards"], ai_presence: "light", ai_details: "Trend analysis", export_options: ["not_implemented"] },
        { name: "Pipeline Flow", route: "/analytics", widgets: ["Pipeline funnel/bar chart", "Stage cards", "Test type breakdown"], ai_presence: "none", ai_details: null, export_options: ["not_implemented"] },
        { name: "Transactions", route: "/analytics", widgets: ["Searchable paginated transaction table"], ai_presence: "none", ai_details: null, export_options: ["not_implemented"] },
        { name: "Balances", route: "/analytics", widgets: ["Balance progress bars", "Usage trend chart"], ai_presence: "none", ai_details: null, export_options: ["not_implemented"] },
        { name: "Collection Readiness Funnel", route: "/analytics", widgets: ["Funnel visualization of collection stages"], ai_presence: "light", ai_details: "Readiness scores", export_options: ["not_implemented"] }
      ],
      charts_and_visualisations: [
        { type: "bar", library: "recharts", location: "/analytics (Risk by Country)", data_source: "riskByCountry" },
        { type: "pie", library: "recharts", location: "/analytics (Risk Distribution)", data_source: "factoryRiskDistribution" },
        { type: "line", library: "recharts", location: "/analytics (Compliance Timeline)", data_source: "complianceTimeline" },
        { type: "bar", library: "recharts", location: "/analytics (Pipeline Flow)", data_source: "pipelineData" },
        { type: "bar", library: "recharts", location: "/analytics (Balances Trend)", data_source: "balanceTrend" },
        { type: "progress", library: "custom (Radix Progress)", location: "/analytics (Balances), various", data_source: "balanceData" },
        { type: "gauge", library: "custom SVG", location: "/ (Dashboard ReadinessGauge)", data_source: "useAIContext readiness" },
        { type: "bar", library: "recharts", location: "/suppliers/:id (Performance Chart)", data_source: "supplier scores" }
      ],
      regulatory_tracking: {
        tracked_regulations: ["EU DPP 2027", "CPSC eFiling July 2026", "EU REACH updates"],
        alert_system: "RegulatoryAlerts widget on dashboard shows countdown timers for upcoming regulatory deadlines. Notifications include regulatory updates."
      }
    },

    administration: {
      user_management: {
        role_based_access: "5 roles defined with different dashboard views and navigation sections. No real RBAC enforcement — all routes accessible.",
        roles_defined: ["buyer", "supplier", "lab_technician", "manager", "admin"],
        role_switching_for_demo: "Instant persona switching in header dropdown with avatar, name, company display. Dashboard adapts immediately."
      },
      configuration: {
        custom_workflows: "no (workflow stages are hardcoded)",
        template_management: "no",
        notification_rules: "no",
        branding_customization: "no (THT branding hardcoded)"
      },
      audit_trail: "Partial — GSW has full audit trail. TRF has timeline events. No global audit log.",
      data_export: "CSV export for Suppliers and Inspections. No PDF export. Documentation module has export tab."
    },

    cross_cutting_capabilities: {
      search: {
        type: "per-page",
        description: "Search inputs on Products, Suppliers, TRFs, Inspections pages. No global search. Uses client-side filtering on mock data."
      },
      notifications: {
        type: "in-app",
        description: "Notification bell in header with badge count. mockNotifications array with 4 notification types (warning, info, success, error). No email or push notifications."
      },
      file_management: {
        upload: "CSV import dialog for products. GSW file upload for styles. No real file storage — UI only.",
        preview: "Product image gallery with carousel. Document list on TRF detail (no actual file preview).",
        supported_formats: ["CSV (import)", "XLSX (GSW)", "PDF (documents)", "Images (products)"]
      },
      i18n: {
        multi_language: "no",
        languages: ["English only"]
      },
      theming: {
        dark_mode: "yes — via next-themes with Tailwind dark mode classes",
        custom_themes: "no",
        tht_branding: "THT-inspired deep blue primary (221 83% 53%). Inter font family. Enterprise-grade command center aesthetic."
      }
    },

    ui_component_inventory: {
      total_custom_components: 142,
      design_system: "shadcn/ui (Radix UI primitives + Tailwind CSS) with extensive customization",
      components: [
        { name: "AITaskCard", type: "ai_widget", file_path: "src/components/ai/AITaskCard.tsx", props: ["task: AIComputedTask"], used_in: ["/"], demo_relevant: true },
        { name: "AIReasoningPanel", type: "ai_widget", file_path: "src/components/ai/AIReasoningPanel.tsx", props: ["reasoning: AIReasoning"], used_in: ["/"], demo_relevant: true },
        { name: "ReadinessGauge", type: "ai_widget", file_path: "src/components/ai/ReadinessGauge.tsx", props: ["readiness: ReadinessScore"], used_in: ["/"], demo_relevant: true },
        { name: "ScenarioSimulator", type: "ai_widget", file_path: "src/components/ai/ScenarioSimulator.tsx", props: ["scenarioState", "setScenarioState", "impact"], used_in: ["/"], demo_relevant: true },
        { name: "AIAssessmentStrip", type: "ai_widget", file_path: "src/components/ai/AIAssessmentStrip.tsx", props: ["assessment: AIAssessment"], used_in: ["/trfs/:id"], demo_relevant: true },
        { name: "AIAssistPanel", type: "ai_widget", file_path: "src/components/ai/AIAssistPanel.tsx", props: ["suggestions"], used_in: ["/styles/:id"], demo_relevant: true },
        { name: "AppLayout", type: "layout", file_path: "src/components/layout/AppLayout.tsx", props: ["children"], used_in: ["all pages"], demo_relevant: false },
        { name: "Header", type: "layout", file_path: "src/components/layout/Header.tsx", props: [], used_in: ["all pages"], demo_relevant: true },
        { name: "Sidebar", type: "navigation", file_path: "src/components/layout/Sidebar.tsx", props: [], used_in: ["all pages"], demo_relevant: true },
        { name: "MobileSidebar", type: "navigation", file_path: "src/components/layout/MobileSidebar.tsx", props: [], used_in: ["all pages (mobile)"], demo_relevant: false },
        { name: "SupplierDetailDrawer", type: "overlay", file_path: "src/components/suppliers/SupplierDetailDrawer.tsx", props: ["supplier", "open", "onClose"], used_in: ["/suppliers"], demo_relevant: true },
        { name: "InspectionKanban", type: "data_display", file_path: "src/components/inspection/InspectionKanban.tsx", props: ["inspections"], used_in: ["/inspections"], demo_relevant: true },
        { name: "WorldMap", type: "chart", file_path: "src/components/inspections/WorldMap.tsx", props: [], used_in: ["/inspections/calendar"], demo_relevant: true },
        { name: "PlatformTour", type: "overlay", file_path: "src/components/tour/PlatformTour.tsx", props: [], used_in: ["global"], demo_relevant: true },
        { name: "HelpDrawer", type: "overlay", file_path: "src/components/help/HelpDrawer.tsx", props: [], used_in: ["global"], demo_relevant: true },
        { name: "AskCarlosPanel", type: "ai_widget", file_path: "src/components/help-support/AskCarlosPanel.tsx", props: [], used_in: ["/support-center"], demo_relevant: true },
        { name: "WidgetCatalog", type: "overlay", file_path: "src/components/dashboard/WidgetCatalog.tsx", props: [], used_in: ["/"], demo_relevant: true },
        { name: "SortableWidgetItem", type: "data_display", file_path: "src/components/dashboard/SortableWidgetItem.tsx", props: ["widget"], used_in: ["/"], demo_relevant: false },
        { name: "ProductImageGallery", type: "data_display", file_path: "src/components/products/ProductImageGallery.tsx", props: ["images"], used_in: ["/products/:id"], demo_relevant: false },
        { name: "CSVImportDialog", type: "overlay", file_path: "src/components/products/CSVImportDialog.tsx", props: [], used_in: ["/products"], demo_relevant: false },
        { name: "CollectionReadinessFunnel", type: "chart", file_path: "src/components/reports/CollectionReadinessFunnel.tsx", props: [], used_in: ["/analytics"], demo_relevant: true },
        { name: "RiskSummaryDashboard", type: "chart", file_path: "src/components/reports/RiskSummaryDashboard.tsx", props: [], used_in: ["/analytics"], demo_relevant: true },
        { name: "TRFTimeline", type: "data_display", file_path: "src/components/trf/TRFTimeline.tsx", props: ["events"], used_in: ["/trfs/:id"], demo_relevant: true },
        { name: "TRFTestResults", type: "data_display", file_path: "src/components/trf/TRFTestResults.tsx", props: ["tests"], used_in: ["/trfs/:id"], demo_relevant: true }
      ]
    },

    demo_highlights: {
      top_10_wow_moments: [
        {
          rank: 1,
          feature: "AI Task Prioritisation with Reasoning Transparency",
          route: "/",
          what_to_show: "Expand any critical task card to reveal full AI reasoning: why it's a problem, evidence, consequences, fastest fix, and recommended action with confidence %.",
          why_it_wows: "No competitor shows WHY. In TIC, explainability isn't optional — it's a regulatory requirement. This demonstrates CARLOS's AI-first philosophy.",
          talk_track: "Every recommendation comes with full reasoning. Click any task and see exactly why the AI flagged it, what evidence it used, and what happens if you ignore it. This level of transparency is unique in the market.",
          vs_inspectorio: "Inspectorio's Paramo shows risk scores but never explains the reasoning. CARLOS provides full evidence chains.",
          vs_current_uki: "Current UKI portal has no AI. Tasks are manually managed in spreadsheets."
        },
        {
          rank: 2,
          feature: "Scenario Simulator (What-If DPP Enforcement)",
          route: "/",
          what_to_show: "Toggle 'DPP Enforcement' on the dashboard. Watch readiness score drop, new critical tasks appear, and affected products count increase in real-time.",
          why_it_wows: "No competitor offers scenario simulation. This lets compliance teams plan for regulatory changes before they happen.",
          talk_track: "Watch what happens when I toggle EU DPP enforcement. Instantly, your readiness drops by 16 points, 8 new critical tasks appear, and 156 products are affected. This is how you prepare for 2027.",
          vs_inspectorio: "Inspectorio has no scenario simulation capability.",
          vs_current_uki: "Current UKI portal has no forward-looking analysis."
        },
        {
          rank: 3,
          feature: "Styles Pipeline with 3-Tier Testing & Component Locking",
          route: "/styles",
          what_to_show: "Show a collection moving through Base → Bulk → Garment testing. Show how components lock after Base approval. Show AI test plan recommendations.",
          why_it_wows: "This transforms compliance from a checklist into an intelligent pipeline. The gated progression with component locking prevents costly rework.",
          talk_track: "This is where CARLOS fundamentally differs from every other platform. Components lock after base testing is approved — preventing the costly rework cycle that plagues UK retailers today.",
          vs_inspectorio: "Inspectorio tracks POs, not product lifecycle. No concept of testing tiers or component locking.",
          vs_current_uki: "Current UKI uses separate systems for testing levels. No integration between components and TRFs."
        },
        {
          rank: 4,
          feature: "Role-Adaptive Dashboard",
          route: "/",
          what_to_show: "Switch between Buyer, Lab Technician, and Manager roles in the header dropdown. Watch KPIs, widgets, and emphasis areas change instantly.",
          why_it_wows: "The same platform serves five different personas with tailored experiences. Reduces training and increases adoption.",
          talk_track: "One platform, five personas. Watch — I switch from Buyer to Lab Technician, and the dashboard instantly reshapes to show lab queue, testing KPIs, and queue depth instead of approval tasks.",
          vs_inspectorio: "Inspectorio has role-based views but they're more static. CARLOS adapts layout and emphasis dynamically.",
          vs_current_uki: "Current UKI portal is one-size-fits-all with no role adaptation."
        },
        {
          rank: 5,
          feature: "7-Tab Analytics Module with Collection Readiness Funnel",
          route: "/analytics",
          what_to_show: "Walk through Risk Summary (heatmap by country), Compliance Health (6-month trends), Pipeline Flow, and the Collection Readiness Funnel showing where collections are blocked.",
          why_it_wows: "Comprehensive operational analytics in one place. The readiness funnel directly shows pipeline bottlenecks.",
          talk_track: "Seven analytics views covering every aspect of your compliance operations. The Collection Readiness Funnel shows exactly where your pipeline is blocked — these 3 collections stuck in base testing are holding up your entire SS26 launch.",
          vs_inspectorio: "Inspectorio has analytics but no collection readiness funnel or test balance tracking.",
          vs_current_uki: "Current UKI generates static PDF reports. No real-time analytics."
        },
        {
          rank: 6,
          feature: "Inspections with Map, Calendar Drag-Drop, and Kanban",
          route: "/inspections",
          what_to_show: "Show the kanban board with inspections in different statuses. Switch to calendar and drag an inspection to a new date. Switch to world map to show global factory coverage.",
          why_it_wows: "Three powerful views for inspection management — visual, temporal, and geographic. Drag-drop scheduling is a delightful UX touch.",
          talk_track: "Manage inspections your way — kanban for workflow, calendar with drag-drop rescheduling, or the world map for your global footprint. All connected, all real-time.",
          vs_inspectorio: "Inspectorio has comparable inspection tracking but CARLOS's 3-view approach is more flexible.",
          vs_current_uki: "Current UKI inspection management is spreadsheet-based with no map or calendar view."
        },
        {
          rank: 7,
          feature: "Ask Carlos AI Assistant",
          route: "/support-center",
          what_to_show: "Type 'Show me overdue TRFs' and watch Carlos respond with a formatted table of overdue items with specific recommendations.",
          why_it_wows: "An AI assistant that understands compliance context and provides actionable answers, not generic help.",
          talk_track: "This is Carlos — your AI compliance assistant. Ask 'What tests failed this week?' and get specific answers with root cause analysis and recommended actions.",
          vs_inspectorio: "Inspectorio's Paramo is a separate product. CARLOS embeds AI directly.",
          vs_current_uki: "No AI in current UKI portal."
        },
        {
          rank: 8,
          feature: "Supplier Management with Tier Classification and Inbox",
          route: "/suppliers",
          what_to_show: "Show the supplier table with tier badges. Click into a supplier drawer. Navigate to the supplier inbox to show SLA-tracked tasks.",
          why_it_wows: "Complete supplier lifecycle management with strategic classification — not just a contact list.",
          talk_track: "Your suppliers classified by strategic value, scored on compliance/quality/delivery, with a dedicated task inbox tracking SLA adherence. This is supplier management, not just a directory.",
          vs_inspectorio: "Inspectorio Rise is similar but CARLOS's tier system is more structured for TIC.",
          vs_current_uki: "Current UKI has basic supplier directory. No scoring, no tiers, no inbox."
        },
        {
          rank: 9,
          feature: "Care Labelling & GSW Workflow",
          route: "/care-labelling",
          what_to_show: "Show AI-assisted care label selection. Show GSW submission with audit trail.",
          why_it_wows: "Care labelling integrated into compliance workflow — not a separate disconnected process.",
          talk_track: "Care labelling is usually done in a separate system. CARLOS integrates it into the testing pipeline with AI-assisted symbol selection based on material composition.",
          vs_inspectorio: "Inspectorio doesn't handle care labelling at all.",
          vs_current_uki: "Care labelling is done in Excel with no audit trail."
        },
        {
          rank: 10,
          feature: "Regulatory Alerts with DPP 2027 Countdown",
          route: "/",
          what_to_show: "Show the regulatory alerts widget with countdown timers for EU DPP 2027 and CPSC eFiling deadlines.",
          why_it_wows: "Proactive regulatory tracking — not reactive. Keeps compliance top-of-mind.",
          talk_track: "CARLOS doesn't just manage today's compliance — it tracks upcoming regulatory changes. EU DPP 2027 is 335 days away. Are you ready? CARLOS can tell you.",
          vs_inspectorio: "Inspectorio doesn't prominently surface regulatory deadlines.",
          vs_current_uki: "No regulatory tracking in current UKI."
        }
      ],
      demo_flow_recommended: [
        { order: 1, screen: "Dashboard", route: "/", duration_minutes: "5", transition_to_next: "Show AI task prioritisation, expand reasoning on a critical task, toggle DPP scenario, then say 'Let me show you the compliance pipeline that feeds these tasks...'" },
        { order: 2, screen: "Styles Pipeline", route: "/styles", duration_minutes: "4", transition_to_next: "Click into a collection in bulk_testing status, show component links and testing levels, then say 'These testing levels generate TRFs...'" },
        { order: 3, screen: "Style Detail", route: "/styles/coll-001", duration_minutes: "3", transition_to_next: "Show the AI assist panel with test plan recommendations, then navigate to the linked TRF" },
        { order: 4, screen: "TRF Detail", route: "/trfs/trf-001", duration_minutes: "3", transition_to_next: "Walk through timeline, test results matrix, documents. Then say 'Now let's see how suppliers are performing...'" },
        { order: 5, screen: "Suppliers", route: "/suppliers", duration_minutes: "3", transition_to_next: "Show stats, click into a supplier drawer, then navigate to supplier inbox for task management" },
        { order: 6, screen: "Inspections", route: "/inspections", duration_minutes: "3", transition_to_next: "Show kanban, switch to calendar view with map, then say 'All this data feeds into our analytics...'" },
        { order: 7, screen: "Analytics", route: "/analytics", duration_minutes: "3", transition_to_next: "Walk through risk summary, compliance health trends, and collection readiness funnel" },
        { order: 8, screen: "Ask Carlos", route: "/support-center", duration_minutes: "2", transition_to_next: "Ask Carlos about overdue TRFs to demonstrate contextual AI assistance. Close with Q&A." }
      ],
      audience_adaptations: {
        steering_committee: "Emphasise: ROI potential (consolidating 7 legacy systems), AI differentiation vs Inspectorio, DPP 2027 readiness as strategic necessity, demo wow factor for client retention. Focus on Dashboard, Scenario Simulator, and Analytics.",
        technical_team: "Emphasise: Architecture decisions (scheme-agnostic, component-based, extensible), React/TypeScript stack, data model design for DPP, AI reasoning interface design, testing pipeline with gates. Show Documentation module.",
        client_buyers: "Emphasise: Ease of use (role-adaptive dashboard), visibility into TRF status and supplier performance, time savings (AI pre-fills, automated workflows), regulatory tracking (DPP 2027 countdown). Focus on Dashboard, TRFs, Suppliers.",
        sustainability_teams: "Emphasise: Scheme-agnostic evidence graph, DPP readiness (dppPassportId on collections), certificate tracking with expiry alerts, overclaim prevention via evidence validation, recycled content verification gaps."
      }
    },

    comparison_positioning: {
      vs_inspectorio: {
        carlos_strengths: [
          "AI reasoning transparency (explainability) — Inspectorio shows scores, CARLOS explains WHY",
          "Scenario simulation for compliance readiness — no competitor has this",
          "3-tier testing pipeline with component locking — PO-centric vs lifecycle-centric",
          "Integrated care labelling and GSW workflow — not available in Inspectorio",
          "Self-approval tiers (Bronze/Silver/Gold) — granular permission model",
          "DPP-ready data model by design — Inspectorio would need re-architecture",
          "Collection readiness funnel analytics — unique pipeline visibility",
          "Test balance/credit tracking — aligned with THT's business model",
          "Embedded AI across all modules (not a separate paid product like Paramo)",
          "Scheme-agnostic sustainability architecture for multi-standard compliance"
        ],
        inspectorio_strengths: [
          "Production-ready with 2000+ brand customers",
          "Real AI models trained on millions of data points",
          "Photo-based defect detection AI (image recognition)",
          "More mature mobile app and offline inspection capability",
          "LabSync module is more developed than CARLOS lab",
          "Docuflow for document management is more comprehensive",
          "SCNI for corrective action management is more mature",
          "Real API integrations with ERP/PLM systems"
        ],
        parity: [
          "Supplier risk scoring and management",
          "Inspection scheduling and tracking",
          "Dashboard with KPIs and analytics",
          "Task management and workflow",
          "CSV/data export capabilities"
        ],
        key_differentiator: "CARLOS is purpose-built for TIC compliance with AI reasoning transparency, lifecycle-centric data model, and DPP-ready architecture — fundamentally different from Inspectorio's SaaS workflow automation approach."
      },
      vs_current_uki_nis: {
        capabilities_replaced: [
          "Manual spreadsheet-based TRF tracking",
          "Email-based supplier communication",
          "PDF report generation",
          "Disconnected care labelling process",
          "Paper-based inspection management",
          "Static supplier directory",
          "Separate systems for testing levels"
        ],
        capabilities_added: [
          "AI-prioritised task management with reasoning",
          "Real-time compliance readiness scoring",
          "Scenario simulation for regulatory planning",
          "Integrated styles → components → testing → care labelling pipeline",
          "Interactive inspection calendar with drag-drop and world map",
          "7-tab analytics with real-time data",
          "Ask Carlos AI assistant",
          "Self-approval tier management",
          "DPP 2027 readiness tracking",
          "Role-adaptive dashboard",
          "Platform tour for onboarding"
        ],
        user_experience_delta: "From a 2015-era portal with spreadsheet exports to a modern, responsive, AI-powered command center with role-adaptive interfaces, instant search, drag-drop interactions, and contextual help. Estimated 60-70% reduction in compliance management time."
      },
      vs_tht_smart: {
        capabilities_beyond_smart: [
          "AI reasoning transparency across all modules",
          "Scheme-agnostic sustainability evidence graph",
          "DPP-ready data model",
          "Scenario simulation for compliance readiness",
          "Role-adaptive dashboards with configurable widgets",
          "Integrated care labelling and GSW workflow",
          "Modern UX with framer motion animations and responsive design"
        ],
        smart_migration_relevance: "CARLOS demonstrates the next-generation capabilities that go beyond SMART's current scope. If SMART migration proceeds, CARLOS's architecture could serve as the frontend layer for THT's customer-facing compliance portal, complementing SMART's backend operational capabilities."
      }
    },

    technical_debt_and_gaps: {
      stubbed_features: [
        "Settings page (UI shell only, no actual configuration)",
        "DPP export (dppPassportId field exists but no export logic)",
        "Email notifications (notification bell is in-app only)",
        "File upload storage (GSW upload is UI only, no actual file persistence)",
        "CSV import (dialog exists but no backend processing)"
      ],
      mock_data_dependencies: [
        "All data is mock — no database or API. Full mock data in 5 data files totaling ~3000 lines",
        "AI responses are pattern-matched strings, not real LLM calls",
        "Risk scores are static/computed from mock data, not historical analysis",
        "Readiness scores are formula-based, not ML-derived"
      ],
      known_bugs: [
        "SheetContent accessibility warning (missing aria-describedby) in SupplierDetailDrawer tests"
      ],
      performance_concerns: [
        "mockData.ts at 1271 lines — could cause slow initial load if much larger",
        "No code splitting or lazy loading on routes",
        "All mock data imported eagerly"
      ],
      production_readiness_gaps: [
        "No real authentication/authorization — demo role-switching only",
        "No database — all data is mock/localStorage",
        "No API layer — no backend integration points",
        "No real AI — all rule-based/simulated",
        "No file storage — uploads are UI-only",
        "No email/push notifications",
        "No audit log beyond TRF timeline and GSW audit trail",
        "No RBAC enforcement — all routes accessible regardless of role",
        "No error boundaries or crash recovery",
        "No automated testing CI pipeline (tests exist but no CI)",
        "No internationalisation support",
        "No SSO/SAML authentication"
      ]
    },

    file_manifest: {
      total_files: 180,
      total_lines_of_code: "~25,000 (approximate)",
      key_directories: [
        { path: "src/components/", file_count: 95, purpose: "UI components organized by domain (ai, dashboard, help, inspection, layout, navigation, products, reports, suppliers, tour, trf, ui, validation)" },
        { path: "src/pages/", file_count: 23, purpose: "Route-level page components" },
        { path: "src/data/", file_count: 9, purpose: "Mock data files and knowledge base content" },
        { path: "src/types/", file_count: 5, purpose: "TypeScript type definitions (index, inspection, styles, supplier, ai-context)" },
        { path: "src/hooks/", file_count: 6, purpose: "Custom hooks (AI context, mobile detection, widget config, swipe gesture, inspection drag-drop)" },
        { path: "src/contexts/", file_count: 2, purpose: "React Context providers (UserContext, DraftsContext)" },
        { path: "src/components/ui/", file_count: 47, purpose: "shadcn/ui base components (accordion, dialog, button, etc.)" }
      ],
      largest_files: [
        "src/data/mockData.ts (~1271 lines)",
        "src/data/mockSuppliers.ts (~599 lines)",
        "src/data/stylesData.ts (~481 lines)",
        "src/data/mockInspections.ts (~424 lines)",
        "src/index.css (~370 lines)",
        "src/pages/Dashboard.tsx (estimated ~300 lines)",
        "src/pages/SuppliersEnhanced.tsx (estimated ~250 lines)",
        "src/pages/Insight.tsx (estimated ~250 lines)",
        "src/hooks/useAIContext.ts (~201 lines)",
        "src/data/mockReports.ts (~179 lines)"
      ],
      entry_points: ["src/main.tsx", "src/App.tsx", "index.html"]
    }
  }
};

// Summary stats for the UI
export function getSpecSummary() {
  const spec = canonicalFeatureSpec.canonical_feature_spec;
  const modules = spec.product_modules;
  
  const totalFeatures = modules.reduce((acc, m) => acc + m.features.length, 0);
  const implementedFeatures = modules.reduce((acc, m) => acc + m.features.filter(f => f.implementation_status === 'complete').length, 0);
  const partialFeatures = modules.reduce((acc, m) => acc + m.features.filter(f => f.implementation_status === 'partial').length, 0);
  const stubbedFeatures = modules.reduce((acc, m) => acc + m.features.filter(f => f.implementation_status === 'stubbed' || f.implementation_status === 'ui_only').length, 0);
  const plannedFeatures = modules.reduce((acc, m) => acc + m.features.filter(f => f.implementation_status === 'planned').length, 0);

  const aiCapabilities = spec.ai_capabilities.capabilities.length;
  const demoReadyModules = modules.filter(m => m.demo_readiness === 'demo_ready').length;
  const avgWowFactor = Math.round(modules.reduce((acc, m) => acc + m.demo_wow_factor, 0) / modules.length * 10) / 10;

  return {
    totalModules: modules.length,
    totalFeatures,
    implementedFeatures,
    partialFeatures,
    stubbedFeatures,
    plannedFeatures,
    aiCapabilities,
    demoReadyModules,
    avgWowFactor,
    totalScreens: spec.meta.total_screens,
    totalComponents: spec.meta.total_components,
    totalRoutes: spec.meta.total_routes,
    topWowMoments: spec.demo_highlights.top_10_wow_moments,
    moduleBreakdown: modules.map(m => ({
      name: m.module_name,
      category: m.category,
      featureCount: m.features.length,
      maturity: m.maturity,
      demoReadiness: m.demo_readiness,
      wowFactor: m.demo_wow_factor,
    })),
  };
}
