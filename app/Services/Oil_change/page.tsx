"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Oil_change() {
  const [oilServices, setOilServices] = useState([]);

  useEffect(() => {
    // Load oil services from localStorage
    const storedServices = localStorage.getItem('oilChange');
    if (storedServices) {
      setOilServices(JSON.parse(storedServices));
    } else {
      // Fallback to default data
      setOilServices([
        { id: 1, type: 'Petrol Engine Oil', grade: '5W-30 Synthetic', price: 45, quantity: 40 },
        { id: 2, type: 'Petrol Engine Oil', grade: '10W-40 Semi-Synthetic', price: 35, quantity: 50 },
        { id: 3, type: 'Diesel Engine Oil', grade: '15W-40 Mineral', price: 40, quantity: 35 },
        { id: 4, type: 'Diesel Engine Oil', grade: '5W-30 Full Synthetic', price: 55, quantity: 25 },
        { id: 5, type: 'Full Service Package', grade: 'Oil + Filter + Inspection', price: 75, quantity: 0 },
        { id: 6, type: 'Premium Service', grade: 'Full Synthetic + All Filters', price: 90, quantity: 0 },
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
        <h1 className="text-4xl font-bold text-white mb-4">Oil Change Services</h1>
        <p className="text-xl text-gray-300">Professional oil and filter services</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {oilServices.map((service: any) => (
          <div key={service.id} className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-blue-500 transition duration-300">
            <div className="text-center mb-4">
              <div className="text-3xl mb-2">🛢️</div>
              <h3 className="text-xl font-bold text-white">{service.type}</h3>
              <p className="text-gray-300">{service.grade}</p>
              {service.quantity > 0 && (
                <p className="text-green-400 mt-2">In Stock: {service.quantity}</p>
              )}
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-green-400 font-bold text-lg">K{service.price}</span>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200">
                {service.quantity > 0 ? 'Add to Cart' : 'Book Service'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}