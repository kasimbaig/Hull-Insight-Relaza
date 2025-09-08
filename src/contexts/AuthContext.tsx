import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, setAuthToken } from '@/components/service/apiservice';

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  unit: string;
  command: string;
  isActive: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (module: string, action: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data with different roles
const mockUsers: Record<string, User & { password: string }> = {
  'admin': {
    id: '1',
    username: 'admin',
    email: 'admin@hull.navy.in',
    firstName: 'System',
    lastName: 'Administrator',
    role: 'Admin',
    unit: 'Naval Headquarters',
    command: 'Western Naval Command',
    isActive: true,
    password: 'admin123'
  },
  'initiator': {
    id: '2',
    username: 'initiator',
    email: 'initiator@hull.navy.in',
    firstName: 'Plan',
    lastName: 'Initiator',
    role: 'Initiator',
    unit: 'INS Vikrant',
    command: 'Western Naval Command',
    isActive: true,
    password: 'init123'
  },
  'reviewer': {
    id: '3',
    username: 'reviewer',
    email: 'reviewer@hull.navy.in',
    firstName: 'Plan',
    lastName: 'Reviewer',
    role: 'Reviewer',
    unit: 'Naval Dockyard',
    command: 'Western Naval Command',
    isActive: true,
    password: 'review123'
  },
  'approver': {
    id: '4',
    username: 'approver',
    email: 'approver@hull.navy.in',
    firstName: 'Plan',
    lastName: 'Approver',
    role: 'Approver',
    unit: 'Fleet Command',
    command: 'Western Naval Command',
    isActive: true,
    password: 'approve123'
  }
};

// Role-based permissions
const rolePermissions: Record<string, Record<string, string[]>> = {
  'Admin': {
    'Global Masters': ['view', 'add', 'edit', 'delete'],
    'Dockyard Plan': ['view', 'add', 'edit', 'delete', 'approve'],
    'Survey': ['view', 'add', 'edit', 'delete', 'approve'],
    'Users': ['view', 'add', 'edit', 'delete'],
    'Reports': ['view', 'export'],
    'Drawing': ['view', 'add', 'edit', 'delete']
  },
  'Initiator': {
    'Global Masters': ['view'],
    'Dockyard Plan': ['view', 'add', 'edit'],
    'Survey': ['view', 'add', 'edit'],
    'Reports': ['view'],
    'Drawing': ['view', 'add', 'edit']
  },
  'Reviewer': {
    'Global Masters': ['view'],
    'Dockyard Plan': ['view', 'review'],
    'Survey': ['view', 'review'],
    'Reports': ['view'],
    'Drawing': ['view']
  },
  'Approver': {
    'Global Masters': ['view'],
    'Dockyard Plan': ['view', 'approve'],
    'Survey': ['view', 'approve'],
    'Reports': ['view', 'export'],
    'Drawing': ['view']
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for saved auth state
    const savedUser = localStorage.getItem('hull_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await loginUser({
        username: username,
        password: password
      });
      
      if (response.status === 200 && response.data) {
        // Extract user data from the API response
        // Assuming the API returns user data along with tokens
        const userData = response.data.user || {
          id: response.data.user_id || '1',
          username: username,
          email: response.data.email || `${username}@hull.navy.in`,
          firstName: response.data.first_name || 'User',
          lastName: response.data.last_name || 'Name',
          role: response.data.role || 'User',
          unit: response.data.unit || 'Naval Unit',
          command: response.data.command || 'Naval Command',
          isActive: true
        };
        
        setUser(userData);
        localStorage.setItem('hull_user', JSON.stringify(userData));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hull_user');
    localStorage.removeItem('authData');
    setAuthToken(null);
  };

  const hasPermission = (module: string, action: string): boolean => {
    if (!user) return false;
    const permissions = rolePermissions[user.role];
    return permissions?.[module]?.includes(action) || false;
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user,
      hasPermission
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};