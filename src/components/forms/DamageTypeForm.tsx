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
import { DamageType } from '@/data/mockData';

interface DamageTypeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DamageTypeFormData) => Promise<void>;
  damageType?: DamageType | null;
  title: string;
  description: string;
  submitButtonText: string;
  isSubmitting: boolean;
}

interface DamageTypeFormData {
  name: string;
  code: string;
}

export const DamageTypeForm: React.FC<DamageTypeFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  damageType,
  title,
  description,
  submitButtonText,
  isSubmitting
}) => {
  console.log('DamageTypeForm props:', { isOpen, damageType, title, isSubmitting });
  const [formData, setFormData] = useState<DamageTypeFormData>({
    name: '',
    code: ''
  });
  const [errors, setErrors] = useState<Partial<DamageTypeFormData>>({});

  // Reset form when dialog opens/closes or damageType changes
  useEffect(() => {
    if (isOpen) {
      if (damageType) {
        setFormData({
          name: damageType.name || '',
          code: ''
        });
      } else {
        setFormData({
          name: '',
          code: ''
        });
      }
      setErrors({});
    }
  }, [isOpen, damageType]);

  const validateForm = () => {
    const newErrors: Partial<DamageTypeFormData> = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Damage type name is required';
      isValid = false;
    }

    if (!damageType && !formData.code.trim()) {
      newErrors.code = 'Damage type code is required';
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

  const handleInputChange = (field: keyof DamageTypeFormData, value: string) => {
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
                Damage Type Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Enter damage type name"
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
            
            {!damageType && (
              <div className="space-y-2">
                <Label htmlFor="code" className="text-sm font-medium">
                  Damage Type Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="code"
                  placeholder="Enter damage type code"
                  value={formData.code}
                  onChange={(e) => handleInputChange('code', e.target.value)}
                  className={`w-full ${errors.code ? 'border-red-500' : ''}`}
                  disabled={isSubmitting}
                />
                {errors.code && (
                  <p className="text-sm text-red-500">{errors.code}</p>
                )}
              </div>
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
              className="bg-blue-600 hover:bg-blue-700" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {damageType ? 'Updating...' : 'Creating...'}
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
