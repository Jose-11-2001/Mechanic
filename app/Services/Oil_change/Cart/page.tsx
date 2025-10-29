"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Cart() {
  const [cart, setCart] = useState([]);

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

    const updatedCart = cart.map((item: any) =>
      item.id === id ? { ...item, cartQuantity: newQuantity } : item
    );
    
    setCart(updatedCart);
    localStorage.setItem('oilCart', JSON.stringify(updatedCart));
  };

  const removeFromCart = (id: number) => {
    const updatedCart = cart.filter((item: any) => item.id !== id);
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
    return cart.reduce((total: number, item: any) => total + (item.price * item.cartQuantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total: number, item: any) => total + item.cartQuantity, 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    alert(`Proceeding to checkout with ${getTotalItems()} items. Total: K${calculateTotal()}`);
    // Here you would typically redirect to a checkout page
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center p-8">
      {/* Back Arrow */}
      <Link href="/Services/Oil_change" className="absolute top-6 left-6 z-20">
        <button className="text-white hover:text-gray-300 transition duration-200">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </Link>

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Shopping Cart</h1>
        <p className="text-xl text-gray-300">Review your selected oil services</p>
      </div>

      {cart.length === 0 ? (
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-white mb-4">Your cart is empty</h2>
          <p className="text-gray-300 mb-6">Add some oil services to get started</p>
          <Link href="/Services/Oil_change">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition duration-200">
              Browse Services
            </button>
          </Link>
        </div>
      ) : (
        <div className="w-full max-w-4xl">
          {/* Cart Items */}
          <div className="bg-gray-800 rounded-2xl p-6 mb-6 border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Cart Items ({getTotalItems()})</h2>
              <button 
                onClick={clearCart}
                className="text-red-400 hover:text-red-300 text-sm transition duration-200"
              >
                Clear Cart
              </button>
            </div>

            <div className="space-y-4">
              {cart.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg border border-gray-600">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">🛢️</div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{item.type}</h3>
                      <p className="text-gray-300 text-sm">{item.grade}</p>
                      <p className="text-green-400 font-bold">K{item.price} each</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => updateQuantity(item.id, item.cartQuantity - 1)}
                        className="bg-gray-600 hover:bg-gray-500 text-white w-8 h-8 rounded transition duration-200"
                      >
                        -
                      </button>
                      <span className="text-white font-bold min-w-8 text-center">{item.cartQuantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.cartQuantity + 1)}
                        className="bg-gray-600 hover:bg-gray-500 text-white w-8 h-8 rounded transition duration-200"
                      >
                        +
                      </button>
                    </div>

                    {/* Item Total */}
                    <div className="text-right min-w-24">
                      <p className="text-green-400 font-bold">K{item.price * item.cartQuantity}</p>
                    </div>

                    {/* Remove Button */}
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-400 hover:text-red-300 transition duration-200"
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
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal ({getTotalItems()} items):</span>
                <span>K{calculateTotal()}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Service Fee:</span>
                <span>K0</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Tax:</span>
                <span>K0</span>
              </div>
              <div className="border-t border-gray-600 pt-3">
                <div className="flex justify-between text-xl font-bold text-white">
                  <span>Total:</span>
                  <span>K{calculateTotal()}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Link href="/Services/Oil_change" className="flex-1">
                <button className="w-full bg-gray-600 hover:bg-gray-500 text-white py-3 px-6 rounded-lg transition duration-200">
                  Continue Shopping
                </button>
              </Link>
              <button 
                onClick={handleCheckout}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg transition duration-200"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}