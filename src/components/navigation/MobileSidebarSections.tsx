/**
 * MobileSidebarSections - Grouped navigation for mobile sidebar
 * Used when NEW_IA_NAV_AND_HOME feature flag is enabled
 */

import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Package, 
  Factory, 
  FlaskConical, 
  ClipboardCheck,
  BarChart3, 
  Bell, 
  Settings,
  HelpCircle,
  BookMarked,
  LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { SheetClose } from '@/components/ui/sheet';

interface NavItem {
  icon: LucideIcon;
  label: string;
  path: string;
  badge?: string | null;
  adminOnly?: boolean;
}

interface MobileSidebarSectionsProps {
  isAdmin: boolean;
}

// Section definitions with items grouped by category
const myPrioritiesItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/', badge: null },
  { icon: Bell, label: 'Notifications', path: '/notifications', badge: '4' },
];

const myOperationsItems: NavItem[] = [
  { icon: Package, label: 'Styles', path: '/styles', badge: '6' },
  { icon: FlaskConical, label: 'Components', path: '/components', badge: null },
  { icon: FileText, label: 'Testing Levels', path: '/testing-levels', badge: '3' },
  { icon: ClipboardCheck, label: 'Inspections', path: '/inspections', badge: '5' },
  { icon: FileText, label: 'Care Labels', path: '/care-labelling', badge: '2' },
  { icon: Factory, label: 'GSW', path: '/gsw', badge: '1' },
  { icon: FileText, label: 'TRFs', path: '/trfs', badge: '12' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics', badge: null },
];

const governanceItems: NavItem[] = [
  { icon: BookMarked, label: 'Documentation', path: '/documentation', adminOnly: true },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const supportItems: NavItem[] = [
  { icon: HelpCircle, label: 'Support Center', path: '/support-center' },
];

interface MobileSectionProps {
  title: string;
  items: NavItem[];
  isAdmin: boolean;
  showDivider?: boolean;
  dividerLabel?: string;
}

function MobileSidebarSection({ title, items, isAdmin, showDivider, dividerLabel }: MobileSectionProps) {
  const location = useLocation();

  const visibleItems = items.filter(item => !item.adminOnly || isAdmin);
  
  if (visibleItems.length === 0) return null;

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

      {/* Section Items */}
      <div className="space-y-0.5">
        {visibleItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path === '/support-center' && location.pathname.startsWith('/support'));
          
          return (
            <SheetClose asChild key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-3 min-h-[48px] rounded-lg text-sm font-medium transition-colors',
                  'active:scale-[0.98] touch-manipulation',
                  isActive 
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground' 
                    : 'text-sidebar-foreground hover:bg-sidebar-accent',
                  item.path === '/support-center' && !isActive && 'hover:bg-gradient-to-r hover:from-ai-primary/20 hover:to-ai-secondary/20'
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5 shrink-0",
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
        })}
      </div>
    </div>
  );
}

export function MobileSidebarSections({ isAdmin }: MobileSidebarSectionsProps) {
  return (
    <div className="space-y-2">
      <MobileSidebarSection 
        title="My Priorities" 
        items={myPrioritiesItems} 
        isAdmin={isAdmin}
      />
      
      <MobileSidebarSection 
        title="My Operations" 
        items={myOperationsItems} 
        isAdmin={isAdmin}
      />

      <MobileSidebarSection 
        title="Support" 
        items={supportItems} 
        isAdmin={isAdmin}
      />
      
      {isAdmin && (
        <MobileSidebarSection 
          title="Governance" 
          items={governanceItems} 
          isAdmin={isAdmin}
          showDivider={true}
          dividerLabel="Administration"
        />
      )}
      
      {!isAdmin && (
        <MobileSidebarSection 
          title="Settings" 
          items={governanceItems.filter(item => !item.adminOnly)} 
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
}
