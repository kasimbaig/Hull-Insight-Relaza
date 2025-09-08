import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Database, Filter, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  SubModuleAPIResponse, 
  SubModulesPaginatedResponse,
  PaginationInfo
} from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getSubModules, createSubModule, updateSubModule, deleteSubModule } from '@/components/service/apiservice';
import { Pagination } from '@/components/ui/pagination';
import MasterTable, { ColumnDefinition } from '@/components/common/MasterTable';
import { SubModuleForm } from '@/components/forms/SubModuleForm';
import { DeleteConfirmDialog } from '@/components/dialogs/DeleteConfirmDialog';
import { ActionButtons } from '@/components/actions/ActionButtons';

interface Module {
  id: number;
  code: string;
  name: string;
  active: number;
  created_on: string;
  created_ip: string;
  modified_on: string;
  modified_ip: string | null;
  created_by: number | null;
  modified_by: number | null;
}

interface SubModule {
  id: number;
  module: Module;
  code: string;
  name: string;
  active: number;
  created_on: string;
  created_ip: string;
  modified_on: string;
  modified_ip: string | null;
  created_by: number | null;
  modified_by: number | null;
  parent: number | null;
}

const SubModules = () => {
  // API state
  const [subModules, setSubModules] = useState<SubModule[]>([]);
  const [filteredSubModules, setFilteredSubModules] = useState<SubModule[]>([]);
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
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingSubModule, setEditingSubModule] = useState<SubModule | null>(null);
  const [deletingSubModule, setDeletingSubModule] = useState<SubModule | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { hasPermission, user } = useAuth();
  const { toast } = useToast();

  // Convert API response to SubModule
  const convertAPIResponseToSubModule = (apiSubModule: SubModuleAPIResponse): SubModule => ({
    id: apiSubModule.id,
    module: {
      id: apiSubModule.module.id,
      code: apiSubModule.module.code,
      name: apiSubModule.module.name,
      active: apiSubModule.module.active,
      created_on: apiSubModule.module.created_on,
      created_ip: apiSubModule.module.created_ip,
      modified_on: apiSubModule.module.modified_on,
      modified_ip: apiSubModule.module.modified_ip,
      created_by: apiSubModule.module.created_by,
      modified_by: apiSubModule.module.modified_by
    },
    code: apiSubModule.code,
    name: apiSubModule.name,
    active: apiSubModule.active,
    created_on: apiSubModule.created_on,
    created_ip: apiSubModule.created_ip,
    modified_on: apiSubModule.modified_on,
    modified_ip: apiSubModule.modified_ip,
    created_by: apiSubModule.created_by,
    modified_by: apiSubModule.modified_by,
    parent: apiSubModule.parent
  });

  // Helper function to calculate pagination info
  const calculatePaginationInfo = (response: SubModulesPaginatedResponse, currentPage: number): PaginationInfo => {
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

  // Load submodules from API
  const loadSubModules = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response: SubModulesPaginatedResponse = await getSubModules(page);
      
      const convertedSubModules = response.results.map(convertAPIResponseToSubModule);
      setSubModules(convertedSubModules);
      setPagination(calculatePaginationInfo(response, page));
    } catch (err) {
      console.error('Error loading submodules:', err);
      setError('Failed to load submodules. Please try again.');
      setSubModules([]);
    } finally {
      setLoading(false);
    }
  };

  // Load submodules on component mount and page change
  useEffect(() => {
    loadSubModules(pagination.currentPage);
  }, []);

  // Filter submodules based on search and status
  useEffect(() => {
    let filtered = subModules.filter(subModule => {
      const matchesSearch = subModule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           subModule.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           subModule.module.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'active' && subModule.active === 1) ||
                           (statusFilter === 'inactive' && subModule.active === 2);
      
      return matchesSearch && matchesStatus;
    });
    
    setFilteredSubModules(filtered);
  }, [searchTerm, statusFilter, subModules]);

  // Handle page change
  const handlePageChange = (page: number) => {
    loadSubModules(page);
  };

  // Column definitions for MasterTable
  const columns: ColumnDefinition<SubModule>[] = [
    {
      header: 'SubModule Name',
      cell: (subModule) => (
        <div>
          <div className="font-semibold">{subModule.name}</div>
          <div className="text-sm text-gray-500">Code: {subModule.code}</div>
        </div>
      )
    },
    {
      header: 'Module',
      cell: (subModule) => (
        <div>
          <div className="font-medium">{subModule.module.name}</div>
          <div className="text-sm text-gray-500">{subModule.module.code}</div>
        </div>
      )
    },
    {
      header: 'Parent',
      cell: (subModule) => (
        <span className="text-gray-600">
          {subModule.parent ? `ID: ${subModule.parent}` : 'None'}
        </span>
      )
    },
    {
      header: 'Status',
      cell: (subModule) => (
        <Badge className={subModule.active === 1 ? "bg-green-100 text-green-800 hover:bg-green-200 border-0" : "bg-gray-100 text-gray-800 hover:bg-gray-200 border-0"}>
          {subModule.active === 1 ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    {
      header: 'Created',
      cell: (subModule) => (
        <div className="text-sm text-gray-600">
          {new Date(subModule.created_on).toLocaleDateString()}
        </div>
      )
    }
  ];

  const handleAdd = async (formData: { name: string; active: number; module: number }) => {
    try {
      setIsSubmitting(true);
      await createSubModule(formData);
      
      setIsAddDialogOpen(false);
      
      // Reload the current page to show the new submodule
      await loadSubModules(pagination.currentPage);
    
      toast({
        title: "SubModule Added",
        description: `${formData.name} has been successfully added.`,
      });
    } catch (err) {
      console.error('Error creating submodule:', err);
      toast({
        title: "Error",
        description: "Failed to create submodule. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (subModule: SubModule) => {
    setEditingSubModule(subModule);
  };

  const handleUpdate = async (formData: { name: string; active: number; module: number }) => {
    if (!editingSubModule) return;
    
    try {
      setIsSubmitting(true);
      await updateSubModule(editingSubModule.id, formData);
      
      setEditingSubModule(null);
      
      // Reload the current page to show the updated submodule
      await loadSubModules(pagination.currentPage);
    
      toast({
        title: "SubModule Updated",
        description: `${formData.name} has been successfully updated.`,
      });
    } catch (err) {
      console.error('Error updating submodule:', err);
      toast({
        title: "Error",
        description: "Failed to update submodule. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (subModule: SubModule) => {
    setDeletingSubModule(subModule);
  };

  const confirmDelete = async () => {
    if (!deletingSubModule) return;
    
    try {
      setIsSubmitting(true);
      await deleteSubModule(deletingSubModule.id);
      
      setDeletingSubModule(null);
      
      // Reload the current page to reflect the deletion
      await loadSubModules(pagination.currentPage);
      
      toast({
        title: "SubModule Deleted",
        description: `${deletingSubModule.name} has been successfully deleted.`,
        variant: "destructive",
      });
    } catch (err) {
      console.error('Error deleting submodule:', err);
      toast({
        title: "Error",
        description: "Failed to delete submodule. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusToggle = async (subModule: SubModule) => {
    try {
      setIsSubmitting(true);
      const newStatus = subModule.active === 1 ? 2 : 1;
      await updateSubModule(subModule.id, {
        name: subModule.name,
        active: newStatus,
        module: subModule.module.id
      });
      
      // Reload the current page to reflect the status change
      await loadSubModules(pagination.currentPage);
      
      toast({
        title: "Status Updated",
        description: `${subModule.name} is now ${subModule.active === 1 ? 'Inactive' : 'Active'}.`,
      });
    } catch (err) {
      console.error('Error updating submodule status:', err);
      toast({
        title: "Error",
        description: "Failed to update submodule status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">SubModules</h1>
          <p className="text-gray-600 mt-1">Manage system submodules and their configurations</p>
        </div>
        {hasPermission('Global Masters', 'add') && (
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add SubModule
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-gray-600">Total SubModules</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Database className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{pagination.totalItems}</div>
            <p className="text-xs text-gray-500 mt-1">System submodules</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-gray-600">Active SubModules</CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
              <Badge className="bg-green-500 border-0 h-4 w-4 p-0" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {Array.isArray(subModules) ? subModules.filter(subModule => subModule && subModule.active === 1).length : 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Currently active</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-gray-600">Inactive SubModules</CardTitle>
            <div className="p-2 bg-gray-100 rounded-lg">
              <Badge className="bg-gray-500 border-0 h-4 w-4 p-0" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {Array.isArray(subModules) ? subModules.filter(subModule => subModule && subModule.active === 2).length : 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Currently inactive</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search submodules..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  <Filter className="w-4 h-4 mr-2" />
                  {statusFilter === 'all' ? 'All Status' : statusFilter === 'active' ? 'Active Only' : 'Inactive Only'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem 
                  onClick={() => setStatusFilter('all')}
                  className={statusFilter === 'all' ? 'bg-gray-100' : ''}
                >
                  All SubModules
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setStatusFilter('active')}
                  className={statusFilter === 'active' ? 'bg-gray-100' : ''}
                >
                  Active Only
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setStatusFilter('inactive')}
                  className={statusFilter === 'inactive' ? 'bg-gray-100' : ''}
                >
                  Inactive Only
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* SubModules Table */}
      <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <MasterTable
            columns={columns}
            data={filteredSubModules}
            rowKey={(subModule) => subModule.id.toString()}
            loading={loading}
            error={error}
            onRetry={() => loadSubModules(pagination.currentPage)}
            actionsHeader={<span className="font-semibold text-gray-700 text-right">Actions</span>}
            renderActions={(subModule) => (
              <ActionButtons
                onEdit={() => handleEdit(subModule)}
                onDelete={() => handleDelete(subModule)}
                isSubmitting={isSubmitting}
                hasEditPermission={hasPermission('Global Masters', 'edit')}
                hasDeletePermission={hasPermission('Global Masters', 'delete')}
                itemName={subModule.name}
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

      {/* Add SubModule Form */}
      <SubModuleForm
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAdd}
        title="Add New SubModule"
      />

      {/* Edit SubModule Form */}
      {editingSubModule && (
        <SubModuleForm
          isOpen={!!editingSubModule}
          onClose={() => setEditingSubModule(null)}
          onSubmit={handleUpdate}
          subModule={editingSubModule}
          title="Edit SubModule"
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={!!deletingSubModule}
        onClose={() => setDeletingSubModule(null)}
        onConfirm={confirmDelete}
        title="Delete SubModule"
        description={`Are you sure you want to delete "${deletingSubModule?.name}"? This action cannot be undone.`}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default SubModules;