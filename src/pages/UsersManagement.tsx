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
import { Plus, Search, Users, Filter, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getUsers, createUser, updateUser, deleteUser } from '@/components/service/apiservice';
import { UserForm } from '@/components/forms/UserForm';
import { DeleteConfirmDialog } from '@/components/dialogs/DeleteConfirmDialog';
import { ActionButtons } from '@/components/actions/ActionButtons';
import { Pagination } from '@/components/ui/pagination';

interface User {
  id: number;
  loginname: string;
  email: string;
  first_name: string;
  last_name: string;
  status: number;
  phone_no: string | null;
  unit: number | null;
  vessel: string | null;
  role: number | null;
  role_name: string | null;
  created_on: string;
  last_login: string | null;
  hrcdf_designation: string | null;
  rankCode: string | null;
  rankName: string | null;
  process: number | null;
  process_name: string | null;
   unit_name: string | null; 
  vessel_name: string | null; 
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  totalItems: number;
}

export default function UsersManagement() {
  // API state
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
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
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers(pagination.currentPage);
  }, []);

  // Filter users based on search term and status
  useEffect(() => {
    if (!Array.isArray(users) || users.length === 0) {
      setFilteredUsers([]);
      return;
    }
    
    try {
      let filtered = users.filter(user => {
        if (!user || typeof user !== 'object') return false;
        
        const matchesSearch = (user.first_name && user.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                             (user.last_name && user.last_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                             (user.loginname && user.loginname.toLowerCase().includes(searchTerm.toLowerCase())) ||
                             (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                             (user.role_name && user.role_name.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesStatus = statusFilter === 'all' || 
                             (statusFilter === 'active' && user.status === 1) ||
                             (statusFilter === 'inactive' && user.status === 0);
        
        return matchesSearch && matchesStatus;
      });
      
      setFilteredUsers(filtered);
    } catch (error) {
      console.error('Error filtering users:', error);
      setFilteredUsers([]);
    }
  }, [users, searchTerm, statusFilter]);

  // Helper function to calculate pagination info
  const calculatePaginationInfo = (response: any, currentPage: number): PaginationInfo => {
    const itemsPerPage = 10; // 10 items per page
    const totalPages = Math.ceil(response.count / itemsPerPage);
    return {
      currentPage,
      totalPages,
      hasNext: response.next !== null,
      hasPrevious: response.previous !== null,
      totalItems: response.count
    };
  };

  const fetchUsers = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getUsers(page);
      console.log('Users API Response:', response);
      
      // Handle the paginated response structure
      if (response && response.results && response.results.data) {
        setUsers(Array.isArray(response.results.data) ? response.results.data : []);
        const paginationInfo = calculatePaginationInfo(response, page);
        console.log('Pagination Info:', paginationInfo);
        setPagination(paginationInfo);
      } else if (response && response.data) {
        setUsers(Array.isArray(response.data) ? response.data : []);
      } else if (Array.isArray(response)) {
        setUsers(response);
      } else {
        console.warn('Unexpected users response structure:', response);
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    fetchUsers(page);
  };

  const handleAddUser = async (data: { 
    first_name: string; 
    last_name: string; 
    loginname: string; 
    email: string; 
    phone_no: string; 
    unit: number | null; 
    vessel: string; 
    status: number; 
    role: number | null;
  }) => {
    try {
      setIsSubmitting(true);
      await createUser(data);
      await fetchUsers(pagination.currentPage);
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditUser = async (data: { 
    first_name: string; 
    last_name: string; 
    loginname: string; 
    email: string; 
    phone_no: string; 
    unit: number | null; 
    vessel: string; 
    status: number; 
    role: number | null;
  }) => {
    if (!editingUser) return;
    
    try {
      setIsSubmitting(true);
      await updateUser(editingUser.id, data);
      await fetchUsers(pagination.currentPage);
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    
    try {
      setIsSubmitting(true);
      await deleteUser(deletingUser.id);
      await fetchUsers(pagination.currentPage);
      setDeletingUser(null);
    } catch (error) {
      console.error('Error deleting user:', error);
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

  const getUserInitials = (firstName: string, lastName: string) => {
    if (!firstName || !lastName) return '??';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-600 mt-1">Manage system users and their roles</p>
        </div>
        <Button 
          onClick={() => setIsAddDialogOpen(true)} 
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search users..."
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
              <Users className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium">Total Users</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">{pagination.totalItems}</div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">Active</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {Array.isArray(users) ? users.filter(user => user && user.status === 1).length : 0}
            </div>
          </Card>
        </div>
      </div>

      {/* Users Table */}
      <Card>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">Loading users...</div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Login Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Vessel</TableHead>
                  <TableHead>Status</TableHead>
                  {/* <TableHead>Created</TableHead> */}
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!Array.isArray(filteredUsers) || filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      {searchTerm ? 'No users found matching your search.' : 'No users available.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-sm">
                            {getUserInitials(user.first_name, user.last_name)}
                          </div>
                          <div>
                            <div className="font-medium">{user.first_name} {user.last_name}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{user.loginname}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone_no || '-'}</TableCell>
                      <TableCell>
                        {user.role_name ? (
                          <Badge variant="outline">{user.role_name}</Badge>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>{user.unit_name || '-'}</TableCell>
                      <TableCell>{user.vessel_name || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={user.status === 1 ? 'default' : 'secondary'}>
                          {user.status === 1 ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      {/* <TableCell className="text-sm text-gray-600">
                        {formatDate(user.created_on)}
                      </TableCell> */}
                      <TableCell className="text-right">
                        <ActionButtons
                          onEdit={() => setEditingUser(user)}
                          onDelete={() => setDeletingUser(user)}
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

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
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

      {/* Add User Form */}
      <UserForm
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAddUser}
        title="Add New User"
        description="Create a new user with the following details."
        submitButtonText="Create User"
        isSubmitting={isSubmitting}
      />

      {/* Edit User Form */}
      <UserForm
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        onSubmit={handleEditUser}
        user={editingUser}
        title="Edit User"
        description="Update the user information."
        submitButtonText="Update User"
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={!!deletingUser}
        onClose={() => setDeletingUser(null)}
        onConfirm={handleDeleteUser}
        title="Delete User"
        description={`Are you sure you want to delete "${deletingUser?.first_name} ${deletingUser?.last_name}"? This action cannot be undone.`}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
