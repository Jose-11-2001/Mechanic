"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

// Define the Service interface
interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
}

export default function Engineers() {
  const [services, setServices] = useState<Service[]>([]); // Add type annotation here

  useEffect(() => {
    // Force new services data - don't check localStorage
    const newServices: Service[] = [ // Add type annotation here
      { id: 1, name: 'Engine Repair', description: 'Complete engine diagnostics, repair and overhaul services', price: 150000 },
      { id: 2, name: 'Tyre Fitting', description: 'Professional tyre fitting, balancing and wheel alignment', price: 25000 },
      { id: 3, name: 'Body Repairing', description: 'Car body repair, dent removal and professional painting', price: 120000 },
    ];
    
    setServices(newServices);
    
    // Also update localStorage
    localStorage.setItem('engineer', JSON.stringify(newServices));
  }, []);

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-8 relative"
      style={{
        backgroundImage: "url('/mechanic4.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/50"></div>
      
      {/* Back Arrow */}
      <Link href="/Services" className="absolute top-6 left-6 z-20">
        <button className="text-white hover:text-gray-300 transition duration-200 bg-black/30 rounded-full p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </Link>

      <div className="text-center mb-12 relative z-10">
        <h1 className="text-4xl font-bold text-white mb-4">Engineering Services</h1>
        <p className="text-xl text-white/90">Professional mechanical engineering services</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl relative z-10">
        {services.map((service: Service) => ( // Use Service type here
          <div key={service.id} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-blue-400/50 transition duration-300 transform hover:scale-105">
            <div className="text-center mb-4">
              <div className="text-3xl mb-2">🔧</div>
              <h3 className="text-xl font-bold text-white">{service.name}</h3>
              <p className="text-white/80">{service.description}</p>
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-green-300 font-bold text-lg">K{service.price}</span>
              <Link 
                href={{
                  pathname: "/BookEngineer",
                  query: { 
                    service: service.name,
                    price: service.price,
                    description: service.description
                  }
                }}
              >  
                <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition duration-200 transform hover:scale-105 shadow-lg">
                  Book Now
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}