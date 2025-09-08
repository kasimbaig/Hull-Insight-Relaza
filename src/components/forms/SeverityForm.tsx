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
import { Severity } from '@/data/mockData';

interface SeverityFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SeverityFormData) => Promise<void>;
  severity?: Severity | null;
  title: string;
  description: string;
  submitButtonText: string;
  isSubmitting: boolean;
}

interface SeverityFormData {
  name: string;
  code: string;
}

export const SeverityForm: React.FC<SeverityFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  severity,
  title,
  description,
  submitButtonText,
  isSubmitting
}) => {
  console.log('SeverityForm props:', { isOpen, severity, title, isSubmitting });
  const [formData, setFormData] = useState<SeverityFormData>({
    name: '',
    code: ''
  });
  const [errors, setErrors] = useState<Partial<SeverityFormData>>({});

  // Reset form when dialog opens/closes or severity changes
  useEffect(() => {
    if (isOpen) {
      if (severity) {
        setFormData({
          name: severity.name || '',
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
  }, [isOpen, severity]);

  const validateForm = () => {
    const newErrors: Partial<SeverityFormData> = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Severity name is required';
      isValid = false;
    }

    if (!severity && !formData.code.trim()) {
      newErrors.code = 'Severity code is required';
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

  const handleInputChange = (field: keyof SeverityFormData, value: string) => {
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
                Severity Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Enter severity name"
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
            
            {!severity && (
              <div className="space-y-2">
                <Label htmlFor="code" className="text-sm font-medium">
                  Severity Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="code"
                  placeholder="Enter severity code"
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
                  {severity ? 'Updating...' : 'Creating...'}
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
