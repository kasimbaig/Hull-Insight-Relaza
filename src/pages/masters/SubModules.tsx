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
import { Plus, Search, Database, Filter, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getSubModules, createSubModule, updateSubModule, deleteSubModule } from '@/components/service/apiservice';
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
  parent: number;
}

export default function SubModules() {
  // API state
  const [subModules, setSubModules] = useState<SubModule[]>([]);
  const [filteredSubModules, setFilteredSubModules] = useState<SubModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingSubModule, setEditingSubModule] = useState<SubModule | null>(null);
  const [deletingSubModule, setDeletingSubModule] = useState<SubModule | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch submodules on component mount
  useEffect(() => {
    fetchSubModules();
  }, []);

  // Filter submodules based on search term and status
  useEffect(() => {
    let filtered = subModules.filter(subModule => {
      const matchesSearch = subModule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           subModule.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           subModule.module.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'active' && subModule.active === 1) ||
                           (statusFilter === 'inactive' && subModule.active === 0);
      
      return matchesSearch && matchesStatus;
    });
    
    setFilteredSubModules(filtered);
  }, [subModules, searchTerm, statusFilter]);

  const fetchSubModules = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getSubModules();
      setSubModules(response || []);
    } catch (error) {
      console.error('Error fetching submodules:', error);
      setError('Failed to fetch submodules');
      setSubModules([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubModule = async (data: { name: string; active: number; module: number }) => {
    try {
      setIsSubmitting(true);
      await createSubModule(data);
      await fetchSubModules();
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error creating submodule:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubModule = async (data: { name: string; active: number; module: number }) => {
    if (!editingSubModule) return;
    
    try {
      setIsSubmitting(true);
      await updateSubModule(editingSubModule.id, data);
      await fetchSubModules();
      setEditingSubModule(null);
    } catch (error) {
      console.error('Error updating submodule:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSubModule = async () => {
    if (!deletingSubModule) return;
    
    try {
      setIsSubmitting(true);
      await deleteSubModule(deletingSubModule.id);
      await fetchSubModules();
      setDeletingSubModule(null);
    } catch (error) {
      console.error('Error deleting submodule:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">SubModules</h1>
          <p className="text-gray-600 mt-1">Manage system submodules and configurations</p>
        </div>
        <Button 
          onClick={() => setIsAddDialogOpen(true)} 
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add SubModule
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search submodules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                {statusFilter === 'all' ? 'All Status' : 
                 statusFilter === 'active' ? 'Active' : 'Inactive'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                All Status
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('active')}>
                Active
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('inactive')}>
                Inactive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium">Total SubModules</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">{subModules.length}</div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">Active</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {subModules.filter(subModule => subModule.active === 1).length}
            </div>
          </Card>
        </div>
      </div>

      {/* SubModules Table */}
      <Card>
        <CardHeader>
          <CardTitle>SubModules</CardTitle>
          <CardDescription>
            Manage and configure system submodules
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">Loading submodules...</div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created On</TableHead>
                  <TableHead>Modified On</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubModules.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      {searchTerm ? 'No submodules found matching your search.' : 'No submodules available.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubModules.map((subModule) => (
                    <TableRow key={subModule.id}>
                      <TableCell className="font-mono text-sm">{subModule.code}</TableCell>
                      <TableCell className="font-medium">{subModule.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{subModule.module.name}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={subModule.active === 1 ? 'default' : 'secondary'}>
                          {subModule.active === 1 ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {formatDate(subModule.created_on)}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {formatDate(subModule.modified_on)}
                      </TableCell>
                      <TableCell className="text-right">
                        <ActionButtons
                          onEdit={() => setEditingSubModule(subModule)}
                          onDelete={() => setDeletingSubModule(subModule)}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add SubModule Form */}
      <SubModuleForm
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAddSubModule}
        title="Add New SubModule"
        description="Create a new submodule with the following details."
        submitButtonText="Create SubModule"
        isSubmitting={isSubmitting}
      />

      {/* Edit SubModule Form */}
      <SubModuleForm
        isOpen={!!editingSubModule}
        onClose={() => setEditingSubModule(null)}
        onSubmit={handleEditSubModule}
        subModule={editingSubModule}
        title="Edit SubModule"
        description="Update the submodule information."
        submitButtonText="Update SubModule"
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={!!deletingSubModule}
        onClose={() => setDeletingSubModule(null)}
        onConfirm={handleDeleteSubModule}
        title="Delete SubModule"
        description={`Are you sure you want to delete "${deletingSubModule?.name}"? This action cannot be undone.`}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
