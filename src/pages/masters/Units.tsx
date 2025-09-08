import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
} from '@/components/ui/table';
import { Plus, Search, MapPin, Filter, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Unit, UnitAPIResponse, UnitsPaginatedResponse, PaginationInfo } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getUnits, createUnit, updateUnit, deleteUnit } from '@/components/service/apiservice';
import { Pagination } from '@/components/ui/pagination';
import MasterTable, { ColumnDefinition } from '@/components/common/MasterTable';
import { UnitForm } from '@/components/forms/UnitForm';
import { DeleteConfirmDialog } from '@/components/dialogs/DeleteConfirmDialog';
import { ActionButtons } from '@/components/actions/ActionButtons';

const Units = () => {
  // API state
  const [units, setUnits] = useState<Unit[]>([]);
  const [filteredUnits, setFilteredUnits] = useState<Unit[]>([]);
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
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [deletingUnit, setDeletingUnit] = useState<Unit | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { hasPermission, user } = useAuth();
  const { toast } = useToast();

  // Debug logging
  console.log('Current user:', user);
  console.log('Has add permission:', hasPermission('Global Masters', 'add'));
  console.log('Has edit permission:', hasPermission('Global Masters', 'edit'));
  console.log('Has delete permission:', hasPermission('Global Masters', 'delete'));

  // Helper function to convert API response to Unit format
  const convertAPIResponseToUnit = (apiUnit: UnitAPIResponse): Unit => ({
    id: apiUnit.id.toString(),
    name: apiUnit.name,
    createdBy: `User ${apiUnit.created_by}`,
    createdOn: apiUnit.created_on.split('T')[0],
    status: apiUnit.active === 1 ? 'Active' : 'Inactive'
  });

  // Helper function to calculate pagination info
  const calculatePaginationInfo = (response: UnitsPaginatedResponse, currentPage: number): PaginationInfo => {
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

  // Load units from API
  const loadUnits = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getUnits(page);
      
      // Handle the actual API response structure: { status: 200, data: [...] }
      let unitsData: UnitAPIResponse[] = [];
      if (response && response.data && Array.isArray(response.data)) {
        unitsData = response.data;
      } else if (response && response.results && Array.isArray(response.results)) {
        // Fallback for paginated response structure
        unitsData = response.results;
      } else if (Array.isArray(response)) {
        // Fallback for direct array response
        unitsData = response;
      } else {
        console.warn('Unexpected API response structure:', response);
        unitsData = [];
      }
      
      const convertedUnits = unitsData.map(convertAPIResponseToUnit);
      setUnits(convertedUnits);
      
      // For non-paginated response, set basic pagination info
      setPagination({
        currentPage: 1,
        totalPages: 1,
        hasNext: false,
        hasPrevious: false,
        totalItems: convertedUnits.length
      });
    } catch (err) {
      console.error('Error loading units:', err);
      setError('Failed to load units. Please try again.');
      toast({
        title: "Error",
        description: "Failed to load units. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load units on component mount and page change
  useEffect(() => {
    loadUnits(pagination.currentPage);
  }, []);

  // Filter units based on search and status
  useEffect(() => {
    let filtered = units.filter(unit =>
      unit.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(unit => unit.status === statusFilter);
    }
    
    setFilteredUnits(filtered);
  }, [searchTerm, units, statusFilter]);

  // Handle page change
  const handlePageChange = (page: number) => {
    loadUnits(page);
  };

  const handleAdd = async (formData: { name: string; code: string }) => {
    try {
      setIsSubmitting(true);
      await createUnit({
        name: formData.name,
        code: formData.code,
        active: 1
      });
      
      setIsAddDialogOpen(false);
      
      // Reload the current page to show the new unit
      await loadUnits(pagination.currentPage);
      
      toast({
        title: "Unit Added",
        description: `${formData.name} has been successfully added.`,
      });
    } catch (err) {
      console.error('Error creating unit:', err);
      toast({
        title: "Error",
        description: "Failed to create unit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (unit: Unit) => {
    setEditingUnit(unit);
  };

  const handleUpdate = async (formData: { name: string; code: string }) => {
    if (!editingUnit) return;
    
    try {
      setIsSubmitting(true);
      await updateUnit(editingUnit.id, {
        name: formData.name
      });
      
      setEditingUnit(null);
      
      // Reload the current page to show the updated unit
      await loadUnits(pagination.currentPage);
      
      toast({
        title: "Unit Updated",
        description: `${formData.name} has been successfully updated.`,
      });
    } catch (err) {
      console.error('Error updating unit:', err);
      toast({
        title: "Error",
        description: "Failed to update unit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (unit: Unit) => {
    setDeletingUnit(unit);
  };

  const handleConfirmDelete = async () => {
    if (!deletingUnit) return;
    
    try {
      setIsSubmitting(true);
      await deleteUnit(deletingUnit.id);
      
      setDeletingUnit(null);
      
      // Reload the current page to reflect the deletion
      await loadUnits(pagination.currentPage);
      
      toast({
        title: "Unit Deleted",
        description: `${deletingUnit.name} has been successfully deleted.`,
        variant: "destructive",
      });
    } catch (err) {
      console.error('Error deleting unit:', err);
      toast({
        title: "Error",
        description: "Failed to delete unit. Please try again.",
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

  const getStatusCount = (status: string) => {
    return units.filter(u => u.status === status).length;
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Units Management</h1>
          <p className="text-gray-600 mt-1">Organize and manage all organizational units</p>
        </div>
        
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Unit
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-gray-600">Total Units</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <MapPin className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{units.length}</div>
            <p className="text-xs text-gray-500 mt-1">Organizational units</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-gray-600">Active Units</CardTitle>
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
            <CardTitle className="text-sm font-medium text-gray-600">Inactive Units</CardTitle>
            <div className="p-2 bg-gray-100 rounded-lg">
              <Badge variant="outline" className="h-4 w-4 p-0 bg-gray-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{getStatusCount('Inactive')}</div>
            <p className="text-xs text-gray-500 mt-1">Not currently active</p>
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
              {units.filter(u => {
                const createdDate = new Date(u.createdOn);
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
              <CardTitle className="text-xl text-gray-900">Units Directory</CardTitle>
              <CardDescription className="mt-1">
                {filteredUnits.length} {filteredUnits.length === 1 ? 'unit' : 'units'} found
              </CardDescription>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search units..."
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
                    All Units
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
                { header: <span className="font-semibold text-gray-700">Unit Name</span>, accessor: 'name', className: 'font-medium text-gray-900' },
                { header: <span className="font-semibold text-gray-700">Status</span>, cell: (u) => getStatusBadge((u as any).status) },
              ] as unknown) as ColumnDefinition<any>[]}
              data={filteredUnits}
              rowKey={(u) => (u as any).id}
              loading={loading}
              error={error}
              onRetry={() => loadUnits(pagination.currentPage)}
              actionsHeader={<span className="font-semibold text-gray-700 text-right">Actions</span>}
              renderActions={(unit) => (
                <ActionButtons
                  onEdit={() => handleEdit(unit as any)}
                  onDelete={() => handleDelete(unit as any)}
                  isSubmitting={isSubmitting}
                  hasEditPermission={true}
                  hasDeletePermission={true}
                  itemName={(unit as any).name}
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

      {/* Add Unit Form */}
      <UnitForm
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAdd}
        unit={null}
        title="Create New Unit"
        description="Add a new organizational unit to the system. This unit will be available for assignment across platforms."
        submitButtonText="Create Unit"
        isSubmitting={isSubmitting}
      />

      {/* Edit Unit Form */}
      <UnitForm
        isOpen={!!editingUnit}
        onClose={() => setEditingUnit(null)}
        onSubmit={handleUpdate}
        unit={editingUnit}
        title="Edit Unit"
        description="Update the unit information below. Click save when you're done."
        submitButtonText="Save Changes"
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={!!deletingUnit}
        onClose={() => setDeletingUnit(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Unit"
        description="This action will permanently remove the unit from the system."
        itemName={deletingUnit?.name || ''}
        isDeleting={isSubmitting}
      />
    </div>
  );
};

export default Units;