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
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser, getRoleDisplayName } from '@/contexts/UserContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import sgsLogo from '@/assets/sgs-logo.png';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function MobileSidebar() {
  const location = useLocation();
  const { currentUser, availableUsers, setCurrentUser } = useUser();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] p-0 bg-sidebar border-sidebar-border">
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-3">
            <img src={sgsLogo} alt="SGS Logo" className="h-8 w-auto" />
            <span className="text-sidebar-foreground font-semibold text-lg">CARLOS</span>
          </Link>
          <SheetClose asChild>
            <Button variant="ghost" size="icon" className="text-sidebar-muted hover:text-sidebar-foreground">
              <X className="h-5 w-5" />
            </Button>
          </SheetClose>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto max-h-[calc(100vh-180px)]">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <SheetClose asChild key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      'sidebar-link',
                      isActive && 'active'
                    )}
                  >
                    <item.icon className="w-5 h-5 shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
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
                  </Link>
                </SheetClose>
              );
            })}
          </div>

          {/* Bottom Items */}
          <div className="mt-8 pt-4 border-t border-sidebar-border space-y-1">
            {bottomItems.map((item) => {
              const isActive = location.pathname === item.path || 
                (item.path === '/support-center' && location.pathname.startsWith('/support'));
              return (
                <SheetClose asChild key={item.path}>
                  <Link
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
                    <span className={cn(
                      item.path === '/support-center' && !isActive && 'ai-gradient-text font-medium'
                    )}>
                      {item.label}
                    </span>
                  </Link>
                </SheetClose>
              );
            })}
          </div>
        </nav>

        {/* User Section */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-sidebar-border bg-sidebar">
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full">
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent transition-colors cursor-pointer">
                <Avatar className="w-8 h-8 shrink-0">
                  <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
                  <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-sm">
                    {currentUser.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left overflow-hidden">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">
                    {currentUser.name}
                  </p>
                  <p className="text-xs text-sidebar-muted truncate">
                    {getRoleDisplayName(currentUser.role)}
                  </p>
                </div>
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
      </SheetContent>
    </Sheet>
  );
}
