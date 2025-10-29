"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Tyres() {
  const [tyres, setTyres] = useState([]);
  const [selectedTyre, setSelectedTyre] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Format price as Malawi Kwacha
  const formatPrice = (price: number) => {
    return `MK ${price.toLocaleString('en-MW')}`;
  };

  useEffect(() => {
    loadTyres();
    checkCurrentUser();
  }, []);

  const checkCurrentUser = async () => {
    try {
      // Check if user is logged in (you can replace this with your actual auth check)
      const userData = localStorage.getItem('currentUser');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.log('No user logged in');
    }
  };

  const loadTyres = async () => {
    try {
      setLoading(true);
      // Load tyres from localStorage
      const storedTyres = localStorage.getItem('tyres');
      if (storedTyres) {
        setTyres(JSON.parse(storedTyres));
      } else {
        // Fallback to default data in Malawi Kwacha
        setTyres(getDefaultTyres());
      }
    } catch (error) {
      console.error('Error loading tyres:', error);
      // Fallback to default data
      setTyres(getDefaultTyres());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultTyres = () => {
    return [
      { id: '1', size: '165/70R14', brand: 'Michelin', type: 'All Season', price: 85000, quantity: 50 },
      { id: '2', size: '185/65R15', brand: 'Bridgestone', type: 'Touring', price: 95000, quantity: 30 },
      { id: '3', size: '205/55R16', brand: 'Goodyear', type: 'Performance', price: 120000, quantity: 25 },
      { id: '4', size: '225/45R17', brand: 'Pirelli', type: 'Sport', price: 150000, quantity: 20 },
      { id: '5', size: '235/40R18', brand: 'Continental', type: 'Premium', price: 180000, quantity: 15 },
      { id: '6', size: '265/35R20', brand: 'Yokohama', type: 'SUV', price: 220000, quantity: 10 },
    ];
  };

  const handleBuyNow = (tyre: any) => {
    if (tyre.quantity < 1) {
      alert('Sorry, this tyre is out of stock');
      return;
    }

    setSelectedTyre(tyre);
    setShowPaymentModal(true);
    setQuantity(1);
  };

  const handlePayment = async (paymentMethod: string) => {
    if (!selectedTyre) return;

    const totalAmount = selectedTyre.price * quantity;

    try {
      // Simulate order creation (replace with your actual order creation logic)
      const orderId = 'ORD' + Date.now();
      
      // Update tyre stock locally
      const updatedTyres = tyres.map(tyre => 
        tyre.id === selectedTyre.id 
          ? { ...tyre, quantity: tyre.quantity - quantity }
          : tyre
      );
      
      setTyres(updatedTyres);

      // Process payment
      processPayment(paymentMethod, totalAmount, selectedTyre, orderId);

    } catch (error) {
      console.error('Error creating order:', error);
      alert('Error processing order. Please try again.');
    }
  };

  const processPayment = (paymentMethod: string, totalAmount: number, tyre: any, orderId: string) => {
    // Simulate payment processing
    alert(`Redirecting to ${paymentMethod} payment...\n\nProduct: ${tyre.size} ${tyre.brand}\nQuantity: ${quantity}\nTotal: ${formatPrice(totalAmount)}\nOrder ID: ${orderId}`);
    
    // Payment gateway integration
    switch (paymentMethod) {
      case 'mpamba':
        window.open(`tel:*444*1*1*${totalAmount}%23`, '_blank');
        break;
      case 'airtel':
        window.open(`tel:*211*1*1*${totalAmount}%23`, '_blank');
        break;
      case 'bank':
        alert(`Bank Transfer Details:\n\nBank: Standard Bank\nAccount: 910000000123\nBranch: 051\nAmount: ${formatPrice(totalAmount)}\nReference: TYRE${tyre.id}-${orderId}`);
        break;
    }
    
    setShowPaymentModal(false);
    setSelectedTyre(null);
  };

  const handleBackFromPayment = () => {
    setShowPaymentModal(false);
    setSelectedTyre(null);
  };

  const totalAmount = selectedTyre ? selectedTyre.price * quantity : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading tyres...</div>
      </div>
    );
  }

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

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Tyres Collection</h1>
        <p className="text-xl text-gray-300">Premium quality tyres in all sizes</p>
      </div>

      {/* Tyres List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {tyres.map((tyre: any) => (
          <div 
            key={tyre.id} 
            className={`bg-gray-800 rounded-2xl p-6 border transition duration-300 ${
              tyre.quantity === 0 
                ? 'border-red-500 opacity-70' 
                : 'border-gray-700 hover:border-blue-500'
            }`}
          >
            <div className="text-center mb-4">
              <div className="text-3xl mb-2">🛞</div>
              <h3 className="text-xl font-bold text-white">{tyre.size}</h3>
              <p className="text-gray-300">{tyre.brand} - {tyre.type}</p>
              <p className={`mt-2 ${
                tyre.quantity === 0 
                  ? 'text-red-400' 
                  : tyre.quantity < 5 
                    ? 'text-orange-400' 
                    : 'text-green-400'
              }`}>
                {tyre.quantity === 0 ? 'Out of Stock' : `In Stock: ${tyre.quantity}`}
              </p>
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-green-400 font-bold text-lg">{formatPrice(tyre.price)}</span>
              <button 
                onClick={() => handleBuyNow(tyre)}
                disabled={tyre.quantity === 0}
                className={`px-4 py-2 rounded-lg transition duration-200 ${
                  tyre.quantity === 0
                    ? 'bg-gray-600 cursor-not-allowed text-gray-400'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {tyre.quantity === 0 ? 'Out of Stock' : 'Buy Now'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedTyre && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-md border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Complete Your Purchase</h2>
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Product Info */}
            <div className="bg-gray-700 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-bold text-white mb-2">{selectedTyre.size} {selectedTyre.brand}</h3>
              <p className="text-gray-300">Type: {selectedTyre.type}</p>
              <p className="text-blue-400">Unit Price: {formatPrice(selectedTyre.price)}</p>
              
              {/* Quantity Selector */}
              <div className="flex items-center justify-between mt-4">
                <label className="text-gray-300">Quantity:</label>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="bg-gray-600 hover:bg-gray-500 text-white w-8 h-8 rounded"
                  >
                    -
                  </button>
                  <span className="text-white font-bold">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(selectedTyre.quantity, quantity + 1))}
                    className="bg-gray-600 hover:bg-gray-500 text-white w-8 h-8 rounded"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-600">
                <span className="text-gray-300">Total Amount:</span>
                <span className="text-green-400 font-bold text-xl">{formatPrice(totalAmount)}</span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white mb-4">Choose Payment Method</h3>
              
              {/* TNM Mpamba */}
              <button
                onClick={() => handlePayment('mpamba')}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 px-6 rounded-lg transition duration-200 flex items-center justify-between group"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3 shadow-lg">
                    {/* Custom TNM Mpamba Icon */}
                    <Image 
                      src="/Mpamba.jpg" 
                      alt="TNM Mpamba" 
                      width={24} 
                      height={24}
                      className="object-contain"
                    />
                  </div>
                  <div className="text-left">
                    <div className="font-bold">TNM Mpamba</div>
                    <div className="text-sm text-purple-200">*444# • Fast & Secure</div>
                  </div>
                </div>
                <span className="text-white group-hover:translate-x-1 transition-transform">→</span>
              </button>

              {/* Airtel Money */}
              <button
                onClick={() => handlePayment('airtel')}
                className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white py-4 px-6 rounded-lg transition duration-200 flex items-center justify-between group"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3 shadow-lg">
                    {/* Custom Airtel Money Icon */}
                    <Image 
                      src="/Airtel.jpg" 
                      alt="Airtel Money" 
                      width={24} 
                      height={24}
                      className="object-contain"
                    />
                  </div>
                  <div className="text-left">
                    <div className="font-bold">Airtel Money</div>
                    <div className="text-sm text-red-200">*211# • Quick & Easy</div>
                  </div>
                </div>
                <span className="text-white group-hover:translate-x-1 transition-transform">→</span>
              </button>

              {/* Bank Transfer */}
              <button
                onClick={() => handlePayment('bank')}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-4 px-6 rounded-lg transition duration-200 flex items-center justify-between group"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3 shadow-lg">
                    {/* Custom Bank Transfer Icon */}
                    <Image 
                      src="/NB.png" 
                      alt="Bank Transfer" 
                      width={24} 
                      height={24}
                      className="object-contain"
                    />
                  </div>
                  <div className="text-left">
                    <div className="font-bold">Bank Transfer</div>
                    <div className="text-sm text-blue-200">Direct Bank Payment</div>
                  </div>
                </div>
                <span className="text-white group-hover:translate-x-1 transition-transform">→</span>
              </button>
              {/* Back Button */}
            <div className="mt-6">
              <button
                onClick={handleBackFromPayment}
                className="w-full bg-gray-600 hover:bg-gray-500 text-white py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center group"
              >
                <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Tyres
              </button>
            </div>
            </div>

            {/* Payment Instructions */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center text-sm text-gray-300">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                <span>Select your preferred payment method</span>
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                <span>You'll be redirected to complete payment</span>
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                <span>Order confirmation will be sent via SMS</span>
              </div>
            </div>

            {/* Currency Notice */}
            <div className="mt-6 p-3 bg-green-900 bg-opacity-30 rounded-lg border border-green-800">
              <p className="text-green-400 text-sm text-center flex items-center justify-center">
                <span className="mr-2">💰</span>
                All prices in Malawi Kwacha (MWK)
              </p>
            </div>

            {/* Security Notice */}
            <div className="mt-4 p-3 bg-yellow-900 bg-opacity-30 rounded-lg border border-yellow-800">
              <p className="text-yellow-400 text-sm text-center flex items-center justify-center">
                <span className="mr-2">🔒</span>
                Secure Payment • Your transaction is protected
              </p>
            </div>

            {/* Installation Info */}
            <div className="mt-4 p-3 bg-blue-900 bg-opacity-30 rounded-lg border border-blue-800">
              <p className="text-blue-400 text-sm text-center flex items-center justify-center">
                <span className="mr-2">🔧</span>
                Free installation included • Professional fitting service
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}