import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Search, Wrench, Filter, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Equipment, EquipmentAPIResponse, EquipmentsPaginatedResponse, PaginationInfo } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getEquipments, createEquipment, updateEquipment, deleteEquipment } from '@/components/service/equipmentService';
import { Pagination } from '@/components/ui/pagination';
import { EquipmentForm } from '@/components/forms/EquipmentForm';
import { DeleteConfirmDialog } from '@/components/dialogs/DeleteConfirmDialog';
import { ActionButtons } from '@/components/actions/ActionButtons';

const Equipments = () => {
  // API state
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [filteredEquipments, setFilteredEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false,
    totalItems: 0
  });

  // UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [deletingEquipment, setDeletingEquipment] = useState<Equipment | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { hasPermission, user } = useAuth();
  const { toast } = useToast();

  // Debug logging
  console.log('Current user:', user);
  console.log('Has add permission:', hasPermission('Global Masters', 'add'));
  console.log('Has edit permission:', hasPermission('Global Masters', 'edit'));
  console.log('Has delete permission:', hasPermission('Global Masters', 'delete'));

  // Helper function to convert API response to Equipment format
  const convertAPIResponseToEquipment = (apiEquipment: EquipmentAPIResponse): Equipment => ({
    id: apiEquipment.id.toString(),
    name: apiEquipment.name,
    createdBy: `User ${apiEquipment.created_by}`,
    createdOn: apiEquipment.created_on.split('T')[0],
    status: apiEquipment.active === 1 ? 'Active' : 'Inactive',
    remark: apiEquipment.remark,
    ser: apiEquipment.ser,
    numbers: apiEquipment.numbers,
    capabilities_feature: apiEquipment.capabilities_feature,
    weight_volume_power_consumption: apiEquipment.weight_volume_power_consumption,
    location: apiEquipment.location,
    interface: apiEquipment.interface,
    procurement_router: apiEquipment.procurement_router,
    vendor: apiEquipment.vendor,
    cost: apiEquipment.cost,
    standards: apiEquipment.standards,
    sustenance: apiEquipment.sustenance,
    flag: apiEquipment.flag,
    sotr_type: apiEquipment.sotr_type,
    equipment_type_name: apiEquipment.equipment_type_name
  });

  // Helper function to calculate pagination info
  const calculatePaginationInfo = (response: EquipmentsPaginatedResponse, currentPage: number): PaginationInfo => {
    const itemsPerPage = 10; // Assuming 10 items per page
    const totalPages = Math.ceil(response.count / itemsPerPage);
    
    return {
      currentPage,
      totalPages,
      hasNext: response.next !== null,
      hasPrevious: response.previous !== null,
      totalItems: response.count
    };
  };

  // Load equipments from API
  const loadEquipments = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response: EquipmentsPaginatedResponse = await getEquipments(page);
      
      const convertedEquipments = response.results.map(convertAPIResponseToEquipment);
      setEquipments(convertedEquipments);
      setPagination(calculatePaginationInfo(response, page));
    } catch (err) {
      console.error('Error loading equipments:', err);
      setError('Failed to load equipments. Please try again.');
      toast({
        title: "Error",
        description: "Failed to load equipments. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load equipments on component mount and page change
  useEffect(() => {
    loadEquipments(pagination.currentPage);
  }, []);

  // Filter equipments based on search and status
  useEffect(() => {
    let filtered = equipments.filter(equipment =>
      equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.vendor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.flag?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.equipment_type_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(equipment => equipment.status === statusFilter);
    }
    
    setFilteredEquipments(filtered);
  }, [searchTerm, equipments, statusFilter]);

  // Handle page change
  const handlePageChange = (page: number) => {
    loadEquipments(page);
  };

  const handleAdd = async (formData: {
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
    equipment_type_name: string;
  }) => {
    try {
      setIsSubmitting(true);
      await createEquipment({
        name: formData.name,
        code: formData.code,
        remark: formData.remark,
        ser: formData.ser,
        numbers: formData.numbers,
        capabilities_feature: formData.capabilities_feature,
        weight_volume_power_consumption: formData.weight_volume_power_consumption,
        location: formData.location,
        interface: formData.interface,
        procurement_router: formData.procurement_router,
        vendor: formData.vendor,
        cost: formData.cost,
        standards: formData.standards,
        sustenance: formData.sustenance,
        flag: formData.flag,
        sotr_type: formData.sotr_type,
        equipment_type_name: formData.equipment_type_name,
        active: 1
      });
      
      setIsAddDialogOpen(false);
      
      // Reload the current page to show the new equipment
      await loadEquipments(pagination.currentPage);
      
      toast({
        title: "Equipment Added",
        description: `${formData.name} has been successfully added.`,
      });
    } catch (err) {
      console.error('Error creating equipment:', err);
      toast({
        title: "Error",
        description: "Failed to create equipment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (equipment: Equipment) => {
    setEditingEquipment(equipment);
  };

  const handleUpdate = async (formData: {
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
    equipment_type_name: string;
  }) => {
    if (!editingEquipment) return;
    
    try {
      setIsSubmitting(true);
      await updateEquipment(editingEquipment.id, {
        name: formData.name,
        remark: formData.remark,
        ser: formData.ser,
        numbers: formData.numbers,
        capabilities_feature: formData.capabilities_feature,
        weight_volume_power_consumption: formData.weight_volume_power_consumption,
        location: formData.location,
        interface: formData.interface,
        procurement_router: formData.procurement_router,
        vendor: formData.vendor,
        cost: formData.cost,
        standards: formData.standards,
        sustenance: formData.sustenance,
        flag: formData.flag,
        sotr_type: formData.sotr_type,
        equipment_type_name: formData.equipment_type_name
      });
      
      setEditingEquipment(null);
      
      // Reload the current page to show the updated equipment
      await loadEquipments(pagination.currentPage);
      
      toast({
        title: "Equipment Updated",
        description: `${formData.name} has been successfully updated.`,
      });
    } catch (err) {
      console.error('Error updating equipment:', err);
      toast({
        title: "Error",
        description: "Failed to update equipment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (equipment: Equipment) => {
    setDeletingEquipment(equipment);
  };

  const handleConfirmDelete = async () => {
    if (!deletingEquipment) return;
    
    try {
      setIsSubmitting(true);
      await deleteEquipment(deletingEquipment.id);
      
      setDeletingEquipment(null);
      
      // Reload the current page to reflect the deletion
      await loadEquipments(pagination.currentPage);
      
      toast({
        title: "Equipment Deleted",
        description: `${deletingEquipment.name} has been successfully deleted.`,
        variant: "destructive",
      });
    } catch (err) {
      console.error('Error deleting equipment:', err);
      toast({
        title: "Error",
        description: "Failed to delete equipment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (equipment: Equipment) => {
    try {
      setIsSubmitting(true);
      // For status toggle, we'll use the update method with the same data
      await updateEquipment(equipment.id, {
        name: equipment.name,
        remark: equipment.remark || '',
        ser: equipment.ser || '',
        numbers: equipment.numbers || '',
        capabilities_feature: equipment.capabilities_feature || '',
        weight_volume_power_consumption: equipment.weight_volume_power_consumption || '',
        location: equipment.location || '',
        interface: equipment.interface || '',
        procurement_router: equipment.procurement_router || '',
        vendor: equipment.vendor || '',
        cost: equipment.cost || '',
        standards: equipment.standards || '',
        sustenance: equipment.sustenance || '',
        flag: equipment.flag || '',
        sotr_type: equipment.sotr_type || '',
        equipment_type_name: equipment.equipment_type_name || ''
      });
      
      // Reload the current page to reflect the status change
      await loadEquipments(pagination.currentPage);
      
      toast({
        title: "Status Updated",
        description: `${equipment.name} is now ${equipment.status === 'Active' ? 'Inactive' : 'Active'}.`,
      });
    } catch (err) {
      console.error('Error updating equipment status:', err);
      toast({
        title: "Error",
        description: "Failed to update equipment status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    return status === 'Active' 
      ? <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-0">Active</Badge>
      : <Badge variant="outline" className="text-gray-500">Inactive</Badge>;
  };

  const getFlagBadge = (flag: string) => {
    const flagColors = {
      'Critical': 'bg-red-100 text-red-800',
      'Important': 'bg-orange-100 text-orange-800',
      'Normal': 'bg-blue-100 text-blue-800',
      'Low': 'bg-gray-100 text-gray-800'
    };
    return (
      <Badge className={`${flagColors[flag as keyof typeof flagColors] || 'bg-gray-100 text-gray-800'} border-0`}>
        {flag}
      </Badge>
    );
  };

  const getSotrTypeBadge = (sotrType: string) => {
    const sotrColors = {
      'Fresh': 'bg-green-100 text-green-800',
      'Frozen': 'bg-blue-100 text-blue-800',
      'Active': 'bg-yellow-100 text-yellow-800',
      'Deprecated': 'bg-red-100 text-red-800',
      'Under Review': 'bg-purple-100 text-purple-800'
    };
    return (
      <Badge className={`${sotrColors[sotrType as keyof typeof sotrColors] || 'bg-gray-100 text-gray-800'} border-0`}>
        {sotrType}
      </Badge>
    );
  };

  const getStatusCount = (status: string) => {
    return equipments.filter(e => e.status === status).length;
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Equipments Management</h1>
          <p className="text-gray-600 mt-1">Organize and manage vessel equipment and machinery</p>
        </div>
        
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Equipment
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-gray-600">Total Equipments</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Wrench className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{pagination.totalItems}</div>
            <p className="text-xs text-gray-500 mt-1">Vessel equipments</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-gray-600">Active Equipments</CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
              <Badge className="bg-green-500 border-0 h-4 w-4 p-0" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{getStatusCount('Active')}</div>
            <p className="text-xs text-gray-500 mt-1">Currently operational</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-gray-600">Critical Equipments</CardTitle>
            <div className="p-2 bg-red-100 rounded-lg">
              <Badge className="bg-red-500 border-0 h-4 w-4 p-0" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {equipments.filter(e => e.flag === 'Critical').length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Critical priority</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-gray-600">Fresh Equipments</CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
              <Badge className="bg-green-500 border-0 h-4 w-4 p-0" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {equipments.filter(e => e.sotr_type === 'Fresh').length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Fresh SOTR type</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <CardHeader className="border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-xl text-gray-900">Equipments Directory</CardTitle>
              <CardDescription className="mt-1">
                {filteredEquipments.length} {filteredEquipments.length === 1 ? 'equipment' : 'equipments'} found
              </CardDescription>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search equipments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Status
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem 
                    onClick={() => setStatusFilter('all')}
                    className={statusFilter === 'all' ? 'bg-gray-100' : ''}
                  >
                    All Equipments
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setStatusFilter('Active')}
                    className={statusFilter === 'Active' ? 'bg-gray-100' : ''}
                  >
                    Active Only
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setStatusFilter('Inactive')}
                    className={statusFilter === 'Inactive' ? 'bg-gray-100' : ''}
                  >
                    Inactive Only
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-xl overflow-hidden border-0">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-semibold text-gray-700">Equipment Name</TableHead>
                  <TableHead className="font-semibold text-gray-700">Type</TableHead>
                  <TableHead className="font-semibold text-gray-700">Vendor</TableHead>
                  <TableHead className="font-semibold text-gray-700">Flag</TableHead>
                  <TableHead className="font-semibold text-gray-700">SOTR Type</TableHead>
                  <TableHead className="font-semibold text-gray-700">Status</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500 py-6">
                        <Loader2 className="h-8 w-8 mb-2 animate-spin" />
                        <p>Loading equipments...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-red-500 py-6">
                        <p className="font-medium">Error loading equipments</p>
                        <p className="text-sm">{error}</p>
                        <Button 
                          variant="outline" 
                          onClick={() => loadEquipments(pagination.currentPage)}
                          className="mt-2"
                        >
                          Try Again
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredEquipments.length > 0 ? (
                  filteredEquipments.map((equipment) => (
                    <TableRow key={equipment.id} className="hover:bg-gray-50/50 border-b border-gray-200 last:border-0">
                      <TableCell className="font-medium text-gray-900">
                        <div>
                          <div className="font-semibold">{equipment.name}</div>
                          {equipment.ser && (
                            <div className="text-sm text-gray-500">SER: {equipment.ser}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {equipment.equipment_type_name || '-'}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {equipment.vendor || '-'}
                      </TableCell>
                      <TableCell>
                        {equipment.flag ? getFlagBadge(equipment.flag) : '-'}
                      </TableCell>
                      <TableCell>
                        {equipment.sotr_type ? getSotrTypeBadge(equipment.sotr_type) : '-'}
                      </TableCell>
                      <TableCell>{getStatusBadge(equipment.status)}</TableCell>
                      <TableCell className="text-right">
                        <ActionButtons
                          onEdit={() => handleEdit(equipment)}
                          onDelete={() => handleDelete(equipment)}
                          onToggleStatus={() => toggleStatus(equipment)}
                          isActive={equipment.status === 'Active'}
                          isSubmitting={isSubmitting}
                          hasEditPermission={true}
                          hasDeletePermission={true}
                          itemName={equipment.name}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500 py-6">
                        <Search className="h-10 w-10 mb-2 opacity-30" />
                        <p>No equipments found.</p>
                        <p className="text-sm">Try adjusting your search or filter criteria.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          {!loading && !error && pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
                hasNext={pagination.hasNext}
                hasPrevious={pagination.hasPrevious}
                totalItems={pagination.totalItems}
                itemsPerPage={10}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Equipment Form */}
      <EquipmentForm
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAdd}
        equipment={null}
        title="Create New Equipment"
        description="Add a new vessel equipment to the system. This equipment will be available for vessel configuration and maintenance."
        submitButtonText="Create Equipment"
        isSubmitting={isSubmitting}
      />

      {/* Edit Equipment Form */}
      <EquipmentForm
        isOpen={!!editingEquipment}
        onClose={() => setEditingEquipment(null)}
        onSubmit={handleUpdate}
        equipment={editingEquipment}
        title="Edit Equipment"
        description="Update the equipment information below. Click save when you're done."
        submitButtonText="Save Changes"
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={!!deletingEquipment}
        onClose={() => setDeletingEquipment(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Equipment"
        description="This action will permanently remove the equipment from the system."
        itemName={deletingEquipment?.name || ''}
        isDeleting={isSubmitting}
      />
    </div>
  );
};

export default Equipments;
