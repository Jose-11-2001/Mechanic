"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  role: 'admin' | 'customer';
  status: 'active' | 'inactive';
  createdAt: string;
  isMainAdmin?: boolean;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  phone?: string;
  [key: string]: string | undefined;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<FormErrors>({});
  const router = useRouter();

  const MAIN_ADMIN_ID = 1;

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated');
    if (!isAuthenticated) {
      router.push('/Admin/login');
      return;
    }

    const loadUsers = () => {
      const storedUsers = localStorage.getItem('users');
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      } else {
        const defaultUsers: User[] = [
          {
            id: MAIN_ADMIN_ID,
            firstName: 'Admin',
            lastName: 'User',
            username: 'admin',
            email: 'admin@bodeautomotive.com',
            phone: '+265 888 123 456',
            role: 'admin',
            status: 'active',
            createdAt: new Date().toISOString(),
            isMainAdmin: true
          }
        ];
        setUsers(defaultUsers);
        localStorage.setItem('users', JSON.stringify(defaultUsers));
      }
      setIsLoading(false);
    };

    loadUsers();
  }, [router]);

  const validateUser = (userData: Partial<User>, isNewUser = false): FormErrors => {
    const newErrors: FormErrors = {};

    // Required field validation
    if (!userData.firstName?.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!userData.lastName?.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!userData.username?.trim()) {
      newErrors.username = 'Username is required';
    }
    if (!userData.email?.trim()) {
      newErrors.email = 'Email is required';
    }
    if (!userData.phone?.trim()) {
      newErrors.phone = 'Phone is required';
    }

    // Check for duplicate username
    if (userData.username) {
      const duplicateUsername = users.find(user => 
        user.username.toLowerCase() === userData.username!.toLowerCase() &&
        (isNewUser || user.id !== userData.id)
      );
      if (duplicateUsername) {
        newErrors.username = 'Username already exists';
      }
    }

    // Check for duplicate email
    if (userData.email) {
      const duplicateEmail = users.find(user => 
        user.email.toLowerCase() === userData.email!.toLowerCase() &&
        (isNewUser || user.id !== userData.id)
      );
      if (duplicateEmail) {
        newErrors.email = 'Email already exists';
      }
    }

    // Check for duplicate phone
    if (userData.phone) {
      const duplicatePhone = users.find(user => 
        user.phone === userData.phone &&
        (isNewUser || user.id !== userData.id)
      );
      if (duplicatePhone) {
        newErrors.phone = 'Phone number already exists';
      }
    }

    // Email format validation
    if (userData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Username format validation
    if (userData.username && !/^[a-zA-Z0-9_]+$/.test(userData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    return newErrors;
  };

  const handleSave = () => {
    localStorage.setItem('users', JSON.stringify(users));
    alert('Users saved successfully!');
  };

  const handleEdit = (user: User) => {
    setEditingUser({ ...user });
    setErrors({});
    setShowUserModal(true);
  };

  const handleUpdate = () => {
    if (!editingUser) return;

    const isNewUser = !users.some(user => user.id === editingUser.id);
    const validationErrors = validateUser(editingUser, isNewUser);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    let updatedUsers: User[];
    
    if (isNewUser) {
      const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 2;
      updatedUsers = [...users, { 
        ...editingUser, 
        id: newId,
        createdAt: new Date().toISOString()
      }];
    } else {
      updatedUsers = users.map(user => 
        user.id === editingUser.id ? { ...editingUser } : user
      );
    }
    
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setEditingUser(null);
    setShowUserModal(false);
    setErrors({});
    
    alert(isNewUser ? 'User added successfully!' : 'User updated successfully!');
  };

  const handleAddNew = () => {
    const newUser: User = {
      id: 0,
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      phone: '',
      role: 'customer',
      status: 'active',
      createdAt: ''
    };
    setEditingUser(newUser);
    setErrors({});
    setShowUserModal(true);
  };

  const handleDelete = (id: number) => {
    const userToDelete = users.find(user => user.id === id);
    
    if (!userToDelete) return;

    if (id === MAIN_ADMIN_ID) {
      alert('Cannot delete the main administrator account.');
      return;
    }

    if (userToDelete.role === 'admin') {
      if (!confirm('WARNING: This is an administrator account. Are you sure you want to delete this admin user?')) {
        return;
      }
    } else {
      if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        return;
      }
    }

    const updatedUsers = users.filter(user => user.id !== id);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    const userType = userToDelete.role === 'admin' ? 'Admin user' : 'User';
    alert(`${userType} deleted successfully!`);
  };

  const handleStatusToggle = (id: number, currentStatus: string) => {
    if (id === MAIN_ADMIN_ID) {
      alert('Cannot deactivate the main administrator account.');
      return;
    }

    const updatedUsers = users.map(user => 
      user.id === id ? { 
        ...user, 
        status: currentStatus === 'active' ? 'inactive' : 'active' 
      } : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const handleFieldChange = (field: keyof User, value: string) => {
    if (!editingUser) return;

    setEditingUser(prev => ({
      ...prev!,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const renderField = (
    label: string, 
    value: string, 
    field: keyof User, 
    type = 'text', 
    options: {value: string, label: string}[] = []
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
      {type === 'select' ? (
        <select
          value={value || ''}
          onChange={(e) => handleFieldChange(field, e.target.value)}
          className={`w-full px-3 py-2 bg-gray-700 border rounded text-white ${
            errors[field] ? 'border-red-500' : 'border-gray-600'
          }`}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value || ''}
          onChange={(e) => handleFieldChange(field, e.target.value)}
          className={`w-full px-3 py-2 bg-gray-700 border rounded text-white ${
            errors[field] ? 'border-red-500' : 'border-gray-600'
          }`}
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      )}
      {errors[field] && (
        <p className="text-red-400 text-xs mt-1">{errors[field]}</p>
      )}
    </div>
  );

  const canDeleteUser = (user: User) => {
    return user.id !== MAIN_ADMIN_ID;
  };

  const canToggleStatus = (user: User) => {
    return user.id !== MAIN_ADMIN_ID;
  };

  const getUsername = (user: User) => {
    return user.username || 'No username';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading Users...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <Link href="/Admin/Dashboard" className="text-blue-400 hover:text-blue-300 mb-2 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-white">User Management</h1>
            <p className="text-gray-400">Manage customer and staff accounts</p>
          </div>
          <div className="space-x-2">
            <button
              onClick={handleAddNew}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200"
            >
              Add New User
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
            >
              Save All Changes
            </button>
          </div>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-white font-bold">Total Users</h3>
            <p className="text-2xl text-blue-400">{users.length}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-white font-bold">Active Users</h3>
            <p className="text-2xl text-green-400">
              {users.filter(user => user.status === 'active').length}
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-white font-bold">Admins</h3>
            <p className="text-2xl text-purple-400">
              {users.filter(user => user.role === 'admin').length}
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-white font-bold">Customers</h3>
            <p className="text-2xl text-yellow-400">
              {users.filter(user => user.role === 'customer').length}
            </p>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full text-white">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-4">User</th>
                  <th className="text-left p-4">Contact</th>
                  <th className="text-left p-4">Role</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Joined</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-750">
                    <td className="p-4">
                      <div>
                        <div className="font-bold">{user.firstName} {user.lastName}</div>
                        <div className="text-gray-400 text-sm">@{getUsername(user)}</div>
                        <div className="text-gray-400 text-sm">ID: {user.id}</div>
                        {user.id === MAIN_ADMIN_ID && (
                          <div className="text-xs text-yellow-400 font-bold mt-1">MAIN ADMIN</div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        <div>{user.email}</div>
                        <div className="text-gray-400">{user.phone}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        user.role === 'admin' 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-blue-600 text-white'
                      }`}>
                        {user.role}
                        {user.id === MAIN_ADMIN_ID && ' ★'}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleStatusToggle(user.id, user.status)}
                        disabled={!canToggleStatus(user)}
                        className={`px-2 py-1 rounded-full text-xs font-bold ${
                          user.status === 'active' 
                            ? 'bg-green-600 text-white hover:bg-green-700' 
                            : 'bg-red-600 text-white hover:bg-red-700'
                        } ${!canToggleStatus(user) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title={!canToggleStatus(user) ? 'Cannot deactivate main admin' : ''}
                      >
                        {user.status}
                      </button>
                    </td>
                    <td className="p-4 text-sm text-gray-400">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition duration-200"
                        >
                          Edit
                        </button>
                        {canDeleteUser(user) ? (
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition duration-200"
                            title={user.role === 'admin' ? 'Delete admin user' : 'Delete user'}
                          >
                            Delete
                          </button>
                        ) : (
                          <span 
                            className="bg-gray-600 text-gray-400 px-3 py-1 rounded text-sm cursor-not-allowed"
                            title="Main admin cannot be deleted"
                          >
                            Delete
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Modal */}
        {showUserModal && editingUser && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md border border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {!users.some(user => user.id === editingUser.id) ? 'Add New User' : 'Edit User'}
                </h2>
                <button 
                  onClick={() => setShowUserModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {renderField('First Name', editingUser.firstName, 'firstName')}
                  {renderField('Last Name', editingUser.lastName, 'lastName')}
                </div>
                
                {renderField('Username', editingUser.username, 'username')}
                {renderField('Email', editingUser.email, 'email', 'email')}
                {renderField('Phone', editingUser.phone, 'phone', 'tel')}
                
                {renderField('Role', editingUser.role, 'role', 'select', [
                  { value: 'customer', label: 'Customer' },
                  { value: 'admin', label: 'Admin' }
                ])}
                
                {renderField('Status', editingUser.status, 'status', 'select', [
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' }
                ])}
              </div>

              <div className="flex space-x-2 mt-6">
                <button
                  onClick={handleUpdate}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex-1 transition duration-200"
                >
                  {!users.some(user => user.id === editingUser.id) ? 'Add User' : 'Update User'}
                </button>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}