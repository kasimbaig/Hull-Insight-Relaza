import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, MapPin, Filter, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  CommandAPIResponse, 
  CommandsPaginatedResponse,
  PaginationInfo
} from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getCommands, createCommand, updateCommand, deleteCommand } from '@/components/service/apiservice';
import { Pagination } from '@/components/ui/pagination';
import MasterTable, { ColumnDefinition } from '@/components/common/MasterTable';
import { CommandForm } from '@/components/forms/CommandForm';
import { DeleteConfirmDialog } from '@/components/dialogs/DeleteConfirmDialog';
import { ActionButtons } from '@/components/actions/ActionButtons';

interface Command {
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

const Commands = () => {
  // API state
  const [commands, setCommands] = useState<Command[]>([]);
  const [filteredCommands, setFilteredCommands] = useState<Command[]>([]);
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
  const [editingCommand, setEditingCommand] = useState<Command | null>(null);
  const [deletingCommand, setDeletingCommand] = useState<Command | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { hasPermission, user } = useAuth();
  const { toast } = useToast();

  // Convert API response to Command
  const convertAPIResponseToCommand = (apiCommand: CommandAPIResponse): Command => ({
    id: apiCommand.id,
    code: apiCommand.code,
    name: apiCommand.name,
    active: apiCommand.active,
    created_on: apiCommand.created_on,
    created_ip: apiCommand.created_ip,
    modified_on: apiCommand.modified_on,
    modified_ip: apiCommand.modified_ip,
    created_by: apiCommand.created_by,
    modified_by: apiCommand.modified_by
  });

  // Helper function to calculate pagination info
  const calculatePaginationInfo = (response: CommandsPaginatedResponse, currentPage: number): PaginationInfo => {
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

  // Load commands from API
  const loadCommands = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response: CommandsPaginatedResponse = await getCommands(page);
      
      const convertedCommands = response.results.map(convertAPIResponseToCommand);
      setCommands(convertedCommands);
      setPagination(calculatePaginationInfo(response, page));
    } catch (err) {
      console.error('Error loading commands:', err);
      setError('Failed to load commands. Please try again.');
      setCommands([]);
    } finally {
      setLoading(false);
    }
  };

  // Load commands on component mount and page change
  useEffect(() => {
    loadCommands(pagination.currentPage);
  }, []);

  // Filter commands based on search and status
  useEffect(() => {
    let filtered = commands.filter(command => {
      const matchesSearch = command.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           command.code.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'active' && command.active === 1) ||
                           (statusFilter === 'inactive' && command.active === 2);
      
      return matchesSearch && matchesStatus;
    });
    
    setFilteredCommands(filtered);
  }, [searchTerm, statusFilter, commands]);

  // Handle page change
  const handlePageChange = (page: number) => {
    loadCommands(page);
  };

  // Column definitions for MasterTable
  const columns: ColumnDefinition<Command>[] = [
    {
      header: 'Command Name',
      cell: (command) => (
        <div>
          <div className="font-semibold">{command.name}</div>
          <div className="text-sm text-gray-500">Code: {command.code}</div>
        </div>
      )
    },
    {
      header: 'Status',
      cell: (command) => (
        <Badge className={command.active === 1 ? "bg-green-100 text-green-800 hover:bg-green-200 border-0" : "bg-gray-100 text-gray-800 hover:bg-gray-200 border-0"}>
          {command.active === 1 ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    {
      header: 'Created',
      cell: (command) => (
        <div className="text-sm text-gray-600">
          {new Date(command.created_on).toLocaleDateString()}
        </div>
      )
    },
    {
      header: 'Modified',
      cell: (command) => (
        <div className="text-sm text-gray-600">
          {command.modified_on ? new Date(command.modified_on).toLocaleDateString() : 'Never'}
        </div>
      )
    }
  ];

  const handleAdd = async (formData: { name: string; code: string }) => {
    try {
      setIsSubmitting(true);
      await createCommand({
        name: formData.name,
        code: formData.code,
        active: 1
      });
      
      setIsAddDialogOpen(false);
      
      // Reload the current page to show the new command
      await loadCommands(pagination.currentPage);
    
      toast({
        title: "Command Added",
        description: `${formData.name} has been successfully added.`,
      });
    } catch (err) {
      console.error('Error creating command:', err);
      toast({
        title: "Error",
        description: "Failed to create command. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (command: Command) => {
    setEditingCommand(command);
  };

  const handleUpdate = async (formData: { name: string; code: string }) => {
    if (!editingCommand) return;
    
    try {
      setIsSubmitting(true);
      await updateCommand(editingCommand.id, {
        name: formData.name,
        code: formData.code,
        active: editingCommand.active
      });
      
      setEditingCommand(null);
      
      // Reload the current page to show the updated command
      await loadCommands(pagination.currentPage);
    
      toast({
        title: "Command Updated",
        description: `${formData.name} has been successfully updated.`,
      });
    } catch (err) {
      console.error('Error updating command:', err);
      toast({
        title: "Error",
        description: "Failed to update command. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (command: Command) => {
    setDeletingCommand(command);
  };

  const confirmDelete = async () => {
    if (!deletingCommand) return;
    
    try {
      setIsSubmitting(true);
      await deleteCommand(deletingCommand.id);
      
      setDeletingCommand(null);
      
      // Reload the current page to reflect the deletion
      await loadCommands(pagination.currentPage);
      
      toast({
        title: "Command Deleted",
        description: `${deletingCommand.name} has been successfully deleted.`,
        variant: "destructive",
      });
    } catch (err) {
      console.error('Error deleting command:', err);
      toast({
        title: "Error",
        description: "Failed to delete command. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusToggle = async (command: Command) => {
    try {
      setIsSubmitting(true);
      const newStatus = command.active === 1 ? 2 : 1;
      await updateCommand(command.id, {
        name: command.name,
        code: command.code,
        active: newStatus
      });
      
      // Reload the current page to reflect the status change
      await loadCommands(pagination.currentPage);
      
      toast({
        title: "Status Updated",
        description: `${command.name} is now ${command.active === 1 ? 'Inactive' : 'Active'}.`,
      });
    } catch (err) {
      console.error('Error updating command status:', err);
      toast({
        title: "Error",
        description: "Failed to update command status. Please try again.",
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
          <h1 className="text-3xl font-bold text-gray-900">Commands</h1>
          <p className="text-gray-600 mt-1">Manage naval commands and their configurations</p>
        </div>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Command
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-gray-600">Total Commands</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <MapPin className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{pagination.totalItems}</div>
            <p className="text-xs text-gray-500 mt-1">Naval commands</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-gray-600">Active Commands</CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
              <Badge className="bg-green-500 border-0 h-4 w-4 p-0" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {Array.isArray(commands) ? commands.filter(command => command && command.active === 1).length : 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Currently active</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-gray-600">Inactive Commands</CardTitle>
            <div className="p-2 bg-gray-100 rounded-lg">
              <Badge className="bg-gray-500 border-0 h-4 w-4 p-0" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {Array.isArray(commands) ? commands.filter(command => command && command.active === 2).length : 0}
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
                  placeholder="Search commands..."
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
                  All Commands
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

      {/* Commands Table */}
      <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <MasterTable
            columns={columns}
            data={filteredCommands}
            rowKey={(command) => command.id.toString()}
            loading={loading}
            error={error}
            onRetry={() => loadCommands(pagination.currentPage)}
            actionsHeader={<span className="font-semibold text-gray-700 text-right">Actions</span>}
            renderActions={(command) => (
              <ActionButtons
                onEdit={() => handleEdit(command)}
                onDelete={() => handleDelete(command)}
                isSubmitting={isSubmitting}
                hasEditPermission={hasPermission('Global Masters', 'edit')}
                hasDeletePermission={hasPermission('Global Masters', 'delete')}
                itemName={command.name}
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

      {/* Add Command Form */}
      <CommandForm
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAdd}
        title="Add New Command"
        description="Create a new naval command"
        submitButtonText="Add Command"
        isSubmitting={isSubmitting}
      />

      {/* Edit Command Form */}
      {editingCommand && (
        <CommandForm
          isOpen={!!editingCommand}
          onClose={() => setEditingCommand(null)}
          onSubmit={handleUpdate}
          command={editingCommand}
          title="Edit Command"
          description="Update command information"
          submitButtonText="Update Command"
          isSubmitting={isSubmitting}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={!!deletingCommand}
        onClose={() => setDeletingCommand(null)}
        onConfirm={confirmDelete}
        title="Delete Command"
        description={`Are you sure you want to delete "${deletingCommand?.name}"? This action cannot be undone.`}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default Commands;