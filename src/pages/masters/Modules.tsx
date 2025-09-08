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
import { getModules, createModule, updateModule, deleteModule } from '@/components/service/apiservice';
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

export default function Modules() {
  // API state
  const [modules, setModules] = useState<Module[]>([]);
  const [filteredModules, setFilteredModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [deletingModule, setDeletingModule] = useState<Module | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch modules on component mount
  useEffect(() => {
    fetchModules();
  }, []);

  // Filter modules based on search term and status
  useEffect(() => {
    let filtered = modules.filter(module => {
      const matchesSearch = module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           module.code.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'active' && module.active === 1) ||
                           (statusFilter === 'inactive' && module.active === 0);
      
      return matchesSearch && matchesStatus;
    });
    
    setFilteredModules(filtered);
  }, [modules, searchTerm, statusFilter]);

  const fetchModules = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getModules();
      setModules(response || []);
    } catch (error) {
      console.error('Error fetching modules:', error);
      setError('Failed to fetch modules');
      setModules([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddModule = async (data: { name: string; active: number }) => {
    try {
      setIsSubmitting(true);
      await createModule(data);
      await fetchModules();
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error creating module:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditModule = async (data: { name: string; active: number }) => {
    if (!editingModule) return;
    
    try {
      setIsSubmitting(true);
      await updateModule(editingModule.id, data);
      await fetchModules();
      setEditingModule(null);
    } catch (error) {
      console.error('Error updating module:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteModule = async () => {
    if (!deletingModule) return;
    
    try {
      setIsSubmitting(true);
      await deleteModule(deletingModule.id);
      await fetchModules();
      setDeletingModule(null);
    } catch (error) {
      console.error('Error deleting module:', error);
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
          <h1 className="text-3xl font-bold text-gray-900">Modules</h1>
          <p className="text-gray-600 mt-1">Manage system modules and configurations</p>
        </div>
        <Button 
          onClick={() => setIsAddDialogOpen(true)} 
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Module
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search modules..."
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
              <span className="text-sm font-medium">Total Modules</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">{modules.length}</div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">Active</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {modules.filter(module => module.active === 1).length}
            </div>
          </Card>
        </div>
      </div>

      {/* Modules Table */}
      <Card>
        <CardHeader>
          <CardTitle>Modules</CardTitle>
          <CardDescription>
            Manage and configure system modules
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">Loading modules...</div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created On</TableHead>
                  <TableHead>Modified On</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredModules.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      {searchTerm ? 'No modules found matching your search.' : 'No modules available.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredModules.map((module) => (
                    <TableRow key={module.id}>
                      <TableCell className="font-mono text-sm">{module.code}</TableCell>
                      <TableCell className="font-medium">{module.name}</TableCell>
                      <TableCell>
                        <Badge variant={module.active === 1 ? 'default' : 'secondary'}>
                          {module.active === 1 ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {formatDate(module.created_on)}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {formatDate(module.modified_on)}
                      </TableCell>
                      <TableCell className="text-right">
                        <ActionButtons
                          onEdit={() => setEditingModule(module)}
                          onDelete={() => setDeletingModule(module)}
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

      {/* Add Module Form */}
      <ModuleForm
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAddModule}
        title="Add New Module"
        description="Create a new module with the following details."
        submitButtonText="Create Module"
        isSubmitting={isSubmitting}
      />

      {/* Edit Module Form */}
      <ModuleForm
        isOpen={!!editingModule}
        onClose={() => setEditingModule(null)}
        onSubmit={handleEditModule}
        module={editingModule}
        title="Edit Module"
        description="Update the module information."
        submitButtonText="Update Module"
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={!!deletingModule}
        onClose={() => setDeletingModule(null)}
        onConfirm={handleDeleteModule}
        title="Delete Module"
        description={`Are you sure you want to delete "${deletingModule?.name}"? This action cannot be undone.`}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
