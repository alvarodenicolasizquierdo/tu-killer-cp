# CARLOS Platform - Feature Documentation

## Overview

**CARLOS** (Customer Application for Retail Logistics and Operations System) is an AI-powered TIC (Testing, Inspection, Certification) customer portal built for SGS. This document provides a comprehensive overview of the platform's features and capabilities.

> Repository: `tu-killer-cp` (TU Killer Customer Portal)  
> Project: SMART Advanced - Killer Customer Portal

---

## Comparison Target

**Note**: The comparison was requested against `carl-portal-star` repository:
- URL: https://github.com/alvarodenicolasizquierdo/carl-portal-star
- **Status**: Repository returns 404 (Not Found)
- This indicates the repository is either **private** or **does not exist**

If you need a comparison, please:
1. Make `carl-portal-star` repository public, OR
2. Grant access to the Copilot agent

---

## Table of Contents

1. [Platform Architecture](#platform-architecture)
2. [Page Inventory](#page-inventory)
3. [Core Modules](#core-modules)
4. [AI Features](#ai-features)
5. [User Roles](#user-roles)
6. [Component Library](#component-library)
7. [Technical Stack](#technical-stack)

---

## Platform Architecture

### Context Providers
| Provider | Purpose |
|----------|---------|
| `UserProvider` | User authentication, role management, preferences |
| `DraftsProvider` | TRF draft persistence and restoration |
| `QueryClientProvider` | React Query for server state management |
| `TooltipProvider` | Global tooltip configuration |

### Global Components
- **HelpDrawer** - Contextual help system available on all pages
- **PlatformTour** - Guided onboarding tour for new users
- **Toaster** - Toast notifications (shadcn + Sonner)

---

## Page Inventory

### Dashboard & Home (3 pages)
| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/` | AI-powered command center with prioritized tasks |
| Index | `/index` | Landing/welcome page |
| Notifications | `/notifications` | Notification center (redirects to Dashboard) |

### TRF Management (2 pages)
| Page | Route | Description |
|------|-------|-------------|
| TRFs | `/trfs` | TRF listing with filters and status tracking |
| TRF Detail | `/trfs/:id` | Individual TRF view with timeline and documents |

### Style & Component Management (4 pages)
| Page | Route | Description |
|------|-------|-------------|
| Styles | `/styles` | Style/collection catalog with search |
| Style Detail | `/styles/:id` | Individual style with linked components |
| Components | `/components` | Component library management |
| Testing Levels | `/testing-levels` | Three-gate testing progression (Base → Bulk → Garment) |

### Product Management (2 pages)
| Page | Route | Description |
|------|-------|-------------|
| Products | `/products` | Product catalog with images and filtering |
| Product Detail | `/products/:id` | Individual product with specifications |

### Supplier Management (5 pages)
| Page | Route | Description |
|------|-------|-------------|
| Suppliers | `/suppliers` | Supplier directory with enhanced views |
| Suppliers Enhanced | `/suppliers` | Table/card views with advanced filtering |
| Supplier Create | `/suppliers/new` | New supplier onboarding form |
| Supplier Detail | `/suppliers/:id` | Supplier profile with specializations |
| Supplier Inbox | `/suppliers/inbox` | Document submission inbox |

### Inspection Module (5 pages)
| Page | Route | Description |
|------|-------|-------------|
| Inspections | `/inspections/calendar` | Calendar view of scheduled inspections |
| Inspections Enhanced | `/inspections` | Table/Kanban views with filters |
| Inspection Create | `/inspections/new` | Schedule new inspection |
| Inspection Detail | `/inspections/:id` | Individual inspection with findings |
| Lab | `/lab` | Lab technician view for sample processing |

### Compliance & Quality (3 pages)
| Page | Route | Description |
|------|-------|-------------|
| Care Labelling | `/care-labelling` | Care label package management |
| GSW | `/gsw` | Global Standards Workflow submission |
| Self-Approval Levels | `/approval-levels` | Approval entitlement configuration |

### Analytics & Insights (2 pages)
| Page | Route | Description |
|------|-------|-------------|
| Insight | `/analytics` | Analytics dashboard with charts |
| Analytics Legacy | `/analytics-legacy` | Previous analytics implementation |

### Support & Help (5 pages)
| Page | Route | Description |
|------|-------|-------------|
| Support Center | `/support-center` | Help center with Ask Carlos AI |
| Knowledge Hub | `/knowledge-hub` | Documentation and guides |
| Help Admin | `/help-admin` | Admin panel for help content |
| Help Support | `/help-support` | Guided resolution workflows |
| AI Assistant | `/ai-assistant` | Direct AI chat interface |

### Administration (2 pages)
| Page | Route | Description |
|------|-------|-------------|
| Settings | `/settings` | User preferences and configuration |
| Documentation | `/documentation` | As-built platform documentation (Admin only) |

---

## Core Modules

### 1. TRF (Test Request Form) Module
- **Status Workflow**: Draft → Submitted → In Progress → Pending Review → Approved/Rejected
- **Features**:
  - Draft persistence with auto-save
  - Document attachments
  - Timeline tracking
  - Test selection and configuration
  - AI-assisted form completion

### 2. Inspection Module
- **Views**: Table, Kanban, Calendar
- **Features**:
  - Multi-inspector scheduling
  - Location mapping
  - Defect logging with photos
  - Report generation
  - Status tracking

### 3. Supplier Module
- **Features**:
  - Supplier profiling
  - Specialization tracking
  - Certification management
  - Document inbox
  - Performance scoring

### 4. Testing Levels Module
- **Three-Gate System**:
  1. **Base Testing** - Initial material validation
  2. **Bulk Testing** - Production batch verification
  3. **Garment Testing** - Final product certification
- **Features**:
  - Gate progression tracking
  - Test result aggregation
  - Pass/fail visualization

### 5. Care Labelling Module
- **Features**:
  - Symbol library (ISO 3758)
  - AI-suggested care instructions
  - Multi-language label generation
  - PDF export

### 6. GSW (Global Standards Workflow)
- **Features**:
  - Standards compliance submission
  - Regulatory requirement tracking
  - Certificate management

---

## AI Features

### Ask Carlos AI
The platform integrates an AI assistant called "Carlos" that provides:

1. **Contextual Help** - Page-aware assistance
2. **Query Resolution** - Natural language queries about TRFs, tests, suppliers
3. **Smart Suggestions** - AI-powered recommendations
4. **Quick Actions** - Voice/text commands for common tasks

### AI Integration Points
| Feature | Description |
|---------|-------------|
| Dashboard Tasks | AI-prioritized task list based on risk and deadlines |
| TRF Assistance | Form completion suggestions |
| Test Analysis | Failure pattern recognition |
| Supplier Insights | Certificate expiry predictions |
| Care Labels | Fabric-based instruction suggestions |

---

## User Roles

| Role | Display Name | Access Level |
|------|--------------|--------------|
| `buyer` | Buyer / QA Manager | Full platform access |
| `supplier` | Supplier User | Limited to inbox and document submission |
| `lab_technician` | Lab Technician | Lab module and test entry |
| `manager` | Manager / Executive | Analytics and approval workflows |
| `admin` | System Admin | Full access including Documentation module |

### Self-Approval Levels
| Level | Description |
|-------|-------------|
| None | No self-approval, all requests require manager |
| Bronze | Low-value/low-risk self-approval |
| Silver | Medium-value self-approval |
| Gold | Full self-approval privileges |

---

## Component Library

### Layout Components
- `AppLayout` - Main application shell
- `Sidebar` / `MobileSidebar` - Navigation
- `Header` - Top bar with search and notifications

### Dashboard Components
- `TaskCard` - AI-prioritized task display
- `ReadinessScore` - Quality readiness indicator
- `RiskIndicator` - Risk level visualization

### Form Components
- `HelpDrawer` - Contextual help panel
- `PlatformTour` - Onboarding wizard
- `ValidationPanel` - Form validation feedback

### Data Display
- `DataTable` - Sortable, filterable tables
- `KanbanBoard` - Card-based workflow view
- `Timeline` - Event history display

### Support Components
- `AskCarlosPanel` - AI chat interface
- `GuidedResolution` - Step-by-step troubleshooting
- `EscalationPanel` - Support ticket creation

---

## Technical Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool |
| TailwindCSS | Styling |
| shadcn/ui | Component library |
| Radix UI | Accessible primitives |

### State Management
| Library | Purpose |
|---------|---------|
| React Query | Server state |
| React Context | App state |
| React Hook Form | Form state |
| Zod | Schema validation |

### Visualization
| Library | Purpose |
|---------|---------|
| Recharts | Charts and graphs |
| react-simple-maps | Geographic displays |
| @dnd-kit | Drag and drop |
| framer-motion | Animations |

### Testing
| Library | Purpose |
|---------|---------|
| Vitest | Test runner |
| Testing Library | Component testing |

---

## Folder Structure

```
src/
├── components/
│   ├── ai/              # AI-related components
│   ├── dashboard/       # Dashboard widgets
│   ├── documentation/   # As-built docs module
│   ├── help/            # Help system
│   ├── help-support/    # Support center
│   ├── inspection/      # Inspection components
│   ├── inspections/     # Enhanced inspection views
│   ├── layout/          # App layout (Sidebar, Header)
│   ├── navigation/      # Navigation components
│   ├── products/        # Product components
│   ├── reports/         # Report generation
│   ├── suppliers/       # Supplier components
│   ├── support/         # Support components
│   ├── tour/            # Platform tour
│   ├── trf/             # TRF components
│   ├── ui/              # shadcn/ui components
│   └── validation/      # Validation components
├── contexts/            # React contexts
├── data/                # Mock data and constants
├── docs/                # Documentation registry
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── pages/               # Page components
├── test/                # Test utilities
└── types/               # TypeScript types
```

---

## Comparison Summary

### vs Traditional Customer Portals

| Feature | Traditional Portal | CARLOS |
|---------|-------------------|--------|
| Task Priority | Manual | AI-powered |
| Help System | Static FAQ | Ask Carlos AI + Guided Resolution |
| Onboarding | None | Platform Tour |
| Draft Management | None | Auto-save + Restore |
| Inspection Views | Table only | Table + Kanban + Calendar |
| Testing Workflow | Linear | Three-gate system |
| Documentation | External | Built-in As-Built Docs |

### Key Differentiators

1. **AI-First Design** - Carlos AI assistant integrated throughout
2. **Role-Based Views** - UI adapts to user role and permissions
3. **Three-Gate Testing** - Structured quality progression
4. **Documentation Module** - Self-documenting platform
5. **Draft Persistence** - Never lose work in progress
6. **Platform Tour** - Guided onboarding experience

---

*Generated: 2026-02-07*  
*Platform Version: CARLOS v5 (SMART Advanced)*
