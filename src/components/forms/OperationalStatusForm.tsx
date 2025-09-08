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
import { OperationalStatus } from '@/data/mockData';

interface OperationalStatusFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: OperationalStatusFormData) => Promise<void>;
  operationalStatus?: OperationalStatus | null;
  title: string;
  description: string;
  submitButtonText: string;
  isSubmitting: boolean;
}

interface OperationalStatusFormData {
  name: string;
  code: string;
}

export const OperationalStatusForm: React.FC<OperationalStatusFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  operationalStatus,
  title,
  description,
  submitButtonText,
  isSubmitting
}) => {
  console.log('OperationalStatusForm props:', { isOpen, operationalStatus, title, isSubmitting });
  const [formData, setFormData] = useState<OperationalStatusFormData>({
    name: '',
    code: ''
  });
  const [errors, setErrors] = useState<Partial<OperationalStatusFormData>>({});

  // Reset form when dialog opens/closes or operationalStatus changes
  useEffect(() => {
    if (isOpen) {
      if (operationalStatus) {
        setFormData({
          name: operationalStatus.name || '',
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
  }, [isOpen, operationalStatus]);

  const validateForm = () => {
    const newErrors: Partial<OperationalStatusFormData> = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Operational status name is required';
      isValid = false;
    }

    if (!operationalStatus && !formData.code.trim()) {
      newErrors.code = 'Operational status code is required';
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

  const handleInputChange = (field: keyof OperationalStatusFormData, value: string) => {
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
                Operational Status Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Enter operational status name"
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
            
            {!operationalStatus && (
              <div className="space-y-2">
                <Label htmlFor="code" className="text-sm font-medium">
                  Operational Status Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="code"
                  placeholder="Enter operational status code"
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
                  {operationalStatus ? 'Updating...' : 'Creating...'}
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
