import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
} from '@/components/ui/table';
import { Plus, Search, MapPin, Filter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Command, CommandAPIResponse, CommandsResponse } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getCommands, createCommand, updateCommand, deleteCommand } from '@/components/service/apiservice';
import { CommandForm } from '@/components/forms/CommandForm';
import { DeleteConfirmDialog } from '@/components/dialogs/DeleteConfirmDialog';
import { ActionButtons } from '@/components/actions/ActionButtons';
import MasterTable, { ColumnDefinition } from '@/components/common/MasterTable';

const Commands = () => {
  // API state
  const [commands, setCommands] = useState<Command[]>([]);
  const [filteredCommands, setFilteredCommands] = useState<Command[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCommand, setEditingCommand] = useState<Command | null>(null);
  const [deletingCommand, setDeletingCommand] = useState<Command | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { hasPermission, user } = useAuth();
  const { toast } = useToast();

  // Debug logging
  console.log('Current user:', user);
  console.log('Has add permission:', hasPermission('Global Masters', 'add'));
  console.log('Has edit permission:', hasPermission('Global Masters', 'edit'));
  console.log('Has delete permission:', hasPermission('Global Masters', 'delete'));

  // Helper function to convert API response to Command format
  const convertAPIResponseToCommand = (apiCommand: CommandAPIResponse): Command => ({
    id: apiCommand.id.toString(),
    name: apiCommand.name,
    createdBy: `User ${apiCommand.created_by}`,
    createdOn: apiCommand.created_on.split('T')[0],
    status: apiCommand.active === 1 ? 'Active' : 'Inactive'
  });

  // Load commands from API
  const loadCommands = async () => {
    try {
      setLoading(true);
      setError(null);
      const response: CommandsResponse = await getCommands();
      
      const convertedCommands = response.data.map(convertAPIResponseToCommand);
      setCommands(convertedCommands);
    } catch (err) {
      console.error('Error loading commands:', err);
      setError('Failed to load commands. Please try again.');
      toast({
        title: "Error",
        description: "Failed to load commands. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load commands on component mount
  useEffect(() => {
    loadCommands();
  }, []);

  // Filter commands based on search and status
  useEffect(() => {
    let filtered = commands.filter(command =>
      command.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(command => command.status === statusFilter);
    }
    
    setFilteredCommands(filtered);
  }, [searchTerm, commands, statusFilter]);

  const handleAdd = async (formData: { name: string; code: string }) => {
    try {
      setIsSubmitting(true);
      await createCommand({
        name: formData.name,
        code: formData.code,
        active: 1
      });
      
      setIsAddDialogOpen(false);
      
      // Reload commands to show the new command
      await loadCommands();
      
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
        name: formData.name
      });
      
      setEditingCommand(null);
      
      // Reload commands to show the updated command
      await loadCommands();
      
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

  const handleConfirmDelete = async () => {
    if (!deletingCommand) return;
    
    try {
      setIsSubmitting(true);
      await deleteCommand(deletingCommand.id);
      
      setDeletingCommand(null);
      
      // Reload commands to reflect the deletion
      await loadCommands();
      
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


  const getStatusBadge = (status: string) => {
    return status === 'Active' 
      ? <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-0">Active</Badge>
      : <Badge variant="outline" className="text-gray-500">Inactive</Badge>;
  };

  const getStatusCount = (status: string) => {
    return commands.filter(c => c.status === status).length;
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Commands Management</h1>
          <p className="text-gray-600 mt-1">Organize and manage all naval commands</p>
        </div>
        
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Command
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-gray-600">Total Commands</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <MapPin className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{commands.length}</div>
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
            <div className="text-2xl font-bold text-gray-900">{getStatusCount('Active')}</div>
            <p className="text-xs text-gray-500 mt-1">Currently operational</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium text-gray-600">Inactive Commands</CardTitle>
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
              {commands.filter(c => {
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
              <CardTitle className="text-xl text-gray-900">Commands Directory</CardTitle>
              <CardDescription className="mt-1">
                {filteredCommands.length} {filteredCommands.length === 1 ? 'command' : 'commands'} found
              </CardDescription>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search commands..."
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
                    All Commands
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
            <MasterTable
              columns={([
                { header: <span className="font-semibold text-gray-700">Command Name</span>, accessor: 'name', className: 'font-medium text-gray-900' },
                { header: <span className="font-semibold text-gray-700">Status</span>, cell: (c) => getStatusBadge((c as any).status) },
              ] as unknown) as ColumnDefinition<any>[]}
              data={filteredCommands}
              rowKey={(c) => (c as any).id}
              loading={loading}
              error={error}
              onRetry={() => loadCommands()}
              actionsHeader={<span className="font-semibold text-gray-700 text-right">Actions</span>}
              renderActions={(command) => (
                <ActionButtons
                  onEdit={() => handleEdit(command as any)}
                  onDelete={() => handleDelete(command as any)}
                  isSubmitting={isSubmitting}
                  hasEditPermission={true}
                  hasDeletePermission={true}
                  itemName={(command as any).name}
                />
              )}
              headerClassName="bg-gray-50"
            />
          </div>
        </CardContent>
      </Card>

      {/* Add Command Form */}
      <CommandForm
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAdd}
        command={null}
        title="Create New Command"
        description="Add a new naval command to the system. This command will be available for assignment across platforms."
        submitButtonText="Create Command"
        isSubmitting={isSubmitting}
      />

      {/* Edit Command Form */}
      <CommandForm
        isOpen={!!editingCommand}
        onClose={() => setEditingCommand(null)}
        onSubmit={handleUpdate}
        command={editingCommand}
        title="Edit Command"
        description="Update the command information below. Click save when you're done."
        submitButtonText="Save Changes"
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={!!deletingCommand}
        onClose={() => setDeletingCommand(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Command"
        description="This action will permanently remove the command from the system."
        itemName={deletingCommand?.name || ''}
        isDeleting={isSubmitting}
      />
    </div>
  );
};

export default Commands;
