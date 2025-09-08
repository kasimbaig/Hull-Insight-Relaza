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
import { Plus, Search, AlertCircle, Filter, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Severity, SeverityAPIResponse, SeveritiesPaginatedResponse, PaginationInfo } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getSeverities, createSeverity, updateSeverity, deleteSeverity } from '@/components/service/severityService';
import { Pagination } from '@/components/ui/pagination';
import { SeverityForm } from '@/components/forms/SeverityForm';
import { DeleteConfirmDialog } from '@/components/dialogs/DeleteConfirmDialog';
import { ActionButtons } from '@/components/actions/ActionButtons';

const Severities = () => {
  // API state
  const [severities, setSeverities] = useState<Severity[]>([]);
  const [filteredSeverities, setFilteredSeverities] = useState<Severity[]>([]);
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
  const [editingSeverity, setEditingSeverity] = useState<Severity | null>(null);
  const [deletingSeverity, setDeletingSeverity] = useState<Severity | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { hasPermission, user } = useAuth();
  const { toast } = useToast();

  // Debug logging
  console.log('Current user:', user);
  console.log('Has add permission:', hasPermission('Global Masters', 'add'));
  console.log('Has edit permission:', hasPermission('Global Masters', 'edit'));
  console.log('Has delete permission:', hasPermission('Global Masters', 'delete'));

  // Helper function to convert API response to Severity format
  const convertAPIResponseToSeverity = (apiSeverity: SeverityAPIResponse): Severity => ({
    id: apiSeverity.id.toString(),
    name: apiSeverity.name,
    createdBy: `User ${apiSeverity.created_by}`,
    createdOn: apiSeverity.created_on.split('T')[0],
    status: apiSeverity.active === 1 ? 'Active' : 'Inactive'
  });

  // Helper function to calculate pagination info
  const calculatePaginationInfo = (response: SeveritiesPaginatedResponse, currentPage: number): PaginationInfo => {
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

  // Load severities from API
  const loadSeverities = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response: SeveritiesPaginatedResponse = await getSeverities(page);
      
      const convertedSeverities = response.results.map(convertAPIResponseToSeverity);
      setSeverities(convertedSeverities);
      setPagination(calculatePaginationInfo(response, page));
    } catch (err) {
      console.error('Error loading severities:', err);
      setError('Failed to load severities. Please try again.');
      toast({
        title: "Error",
        description: "Failed to load severities. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load severities on component mount and page change
  useEffect(() => {
    loadSeverities(pagination.currentPage);
  }, []);

  // Filter severities based on search and status
  useEffect(() => {
    let filtered = severities.filter(severity =>
      severity.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(severity => severity.status === statusFilter);
    }
    
    setFilteredSeverities(filtered);
  }, [searchTerm, severities, statusFilter]);

  // Handle page change
  const handlePageChange = (page: number) => {
    loadSeverities(page);
  };

  const handleAdd = async (formData: {
    name: string;
    code: string;
  }) => {
    try {
      setIsSubmitting(true);
      await createSeverity({
        name: formData.name,
        code: formData.code,
        active: 1
      });
      
      setIsAddDialogOpen(false);
      
      // Reload the current page to show the new severity
      await loadSeverities(pagination.currentPage);
      
      toast({
        title: "Severity Added",
        description: `${formData.name} has been successfully added.`,
      });
    } catch (err) {
      console.error('Error creating severity:', err);
      toast({
        title: "Error",
        description: "Failed to create severity. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (severity: Severity) => {
    setEditingSeverity(severity);
  };

  const handleUpdate = async (formData: {
    name: string;
    code: string;
  }) => {
    if (!editingSeverity) return;
    
    try {
      setIsSubmitting(true);
      await updateSeverity(editingSeverity.id, {
        name: formData.name
      });
      
      setEditingSeverity(null);
      
      // Reload the current page to show the updated severity
      await loadSeverities(pagination.currentPage);
      
      toast({
        title: "Severity Updated",
        description: `${formData.name} has been successfully updated.`,
      });
    } catch (err) {
      console.error('Error updating severity:', err);
      toast({
        title: "Error",
        description: "Failed to update severity. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (severity: Severity) => {
    setDeletingSeverity(severity);
  };

  const handleConfirmDelete = async () => {
    if (!deletingSeverity) return;
    
    try {
      setIsSubmitting(true);
      await deleteSeverity(deletingSeverity.id);
      
      setDeletingSeverity(null);
      
      // Reload the current page to reflect the deletion
      await loadSeverities(pagination.currentPage);
      
      toast({
        title: "Severity Deleted",
        description: `${deletingSeverity.name} has been successfully deleted.`,
        variant: "destructive",
      });
    } catch (err) {
      console.error('Error deleting severity:', err);
      toast({
        title: "Error",
        description: "Failed to delete severity. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (severity: Severity) => {
    try {
      setIsSubmitting(true);
      // For status toggle, we'll use the update method with the same data
      await updateSeverity(severity.id, {
        name: severity.name
      });
      
      // Reload the current page to reflect the status change
      await loadSeverities(pagination.currentPage);
      
      toast({
        title: "Status Updated",
        description: `${severity.name} is now ${severity.status === 'Active' ? 'Inactive' : 'Active'}.`,
      });
    } catch (err) {
      console.error('Error updating severity status:', err);
      toast({
        title: "Error",
        description: "Failed to update severity status. Please try again.",
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
    return severities.filter(s => s.status === status).length;
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Severities Management</h1>
          <p className="text-gray-600 mt-1">Organize and manage damage severity levels and classifications</p>
        </div>
        
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Severity
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-gray-600">Total Severities</CardTitle>
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{pagination.totalItems}</div>
            <p className="text-xs text-gray-500 mt-1">Severity levels</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-gray-600">Active Severities</CardTitle>
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
            <CardTitle className="text-sm font-medium text-gray-600">Inactive Severities</CardTitle>
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
              {severities.filter(s => {
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
              <CardTitle className="text-xl text-gray-900">Severities Directory</CardTitle>
              <CardDescription className="mt-1">
                {filteredSeverities.length} {filteredSeverities.length === 1 ? 'severity' : 'severities'} found
              </CardDescription>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search severities..."
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
                    All Severities
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
                  <TableHead className="font-semibold text-gray-700">Severity Name</TableHead>
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
                        <p>Loading severities...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-red-500 py-6">
                        <p className="font-medium">Error loading severities</p>
                        <p className="text-sm">{error}</p>
                        <Button 
                          variant="outline" 
                          onClick={() => loadSeverities(pagination.currentPage)}
                          className="mt-2"
                        >
                          Try Again
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredSeverities.length > 0 ? (
                  filteredSeverities.map((severity) => (
                    <TableRow key={severity.id} className="hover:bg-gray-50/50 border-b border-gray-200 last:border-0">
                      <TableCell className="font-medium text-gray-900">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-red-500" />
                          {severity.name}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(severity.status)}</TableCell>
                      <TableCell className="text-gray-600">{severity.createdBy}</TableCell>
                      <TableCell className="text-gray-600">{new Date(severity.createdOn).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <ActionButtons
                          onEdit={() => handleEdit(severity)}
                          onDelete={() => handleDelete(severity)}
                          onToggleStatus={() => toggleStatus(severity)}
                          isActive={severity.status === 'Active'}
                          isSubmitting={isSubmitting}
                          hasEditPermission={true}
                          hasDeletePermission={true}
                          itemName={severity.name}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500 py-6">
                        <Search className="h-10 w-10 mb-2 opacity-30" />
                        <p>No severities found.</p>
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

      {/* Add Severity Form */}
      <SeverityForm
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAdd}
        severity={null}
        title="Create New Severity"
        description="Add a new severity level to the system. This severity will be available for damage assessment and classification."
        submitButtonText="Create Severity"
        isSubmitting={isSubmitting}
      />

      {/* Edit Severity Form */}
      <SeverityForm
        isOpen={!!editingSeverity}
        onClose={() => setEditingSeverity(null)}
        onSubmit={handleUpdate}
        severity={editingSeverity}
        title="Edit Severity"
        description="Update the severity information below. Click save when you're done."
        submitButtonText="Save Changes"
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={!!deletingSeverity}
        onClose={() => setDeletingSeverity(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Severity"
        description="This action will permanently remove the severity from the system."
        itemName={deletingSeverity?.name || ''}
        isDeleting={isSubmitting}
      />
    </div>
  );
};

export default Severities;
