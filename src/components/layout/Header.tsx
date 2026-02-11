import { useState } from 'react';
import { Search, Bell, MessageSquare, Command } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { mockNotifications } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { useFeatureFlag } from '@/config/featureFlags';
import { useUser } from '@/contexts/UserContext';
import { AdminBadge } from '@/components/ui/AdminBadge';
import { DemoModeToggle } from '@/components/demo';
import { InternalOnly } from '@/components/demo';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const unreadCount = mockNotifications.filter(n => !n.isRead).length;
  const newNavEnabled = useFeatureFlag('NEW_IA_NAV_AND_HOME');
  const { currentUser } = useUser();
  const isAdmin = currentUser.role === 'admin';

  return (
    <header className="h-14 md:h-16 bg-background/80 backdrop-blur-lg border-b border-border/50 sticky top-0 z-40 hidden md:block">
      <div className="h-full flex items-center justify-between px-4 md:px-6">
        {/* Left - Title */}
        <div className="min-w-0 flex-1 mr-4">
          {title && (
            <h1 className="text-lg md:text-xl font-semibold text-foreground tracking-[-0.01em] truncate">{title}</h1>
          )}
          {subtitle && (
            <p className="text-xs md:text-sm text-muted-foreground truncate">{subtitle}</p>
          )}
        </div>
        
        {/* Demo Mode Toggle */}
        <div className="shrink-0 mr-2">
          <DemoModeToggle />
        </div>

        {/* Admin Badge - shown when feature flag is enabled and user is admin */}
        <InternalOnly>
          {newNavEnabled && isAdmin && (
            <div className="shrink-0 mr-2">
              <AdminBadge variant="header" />
            </div>
          )}
        </InternalOnly>

        {/* Right - Search & Actions */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          {/* AI Search - Hidden on small mobile, compact on tablet */}
          <div
            style={{ width: searchFocused ? 400 : 280, transition: 'width 0.2s ease-in-out' }}
            className="relative hidden sm:block"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Ask CARLOS anything..."
              className={cn(
                "pl-10 pr-12 h-9 md:h-10 bg-secondary/50 border-0 focus-visible:ring-1 focus-visible:ring-primary/30",
                searchFocused && "bg-background shadow-lg border border-border"
              )}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none hidden md:flex items-center gap-1 text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
              <Command className="w-3 h-3" />K
            </kbd>
          </div>

          {/* Mobile Search Button */}
          <Button variant="ghost" size="icon" className="sm:hidden min-h-[44px] min-w-[44px] touch-manipulation active:scale-95">
            <Search className="w-5 h-5" />
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative min-h-[44px] min-w-[44px] touch-manipulation active:scale-95">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-priority-critical rounded-full text-[10px] text-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 md:w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                Notifications
                <Badge variant="secondary">{unreadCount} new</Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {mockNotifications.slice(0, 4).map((notification) => (
                <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3 cursor-pointer">
                  <div className="flex items-center gap-2 w-full">
                    <span className={cn(
                      "w-2 h-2 rounded-full shrink-0",
                      notification.type === 'error' && "bg-priority-critical",
                      notification.type === 'warning' && "bg-priority-at-risk",
                      notification.type === 'success' && "bg-priority-on-track",
                      notification.type === 'info' && "bg-priority-info"
                    )} />
                    <span className={cn(
                      "text-sm font-medium flex-1 truncate",
                      !notification.isRead && "text-foreground",
                      notification.isRead && "text-muted-foreground"
                    )}>
                      {notification.title}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    {notification.message}
                  </p>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center text-sm text-primary cursor-pointer">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* AI Quick Chat */}
          <Button 
            variant="ghost" 
            size="icon"
            className="relative min-h-[44px] min-w-[44px] touch-manipulation active:scale-95 hover:bg-gradient-to-r hover:from-ai-primary/10 hover:to-ai-secondary/10"
          >
            <MessageSquare className="w-5 h-5 text-ai-primary" />
          </Button>
        </div>
      </div>
    </header>
  );
}
