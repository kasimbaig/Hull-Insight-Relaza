import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Ship,
  Users,
  FileText,
  BarChart3,
  Settings,
  Layers,
  ShieldCheck,
  MapPin,
  Activity,
  ChevronDown,
  ChevronRight,
  Database,
  Anchor,
  Compass,
  AlertTriangle,
  AlertCircle,
  Wrench,
  Building,
  Shield,
  UserCheck,
  Thermometer,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useAuth } from '@/contexts/AuthContext';

// Define the structure for menu items, including grouping
interface MenuItem {
  title: string;
  url?: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: MenuItem[];
  group?: string; // Add a group property
  permission?: { module: string; action: string };
}

// Define the master items separately as in the target code
const masterItems: MenuItem[] = [
  { title: 'Modules', url: '/masters/modules', icon: Database, permission: { module: 'Global Masters', action: 'view' } },
  { title: 'SubModules', url: '/masters/submodules', icon: Database, permission: { module: 'Global Masters', action: 'view' } },
  { title: 'Units', url: '/masters/units', icon: Shield, permission: { module: 'Global Masters', action: 'view' } },
  { title: 'Commands', url: '/masters/commands', icon: MapPin, permission: { module: 'Global Masters', action: 'view' } },
  { title: 'Dockyards', url: '/masters/dockyards', icon: Building, permission: { module: 'Global Masters', action: 'view' } },
  { title: 'Compartments', url: '/masters/compartments', icon: Layers, permission: { module: 'Global Masters', action: 'view' } },
  { title: 'Systems', url: '/masters/systems', icon: Settings, permission: { module: 'Global Masters', action: 'view' } },
  { title: 'Equipments', url: '/masters/equipments', icon: Wrench, permission: { module: 'Global Masters', action: 'view' } },
  { title: 'Vessel Types', url: '/masters/vessel-types', icon: Ship, permission: { module: 'Global Masters', action: 'view' } },
  { title: 'Class of Vessels', url: '/masters/class-of-vessels', icon: Ship, permission: { module: 'Global Masters', action: 'view' } },
  { title: 'Vessels', url: '/masters/vessels', icon: Ship, permission: { module: 'Global Masters', action: 'view' } },
  { title: 'Damage Types', url: '/masters/damage-types', icon: AlertTriangle, permission: { module: 'Global Masters', action: 'view' } },
  { title: 'Severities', url: '/masters/severities', icon: AlertCircle, permission: { module: 'Global Masters', action: 'view' } },
  { title: 'Operational Statuses', url: '/masters/operational-statuses', icon: Activity, permission: { module: 'Global Masters', action: 'view' } },
];

// Define the user items
const userItems: MenuItem[] = [
  { title: 'User Roles', url: '/users/user-roles', icon: UserCheck, permission: { module: 'Users', action: 'view' } },
  { title: 'Users Management', url: '/users/users-management', icon: Users, permission: { module: 'Users', action: 'view' } },
];

const navigationItems: MenuItem[] = [
  {
    title: 'Dashboards',
    url: '/dashboards',
    icon: BarChart3,
    group: 'Main',
    permission: { module: 'Reports', action: 'view' }
  },
  {
    title: 'Dockyard Plan Approval',
    url: '/dockyard-plan-approval',
    icon: Anchor,
    group: 'Operations',
    permission: { module: 'Dockyard Plan', action: 'view' }
  },
  {
    title: 'Quarterly Hull Survey',
    url: '/surveys',
    icon: Compass,
    group: 'Operations',
    permission: { module: 'Survey', action: 'view' }
  },
  {
    title: 'Interactive Drawing',
    url: '/drawing',
    icon: Layers,
    group: 'Operations',
    permission: { module: 'Drawing', action: 'view' }
  },
  {
    title: 'HVAC Trial',
    url: '/hvac-trials',
    icon: Thermometer,
    group: 'Operations',
    permission: { module: 'HVAC', action: 'view' }
  },
  {
    title: 'Reports',
    url: '/reports',
    icon: FileText,
    group: 'Analytics',
    permission: { module: 'Reports', action: 'view' }
  },
  // {
  //   title: 'Settings',
  //   url: '/settings',
  //   icon: Settings,
  //   group: 'Administration',
  //   permission: { module: 'Global Masters', action: 'view' }
  // },
];

// Group navigation items based on the 'group' property
const groupedItems = navigationItems.reduce((acc, item) => {
  if (!acc[item.group!]) {
    acc[item.group!] = [];
  }
  acc[item.group!].push(item);
  return acc;
}, {} as Record<string, MenuItem[]>);

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const { hasPermission } = useAuth();
  const collapsed = state === 'collapsed';

  // State to manage the open/collapsed state of the masters group
  const [mastersExpanded, setMastersExpanded] = useState(currentPath.startsWith('/masters'));
  
  // State to manage the open/collapsed state of the user group
  const [usersExpanded, setUsersExpanded] = useState(currentPath.startsWith('/users'));
  

  // Determine if a link is active, including sub-links
  const isActive = (path: string) => {
    // Special case for dashboard
    if (path === '/dashboards') {
      return currentPath === '/dashboards';
    }
    return currentPath.startsWith(path);
  };

  // Determine if the masters group is active based on the current path
  const isMasterGroupActive = () => currentPath.startsWith('/masters');
  
  // Determine if the users group is active based on the current path
  const isUserGroupActive = () => currentPath.startsWith('/users');
  

  const getNavClassName = (active: boolean) =>
    active
      ? 'bg-violet-50 text-violet-900 font-semibold border-r-4 border-violet-500 rounded-md shadow-[inset_0_0_0_1px_rgba(124,58,237,0.12)]'
      : 'text-gray-700 hover:bg-amber-50 hover:text-amber-900 hover:border-r-4 hover:border-amber-300 rounded-md transition-colors';

  // Filter menu items based on user permissions
  const filterByPermission = (items: MenuItem[]) => {
    return items.filter(item => {
      // For now, always show items to ensure sidebar is visible
      // TODO: Re-enable permission checking once authentication is working properly
      return true;
      
      // Original permission logic (commented out for debugging)
      // if (!item.permission) {
      //   return true;
      // }
      // const hasRequiredPermission = hasPermission(item.permission.module, item.permission.action);
      // console.log(`Checking permission for ${item.title}:`, {
      //   module: item.permission.module,
      //   action: item.permission.action,
      //   hasPermission: hasRequiredPermission
      // });
      // return hasRequiredPermission;
    });
  };

  const filteredMasterItems = filterByPermission(masterItems);
  const filteredUserItems = filterByPermission(userItems);
  const filteredGroupedItems = Object.fromEntries(
    Object.entries(groupedItems).map(([groupName, items]) => [
      groupName,
      filterByPermission(items)
    ])
  );

  // Debug logging
  console.log('Filtered master items:', filteredMasterItems);
  console.log('Filtered grouped items:', filteredGroupedItems);

  return (
    <Sidebar
      className="border-r border-sidebar-border shadow-soft"
      style={{
        ['--sidebar-background' as any]: '0 0% 100%',
        ['--sidebar-foreground' as any]: '222 47% 11%',
        ['--sidebar-primary' as any]: '222 47% 11%',
        ['--sidebar-primary-foreground' as any]: '0 0% 100%',
        ['--sidebar-accent' as any]: '210 40% 96%',
        ['--sidebar-accent-foreground' as any]: '222 47% 11%',
        ['--sidebar-border' as any]: '220 13% 91%',
        ['--sidebar-ring' as any]: '222 47% 11%',
      } as React.CSSProperties}
    >
      <SidebarHeader className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
            <Ship className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="text-lg font-bold text-gray-900">Hull Insight</h2>
              <p className="text-xs text-gray-500">Naval Management</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="py-4">
        {/* Main/Dashboard Group */}
        <SidebarGroup className="mb-1">
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredGroupedItems['Main']?.length > 0 ? (
                filteredGroupedItems['Main'].map(item => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="transition-smooth">
                      <NavLink
                        to={item.url!}
                        className={getNavClassName(isActive(item.url!))}
                        title={collapsed ? item.title : undefined}
                      >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        {!collapsed && <span className="ml-3">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              ) : (
                // Fallback dashboard item if no main items are available
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className="transition-smooth">
                    <NavLink
                      to="/"
                      className={getNavClassName(isActive('/'))}
                      title={collapsed ? 'Dashboard' : undefined}
                    >
                      <BarChart3 className="w-5 h-5 flex-shrink-0" />
                      {!collapsed && <span className="ml-3">Dashboard</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Users - Expandable */}
        <SidebarGroup className="mb-1">
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible open={usersExpanded} onOpenChange={setUsersExpanded}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      className={`transition-smooth ${
                        isUserGroupActive()
                          ? 'bg-violet-50 text-violet-900 font-semibold rounded-md'
                          : 'text-gray-700 hover:bg-amber-50 hover:text-amber-900 rounded-md'
                      }`}
                      title={collapsed ? 'Users' : undefined}
                    >
                      <Users className="w-5 h-5 flex-shrink-0 text-violet-700" />
                      {!collapsed && (
                        <>
                          <span className="ml-3 flex-1">Users</span>
                          {usersExpanded ? (
                            <ChevronDown className="w-4 h-4 text-violet-700" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-violet-700" />
                          )}
                        </>
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {filteredUserItems.length > 0 ? (
                        filteredUserItems.map((item) => (
                          <SidebarMenuSubItem key={item.title}>
                            <SidebarMenuSubButton asChild>
                              <NavLink
                                to={item.url!}
                                className={getNavClassName(isActive(item.url!))}
                              >
                                <item.icon className="w-4 h-4 flex-shrink-0" />
                                <span className="ml-2">{item.title}</span>
                              </NavLink>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))
                      ) : (
                        // Fallback user items if none are available
                        <>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild>
                              <NavLink
                                to="/users/user-roles"
                                className={getNavClassName(isActive('/users/user-roles'))}
                              >
                                <UserCheck className="w-4 h-4 flex-shrink-0" />
                                <span className="ml-2">User Roles</span>
                              </NavLink>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild>
                              <NavLink
                                to="/users/users-management"
                                className={getNavClassName(isActive('/users/users-management'))}
                              >
                                <Users className="w-4 h-4 flex-shrink-0" />
                                <span className="ml-2">Users Management</span>
                              </NavLink>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        </>
                      )}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Global Masters - Expandable */}
        <SidebarGroup className="mb-1">
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible open={mastersExpanded} onOpenChange={setMastersExpanded}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      className={`transition-smooth ${
                        isMasterGroupActive()
                          ? 'bg-violet-50 text-violet-900 font-semibold rounded-md'
                          : 'text-gray-700 hover:bg-amber-50 hover:text-amber-900 rounded-md'
                      }`}
                      title={collapsed ? 'Global Masters' : undefined}
                    >
                      <Database className="w-5 h-5 flex-shrink-0 text-violet-700" />
                      {!collapsed && (
                        <>
                          <span className="ml-3 flex-1">Global Masters</span>
                          {mastersExpanded ? (
                            <ChevronDown className="w-4 h-4 text-violet-700" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-violet-700" />
                          )}
                        </>
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {filteredMasterItems.length > 0 ? (
                        filteredMasterItems.map((item) => (
                          <SidebarMenuSubItem key={item.title}>
                            <SidebarMenuSubButton asChild>
                              <NavLink
                                to={item.url!}
                                className={getNavClassName(isActive(item.url!))}
                              >
                                <item.icon className="w-4 h-4 flex-shrink-0" />
                                <span className="ml-2">{item.title}</span>
                              </NavLink>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))
                      ) : (
                        // Fallback master items if none are available
                        <>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild>
                              <NavLink
                                to="/masters/units"
                                className={getNavClassName(isActive('/masters/units'))}
                              >
                                <Shield className="w-4 h-4 flex-shrink-0" />
                                <span className="ml-2">Units</span>
                              </NavLink>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild>
                              <NavLink
                                to="/masters/vessels"
                                className={getNavClassName(isActive('/masters/vessels'))}
                              >
                                <Ship className="w-4 h-4 flex-shrink-0" />
                                <span className="ml-2">Vessels</span>
                              </NavLink>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        </>
                      )}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Other Navigation Groups */}
        {Object.entries(filteredGroupedItems).map(([groupName, items]) => {
          if (groupName !== 'Main' && items.length > 0) {
            return (
              <SidebarGroup key={groupName} className="mb-1">
                <SidebarGroupContent>
                  <SidebarMenu>
                    {items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild className="transition-smooth">
                          <NavLink
                            to={item.url!}
                            className={getNavClassName(isActive(item.url!))}
                            title={collapsed ? item.title : undefined}
                          >
                            <item.icon className="w-5 h-5 flex-shrink-0" />
                            {!collapsed && <span className="ml-3">{item.title}</span>}
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            );
          }
          return null;
        })}

        {/* Fallback Navigation Items if no groups are available */}
        {Object.keys(filteredGroupedItems).length === 0 && (
          <SidebarGroup className="mb-1">
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className="transition-smooth">
                    <NavLink
                      to="/dockyard-plan-approval"
                      className={getNavClassName(isActive('/dockyard-plan-approval'))}
                      title={collapsed ? 'Dockyard Plan Approval' : undefined}
                    >
                      <Anchor className="w-5 h-5 flex-shrink-0" />
                      {!collapsed && <span className="ml-3">Dockyard Plan Approval</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className="transition-smooth">
                    <NavLink
                      to="/surveys"
                      className={getNavClassName(isActive('/surveys'))}
                      title={collapsed ? 'Quarterly Hull Survey' : undefined}
                    >
                      <Compass className="w-5 h-5 flex-shrink-0" />
                      {!collapsed && <span className="ml-3">Quarterly Hull Survey</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className="transition-smooth">
                    <NavLink
                      to="/reports"
                      className={getNavClassName(isActive('/reports'))}
                      title={collapsed ? 'Reports' : undefined}
                    >
                      <FileText className="w-5 h-5 flex-shrink-0" />
                      {!collapsed && <span className="ml-3">Reports</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}