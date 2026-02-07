# Repository Comparison Report

## tu-killer-cp vs sgs-new-cp

**Comparison Date:** 2026-02-07

---

## Executive Summary

| Metric | Value |
|--------|-------|
| **Total Files Changed** | 272 |
| **Lines Added (in sgs-new-cp)** | 30,814 |
| **Lines Deleted (from tu-killer-cp)** | 38,212 |
| **Files Only in tu-killer-cp** | 124 |
| **Files Only in sgs-new-cp** | 94 |
| **Files Modified** | 48 |

---

## Page Count Comparison

| Repository | Page Count |
|------------|------------|
| tu-killer-cp | 33 pages |
| sgs-new-cp | 22 pages |

---

## Route Comparison

### Routes in tu-killer-cp

| Route | Page Component |
|-------|----------------|
| `/` | Dashboard |
| `/styles` | Styles |
| `/styles/:id` | StyleDetail |
| `/components` | Components |
| `/testing-levels` | TestingLevels |
| `/care-labelling` | CareLabelling |
| `/gsw` | GSW |
| `/approval-levels` | SelfApprovalLevels |
| `/trfs` | TRFs |
| `/trfs/:id` | TRFDetail |
| `/products` | Products |
| `/products/:id` | ProductDetail |
| `/suppliers` | SuppliersEnhanced |
| `/suppliers/new` | SupplierCreate |
| `/suppliers/inbox` | SupplierInbox |
| `/suppliers/:id` | SupplierDetail |
| `/lab` | Lab |
| `/inspections` | InspectionsEnhanced |
| `/inspections/new` | InspectionCreate |
| `/inspections/calendar` | Inspections |
| `/inspections/:id` | InspectionDetail |
| `/analytics` | Insight |
| `/support-center` | SupportCenter |
| `/ai-assistant` | SupportCenter |
| `/settings` | Settings |
| `/documentation` | Documentation |

### Routes in sgs-new-cp

| Route | Page Component |
|-------|----------------|
| `/` | Index |
| `/tests` | Tests |
| `/tests/new` | TRFCreate |
| `/tests/:id` | TRFDetail |
| `/inspections` | Inspections |
| `/inspections/:id` | InspectionDetail |
| `/styles` | Styles |
| `/styles/new` | StyleCreate |
| `/styles/:id` | StyleDetail |
| `/components` | Components |
| `/components/new` | ComponentCreate |
| `/inbox` | SupplierInbox |
| `/suppliers` | Suppliers |
| `/suppliers/new` | SupplierCreate |
| `/risk-assessment` | RiskAssessment |
| `/analytics` | Insight |
| `/users` | Users |
| `/settings` | Settings |
| `/help` | KnowledgeHub |
| `/support` | SupportCenter |
| `/support-admin` | SupportAdmin |

---

## Pages Unique to Each Repository

### Pages ONLY in tu-killer-cp (11 pages)

| Page | Description |
|------|-------------|
| AIAssistant.tsx | AI Assistant interface |
| AnalyticsLegacy.tsx | Legacy analytics view |
| CareLabelling.tsx | Care labelling management |
| Dashboard.tsx | Main dashboard (home page) |
| Documentation.tsx | Documentation viewer |
| GSW.tsx | GSW management |
| HelpAdmin.tsx | Help administration |
| HelpSupport.tsx | Help & support center |
| InspectionCreate.tsx | Create new inspection |
| InspectionsEnhanced.tsx | Enhanced inspections view |
| Lab.tsx | Laboratory management |
| ProductDetail.tsx | Product detail view |
| Products.tsx | Products listing |
| SelfApprovalLevels.tsx | Self-approval levels config |
| SupplierDetail.tsx | Supplier detail view |
| SuppliersEnhanced.tsx | Enhanced suppliers view |
| TRFs.tsx | TRF listing |
| TestingLevels.tsx | Testing levels config |

### Pages ONLY in sgs-new-cp (6 pages)

| Page | Description |
|------|-------------|
| ComponentCreate.tsx | Create new component |
| RiskAssessment.tsx | Risk assessment/map view |
| StyleCreate.tsx | Create new style |
| SupportAdmin.tsx | Support administration |
| TRFCreate.tsx | Create new TRF |
| Tests.tsx | Tests listing |
| Users.tsx | User management |

---

## Component Architecture Differences

### Components ONLY in tu-killer-cp

#### AI Components
- `AIAssessmentStrip.tsx` - AI assessment display
- `AIAssistPanel.tsx` - AI assistant panel
- `AIReasoningPanel.tsx` - AI reasoning visualization
- `AITaskCard.tsx` - AI task cards
- `ReadinessGauge.tsx` - Readiness gauge component
- `ScenarioSimulator.tsx` - Scenario simulation

#### Dashboard Widgets
- `ActivityFeed.tsx` - Activity feed widget
- `ConfidenceDashboardWidget.tsx` - Confidence metrics
- `DraftResumeWidget.tsx` - Draft resume widget
- `KPICard.tsx` / `KPISummaryWidget.tsx` - KPI displays
- `LabQueueWidget.tsx` - Lab queue widget
- `RegulatoryAlerts.tsx` - Regulatory alerts
- `SortableWidgetItem.tsx` - Sortable widgets
- `SupplierDashboardWidget.tsx` - Supplier widget
- `TaskCard.tsx` - Task cards
- `WidgetCatalog.tsx` - Widget catalog

#### Documentation Components
- `AppMapTab.tsx` - Application map
- `DataModelTab.tsx` - Data model documentation
- `ExportTab.tsx` - Export functionality
- `RolesTab.tsx` - Roles documentation
- `WorkflowsTab.tsx` - Workflows documentation

#### Help/Support Components (legacy)
- `ArticlePanel.tsx` - Article display
- `AskCarlosPanel.tsx` - Carlos AI assistant
- `CategoryNav.tsx` - Category navigation
- `EscalationPanel.tsx` - Escalation handling
- `GuidedResolution.tsx` - Guided resolutions
- `IntentCard.tsx` - Intent cards
- `AIAnswerPanel.tsx` - AI answers
- `DraftsTabContent.tsx` - Drafts content
- `HelpDrawer.tsx` - Help drawer
- `InlineHelpTooltip.tsx` - Inline tooltips

#### Supplier Components
- `SupplierBulkActions.tsx` - Bulk actions
- `SupplierComplianceBadge.tsx` - Compliance badges
- `SupplierDetailDrawer.tsx` - Detail drawer
- `SupplierFilters.tsx` - Filtering
- `SupplierStats.tsx` - Statistics
- `SupplierTable.tsx` - Data table
- `SupplierTierBadge.tsx` - Tier badges
- Drawer subcomponents (Activity, AuditSchedule, etc.)

#### Tour Components
- `PlatformTour.tsx` - Platform tour
- `TourCard.tsx` - Tour cards
- `TourSpotlight.tsx` - Spotlight effect
- `tourSteps.ts` - Tour configuration

#### Other Unique Components
- `TodayNextStrip.tsx` - Today/Next strip
- `InspectionDefectsSummary.tsx` - Defects summary
- `InspectionRiskBadge.tsx` - Risk badges
- `InspectionWorkflowProgress.tsx` - Workflow progress
- `CalendarDayCell.tsx` - Calendar cells
- `DraggableInspectionDot.tsx` - Draggable dots
- `FactoryDetailsModal.tsx` - Factory modal
- `FactoryMapView.tsx` - Factory map
- `InspectionCard.tsx` - Inspection cards
- `InspectionForm.tsx` - Inspection form
- `WorldMap.tsx` - World map component
- `CSVImportDialog.tsx` - CSV import
- `ProductImageGallery.tsx` - Image gallery
- `CollectionReadinessFunnel.tsx` - Readiness funnel

### Components ONLY in sgs-new-cp

#### Risk Map Components
- `FactoryDetailPanel.tsx` - Factory details
- `FactoryMarker.tsx` - Map markers
- `LeafletMap.tsx` - Leaflet integration
- `MapStyleToggle.tsx` - Map styles
- `RiskMap.tsx` - Risk map main
- `RiskMapLegend.tsx` - Map legend
- `RiskMapStats.tsx` - Map statistics
- `WorldMapSVG.tsx` - SVG world map

#### Dashboard Components
- `MetricCard.tsx` - Metric cards
- `QualityTrendsChart.tsx` - Quality trends
- `RecentTestsTable.tsx` - Recent tests
- `StatusBadge.tsx` - Status badges
- `SupplierScorecard.tsx` - Supplier scorecard
- `TestTypeDistribution.tsx` - Test distribution
- `UpcomingSchedule.tsx` - Upcoming schedule

#### TRF Components
- `SLAIndicator.tsx` - SLA indicators
- `TRFBulkActions.tsx` - Bulk actions
- `TRFFilters.tsx` - Filtering
- `TRFKanban.tsx` - Kanban view
- `TRFPriorityBadge.tsx` - Priority badges
- `TRFStatusBadge.tsx` - Status badges
- `TRFTable.tsx` - Data table
- `TRFTestingLevelBadge.tsx` - Testing level badges

#### Support Components (new)
- `AIHelpPanel.tsx` - AI help
- `ArticleBreadcrumbs.tsx` - Breadcrumbs
- `ArticleRating.tsx` - Article ratings
- `ContextualHelpTooltip.tsx` - Contextual help
- `EscalationPanel.tsx` - Escalation
- `FloatingHelpButton.tsx` - Floating button
- `HelpDrawer.tsx` - Help drawer
- `InlineHelpStates.tsx` - Inline states
- `InstantSearchDropdown.tsx` - Instant search
- `SupportCenterAdmin.tsx` - Admin center
- `SupportCenterChat.tsx` - Chat support
- `SupportCenterKnowledge.tsx` - Knowledge base
- `SupportCenterTickets.tsx` - Tickets
- `TicketCreateWizard.tsx` - Ticket wizard
- `TicketDashboard.tsx` - Ticket dashboard
- `TicketDetailView.tsx` - Ticket details

#### Style Components
- `StyleCard.tsx` - Style cards
- `StyleStageBadge.tsx` - Stage badges
- `StyleStageProgress.tsx` - Progress display
- `StyleStatusBadge.tsx` - Status badges

#### Layout Components
- `AppSidebar.tsx` - App sidebar
- `DashboardLayout.tsx` - Dashboard layout

#### UI Components
- `kanban-card.tsx` - Kanban cards
- `status-badge.tsx` - Status badges
- `status-column-header.tsx` - Column headers
- `status-indicator.tsx` - Status indicators
- `status-workflow.tsx` - Workflow status

---

## Data & Hook Differences

### Data Files Only in tu-killer-cp
- `guidedResolutions.ts`
- `helpData.ts`
- `helpKnowledgeBase.ts`
- `inspectionDetailData.ts`
- `mockData.ts`
- `stylesData.ts`

### Data Files Only in sgs-new-cp
- `helpContent.ts`
- `mockComponents.ts`
- `mockFactories.ts`
- `mockStyles.ts`
- `mockSupportAnalytics.ts`
- `mockTRFs.ts`
- `mockTasks.ts`

### Hooks Only in tu-killer-cp
- `useAIContext.ts`
- `useInspectionDragDrop.ts`
- `useSwipeGesture.ts`
- `useWidgetConfig.ts`

### Hooks Only in sgs-new-cp
- `useAISupport.ts`

---

## Context Differences

| tu-killer-cp | sgs-new-cp |
|--------------|------------|
| `DraftsContext.tsx` | `AISupportContext.tsx` |
| `UserContext.tsx` | - |

---

## Type Definitions

| tu-killer-cp | sgs-new-cp |
|--------------|------------|
| `ai-context.ts` | `component.ts` |
| `index.ts` | `style.ts` |
| `styles.ts` | `trf.ts` |

---

## Key Architectural Differences

1. **Home Page**: tu-killer-cp uses `Dashboard.tsx`, sgs-new-cp uses `Index.tsx`

2. **Navigation**: tu-killer-cp has more complex navigation with `MobileSidebar`, `SidebarSections`; sgs-new-cp uses `AppSidebar` and `DashboardLayout`

3. **AI Integration**: tu-killer-cp has dedicated AI components (AIAssistPanel, AIReasoningPanel, AskCarlosPanel); sgs-new-cp has simpler AIHelpPanel

4. **Risk Assessment**: sgs-new-cp has dedicated Risk Map components with Leaflet integration

5. **TRF Management**: sgs-new-cp has more comprehensive TRF components (Kanban, filters, bulk actions)

6. **Support System**: Both have support centers but with different implementations
   - tu-killer-cp: HelpSupport, GuidedResolution, AskCarlos
   - sgs-new-cp: SupportCenter with tickets, chat, knowledge base

7. **Feature Flags**: tu-killer-cp has `featureFlags.ts` for feature toggling

---

## Recommendations

1. **If migrating tu-killer-cp → sgs-new-cp:**
   - Migrate AI components to new AIHelpPanel pattern
   - Adopt new Risk Map components
   - Use new TRF component architecture
   - Update navigation to AppSidebar pattern

2. **If migrating sgs-new-cp → tu-killer-cp:**
   - Add Dashboard widgets
   - Implement platform tour
   - Add product management features
   - Integrate enhanced supplier components

3. **Shared features to consider merging:**
   - Styles management (similar in both)
   - Inspection components (modified versions)
   - Settings page
   - Analytics/Insight page
