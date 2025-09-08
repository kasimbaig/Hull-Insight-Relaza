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
import { Plus, Search, Building2, Filter, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Compartment, CompartmentAPIResponse, CompartmentsPaginatedResponse, PaginationInfo } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getCompartments, createCompartment, updateCompartment, deleteCompartment } from '@/components/service/compartmentService';
import { Pagination } from '@/components/ui/pagination';
import { CompartmentForm } from '@/components/forms/CompartmentForm';
import { DeleteConfirmDialog } from '@/components/dialogs/DeleteConfirmDialog';
import { ActionButtons } from '@/components/actions/ActionButtons';

const Compartments = () => {
  // API state
  const [compartments, setCompartments] = useState<Compartment[]>([]);
  const [filteredCompartments, setFilteredCompartments] = useState<Compartment[]>([]);
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
  const [editingCompartment, setEditingCompartment] = useState<Compartment | null>(null);
  const [deletingCompartment, setDeletingCompartment] = useState<Compartment | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { hasPermission, user } = useAuth();
  const { toast } = useToast();

  // Debug logging
  console.log('Current user:', user);
  console.log('Has add permission:', hasPermission('Global Masters', 'add'));
  console.log('Has edit permission:', hasPermission('Global Masters', 'edit'));
  console.log('Has delete permission:', hasPermission('Global Masters', 'delete'));

  // Helper function to convert API response to Compartment format
  const convertAPIResponseToCompartment = (apiCompartment: CompartmentAPIResponse): Compartment => ({
    id: apiCompartment.id.toString(),
    name: apiCompartment.name,
    createdBy: `User ${apiCompartment.created_by}`,
    createdOn: apiCompartment.created_on.split('T')[0],
    status: apiCompartment.active === 1 ? 'Active' : 'Inactive',
    remark: apiCompartment.remark,
    ser: apiCompartment.ser,
    numbers: apiCompartment.numbers,
    location: apiCompartment.location,
    equipment: apiCompartment.equipment,
    features: apiCompartment.features,
    layout: apiCompartment.layout,
    special_requirements: apiCompartment.special_requirements,
    standards: apiCompartment.standards
  });

  // Helper function to calculate pagination info
  const calculatePaginationInfo = (response: CompartmentsPaginatedResponse, currentPage: number): PaginationInfo => {
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

  // Load compartments from API
  const loadCompartments = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response: CompartmentsPaginatedResponse = await getCompartments(page);
      
      const convertedCompartments = response.results.map(convertAPIResponseToCompartment);
      setCompartments(convertedCompartments);
      setPagination(calculatePaginationInfo(response, page));
    } catch (err) {
      console.error('Error loading compartments:', err);
      setError('Failed to load compartments. Please try again.');
      toast({
        title: "Error",
        description: "Failed to load compartments. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load compartments on component mount and page change
  useEffect(() => {
    loadCompartments(pagination.currentPage);
  }, []);

  // Filter compartments based on search and status
  useEffect(() => {
    let filtered = compartments.filter(compartment =>
      compartment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      compartment.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      compartment.equipment?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(compartment => compartment.status === statusFilter);
    }
    
    setFilteredCompartments(filtered);
  }, [searchTerm, compartments, statusFilter]);

  // Handle page change
  const handlePageChange = (page: number) => {
    loadCompartments(page);
  };

  const handleAdd = async (formData: {
    name: string;
    code: string;
    remark: string;
    ser: string;
    numbers: string;
    location: string;
    equipment: string;
    features: string;
    layout: string;
    special_requirements: string;
    standards: string;
  }) => {
    try {
      setIsSubmitting(true);
      await createCompartment({
        name: formData.name,
        code: formData.code,
        remark: formData.remark,
        ser: formData.ser,
        numbers: formData.numbers,
        location: formData.location,
        equipment: formData.equipment,
        features: formData.features,
        layout: formData.layout,
        special_requirements: formData.special_requirements,
        standards: formData.standards,
        active: 1
      });
      
      setIsAddDialogOpen(false);
      
      // Reload the current page to show the new compartment
      await loadCompartments(pagination.currentPage);
      
      toast({
        title: "Compartment Added",
        description: `${formData.name} has been successfully added.`,
      });
    } catch (err) {
      console.error('Error creating compartment:', err);
      toast({
        title: "Error",
        description: "Failed to create compartment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (compartment: Compartment) => {
    setEditingCompartment(compartment);
  };

  const handleUpdate = async (formData: {
    name: string;
    code: string;
    remark: string;
    ser: string;
    numbers: string;
    location: string;
    equipment: string;
    features: string;
    layout: string;
    special_requirements: string;
    standards: string;
  }) => {
    if (!editingCompartment) return;
    
    try {
      setIsSubmitting(true);
      await updateCompartment(editingCompartment.id, {
        name: formData.name,
        remark: formData.remark,
        ser: formData.ser,
        numbers: formData.numbers,
        location: formData.location,
        equipment: formData.equipment,
        features: formData.features,
        layout: formData.layout,
        special_requirements: formData.special_requirements,
        standards: formData.standards
      });
      
      setEditingCompartment(null);
      
      // Reload the current page to show the updated compartment
      await loadCompartments(pagination.currentPage);
      
      toast({
        title: "Compartment Updated",
        description: `${formData.name} has been successfully updated.`,
      });
    } catch (err) {
      console.error('Error updating compartment:', err);
      toast({
        title: "Error",
        description: "Failed to update compartment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (compartment: Compartment) => {
    setDeletingCompartment(compartment);
  };

  const handleConfirmDelete = async () => {
    if (!deletingCompartment) return;
    
    try {
      setIsSubmitting(true);
      await deleteCompartment(deletingCompartment.id);
      
      setDeletingCompartment(null);
      
      // Reload the current page to reflect the deletion
      await loadCompartments(pagination.currentPage);
      
      toast({
        title: "Compartment Deleted",
        description: `${deletingCompartment.name} has been successfully deleted.`,
        variant: "destructive",
      });
    } catch (err) {
      console.error('Error deleting compartment:', err);
      toast({
        title: "Error",
        description: "Failed to delete compartment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (compartment: Compartment) => {
    try {
      setIsSubmitting(true);
      // For status toggle, we'll use the update method with the same data
      await updateCompartment(compartment.id, {
        name: compartment.name,
        remark: compartment.remark || '',
        ser: compartment.ser || '',
        numbers: compartment.numbers || '',
        location: compartment.location || '',
        equipment: compartment.equipment || '',
        features: compartment.features || '',
        layout: compartment.layout || '',
        special_requirements: compartment.special_requirements || '',
        standards: compartment.standards || ''
      });
      
      // Reload the current page to reflect the status change
      await loadCompartments(pagination.currentPage);
      
      toast({
        title: "Status Updated",
        description: `${compartment.name} is now ${compartment.status === 'Active' ? 'Inactive' : 'Active'}.`,
      });
    } catch (err) {
      console.error('Error updating compartment status:', err);
      toast({
        title: "Error",
        description: "Failed to update compartment status. Please try again.",
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
    return compartments.filter(c => c.status === status).length;
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Compartments Management</h1>
          <p className="text-gray-600 mt-1">Organize and manage vessel compartments and spaces</p>
        </div>
        
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Compartment
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-gray-600">Total Compartments</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{pagination.totalItems}</div>
            <p className="text-xs text-gray-500 mt-1">Vessel compartments</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-gray-600">Active Compartments</CardTitle>
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
            <CardTitle className="text-sm font-medium text-gray-600">Inactive Compartments</CardTitle>
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
              {compartments.filter(c => {
                const createdDate = new Date(c.createdOn);
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
              <CardTitle className="text-xl text-gray-900">Compartments Directory</CardTitle>
              <CardDescription className="mt-1">
                {filteredCompartments.length} {filteredCompartments.length === 1 ? 'compartment' : 'compartments'} found
              </CardDescription>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search compartments..."
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
                    All Compartments
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
                  <TableHead className="font-semibold text-gray-700">Compartment Name</TableHead>
                  <TableHead className="font-semibold text-gray-700">Location</TableHead>
                  <TableHead className="font-semibold text-gray-700">SER</TableHead>
                  <TableHead className="font-semibold text-gray-700">Status</TableHead>
                  <TableHead className="font-semibold text-gray-700">Created By</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500 py-6">
                        <Loader2 className="h-8 w-8 mb-2 animate-spin" />
                        <p>Loading compartments...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-red-500 py-6">
                        <p className="font-medium">Error loading compartments</p>
                        <p className="text-sm">{error}</p>
                        <Button 
                          variant="outline" 
                          onClick={() => loadCompartments(pagination.currentPage)}
                          className="mt-2"
                        >
                          Try Again
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredCompartments.length > 0 ? (
                  filteredCompartments.map((compartment) => (
                    <TableRow key={compartment.id} className="hover:bg-gray-50/50 border-b border-gray-200 last:border-0">
                      <TableCell className="font-medium text-gray-900">
                        <div>
                          <div className="font-semibold">{compartment.name}</div>
                          {compartment.numbers && (
                            <div className="text-sm text-gray-500">Numbers: {compartment.numbers}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {compartment.location || '-'}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {compartment.ser || '-'}
                      </TableCell>
                      <TableCell>{getStatusBadge(compartment.status)}</TableCell>
                      <TableCell className="text-gray-600">{compartment.createdBy}</TableCell>
                      <TableCell className="text-right">
                        <ActionButtons
                          onEdit={() => handleEdit(compartment)}
                          onDelete={() => handleDelete(compartment)}
                          onToggleStatus={() => toggleStatus(compartment)}
                          isActive={compartment.status === 'Active'}
                          isSubmitting={isSubmitting}
                          hasEditPermission={true}
                          hasDeletePermission={true}
                          itemName={compartment.name}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500 py-6">
                        <Search className="h-10 w-10 mb-2 opacity-30" />
                        <p>No compartments found.</p>
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

      {/* Add Compartment Form */}
      <CompartmentForm
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAdd}
        compartment={null}
        title="Create New Compartment"
        description="Add a new vessel compartment to the system. This compartment will be available for vessel configuration and maintenance."
        submitButtonText="Create Compartment"
        isSubmitting={isSubmitting}
      />

      {/* Edit Compartment Form */}
      <CompartmentForm
        isOpen={!!editingCompartment}
        onClose={() => setEditingCompartment(null)}
        onSubmit={handleUpdate}
        compartment={editingCompartment}
        title="Edit Compartment"
        description="Update the compartment information below. Click save when you're done."
        submitButtonText="Save Changes"
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={!!deletingCompartment}
        onClose={() => setDeletingCompartment(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Compartment"
        description="This action will permanently remove the compartment from the system."
        itemName={deletingCompartment?.name || ''}
        isDeleting={isSubmitting}
      />
    </div>
  );
};

export default Compartments;
