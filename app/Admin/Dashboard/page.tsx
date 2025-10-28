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
    oil_change: [] // Fixed to match your localStorage key
  });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if admin is authenticated
    const checkAuth = () => {
      const isAuthenticated = localStorage.getItem('adminAuthenticated');
      console.log('Auth check:', isAuthenticated); // Debug log
      
      if (!isAuthenticated) {
        router.push('/Admin/login');
        return false;
      }
      return true;
    };

    // Load services data only if authenticated
    const loadServices = async () => {
      if (!checkAuth()) return;

      // In a real app, this would be an API call
      const data = {
        tyres: JSON.parse(localStorage.getItem('tyres') || '[]'),
        tubes: JSON.parse(localStorage.getItem('tubes') || '[]'),
        engineer: JSON.parse(localStorage.getItem('engineer') || '[]'),
        batteries: JSON.parse(localStorage.getItem('batteries') || '[]'),
        oil_change: JSON.parse(localStorage.getItem('oil_change') || '[]'), // Fixed key
      };
      
      // If no data exists, initialize with default data
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
          oil_change: [ // Fixed key
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

    // Small delay to ensure localStorage is available
    setTimeout(loadServices, 100);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    router.push('/Admin/login');
  };

  // Fixed categories to match your file structure
  const categories = [
    { key: 'tyres', name: 'Tyres', path: 'Tyres', count: services.tyres.length },
    { key: 'tubes', name: 'Tubes', path: 'Tubes', count: services.tubes.length },
    { key: 'engineer', name: 'Engineers', path: 'Engineers', count: services.engineer.length },
    { key: 'batteries', name: 'Batteries', path: 'Batteries', count: services.batteries.length },
    { key: 'oil_change', name: 'Oil Change', path: 'Oil_change', count: services.oil_change.length },
    { key: 'users', name: 'Users', path: 'Users', count: 0 }, 
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8 ">
      <div className="max-w-6xl mx-auto">
         <Link href="/Admin/login" className="text-blue-400 hover:text-blue-300 mb-2 inline-block">
                      ← Back to Login
                    </Link>
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link key={category.key} href={`/Admin/Edit/${category.path}`}>
              <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-blue-500 transition duration-300 cursor-pointer">
                <h3 className="text-xl font-bold text-white mb-2">{category.name}</h3>
                <p className="text-gray-300">Items: {category.count}</p>
                <p className="text-blue-400 mt-2">Click to edit →</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-white font-bold">Total Products</h3>
            <p className="text-2xl text-green-400">
              {categories.reduce((total, cat) => total + cat.count, 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}