"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated');
    if (!isAuthenticated) {
      router.push('/Admin/login');
      return;
    }

    // Load users from localStorage
    const loadUsers = () => {
      const storedUsers = localStorage.getItem('users');
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      } else {
        // Initialize with default admin user
        const defaultUsers = [
          {
            id: 1,
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@bodeautomotive.com',
            phone: '+265 888 123 456',
            role: 'admin',
            status: 'active',
            createdAt: new Date().toISOString()
          }
        ];
        setUsers(defaultUsers);
        localStorage.setItem('users', JSON.stringify(defaultUsers));
      }
      setIsLoading(false);
    };

    loadUsers();
  }, [router]);

  const handleSave = () => {
    localStorage.setItem('users', JSON.stringify(users));
    alert('Users saved successfully!');
  };

  const handleEdit = (user: any) => {
    setEditingUser({ ...user });
    setShowUserModal(true);
  };

  const handleUpdate = () => {
    if (editingUser) {
      let updatedUsers;
      
      if (editingUser.id > 1000) {
        // Add new user
        updatedUsers = [...users, { ...editingUser, createdAt: new Date().toISOString() }];
      } else {
        // Update existing user
        updatedUsers = users.map((user: any) => 
          user.id === editingUser.id ? editingUser : user
        );
      }
      
      setUsers(updatedUsers);
      setEditingUser(null);
      setShowUserModal(false);
    }
  };

  const handleAddNew = () => {
    const newUser = {
      id: Date.now(),
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: 'customer',
      status: 'active',
    };
    setEditingUser(newUser);
    setShowUserModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      const updatedUsers = users.filter((user: any) => user.id !== id);
      setUsers(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      alert('User deleted successfully!');
    }
  };

  const handleStatusToggle = (id: number, currentStatus: string) => {
    const updatedUsers = users.map((user: any) => 
      user.id === id ? { ...user, status: currentStatus === 'active' ? 'inactive' : 'active' } : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const renderField = (label: string, value: any, field: string, type = 'text', options = []) => (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
      {type === 'select' ? (
        <select
          value={value || ''}
          onChange={(e) => setEditingUser({
            ...editingUser,
            [field]: e.target.value
          })}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
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
          onChange={(e) => setEditingUser({
            ...editingUser,
            [field]: e.target.value
          })}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      )}
    </div>
  );

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
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              Add New User
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
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
              {users.filter((user: any) => user.status === 'active').length}
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-white font-bold">Admins</h3>
            <p className="text-2xl text-purple-400">
              {users.filter((user: any) => user.role === 'admin').length}
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-white font-bold">Customers</h3>
            <p className="text-2xl text-yellow-400">
              {users.filter((user: any) => user.role === 'customer').length}
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
                {users.map((user: any) => (
                  <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-750">
                    <td className="p-4">
                      <div>
                        <div className="font-bold">{user.firstName} {user.lastName}</div>
                        <div className="text-gray-400 text-sm">ID: {user.id}</div>
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
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleStatusToggle(user.id, user.status)}
                        className={`px-2 py-1 rounded-full text-xs font-bold ${
                          user.status === 'active' 
                            ? 'bg-green-600 text-white hover:bg-green-700' 
                            : 'bg-red-600 text-white hover:bg-red-700'
                        }`}
                      >
                        {user.status}
                      </button>
                    </td>
                    <td className="p-4 text-sm text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                        >
                          Edit
                        </button>
                        {user.role !== 'admin' && (
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                          >
                            Delete
                          </button>
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-md border border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {editingUser.id > 1000 ? 'Add New User' : 'Edit User'}
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
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex-1"
                >
                  {editingUser.id > 1000 ? 'Add User' : 'Update User'}
                </button>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
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