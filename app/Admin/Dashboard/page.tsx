"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Dashboard() {
  const [services, setServices] = useState({
    tyres: [],
    tubes: [],
    engineer: [],
    batteries: [],
    oil_change: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = localStorage.getItem('adminAuthenticated');
      if (!isAuthenticated) {
        router.push('/Admin/login');
        return false;
      }
      return true;
    };

    const loadServices = async () => {
      if (!checkAuth()) return;

      const data = {
        tyres: JSON.parse(localStorage.getItem('tyres') || '[]'),
        tubes: JSON.parse(localStorage.getItem('tubes') || '[]'),
        engineer: JSON.parse(localStorage.getItem('engineer') || '[]'),
        batteries: JSON.parse(localStorage.getItem('batteries') || '[]'),
        oil_change: JSON.parse(localStorage.getItem('oil_change') || '[]'),
      };
      
      if (data.tyres.length === 0) {
        const defaultData = {
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
          ]
        };
        
        Object.keys(defaultData).forEach(key => {
          localStorage.setItem(key, JSON.stringify(defaultData[key]));
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
    localStorage.removeItem('adminAuthenticated');
    router.push('/Admin/login');
  };

  const categories = [
    { key: 'tyres', name: 'Tyres', path: 'Tyres', count: services.tyres.length, icon: '🛞' },
    { key: 'tubes', name: 'Tubes', path: 'Tubes', count: services.tubes.length, icon: '🌀' },
    { key: 'engineer', name: 'Engineers', path: 'Engineers', count: services.engineer.length, icon: '🔧' },
    { key: 'batteries', name: 'Batteries', path: 'Batteries', count: services.batteries.length, icon: '🔋' },
    { key: 'oil_change', name: 'Oil Change', path: 'Oil_change', count: services.oil_change.length, icon: '🛢️' },
  ];

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

      <div className="max-w-6xl mx-auto relative z-10 w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link href="/Admin/login" className="text-blue-300 hover:text-blue-200 mb-2 inline-block transition duration-200">
              ← Back to Login
            </Link>
            <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-white/80">Manage your automotive services and products</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-lg transition duration-200 transform hover:scale-105 shadow-lg"
          >
            Logout
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
                  Edit Services 
                  <span className="ml-2">→</span>
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h3 className="text-white font-bold mb-2">Total Products</h3>
            <p className="text-3xl text-green-300 font-bold">
              {categories.reduce((total, cat) => total + cat.count, 0)}
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
              {services.tyres.reduce((sum, item: any) => sum + item.quantity, 0) +
               services.batteries.reduce((sum, item: any) => sum + item.quantity, 0) +
               services.oil_change.reduce((sum, item: any) => sum + item.quantity, 0)}
            </p>
            <p className="text-white/60 text-sm mt-2">Total items in stock</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h3 className="text-white font-bold mb-2">Active Services</h3>
            <p className="text-3xl text-purple-300 font-bold">
              {services.engineer.length + services.tubes.length}
            </p>
            <p className="text-white/60 text-sm mt-2">Service types available</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
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
            <Link href="/Admin/SystemSetting">
              <button className="w-full bg-purple-600 hover:bg-purple-500 text-white py-3 px-4 rounded-lg transition duration-200 transform hover:scale-105 text-center">
                System Settings
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}