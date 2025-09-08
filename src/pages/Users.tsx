import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { Pagination } from '@/components/ui/pagination';
import { Plus, Edit, Trash2, Search, Users, User } from 'lucide-react';
import { getUsers, createUser, updateUser, deleteUser, getUserRoles } from '@/components/service/apiservice';

interface User {
  id: number;
  loginname: string;
  email: string;
  first_name: string;
  last_name: string;
  status: number;
  phone_no: string | null;
  unit: number | null;
  unit_name: string | null;
  vessel: string | null;
  vessel_name: string | null;
  role: number | null;
  role_name: string | null;
  created_on: string;
  last_login: string | null;
}

interface UserRole {
  id: number;
  name: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  totalItems: number;
}


export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false,
    totalItems: 0
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    loginname: '',
    email: '',
    phone_no: '',
    unit: '',
    vessel: '',
    status: 1,
    role: ''
  });

  // Load users on component mount and page change
  useEffect(() => {
    fetchUsers(pagination.currentPage);
    fetchUserRoles();
  }, []);

  // Filter users based on search term
  useEffect(() => {
    if (!Array.isArray(users) || users.length === 0) {
      setFilteredUsers([]);
      return;
    }
    
    try {
      const filtered = users.filter(user => {
        if (!user || typeof user !== 'object') return false;
        return (
          (user.first_name && user.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.last_name && user.last_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.loginname && user.loginname.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.role_name && user.role_name.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      });
      setFilteredUsers(filtered);
    } catch (error) {
      console.error('Error filtering users:', error);
      setFilteredUsers([]);
    }
  }, [users, searchTerm]);

  const fetchUsers = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await getUsers(page);
      console.log('Users API Response:', response);
      
      let usersData = [];
      
      // Handle the paginated response structure
      if (response && response.results && response.results.data) {
        usersData = Array.isArray(response.results.data) ? response.results.data : [];
        const paginationInfo = calculatePaginationInfo(response, page);
        console.log('Pagination Info:', paginationInfo);
        setPagination(paginationInfo);
      } else if (response && response.data) {
        usersData = Array.isArray(response.data) ? response.data : [];
      } else if (Array.isArray(response)) {
        usersData = response;
      } else {
        console.warn('Unexpected users response structure:', response);
        usersData = [];
      }
      
      // Ensure usersData is always an array
      setUsers(Array.isArray(usersData) ? usersData : []);
      
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]); // Set empty array on error to prevent undefined issues
    } finally {
      setLoading(false);
    }
  };


  const fetchUserRoles = async () => {
    try {
      const response = await getUserRoles();
      setUserRoles(response || []);
    } catch (error) {
      console.error('Error fetching user roles:', error);
      setUserRoles([]); // Set empty array on error to prevent undefined issues
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const submitData = {
        ...formData,
        unit: formData.unit ? parseInt(formData.unit) : null,
        role: formData.role ? parseInt(formData.role) : null,
        phone_no: formData.phone_no || null,
        vessel: formData.vessel || null
      };
      
      if (editingUser) {
        await updateUser(editingUser.id, submitData);
      } else {
        await createUser(submitData);
      }
      
      await fetchUsers();
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      loginname: user.loginname,
      email: user.email,
      phone_no: user.phone_no || '',
      unit: user.unit?.toString() || '',
      vessel: user.vessel || '',
      status: user.status,
      role: user.role?.toString() || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        setLoading(true);
        await deleteUser(userId);
        await fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      loginname: '',
      email: '',
      phone_no: '',
      unit: '',
      vessel: '',
      status: 1,
      role: ''
    });
    setEditingUser(null);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    resetForm();
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

  // Helper function to calculate pagination info
  const calculatePaginationInfo = (response: any, currentPage: number): PaginationInfo => {
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

  const handlePageChange = (page: number) => {
    fetchUsers(page);
  };



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-1">Manage system users and their roles</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)} className="hull-button-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingUser ? 'Edit User' : 'Add New User'}
              </DialogTitle>
              <DialogDescription>
                {editingUser ? 'Update the user information.' : 'Create a new user with the following details.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      placeholder="Enter first name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      placeholder="Enter last name"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loginname">Login Name</Label>
                  <Input
                    id="loginname"
                    value={formData.loginname}
                    onChange={(e) => setFormData({ ...formData, loginname: e.target.value })}
                    placeholder="Enter login name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter email address"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone_no">Phone Number</Label>
                  <Input
                    id="phone_no"
                    value={formData.phone_no}
                    onChange={(e) => setFormData({ ...formData, phone_no: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Input
                      id="unit"
                      type="number"
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      placeholder="Enter unit number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vessel">Vessel</Label>
                    <Input
                      id="vessel"
                      value={formData.vessel}
                      onChange={(e) => setFormData({ ...formData, vessel: e.target.value })}
                      placeholder="Enter vessel name"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <select
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select a role</option>
                    {userRoles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: parseInt(e.target.value) })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleDialogClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="hull-button-primary">
                  {loading ? 'Saving...' : editingUser ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Stats */}
      <div className="flex items-center justify-between">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium">Total Users</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">{users.length}</div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">Active</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {users.filter(user => user.status === 1).length}
            </div>
          </Card>
        </div>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            Manage and configure system users
          </CardDescription>
        </CardHeader>
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
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(user)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(user.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
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
      
      {/* Debug info - remove this in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-4 bg-gray-100 rounded text-sm">
          <p><strong>Debug Info:</strong></p>
          <p>Loading: {loading.toString()}</p>
          <p>Total Pages: {pagination.totalPages}</p>
          <p>Current Page: {pagination.currentPage}</p>
          <p>Total Items: {pagination.totalItems}</p>
          <p>Has Next: {pagination.hasNext.toString()}</p>
          <p>Has Previous: {pagination.hasPrevious.toString()}</p>
        </div>
      )}
    </div>
  );
}
