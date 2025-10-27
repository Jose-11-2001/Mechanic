"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Engineers() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    // Load engineer services from localStorage
    const storedServices = localStorage.getItem('engineer');
    if (storedServices) {
      setServices(JSON.parse(storedServices));
    } else {
      // Fallback to default data
      setServices([
        { id: 1, name: 'Automobile Repair', description: 'General automobile maintenance and repair', price: 50 },
        { id: 2, name: 'Tyre Fitting', description: 'Professional tyre fitting and balancing', price: 20 },
        { id: 3, name: 'Engine Repair', description: 'Complete engine diagnostics and repair', price: 100 },
        { id: 4, name: 'Brake Services', description: 'Brake inspection and repair services', price: 60 },
        { id: 5, name: 'Suspension Work', description: 'Suspension system repair and alignment', price: 80 },
        { id: 6, name: 'Electrical Systems', description: 'Car electrical system diagnostics and repair', price: 70 },
      ]);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-8">
      {/* Back Arrow */}
      <Link href="/Services" className="absolute top-6 left-6 z-20">
        <button className="text-white hover:text-gray-300 transition duration-200">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </Link>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Engineering Services</h1>
        <p className="text-xl text-gray-300">Professional mechanical engineering services</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {services.map((service: any) => (
          <div key={service.id} className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-blue-500 transition duration-300">
            <h3 className="text-xl font-bold text-white mb-2">{service.name}</h3>
            <p className="text-gray-300 mb-4">{service.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-green-400 font-bold">${service.price}</span>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200">
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}