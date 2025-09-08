import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Ship, Filter, Loader2, Compass } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Vessel,
  VesselAPIResponse, 
  VesselsPaginatedResponse,
  PaginationInfo
} from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getVessels, createVessel, updateVessel, deleteVessel } from '@/components/service/apiservice';
import { Pagination } from '@/components/ui/pagination';
import MasterTable, { ColumnDefinition } from '@/components/common/MasterTable';
import { VesselForm } from '@/components/forms/VesselForm';
import { DeleteConfirmDialog } from '@/components/dialogs/DeleteConfirmDialog';
import { ActionButtons } from '@/components/actions/ActionButtons';


const Vessels = () => {
  // API state
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [filteredVessels, setFilteredVessels] = useState<Vessel[]>([]);
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
  const [editingVessel, setEditingVessel] = useState<Vessel | null>(null);
  const [deletingVessel, setDeletingVessel] = useState<Vessel | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { hasPermission, user } = useAuth();
  const { toast } = useToast();

  // Debug logging
  console.log('Current user:', user);
  console.log('Has add permission:', hasPermission('Global Masters', 'add'));
  console.log('Has edit permission:', hasPermission('Global Masters', 'edit'));
  console.log('Has delete permission:', hasPermission('Global Masters', 'delete'));

  // Column definitions for MasterTable
  const columns: ColumnDefinition<Vessel>[] = [
    {
      header: 'Vessel Name',
      cell: (vessel) => (
        <div>
          <div className="font-semibold">{vessel.name}</div>
          <div className="text-sm text-gray-500">Built: {vessel.year_of_build}</div>
        </div>
      )
    },
    {
      header: 'Code',
      cell: (vessel) => (
        <span className="font-mono text-sm text-gray-600">{vessel.code}</span>
      )
    },
    {
      header: 'Class',
      cell: (vessel) => (
        <span className="text-gray-600">{vessel.classofvessel.name}</span>
      )
    },
    {
      header: 'Type',
      cell: (vessel) => (
        <span className="text-gray-600">{vessel.vesseltype.name}</span>
      )
    },
    {
      header: 'Command',
      cell: (vessel) => (
        <span className="text-gray-600">{vessel.command.name}</span>
      )
    },
    {
      header: 'Status',
      cell: (vessel) => (
        <Badge className={vessel.active === 1 ? "bg-green-100 text-green-800 hover:bg-green-200 border-0" : "bg-gray-100 text-gray-800 hover:bg-gray-200 border-0"}>
          {vessel.active === 1 ? 'Active' : 'Inactive'}
        </Badge>
      )
    }
  ];

  // Helper function to convert API response to Vessel format
  const convertAPIResponseToVessel = (apiVessel: VesselAPIResponse): Vessel => ({
    id: apiVessel.id,
    classofvessel: apiVessel.classofvessel,
    vesseltype: apiVessel.vesseltype,
    yard: apiVessel.yard,
    command: apiVessel.command,
    code: apiVessel.code,
    active: apiVessel.active,
    created_on: apiVessel.created_on,
    created_ip: apiVessel.created_ip,
    modified_on: apiVessel.modified_on,
    modified_ip: apiVessel.modified_ip,
    name: apiVessel.name,
    year_of_build: apiVessel.year_of_build,
    year_of_delivery: apiVessel.year_of_delivery,
    created_by: apiVessel.created_by,
    modified_by: apiVessel.modified_by
  });

  // Helper function to calculate pagination info
  const calculatePaginationInfo = (response: VesselsPaginatedResponse, currentPage: number): PaginationInfo => {
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

  // Load vessels from API
  const loadVessels = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response: VesselsPaginatedResponse = await getVessels(page);
      
      const convertedVessels = response.results.map(convertAPIResponseToVessel);
      setVessels(convertedVessels);
      setPagination(calculatePaginationInfo(response, page));
    } catch (err) {
      console.error('Error loading vessels:', err);
      setError('Failed to load vessels. Please try again.');
      toast({
        title: "Error",
        description: "Failed to load vessels. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load vessels on component mount and page change
  useEffect(() => {
    loadVessels(pagination.currentPage);
  }, []);

  // Filter vessels based on search
  useEffect(() => {
    let filtered = vessels.filter(vessel =>
      vessel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vessel.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vessel.classofvessel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vessel.vesseltype.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vessel.command.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredVessels(filtered);
  }, [searchTerm, vessels]);

  // Handle page change
  const handlePageChange = (page: number) => {
    loadVessels(page);
  };

  const handleAdd = async (formData: {
    name: string;
    code: string;
    year_of_build: string;
    year_of_delivery: string;
    vesseltype: string;
    classofvessel: string;
    yard: string;
    command: string;
  }) => {
    try {
      setIsSubmitting(true);
      await createVessel({
      name: formData.name,
        code: formData.code,
        year_of_build: parseInt(formData.year_of_build),
        year_of_delivery: parseInt(formData.year_of_delivery),
        vesseltype: parseInt(formData.vesseltype),
        classofvessel: parseInt(formData.classofvessel),
        yard: parseInt(formData.yard),
        command: parseInt(formData.command),
        active: 1
      });
      
    setIsAddDialogOpen(false);
      
      // Reload the current page to show the new vessel
      await loadVessels(pagination.currentPage);
    
    toast({
      title: "Vessel Added",
        description: `${formData.name} has been successfully added.`,
      });
    } catch (err) {
      console.error('Error creating vessel:', err);
      toast({
        title: "Error",
        description: "Failed to create vessel. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (vessel: Vessel) => {
    setEditingVessel(vessel);
  };

  const handleUpdate = async (formData: {
    name: string;
    code: string;
    year_of_build: string;
    year_of_delivery: string;
    vesseltype: string;
    classofvessel: string;
    yard: string;
    command: string;
  }) => {
    if (!editingVessel) return;
    
    try {
      setIsSubmitting(true);
      await updateVessel(editingVessel.id, {
            name: formData.name,
        code: formData.code,
        year_of_build: parseInt(formData.year_of_build),
        year_of_delivery: parseInt(formData.year_of_delivery),
        vesseltype: parseInt(formData.vesseltype),
        classofvessel: parseInt(formData.classofvessel),
        yard: parseInt(formData.yard),
        command: parseInt(formData.command)
      });
      
    setEditingVessel(null);
      
      // Reload the current page to show the updated vessel
      await loadVessels(pagination.currentPage);
    
    toast({
      title: "Vessel Updated",
      description: `${formData.name} has been successfully updated.`,
    });
    } catch (err) {
      console.error('Error updating vessel:', err);
      toast({
        title: "Error",
        description: "Failed to update vessel. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (vessel: Vessel) => {
    setDeletingVessel(vessel);
  };

  const handleConfirmDelete = async () => {
    if (!deletingVessel) return;
    
    try {
      setIsSubmitting(true);
      await deleteVessel(deletingVessel.id);
      
      setDeletingVessel(null);
      
      // Reload the current page to reflect the deletion
      await loadVessels(pagination.currentPage);
      
    toast({
      title: "Vessel Deleted",
        description: `${deletingVessel.name} has been successfully deleted.`,
        variant: "destructive",
      });
    } catch (err) {
      console.error('Error deleting vessel:', err);
      toast({
        title: "Error",
        description: "Failed to delete vessel. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (vessel: Vessel) => {
    try {
      setIsSubmitting(true);
      // For status toggle, we'll use the update method with the same data
      await updateVessel(vessel.id, {
        name: vessel.name,
        code: vessel.code,
        year_of_build: vessel.year_of_build,
        year_of_delivery: vessel.year_of_delivery
      });
      
      // Reload the current page to reflect the status change
      await loadVessels(pagination.currentPage);
      
      toast({
        title: "Status Updated",
        description: `${vessel.name} is now ${vessel.active === 1 ? 'Inactive' : 'Active'}.`,
      });
    } catch (err) {
      console.error('Error updating vessel status:', err);
      toast({
        title: "Error",
        description: "Failed to update vessel status. Please try again.",
      variant: "destructive",
    });
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vessels Management</h1>
          <p className="text-gray-600 mt-1">Organize and manage fleet vessels and their specifications</p>
        </div>
        
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
                <Plus className="w-4 h-4 mr-2" />
          Add New Vessel
                </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-gray-600">Total Vessels</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Ship className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{pagination.totalItems}</div>
            <p className="text-xs text-gray-500 mt-1">Fleet vessels</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-gray-600">Active Vessels</CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
              <Badge className="bg-green-500 border-0 h-4 w-4 p-0" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{vessels.filter(v => v.active === 1).length}</div>
            <p className="text-xs text-gray-500 mt-1">Currently operational</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-gray-600">Under Refit</CardTitle>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Badge className="bg-yellow-500 border-0 h-4 w-4 p-0" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{vessels.filter(v => v.active === 0).length}</div>
            <p className="text-xs text-gray-500 mt-1">In maintenance</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-gray-600">Commands</CardTitle>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Compass className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{new Set(vessels.map(v => v.command.name)).size}</div>
            <p className="text-xs text-gray-500 mt-1">Naval commands</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <CardHeader className="border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-xl text-gray-900">Vessels Directory</CardTitle>
              <CardDescription className="mt-1">
                {filteredVessels.length} {filteredVessels.length === 1 ? 'vessel' : 'vessels'} found
              </CardDescription>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                  placeholder="Search vessels..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <MasterTable
            columns={columns}
            data={filteredVessels}
            rowKey={(vessel) => vessel.id.toString()}
            loading={loading}
            error={error}
            onRetry={() => loadVessels(pagination.currentPage)}
            actionsHeader={<span className="font-semibold text-gray-700 text-right">Actions</span>}
            renderActions={(vessel) => (
              <ActionButtons
                onEdit={() => handleEdit(vessel)}
                onDelete={() => handleDelete(vessel)}
                isSubmitting={isSubmitting}
                hasEditPermission={hasPermission('Global Masters', 'edit')}
                hasDeletePermission={hasPermission('Global Masters', 'delete')}
                itemName={vessel.name}
              />
            )}
            headerClassName="bg-gray-50"
          />
          
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

      {/* Add Vessel Form */}
      <VesselForm
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAdd}
        vessel={null}
        title="Create New Vessel"
        description="Add a new vessel to the fleet. This vessel will be available for fleet management and operations."
        submitButtonText="Create Vessel"
        isSubmitting={isSubmitting}
      />

      {/* Edit Vessel Form */}
      <VesselForm
        isOpen={!!editingVessel}
        onClose={() => setEditingVessel(null)}
        onSubmit={handleUpdate}
        vessel={editingVessel}
        title="Edit Vessel"
        description="Update the vessel information below. Click save when you're done."
        submitButtonText="Save Changes"
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={!!deletingVessel}
        onClose={() => setDeletingVessel(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Vessel"
        description="This action will permanently remove the vessel from the system."
        itemName={deletingVessel?.name || ''}
        isDeleting={isSubmitting}
      />
    </div>
  );
};

export default Vessels;