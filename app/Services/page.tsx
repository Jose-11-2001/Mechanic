"use client";
import Link from 'next/link';

export default function services() {
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
      name: 'Cars', 
      description: 'Complete car service and maintenance', 
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

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center px-4 py-8"
      style={{ backgroundImage: 'url("/Mechanic4.jpg")' }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>
      
      {/* Back Arrow */}
      <Link href="/Login" className="absolute top-6 left-6 z-20">
        <button className="text-white hover:text-gray-300 transition duration-200">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </Link>

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">BODE AUTOMOTIVES</h1>
          <p className="text-xl text-gray-300">Our Products & Services</p>
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