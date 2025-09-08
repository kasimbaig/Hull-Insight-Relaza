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
import { VesselType } from '@/data/mockData';

interface VesselTypeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: { name: string; code: string }) => void;
  vesselType: VesselType | null;
  title: string;
  description: string;
  submitButtonText: string;
  isSubmitting: boolean;
}

export const VesselTypeForm: React.FC<VesselTypeFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  vesselType,
  title,
  description,
  submitButtonText,
  isSubmitting
}) => {
  const [formData, setFormData] = useState({
    name: '',
    code: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    code: ''
  });

  // Reset form when dialog opens/closes or vesselType changes
  useEffect(() => {
    if (isOpen) {
      if (vesselType) {
        setFormData({
          name: vesselType.name,
          code: (vesselType as any).code || '' // Get code from vesselType if available
        });
      } else {
        setFormData({
          name: '',
          code: ''
        });
      }
      setErrors({ name: '', code: '' });
    }
  }, [isOpen, vesselType]);

  const validateForm = () => {
    const newErrors = { name: '', code: '' };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Vessel type name is required';
      isValid = false;
    }

    if (!formData.code.trim()) {
      newErrors.code = 'Vessel type code is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Vessel Type Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter vessel type name"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="code">Vessel Type Code *</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => handleInputChange('code', e.target.value)}
              placeholder="Enter vessel type code"
              className={errors.code ? 'border-red-500' : ''}
            />
            {errors.code && (
              <p className="text-sm text-red-500">{errors.code}</p>
            )}
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
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? 'Saving...' : submitButtonText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
