"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CartItem {
  id: number;
  type: string;
  grade: string;
  price: number;
  quantity: number;
  cartQuantity: number;
}

export default function Cart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    // Load cart from localStorage
    const storedCart = localStorage.getItem('oilCart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(id);
      return;
    }

    const updatedCart = cart.map(item =>
      item.id === id ? { ...item, cartQuantity: newQuantity } : item
    );
    
    setCart(updatedCart);
    localStorage.setItem('oilCart', JSON.stringify(updatedCart));
  };

  const removeFromCart = (id: number) => {
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem('oilCart', JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      setCart([]);
      localStorage.removeItem('oilCart');
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.cartQuantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.cartQuantity, 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    alert(`Proceeding to checkout with ${getTotalItems()} items. Total: K${calculateTotal().toLocaleString('en-MW')}`);
    // Here you would typically redirect to a checkout page
  };

  const getOilIcon = (type: string) => {
    if (type.includes('Petrol') || type.includes('Diesel')) return '🛢️';
    if (type.includes('Motorcycle')) return '🏍️';
    if (type.includes('Gear')) return '⚙️';
    return '🔧';
  };

  const formatPrice = (price: number) => {
    return `K${price.toLocaleString('en-MW')}`;
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Background */}
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
            <Link href="/Services/Oil_change" className="flex items-center text-white hover:text-gray-300 transition duration-200">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Services
            </Link>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white">Shopping Cart</h1>
              <p className="text-white/80">Review your selected oil services</p>
            </div>

            <div className="w-10"></div> {/* Spacer for balance */}
          </div>
        </header>

        <main className="container mx-auto px-6 py-8">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🛒</div>
              <h2 className="text-2xl font-bold text-white mb-4">Your cart is empty</h2>
              <p className="text-white/80 mb-6">Add some oil services to get started</p>
              <Link href="/Services/Oil_change">
                <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg transition duration-200 shadow-lg">
                  Browse Services
                </button>
              </Link>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              {/* Cart Items */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Cart Items ({getTotalItems()})</h2>
                  <button 
                    onClick={clearCart}
                    className="text-red-300 hover:text-red-200 text-sm transition duration-200 bg-red-900/30 hover:bg-red-900/50 px-3 py-2 rounded-lg"
                  >
                    Clear Cart
                  </button>
                </div>

                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 transition duration-200">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">{getOilIcon(item.type)}</div>
                        <div>
                          <h3 className="text-lg font-bold text-white">{item.grade}</h3>
                          <p className="text-white/80 text-sm">{item.type}</p>
                          <p className="text-green-300 font-bold">{formatPrice(item.price)} each</p>
                          {item.quantity > 0 ? (
                            <p className="text-green-300 text-xs mt-1">In Stock: {item.quantity}</p>
                          ) : (
                            <p className="text-orange-300 text-xs mt-1">Service Booking</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => updateQuantity(item.id, item.cartQuantity - 1)}
                            className="bg-white/20 hover:bg-white/30 text-white w-8 h-8 rounded transition duration-200"
                          >
                            -
                          </button>
                          <span className="text-white font-bold min-w-8 text-center">{item.cartQuantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.cartQuantity + 1)}
                            className="bg-white/20 hover:bg-white/30 text-white w-8 h-8 rounded transition duration-200"
                          >
                            +
                          </button>
                        </div>

                        {/* Item Total */}
                        <div className="text-right min-w-24">
                          <p className="text-green-300 font-bold">{formatPrice(item.price * item.cartQuantity)}</p>
                        </div>

                        {/* Remove Button */}
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-300 hover:text-red-200 transition duration-200 bg-red-900/30 hover:bg-red-900/50 p-2 rounded-lg"
                          title="Remove item"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-white/80">
                    <span>Subtotal ({getTotalItems()} items):</span>
                    <span>{formatPrice(calculateTotal())}</span>
                  </div>
                  <div className="flex justify-between text-white/80">
                    <span>Service Fee:</span>
                    <span>{formatPrice(0)}</span>
                  </div>
                  <div className="flex justify-between text-white/80">
                    <span>Tax:</span>
                    <span>{formatPrice(0)}</span>
                  </div>
                  <div className="border-t border-white/20 pt-3">
                    <div className="flex justify-between text-xl font-bold text-white">
                      <span>Total:</span>
                      <span className="text-green-300">{formatPrice(calculateTotal())}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/Services/Oil_change" className="flex-1">
                    <button className="w-full bg-white/20 hover:bg-white/30 text-white py-3 px-6 rounded-lg transition duration-200">
                      Continue Shopping
                    </button>
                  </Link>
                  <button 
                    onClick={handleCheckout}
                    className="flex-1 bg-green-600 hover:bg-green-500 text-white py-3 px-6 rounded-lg transition duration-200 shadow-lg"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}