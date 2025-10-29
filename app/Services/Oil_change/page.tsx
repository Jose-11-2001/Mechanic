"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Oil_change() {
  const [oilServices, setOilServices] = useState([]);
  const [cart, setCart] = useState([]);

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
    
    alert(`${service.type} added to cart!`);
  };

  const getCartItemCount = () => {
    return cart.reduce((total: number, item: any) => total + item.cartQuantity, 0);
  };

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

      {/* Cart Icon */}
      <Link href="/Services/Oil_change/Cart" className="absolute top-6 right-6 z-20">
        <button className="relative text-white hover:text-gray-300 transition duration-200">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5.5M7 13l2.5 5.5m0 0L17 21" />
          </svg>
          {getCartItemCount() > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {getCartItemCount()}
            </span>
          )}
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
              {service.quantity > 0 ? (
                <p className="text-green-400 mt-2">In Stock: {service.quantity}</p>
              ) : (
                <p className="text-orange-400 mt-2">Service Booking Only</p>
              )}
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-green-400 font-bold text-lg">K{service.price}</span>
              <button 
                onClick={() => addToCart(service)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                {service.quantity > 0 ? 'Add to Cart' : 'Book Service'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View Cart Button */}
      {cart.length > 0 && (
        <div className="mt-8">
          <Link href="/Services/Oil_change/Cart">
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition duration-200 flex items-center">
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