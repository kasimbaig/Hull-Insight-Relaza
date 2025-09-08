import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, Eye, FileText, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { NavLink } from 'react-router-dom';

interface AirFlowMeasurement {
  id: string;
  servedBy: string;
  compartmentName: string;
  noOfDucts: number;
  ductArea: number;
  airFlow: number;
  flowRate: number;
  designValue: number;
  measuredValue: number;
  observations: string;
  remarks: string;
}

interface HvacTrial {
  id: string;
  ship: string;
  date: string;
  place: string;
  documentNo: string;
  occasion: string;
  authority: string;
  status: 'Draft' | 'In Progress' | 'Completed' | 'Approved';
  createdAt: string;
  airFlowMeasurements: AirFlowMeasurement[];
  machineryAirFlowMeasurements: AirFlowMeasurement[];
}

const HvacTrials = () => {
  const { toast } = useToast();
  const [trials, setTrials] = useState<HvacTrial[]>([
    {
      id: '1',
      ship: 'INS Kolkata',
      date: '2025-09-02',
      place: 'Mumbai',
      documentNo: 'GRAQ 0262',
      occasion: 'Pre-Refit Trials',
      authority: 'HQWNC Letter NC/3000/03 dated 24 Aug 2025',
      status: 'Completed',
      createdAt: '2025-08-24',
      airFlowMeasurements: [
        {
          id: '1',
          servedBy: 'HE 56',
          compartmentName: 'EWER',
          noOfDucts: 4,
          ductArea: 0.0500,
          airFlow: 2.91,
          flowRate: 523.80,
          designValue: 2508.00,
          measuredValue: 2538.00,
          observations: '-',
          remarks: 'SAT'
        }
      ],
      machineryAirFlowMeasurements: [
        {
          id: '1',
          servedBy: 'MCE 11',
          compartmentName: 'AC Mach Compt.03 STP 02',
          noOfDucts: 1,
          ductArea: 0.1056,
          airFlow: 6.00,
          flowRate: 2280.96,
          designValue: 2180.00,
          measuredValue: 2280.96,
          observations: 'Nil',
          remarks: 'SAT'
        }
      ]
    },
    {
      id: '2',
      ship: 'INS Delhi',
      date: '2025-08-15',
      place: 'Kochi',
      documentNo: 'GRAQ 0263',
      occasion: 'Annual Trials',
      authority: 'HQWNC Letter NC/3000/04 dated 10 Aug 2025',
      status: 'In Progress',
      createdAt: '2025-08-10',
      airFlowMeasurements: [],
      machineryAirFlowMeasurements: []
    },
    {
      id: '3',
      ship: 'INS Mumbai',
      date: '2025-07-20',
      place: 'Visakhapatnam',
      documentNo: 'GRAQ 0264',
      occasion: 'Post-Refit Trials',
      authority: 'HQWNC Letter NC/3000/05 dated 15 Jul 2025',
      status: 'Approved',
      createdAt: '2025-07-15',
      airFlowMeasurements: [],
      machineryAirFlowMeasurements: []
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTrial, setEditingTrial] = useState<HvacTrial | null>(null);
  const [formData, setFormData] = useState({
    ship: '',
    date: '',
    place: '',
    documentNo: '',
    occasion: '',
    authority: '',
    status: 'Draft' as HvacTrial['status']
  });
  const [airFlowMeasurements, setAirFlowMeasurements] = useState<AirFlowMeasurement[]>([]);
  const [machineryAirFlowMeasurements, setMachineryAirFlowMeasurements] = useState<AirFlowMeasurement[]>([]);
  const [showAirFlowForm, setShowAirFlowForm] = useState(false);
  const [showMachineryForm, setShowMachineryForm] = useState(false);
  const [currentMeasurement, setCurrentMeasurement] = useState<AirFlowMeasurement>({
    id: '',
    servedBy: '',
    compartmentName: '',
    noOfDucts: 0,
    ductArea: 0,
    airFlow: 0,
    flowRate: 0,
    designValue: 0,
    measuredValue: 0,
    observations: '',
    remarks: ''
  });

  // Available ships for dropdown
  const availableShips = [
    'INS Kolkata',
    'INS Delhi', 
    'INS Mumbai',
    'INS Chennai',
    'INS Kochi',
    'INS Visakhapatnam',
    'INS Rajput',
    'INS Ranvir',
    'INS Ranvijay',
    'INS Shivalik',
    'INS Satpura',
    'INS Sahyadri',
    'INS Kamorta',
    'INS Kadmatt',
    'INS Kiltan',
    'INS Kavaratti'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTrial) {
      // Update existing trial
      setTrials(trials.map(trial => 
        trial.id === editingTrial.id 
          ? { ...trial, ...formData, airFlowMeasurements, machineryAirFlowMeasurements }
          : trial
      ));
      toast({
        title: "Trial Updated",
        description: "HVAC trial has been updated successfully.",
      });
    } else {
      // Create new trial
      const newTrial: HvacTrial = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString().split('T')[0],
        airFlowMeasurements,
        machineryAirFlowMeasurements
      };
      setTrials([newTrial, ...trials]);
      toast({
        title: "Trial Created",
        description: "New HVAC trial has been created successfully.",
      });
    }
    
    resetForm();
    setIsDialogOpen(false);
  };

  const handleAddMeasurement = (type: 'airFlow' | 'machinery') => {
    const newMeasurement: AirFlowMeasurement = {
      ...currentMeasurement,
      id: Date.now().toString()
    };
    
    if (type === 'airFlow') {
      setAirFlowMeasurements([...airFlowMeasurements, newMeasurement]);
    } else {
      setMachineryAirFlowMeasurements([...machineryAirFlowMeasurements, newMeasurement]);
    }
    
    setCurrentMeasurement({
      id: '',
      servedBy: '',
      compartmentName: '',
      noOfDucts: 0,
      ductArea: 0,
      airFlow: 0,
      flowRate: 0,
      designValue: 0,
      measuredValue: 0,
      observations: '',
      remarks: ''
    });
    
    setShowAirFlowForm(false);
    setShowMachineryForm(false);
  };

  const handleRemoveMeasurement = (id: string, type: 'airFlow' | 'machinery') => {
    if (type === 'airFlow') {
      setAirFlowMeasurements(airFlowMeasurements.filter(m => m.id !== id));
    } else {
      setMachineryAirFlowMeasurements(machineryAirFlowMeasurements.filter(m => m.id !== id));
    }
  };


  const handleEdit = (trial: HvacTrial) => {
    setEditingTrial(trial);
    setFormData({
      ship: trial.ship,
      date: trial.date,
      place: trial.place,
      documentNo: trial.documentNo,
      occasion: trial.occasion,
      authority: trial.authority,
      status: trial.status
    });
    setAirFlowMeasurements(trial.airFlowMeasurements);
    setMachineryAirFlowMeasurements(trial.machineryAirFlowMeasurements);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setTrials(trials.filter(trial => trial.id !== id));
    toast({
      title: "Trial Deleted",
      description: "HVAC trial has been deleted successfully.",
    });
  };

  const resetForm = () => {
    setFormData({
      ship: '',
      date: '',
      place: '',
      documentNo: '',
      occasion: '',
      authority: '',
      status: 'Draft'
    });
    setAirFlowMeasurements([]);
    setMachineryAirFlowMeasurements([]);
    setEditingTrial(null);
    setShowAirFlowForm(false);
    setShowMachineryForm(false);
  };

  const getStatusColor = (status: HvacTrial['status']) => {
    switch (status) {
      case 'Draft':
        return 'bg-gray-100 text-gray-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Approved':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">HVAC Trials</h1>
          <p className="text-muted-foreground">
            Manage HVAC trial records and generate reports
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Trial
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[1200px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTrial ? 'Edit HVAC Trial' : 'Add New HVAC Trial'}
              </DialogTitle>
              <DialogDescription>
                {editingTrial 
                  ? 'Update the HVAC trial information below.'
                  : 'Fill in the details for the new HVAC trial.'
                }
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ship">Ship</Label>
                  <Select
                    value={formData.ship}
                    onValueChange={(value) => setFormData({ ...formData, ship: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a ship" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableShips.map((ship) => (
                        <SelectItem key={ship} value={ship}>
                          {ship}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date of Trials</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="place">Place</Label>
                  <Input
                    id="place"
                    value={formData.place}
                    onChange={(e) => setFormData({ ...formData, place: e.target.value })}
                    placeholder="e.g., Mumbai"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="documentNo">Document No.</Label>
                  <Input
                    id="documentNo"
                    value={formData.documentNo}
                    onChange={(e) => setFormData({ ...formData, documentNo: e.target.value })}
                    placeholder="e.g., GRAQ 0262"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="occasion">Occasion</Label>
                <Input
                  id="occasion"
                  value={formData.occasion}
                  onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                  placeholder="e.g., Pre-Refit Trials"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="authority">Authority</Label>
                <Textarea
                  id="authority"
                  value={formData.authority}
                  onChange={(e) => setFormData({ ...formData, authority: e.target.value })}
                  placeholder="e.g., HQWNC Letter NC/3000/03 dated 24 Aug 2025"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: HvacTrial['status']) => 
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Air Flow Measurements Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Air Flow Measurements</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAirFlowForm(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Measurement
                  </Button>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Served By</TableHead>
                        <TableHead>Compartment</TableHead>
                        <TableHead>Ducts</TableHead>
                        <TableHead>Duct Area (m³)</TableHead>
                        <TableHead>Air Flow (m/s)</TableHead>
                        <TableHead>Flow Rate (m³/hr)</TableHead>
                        <TableHead>Design Value</TableHead>
                        <TableHead>Measured Value</TableHead>
                        <TableHead>Observations</TableHead>
                        <TableHead>Remarks</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {airFlowMeasurements.length > 0 ? (
                        airFlowMeasurements.map((measurement) => (
                          <TableRow key={measurement.id}>
                            <TableCell>{measurement.servedBy}</TableCell>
                            <TableCell>{measurement.compartmentName}</TableCell>
                            <TableCell>{measurement.noOfDucts}</TableCell>
                            <TableCell>{measurement.ductArea}</TableCell>
                            <TableCell>{measurement.airFlow}</TableCell>
                            <TableCell>{measurement.flowRate}</TableCell>
                            <TableCell>{measurement.designValue}</TableCell>
                            <TableCell>{measurement.measuredValue}</TableCell>
                            <TableCell>{measurement.observations}</TableCell>
                            <TableCell>{measurement.remarks}</TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRemoveMeasurement(measurement.id, 'airFlow')}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={11} className="text-center text-gray-500 italic py-8">
                            No air flow measurements added yet
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Machinery Air Flow Measurements Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Machinery Air Flow Measurements</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowMachineryForm(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Measurement
                  </Button>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Served By</TableHead>
                        <TableHead>Compartment</TableHead>
                        <TableHead>Ducts</TableHead>
                        <TableHead>Duct Area (m²)</TableHead>
                        <TableHead>Air Flow (m/s)</TableHead>
                        <TableHead>Flow Rate (m³/hr)</TableHead>
                        <TableHead>Design Value</TableHead>
                        <TableHead>Measured Value</TableHead>
                        <TableHead>Observations</TableHead>
                        <TableHead>Remarks</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {machineryAirFlowMeasurements.length > 0 ? (
                        machineryAirFlowMeasurements.map((measurement) => (
                          <TableRow key={measurement.id}>
                            <TableCell>{measurement.servedBy}</TableCell>
                            <TableCell>{measurement.compartmentName}</TableCell>
                            <TableCell>{measurement.noOfDucts}</TableCell>
                            <TableCell>{measurement.ductArea}</TableCell>
                            <TableCell>{measurement.airFlow}</TableCell>
                            <TableCell>{measurement.flowRate}</TableCell>
                            <TableCell>{measurement.designValue}</TableCell>
                            <TableCell>{measurement.measuredValue}</TableCell>
                            <TableCell>{measurement.observations}</TableCell>
                            <TableCell>{measurement.remarks}</TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRemoveMeasurement(measurement.id, 'machinery')}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={11} className="text-center text-gray-500 italic py-8">
                            No machinery air flow measurements added yet
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingTrial ? 'Update Trial' : 'Create Trial'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Air Flow Measurement Form Dialog */}
        <Dialog open={showAirFlowForm} onOpenChange={setShowAirFlowForm}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Add Air Flow Measurement</DialogTitle>
              <DialogDescription>
                Add a new air flow measurement to the trial.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); handleAddMeasurement('airFlow'); }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="servedBy">Served By</Label>
                  <Input
                    id="servedBy"
                    value={currentMeasurement.servedBy}
                    onChange={(e) => setCurrentMeasurement({ ...currentMeasurement, servedBy: e.target.value })}
                    placeholder="e.g., HE 56"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="compartmentName">Compartment Name</Label>
                  <Input
                    id="compartmentName"
                    value={currentMeasurement.compartmentName}
                    onChange={(e) => setCurrentMeasurement({ ...currentMeasurement, compartmentName: e.target.value })}
                    placeholder="e.g., EWER"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="noOfDucts">No of Ducts</Label>
                  <Input
                    id="noOfDucts"
                    type="number"
                    value={currentMeasurement.noOfDucts}
                    onChange={(e) => setCurrentMeasurement({ ...currentMeasurement, noOfDucts: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ductArea">Duct Area (m³)</Label>
                  <Input
                    id="ductArea"
                    type="number"
                    step="0.0001"
                    value={currentMeasurement.ductArea}
                    onChange={(e) => setCurrentMeasurement({ ...currentMeasurement, ductArea: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="airFlow">Air Flow (m/s)</Label>
                  <Input
                    id="airFlow"
                    type="number"
                    step="0.01"
                    value={currentMeasurement.airFlow}
                    onChange={(e) => setCurrentMeasurement({ ...currentMeasurement, airFlow: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="flowRate">Flow Rate (m³/hr)</Label>
                  <Input
                    id="flowRate"
                    type="number"
                    step="0.01"
                    value={currentMeasurement.flowRate}
                    onChange={(e) => setCurrentMeasurement({ ...currentMeasurement, flowRate: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="designValue">Design Value</Label>
                  <Input
                    id="designValue"
                    type="number"
                    step="0.01"
                    value={currentMeasurement.designValue}
                    onChange={(e) => setCurrentMeasurement({ ...currentMeasurement, designValue: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="measuredValue">Measured Value</Label>
                  <Input
                    id="measuredValue"
                    type="number"
                    step="0.01"
                    value={currentMeasurement.measuredValue}
                    onChange={(e) => setCurrentMeasurement({ ...currentMeasurement, measuredValue: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="observations">Observations</Label>
                  <Input
                    id="observations"
                    value={currentMeasurement.observations}
                    onChange={(e) => setCurrentMeasurement({ ...currentMeasurement, observations: e.target.value })}
                    placeholder="e.g., Nil"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="remarks">Remarks</Label>
                  <Input
                    id="remarks"
                    value={currentMeasurement.remarks}
                    onChange={(e) => setCurrentMeasurement({ ...currentMeasurement, remarks: e.target.value })}
                    placeholder="e.g., SAT"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowAirFlowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Measurement</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Machinery Air Flow Measurement Form Dialog */}
        <Dialog open={showMachineryForm} onOpenChange={setShowMachineryForm}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Add Machinery Air Flow Measurement</DialogTitle>
              <DialogDescription>
                Add a new machinery air flow measurement to the trial.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); handleAddMeasurement('machinery'); }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="machineryServedBy">Served By</Label>
                  <Input
                    id="machineryServedBy"
                    value={currentMeasurement.servedBy}
                    onChange={(e) => setCurrentMeasurement({ ...currentMeasurement, servedBy: e.target.value })}
                    placeholder="e.g., MCE 11"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="machineryCompartmentName">Compartment Name</Label>
                  <Input
                    id="machineryCompartmentName"
                    value={currentMeasurement.compartmentName}
                    onChange={(e) => setCurrentMeasurement({ ...currentMeasurement, compartmentName: e.target.value })}
                    placeholder="e.g., AC Mach Compt.03 STP 02"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="machineryNoOfDucts">No of Ducts</Label>
                  <Input
                    id="machineryNoOfDucts"
                    type="number"
                    value={currentMeasurement.noOfDucts}
                    onChange={(e) => setCurrentMeasurement({ ...currentMeasurement, noOfDucts: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="machineryDuctArea">Duct Area (m²)</Label>
                  <Input
                    id="machineryDuctArea"
                    type="number"
                    step="0.0001"
                    value={currentMeasurement.ductArea}
                    onChange={(e) => setCurrentMeasurement({ ...currentMeasurement, ductArea: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="machineryAirFlow">Air Flow (m/s)</Label>
                  <Input
                    id="machineryAirFlow"
                    type="number"
                    step="0.01"
                    value={currentMeasurement.airFlow}
                    onChange={(e) => setCurrentMeasurement({ ...currentMeasurement, airFlow: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="machineryFlowRate">Flow Rate (m³/hr)</Label>
                  <Input
                    id="machineryFlowRate"
                    type="number"
                    step="0.01"
                    value={currentMeasurement.flowRate}
                    onChange={(e) => setCurrentMeasurement({ ...currentMeasurement, flowRate: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="machineryDesignValue">Design Value</Label>
                  <Input
                    id="machineryDesignValue"
                    type="number"
                    step="0.01"
                    value={currentMeasurement.designValue}
                    onChange={(e) => setCurrentMeasurement({ ...currentMeasurement, designValue: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="machineryMeasuredValue">Measured Value</Label>
                  <Input
                    id="machineryMeasuredValue"
                    type="number"
                    step="0.01"
                    value={currentMeasurement.measuredValue}
                    onChange={(e) => setCurrentMeasurement({ ...currentMeasurement, measuredValue: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="machineryObservations">Observations</Label>
                  <Input
                    id="machineryObservations"
                    value={currentMeasurement.observations}
                    onChange={(e) => setCurrentMeasurement({ ...currentMeasurement, observations: e.target.value })}
                    placeholder="e.g., Nil"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="machineryRemarks">Remarks</Label>
                  <Input
                    id="machineryRemarks"
                    value={currentMeasurement.remarks}
                    onChange={(e) => setCurrentMeasurement({ ...currentMeasurement, remarks: e.target.value })}
                    placeholder="e.g., SAT"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowMachineryForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Measurement</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>HVAC Trial Records</CardTitle>
          <CardDescription>
            View and manage all HVAC trial records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ship</TableHead>
                  <TableHead>Date of Trials</TableHead>
                  <TableHead>Place</TableHead>
                  <TableHead>Document No.</TableHead>
                  <TableHead>Occasion</TableHead>
                  <TableHead>Authority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trials.map((trial) => (
                  <TableRow key={trial.id}>
                    <TableCell className="font-medium">{trial.ship}</TableCell>
                    <TableCell>{new Date(trial.date).toLocaleDateString()}</TableCell>
                    <TableCell>{trial.place}</TableCell>
                    <TableCell>{trial.documentNo}</TableCell>
                    <TableCell>{trial.occasion}</TableCell>
                    <TableCell className="max-w-[200px] truncate" title={trial.authority}>
                      {trial.authority}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(trial.status)}>
                        {trial.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <NavLink to={`/hvac-report?trialId=${trial.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </NavLink>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(trial)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(trial.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HvacTrials;
