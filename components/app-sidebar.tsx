'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Wrench,
  AlertTriangle,
  Calendar,
  CheckSquare,
  FileText,
  BarChart3,
  Users,
  MapPin,
  MessageSquare,
  Bell,
  Search,
  Building2,
  Settings,
  LogOut,
  Moon,
  Sun,
  Menu,
  UserCircle2,
  Phone,
  Scale,
  Shield,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/lib/auth-context';
import { getInitials, getRoleLabel } from '@/lib/utils-extended';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
  roles?: string[];
}

const navigationItems: NavItem[] = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { title: 'Bylaws', href: '/bylaws', icon: Scale },
  { title: 'Maintenance', href: '/maintenance', icon: Wrench },
  { title: 'Violations', href: '/violations', icon: AlertTriangle, roles: ['council_member', 'property_manager'] },
  { title: 'Meetings', href: '/meetings', icon: Calendar },
  { title: 'Tasks', href: '/tasks', icon: CheckSquare, roles: ['council_member', 'property_manager'] },
  { title: 'Documents', href: '/documents', icon: FileText },
  { title: 'Polls & Voting', href: '/polls', icon: BarChart3 },
  { title: 'Amenities', href: '/amenities', icon: MapPin },
  { title: 'Community', href: '/community', icon: MessageSquare },
  { title: 'Manager Forum', href: '/manager-forum', icon: Shield, roles: ['council_member', 'property_manager'] },
  { title: 'Directory', href: '/directory', icon: Users },
  { title: 'Emergency', href: '/emergency', icon: Phone },
];

export function AppSidebar({ onClose, collapsed = false }: { onClose?: () => void; collapsed?: boolean }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const handleLogout = () => {
    logout();
    if (onClose) onClose();
  };

  const filteredNavItems = navigationItems.filter(item => {
    if (!item.roles) return true;
    return user?.role && item.roles.includes(user.role);
  });

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      {/* Header */}
      <div className={cn("p-6 border-b border-sidebar-border", collapsed && "p-3")}>
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className={cn("h-10 w-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0", collapsed && "h-12 w-12")}>
            <Building2 className={cn("h-6 w-6 text-primary-foreground", collapsed && "h-7 w-7")} />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold group-hover:text-primary transition-colors">StrataHQ</h1>
              <p className="text-xs text-muted-foreground">Harborview Towers</p>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className={cn("flex-1", collapsed ? "px-2" : "px-3")}>
        <div className="space-y-1 py-4">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                title={collapsed ? item.title : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground/70',
                  collapsed && 'justify-center px-2'
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && (
                  <>
                    <span>{item.title}</span>
                    {item.badge && (
                      <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </div>
      </ScrollArea>

      <Separator />

      {/* User Profile */}
      <div className={cn("p-4", collapsed && "p-2")}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full h-auto p-3 hover:bg-sidebar-accent",
                collapsed ? "justify-center p-2" : "justify-start"
              )}
              title={collapsed ? user?.name : undefined}
            >
              <div className={cn("flex items-center gap-3", collapsed ? "w-auto" : "w-full")}>
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-base">
                    {user ? getInitials(user.name) : 'U'}
                  </AvatarFallback>
                </Avatar>
                {!collapsed && (
                  <div className="flex-1 text-left overflow-hidden">
                    <p className="font-semibold text-base truncate">{user?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user?.role && getRoleLabel(user.role)}
                      {user?.unit && ` • Unit ${user.unit}`}
                    </p>
                  </div>
                )}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile" className="cursor-pointer">
                <UserCircle2 className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/notifications" className="cursor-pointer">
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? (
                <>
                  <Sun className="mr-2 h-4 w-4" />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon className="mr-2 h-4 w-4" />
                  Dark Mode
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
