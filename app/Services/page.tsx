'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Services() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('authenticated');
    const userType = localStorage.getItem('userType');
    
    if (!isAuthenticated) {
      router.push('/Login');
      return;
    }

    // If admin tries to access services page, redirect to admin dashboard
    if (userType === 'admin') {
      router.push('/Admin/Dashboard');
    }
  }, [router]);

  const items = [
    { 
      id: 1, 
      name: 'Tyres', 
      description: 'Premium quality tyres for all vehicles', 
      icon: '🛞',
      href: '/Services/Tyres'
    },
    { 
      id: 2, 
      name: 'Tubes', 
      description: 'Durable inner tubes and accessories', 
      icon: '🌀',
      href: '/Services/Tubes'
    },
    { 
      id: 3, 
      name: 'Car Drivers', 
      description: 'Experienced drivers', 
      icon: '🚗',
      href: '/Services/Cars'
    },
    { 
      id: 4, 
      name: 'Engineer', 
      description: 'Expert mechanical engineering services', 
      icon: '🔧',
      href: '/Services/Engineers'
    },
    { 
      id: 5, 
      name: 'Batteries', 
      description: 'Car batteries and electrical systems', 
      icon: '🔋',
      href: '/Services/Batteries'
    },
    { 
      id: 6, 
      name: 'Oil Change', 
      description: 'Professional oil and filter services', 
      icon: '🛢️',
      href: '/Services/Oil_change'
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('authenticated');
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    router.push('/Login');
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center px-4 py-8"
      style={{ backgroundImage: 'url("/Mechanic4.jpg")' }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>
      
      {/* Header with Logout */}
      <div className="relative z-10 w-full max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <Link href="/Login">
            <button className="text-white hover:text-gray-300 transition duration-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </Link>
          
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition duration-200"
          >
            Logout
          </button>
        </div>

        {/* Content */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">BODE AUTOMOTIVES</h1>
          <p className="text-xl text-gray-300">Our Products & Services</p>
          <p className="text-sm text-green-400 mt-2">Welcome, User!</p>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {items.map((item) => (
            <Link key={item.id} href={item.href}>
              <div 
                className="bg-gray-900 bg-opacity-80 border border-gray-700 rounded-2xl p-6 hover:bg-opacity-90 hover:border-blue-500 transition duration-300 transform hover:scale-105 cursor-pointer h-full"
              >
                <div className="text-4xl mb-4 text-center">{item.icon}</div>
                <h3 className="text-xl font-bold text-white text-center mb-2">{item.name}</h3>
                <p className="text-gray-300 text-center">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}