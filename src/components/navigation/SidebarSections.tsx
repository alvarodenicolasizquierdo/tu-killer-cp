/**
 * SidebarSections - Grouped navigation with section headings
 * Used when NEW_IA_NAV_AND_HOME feature flag is enabled
 */

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
  Bell, 
  Settings,
  HelpCircle,
  BookMarked,
  LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface NavItem {
  icon: LucideIcon;
  label: string;
  path: string;
  badge?: string | null;
  adminOnly?: boolean;
}

interface SidebarSectionsProps {
  isCollapsed: boolean;
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

interface SectionProps {
  title: string;
  items: NavItem[];
  isCollapsed: boolean;
  isAdmin: boolean;
  showDivider?: boolean;
  dividerLabel?: string;
}

function SidebarSection({ title, items, isCollapsed, isAdmin, showDivider, dividerLabel }: SectionProps) {
  const location = useLocation();

  const visibleItems = items.filter(item => !item.adminOnly || isAdmin);
  
  if (visibleItems.length === 0) return null;

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

      {/* Section Items */}
      <div className="space-y-1">
        {visibleItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path === '/support-center' && location.pathname.startsWith('/support'));
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'sidebar-link group relative',
                isActive && 'active',
                item.path === '/support-center' && !isActive && 'hover:bg-gradient-to-r hover:from-ai-primary/20 hover:to-ai-secondary/20'
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 shrink-0",
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
        })}
      </div>
    </div>
  );
}

export function SidebarSections({ isCollapsed, isAdmin }: SidebarSectionsProps) {
  return (
    <div className="space-y-2">
      <SidebarSection 
        title="My Priorities" 
        items={myPrioritiesItems} 
        isCollapsed={isCollapsed}
        isAdmin={isAdmin}
      />
      
      <SidebarSection 
        title="My Operations" 
        items={myOperationsItems} 
        isCollapsed={isCollapsed}
        isAdmin={isAdmin}
      />

      <SidebarSection 
        title="Support" 
        items={supportItems} 
        isCollapsed={isCollapsed}
        isAdmin={isAdmin}
      />
      
      {isAdmin && (
        <SidebarSection 
          title="Governance" 
          items={governanceItems} 
          isCollapsed={isCollapsed}
          isAdmin={isAdmin}
          showDivider={true}
          dividerLabel="Administration"
        />
      )}
      
      {!isAdmin && (
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
