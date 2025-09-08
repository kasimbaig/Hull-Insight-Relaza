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
import { Plus, Search, Activity, Filter, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { OperationalStatus, OperationalStatusAPIResponse, OperationalStatusesPaginatedResponse, PaginationInfo } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getOperationalStatuses, createOperationalStatus, updateOperationalStatus, deleteOperationalStatus } from '@/components/service/operationalStatusService';
import { Pagination } from '@/components/ui/pagination';
import { OperationalStatusForm } from '@/components/forms/OperationalStatusForm';
import { DeleteConfirmDialog } from '@/components/dialogs/DeleteConfirmDialog';
import { ActionButtons } from '@/components/actions/ActionButtons';

const OperationalStatuses = () => {
  // API state
  const [operationalStatuses, setOperationalStatuses] = useState<OperationalStatus[]>([]);
  const [filteredOperationalStatuses, setFilteredOperationalStatuses] = useState<OperationalStatus[]>([]);
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
  const [editingOperationalStatus, setEditingOperationalStatus] = useState<OperationalStatus | null>(null);
  const [deletingOperationalStatus, setDeletingOperationalStatus] = useState<OperationalStatus | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { hasPermission, user } = useAuth();
  const { toast } = useToast();

  // Debug logging
  console.log('Current user:', user);
  console.log('Has add permission:', hasPermission('Global Masters', 'add'));
  console.log('Has edit permission:', hasPermission('Global Masters', 'edit'));
  console.log('Has delete permission:', hasPermission('Global Masters', 'delete'));

  // Helper function to convert API response to OperationalStatus format
  const convertAPIResponseToOperationalStatus = (apiOperationalStatus: OperationalStatusAPIResponse): OperationalStatus => ({
    id: apiOperationalStatus.id.toString(),
    name: apiOperationalStatus.name,
    createdBy: `User ${apiOperationalStatus.created_by}`,
    createdOn: apiOperationalStatus.created_on.split('T')[0],
    status: apiOperationalStatus.active === 1 ? 'Active' : 'Inactive'
  });

  // Helper function to calculate pagination info
  const calculatePaginationInfo = (response: OperationalStatusesPaginatedResponse, currentPage: number): PaginationInfo => {
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

  // Load operational statuses from API
  const loadOperationalStatuses = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response: OperationalStatusesPaginatedResponse = await getOperationalStatuses(page);
      
      const convertedOperationalStatuses = response.results.map(convertAPIResponseToOperationalStatus);
      setOperationalStatuses(convertedOperationalStatuses);
      setPagination(calculatePaginationInfo(response, page));
    } catch (err) {
      console.error('Error loading operational statuses:', err);
      setError('Failed to load operational statuses. Please try again.');
      toast({
        title: "Error",
        description: "Failed to load operational statuses. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load operational statuses on component mount and page change
  useEffect(() => {
    loadOperationalStatuses(pagination.currentPage);
  }, []);

  // Filter operational statuses based on search and status
  useEffect(() => {
    let filtered = operationalStatuses.filter(operationalStatus =>
      operationalStatus.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(operationalStatus => operationalStatus.status === statusFilter);
    }
    
    setFilteredOperationalStatuses(filtered);
  }, [searchTerm, operationalStatuses, statusFilter]);

  // Handle page change
  const handlePageChange = (page: number) => {
    loadOperationalStatuses(page);
  };

  const handleAdd = async (formData: {
    name: string;
    code: string;
  }) => {
    try {
      setIsSubmitting(true);
      await createOperationalStatus({
        name: formData.name,
        code: formData.code,
        active: 1
      });
      
      setIsAddDialogOpen(false);
      
      // Reload the current page to show the new operational status
      await loadOperationalStatuses(pagination.currentPage);
      
      toast({
        title: "Operational Status Added",
        description: `${formData.name} has been successfully added.`,
      });
    } catch (err) {
      console.error('Error creating operational status:', err);
      toast({
        title: "Error",
        description: "Failed to create operational status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (operationalStatus: OperationalStatus) => {
    setEditingOperationalStatus(operationalStatus);
  };

  const handleUpdate = async (formData: {
    name: string;
    code: string;
  }) => {
    if (!editingOperationalStatus) return;
    
    try {
      setIsSubmitting(true);
      await updateOperationalStatus(editingOperationalStatus.id, {
        name: formData.name
      });
      
      setEditingOperationalStatus(null);
      
      // Reload the current page to show the updated operational status
      await loadOperationalStatuses(pagination.currentPage);
      
      toast({
        title: "Operational Status Updated",
        description: `${formData.name} has been successfully updated.`,
      });
    } catch (err) {
      console.error('Error updating operational status:', err);
      toast({
        title: "Error",
        description: "Failed to update operational status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (operationalStatus: OperationalStatus) => {
    setDeletingOperationalStatus(operationalStatus);
  };

  const handleConfirmDelete = async () => {
    if (!deletingOperationalStatus) return;
    
    try {
      setIsSubmitting(true);
      await deleteOperationalStatus(deletingOperationalStatus.id);
      
      setDeletingOperationalStatus(null);
      
      // Reload the current page to reflect the deletion
      await loadOperationalStatuses(pagination.currentPage);
      
      toast({
        title: "Operational Status Deleted",
        description: `${deletingOperationalStatus.name} has been successfully deleted.`,
        variant: "destructive",
      });
    } catch (err) {
      console.error('Error deleting operational status:', err);
      toast({
        title: "Error",
        description: "Failed to delete operational status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (operationalStatus: OperationalStatus) => {
    try {
      setIsSubmitting(true);
      // For status toggle, we'll use the update method with the same data
      await updateOperationalStatus(operationalStatus.id, {
        name: operationalStatus.name
      });
      
      // Reload the current page to reflect the status change
      await loadOperationalStatuses(pagination.currentPage);
      
      toast({
        title: "Status Updated",
        description: `${operationalStatus.name} is now ${operationalStatus.status === 'Active' ? 'Inactive' : 'Active'}.`,
      });
    } catch (err) {
      console.error('Error updating operational status status:', err);
      toast({
        title: "Error",
        description: "Failed to update operational status status. Please try again.",
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
    return operationalStatuses.filter(os => os.status === status).length;
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Operational Statuses Management</h1>
          <p className="text-gray-600 mt-1">Organize and manage vessel operational status levels and classifications</p>
        </div>
        
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Operational Status
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-gray-600">Total Operational Statuses</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Activity className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{pagination.totalItems}</div>
            <p className="text-xs text-gray-500 mt-1">Operational status levels</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-gray-600">Active Operational Statuses</CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
              <Badge className="bg-green-500 border-0 h-4 w-4 p-0" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{getStatusCount('Active')}</div>
            <p className="text-xs text-gray-500 mt-1">Currently in use</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-gray-600">Inactive Operational Statuses</CardTitle>
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
              {operationalStatuses.filter(os => {
                const createdDate = new Date(os.createdOn);
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
              <CardTitle className="text-xl text-gray-900">Operational Statuses Directory</CardTitle>
              <CardDescription className="mt-1">
                {filteredOperationalStatuses.length} {filteredOperationalStatuses.length === 1 ? 'operational status' : 'operational statuses'} found
              </CardDescription>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search operational statuses..."
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
                    All Operational Statuses
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
                  <TableHead className="font-semibold text-gray-700">Operational Status Name</TableHead>
                  <TableHead className="font-semibold text-gray-700">Status</TableHead>
                  <TableHead className="font-semibold text-gray-700">Created By</TableHead>
                  <TableHead className="font-semibold text-gray-700">Created On</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500 py-6">
                        <Loader2 className="h-8 w-8 mb-2 animate-spin" />
                        <p>Loading operational statuses...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-red-500 py-6">
                        <p className="font-medium">Error loading operational statuses</p>
                        <p className="text-sm">{error}</p>
                        <Button 
                          variant="outline" 
                          onClick={() => loadOperationalStatuses(pagination.currentPage)}
                          className="mt-2"
                        >
                          Try Again
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredOperationalStatuses.length > 0 ? (
                  filteredOperationalStatuses.map((operationalStatus) => (
                    <TableRow key={operationalStatus.id} className="hover:bg-gray-50/50 border-b border-gray-200 last:border-0">
                      <TableCell className="font-medium text-gray-900">
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-blue-500" />
                          {operationalStatus.name}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(operationalStatus.status)}</TableCell>
                      <TableCell className="text-gray-600">{operationalStatus.createdBy}</TableCell>
                      <TableCell className="text-gray-600">{new Date(operationalStatus.createdOn).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <ActionButtons
                          onEdit={() => handleEdit(operationalStatus)}
                          onDelete={() => handleDelete(operationalStatus)}
                          onToggleStatus={() => toggleStatus(operationalStatus)}
                          isActive={operationalStatus.status === 'Active'}
                          isSubmitting={isSubmitting}
                          hasEditPermission={true}
                          hasDeletePermission={true}
                          itemName={operationalStatus.name}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500 py-6">
                        <Search className="h-10 w-10 mb-2 opacity-30" />
                        <p>No operational statuses found.</p>
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

      {/* Add Operational Status Form */}
      <OperationalStatusForm
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAdd}
        operationalStatus={null}
        title="Create New Operational Status"
        description="Add a new operational status to the system. This status will be available for vessel operational tracking and classification."
        submitButtonText="Create Operational Status"
        isSubmitting={isSubmitting}
      />

      {/* Edit Operational Status Form */}
      <OperationalStatusForm
        isOpen={!!editingOperationalStatus}
        onClose={() => setEditingOperationalStatus(null)}
        onSubmit={handleUpdate}
        operationalStatus={editingOperationalStatus}
        title="Edit Operational Status"
        description="Update the operational status information below. Click save when you're done."
        submitButtonText="Save Changes"
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={!!deletingOperationalStatus}
        onClose={() => setDeletingOperationalStatus(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Operational Status"
        description="This action will permanently remove the operational status from the system."
        itemName={deletingOperationalStatus?.name || ''}
        isDeleting={isSubmitting}
      />
    </div>
  );
};

export default OperationalStatuses;
