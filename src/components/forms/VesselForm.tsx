import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { VesselAPIResponse, DockyardAPIResponse, VesselTypeAPIResponseSimple, ClassOfVesselAPIResponseSimple } from '@/data/mockData';
import { getDockyards, getVesselTypesList, getClassOfVesselsList, getCommands } from '@/components/service/apiservice';

interface VesselFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: VesselFormData) => Promise<void>;
  vessel?: VesselAPIResponse | null;
  title: string;
  description: string;
  submitButtonText: string;
  isSubmitting: boolean;
}

interface VesselFormData {
  name: string;
  code: string;
  year_of_build: string;
  year_of_delivery: string;
  vesseltype: string;
  classofvessel: string;
  yard: string;
  command: string;
}

export const VesselForm: React.FC<VesselFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  vessel,
  title,
  description,
  submitButtonText,
  isSubmitting,
}) => {
  const [formData, setFormData] = useState<VesselFormData>({
    name: '',
    code: '',
    year_of_build: '',
    year_of_delivery: '',
    vesseltype: '',
    classofvessel: '',
    yard: '',
    command: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    code: '',
    year_of_build: '',
    year_of_delivery: '',
    vesseltype: '',
    classofvessel: '',
    yard: '',
    command: '',
  });

  // Dropdown data
  const [dockyards, setDockyards] = useState<DockyardAPIResponse[]>([]);
  const [vesselTypes, setVesselTypes] = useState<VesselTypeAPIResponseSimple[]>([]);
  const [classOfVessels, setClassOfVessels] = useState<ClassOfVesselAPIResponseSimple[]>([]);
  const [commands, setCommands] = useState<any[]>([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(false);

  // Load dropdown data
  useEffect(() => {
    const loadDropdownData = async () => {
      if (isOpen) {
        setLoadingDropdowns(true);
        try {
          const [dockyardsRes, vesselTypesRes, classOfVesselsRes, commandsRes] = await Promise.all([
            getDockyards(),
            getVesselTypesList(),
            getClassOfVesselsList(),
            getCommands()
          ]);

          if (dockyardsRes?.data) {
            setDockyards(dockyardsRes.data);
          }
          if (vesselTypesRes?.data) {
            setVesselTypes(vesselTypesRes.data);
          }
          if (classOfVesselsRes?.data) {
            setClassOfVessels(classOfVesselsRes.data);
          }
          if (commandsRes?.data) {
            setCommands(commandsRes.data);
          }
        } catch (error) {
          console.error('Error loading dropdown data:', error);
        } finally {
          setLoadingDropdowns(false);
        }
      }
    };

    loadDropdownData();
  }, [isOpen]);

  // Reset form when dialog opens/closes or vessel changes
  useEffect(() => {
    if (isOpen) {
      if (vessel) {
        console.log('Setting form data for vessel:', vessel);
        console.log('Vessel type ID:', vessel.vesseltype?.id);
        console.log('Class of vessel ID:', vessel.classofvessel?.id);
        console.log('Yard ID:', vessel.yard?.id);
        console.log('Command ID:', vessel.command?.id);
        
        setFormData({
          name: vessel.name,
          code: vessel.code,
          year_of_build: vessel.year_of_build.toString(),
          year_of_delivery: vessel.year_of_delivery.toString(),
          vesseltype: vessel.vesseltype?.id?.toString() || '',
          classofvessel: vessel.classofvessel?.id?.toString() || '',
          yard: vessel.yard?.id?.toString() || '',
          command: vessel.command?.id?.toString() || '',
        });
      } else {
        setFormData({
          name: '',
          code: '',
          year_of_build: '',
          year_of_delivery: '',
          vesseltype: '',
          classofvessel: '',
          yard: '',
          command: '',
        });
      }
      setErrors({ 
        name: '', 
        code: '', 
        year_of_build: '', 
        year_of_delivery: '', 
        vesseltype: '', 
        classofvessel: '', 
        yard: '', 
        command: '' 
      });
    }
  }, [isOpen, vessel]);

  // Set form data when dropdown data is loaded and vessel is available
  useEffect(() => {
    if (isOpen && vessel && !loadingDropdowns && vesselTypes.length > 0 && classOfVessels.length > 0 && dockyards.length > 0 && commands.length > 0) {
      console.log('Dropdown data loaded, setting form data again');
      console.log('Available vessel types:', vesselTypes.length);
      console.log('Available class of vessels:', classOfVessels.length);
      console.log('Available dockyards:', dockyards.length);
      console.log('Available commands:', commands.length);
      
      const newFormData = {
        name: vessel.name,
        code: vessel.code,
        year_of_build: vessel.year_of_build.toString(),
        year_of_delivery: vessel.year_of_delivery.toString(),
        vesseltype: vessel.vesseltype?.id?.toString() || '',
        classofvessel: vessel.classofvessel?.id?.toString() || '',
        yard: vessel.yard?.id?.toString() || '',
        command: vessel.command?.id?.toString() || '',
      };
      
      console.log('Setting form data to:', newFormData);
      setFormData(newFormData);
    }
  }, [isOpen, vessel, loadingDropdowns, vesselTypes, classOfVessels, dockyards, commands]);

  const validateForm = () => {
    const newErrors = { 
      name: '', 
      code: '', 
      year_of_build: '', 
      year_of_delivery: '', 
      vesseltype: '', 
      classofvessel: '', 
      yard: '', 
      command: '' 
    };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Vessel name is required';
      isValid = false;
    }

    if (!formData.code.trim()) {
      newErrors.code = 'Vessel code is required';
      isValid = false;
    }

    if (!formData.year_of_build.trim()) {
      newErrors.year_of_build = 'Year of build is required';
      isValid = false;
    } else if (isNaN(Number(formData.year_of_build))) {
      newErrors.year_of_build = 'Year of build must be a valid number';
      isValid = false;
    }

    if (!formData.year_of_delivery.trim()) {
      newErrors.year_of_delivery = 'Year of delivery is required';
      isValid = false;
    } else if (isNaN(Number(formData.year_of_delivery))) {
      newErrors.year_of_delivery = 'Year of delivery must be a valid number';
      isValid = false;
    }

    if (!formData.vesseltype) {
      newErrors.vesseltype = 'Vessel type is required';
      isValid = false;
    }

    if (!formData.classofvessel) {
      newErrors.classofvessel = 'Class of vessel is required';
      isValid = false;
    }

    if (!formData.yard) {
      newErrors.yard = 'Yard is required';
      isValid = false;
    }

    if (!formData.command) {
      newErrors.command = 'Command is required';
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
      console.error('Error submitting form:', error);
    }
  };

  const handleInputChange = (field: keyof VesselFormData, value: string) => {
    console.log(`Changing ${field} to:`, value);
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Debug logging
  console.log('Current form data:', formData);
  console.log('Loading dropdowns:', loadingDropdowns);
  console.log('Vessel types available:', vesselTypes.length);
  console.log('Class of vessels available:', classOfVessels.length);
  console.log('Dockyards available:', dockyards.length);
  console.log('Commands available:', commands.length);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]" key={vessel?.id || 'new'}>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">{title}</DialogTitle>
          <DialogDescription className="text-gray-600">{description}</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                Vessel Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter vessel name"
                className={`w-full ${errors.name ? 'border-red-500' : ''}`}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="code" className="text-sm font-medium text-gray-700">
                Vessel Code *
              </Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value)}
                placeholder="Enter vessel code"
                className={`w-full ${errors.code ? 'border-red-500' : ''}`}
              />
              {errors.code && (
                <p className="text-sm text-red-600">{errors.code}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="year_of_build" className="text-sm font-medium text-gray-700">
                Year of Build *
              </Label>
              <Input
                id="year_of_build"
                type="number"
                value={formData.year_of_build}
                onChange={(e) => handleInputChange('year_of_build', e.target.value)}
                placeholder="Enter year of build"
                className={`w-full ${errors.year_of_build ? 'border-red-500' : ''}`}
              />
              {errors.year_of_build && (
                <p className="text-sm text-red-600">{errors.year_of_build}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="year_of_delivery" className="text-sm font-medium text-gray-700">
                Year of Delivery *
              </Label>
              <Input
                id="year_of_delivery"
                type="number"
                value={formData.year_of_delivery}
                onChange={(e) => handleInputChange('year_of_delivery', e.target.value)}
                placeholder="Enter year of delivery"
                className={`w-full ${errors.year_of_delivery ? 'border-red-500' : ''}`}
              />
              {errors.year_of_delivery && (
                <p className="text-sm text-red-600">{errors.year_of_delivery}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="vesseltype" className="text-sm font-medium text-gray-700">
                Vessel Type *
              </Label>
              {console.log('Rendering vessel type select with value:', formData.vesseltype)}
              <Select
                key={`vesseltype-${vessel?.id || 'new'}`}
                value={formData.vesseltype}
                onValueChange={(value) => handleInputChange('vesseltype', value)}
              >
                <SelectTrigger className={`w-full ${errors.vesseltype ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Select vessel type" />
                </SelectTrigger>
                <SelectContent>
                  {loadingDropdowns ? (
                    <SelectItem value="loading" disabled>Loading...</SelectItem>
                  ) : (
                    vesselTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.vesseltype && (
                <p className="text-sm text-red-600">{errors.vesseltype}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="classofvessel" className="text-sm font-medium text-gray-700">
                Class of Vessel *
              </Label>
              {console.log('Rendering class of vessel select with value:', formData.classofvessel)}
              <Select
                key={`classofvessel-${vessel?.id || 'new'}`}
                value={formData.classofvessel}
                onValueChange={(value) => handleInputChange('classofvessel', value)}
              >
                <SelectTrigger className={`w-full ${errors.classofvessel ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Select class of vessel" />
                </SelectTrigger>
                <SelectContent>
                  {loadingDropdowns ? (
                    <SelectItem value="loading" disabled>Loading...</SelectItem>
                  ) : (
                    classOfVessels.map((classVessel) => (
                      <SelectItem key={classVessel.id} value={classVessel.id.toString()}>
                        {classVessel.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.classofvessel && (
                <p className="text-sm text-red-600">{errors.classofvessel}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="yard" className="text-sm font-medium text-gray-700">
                Yard *
              </Label>
              {console.log('Rendering yard select with value:', formData.yard)}
              <Select
                key={`yard-${vessel?.id || 'new'}`}
                value={formData.yard}
                onValueChange={(value) => handleInputChange('yard', value)}
              >
                <SelectTrigger className={`w-full ${errors.yard ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Select yard" />
                </SelectTrigger>
                <SelectContent>
                  {loadingDropdowns ? (
                    <SelectItem value="loading" disabled>Loading...</SelectItem>
                  ) : (
                    dockyards.map((dockyard) => (
                      <SelectItem key={dockyard.id} value={dockyard.id.toString()}>
                        {dockyard.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.yard && (
                <p className="text-sm text-red-600">{errors.yard}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="command" className="text-sm font-medium text-gray-700">
                Command *
              </Label>
              {console.log('Rendering command select with value:', formData.command)}
              <Select
                key={`command-${vessel?.id || 'new'}`}
                value={formData.command}
                onValueChange={(value) => handleInputChange('command', value)}
              >
                <SelectTrigger className={`w-full ${errors.command ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Select command" />
                </SelectTrigger>
                <SelectContent>
                  {loadingDropdowns ? (
                    <SelectItem value="loading" disabled>Loading...</SelectItem>
                  ) : (
                    commands.map((command) => (
                      <SelectItem key={command.id} value={command.id.toString()}>
                        {command.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.command && (
                <p className="text-sm text-red-600">{errors.command}</p>
              )}
            </div>
          </div>

          <DialogFooter className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || loadingDropdowns}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {submitButtonText === 'Create Vessel' ? 'Creating...' : 'Saving...'}
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