"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Cars() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    // Load car services from localStorage
    const storedServices = localStorage.getItem('cars');
    if (storedServices) {
      setServices(JSON.parse(storedServices));
    } else {
      // Fallback to default data
      setServices([
        { id: 1, name: 'Tyre Fitting', description: 'Professional tyre installation and balancing', price: 25 },
        { id: 2, name: 'Complete Service', description: 'Full vehicle service and inspection', price: 150 },
        { id: 3, name: 'Engine Tune-up', description: 'Engine performance optimization', price: 80 },
        { id: 4, name: 'Brake Service', description: 'Brake inspection and pad replacement', price: 60 },
        { id: 5, name: 'AC Service', description: 'Air conditioning system service', price: 70 },
        { id: 6, name: 'Wheel Alignment', description: 'Precision wheel alignment service', price: 45 },
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
        <h1 className="text-4xl font-bold text-white mb-4">Car Services</h1>
        <p className="text-xl text-gray-300">Comprehensive car maintenance services</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {services.map((service: any) => (
          <div key={service.id} className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-blue-500 transition duration-300">
            <div className="text-center mb-4">
              <div className="text-3xl mb-2">🚗</div>
              <h3 className="text-xl font-bold text-white">{service.name}</h3>
              <p className="text-gray-300">{service.description}</p>
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-green-400 font-bold text-lg">K{service.price}</span>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200">
                Book Service
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}