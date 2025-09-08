import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
} from '@/components/ui/table';
import { Plus, Search, Settings, Filter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { System, SystemAPIResponse, SystemsPaginatedResponse, PaginationInfo } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getSystems, createSystem, updateSystem, deleteSystem } from '@/components/service/systemService';
import { Pagination } from '@/components/ui/pagination';
import { SystemForm } from '@/components/forms/SystemForm';
import { DeleteConfirmDialog } from '@/components/dialogs/DeleteConfirmDialog';
import { ActionButtons } from '@/components/actions/ActionButtons';
import MasterTable, { ColumnDefinition } from '@/components/common/MasterTable';

const Systems = () => {
  // API state
  const [systems, setSystems] = useState<System[]>([]);
  const [filteredSystems, setFilteredSystems] = useState<System[]>([]);
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
  const [editingSystem, setEditingSystem] = useState<System | null>(null);
  const [deletingSystem, setDeletingSystem] = useState<System | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { hasPermission, user } = useAuth();
  const { toast } = useToast();

  // Debug logging
  console.log('Current user:', user);
  console.log('Has add permission:', hasPermission('Global Masters', 'add'));
  console.log('Has edit permission:', hasPermission('Global Masters', 'edit'));
  console.log('Has delete permission:', hasPermission('Global Masters', 'delete'));

  // Helper function to convert API response to System format
  const convertAPIResponseToSystem = (apiSystem: SystemAPIResponse): System => ({
    id: apiSystem.id.toString(),
    name: apiSystem.name,
    createdBy: `User ${apiSystem.created_by}`,
    createdOn: apiSystem.created_on.split('T')[0],
    status: apiSystem.active === 1 ? 'Active' : 'Inactive',
    remark: apiSystem.remark,
    ser: apiSystem.ser,
    numbers: apiSystem.numbers,
    capabilities_feature: apiSystem.capabilities_feature,
    weight_volume_power_consumption: apiSystem.weight_volume_power_consumption,
    location: apiSystem.location,
    interface: apiSystem.interface,
    procurement_router: apiSystem.procurement_router,
    vendor: apiSystem.vendor,
    cost: apiSystem.cost,
    standards: apiSystem.standards,
    sustenance: apiSystem.sustenance,
    flag: apiSystem.flag,
    sotr_type: apiSystem.sotr_type,
    sequence: apiSystem.sequence
  });

  // Helper function to calculate pagination info
  const calculatePaginationInfo = (response: SystemsPaginatedResponse, currentPage: number): PaginationInfo => {
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

  // Load systems from API
  const loadSystems = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getSystems(page);
      
      // Handle the actual API response structure: { status: 200, data: [...] }
      let systemsData: SystemAPIResponse[] = [];
      if (response && response.data && Array.isArray(response.data)) {
        systemsData = response.data;
      } else if (response && response.results && Array.isArray(response.results)) {
        // Fallback for paginated response structure
        systemsData = response.results;
      } else if (Array.isArray(response)) {
        // Fallback for direct array response
        systemsData = response;
      } else {
        console.warn('Unexpected API response structure:', response);
        systemsData = [];
      }
      
      const convertedSystems = systemsData.map(convertAPIResponseToSystem);
      setSystems(convertedSystems);
      
      // For non-paginated response, set basic pagination info
      setPagination({
        currentPage: 1,
        totalPages: 1,
        hasNext: false,
        hasPrevious: false,
        totalItems: convertedSystems.length
      });
    } catch (err) {
      console.error('Error loading systems:', err);
      setError('Failed to load systems. Please try again.');
      toast({
        title: "Error",
        description: "Failed to load systems. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load systems on component mount and page change
  useEffect(() => {
    loadSystems(pagination.currentPage);
  }, []);

  // Filter systems based on search and status
  useEffect(() => {
    let filtered = systems.filter(system =>
      system.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      system.vendor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      system.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      system.flag?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(system => system.status === statusFilter);
    }
    
    setFilteredSystems(filtered);
  }, [searchTerm, systems, statusFilter]);

  // Handle page change
  const handlePageChange = (page: number) => {
    loadSystems(page);
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
    sequence: number;
  }) => {
    try {
      setIsSubmitting(true);
      await createSystem({
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
        sequence: formData.sequence,
        active: 1
      });
      
      setIsAddDialogOpen(false);
      
      // Reload the current page to show the new system
      await loadSystems(pagination.currentPage);
      
      toast({
        title: "System Added",
        description: `${formData.name} has been successfully added.`,
      });
    } catch (err) {
      console.error('Error creating system:', err);
      toast({
        title: "Error",
        description: "Failed to create system. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (system: System) => {
    setEditingSystem(system);
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
    sequence: number;
  }) => {
    if (!editingSystem) return;
    
    try {
      setIsSubmitting(true);
      await updateSystem(editingSystem.id, {
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
        sequence: formData.sequence
      });
      
      setEditingSystem(null);
      
      // Reload the current page to show the updated system
      await loadSystems(pagination.currentPage);
      
      toast({
        title: "System Updated",
        description: `${formData.name} has been successfully updated.`,
      });
    } catch (err) {
      console.error('Error updating system:', err);
      toast({
        title: "Error",
        description: "Failed to update system. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (system: System) => {
    setDeletingSystem(system);
  };

  const handleConfirmDelete = async () => {
    if (!deletingSystem) return;
    
    try {
      setIsSubmitting(true);
      await deleteSystem(deletingSystem.id);
      
      setDeletingSystem(null);
      
      // Reload the current page to reflect the deletion
      await loadSystems(pagination.currentPage);
      
      toast({
        title: "System Deleted",
        description: `${deletingSystem.name} has been successfully deleted.`,
        variant: "destructive",
      });
    } catch (err) {
      console.error('Error deleting system:', err);
      toast({
        title: "Error",
        description: "Failed to delete system. Please try again.",
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

  const getStatusCount = (status: string) => {
    return systems.filter(s => s.status === status).length;
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Systems Management</h1>
          <p className="text-gray-600 mt-1">Organize and manage vessel systems and equipment</p>
        </div>
        
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New System
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-gray-600">Total Systems</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Settings className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{pagination.totalItems}</div>
            <p className="text-xs text-gray-500 mt-1">Vessel systems</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-gray-600">Active Systems</CardTitle>
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
            <CardTitle className="text-sm font-medium text-gray-600">Critical Systems</CardTitle>
            <div className="p-2 bg-red-100 rounded-lg">
              <Badge className="bg-red-500 border-0 h-4 w-4 p-0" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {systems.filter(s => s.flag === 'Critical').length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Critical priority</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-gray-600">Recent Additions</CardTitle>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Plus className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {systems.filter(s => {
                const createdDate = new Date(s.createdOn);
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                return createdDate >= thirtyDaysAgo;
              }).length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Added in last 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <CardHeader className="border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-xl text-gray-900">Systems Directory</CardTitle>
              <CardDescription className="mt-1">
                {filteredSystems.length} {filteredSystems.length === 1 ? 'system' : 'systems'} found
              </CardDescription>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search systems..."
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
                    All Systems
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
            <MasterTable
              columns={([
                { header: <span className="font-semibold text-gray-700">System Name</span>, cell: (s) => (
                  <div>
                    <div className="font-semibold">{(s as any).name}</div>
                    {(s as any).ser && (
                      <div className="text-sm text-gray-500">SER: {(s as any).ser}</div>
                    )}
                  </div>
                ) },
                { header: <span className="font-semibold text-gray-700">Vendor</span>, cell: (s) => (s as any).vendor || '-' , className: 'text-gray-600' },
                { header: <span className="font-semibold text-gray-700">Flag</span>, cell: (s) => (s as any).flag ? getFlagBadge((s as any).flag) : '-' },
                { header: <span className="font-semibold text-gray-700">SOTR Type</span>, cell: (s) => (s as any).sotr_type || '-', className: 'text-gray-600' },
                { header: <span className="font-semibold text-gray-700">Status</span>, cell: (s) => getStatusBadge((s as any).status) },
              ] as unknown) as ColumnDefinition<any>[]}
              data={filteredSystems}
              rowKey={(s) => (s as any).id}
              loading={loading}
              error={error}
              onRetry={() => loadSystems(pagination.currentPage)}
              actionsHeader={<span className="font-semibold text-gray-700 text-right">Actions</span>}
              renderActions={(system) => (
                <ActionButtons
                  onEdit={() => handleEdit(system as any)}
                  onDelete={() => handleDelete(system as any)}
                  isSubmitting={isSubmitting}
                  hasEditPermission={true}
                  hasDeletePermission={true}
                  itemName={(system as any).name}
                />
              )}
              headerClassName="bg-gray-50"
            />
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

      {/* Add System Form */}
      <SystemForm
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAdd}
        system={null}
        title="Create New System"
        description="Add a new vessel system to the system. This system will be available for vessel configuration and maintenance."
        submitButtonText="Create System"
        isSubmitting={isSubmitting}
      />

      {/* Edit System Form */}
      <SystemForm
        isOpen={!!editingSystem}
        onClose={() => setEditingSystem(null)}
        onSubmit={handleUpdate}
        system={editingSystem}
        title="Edit System"
        description="Update the system information below. Click save when you're done."
        submitButtonText="Save Changes"
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={!!deletingSystem}
        onClose={() => setDeletingSystem(null)}
        onConfirm={handleConfirmDelete}
        title="Delete System"
        description="This action will permanently remove the system from the system."
        itemName={deletingSystem?.name || ''}
        isDeleting={isSubmitting}
      />
    </div>
  );
};

export default Systems;
