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

interface UserRole {
  id: number;
  code: string;
  name: string;
  description: string;
  active: number;
}

interface UserRoleFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  userRole?: UserRole | null;
  loading?: boolean;
}

export default function UserRoleForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  userRole, 
  loading = false 
}: UserRoleFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    active: 1
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Reset form when dialog opens/closes or userRole changes
  useEffect(() => {
    if (isOpen) {
      if (userRole) {
        // Edit mode - populate form with existing data
        setFormData({
          name: userRole.name || '',
          description: userRole.description || '',
          active: userRole.active || 1
        });
      } else {
        // Add mode - reset form
        setFormData({
          name: '',
          description: '',
          active: 1
        });
      }
      setErrors({});
    }
  }, [isOpen, userRole]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Role name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (userRole) {
        // Edit mode - send only changed fields
        const payload: any = { id: userRole.id };
        
        if (formData.name !== userRole.name) {
          payload.name = formData.name;
        }
        if (formData.description !== userRole.description) {
          payload.description = formData.description;
        }
        if (formData.active !== userRole.active) {
          payload.active = formData.active;
        }
        
        await onSubmit(payload);
      } else {
        // Add mode - send all fields
        await onSubmit({
          name: formData.name,
          description: formData.description,
          active: formData.active
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {userRole ? 'Edit User Role' : 'Add New User Role'}
          </DialogTitle>
          <DialogDescription>
            {userRole 
              ? 'Update the user role information.' 
              : 'Create a new user role with the following details.'
            }
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Role Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter role name"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter role description"
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="active">Status</Label>
              <select
                id="active"
                value={formData.active}
                onChange={(e) => handleInputChange('active', parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="hull-button-primary">
              {loading ? 'Saving...' : userRole ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
