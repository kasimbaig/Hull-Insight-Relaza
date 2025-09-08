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
import { Command } from '@/data/mockData';

interface CommandFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; code: string }) => Promise<void>;
  command?: Command | null;
  title: string;
  description: string;
  submitButtonText: string;
  isSubmitting: boolean;
}

export const CommandForm: React.FC<CommandFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  command,
  title,
  description,
  submitButtonText,
  isSubmitting
}) => {
  console.log('CommandForm props:', { isOpen, command, title, isSubmitting });
  const [formData, setFormData] = useState({ name: '', code: '' });
  const [errors, setErrors] = useState({ name: '', code: '' });

  // Reset form when dialog opens/closes or command changes
  useEffect(() => {
    if (isOpen) {
      if (command) {
        setFormData({ name: command.name, code: '' }); // Code will be fetched from API if needed
      } else {
        setFormData({ name: '', code: '' });
      }
      setErrors({ name: '', code: '' });
    }
  }, [isOpen, command]);

  const validateForm = () => {
    const newErrors = { name: '', code: '' };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Command name is required';
      isValid = false;
    }

    if (!command && !formData.code.trim()) {
      newErrors.code = 'Command code is required';
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

  const handleInputChange = (field: 'name' | 'code', value: string) => {
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
                Command Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Enter command name"
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
            
            {!command && (
              <div className="space-y-2">
                <Label htmlFor="code" className="text-sm font-medium">
                  Command Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="code"
                  placeholder="Enter command code"
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
                  {command ? 'Updating...' : 'Creating...'}
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
