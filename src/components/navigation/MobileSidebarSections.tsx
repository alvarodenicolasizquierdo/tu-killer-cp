/**
 * MobileSidebarSections - Grouped navigation for mobile sidebar with submenus
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
import { 
  LayoutDashboard, 
  FileText, 
  Package, 
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
import { SheetClose } from '@/components/ui/sheet';
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

interface MobileSidebarSectionsProps {
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
// COMPONENT: Single nav item link (mobile)
// ============================================
interface MobileNavLinkItemProps {
  item: NavItem;
  isActive: boolean;
  isSubItem?: boolean;
}

function MobileNavLinkItem({ item, isActive, isSubItem }: MobileNavLinkItemProps) {
  return (
    <SheetClose asChild>
      <Link
        to={item.path}
        className={cn(
          'flex items-center gap-3 px-3 py-3 min-h-[48px] rounded-lg text-sm font-medium transition-colors',
          'active:scale-[0.98] touch-manipulation',
          isSubItem && 'pl-10',
          isActive 
            ? 'bg-sidebar-primary text-sidebar-primary-foreground' 
            : 'text-sidebar-foreground hover:bg-sidebar-accent',
          item.path === '/support-center' && !isActive && 'hover:bg-gradient-to-r hover:from-ai-primary/20 hover:to-ai-secondary/20'
        )}
      >
        <item.icon className={cn(
          "w-5 h-5 shrink-0",
          isSubItem && "w-4 h-4",
          item.path === '/support-center' && !isActive && 'text-ai-primary'
        )} />
        <span className={cn(
          "flex-1",
          item.path === '/support-center' && !isActive && 'ai-gradient-text font-medium'
        )}>
          {item.label}
        </span>
        {item.badge && (
          <Badge 
            variant="secondary" 
            className={cn(
              "ml-auto text-xs px-2 py-0.5",
              isActive 
                ? "bg-white/20 text-white" 
                : "bg-sidebar-accent text-sidebar-foreground"
            )}
          >
            {item.badge}
          </Badge>
        )}
      </Link>
    </SheetClose>
  );
}

// ============================================
// COMPONENT: Collapsible submenu group (mobile)
// ============================================
interface MobileCollapsibleNavGroupProps {
  group: NavGroup;
}

function MobileCollapsibleNavGroup({ group }: MobileCollapsibleNavGroupProps) {
  const location = useLocation();
  const isAnyChildActive = group.items.some(item => location.pathname === item.path);
  const [isOpen, setIsOpen] = useState(isAnyChildActive);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className={cn(
        'flex items-center gap-3 px-3 py-3 min-h-[48px] w-full rounded-lg text-sm font-medium transition-colors',
        'active:scale-[0.98] touch-manipulation',
        isAnyChildActive 
          ? 'text-sidebar-foreground font-semibold' 
          : 'text-sidebar-foreground hover:bg-sidebar-accent'
      )}>
        <group.icon className="w-5 h-5 shrink-0" />
        <span className="flex-1 text-left">{group.label}</span>
        {group.badge && (
          <Badge 
            variant="secondary" 
            className="text-xs px-2 py-0.5 bg-sidebar-accent text-sidebar-foreground"
          >
            {group.badge}
          </Badge>
        )}
        <ChevronDown className={cn(
          "w-4 h-4 transition-transform ml-1",
          isOpen && "rotate-180"
        )} />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-1 space-y-0.5">
          {group.items.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <MobileNavLinkItem
                key={item.path}
                item={item}
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
// COMPONENT: Section with heading (mobile)
// ============================================
interface MobileSectionProps {
  title: string;
  items?: NavItem[];
  group?: NavGroup;
  isAdmin: boolean;
  showDivider?: boolean;
  dividerLabel?: string;
}

function MobileSidebarSection({ title, items, group, isAdmin, showDivider, dividerLabel }: MobileSectionProps) {
  const location = useLocation();

  // Filter items by admin visibility if items are provided
  const visibleItems = items?.filter(item => !item.adminOnly || isAdmin) || [];
  
  // If we have neither items nor group, or items exist but all are hidden, return null
  if (!group && visibleItems.length === 0) return null;

  return (
    <div className="mb-4">
      {/* Section Divider for Admin */}
      {showDivider && (
        <div className="flex items-center gap-2 px-3 py-2 text-xs text-sidebar-muted">
          <span className="flex-1 h-px bg-sidebar-border" />
          <span className="uppercase tracking-wider font-medium">{dividerLabel}</span>
          <span className="flex-1 h-px bg-sidebar-border" />
        </div>
      )}
      
      {/* Section Heading */}
      {!showDivider && (
        <h3 className="px-3 py-2 text-xs font-semibold text-sidebar-muted uppercase tracking-wider">
          {title}
        </h3>
      )}

      {/* Section Items - either flat list or collapsible group */}
      <div className="space-y-0.5">
        {group ? (
          <MobileCollapsibleNavGroup group={group} />
        ) : (
          visibleItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path === '/support-center' && location.pathname.startsWith('/support'));
            
            return (
              <MobileNavLinkItem
                key={item.path}
                item={item}
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
// MAIN EXPORT: MobileSidebarSections
// ============================================
// Demo mode: allowed nav paths
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

export function MobileSidebarSections({ isAdmin }: MobileSidebarSectionsProps) {
  const { isDemoMode } = useDemoMode();

  const filteredMyWork = isDemoMode ? myWorkItems.filter(i => isDemoAllowed(i.path)) : myWorkItems;
  const filteredProducts = isDemoMode ? filterGroupForDemo(productsGroup) : productsGroup;
  const filteredTesting = isDemoMode ? filterGroupForDemo(testingGroup) : testingGroup;
  const filteredPartners = isDemoMode ? partnersItems.filter(i => isDemoAllowed(i.path)) : partnersItems;
  const filteredInsights = isDemoMode ? filterGroupForDemo(insightsGroup) : insightsGroup;
  const filteredSupport = isDemoMode ? supportItems.filter(i => isDemoAllowed(i.path)) : supportItems;

  return (
    <div className="space-y-2">
      <MobileSidebarSection title="My Work" items={filteredMyWork} isAdmin={isAdmin} />
      
      {filteredProducts && (
        <MobileSidebarSection title="Products" group={filteredProducts} isAdmin={isAdmin} />
      )}

      {filteredTesting && (
        <MobileSidebarSection title="Testing" group={filteredTesting} isAdmin={isAdmin} />
      )}

      <MobileSidebarSection title="Partners" items={filteredPartners} isAdmin={isAdmin} />

      {filteredInsights && (
        <MobileSidebarSection title="Insights" group={filteredInsights} isAdmin={isAdmin} />
      )}

      <MobileSidebarSection title="Support" items={filteredSupport} isAdmin={isAdmin} />
      
      {!isDemoMode && isAdmin && (
        <MobileSidebarSection 
          title="Governance" 
          items={governanceItems} 
          isAdmin={isAdmin}
          showDivider={true}
          dividerLabel="Administration"
        />
      )}
      
      {!isDemoMode && !isAdmin && (
        <MobileSidebarSection 
          title="Settings" 
          items={governanceItems.filter(item => !item.adminOnly)} 
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
}
