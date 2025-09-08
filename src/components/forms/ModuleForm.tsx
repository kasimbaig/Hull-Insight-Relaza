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

interface ModuleFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; active: number }) => Promise<void>;
  module?: Module | null;
  title: string;
  description: string;
  submitButtonText: string;
  isSubmitting: boolean;
}

export const ModuleForm: React.FC<ModuleFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  module,
  title,
  description,
  submitButtonText,
  isSubmitting
}) => {
  const [formData, setFormData] = useState({ name: '', active: 1 });
  const [errors, setErrors] = useState({ name: '', active: '' });

  // Reset form when dialog opens/closes or module changes
  useEffect(() => {
    if (isOpen) {
      if (module) {
        setFormData({ name: module.name, active: module.active });
      } else {
        setFormData({ name: '', active: 1 });
      }
      setErrors({ name: '', active: '' });
    }
  }, [isOpen, module]);

  const validateForm = () => {
    const newErrors = { name: '', active: '' };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Module name is required';
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
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleInputChange = (field: 'name' | 'active', value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Module Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Enter module name"
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
                  {module ? 'Updating...' : 'Creating...'}
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
