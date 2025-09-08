import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { System } from '@/data/mockData';

interface SystemFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SystemFormData) => Promise<void>;
  system?: System | null;
  title: string;
  description: string;
  submitButtonText: string;
  isSubmitting: boolean;
}

interface SystemFormData {
  name: string;
  code: string;
  remark: string;
  ser: string;
  numbers: string;
  capabilities_feature: string;
  weight_volume_power_consumption: string;
  location: string;
  interface: string;
  procurement_router: string;
  vendor: string;
  cost: string;
  standards: string;
  sustenance: string;
  flag: string;
  sotr_type: string;
  sequence: number;
}

export const SystemForm: React.FC<SystemFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  system,
  title,
  description,
  submitButtonText,
  isSubmitting
}) => {
  console.log('SystemForm props:', { isOpen, system, title, isSubmitting });
  const [formData, setFormData] = useState<SystemFormData>({
    name: '',
    code: '',
    remark: '',
    ser: '',
    numbers: '',
    capabilities_feature: '',
    weight_volume_power_consumption: '',
    location: '',
    interface: '',
    procurement_router: '',
    vendor: '',
    cost: '',
    standards: '',
    sustenance: '',
    flag: '',
    sotr_type: '',
    sequence: 1
  });
  const [errors, setErrors] = useState<Partial<SystemFormData>>({});

  // Reset form when dialog opens/closes or system changes
  useEffect(() => {
    if (isOpen) {
      if (system) {
        setFormData({
          name: system.name || '',
          code: '',
          remark: system.remark || '',
          ser: system.ser || '',
          numbers: system.numbers || '',
          capabilities_feature: system.capabilities_feature || '',
          weight_volume_power_consumption: system.weight_volume_power_consumption || '',
          location: system.location || '',
          interface: system.interface || '',
          procurement_router: system.procurement_router || '',
          vendor: system.vendor || '',
          cost: system.cost || '',
          standards: system.standards || '',
          sustenance: system.sustenance || '',
          flag: system.flag || '',
          sotr_type: system.sotr_type || '',
          sequence: system.sequence || 1
        });
      } else {
        setFormData({
          name: '',
          code: '',
          remark: '',
          ser: '',
          numbers: '',
          capabilities_feature: '',
          weight_volume_power_consumption: '',
          location: '',
          interface: '',
          procurement_router: '',
          vendor: '',
          cost: '',
          standards: '',
          sustenance: '',
          flag: '',
          sotr_type: '',
          sequence: 1
        });
      }
      setErrors({});
    }
  }, [isOpen, system]);

  const validateForm = () => {
    const newErrors: Partial<SystemFormData> = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'System name is required';
      isValid = false;
    }

    if (!system && !formData.code.trim()) {
      newErrors.code = 'System code is required';
      isValid = false;
    }

    if (!formData.flag.trim()) {
      newErrors.flag = 'Flag is required';
      isValid = false;
    }

    if (!formData.sotr_type.trim()) {
      newErrors.sotr_type = 'SOTR Type is required';
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

  const handleInputChange = (field: keyof SystemFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
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
                  System Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Enter system name"
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
              
              {!system && (
                <div className="space-y-2">
                  <Label htmlFor="code" className="text-sm font-medium">
                    System Code <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="code"
                    placeholder="Enter system code"
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <Label htmlFor="numbers" className="text-sm font-medium">Numbers</Label>
                <Input
                  id="numbers"
                  placeholder="Enter numbers"
                  value={formData.numbers}
                  onChange={(e) => handleInputChange('numbers', e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sequence" className="text-sm font-medium">Sequence</Label>
                <Input
                  id="sequence"
                  type="number"
                  placeholder="Enter sequence"
                  value={formData.sequence}
                  onChange={(e) => handleInputChange('sequence', parseInt(e.target.value) || 1)}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Technical Details */}
            <div className="space-y-2">
              <Label htmlFor="capabilities_feature" className="text-sm font-medium">Capabilities & Features</Label>
              <Textarea
                id="capabilities_feature"
                placeholder="Enter capabilities and features"
                value={formData.capabilities_feature}
                onChange={(e) => handleInputChange('capabilities_feature', e.target.value)}
                disabled={isSubmitting}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight_volume_power_consumption" className="text-sm font-medium">Weight, Volume & Power Consumption</Label>
              <Textarea
                id="weight_volume_power_consumption"
                placeholder="Enter weight, volume and power consumption details"
                value={formData.weight_volume_power_consumption}
                onChange={(e) => handleInputChange('weight_volume_power_consumption', e.target.value)}
                disabled={isSubmitting}
                rows={2}
              />
            </div>

            {/* Location and Interface */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-medium">Location</Label>
                <Input
                  id="location"
                  placeholder="Enter system location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="interface" className="text-sm font-medium">Interface</Label>
                <Input
                  id="interface"
                  placeholder="Enter interface details"
                  value={formData.interface}
                  onChange={(e) => handleInputChange('interface', e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Procurement and Vendor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="procurement_router" className="text-sm font-medium">Procurement Router</Label>
                <Input
                  id="procurement_router"
                  placeholder="Enter procurement router"
                  value={formData.procurement_router}
                  onChange={(e) => handleInputChange('procurement_router', e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vendor" className="text-sm font-medium">Vendor</Label>
                <Input
                  id="vendor"
                  placeholder="Enter vendor name"
                  value={formData.vendor}
                  onChange={(e) => handleInputChange('vendor', e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Cost and Standards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cost" className="text-sm font-medium">Cost</Label>
                <Input
                  id="cost"
                  placeholder="Enter cost"
                  value={formData.cost}
                  onChange={(e) => handleInputChange('cost', e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="standards" className="text-sm font-medium">Standards</Label>
                <Input
                  id="standards"
                  placeholder="Enter applicable standards"
                  value={formData.standards}
                  onChange={(e) => handleInputChange('standards', e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Sustenance */}
            <div className="space-y-2">
              <Label htmlFor="sustenance" className="text-sm font-medium">Sustenance</Label>
              <Textarea
                id="sustenance"
                placeholder="Enter sustenance details"
                value={formData.sustenance}
                onChange={(e) => handleInputChange('sustenance', e.target.value)}
                disabled={isSubmitting}
                rows={2}
              />
            </div>

            {/* Flag and SOTR Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="flag" className="text-sm font-medium">
                  Flag <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.flag}
                  onValueChange={(value) => handleInputChange('flag', value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className={errors.flag ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select flag" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Critical">Critical</SelectItem>
                    <SelectItem value="Important">Important</SelectItem>
                    <SelectItem value="Normal">Normal</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
                {errors.flag && (
                  <p className="text-sm text-red-500">{errors.flag}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sotr_type" className="text-sm font-medium">
                  SOTR Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.sotr_type}
                  onValueChange={(value) => handleInputChange('sotr_type', value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className={errors.sotr_type ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select SOTR type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Frozen">Frozen</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Deprecated">Deprecated</SelectItem>
                    <SelectItem value="Under Review">Under Review</SelectItem>
                  </SelectContent>
                </Select>
                {errors.sotr_type && (
                  <p className="text-sm text-red-500">{errors.sotr_type}</p>
                )}
              </div>
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
                  {system ? 'Updating...' : 'Creating...'}
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
