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
import { Plus, Search, Ship, Filter, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { VesselType, VesselTypeAPIResponse, VesselTypesPaginatedResponse, PaginationInfo } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getVesselTypes, createVesselType, updateVesselType, deleteVesselType } from '@/components/service/apiservice';
import { Pagination } from '@/components/ui/pagination';
import { VesselTypeForm } from '@/components/forms/VesselTypeForm';
import { DeleteConfirmDialog } from '@/components/dialogs/DeleteConfirmDialog';
import { ActionButtons } from '@/components/actions/ActionButtons';

const VesselTypes = () => {
  // API state
  const [vesselTypes, setVesselTypes] = useState<(VesselType & { code: string })[]>([]);
  const [filteredVesselTypes, setFilteredVesselTypes] = useState<(VesselType & { code: string })[]>([]);
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
  const [editingVesselType, setEditingVesselType] = useState<(VesselType & { code: string }) | null>(null);
  const [deletingVesselType, setDeletingVesselType] = useState<(VesselType & { code: string }) | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { hasPermission, user } = useAuth();
  const { toast } = useToast();

  // Debug logging
  console.log('Current user:', user);
  console.log('Has add permission:', hasPermission('Global Masters', 'add'));
  console.log('Has edit permission:', hasPermission('Global Masters', 'edit'));
  console.log('Has delete permission:', hasPermission('Global Masters', 'delete'));

  // Helper function to convert API response to VesselType format
  const convertAPIResponseToVesselType = (apiVesselType: VesselTypeAPIResponse): VesselType & { code: string } => ({
    id: apiVesselType.id.toString(),
    name: apiVesselType.name,
    code: apiVesselType.code,
    createdBy: `User ${apiVesselType.created_by}`,
    createdOn: apiVesselType.created_on.split('T')[0],
    status: apiVesselType.active === 1 ? 'Active' : 'Inactive'
  });

  // Helper function to calculate pagination info
  const calculatePaginationInfo = (response: VesselTypesPaginatedResponse, currentPage: number): PaginationInfo => {
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

  // Load vessel types from API
  const loadVesselTypes = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response: VesselTypesPaginatedResponse = await getVesselTypes(page);
      
      const convertedVesselTypes = response.results.map(convertAPIResponseToVesselType);
      setVesselTypes(convertedVesselTypes);
      setPagination(calculatePaginationInfo(response, page));
    } catch (err) {
      console.error('Error loading vessel types:', err);
      setError('Failed to load vessel types. Please try again.');
      toast({
        title: "Error",
        description: "Failed to load vessel types. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load vessel types on component mount and page change
  useEffect(() => {
    loadVesselTypes(pagination.currentPage);
  }, []);

  // Filter vessel types based on search and status
  useEffect(() => {
    let filtered = vesselTypes.filter(vesselType =>
      vesselType.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(vesselType => vesselType.status === statusFilter);
    }
    
    setFilteredVesselTypes(filtered);
  }, [searchTerm, vesselTypes, statusFilter]);

  // Handle page change
  const handlePageChange = (page: number) => {
    loadVesselTypes(page);
  };

  const handleAdd = async (formData: { name: string; code: string }) => {
    try {
      setIsSubmitting(true);
      await createVesselType({
        name: formData.name,
        code: formData.code,
        active: 1
      });
      
      setIsAddDialogOpen(false);
      
      // Reload the current page to show the new vessel type
      await loadVesselTypes(pagination.currentPage);
      
      toast({
        title: "Vessel Type Added",
        description: `${formData.name} has been successfully added.`,
      });
    } catch (err) {
      console.error('Error creating vessel type:', err);
      toast({
        title: "Error",
        description: "Failed to create vessel type. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (vesselType: VesselType & { code: string }) => {
    setEditingVesselType(vesselType);
  };

  const handleUpdate = async (formData: { name: string; code: string }) => {
    if (!editingVesselType) return;
    
    try {
      setIsSubmitting(true);
      await updateVesselType(editingVesselType.id, {
        name: formData.name,
        code: formData.code
      });
      
      setEditingVesselType(null);
      
      // Reload the current page to show the updated vessel type
      await loadVesselTypes(pagination.currentPage);
      
      toast({
        title: "Vessel Type Updated",
        description: `${formData.name} has been successfully updated.`,
      });
    } catch (err) {
      console.error('Error updating vessel type:', err);
      toast({
        title: "Error",
        description: "Failed to update vessel type. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (vesselType: VesselType & { code: string }) => {
    setDeletingVesselType(vesselType);
  };

  const handleConfirmDelete = async () => {
    if (!deletingVesselType) return;
    
    try {
      setIsSubmitting(true);
      await deleteVesselType(deletingVesselType.id);
      
      setDeletingVesselType(null);
      
      // Reload the current page to reflect the deletion
      await loadVesselTypes(pagination.currentPage);
      
      toast({
        title: "Vessel Type Deleted",
        description: `${deletingVesselType.name} has been successfully deleted.`,
        variant: "destructive",
      });
    } catch (err) {
      console.error('Error deleting vessel type:', err);
      toast({
        title: "Error",
        description: "Failed to delete vessel type. Please try again.",
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
    return vesselTypes.filter(v => v.status === status).length;
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vessel Types Management</h1>
          <p className="text-gray-600 mt-1">Organize and manage all vessel types and classifications</p>
        </div>
        
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Vessel Type
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-gray-600">Total Vessel Types</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Ship className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{pagination.totalItems}</div>
            <p className="text-xs text-gray-500 mt-1">Vessel classifications</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-gray-600">Active Vessel Types</CardTitle>
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
            <CardTitle className="text-sm font-medium text-gray-600">Inactive Vessel Types</CardTitle>
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
              {vesselTypes.filter(v => {
                const createdDate = new Date(v.createdOn);
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
              <CardTitle className="text-xl text-gray-900">Vessel Types Directory</CardTitle>
              <CardDescription className="mt-1">
                {filteredVesselTypes.length} {filteredVesselTypes.length === 1 ? 'vessel type' : 'vessel types'} found
              </CardDescription>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search vessel types..."
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
                    All Vessel Types
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
                  <TableHead className="font-semibold text-gray-700">Vessel Type Name</TableHead>
                  <TableHead className="font-semibold text-gray-700">Code</TableHead>
                  <TableHead className="font-semibold text-gray-700">Status</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500 py-6">
                        <Loader2 className="h-8 w-8 mb-2 animate-spin" />
                        <p>Loading vessel types...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-red-500 py-6">
                        <p className="font-medium">Error loading vessel types</p>
                        <p className="text-sm">{error}</p>
                        <Button 
                          variant="outline" 
                          onClick={() => loadVesselTypes(pagination.currentPage)}
                          className="mt-2"
                        >
                          Try Again
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredVesselTypes.length > 0 ? (
                  filteredVesselTypes.map((vesselType) => (
                    <TableRow key={vesselType.id} className="hover:bg-gray-50/50 border-b border-gray-200 last:border-0">
                      <TableCell className="font-medium text-gray-900">{vesselType.name}</TableCell>
                      <TableCell className="text-gray-600 font-mono text-sm">{vesselType.code || '-'}</TableCell>
                      <TableCell>{getStatusBadge(vesselType.status)}</TableCell>
                      <TableCell className="text-right">
                        <ActionButtons
                          onEdit={() => handleEdit(vesselType)}
                          onDelete={() => handleDelete(vesselType)}
                          isSubmitting={isSubmitting}
                          hasEditPermission={true}
                          hasDeletePermission={true}
                          itemName={vesselType.name}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500 py-6">
                        <Search className="h-10 w-10 mb-2 opacity-30" />
                        <p>No vessel types found.</p>
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

      {/* Add Vessel Type Form */}
      <VesselTypeForm
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAdd}
        vesselType={null}
        title="Create New Vessel Type"
        description="Add a new vessel type to the system. This vessel type will be available for vessel classification."
        submitButtonText="Create Vessel Type"
        isSubmitting={isSubmitting}
      />

      {/* Edit Vessel Type Form */}
      <VesselTypeForm
        isOpen={!!editingVesselType}
        onClose={() => setEditingVesselType(null)}
        onSubmit={handleUpdate}
        vesselType={editingVesselType}
        title="Edit Vessel Type"
        description="Update the vessel type information below. Click save when you're done."
        submitButtonText="Save Changes"
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={!!deletingVesselType}
        onClose={() => setDeletingVesselType(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Vessel Type"
        description="This action will permanently remove the vessel type from the system."
        itemName={deletingVesselType?.name || ''}
        isDeleting={isSubmitting}
      />
    </div>
  );
};

export default VesselTypes;
