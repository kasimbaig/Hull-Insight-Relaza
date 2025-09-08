import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Ship, Filter, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  ClassOfVesselAPIResponse, 
  ClassOfVesselsPaginatedResponse,
  PaginationInfo
} from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getClassOfVessels, createClassOfVessel, updateClassOfVessel, deleteClassOfVessel } from '@/components/service/apiservice';
import { Pagination } from '@/components/ui/pagination';
import MasterTable, { ColumnDefinition } from '@/components/common/MasterTable';
import { ClassOfVesselForm } from '@/components/forms/ClassOfVesselForm';
import { DeleteConfirmDialog } from '@/components/dialogs/DeleteConfirmDialog';
import { ActionButtons } from '@/components/actions/ActionButtons';

interface ClassOfVessel {
  id: number;
  code: string;
  name: string;
  active: number;
  created_on: string;
  created_ip: string;
  modified_on: string;
  modified_ip: string | null;
  created_by: number;
  modified_by: number | null;
}

const ClassOfVessels = () => {
  // API state
  const [classOfVessels, setClassOfVessels] = useState<ClassOfVessel[]>([]);
  const [filteredClassOfVessels, setFilteredClassOfVessels] = useState<ClassOfVessel[]>([]);
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
  const [editingClassOfVessel, setEditingClassOfVessel] = useState<ClassOfVessel | null>(null);
  const [deletingClassOfVessel, setDeletingClassOfVessel] = useState<ClassOfVessel | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { hasPermission, user } = useAuth();
  const { toast } = useToast();

  // Convert API response to ClassOfVessel
  const convertAPIResponseToClassOfVessel = (apiClassOfVessel: ClassOfVesselAPIResponse): ClassOfVessel => ({
    id: apiClassOfVessel.id,
    code: apiClassOfVessel.code,
    name: apiClassOfVessel.name,
    active: apiClassOfVessel.active,
    created_on: apiClassOfVessel.created_on,
    created_ip: apiClassOfVessel.created_ip,
    modified_on: apiClassOfVessel.modified_on,
    modified_ip: apiClassOfVessel.modified_ip,
    created_by: apiClassOfVessel.created_by,
    modified_by: apiClassOfVessel.modified_by
  });

  // Helper function to calculate pagination info
  const calculatePaginationInfo = (response: ClassOfVesselsPaginatedResponse, currentPage: number): PaginationInfo => {
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

  // Load class of vessels from API
  const loadClassOfVessels = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response: ClassOfVesselsPaginatedResponse = await getClassOfVessels(page);
      
      const convertedClassOfVessels = response.results.map(convertAPIResponseToClassOfVessel);
      setClassOfVessels(convertedClassOfVessels);
      setPagination(calculatePaginationInfo(response, page));
    } catch (err) {
      console.error('Error loading class of vessels:', err);
      setError('Failed to load class of vessels. Please try again.');
      setClassOfVessels([]);
    } finally {
      setLoading(false);
    }
  };

  // Load class of vessels on component mount and page change
  useEffect(() => {
    loadClassOfVessels(pagination.currentPage);
  }, []);

  // Filter class of vessels based on search and status
  useEffect(() => {
    let filtered = classOfVessels.filter(classOfVessel => {
      const matchesSearch = classOfVessel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           classOfVessel.code.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'active' && classOfVessel.active === 1) ||
                           (statusFilter === 'inactive' && classOfVessel.active === 2);
      
      return matchesSearch && matchesStatus;
    });
    
    setFilteredClassOfVessels(filtered);
  }, [searchTerm, statusFilter, classOfVessels]);

  // Handle page change
  const handlePageChange = (page: number) => {
    loadClassOfVessels(page);
  };

  // Column definitions for MasterTable
  const columns: ColumnDefinition<ClassOfVessel>[] = [
    {
      header: 'Class Name',
      cell: (classOfVessel) => (
        <div>
          <div className="font-semibold">{classOfVessel.name}</div>
          <div className="text-sm text-gray-500">Code: {classOfVessel.code}</div>
        </div>
      )
    },
    {
      header: 'Status',
      cell: (classOfVessel) => (
        <Badge className={classOfVessel.active === 1 ? "bg-green-100 text-green-800 hover:bg-green-200 border-0" : "bg-gray-100 text-gray-800 hover:bg-gray-200 border-0"}>
          {classOfVessel.active === 1 ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    {
      header: 'Created',
      cell: (classOfVessel) => (
        <div className="text-sm text-gray-600">
          {new Date(classOfVessel.created_on).toLocaleDateString()}
        </div>
      )
    },
    {
      header: 'Modified',
      cell: (classOfVessel) => (
        <div className="text-sm text-gray-600">
          {classOfVessel.modified_on ? new Date(classOfVessel.modified_on).toLocaleDateString() : 'Never'}
        </div>
      )
    }
  ];

  const handleAdd = async (formData: { name: string; code: string }) => {
    try {
      setIsSubmitting(true);
      await createClassOfVessel({
        name: formData.name,
        code: formData.code,
        active: 1
      });
      
      setIsAddDialogOpen(false);
      
      // Reload the current page to show the new class of vessel
      await loadClassOfVessels(pagination.currentPage);
    
      toast({
        title: "Class of Vessel Added",
        description: `${formData.name} has been successfully added.`,
      });
    } catch (err) {
      console.error('Error creating class of vessel:', err);
      toast({
        title: "Error",
        description: "Failed to create class of vessel. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (classOfVessel: ClassOfVessel) => {
    setEditingClassOfVessel(classOfVessel);
  };

  const handleUpdate = async (formData: { name: string; code: string }) => {
    if (!editingClassOfVessel) return;
    
    try {
      setIsSubmitting(true);
      await updateClassOfVessel(editingClassOfVessel.id, {
        name: formData.name,
        code: formData.code,
        active: editingClassOfVessel.active
      });
      
      setEditingClassOfVessel(null);
      
      // Reload the current page to show the updated class of vessel
      await loadClassOfVessels(pagination.currentPage);
    
      toast({
        title: "Class of Vessel Updated",
        description: `${formData.name} has been successfully updated.`,
      });
    } catch (err) {
      console.error('Error updating class of vessel:', err);
      toast({
        title: "Error",
        description: "Failed to update class of vessel. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (classOfVessel: ClassOfVessel) => {
    setDeletingClassOfVessel(classOfVessel);
  };

  const confirmDelete = async () => {
    if (!deletingClassOfVessel) return;
    
    try {
      setIsSubmitting(true);
      await deleteClassOfVessel(deletingClassOfVessel.id);
      
      setDeletingClassOfVessel(null);
      
      // Reload the current page to reflect the deletion
      await loadClassOfVessels(pagination.currentPage);
      
      toast({
        title: "Class of Vessel Deleted",
        description: `${deletingClassOfVessel.name} has been successfully deleted.`,
        variant: "destructive",
      });
    } catch (err) {
      console.error('Error deleting class of vessel:', err);
      toast({
        title: "Error",
        description: "Failed to delete class of vessel. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusToggle = async (classOfVessel: ClassOfVessel) => {
    try {
      setIsSubmitting(true);
      const newStatus = classOfVessel.active === 1 ? 2 : 1;
      await updateClassOfVessel(classOfVessel.id, {
        name: classOfVessel.name,
        code: classOfVessel.code,
        active: newStatus
      });
      
      // Reload the current page to reflect the status change
      await loadClassOfVessels(pagination.currentPage);
      
      toast({
        title: "Status Updated",
        description: `${classOfVessel.name} is now ${classOfVessel.active === 1 ? 'Inactive' : 'Active'}.`,
      });
    } catch (err) {
      console.error('Error updating class of vessel status:', err);
      toast({
        title: "Error",
        description: "Failed to update class of vessel status. Please try again.",
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
          <h1 className="text-3xl font-bold text-gray-900">Class of Vessels</h1>
          <p className="text-gray-600 mt-1">Manage vessel classes and their configurations</p>
        </div>
        {hasPermission('Global Masters', 'add') && (
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Class of Vessel
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-gray-600">Total Classes</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Ship className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{pagination.totalItems}</div>
            <p className="text-xs text-gray-500 mt-1">Vessel classes</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-gray-600">Active Classes</CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
              <Badge className="bg-green-500 border-0 h-4 w-4 p-0" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {Array.isArray(classOfVessels) ? classOfVessels.filter(classOfVessel => classOfVessel && classOfVessel.active === 1).length : 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Currently active</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-gray-600">Inactive Classes</CardTitle>
            <div className="p-2 bg-gray-100 rounded-lg">
              <Badge className="bg-gray-500 border-0 h-4 w-4 p-0" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {Array.isArray(classOfVessels) ? classOfVessels.filter(classOfVessel => classOfVessel && classOfVessel.active === 2).length : 0}
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
                  placeholder="Search class of vessels..."
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
                  All Classes
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

      {/* Class of Vessels Table */}
      <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <MasterTable
            columns={columns}
            data={filteredClassOfVessels}
            rowKey={(classOfVessel) => classOfVessel.id.toString()}
            loading={loading}
            error={error}
            onRetry={() => loadClassOfVessels(pagination.currentPage)}
            actionsHeader={<span className="font-semibold text-gray-700 text-right">Actions</span>}
            renderActions={(classOfVessel) => (
              <ActionButtons
                onEdit={() => handleEdit(classOfVessel)}
                onDelete={() => handleDelete(classOfVessel)}
                isSubmitting={isSubmitting}
                hasEditPermission={hasPermission('Global Masters', 'edit')}
                hasDeletePermission={hasPermission('Global Masters', 'delete')}
                itemName={classOfVessel.name}
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

      {/* Add Class of Vessel Form */}
      <ClassOfVesselForm
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAdd}
        title="Add New Class of Vessel"
      />

      {/* Edit Class of Vessel Form */}
      {editingClassOfVessel && (
        <ClassOfVesselForm
          isOpen={!!editingClassOfVessel}
          onClose={() => setEditingClassOfVessel(null)}
          onSubmit={handleUpdate}
          classOfVessel={editingClassOfVessel}
          title="Edit Class of Vessel"
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={!!deletingClassOfVessel}
        onClose={() => setDeletingClassOfVessel(null)}
        onConfirm={confirmDelete}
        title="Delete Class of Vessel"
        description={`Are you sure you want to delete "${deletingClassOfVessel?.name}"? This action cannot be undone.`}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default ClassOfVessels;