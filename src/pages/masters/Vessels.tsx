import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Search, Edit, Trash2, Ship, Anchor, Compass } from 'lucide-react';
import { 
  mockVessels, 
  mockClassOfVessels, 
  mockVesselTypes, 
  mockDockyards, 
  mockCommands,
  Vessel 
} from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Vessels = () => {
  const [vessels, setVessels] = useState<Vessel[]>(mockVessels);
  const [filteredVessels, setFilteredVessels] = useState<Vessel[]>(mockVessels);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingVessel, setEditingVessel] = useState<Vessel | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    classOfVessel: '',
    vesselType: '',
    dockyard: '',
    command: '',
    yearOfBuild: '',
    yearOfDelivery: '',
    pennantNumber: '',
    displacement: ''
  });
  
  const { hasPermission, user } = useAuth();
  const { toast } = useToast();

  React.useEffect(() => {
    let filtered = vessels.filter(vessel =>
      vessel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vessel.pennantNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (statusFilter !== 'All') {
      filtered = filtered.filter(vessel => vessel.status === statusFilter);
    }
    
    setFilteredVessels(filtered);
  }, [searchTerm, statusFilter, vessels]);

  const resetForm = () => {
    setFormData({
      name: '',
      classOfVessel: '',
      vesselType: '',
      dockyard: '',
      command: '',
      yearOfBuild: '',
      yearOfDelivery: '',
      pennantNumber: '',
      displacement: ''
    });
  };

  const handleAdd = () => {
    if (!formData.name.trim() || !formData.pennantNumber.trim()) return;
    
    const newVessel: Vessel = {
      id: (vessels.length + 1).toString(),
      name: formData.name,
      classOfVessel: formData.classOfVessel,
      vesselType: formData.vesselType,
      dockyard: formData.dockyard,
      command: formData.command,
      yearOfBuild: parseInt(formData.yearOfBuild) || 0,
      yearOfDelivery: parseInt(formData.yearOfDelivery) || 0,
      pennantNumber: formData.pennantNumber,
      displacement: parseInt(formData.displacement) || 0,
      status: 'Active',
      createdBy: user?.firstName + ' ' + user?.lastName || 'Unknown',
      createdOn: new Date().toISOString().split('T')[0]
    };

    setVessels([...vessels, newVessel]);
    resetForm();
    setIsAddDialogOpen(false);
    
    toast({
      title: "Vessel Added",
      description: `${newVessel.name} has been successfully added.`,
    });
  };

  const handleEdit = (vessel: Vessel) => {
    setEditingVessel(vessel);
    setFormData({
      name: vessel.name,
      classOfVessel: vessel.classOfVessel,
      vesselType: vessel.vesselType,
      dockyard: vessel.dockyard,
      command: vessel.command,
      yearOfBuild: vessel.yearOfBuild.toString(),
      yearOfDelivery: vessel.yearOfDelivery.toString(),
      pennantNumber: vessel.pennantNumber,
      displacement: vessel.displacement.toString()
    });
  };

  const handleUpdate = () => {
    if (!editingVessel || !formData.name.trim()) return;
    
    const updatedVessels = vessels.map(vessel =>
      vessel.id === editingVessel.id
        ? {
            ...vessel,
            name: formData.name,
            classOfVessel: formData.classOfVessel,
            vesselType: formData.vesselType,
            dockyard: formData.dockyard,
            command: formData.command,
            yearOfBuild: parseInt(formData.yearOfBuild) || vessel.yearOfBuild,
            yearOfDelivery: parseInt(formData.yearOfDelivery) || vessel.yearOfDelivery,
            pennantNumber: formData.pennantNumber,
            displacement: parseInt(formData.displacement) || vessel.displacement
          }
        : vessel
    );
    
    setVessels(updatedVessels);
    setEditingVessel(null);
    resetForm();
    
    toast({
      title: "Vessel Updated",
      description: `${formData.name} has been successfully updated.`,
    });
  };

  const handleDelete = (vessel: Vessel) => {
    setVessels(vessels.filter(v => v.id !== vessel.id));
    toast({
      title: "Vessel Deleted",
      description: `${vessel.name} has been successfully deleted.`,
      variant: "destructive",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className="hull-status-active">Active</Badge>;
      case 'Under Refit':
        return <Badge className="hull-status-pending">Under Refit</Badge>;
      case 'Decommissioned':
        return <Badge className="hull-status-critical">Decommissioned</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Vessels</h1>
          <p className="text-muted-foreground">Manage fleet vessels and their specifications</p>
        </div>
        
        {hasPermission('Global Masters', 'add') && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="hull-button-primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Vessel
              </Button>
            </DialogTrigger>
            <DialogContent className="hull-card max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Vessel</DialogTitle>
                <DialogDescription>
                  Register a new vessel in the fleet management system.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Vessel Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., INS Vikrant"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="hull-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pennant">Pennant Number</Label>
                  <Input
                    id="pennant"
                    placeholder="e.g., R11"
                    value={formData.pennantNumber}
                    onChange={(e) => setFormData({ ...formData, pennantNumber: e.target.value })}
                    className="hull-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="class">Class of Vessel</Label>
                  <Select value={formData.classOfVessel} onValueChange={(value) => setFormData({ ...formData, classOfVessel: value })}>
                    <SelectTrigger className="hull-input">
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockClassOfVessels.map((cls) => (
                        <SelectItem key={cls.id} value={cls.name}>{cls.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Vessel Type</Label>
                  <Select value={formData.vesselType} onValueChange={(value) => setFormData({ ...formData, vesselType: value })}>
                    <SelectTrigger className="hull-input">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockVesselTypes.map((type) => (
                        <SelectItem key={type.id} value={type.name}>{type.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dockyard">Dockyard</Label>
                  <Select value={formData.dockyard} onValueChange={(value) => setFormData({ ...formData, dockyard: value })}>
                    <SelectTrigger className="hull-input">
                      <SelectValue placeholder="Select dockyard" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockDockyards.map((dockyard) => (
                        <SelectItem key={dockyard.id} value={dockyard.name}>{dockyard.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="command">Command</Label>
                  <Select value={formData.command} onValueChange={(value) => setFormData({ ...formData, command: value })}>
                    <SelectTrigger className="hull-input">
                      <SelectValue placeholder="Select command" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCommands.map((command) => (
                        <SelectItem key={command.id} value={command.name}>{command.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yearBuild">Year of Build</Label>
                  <Input
                    id="yearBuild"
                    type="number"
                    placeholder="2020"
                    value={formData.yearOfBuild}
                    onChange={(e) => setFormData({ ...formData, yearOfBuild: e.target.value })}
                    className="hull-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yearDelivery">Year of Delivery</Label>
                  <Input
                    id="yearDelivery"
                    type="number"
                    placeholder="2022"
                    value={formData.yearOfDelivery}
                    onChange={(e) => setFormData({ ...formData, yearOfDelivery: e.target.value })}
                    className="hull-input"
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="displacement">Displacement (tons)</Label>
                  <Input
                    id="displacement"
                    type="number"
                    placeholder="45000"
                    value={formData.displacement}
                    onChange={(e) => setFormData({ ...formData, displacement: e.target.value })}
                    className="hull-input"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAdd} className="hull-button-primary">
                  Add Vessel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hull-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vessels</CardTitle>
            <Ship className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vessels.length}</div>
            <p className="text-xs text-muted-foreground">
              Fleet strength
            </p>
          </CardContent>
        </Card>
        
        <Card className="hull-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Vessels</CardTitle>
            <Badge className="hull-status-active">Active</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vessels.filter(v => v.status === 'Active').length}</div>
            <p className="text-xs text-muted-foreground">Operational</p>
          </CardContent>
        </Card>
        
        <Card className="hull-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Refit</CardTitle>
            <Badge className="hull-status-pending">Refit</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vessels.filter(v => v.status === 'Under Refit').length}</div>
            <p className="text-xs text-muted-foreground">In maintenance</p>
          </CardContent>
        </Card>
        
        <Card className="hull-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commands</CardTitle>
            <Compass className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(vessels.map(v => v.command)).size}</div>
            <p className="text-xs text-muted-foreground">Naval commands</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="hull-card">
        <CardHeader>
          <CardTitle>Fleet Registry</CardTitle>
          <CardDescription>Complete list of vessels in the Indian Navy fleet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search vessels or pennant numbers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 hull-input"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 hull-input">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Under Refit">Under Refit</SelectItem>
                <SelectItem value="Decommissioned">Decommissioned</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-2xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vessel Name</TableHead>
                  <TableHead>Pennant</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Command</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVessels.map((vessel) => (
                  <TableRow key={vessel.id}>
                    <TableCell className="font-medium">{vessel.name}</TableCell>
                    <TableCell className="font-mono">{vessel.pennantNumber}</TableCell>
                    <TableCell>{vessel.classOfVessel}</TableCell>
                    <TableCell>{vessel.vesselType}</TableCell>
                    <TableCell>{vessel.command}</TableCell>
                    <TableCell>{getStatusBadge(vessel.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        {hasPermission('Global Masters', 'edit') && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(vessel)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                        {hasPermission('Global Masters', 'delete') && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(vessel)}
                            className="text-accent hover:text-accent-foreground hover:bg-accent/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingVessel} onOpenChange={() => setEditingVessel(null)}>
        <DialogContent className="hull-card max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Vessel</DialogTitle>
            <DialogDescription>Update vessel information below.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Vessel Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="hull-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-pennant">Pennant Number</Label>
              <Input
                id="edit-pennant"
                value={formData.pennantNumber}
                onChange={(e) => setFormData({ ...formData, pennantNumber: e.target.value })}
                className="hull-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="class">Class of Vessel</Label>
              <Select value={formData.classOfVessel} onValueChange={(value) => setFormData({ ...formData, classOfVessel: value })}>
                <SelectTrigger className="hull-input">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {mockClassOfVessels.map((cls) => (
                    <SelectItem key={cls.id} value={cls.name}>{cls.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Vessel Type</Label>
              <Select value={formData.vesselType} onValueChange={(value) => setFormData({ ...formData, vesselType: value })}>
                <SelectTrigger className="hull-input">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {mockVesselTypes.map((type) => (
                    <SelectItem key={type.id} value={type.name}>{type.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dockyard">Dockyard</Label>
              <Select value={formData.dockyard} onValueChange={(value) => setFormData({ ...formData, dockyard: value })}>
                <SelectTrigger className="hull-input">
                  <SelectValue placeholder="Select dockyard" />
                </SelectTrigger>
                <SelectContent>
                  {mockDockyards.map((dockyard) => (
                    <SelectItem key={dockyard.id} value={dockyard.name}>{dockyard.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="command">Command</Label>
              <Select value={formData.command} onValueChange={(value) => setFormData({ ...formData, command: value })}>
                <SelectTrigger className="hull-input">
                  <SelectValue placeholder="Select command" />
                </SelectTrigger>
                <SelectContent>
                  {mockCommands.map((command) => (
                    <SelectItem key={command.id} value={command.name}>{command.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="yearBuild">Year of Build</Label>
              <Input
                id="yearBuild"
                type="number"
                placeholder="2020"
                value={formData.yearOfBuild}
                onChange={(e) => setFormData({ ...formData, yearOfBuild: e.target.value })}
                className="hull-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="yearDelivery">Year of Delivery</Label>
              <Input
                id="yearDelivery"
                type="number"
                placeholder="2022"
                value={formData.yearOfDelivery}
                onChange={(e) => setFormData({ ...formData, yearOfDelivery: e.target.value })}
                className="hull-input"
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="displacement">Displacement (tons)</Label>
              <Input
                id="displacement"
                type="number"
                placeholder="45000"
                value={formData.displacement}
                onChange={(e) => setFormData({ ...formData, displacement: e.target.value })}
                className="hull-input"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingVessel(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} className="hull-button-primary">
              Update Vessel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Vessels;
