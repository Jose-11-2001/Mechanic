"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Oil_change() {
  const [oilServices, setOilServices] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Clear old localStorage data first to force refresh
    localStorage.removeItem('oilChange');
    
    // Set new services data
    const newServices = [
      // Petrol Engine Oils
      { id: 1, type: 'Petrol Engine Oil', grade: '5W-30 Full Synthetic', price: 50000, quantity: 40 },
      { id: 2, type: 'Petrol Engine Oil', grade: '10W-40 Semi-Synthetic', price: 45000, quantity: 50 },
      { id: 3, type: 'Petrol Engine Oil', grade: '15W-40 Mineral', price: 30500, quantity: 60 },
      { id: 4, type: 'Petrol Engine Oil', grade: '0W-20 Full Synthetic', price: 75000, quantity: 30 },
      { id: 5, type: 'Petrol Engine Oil', grade: '5W-40 Synthetic', price: 55000, quantity: 35 },
      
      // Diesel Engine Oils
      { id: 6, type: 'Diesel Engine Oil', grade: '15W-40 Mineral', price: 40000, quantity: 35 },
      { id: 7, type: 'Diesel Engine Oil', grade: '10W-30 Synthetic', price: 70000, quantity: 25 },
      { id: 8, type: 'Diesel Engine Oil', grade: '5W-40 Full Synthetic', price: 430000, quantity: 20 },
      { id: 9, type: 'Diesel Engine Oil', grade: '20W-50 Mineral', price: 38000, quantity: 45 },
      
      // Motorcycle Oils
      { id: 10, type: 'Motorcycle Oil', grade: '10W-40 4T Semi-Synthetic', price: 40000, quantity: 30 },
      { id: 11, type: 'Motorcycle Oil', grade: '20W-50 Mineral 4T', price: 32000, quantity: 40 },
      { id: 12, type: 'Motorcycle Oil', grade: '5W-40 Full Synthetic 4T', price: 29000, quantity: 20 },
      
      // Gear Oils
      { id: 13, type: 'Gear Oil', grade: '80W-90 GL-5', price: 48000, quantity: 25 },
      { id: 14, type: 'Gear Oil', grade: '75W-90 Synthetic', price: 62000, quantity: 20 },
      
    
    ];
    
    // Save to localStorage
    localStorage.setItem('oilChange', JSON.stringify(newServices));
    
    // Set state
    setOilServices(newServices);

    // Load cart from localStorage
    const storedCart = localStorage.getItem('oilCart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  const addToCart = (service: any) => {
    const existingItem = cart.find((item: any) => item.id === service.id);
    
    let updatedCart;
    if (existingItem) {
      // Update quantity if item already exists
      updatedCart = cart.map((item: any) =>
        item.id === service.id
          ? { ...item, cartQuantity: item.cartQuantity + 1 }
          : item
      );
    } else {
      // Add new item to cart
      updatedCart = [...cart, { ...service, cartQuantity: 1 }];
    }

    setCart(updatedCart);
    localStorage.setItem('oilCart', JSON.stringify(updatedCart));
    
    alert(`${service.type} - ${service.grade} added to cart!`);
  };

  const getCartItemCount = () => {
    return cart.reduce((total: number, item: any) => total + item.cartQuantity, 0);
  };

  // Group services by type for better organization
  const groupedServices = oilServices.reduce((groups: any, service: any) => {
    const type = service.type;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(service);
    return groups;
  }, {});

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

      {/* Cart Icon */}
      <Link href="/Services/Oil_change/Cart" className="absolute top-6 right-6 z-20">
        <button className="relative text-white hover:text-gray-300 transition duration-200 bg-black/30 rounded-full p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5.5M7 13l2.5 5.5m0 0L17 21" />
          </svg>
          {getCartItemCount() > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {getCartItemCount()}
            </span>
          )}
        </button>
      </Link>

      <div className="text-center mb-12 relative z-10">
        <h1 className="text-4xl font-bold text-white mb-4">Oil & Lubricants</h1>
        <p className="text-xl text-white/90">Premium quality oils and professional services</p>
      </div>

      <div className="w-full max-w-6xl relative z-10 space-y-12">
        {Object.entries(groupedServices).map(([type, services]: [string, any]) => (
          <div key={type} className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 pb-2 border-b border-white/20">
              {type}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service: any) => (
                <div key={service.id} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-blue-400/50 transition duration-300 transform hover:scale-105">
                  <div className="text-center mb-4">
                    <div className="text-3xl mb-2">
                      {type.includes('Petrol') || type.includes('Diesel') ? '🛢️' : 
                       type.includes('Motorcycle') ? '🏍️' :
                       type.includes('Gear') ? '⚙️' : '🔧'}
                    </div>
                    <h3 className="text-lg font-bold text-white">{service.grade}</h3>
                    <p className="text-white/60 text-sm">{type}</p>
                    {service.quantity > 0 ? (
                      <p className="text-green-300 mt-2 text-sm">In Stock: {service.quantity}</p>
                    ) : (
                      <p className="text-orange-300 mt-2 text-sm">Service Booking</p>
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-green-300 font-bold text-lg">K{service.price}</span>
                    <button 
                      onClick={() => addToCart(service)}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition duration-200 transform hover:scale-105 shadow-lg text-sm"
                    >
                      {service.quantity > 0 ? 'Add to Cart' : 'Book Service'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* View Cart Button */}
      {cart.length > 0 && (
        <div className="mt-8 relative z-10">
          <Link href="/Services/Oil_change/Cart">
            <button className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-lg transition duration-200 transform hover:scale-105 shadow-lg flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5.5M7 13l2.5 5.5m0 0L17 21" />
              </svg>
              View Cart ({getCartItemCount()} items)
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}