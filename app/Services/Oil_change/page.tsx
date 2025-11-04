"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface OilService {
  id: number;
  type: string;
  grade: string;
  price: number;
  quantity: number;
}

interface CartItem extends OilService {
  cartQuantity: number;
}

export default function OilChange() {
  const [oilServices, setOilServices] = useState<OilService[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    // Load or initialize services
    const storedServices = localStorage.getItem('oilChange');
    if (storedServices) {
      setOilServices(JSON.parse(storedServices));
    } else {
      const defaultServices: OilService[] = [
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
      
      localStorage.setItem('oilChange', JSON.stringify(defaultServices));
      setOilServices(defaultServices);
    }

    // Load cart
    const storedCart = localStorage.getItem('oilCart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  const addToCart = (service: OilService) => {
    const existingItem = cart.find(item => item.id === service.id);
    
    let updatedCart: CartItem[];
    if (existingItem) {
      updatedCart = cart.map(item =>
        item.id === service.id
          ? { ...item, cartQuantity: item.cartQuantity + 1 }
          : item
      );
    } else {
      updatedCart = [...cart, { ...service, cartQuantity: 1 }];
    }

    setCart(updatedCart);
    localStorage.setItem('oilCart', JSON.stringify(updatedCart));
    
    alert(`${service.type} - ${service.grade} added to cart!`);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.cartQuantity, 0);
  };

  const getServiceIcon = (type: string) => {
    if (type.includes('Petrol') || type.includes('Diesel')) return '🛢️';
    if (type.includes('Motorcycle')) return '🏍️';
    if (type.includes('Gear')) return '⚙️';
    return '🔧';
  };

  const formatPrice = (price: number) => {
    return `K${price.toLocaleString('en-MW')}`;
  };

  // Group services by type
  const groupedServices = oilServices.reduce((groups: Record<string, OilService[]>, service) => {
    const type = service.type;
    if (!groups[type]) groups[type] = [];
    groups[type].push(service);
    return groups;
  }, {});

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{ backgroundImage: "url('/mechanic4.jpg')" }}
      />
      <div className="fixed inset-0 bg-black/50" />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-black/80 backdrop-blur-md border-b border-white/20">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/Services" className="flex items-center text-white hover:text-gray-300 transition duration-200">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Services
            </Link>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white">Oil & Lubricants</h1>
              <p className="text-white/80">Premium quality oils and professional services</p>
            </div>

            <Link href="/Services/Oil_change/Cart" className="relative">
              <button className="text-white hover:text-gray-300 transition duration-200 bg-white/10 rounded-lg p-2">
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
          </div>
        </header>

        {/* Services Grid */}
        <main className="container mx-auto px-6 py-8">
          <div className="space-y-12">
            {Object.entries(groupedServices).map(([type, services]) => (
              <section key={type}>
                <h2 className="text-2xl font-bold text-white mb-6 pb-2 border-b border-white/20">
                  {type}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map(service => (
                    <div key={service.id} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-blue-400/50 transition duration-300">
                      <div className="text-center mb-4">
                        <div className="text-3xl mb-2">{getServiceIcon(service.type)}</div>
                        <h3 className="text-lg font-bold text-white">{service.grade}</h3>
                        <p className="text-white/60 text-sm">{service.type}</p>
                        <p className={`mt-2 text-sm ${
                          service.quantity > 0 ? 'text-green-300' : 'text-orange-300'
                        }`}>
                          {service.quantity > 0 ? `In Stock: ${service.quantity}` : 'Service Booking'}
                        </p>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-green-300 font-bold text-lg">
                          {formatPrice(service.price)}
                        </span>
                        <button 
                          onClick={() => addToCart(service)}
                          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition duration-200 text-sm"
                        >
                          {service.quantity > 0 ? 'Add to Cart' : 'Book Service'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* View Cart Button */}
          {cart.length > 0 && (
            <div className="fixed bottom-6 right-6 z-10">
              <Link href="/Services/Oil_change/Cart">
                <button className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-lg transition duration-200 shadow-lg flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5.5M7 13l2.5 5.5m0 0L17 21" />
                  </svg>
                  View Cart ({getCartItemCount()} items)
                </button>
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}