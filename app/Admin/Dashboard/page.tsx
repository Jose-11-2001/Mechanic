'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Define the interface for services data
interface ServicesData {
  tyres: { id: number; size: string; brand: string; type: string; price: number; quantity: number; }[];
  tubes: { id: number; size: string; type: string; valve: string; price: number; quantity: number; }[];
  engineer: { id: number; name: string; description: string; price: number; }[];
  batteries: { id: number; type: string; capacity: string; warranty: string; price: number; quantity: number; }[];
  oil_change: { id: number; type: string; grade: string; price: number; quantity: number; }[];
  cars: { id: number; model: string; brand: string; year: number; price_per_day: number; available: boolean; image?: string; }[];
  users: { id: number; name: string; email: string; phone: string; role: string; createdAt: string; }[];
}

export default function Dashboard() {
  const [services, setServices] = useState<ServicesData>({
    tyres: [],
    tubes: [],
    engineer: [],
    batteries: [],
    oil_change: [],
    cars: [],
    users: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = localStorage.getItem('authenticated');
      const userType = localStorage.getItem('userType');
      
      if (!isAuthenticated || userType !== 'admin') {
        router.push('/Login');
        return false;
      }
      return true;
    };

    const loadServices = async () => {
      if (!checkAuth()) return;

      const data: ServicesData = {
        tyres: JSON.parse(localStorage.getItem('tyres') || '[]'),
        tubes: JSON.parse(localStorage.getItem('tubes') || '[]'),
        engineer: JSON.parse(localStorage.getItem('engineer') || '[]'),
        batteries: JSON.parse(localStorage.getItem('batteries') || '[]'),
        oil_change: JSON.parse(localStorage.getItem('oil_change') || '[]'),
        cars: JSON.parse(localStorage.getItem('cars') || '[]'),
        users: JSON.parse(localStorage.getItem('users') || '[]'),
      };
      
      if (data.tyres.length === 0) {
        const defaultData: ServicesData = {
          tyres: [
            { id: 1, size: '165/70R14', brand: 'Michelin', type: 'All Season', price: 85000, quantity: 50 },
            { id: 2, size: '185/65R15', brand: 'Bridgestone', type: 'Touring', price: 95000, quantity: 30 },
          ],
          tubes: [
            { id: 1, size: '12-inch', type: 'Bicycle Tube', valve: 'Schrader', price: 8000, quantity: 100 },
          ],
          engineer: [
            { id: 1, name: 'Automobile Repair', description: 'General maintenance', price: 50000 },
          ],
          batteries: [
            { id: 1, type: 'Lead Acid Battery', capacity: '45Ah', warranty: '1 Year', price: 150000, quantity: 20 },
          ],
          oil_change: [
            { id: 1, type: 'Petrol Engine Oil', grade: '5W-30 Synthetic', price: 45000, quantity: 40 },
          ],
          cars: [
            { id: 1, model: 'Toyota Corolla', brand: 'Toyota', year: 2022, price_per_day: 50000, available: true },
            { id: 2, model: 'Honda CR-V', brand: 'Honda', year: 2021, price_per_day: 65000, available: true },
            { id: 3, model: 'BMW X5', brand: 'BMW', year: 2023, price_per_day: 120000, available: false },
          ],
          users: [
            { 
              id: 1, 
              name: 'John Banda', 
              email: 'john@gmail.com', 
              phone: '+255123456789', 
              role: 'customer', 
              createdAt: '2024-01-15' 
            },
            { 
              id: 2, 
              name: 'Jane Mbukwa', 
              email: 'jane@gmail.com', 
              phone: '+255987654321', 
              role: 'customer', 
              createdAt: '2024-01-20' 
            },
            { 
              id: 3, 
              name: 'Admin User', 
              email: 'admin@bodeautomotive.com', 
              phone: '+265 886663959', 
              role: 'admin', 
              createdAt: '2024-01-10' 
            }
          ]
        };
        
        Object.keys(defaultData).forEach(key => {
          localStorage.setItem(key, JSON.stringify(defaultData[key as keyof ServicesData]));
        });
        
        setServices(defaultData);
      } else {
        setServices(data);
      }
      
      setIsLoading(false);
    };

    setTimeout(loadServices, 100);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('authenticated');
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    router.push('/Login');
  };

  const handleAddUser = () => {
    const newUser = {
      id: services.users.length + 1,
      name: `New User ${services.users.length + 1}`,
      email: `user${services.users.length + 1}@example.com`,
      phone: '+255000000000',
      role: 'customer',
      createdAt: new Date().toISOString().split('T')[0]
    };

    const updatedUsers = [...services.users, newUser];
    setServices(prev => ({ ...prev, users: updatedUsers }));
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const handleDeleteUser = (userId: number) => {
    if (confirm('Are you sure you want to delete this user?')) {
      const updatedUsers = services.users.filter(user => user.id !== userId);
      setServices(prev => ({ ...prev, users: updatedUsers }));
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    }
  };

  const handleUpdateUser = (userId: number, field: string, value: string) => {
    const updatedUsers = services.users.map(user => 
      user.id === userId ? { ...user, [field]: value } : user
    );
    setServices(prev => ({ ...prev, users: updatedUsers }));
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const categories = [
    { key: 'tyres', name: 'Tyres', path: 'Tyres', count: services.tyres.length, icon: '🛞' },
    { key: 'tubes', name: 'Tubes', path: 'Tubes', count: services.tubes.length, icon: '🌀' },
    { key: 'engineer', name: 'Engineers', path: 'Engineers', count: services.engineer.length, icon: '🔧' },
    { key: 'batteries', name: 'Batteries', path: 'Batteries', count: services.batteries.length, icon: '🔋' },
    { key: 'oil_change', name: 'Oil Change', path: 'Oil_change', count: services.oil_change.length, icon: '🛢️' },
    { key: 'cars', name: 'Car Rental', path: 'Cars', count: services.cars.length, icon: '🚗' },
    { key: 'users', name: 'Users', path: 'Users', count: services.users.length, icon: '👥' },
  ];

  // Calculate available cars
  const availableCars = services.cars.filter(car => car.available).length;

  if (isLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center relative"
        style={{
          backgroundImage: "url('/mechanic4.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="text-white text-xl relative z-10">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex flex-col items-center p-8 relative"
      style={{
        backgroundImage: "url('/mechanic4.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link href="/Login" className="text-blue-300 hover:text-blue-200 mb-2 inline-block transition duration-200">
              ← Back to Login
            </Link>
            <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-white/80">Manage your automotive services, products, and users</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-lg transition duration-200 transform hover:scale-105 shadow-lg"
          >
            Logout
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-2 mb-8 bg-white/10 backdrop-blur-md rounded-xl p-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-6 py-3 rounded-lg transition duration-200 ${
              activeTab === 'dashboard' 
                ? 'bg-blue-600 text-white' 
                : 'text-white/70 hover:text-white'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 rounded-lg transition duration-200 ${
              activeTab === 'users' 
                ? 'bg-blue-600 text-white' 
                : 'text-white/70 hover:text-white'
            }`}
          >
            Users ({services.users.length})
          </button>
        </div>

        {activeTab === 'dashboard' && (
          <>
            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {categories.map((category) => (
                <Link key={category.key} href={`/Admin/Edit/${category.path}`}>
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-blue-400/50 transition duration-300 transform hover:scale-105 cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-3xl">{category.icon}</div>
                      <span className="bg-blue-600 text-white text-sm px-2 py-1 rounded-full">
                        {category.count} items
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{category.name}</h3>
                    <p className="text-white/60 text-sm mb-4">Manage {category.name.toLowerCase()} inventory and pricing</p>
                    <p className="text-blue-300 font-semibold flex items-center">
                      Edit {category.name}
                      <span className="ml-2">→</span>
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <h3 className="text-white font-bold mb-2">Total Products</h3>
                <p className="text-3xl text-green-300 font-bold">
                  {categories.reduce((total, cat) => total + cat.count, 0) - services.users.length}
                </p>
                <p className="text-white/60 text-sm mt-2">Across all categories</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <h3 className="text-white font-bold mb-2">Categories</h3>
                <p className="text-3xl text-blue-300 font-bold">{categories.length}</p>
                <p className="text-white/60 text-sm mt-2">Service categories</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <h3 className="text-white font-bold mb-2">In Stock</h3>
                <p className="text-3xl text-yellow-300 font-bold">
                  {services.tyres.reduce((sum, item) => sum + item.quantity, 0) +
                   services.batteries.reduce((sum, item) => sum + item.quantity, 0) +
                   services.oil_change.reduce((sum, item) => sum + item.quantity, 0)}
                </p>
                <p className="text-white/60 text-sm mt-2">Total items in stock</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <h3 className="text-white font-bold mb-2">Total Users</h3>
                <p className="text-3xl text-purple-300 font-bold">
                  {services.users.length}
                </p>
                <p className="text-white/60 text-sm mt-2">Registered users</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/Admin/AddProduct">
                  <button className="w-full bg-green-600 hover:bg-green-500 text-white py-3 px-4 rounded-lg transition duration-200 transform hover:scale-105 text-center">
                    Add New Product
                  </button>
                </Link>
                <Link href="/Admin/ViewOrders">
                  <button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 px-4 rounded-lg transition duration-200 transform hover:scale-105 text-center">
                    View Orders
                  </button>
                </Link>
                <button 
                  onClick={() => setActiveTab('users')}
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white py-3 px-4 rounded-lg transition duration-200 transform hover:scale-105 text-center"
                >
                  Manage Users
                </button>
              </div>
            </div>

            {/* Car Rental Status */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Car Rental Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.cars.map((car) => (
                  <div key={car.id} className={`bg-gray-800 rounded-lg p-4 border ${
                    car.available ? 'border-green-500' : 'border-red-500'
                  }`}>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-white font-bold">{car.brand} {car.model}</h4>
                      <span className={`px-2 py-1 rounded text-xs ${
                        car.available ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                      }`}>
                        {car.available ? 'Available' : 'Rented'}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm">Year: {car.year}</p>
                    <p className="text-green-300 font-bold">MK {car.price_per_day.toLocaleString()}/day</p>
                  </div>
                ))}
                {services.cars.length === 0 && (
                  <div className="col-span-3 text-center py-4">
                    <p className="text-gray-400">No cars added yet. Add cars to start renting.</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === 'users' && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">User Management</h2>
              <button
                onClick={handleAddUser}
                className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                Add New User
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left p-4">ID</th>
                    <th className="text-left p-4">Name</th>
                    <th className="text-left p-4">Email</th>
                    <th className="text-left p-4">Phone</th>
                    <th className="text-left p-4">Role</th>
                    <th className="text-left p-4">Created</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.users.map((user) => (
                    <tr key={user.id} className="border-b border-white/10 hover:bg-white/5">
                      <td className="p-4">{user.id}</td>
                      <td className="p-4">
                        <input
                          type="text"
                          value={user.name}
                          onChange={(e) => handleUpdateUser(user.id, 'name', e.target.value)}
                          className="bg-transparent border border-white/20 rounded px-2 py-1 text-white w-full"
                        />
                      </td>
                      <td className="p-4">
                        <input
                          type="email"
                          value={user.email}
                          onChange={(e) => handleUpdateUser(user.id, 'email', e.target.value)}
                          className="bg-transparent border border-white/20 rounded px-2 py-1 text-white w-full"
                        />
                      </td>
                      <td className="p-4">
                        <input
                          type="tel"
                          value={user.phone}
                          onChange={(e) => handleUpdateUser(user.id, 'phone', e.target.value)}
                          className="bg-transparent border border-white/20 rounded px-2 py-1 text-white w-full"
                        />
                      </td>
                      <td className="p-4">
                        <select
                          value={user.role}
                          onChange={(e) => handleUpdateUser(user.id, 'role', e.target.value)}
                          className="bg-gray-700 border border-white/20 rounded px-2 py-1 text-white"
                        >
                          <option value="customer">Customer</option>
                          <option value="admin">Admin</option>
                          <option value="staff">Staff</option>
                        </select>
                      </td>
                      <td className="p-4">{user.createdAt}</td>
                      <td className="p-4">
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded transition duration-200"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {services.users.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center p-4 text-gray-400">
                        No users found. Click "Add New User" to create one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* User Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-blue-600/20 rounded-lg p-4 border border-blue-500/30">
                <h4 className="text-blue-300 font-bold">Total Users</h4>
                <p className="text-2xl text-white">{services.users.length}</p>
              </div>
              <div className="bg-green-600/20 rounded-lg p-4 border border-green-500/30">
                <h4 className="text-green-300 font-bold">Customers</h4>
                <p className="text-2xl text-white">
                  {services.users.filter(user => user.role === 'customer').length}
                </p>
              </div>
              <div className="bg-purple-600/20 rounded-lg p-4 border border-purple-500/30">
                <h4 className="text-purple-300 font-bold">Admins</h4>
                <p className="text-2xl text-white">
                  {services.users.filter(user => user.role === 'admin').length}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}