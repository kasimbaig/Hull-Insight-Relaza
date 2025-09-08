import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { Compartment } from '@/data/mockData';

interface CompartmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CompartmentFormData) => Promise<void>;
  compartment?: Compartment | null;
  title: string;
  description: string;
  submitButtonText: string;
  isSubmitting: boolean;
}

interface CompartmentFormData {
  name: string;
  code: string;
  remark: string;
  ser: string;
  numbers: string;
  location: string;
  equipment: string;
  features: string;
  layout: string;
  special_requirements: string;
  standards: string;
}

export const CompartmentForm: React.FC<CompartmentFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  compartment,
  title,
  description,
  submitButtonText,
  isSubmitting
}) => {
  console.log('CompartmentForm props:', { isOpen, compartment, title, isSubmitting });
  const [formData, setFormData] = useState<CompartmentFormData>({
    name: '',
    code: '',
    remark: '',
    ser: '',
    numbers: '',
    location: '',
    equipment: '',
    features: '',
    layout: '',
    special_requirements: '',
    standards: ''
  });
  const [errors, setErrors] = useState<Partial<CompartmentFormData>>({});

  // Reset form when dialog opens/closes or compartment changes
  useEffect(() => {
    if (isOpen) {
      if (compartment) {
        setFormData({
          name: compartment.name || '',
          code: '',
          remark: compartment.remark || '',
          ser: compartment.ser || '',
          numbers: compartment.numbers || '',
          location: compartment.location || '',
          equipment: compartment.equipment || '',
          features: compartment.features || '',
          layout: compartment.layout || '',
          special_requirements: compartment.special_requirements || '',
          standards: compartment.standards || ''
        });
      } else {
        setFormData({
          name: '',
          code: '',
          remark: '',
          ser: '',
          numbers: '',
          location: '',
          equipment: '',
          features: '',
          layout: '',
          special_requirements: '',
          standards: ''
        });
      }
      setErrors({});
    }
  }, [isOpen, compartment]);

  const validateForm = () => {
    const newErrors: Partial<CompartmentFormData> = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Compartment name is required';
      isValid = false;
    }

    if (!compartment && !formData.code.trim()) {
      newErrors.code = 'Compartment code is required';
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

  const handleInputChange = (field: keyof CompartmentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Compartment Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Enter compartment name"
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
              
              {!compartment && (
                <div className="space-y-2">
                  <Label htmlFor="code" className="text-sm font-medium">
                    Compartment Code <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="code"
                    placeholder="Enter compartment code"
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

            {/* Identification */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ser" className="text-sm font-medium">SER Number</Label>
                <Input
                  id="ser"
                  placeholder="Enter SER number"
                  value={formData.ser}
                  onChange={(e) => handleInputChange('ser', e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="numbers" className="text-sm font-medium">Compartment Numbers</Label>
                <Input
                  id="numbers"
                  placeholder="Enter compartment numbers"
                  value={formData.numbers}
                  onChange={(e) => handleInputChange('numbers', e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Location and Layout */}
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium">Location</Label>
              <Input
                id="location"
                placeholder="Enter compartment location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="layout" className="text-sm font-medium">Layout</Label>
              <Input
                id="layout"
                placeholder="Enter layout description"
                value={formData.layout}
                onChange={(e) => handleInputChange('layout', e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            {/* Equipment and Features */}
            <div className="space-y-2">
              <Label htmlFor="equipment" className="text-sm font-medium">Equipment</Label>
              <Textarea
                id="equipment"
                placeholder="Enter equipment details"
                value={formData.equipment}
                onChange={(e) => handleInputChange('equipment', e.target.value)}
                disabled={isSubmitting}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="features" className="text-sm font-medium">Features</Label>
              <Textarea
                id="features"
                placeholder="Enter compartment features"
                value={formData.features}
                onChange={(e) => handleInputChange('features', e.target.value)}
                disabled={isSubmitting}
                rows={2}
              />
            </div>

            {/* Requirements and Standards */}
            <div className="space-y-2">
              <Label htmlFor="special_requirements" className="text-sm font-medium">Special Requirements</Label>
              <Textarea
                id="special_requirements"
                placeholder="Enter special requirements"
                value={formData.special_requirements}
                onChange={(e) => handleInputChange('special_requirements', e.target.value)}
                disabled={isSubmitting}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="standards" className="text-sm font-medium">Standards</Label>
              <Textarea
                id="standards"
                placeholder="Enter applicable standards"
                value={formData.standards}
                onChange={(e) => handleInputChange('standards', e.target.value)}
                disabled={isSubmitting}
                rows={2}
              />
            </div>

            {/* Remarks */}
            <div className="space-y-2">
              <Label htmlFor="remark" className="text-sm font-medium">Remarks</Label>
              <Textarea
                id="remark"
                placeholder="Enter additional remarks"
                value={formData.remark}
                onChange={(e) => handleInputChange('remark', e.target.value)}
                disabled={isSubmitting}
                rows={3}
              />
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
                  {compartment ? 'Updating...' : 'Creating...'}
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
