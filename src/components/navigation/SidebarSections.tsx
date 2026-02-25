/**
 * SidebarSections - Grouped navigation with section headings and submenus
 * Used when NEW_IA_NAV_AND_HOME feature flag is enabled
 * 
 * New consolidated IA structure:
 * - MY WORK: Dashboard
 * - PRODUCTS: Styles, Components, Care & Labeling (submenu)
 * - TESTING: Test Requests, Inspections, Test Coverage (submenu)
 * - PARTNERS: Suppliers
 * - INSIGHTS: Analytics, Compliance Scores (GSW)
 * - SUPPORT: Support Center
 */

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  FileText, 
  Package, 
  Factory, 
  FlaskConical, 
  ClipboardCheck,
  BarChart3, 
  Settings,
  HelpCircle,
  BookMarked,
  LucideIcon,
  ChevronDown,
  Tag,
  TestTube,
  ShieldCheck,
  Users,
  LineChart,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useDemoMode } from '@/contexts/DemoModeContext';

interface NavItem {
  icon: LucideIcon;
  label: string;
  path: string;
  badge?: string | null;
  adminOnly?: boolean;
}

interface NavGroup {
  icon: LucideIcon;
  label: string;
  items: NavItem[];
  badge?: string | null;
}

interface SidebarSectionsProps {
  isCollapsed: boolean;
  isAdmin: boolean;
}

// ============================================
// SECTION DEFINITIONS - New Consolidated IA
// ============================================

// MY WORK section
const myWorkItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/', badge: null },
];

// PRODUCTS section - submenu
const productsGroup: NavGroup = {
  icon: Package,
  label: 'Products',
  badge: '6',
  items: [
    { icon: Package, label: 'Styles', path: '/styles', badge: '6' },
    { icon: FlaskConical, label: 'Components', path: '/components', badge: null },
    { icon: Tag, label: 'Care & Labeling', path: '/care-labelling', badge: '2' },
  ],
};

// TESTING section - submenu
const testingGroup: NavGroup = {
  icon: TestTube,
  label: 'Testing & Inspections',
  badge: '12',
  items: [
    { icon: FileText, label: 'Test Requests', path: '/trfs', badge: '12' },
    { icon: ClipboardCheck, label: 'Inspections', path: '/inspections', badge: '5' },
    { icon: FileText, label: 'Test Coverage', path: '/testing-levels', badge: '3' },
  ],
};

// PARTNERS section
const partnersItems: NavItem[] = [
  { icon: Users, label: 'Suppliers', path: '/suppliers', badge: '8' },
];

// INSIGHTS section - includes GSW as submenu item
const insightsGroup: NavGroup = {
  icon: LineChart,
  label: 'Insights',
  badge: null,
  items: [
    { icon: BarChart3, label: 'Insights', path: '/analytics', badge: null },
    { icon: ShieldCheck, label: 'Compliance Scores', path: '/gsw', badge: '1' },
  ],
};

// SUPPORT section
const supportItems: NavItem[] = [
  { icon: HelpCircle, label: 'Support Center', path: '/support-center' },
];

// GOVERNANCE section (admin only)
const governanceItems: NavItem[] = [
  { icon: BookMarked, label: 'Documentation', path: '/documentation', adminOnly: true },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

// ============================================
// COMPONENT: Single nav item link
// ============================================
interface NavLinkItemProps {
  item: NavItem;
  isCollapsed: boolean;
  isActive: boolean;
  isSubItem?: boolean;
}

function NavLinkItem({ item, isCollapsed, isActive, isSubItem }: NavLinkItemProps) {
  return (
    <Link
      to={item.path}
      className={cn(
        'sidebar-link group relative',
        isActive && 'active',
        isSubItem && 'pl-9',
        item.path === '/support-center' && !isActive && 'hover:bg-gradient-to-r hover:from-ai-primary/20 hover:to-ai-secondary/20'
      )}
    >
      <item.icon className={cn(
        "w-5 h-5 shrink-0",
        isSubItem && "w-4 h-4",
        item.path === '/support-center' && !isActive && 'text-ai-primary'
      )} />
      <AnimatePresence>
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              "flex-1 whitespace-nowrap",
              item.path === '/support-center' && !isActive && 'ai-gradient-text font-medium'
            )}
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
      {item.badge && !isCollapsed && (
        <Badge 
          variant="secondary" 
          className={cn(
            "ml-auto text-xs",
            isActive 
              ? "bg-white/20 text-white" 
              : "bg-sidebar-accent text-sidebar-foreground"
          )}
        >
          {item.badge}
        </Badge>
      )}
      {item.badge && isCollapsed && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-priority-critical rounded-full text-[10px] text-white flex items-center justify-center">
          {item.badge}
        </span>
      )}
    </Link>
  );
}

// ============================================
// COMPONENT: Collapsible submenu group
// ============================================
interface CollapsibleNavGroupProps {
  group: NavGroup;
  isCollapsed: boolean;
}

function CollapsibleNavGroup({ group, isCollapsed }: CollapsibleNavGroupProps) {
  const location = useLocation();
  const isAnyChildActive = group.items.some(item => location.pathname === item.path);
  const [isOpen, setIsOpen] = useState(isAnyChildActive);

  // When collapsed, show as a single link that expands
  if (isCollapsed) {
    return (
      <div className="relative">
        <Link
          to={group.items[0].path}
          className={cn(
            'sidebar-link group',
            isAnyChildActive && 'active'
          )}
        >
          <group.icon className="w-5 h-5 shrink-0" />
        </Link>
        {group.badge && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-priority-critical rounded-full text-[10px] text-white flex items-center justify-center">
            {group.badge}
          </span>
        )}
      </div>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className={cn(
        'sidebar-link group w-full justify-between',
        isAnyChildActive && 'text-sidebar-foreground font-medium'
      )}>
        <div className="flex items-center gap-3">
          <group.icon className="w-5 h-5 shrink-0" />
          <span className="whitespace-nowrap">{group.label}</span>
        </div>
        <ChevronDown className={cn(
          "w-4 h-4 transition-transform",
          isOpen && "rotate-180"
        )} />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-1 space-y-0.5">
          {group.items.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLinkItem
                key={item.path}
                item={item}
                isCollapsed={false}
                isActive={isActive}
                isSubItem
              />
            );
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

// ============================================
// COMPONENT: Section with heading
// ============================================
interface SectionProps {
  title: string;
  items?: NavItem[];
  group?: NavGroup;
  isCollapsed: boolean;
  isAdmin: boolean;
  showDivider?: boolean;
  dividerLabel?: string;
}

function SidebarSection({ title, items, group, isCollapsed, isAdmin, showDivider, dividerLabel }: SectionProps) {
  const location = useLocation();

  // Filter items by admin visibility if items are provided
  const visibleItems = items?.filter(item => !item.adminOnly || isAdmin) || [];
  
  // If we have neither items nor group, or items exist but all are hidden, return null
  if (!group && visibleItems.length === 0) return null;

  return (
    <div className="mb-4">
      {/* Section Divider for Admin */}
      {showDivider && !isCollapsed && (
        <div className="flex items-center gap-2 px-3 py-2 text-xs text-sidebar-muted">
          <span className="flex-1 h-px bg-sidebar-border" />
          <span className="uppercase tracking-wider font-medium">{dividerLabel}</span>
          <span className="flex-1 h-px bg-sidebar-border" />
        </div>
      )}
      
      {/* Section Heading */}
      <AnimatePresence>
        {!isCollapsed && !showDivider && (
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-3 py-2 text-xs font-semibold text-sidebar-muted uppercase tracking-wider"
          >
            {title}
          </motion.h3>
        )}
      </AnimatePresence>

      {/* Section Items - either flat list or collapsible group */}
      <div className="space-y-1">
        {group ? (
          <CollapsibleNavGroup group={group} isCollapsed={isCollapsed} />
        ) : (
          visibleItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path === '/support-center' && location.pathname.startsWith('/support'));
            
            return (
              <NavLinkItem
                key={item.path}
                item={item}
                isCollapsed={isCollapsed}
                isActive={isActive}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

// ============================================
// MAIN EXPORT: SidebarSections
// ============================================
// Demo mode: allowed nav paths (product screens only)
const DEMO_ALLOWED_PATHS = [
  '/',
  '/styles',
  '/components',
  '/care-labelling',
  '/trfs',
  '/suppliers',
  '/inspections',
  '/testing-levels',
  '/gsw',
  '/analytics',
  '/support-center',
  '/products',
];

function isDemoAllowed(path: string): boolean {
  return DEMO_ALLOWED_PATHS.some(r => path === r || path.startsWith(r + '/'));
}

function filterGroupForDemo(group: NavGroup): NavGroup | null {
  const filtered = group.items.filter(item => isDemoAllowed(item.path));
  if (filtered.length === 0) return null;
  return { ...group, items: filtered };
}

export function SidebarSections({ isCollapsed, isAdmin }: SidebarSectionsProps) {
  const { isDemoMode } = useDemoMode();

  // In demo mode, filter out non-product nav items
  const filteredMyWork = isDemoMode ? myWorkItems.filter(i => isDemoAllowed(i.path)) : myWorkItems;
  const filteredProducts = isDemoMode ? filterGroupForDemo(productsGroup) : productsGroup;
  const filteredTesting = isDemoMode ? filterGroupForDemo(testingGroup) : testingGroup;
  const filteredPartners = isDemoMode ? partnersItems.filter(i => isDemoAllowed(i.path)) : partnersItems;
  const filteredInsights = isDemoMode ? filterGroupForDemo(insightsGroup) : insightsGroup;
  const filteredSupport = isDemoMode ? supportItems.filter(i => isDemoAllowed(i.path)) : supportItems;

  return (
    <div className="space-y-2">
      {/* MY WORK */}
      <SidebarSection 
        title="My Work" 
        items={filteredMyWork} 
        isCollapsed={isCollapsed}
        isAdmin={isAdmin}
      />
      
      {/* PRODUCTS - Submenu */}
      {filteredProducts && (
        <SidebarSection 
          title="Products" 
          group={filteredProducts}
          isCollapsed={isCollapsed}
          isAdmin={isAdmin}
        />
      )}

      {/* TESTING - Submenu */}
      {filteredTesting && (
        <SidebarSection 
          title="Testing" 
          group={filteredTesting}
          isCollapsed={isCollapsed}
          isAdmin={isAdmin}
        />
      )}

      {/* PARTNERS */}
      <SidebarSection 
        title="Partners" 
        items={filteredPartners} 
        isCollapsed={isCollapsed}
        isAdmin={isAdmin}
      />

      {/* INSIGHTS - Submenu with GSW */}
      {filteredInsights && (
        <SidebarSection 
          title="Insights" 
          group={filteredInsights}
          isCollapsed={isCollapsed}
          isAdmin={isAdmin}
        />
      )}

      {/* SUPPORT */}
      <SidebarSection 
        title="Support" 
        items={filteredSupport} 
        isCollapsed={isCollapsed}
        isAdmin={isAdmin}
      />
      
      {/* GOVERNANCE - Admin only, hidden in demo mode */}
      {!isDemoMode && isAdmin && (
        <SidebarSection 
          title="Governance" 
          items={governanceItems} 
          isCollapsed={isCollapsed}
          isAdmin={isAdmin}
          showDivider={true}
          dividerLabel="Administration"
        />
      )}
      
      {/* Settings for non-admin users, hidden in demo mode */}
      {!isDemoMode && !isAdmin && (
        <SidebarSection 
          title="Settings" 
          items={governanceItems.filter(item => !item.adminOnly)} 
          isCollapsed={isCollapsed}
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
}
