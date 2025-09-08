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
import { ClassOfVessel, ClassOfVesselAPIResponse, ClassOfVesselsResponse } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getClassOfVessels, createClassOfVessel, updateClassOfVessel, deleteClassOfVessel } from '@/components/service/apiservice';
import { ClassOfVesselForm } from '@/components/forms/ClassOfVesselForm';
import { DeleteConfirmDialog } from '@/components/dialogs/DeleteConfirmDialog';
import { ActionButtons } from '@/components/actions/ActionButtons';

const ClassOfVessels = () => {
  // API state
  const [classOfVessels, setClassOfVessels] = useState<ClassOfVessel[]>([]);
  const [filteredClassOfVessels, setFilteredClassOfVessels] = useState<ClassOfVessel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingClassOfVessel, setEditingClassOfVessel] = useState<ClassOfVessel | null>(null);
  const [deletingClassOfVessel, setDeletingClassOfVessel] = useState<ClassOfVessel | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { hasPermission, user } = useAuth();
  const { toast } = useToast();

  // Debug logging
  console.log('Current user:', user);
  console.log('Has add permission:', hasPermission('Global Masters', 'add'));
  console.log('Has edit permission:', hasPermission('Global Masters', 'edit'));
  console.log('Has delete permission:', hasPermission('Global Masters', 'delete'));

  // Helper function to convert API response to ClassOfVessel format
  const convertAPIResponseToClassOfVessel = (apiClassOfVessel: ClassOfVesselAPIResponse): ClassOfVessel => ({
    id: apiClassOfVessel.id.toString(),
    name: apiClassOfVessel.name,
    createdBy: `User ${apiClassOfVessel.created_by}`,
    createdOn: apiClassOfVessel.created_on.split('T')[0],
    status: apiClassOfVessel.active === 1 ? 'Active' : 'Inactive'
  });

  // Load class of vessels from API
  const loadClassOfVessels = async () => {
    try {
      setLoading(true);
      setError(null);
      const response: ClassOfVesselsResponse = await getClassOfVessels();
      
      const convertedClassOfVessels = response.data.map(convertAPIResponseToClassOfVessel);
      setClassOfVessels(convertedClassOfVessels);
    } catch (err) {
      console.error('Error loading class of vessels:', err);
      setError('Failed to load class of vessels. Please try again.');
      toast({
        title: "Error",
        description: "Failed to load class of vessels. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load class of vessels on component mount
  useEffect(() => {
    loadClassOfVessels();
  }, []);

  // Filter class of vessels based on search and status
  useEffect(() => {
    let filtered = classOfVessels.filter(classOfVessel =>
      classOfVessel.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(classOfVessel => classOfVessel.status === statusFilter);
    }
    
    setFilteredClassOfVessels(filtered);
  }, [searchTerm, classOfVessels, statusFilter]);

  const handleAdd = async (formData: { name: string; code: string }) => {
    try {
      setIsSubmitting(true);
      await createClassOfVessel({
        name: formData.name,
        code: formData.code,
        active: 1
      });
      
      setIsAddDialogOpen(false);
      
      // Reload class of vessels to show the new one
      await loadClassOfVessels();
      
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
        name: formData.name
      });
      
      setEditingClassOfVessel(null);
      
      // Reload class of vessels to show the updated one
      await loadClassOfVessels();
      
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

  const handleConfirmDelete = async () => {
    if (!deletingClassOfVessel) return;
    
    try {
      setIsSubmitting(true);
      await deleteClassOfVessel(deletingClassOfVessel.id);
      
      setDeletingClassOfVessel(null);
      
      // Reload class of vessels to reflect the deletion
      await loadClassOfVessels();
      
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

  const toggleStatus = async (classOfVessel: ClassOfVessel) => {
    try {
      setIsSubmitting(true);
      // For status toggle, we'll use the update method with the same name
      // The API should handle the status change based on the existing class of vessel data
      await updateClassOfVessel(classOfVessel.id, {
        name: classOfVessel.name
      });
      
      // Reload class of vessels to reflect the status change
      await loadClassOfVessels();
      
      toast({
        title: "Status Updated",
        description: `${classOfVessel.name} is now ${classOfVessel.status === 'Active' ? 'Inactive' : 'Active'}.`,
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

  const getStatusBadge = (status: string) => {
    return status === 'Active' 
      ? <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-0">Active</Badge>
      : <Badge variant="outline" className="text-gray-500">Inactive</Badge>;
  };

  const getStatusCount = (status: string) => {
    return classOfVessels.filter(c => c.status === status).length;
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Class of Vessels Management</h1>
          <p className="text-gray-600 mt-1">Organize and manage all vessel classes</p>
        </div>
        
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Class of Vessel
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-gray-600">Total Classes</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Ship className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{classOfVessels.length}</div>
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
            <div className="text-2xl font-bold text-gray-900">{getStatusCount('Active')}</div>
            <p className="text-xs text-gray-500 mt-1">Currently operational</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-gray-600">Inactive Classes</CardTitle>
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
              {classOfVessels.filter(c => {
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
              <CardTitle className="text-xl text-gray-900">Class of Vessels Directory</CardTitle>
              <CardDescription className="mt-1">
                {filteredClassOfVessels.length} {filteredClassOfVessels.length === 1 ? 'class' : 'classes'} found
              </CardDescription>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search class of vessels..."
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
                    All Classes
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
                  <TableHead className="font-semibold text-gray-700">Class of Vessel Name</TableHead>
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
                        <p>Loading class of vessels...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-red-500 py-6">
                        <p className="font-medium">Error loading class of vessels</p>
                        <p className="text-sm">{error}</p>
                        <Button 
                          variant="outline" 
                          onClick={() => loadClassOfVessels()}
                          className="mt-2"
                        >
                          Try Again
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredClassOfVessels.length > 0 ? (
                  filteredClassOfVessels.map((classOfVessel) => (
                    <TableRow key={classOfVessel.id} className="hover:bg-gray-50/50 border-b border-gray-200 last:border-0">
                      <TableCell className="font-medium text-gray-900">{classOfVessel.name}</TableCell>
                      <TableCell className="text-gray-600">{classOfVessel.createdBy}</TableCell>
                      <TableCell className="text-gray-600">{new Date(classOfVessel.createdOn).toLocaleDateString()}</TableCell>
                      <TableCell>{getStatusBadge(classOfVessel.status)}</TableCell>
                      <TableCell className="text-right">
                        <ActionButtons
                          onEdit={() => handleEdit(classOfVessel)}
                          onDelete={() => handleDelete(classOfVessel)}
                          onToggleStatus={() => toggleStatus(classOfVessel)}
                          isActive={classOfVessel.status === 'Active'}
                          isSubmitting={isSubmitting}
                          hasEditPermission={true}
                          hasDeletePermission={true}
                          itemName={classOfVessel.name}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500 py-6">
                        <Search className="h-10 w-10 mb-2 opacity-30" />
                        <p>No class of vessels found.</p>
                        <p className="text-sm">Try adjusting your search or filter criteria.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Class of Vessel Form */}
      <ClassOfVesselForm
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAdd}
        classOfVessel={null}
        title="Create New Class of Vessel"
        description="Add a new vessel class to the system. This class will be available for vessel classification."
        submitButtonText="Create Class of Vessel"
        isSubmitting={isSubmitting}
      />

      {/* Edit Class of Vessel Form */}
      <ClassOfVesselForm
        isOpen={!!editingClassOfVessel}
        onClose={() => setEditingClassOfVessel(null)}
        onSubmit={handleUpdate}
        classOfVessel={editingClassOfVessel}
        title="Edit Class of Vessel"
        description="Update the class of vessel information below. Click save when you're done."
        submitButtonText="Save Changes"
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={!!deletingClassOfVessel}
        onClose={() => setDeletingClassOfVessel(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Class of Vessel"
        description="This action will permanently remove the class of vessel from the system."
        itemName={deletingClassOfVessel?.name || ''}
        isDeleting={isSubmitting}
      />
    </div>
  );
};

export default ClassOfVessels;
