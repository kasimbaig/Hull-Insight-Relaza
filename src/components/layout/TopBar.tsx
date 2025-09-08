import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, LogOut, Settings, User, Ship, MapPin } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { logoutUser } from '@/components/service/apiservice';

const TopBar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      // Call the logout API using the service
      await logoutUser(user?.id || 1);
      // If API call is successful, proceed with logout
      logout();
    } catch (error) {
      // If there's an error, still proceed with logout (fallback)
      console.error('Logout API call error:', error);
      logout();
    }
  };

  const getBreadcrumb = () => {
    const path = location.pathname;
    const segments = path.split('/').filter(Boolean);
    
    if (segments.length === 0) return 'Dashboard';
    if (segments[0] === 'masters' && segments[1]) {
      const masterType = segments[1].replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
      return `Global Masters → ${masterType}`;
    }
    if (segments[0] === 'dockyard-plans') return 'Dockyard Plan Approval';
    if (segments[0] === 'surveys') return 'Quarterly Hull Survey';
    if (segments[0] === 'drawing') return 'Interactive Drawing';
    if (segments[0] === 'dashboards') return 'Dashboards';
    if (segments[0] === 'reports') return 'Reports';
    if (segments[0] === 'users') return 'Users & Roles';
    if (segments[0] === 'settings') return 'Settings';
    
    return path.replace('/', '').replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'bg-accent text-accent-foreground';
      case 'Approver': return 'bg-success text-success-foreground';
      case 'Reviewer': return 'bg-warning text-warning-foreground';
      case 'Initiator': return 'bg-primary text-primary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="flex h-full items-center justify-between px-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <SidebarTrigger className="hull-button-primary !px-3 !py-2" />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Ship className="w-4 h-4" />
            <span className="font-medium text-foreground">{getBreadcrumb()}</span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <Button variant="outline" size="sm" className="relative">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full text-xs text-accent-foreground flex items-center justify-center">
              3
            </span>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-3 hull-card hover:bg-muted/50 px-3 py-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start text-sm">
                  <span className="font-medium">{user?.firstName} {user?.lastName}</span>
                  <div className="flex items-center gap-2">
                    <Badge className={`text-xs px-2 py-0 ${getRoleBadgeColor(user?.role || '')}`}>
                      {user?.role}
                    </Badge>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 hull-card">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <div className="px-2 py-2">
                <div className="text-xs text-muted-foreground mb-2">Service Details</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs">{user?.unit}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Ship className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs">{user?.command}</span>
                  </div>
                </div>
              </div>

              <DropdownMenuSeparator />
              
              <DropdownMenuItem className="cursor-pointer">
                <User className="w-4 h-4 mr-2" />
                Profile Settings
              </DropdownMenuItem>
              
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="w-4 h-4 mr-2" />
                Preferences
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                className="cursor-pointer text-accent hover:text-accent-foreground hover:bg-accent/10"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default TopBar;