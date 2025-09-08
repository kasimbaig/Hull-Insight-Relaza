import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { getUserRoles, getUnits, getVesselsList, getProcesses, getRoleProcessMappings } from '@/components/service/apiservice';

interface UserRole {
  id: number;
  name: string;
}

interface Unit {
  id: number;
  code: string;
  name: string;
  active: number;
  created_on: string;
  created_ip: string;
  modified_on: string;
  modified_ip: string | null;
  created_by: number | null;
  modified_by: number | null;
}

interface Vessel {
  id: number;
  classofvessel: {
    id: number;
    code: string;
    active: number;
    created_on: string;
    created_ip: string;
    modified_on: string;
    modified_ip: string | null;
    name: string;
    created_by: number;
    modified_by: number | null;
  };
  vesseltype: {
    id: number;
    code: string;
    active: number;
    created_on: string;
    created_ip: string;
    modified_on: string;
    modified_ip: string | null;
    name: string;
    created_by: number;
    modified_by: number | null;
  };
  yard: {
    id: number;
    code: string;
    active: number;
    created_on: string;
    created_ip: string;
    modified_on: string;
    modified_ip: string | null;
    name: string;
    created_by: number;
    modified_by: number | null;
  };
  command: {
    id: number;
    code: string;
    active: number;
    created_on: string;
    created_ip: string;
    modified_on: string;
    modified_ip: string | null;
    name: string;
    created_by: number;
    modified_by: number | null;
  };
  code: string;
  active: number;
  created_on: string;
  created_ip: string;
  modified_on: string;
  modified_ip: string | null;
  name: string;
  year_of_build: number;
  year_of_delivery: number;
  created_by: number;
  modified_by: number | null;
}

interface Process {
  id: number;
  code: string;
  name: string;
  description: string;
  user_roles_count: number;
  active: number;
}

interface RoleProcessMapping {
  id: number;
  user_role: number;
  process: number;
  process_name: string;
  role_name: string;
}

interface User {
  id: number;
  loginname: string;
  email: string;
  first_name: string;
  last_name: string;
  status: number;
  phone_no: string | null;
  unit: number | null;
  vessel: string | null;
  role: number | null;
  role_name: string | null;
  created_on: string;
  last_login: string | null;
  hrcdf_designation: string | null;
  rankCode: string | null;
  rankName: string | null;
  process: number | null;
  process_name: string | null;
}

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { 
    first_name: string; 
    last_name: string; 
    loginname: string; 
    email: string; 
    phone_no: string; 
    unit: number | null; 
    vessel: string; 
    status: number; 
    role: number | null;
  }) => Promise<void>;
  user?: User | null;
  title: string;
  description: string;
  submitButtonText: string;
  isSubmitting: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  user,
  title,
  description,
  submitButtonText,
  isSubmitting
}) => {
  const [formData, setFormData] = useState({ 
    first_name: '', 
    last_name: '', 
    loginname: '', 
    email: '', 
    phone_no: '', 
    unit: '', 
    vessel: '', 
    process: '',
    status: 1, 
    role: '',
    password: ''
  });
  const [errors, setErrors] = useState({ 
    first_name: '', 
    last_name: '', 
    loginname: '', 
    email: '', 
    phone_no: '', 
    unit: '', 
    vessel: '', 
    process: '',
    status: '', 
    role: '',
    password: ''
  });
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loadingUnits, setLoadingUnits] = useState(false);
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [loadingVessels, setLoadingVessels] = useState(false);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [loadingProcesses, setLoadingProcesses] = useState(false);
  const [roleProcessMappings, setRoleProcessMappings] = useState<RoleProcessMapping[]>([]);
  const [loadingRoleMappings, setLoadingRoleMappings] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Fetch user roles, units, vessels, and processes when form opens
  useEffect(() => {
    if (isOpen) {
      fetchUserRoles();
      fetchUnits();
      fetchVessels();
      fetchProcesses();
    }
  }, [isOpen]);

  // Reset form when dialog opens/closes or user changes
  useEffect(() => {
    if (isOpen) {
      if (user) {
        setFormData({ 
          first_name: user.first_name,
          last_name: user.last_name,
          loginname: user.loginname,
          email: user.email,
          phone_no: user.phone_no || '',
          unit: user.unit?.toString() || '',
          vessel: user.vessel?.toString() || '',
          process: user.process?.toString() || '',
          status: user.status,
          role: user.role?.toString() || '',
          password: '' // Don't populate password for edit
        });
        
        // If user has a process, fetch role mappings
        if (user.process) {
          fetchRoleProcessMappings(user.process);
        }
      } else {
        setFormData({ 
          first_name: '', 
          last_name: '', 
          loginname: '', 
          email: '', 
          phone_no: '', 
          unit: '', 
          vessel: '', 
          process: '',
          status: 1, 
          role: '',
          password: ''
        });
        // Clear role mappings for new user
        setRoleProcessMappings([]);
      }
      setErrors({ 
        first_name: '', 
        last_name: '', 
        loginname: '', 
        email: '', 
        phone_no: '', 
        unit: '', 
        vessel: '', 
        status: '', 
        role: '',
        password: ''
      });
    }
  }, [isOpen, user]);

  const fetchUserRoles = async () => {
    try {
      setLoadingRoles(true);
      const response = await getUserRoles();
      setUserRoles(response || []);
    } catch (error) {
      console.error('Error fetching user roles:', error);
      setUserRoles([]);
    } finally {
      setLoadingRoles(false);
    }
  };

  const fetchUnits = async () => {
    try {
      setLoadingUnits(true);
      const response = await getUnits();
      // Handle different response structures safely
      if (response && Array.isArray(response)) {
        setUnits(response);
      } else if (response && response.data && Array.isArray(response.data)) {
        setUnits(response.data);
      } else {
        console.warn('Unexpected units response structure:', response);
        setUnits([]);
      }
    } catch (error) {
      console.error('Error fetching units:', error);
      setUnits([]);
    } finally {
      setLoadingUnits(false);
    }
  };

  const fetchVessels = async () => {
    try {
      setLoadingVessels(true);
      const response = await getVesselsList();
      if (response?.data) {
        setVessels(response.data);
      }
    } catch (error) {
      console.error('Error fetching vessels:', error);
      setVessels([]);
    } finally {
      setLoadingVessels(false);
    }
  };

  const fetchProcesses = async () => {
    try {
      setLoadingProcesses(true);
      const response = await getProcesses();
      // Handle different response structures safely
      if (response && Array.isArray(response)) {
        setProcesses(response);
      } else if (response && response.data && Array.isArray(response.data)) {
        setProcesses(response.data);
      } else {
        console.warn('Unexpected processes response structure:', response);
        setProcesses([]);
      }
    } catch (error) {
      console.error('Error fetching processes:', error);
      setProcesses([]);
    } finally {
      setLoadingProcesses(false);
    }
  };

  const fetchRoleProcessMappings = async (processId: number) => {
    try {
      setLoadingRoleMappings(true);
      const response = await getRoleProcessMappings(processId);
      console.log('Role Process Mappings Response:', response);
      
      // Handle different response structures safely
      if (response && Array.isArray(response)) {
        setRoleProcessMappings(response);
      } else if (response && response.data && Array.isArray(response.data)) {
        setRoleProcessMappings(response.data);
      } else {
        console.warn('Unexpected role process mappings response structure:', response);
        setRoleProcessMappings([]);
      }
    } catch (error) {
      console.error('Error fetching role process mappings:', error);
      setRoleProcessMappings([]);
    } finally {
      setLoadingRoleMappings(false);
    }
  };

  const validateForm = () => {
    const newErrors = { 
      first_name: '', 
      last_name: '', 
      loginname: '', 
      email: '', 
      phone_no: '', 
      unit: '', 
      vessel: '', 
      status: '', 
      role: '',
      password: ''
    };
    let isValid = true;

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
      isValid = false;
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
      isValid = false;
    }

    if (!formData.loginname.trim()) {
      newErrors.loginname = 'Login name is required';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    // Password validation - required for new users (when user is null)
    if (!user && !formData.password.trim()) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (!user && formData.password.trim().length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (user) {
        // Edit mode - only send id and changed fields
        const payload: any = { id: user.id };
        
        // Check each field and only include if it has changed
        if (formData.first_name !== user.first_name) {
          payload.first_name = formData.first_name;
        }
        if (formData.last_name !== user.last_name) {
          payload.last_name = formData.last_name;
        }
        if (formData.loginname !== user.loginname) {
          payload.loginname = formData.loginname;
        }
        if (formData.email !== user.email) {
          payload.email = formData.email;
        }
        if (formData.phone_no !== (user.phone_no || '')) {
          payload.phone_no = formData.phone_no || null;
        }
        if (formData.unit !== (user.unit?.toString() || '')) {
          payload.unit = formData.unit ? parseInt(formData.unit) : null;
        }
        if (formData.vessel !== (user.vessel?.toString() || '')) {
          payload.vessel = formData.vessel ? parseInt(formData.vessel) : null;
        }
        if (formData.process !== (user.process?.toString() || '')) {
          payload.process = formData.process ? parseInt(formData.process) : null;
        }
        if (formData.status !== user.status) {
          payload.status = formData.status;
        }
        if (formData.role !== (user.role?.toString() || '')) {
          payload.user_role = formData.role ? parseInt(formData.role) : null;
        }
        
        await onSubmit(payload);
      } else {
        // Add mode - send all fields
        await onSubmit({
          first_name: formData.first_name,
          last_name: formData.last_name,
          loginname: formData.loginname,
          email: formData.email,
          phone_no: formData.phone_no || null,
          unit: formData.unit ? parseInt(formData.unit) : null,
          vessel: formData.vessel ? parseInt(formData.vessel) : null,
          process: formData.process ? parseInt(formData.process) : null,
          status: formData.status,
          user_role: formData.role ? parseInt(formData.role) : null,
          password: formData.password || null
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // If process is changed, fetch role-process mappings and reset role
    if (field === 'process' && value) {
      fetchRoleProcessMappings(Number(value));
      // Reset role when process changes
      setFormData(prev => ({ ...prev, role: '' }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name" className="text-sm font-medium">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="first_name"
                  placeholder="Enter first name"
                  value={formData.first_name}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  className={`w-full ${errors.first_name ? 'border-red-500' : ''}`}
                  autoFocus
                  disabled={isSubmitting}
                />
                {errors.first_name && (
                  <p className="text-sm text-red-500">{errors.first_name}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="last_name" className="text-sm font-medium">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="last_name"
                  placeholder="Enter last name"
                  value={formData.last_name}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                  className={`w-full ${errors.last_name ? 'border-red-500' : ''}`}
                  disabled={isSubmitting}
                />
                {errors.last_name && (
                  <p className="text-sm text-red-500">{errors.last_name}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="loginname" className="text-sm font-medium">
                Login Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="loginname"
                placeholder="Enter login name"
                value={formData.loginname}
                onChange={(e) => handleInputChange('loginname', e.target.value)}
                className={`w-full ${errors.loginname ? 'border-red-500' : ''}`}
                disabled={isSubmitting}
              />
              {errors.loginname && (
                <p className="text-sm text-red-500">{errors.loginname}</p>
              )}
            </div>

            {/* Password field - only show for new users */}
            {!user && (
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`w-full pr-10 ${errors.password ? 'border-red-500' : ''}`}
                    disabled={isSubmitting}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isSubmitting}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full ${errors.email ? 'border-red-500' : ''}`}
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone_no" className="text-sm font-medium">
                Phone Number
              </Label>
              <Input
                id="phone_no"
                placeholder="Enter phone number"
                value={formData.phone_no}
                onChange={(e) => handleInputChange('phone_no', e.target.value)}
                className={`w-full ${errors.phone_no ? 'border-red-500' : ''}`}
                disabled={isSubmitting}
              />
              {errors.phone_no && (
                <p className="text-sm text-red-500">{errors.phone_no}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="unit" className="text-sm font-medium">
                  Unit
                </Label>
                <select
                  id="unit"
                  value={formData.unit}
                  onChange={(e) => handleInputChange('unit', e.target.value)}
                  className={`w-full p-2 border border-gray-300 rounded-md ${errors.unit ? 'border-red-500' : ''}`}
                  disabled={isSubmitting || loadingUnits}
                >
                  <option value="">Select a unit</option>
                  {Array.isArray(units) && units.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.name} ({unit.code})
                    </option>
                  ))}
                </select>
                {loadingUnits && (
                  <p className="text-sm text-gray-500">Loading units...</p>
                )}
                {errors.unit && (
                  <p className="text-sm text-red-500">{errors.unit}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="vessel" className="text-sm font-medium">
                  Vessel
                </Label>
                <select
                  id="vessel"
                  value={formData.vessel}
                  onChange={(e) => handleInputChange('vessel', e.target.value)}
                  className={`w-full p-2 border border-gray-300 rounded-md ${errors.vessel ? 'border-red-500' : ''}`}
                  disabled={isSubmitting || loadingVessels}
                >
                  <option value="">Select a vessel</option>
                  {Array.isArray(vessels) && vessels.map((vessel) => (
                    <option key={vessel.id} value={vessel.id}>
                      {vessel.name}
                    </option>
                  ))}
                </select>
                {loadingVessels && (
                  <p className="text-sm text-gray-500">Loading vessels...</p>
                )}
                {errors.vessel && (
                  <p className="text-sm text-red-500">{errors.vessel}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="process" className="text-sm font-medium">
                  Process
                </Label>
                <select
                  id="process"
                  value={formData.process}
                  onChange={(e) => handleInputChange('process', e.target.value)}
                  className={`w-full p-2 border border-gray-300 rounded-md ${errors.process ? 'border-red-500' : ''}`}
                  disabled={isSubmitting || loadingProcesses}
                >
                  <option value="">Select a process</option>
                  {Array.isArray(processes) && processes.map((process) => (
                    <option key={process.id} value={process.id}>
                      {process.name}
                    </option>
                  ))}
                </select>
                {loadingProcesses && (
                  <p className="text-sm text-gray-500">Loading processes...</p>
                )}
                {errors.process && (
                  <p className="text-sm text-red-500">{errors.process}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium">
                Role
              </Label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                className={`w-full p-2 border border-gray-300 rounded-md ${errors.role ? 'border-red-500' : ''}`}
                disabled={isSubmitting || loadingRoleMappings || !formData.process}
              >
                <option value="">
                  {!formData.process 
                    ? "Select a process first" 
                    : loadingRoleMappings 
                      ? "Loading roles..." 
                      : "Select a role"
                  }
                </option>
                {roleProcessMappings.map((mapping) => (
                  <option key={mapping.user_role} value={mapping.user_role}>
                    {mapping.role_name}
                  </option>
                ))}
              </select>
              {loadingRoleMappings && (
                <p className="text-sm text-gray-500">Loading roles...</p>
              )}
              {errors.role && (
                <p className="text-sm text-red-500">{errors.role}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium">
                Status <span className="text-red-500">*</span>
              </Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => handleInputChange('status', parseInt(e.target.value))}
                className={`w-full p-2 border border-gray-300 rounded-md ${errors.status ? 'border-red-500' : ''}`}
                disabled={isSubmitting}
              >
                <option value={1}>Active</option>
                <option value={2}>Inactive</option>
              </select>
              {errors.status && (
                <p className="text-sm text-red-500">{errors.status}</p>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {user ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                submitButtonText
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
