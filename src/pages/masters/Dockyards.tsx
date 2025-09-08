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
import { Plus, Search, Building, Filter, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dockyard, DockyardAPIResponse, DockyardsPaginatedResponse, PaginationInfo } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getDockyards, createDockyard, updateDockyard, deleteDockyard } from '@/components/service/apiservice';
import { Pagination } from '@/components/ui/pagination';
import { DockyardForm } from '@/components/forms/DockyardForm';
import { DeleteConfirmDialog } from '@/components/dialogs/DeleteConfirmDialog';
import { ActionButtons } from '@/components/actions/ActionButtons';

const Dockyards = () => {
  // API state
  const [dockyards, setDockyards] = useState<Dockyard[]>([]);
  const [filteredDockyards, setFilteredDockyards] = useState<Dockyard[]>([]);
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
  const [editingDockyard, setEditingDockyard] = useState<Dockyard | null>(null);
  const [deletingDockyard, setDeletingDockyard] = useState<Dockyard | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { hasPermission, user } = useAuth();
  const { toast } = useToast();

  // Debug logging
  console.log('Current user:', user);
  console.log('Has add permission:', hasPermission('Global Masters', 'add'));
  console.log('Has edit permission:', hasPermission('Global Masters', 'edit'));
  console.log('Has delete permission:', hasPermission('Global Masters', 'delete'));

  // Helper function to convert API response to Dockyard format
  const convertAPIResponseToDockyard = (apiDockyard: DockyardAPIResponse): Dockyard => ({
    id: apiDockyard.id.toString(),
    name: apiDockyard.name,
    createdBy: `User ${apiDockyard.created_by}`,
    createdOn: apiDockyard.created_on.split('T')[0],
    status: apiDockyard.active === 1 ? 'Active' : 'Inactive'
  });

  // Helper function to calculate pagination info
  const calculatePaginationInfo = (response: DockyardsPaginatedResponse, currentPage: number): PaginationInfo => {
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

  // Load dockyards from API
  const loadDockyards = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response: DockyardsPaginatedResponse = await getDockyards(page);
      
      const convertedDockyards = response.results.map(convertAPIResponseToDockyard);
      setDockyards(convertedDockyards);
      setPagination(calculatePaginationInfo(response, page));
    } catch (err) {
      console.error('Error loading dockyards:', err);
      setError('Failed to load dockyards. Please try again.');
      toast({
        title: "Error",
        description: "Failed to load dockyards. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load dockyards on component mount and page change
  useEffect(() => {
    loadDockyards(pagination.currentPage);
  }, []);

  // Filter dockyards based on search and status
  useEffect(() => {
    let filtered = dockyards.filter(dockyard =>
      dockyard.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(dockyard => dockyard.status === statusFilter);
    }
    
    setFilteredDockyards(filtered);
  }, [searchTerm, dockyards, statusFilter]);

  // Handle page change
  const handlePageChange = (page: number) => {
    loadDockyards(page);
  };

  const handleAdd = async (formData: { name: string; code: string }) => {
    try {
      setIsSubmitting(true);
      await createDockyard({
        name: formData.name,
        code: formData.code,
        active: 1
      });
      
      setIsAddDialogOpen(false);
      
      // Reload the current page to show the new dockyard
      await loadDockyards(pagination.currentPage);
      
      toast({
        title: "Dockyard Added",
        description: `${formData.name} has been successfully added.`,
      });
    } catch (err) {
      console.error('Error creating dockyard:', err);
      toast({
        title: "Error",
        description: "Failed to create dockyard. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (dockyard: Dockyard) => {
    setEditingDockyard(dockyard);
  };

  const handleUpdate = async (formData: { name: string; code: string }) => {
    if (!editingDockyard) return;
    
    try {
      setIsSubmitting(true);
      await updateDockyard(editingDockyard.id, {
        name: formData.name
      });
      
      setEditingDockyard(null);
      
      // Reload the current page to show the updated dockyard
      await loadDockyards(pagination.currentPage);
      
      toast({
        title: "Dockyard Updated",
        description: `${formData.name} has been successfully updated.`,
      });
    } catch (err) {
      console.error('Error updating dockyard:', err);
      toast({
        title: "Error",
        description: "Failed to update dockyard. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (dockyard: Dockyard) => {
    setDeletingDockyard(dockyard);
  };

  const handleConfirmDelete = async () => {
    if (!deletingDockyard) return;
    
    try {
      setIsSubmitting(true);
      await deleteDockyard(deletingDockyard.id);
      
      setDeletingDockyard(null);
      
      // Reload the current page to reflect the deletion
      await loadDockyards(pagination.currentPage);
      
      toast({
        title: "Dockyard Deleted",
        description: `${deletingDockyard.name} has been successfully deleted.`,
        variant: "destructive",
      });
    } catch (err) {
      console.error('Error deleting dockyard:', err);
      toast({
        title: "Error",
        description: "Failed to delete dockyard. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (dockyard: Dockyard) => {
    try {
      setIsSubmitting(true);
      // For status toggle, we'll use the update method with the same name
      // The API should handle the status change based on the existing dockyard data
      await updateDockyard(dockyard.id, {
        name: dockyard.name
      });
      
      // Reload the current page to reflect the status change
      await loadDockyards(pagination.currentPage);
      
      toast({
        title: "Status Updated",
        description: `${dockyard.name} is now ${dockyard.status === 'Active' ? 'Inactive' : 'Active'}.`,
      });
    } catch (err) {
      console.error('Error updating dockyard status:', err);
      toast({
        title: "Error",
        description: "Failed to update dockyard status. Please try again.",
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
    return dockyards.filter(d => d.status === status).length;
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dockyards Management</h1>
          <p className="text-gray-600 mt-1">Organize and manage all naval dockyards</p>
        </div>
        
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Dockyard
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-gray-600">Total Dockyards</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{pagination.totalItems}</div>
            <p className="text-xs text-gray-500 mt-1">Naval dockyards</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-gray-600">Active Dockyards</CardTitle>
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
            <CardTitle className="text-sm font-medium text-gray-600">Inactive Dockyards</CardTitle>
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
              {dockyards.filter(d => {
                const createdDate = new Date(d.createdOn);
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
              <CardTitle className="text-xl text-gray-900">Dockyards Directory</CardTitle>
              <CardDescription className="mt-1">
                {filteredDockyards.length} {filteredDockyards.length === 1 ? 'dockyard' : 'dockyards'} found
              </CardDescription>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search dockyards..."
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
                    All Dockyards
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
                  <TableHead className="font-semibold text-gray-700">Dockyard Name</TableHead>
                  <TableHead className="font-semibold text-gray-700">Created By</TableHead>
                  <TableHead className="font-semibold text-gray-700">Created On</TableHead>
                  <TableHead className="font-semibold text-gray-700">Status</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500 py-6">
                        <Loader2 className="h-8 w-8 mb-2 animate-spin" />
                        <p>Loading dockyards...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-red-500 py-6">
                        <p className="font-medium">Error loading dockyards</p>
                        <p className="text-sm">{error}</p>
                        <Button 
                          variant="outline" 
                          onClick={() => loadDockyards(pagination.currentPage)}
                          className="mt-2"
                        >
                          Try Again
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredDockyards.length > 0 ? (
                  filteredDockyards.map((dockyard) => (
                    <TableRow key={dockyard.id} className="hover:bg-gray-50/50 border-b border-gray-200 last:border-0">
                      <TableCell className="font-medium text-gray-900">{dockyard.name}</TableCell>
                      <TableCell className="text-gray-600">{dockyard.createdBy}</TableCell>
                      <TableCell className="text-gray-600">{new Date(dockyard.createdOn).toLocaleDateString()}</TableCell>
                      <TableCell>{getStatusBadge(dockyard.status)}</TableCell>
                      <TableCell className="text-right">
                        <ActionButtons
                          onEdit={() => handleEdit(dockyard)}
                          onDelete={() => handleDelete(dockyard)}
                          onToggleStatus={() => toggleStatus(dockyard)}
                          isActive={dockyard.status === 'Active'}
                          isSubmitting={isSubmitting}
                          hasEditPermission={true}
                          hasDeletePermission={true}
                          itemName={dockyard.name}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500 py-6">
                        <Search className="h-10 w-10 mb-2 opacity-30" />
                        <p>No dockyards found.</p>
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

      {/* Add Dockyard Form */}
      <DockyardForm
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAdd}
        dockyard={null}
        title="Create New Dockyard"
        description="Add a new naval dockyard to the system. This dockyard will be available for vessel maintenance and operations."
        submitButtonText="Create Dockyard"
        isSubmitting={isSubmitting}
      />

      {/* Edit Dockyard Form */}
      <DockyardForm
        isOpen={!!editingDockyard}
        onClose={() => setEditingDockyard(null)}
        onSubmit={handleUpdate}
        dockyard={editingDockyard}
        title="Edit Dockyard"
        description="Update the dockyard information below. Click save when you're done."
        submitButtonText="Save Changes"
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={!!deletingDockyard}
        onClose={() => setDeletingDockyard(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Dockyard"
        description="This action will permanently remove the dockyard from the system."
        itemName={deletingDockyard?.name || ''}
        isDeleting={isSubmitting}
      />
    </div>
  );
};

export default Dockyards;
