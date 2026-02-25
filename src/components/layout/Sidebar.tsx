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
  Bell, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  LogOut,
  User,
  HelpCircle,
  BookMarked,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser, getRoleDisplayName } from '@/contexts/UserContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useFeatureFlag } from '@/config/featureFlags';
import { SidebarSections } from '@/components/navigation/SidebarSections';
import { AdminBadge } from '@/components/ui/AdminBadge';
import { InternalOnly } from '@/components/demo';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/', badge: null },
  { icon: Package, label: 'Styles', path: '/styles', badge: '6' },
  { icon: FlaskConical, label: 'Components', path: '/components', badge: null },
  { icon: FileText, label: 'Testing Levels', path: '/testing-levels', badge: '3' },
  { icon: ClipboardCheck, label: 'Inspections', path: '/inspections', badge: '5' },
  { icon: FileText, label: 'Care Labels', path: '/care-labelling', badge: '2' },
  { icon: Factory, label: 'GSW', path: '/gsw', badge: '1' },
  { icon: FileText, label: 'TRFs', path: '/trfs', badge: '12' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics', badge: null },
  { icon: Bell, label: 'Notifications', path: '/notifications', badge: '4' },
];

const bottomItems = [
  { icon: HelpCircle, label: 'Support Center', path: '/support-center' },
  { icon: BookMarked, label: 'Documentation', path: '/documentation', adminOnly: true },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { currentUser, availableUsers, setCurrentUser } = useUser();
  const newNavEnabled = useFeatureFlag('NEW_IA_NAV_AND_HOME');
  const isAdmin = currentUser.role === 'admin';

  return (
    <aside
      style={{ width: isCollapsed ? 72 : 260, transition: 'width 0.2s ease-in-out' }}
      className="fixed left-0 top-0 h-screen bg-sidebar flex-col z-50 hidden md:flex"
    >
      {/* Logo Section */}
      <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-3">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden"
              >
                <span className="text-sidebar-foreground font-semibold text-lg whitespace-nowrap">
                  CARLOS
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto scrollbar-thin">
        {/* Feature Flag: New IA Navigation with sections */}
        {newNavEnabled ? (
          <>
            {/* Admin Badge in sidebar when expanded — hidden in demo mode */}
            <InternalOnly>
              {isAdmin && !isCollapsed && (
                <div className="mb-4 px-1">
                  <AdminBadge variant="sidebar" />
                </div>
              )}
            </InternalOnly>
            <SidebarSections isCollapsed={isCollapsed} isAdmin={isAdmin} />
          </>
        ) : (
          <>
            {/* Original navigation - unchanged */}
            <div className="space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'sidebar-link group relative',
                      isActive && 'active'
                    )}
                  >
                    <item.icon className="w-5 h-5 shrink-0" />
                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex-1 whitespace-nowrap"
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

            {/* Bottom Section */}
            <div className="mt-8 pt-4 border-t border-sidebar-border space-y-1">
              {bottomItems.map((item) => {
                // Hide admin-only items from non-admins
                if (item.adminOnly && currentUser.role !== 'admin') return null;
                
                const isActive = location.pathname === item.path || 
                  (item.path === '/support-center' && location.pathname.startsWith('/support'));
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'sidebar-link',
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
                            "whitespace-nowrap",
                            item.path === '/support-center' && !isActive && 'ai-gradient-text font-medium'
                          )}
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </nav>

      {/* Collapse Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-sidebar border border-sidebar-border rounded-full flex items-center justify-center text-sidebar-muted hover:text-sidebar-foreground transition-colors"
      >
        {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* User Section */}
      <div className="p-3 border-t border-sidebar-border">
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full">
            <div className={cn(
              "flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent transition-colors cursor-pointer",
              isCollapsed && "justify-center"
            )}>
              <Avatar className="w-8 h-8 shrink-0">
                <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
                <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-sm">
                  {currentUser.avatar}
                </AvatarFallback>
              </Avatar>
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 text-left overflow-hidden"
                  >
                    <p className="text-sm font-medium text-sidebar-foreground truncate">
                      {currentUser.name}
                    </p>
                    <p className="text-xs text-sidebar-muted truncate">
                      {getRoleDisplayName(currentUser.role)}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>Switch Demo User</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {availableUsers.map((user) => (
              <DropdownMenuItem
                key={user.id}
                onClick={() => setCurrentUser(user)}
                className={cn(
                  "cursor-pointer",
                  currentUser.id === user.id && "bg-accent"
                )}
              >
                <Avatar className="w-6 h-6 mr-2">
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                    {user.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{getRoleDisplayName(user.role)}</p>
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-muted-foreground">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
