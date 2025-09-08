import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, Search, UserCheck } from 'lucide-react';
import { getUserRoles, createUserRole, updateUserRole, deleteUserRole } from '@/components/service/apiservice';
import UserRoleForm from '@/components/forms/UserRoleForm';
import SimpleActionButtons from '@/components/ui/SimpleActionButtons';
import { DeleteConfirmDialog } from '@/components/dialogs/DeleteConfirmDialog';

interface UserRole {
  id: number;
  code: string;
  name: string;
  description: string;
  active: number;
}

export default function UserRoles() {
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [filteredRoles, setFilteredRoles] = useState<UserRole[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<UserRole | null>(null);
  const [deletingRole, setDeletingRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch user roles on component mount
  useEffect(() => {
    fetchUserRoles();
  }, []);

  // Filter roles based on search term
  useEffect(() => {
    const filtered = userRoles.filter(role =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRoles(filtered);
  }, [userRoles, searchTerm]);

  const fetchUserRoles = async () => {
    try {
      setLoading(true);
      const response = await getUserRoles();
      setUserRoles(response);
    } catch (error) {
      console.error('Error fetching user roles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      setLoading(true);
      
      if (editingRole) {
        await updateUserRole(editingRole.id, data);
      } else {
        await createUserRole(data);
      }
      
      await fetchUserRoles();
      handleDialogClose();
    } catch (error) {
      console.error('Error saving user role:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (role: UserRole) => {
    setEditingRole(role);
    setIsDialogOpen(true);
  };

  const handleDeleteRole = async () => {
    if (!deletingRole) return;
    
    try {
      setIsDeleting(true);
      await deleteUserRole(deletingRole.id);
      await fetchUserRoles();
      setDeletingRole(null);
    } catch (error) {
      console.error('Error deleting user role:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingRole(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Roles</h1>
          <p className="text-gray-600 mt-1">Manage user roles and permissions</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="hull-button-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add User Role
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="flex items-center justify-between">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search user roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium">Total Roles</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">{userRoles.length}</div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">Active</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {userRoles.filter(role => role.active === 1).length}
            </div>
          </Card>
        </div>
      </div>

      {/* User Roles Table */}
      <Card>
        <CardHeader>
          <CardTitle>User Roles</CardTitle>
          <CardDescription>
            Manage and configure user roles for the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">Loading user roles...</div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      {searchTerm ? 'No user roles found matching your search.' : 'No user roles available.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRoles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-mono text-sm">{role.code}</TableCell>
                      <TableCell className="font-medium">{role.name}</TableCell>
                      <TableCell className="text-gray-600">{role.description}</TableCell>
                      <TableCell>
                        <Badge variant={role.active === 1 ? 'default' : 'secondary'}>
                          {role.active === 1 ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <SimpleActionButtons
                          onEdit={() => handleEdit(role)}
                          onDelete={() => setDeletingRole(role)}
                          loading={loading}
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

      {/* User Role Form Dialog */}
      <UserRoleForm
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        onSubmit={handleSubmit}
        userRole={editingRole}
        loading={loading}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={!!deletingRole}
        onClose={() => setDeletingRole(null)}
        onConfirm={handleDeleteRole}
        title="Delete User Role"
        description={`Are you sure you want to delete "${deletingRole?.name}"? This action cannot be undone.`}
        itemName={deletingRole?.name || ''}
        isDeleting={isDeleting}
      />
    </div>
  );
}
