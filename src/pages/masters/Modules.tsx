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
  ModuleAPIResponse, 
  ModulesPaginatedResponse,
  PaginationInfo
} from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getModules, createModule, updateModule, deleteModule } from '@/components/service/apiservice';
import { Pagination } from '@/components/ui/pagination';
import MasterTable, { ColumnDefinition } from '@/components/common/MasterTable';
import { ModuleForm } from '@/components/forms/ModuleForm';
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

const Modules = () => {
  // API state
  const [modules, setModules] = useState<Module[]>([]);
  const [filteredModules, setFilteredModules] = useState<Module[]>([]);
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
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [deletingModule, setDeletingModule] = useState<Module | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { hasPermission, user } = useAuth();
  const { toast } = useToast();

  // Convert API response to Module
  const convertAPIResponseToModule = (apiModule: ModuleAPIResponse): Module => ({
    id: apiModule.id,
    code: apiModule.code,
    name: apiModule.name,
    active: apiModule.active,
    created_on: apiModule.created_on,
    created_ip: apiModule.created_ip,
    modified_on: apiModule.modified_on,
    modified_ip: apiModule.modified_ip,
    created_by: apiModule.created_by,
    modified_by: apiModule.modified_by
  });

  // Helper function to calculate pagination info
  const calculatePaginationInfo = (response: ModulesPaginatedResponse, currentPage: number): PaginationInfo => {
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

  // Load modules from API
  const loadModules = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response: ModulesPaginatedResponse = await getModules(page);
      
      const convertedModules = response.results.map(convertAPIResponseToModule);
      setModules(convertedModules);
      setPagination(calculatePaginationInfo(response, page));
    } catch (err) {
      console.error('Error loading modules:', err);
      setError('Failed to load modules. Please try again.');
      setModules([]);
    } finally {
      setLoading(false);
    }
  };

  // Load modules on component mount and page change
  useEffect(() => {
    loadModules(pagination.currentPage);
  }, []);

  // Filter modules based on search and status
  useEffect(() => {
    let filtered = modules.filter(module => {
      const matchesSearch = module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           module.code.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'active' && module.active === 1) ||
                           (statusFilter === 'inactive' && module.active === 2);
      
      return matchesSearch && matchesStatus;
    });
    
    setFilteredModules(filtered);
  }, [searchTerm, statusFilter, modules]);

  // Handle page change
  const handlePageChange = (page: number) => {
    loadModules(page);
  };

  // Column definitions for MasterTable
  const columns: ColumnDefinition<Module>[] = [
    {
      header: 'Module Name',
      cell: (module) => (
        <div>
          <div className="font-semibold">{module.name}</div>
          <div className="text-sm text-gray-500">Code: {module.code}</div>
        </div>
      )
    },
    {
      header: 'Status',
      cell: (module) => (
        <Badge className={module.active === 1 ? "bg-green-100 text-green-800 hover:bg-green-200 border-0" : "bg-gray-100 text-gray-800 hover:bg-gray-200 border-0"}>
          {module.active === 1 ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    {
      header: 'Created',
      cell: (module) => (
        <div className="text-sm text-gray-600">
          {new Date(module.created_on).toLocaleDateString()}
        </div>
      )
    },
    {
      header: 'Modified',
      cell: (module) => (
        <div className="text-sm text-gray-600">
          {module.modified_on ? new Date(module.modified_on).toLocaleDateString() : 'Never'}
        </div>
      )
    }
  ];

  const handleAdd = async (formData: { name: string; code: string }) => {
    try {
      setIsSubmitting(true);
      await createModule({
        name: formData.name,
        code: formData.code,
        active: 1
      });
      
      setIsAddDialogOpen(false);
      
      // Reload the current page to show the new module
      await loadModules(pagination.currentPage);
    
      toast({
        title: "Module Added",
        description: `${formData.name} has been successfully added.`,
      });
    } catch (err) {
      console.error('Error creating module:', err);
      toast({
        title: "Error",
        description: "Failed to create module. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (module: Module) => {
    setEditingModule(module);
  };

  const handleUpdate = async (formData: { name: string; code: string }) => {
    if (!editingModule) return;
    
    try {
      setIsSubmitting(true);
      await updateModule(editingModule.id, {
        name: formData.name,
        code: formData.code,
        active: editingModule.active
      });
      
      setEditingModule(null);
      
      // Reload the current page to show the updated module
      await loadModules(pagination.currentPage);
    
      toast({
        title: "Module Updated",
        description: `${formData.name} has been successfully updated.`,
      });
    } catch (err) {
      console.error('Error updating module:', err);
      toast({
        title: "Error",
        description: "Failed to update module. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (module: Module) => {
    setDeletingModule(module);
  };

  const confirmDelete = async () => {
    if (!deletingModule) return;
    
    try {
      setIsSubmitting(true);
      await deleteModule(deletingModule.id);
      
      setDeletingModule(null);
      
      // Reload the current page to reflect the deletion
      await loadModules(pagination.currentPage);
      
      toast({
        title: "Module Deleted",
        description: `${deletingModule.name} has been successfully deleted.`,
        variant: "destructive",
      });
    } catch (err) {
      console.error('Error deleting module:', err);
      toast({
        title: "Error",
        description: "Failed to delete module. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusToggle = async (module: Module) => {
    try {
      setIsSubmitting(true);
      const newStatus = module.active === 1 ? 2 : 1;
      await updateModule(module.id, {
        name: module.name,
        code: module.code,
        active: newStatus
      });
      
      // Reload the current page to reflect the status change
      await loadModules(pagination.currentPage);
      
      toast({
        title: "Status Updated",
        description: `${module.name} is now ${module.active === 1 ? 'Inactive' : 'Active'}.`,
      });
    } catch (err) {
      console.error('Error updating module status:', err);
      toast({
        title: "Error",
        description: "Failed to update module status. Please try again.",
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
          <h1 className="text-3xl font-bold text-gray-900">Modules</h1>
          <p className="text-gray-600 mt-1">Manage system modules and their configurations</p>
        </div>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Module
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-gray-600">Total Modules</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Database className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{pagination.totalItems}</div>
            <p className="text-xs text-gray-500 mt-1">System modules</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-gray-600">Active Modules</CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
              <Badge className="bg-green-500 border-0 h-4 w-4 p-0" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {Array.isArray(modules) ? modules.filter(module => module && module.active === 1).length : 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Currently active</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-gray-600">Inactive Modules</CardTitle>
            <div className="p-2 bg-gray-100 rounded-lg">
              <Badge className="bg-gray-500 border-0 h-4 w-4 p-0" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {Array.isArray(modules) ? modules.filter(module => module && module.active === 2).length : 0}
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
                  placeholder="Search modules..."
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
                  All Modules
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

      {/* Modules Table */}
      <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <MasterTable
            columns={columns}
            data={filteredModules}
            rowKey={(module) => module.id.toString()}
            loading={loading}
            error={error}
            onRetry={() => loadModules(pagination.currentPage)}
            actionsHeader={<span className="font-semibold text-gray-700 text-right">Actions</span>}
            renderActions={(module) => (
              <ActionButtons
                onEdit={() => handleEdit(module)}
                onDelete={() => handleDelete(module)}
                isSubmitting={isSubmitting}
                hasEditPermission={hasPermission('Global Masters', 'edit')}
                hasDeletePermission={hasPermission('Global Masters', 'delete')}
                itemName={module.name}
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

      {/* Add Module Form */}
      <ModuleForm
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAdd}
        title="Add New Module"
        description="Create a new system module"
        submitButtonText="Add Module"
        isSubmitting={isSubmitting}
      />

      {/* Edit Module Form */}
      {editingModule && (
        <ModuleForm
          isOpen={!!editingModule}
          onClose={() => setEditingModule(null)}
          onSubmit={handleUpdate}
          module={editingModule}
          title="Edit Module"
          description="Update module information"
          submitButtonText="Update Module"
          isSubmitting={isSubmitting}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={!!deletingModule}
        onClose={() => setDeletingModule(null)}
        onConfirm={confirmDelete}
        title="Delete Module"
        description={`Are you sure you want to delete "${deletingModule?.name}"? This action cannot be undone.`}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default Modules;