# Repository Comparison Report

## Comparison: sgs-new-cp vs tu-killer-cp (current)

This document compares the differences between the `sgs-new-cp` repository and the current `tu-killer-cp` repository. Both are SGS/CARLOS platform implementations.

---

## Executive Summary

| Aspect | sgs-new-cp | tu-killer-cp (current) |
|--------|------------|------------------------|
| Pages | 22 pages | 33 pages |
| Features | Core SGS functionality | Extended CARLOS platform |
| Context Providers | AISupportContext | UserContext, DraftsContext |
| Help System | FloatingHelpButton, AIHelpPanel | HelpDrawer, PlatformTour |
| Focus | Basic QA portal | Full-featured CARLOS platform |

---

## Structural Differences

### Routes & Pages

#### Pages in sgs-new-cp (not in tu-killer-cp):
- `/tests` → Tests.tsx (TRF listing)
- `/tests/new` → TRFCreate.tsx
- `/tests/:id` → TRFDetail.tsx (alternative path)
- `/styles/new` → StyleCreate.tsx
- `/components/new` → ComponentCreate.tsx
- `/inbox` → SupplierInbox.tsx (different path)
- `/risk-assessment` → RiskAssessment.tsx
- `/help` → KnowledgeHub.tsx
- `/support` → SupportCenter.tsx
- `/support-admin` → SupportAdmin.tsx
- `/users` → Users.tsx

#### Pages in tu-killer-cp (not in sgs-new-cp):
- `/` → Dashboard.tsx (vs Index.tsx)
- `/testing-levels` → TestingLevels.tsx
- `/care-labelling` → CareLabelling.tsx
- `/gsw` → GSW.tsx
- `/approval-levels` → SelfApprovalLevels.tsx
- `/trfs` → TRFs.tsx
- `/trfs/:id` → TRFDetail.tsx
- `/products` → Products.tsx
- `/products/:id` → ProductDetail.tsx
- `/suppliers/:id` → SupplierDetail.tsx
- `/suppliers/inbox` → SupplierInbox.tsx (different path)
- `/lab` → Lab.tsx
- `/inspections/new` → InspectionCreate.tsx
- `/inspections/calendar` → Inspections.tsx (calendar view)
- `/notifications` → Dashboard.tsx
- `/support-center` → SupportCenter.tsx
- `/ai-assistant` → SupportCenter.tsx
- `/documentation` → Documentation.tsx

---

### Dependencies Differences

#### In sgs-new-cp only:
```json
"@types/leaflet": "^1.9.21"
"leaflet": "^1.9.4"
"react-leaflet": "^4.2.1"
"react-markdown": "^10.1.0"
```

#### In tu-killer-cp only:
```json
"@dnd-kit/core": "^6.3.1"
"@dnd-kit/sortable": "^10.0.0"
"@dnd-kit/utilities": "^3.2.2"
"@testing-library/dom": "^10.4.1"
"react-simple-maps": "^3.0.0"
```

---

### Architecture Differences

#### Context Providers

**sgs-new-cp:**
- `AISupportProvider` - AI support context for floating help

**tu-killer-cp:**
- `UserProvider` - User role and authentication context
- `DraftsProvider` - Draft management for TRFs

#### Help System

**sgs-new-cp:**
- `FloatingHelpButton` - Floating AI help button
- `AIHelpPanel` - AI-powered help panel

**tu-killer-cp:**
- `HelpDrawer` - Contextual help drawer
- `PlatformTour` - Guided platform tour for new users

---

### Folder Structure

#### tu-killer-cp additional folders:
- `src/docs/` - Documentation registry and exporters
- `src/config/` - Configuration files

#### Common folders:
- `src/components/`
- `src/contexts/`
- `src/data/`
- `src/hooks/`
- `src/lib/`
- `src/pages/`
- `src/test/`
- `src/types/`

---

## Feature Comparison

### sgs-new-cp Features
1. **Tests/TRF Management** - Create and manage test requests
2. **Style Management** - Create and view styles
3. **Component Management** - Create and view components
4. **Supplier Management** - Supplier inbox and creation
5. **Risk Assessment** - Dedicated risk assessment page
6. **Inspections** - Inspection scheduling and details
7. **User Management** - Users page for administration
8. **AI Support** - Floating AI help system
9. **Map Integration** - Leaflet maps for supplier locations
10. **Markdown Rendering** - React Markdown support

### tu-killer-cp Features (Additional)
1. **Dashboard** - Central dashboard with AI tasks
2. **Testing Levels** - Testing level progression gates
3. **Care Labelling** - Care label package management
4. **GSW (Global Standards Workflow)** - Standards submission
5. **Self-Approval Levels** - Approval entitlement management
6. **Products** - Product catalog with images
7. **Lab** - Lab technician view
8. **Enhanced Inspections** - Table/Kanban views, calendar integration
9. **Documentation Module** - As-built documentation with export
10. **Platform Tour** - Guided onboarding for new users
11. **Drag and Drop** - DnD Kit for sortable interfaces
12. **Geographic Maps** - React Simple Maps for world view
13. **Draft Management** - Save/restore TRF drafts

---

## Route Mapping

| sgs-new-cp Route | tu-killer-cp Equivalent |
|------------------|-------------------------|
| `/` (Index) | `/` (Dashboard) |
| `/tests` | `/trfs` |
| `/tests/new` | ❌ (via modal) |
| `/tests/:id` | `/trfs/:id` |
| `/styles` | `/styles` ✓ |
| `/styles/new` | ❌ (via modal) |
| `/styles/:id` | `/styles/:id` ✓ |
| `/components` | `/components` ✓ |
| `/components/new` | ❌ (via modal) |
| `/inspections` | `/inspections` ✓ |
| `/inspections/:id` | `/inspections/:id` ✓ |
| `/inbox` | `/suppliers/inbox` |
| `/suppliers` | `/suppliers` ✓ |
| `/suppliers/new` | `/suppliers/new` ✓ |
| `/risk-assessment` | ❌ |
| `/analytics` | `/analytics` ✓ |
| `/users` | ❌ |
| `/settings` | `/settings` ✓ |
| `/help` | ❌ |
| `/support` | `/support-center` |
| `/support-admin` | ❌ |

---

## Conclusion

The `tu-killer-cp` repository is a more feature-complete implementation of the CARLOS platform with:

1. **More pages** (33 vs 22) covering additional workflows
2. **Richer context management** (User roles, drafts)
3. **Enhanced inspection module** with table/kanban views
4. **Documentation system** for as-built docs with export
5. **Platform tour** for user onboarding
6. **Product management** with image galleries
7. **Lab technician view** for SGS lab staff
8. **Care labelling and GSW** workflows

The `sgs-new-cp` repository has:
1. **Map integration** with Leaflet for geographic features
2. **User management** page
3. **Risk assessment** page
4. **Separate create pages** for styles and components
5. **AI floating help** button pattern

---

*Report generated on: 2026-02-06*
