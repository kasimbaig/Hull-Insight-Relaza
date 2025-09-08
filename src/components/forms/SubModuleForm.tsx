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
import { Loader2 } from 'lucide-react';
import { getModules } from '@/components/service/apiservice';

interface Module {
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

interface SubModule {
  id: number;
  module: Module;
  code: string;
  name: string;
  active: number;
  created_on: string;
  created_ip: string;
  modified_on: string;
  modified_ip: string | null;
  created_by: number | null;
  modified_by: number | null;
  parent: number;
}

interface SubModuleFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; active: number; module: number }) => Promise<void>;
  subModule?: SubModule | null;
  title: string;
  description: string;
  submitButtonText: string;
  isSubmitting: boolean;
}

export const SubModuleForm: React.FC<SubModuleFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  subModule,
  title,
  description,
  submitButtonText,
  isSubmitting
}) => {
  const [formData, setFormData] = useState({ name: '', active: 1, module: '' });
  const [errors, setErrors] = useState({ name: '', active: '', module: '' });
  const [modules, setModules] = useState<Module[]>([]);
  const [loadingModules, setLoadingModules] = useState(false);

  // Fetch modules when form opens
  useEffect(() => {
    if (isOpen) {
      fetchModules();
    }
  }, [isOpen]);

  // Reset form when dialog opens/closes or subModule changes
  useEffect(() => {
    if (isOpen) {
      if (subModule) {
        setFormData({ 
          name: subModule.name, 
          active: subModule.active,
          module: subModule.module.id.toString()
        });
      } else {
        setFormData({ name: '', active: 1, module: '' });
      }
      setErrors({ name: '', active: '', module: '' });
    }
  }, [isOpen, subModule]);

  const fetchModules = async () => {
    try {
      setLoadingModules(true);
      const response = await getModules();
      // Handle paginated response - extract results array
      const modulesData = response?.results || response || [];
      setModules(Array.isArray(modulesData) ? modulesData : []);
    } catch (error) {
      console.error('Error fetching modules:', error);
      setModules([]);
    } finally {
      setLoadingModules(false);
    }
  };

  const validateForm = () => {
    const newErrors = { name: '', active: '', module: '' };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'SubModule name is required';
      isValid = false;
    }

    if (!formData.module) {
      newErrors.module = 'Module selection is required';
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
      await onSubmit({
        name: formData.name,
        active: formData.active,
        module: parseInt(formData.module)
      });
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleInputChange = (field: 'name' | 'active' | 'module', value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="module" className="text-sm font-medium">
                Module <span className="text-red-500">*</span>
              </Label>
              <select
                id="module"
                value={formData.module}
                onChange={(e) => handleInputChange('module', e.target.value)}
                className={`w-full p-2 border border-gray-300 rounded-md ${errors.module ? 'border-red-500' : ''}`}
                disabled={isSubmitting || loadingModules}
              >
                <option value="">Select a module</option>
                {modules.map((module) => (
                  <option key={module.id} value={module.id}>
                    {module.name}
                  </option>
                ))}
              </select>
              {loadingModules && (
                <p className="text-sm text-gray-500">Loading modules...</p>
              )}
              {errors.module && (
                <p className="text-sm text-red-500">{errors.module}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                SubModule Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Enter submodule name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full ${errors.name ? 'border-red-500' : ''}`}
                autoFocus
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="active" className="text-sm font-medium">
                Status <span className="text-red-500">*</span>
              </Label>
              <select
                id="active"
                value={formData.active}
                onChange={(e) => handleInputChange('active', parseInt(e.target.value))}
                className={`w-full p-2 border border-gray-300 rounded-md ${errors.active ? 'border-red-500' : ''}`}
                disabled={isSubmitting}
              >
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
              {errors.active && (
                <p className="text-sm text-red-500">{errors.active}</p>
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
                  {subModule ? 'Updating...' : 'Creating...'}
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
