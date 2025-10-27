"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Tyres() {
  const [tyres, setTyres] = useState([]);
  const [selectedTyre, setSelectedTyre] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Format price as Malawi Kwacha
  const formatPrice = (price: number) => {
    return `MK ${price.toLocaleString('en-MW')}`;
  };

  useEffect(() => {
    // Load tyres from localStorage
    const storedTyres = localStorage.getItem('tyres');
    if (storedTyres) {
      setTyres(JSON.parse(storedTyres));
    } else {
      // Fallback to default data in Malawi Kwacha
      setTyres([
        { id: 1, size: '165/70R14', brand: 'Michelin', type: 'All Season', price: 85000, quantity: 50 },
        { id: 2, size: '185/65R15', brand: 'Bridgestone', type: 'Touring', price: 95000, quantity: 30 },
        { id: 3, size: '205/55R16', brand: 'Goodyear', type: 'Performance', price: 120000, quantity: 25 },
        { id: 4, size: '225/45R17', brand: 'Pirelli', type: 'Sport', price: 150000, quantity: 20 },
        { id: 5, size: '235/40R18', brand: 'Continental', type: 'Premium', price: 180000, quantity: 15 },
        { id: 6, size: '265/35R20', brand: 'Yokohama', type: 'SUV', price: 220000, quantity: 10 },
      ]);
    }
  }, []);

  const handleBuyNow = (tyre: any) => {
    setSelectedTyre(tyre);
    setShowPaymentModal(true);
    setQuantity(1);
  };

  const handlePayment = (paymentMethod: string) => {
    if (!selectedTyre) return;

    const totalAmount = selectedTyre.price * quantity;
    
    // Simulate payment processing
    alert(`Redirecting to ${paymentMethod} payment...\n\nProduct: ${selectedTyre.size} ${selectedTyre.brand}\nQuantity: ${quantity}\nTotal: ${formatPrice(totalAmount)}`);
    
    // Here you would integrate with actual payment gateways
    switch (paymentMethod) {
      case 'mpamba':
        // Redirect to TNM Mpamba (amount in Kwacha)
        window.open(`tel:*444*1*1*${totalAmount}%23`, '_blank');
        break;
      case 'airtel':
        // Redirect to Airtel Money (amount in Kwacha)
        window.open(`tel:*211*1*1*${totalAmount}%23`, '_blank');
        break;
      case 'bank':
        // Show bank details
        alert(`Bank Transfer Details:\n\nBank: Standard Bank\nAccount: 910000000123\nBranch: 051\nAmount: ${formatPrice(totalAmount)}\nReference: TYRE${selectedTyre.id}`);
        break;
    }
    
    setShowPaymentModal(false);
    setSelectedTyre(null);
  };

  const totalAmount = selectedTyre ? selectedTyre.price * quantity : 0;

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
          <div key={tyre.id} className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-blue-500 transition duration-300">
            <div className="text-center mb-4">
              <div className="text-3xl mb-2">🛞</div>
              <h3 className="text-xl font-bold text-white">{tyre.size}</h3>
              <p className="text-gray-300">{tyre.brand} - {tyre.type}</p>
              <p className="text-yellow-400 mt-2">In Stock: {tyre.quantity}</p>
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-green-400 font-bold text-lg">{formatPrice(tyre.price)}</span>
              <button 
                onClick={() => handleBuyNow(tyre)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                Buy Now
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
                className="text-gray-400 hover:text-white"
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
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 px-6 rounded-lg transition duration-200 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3">
                    <span className="text-purple-600 font-bold">T</span>
                  </div>
                  <span>TNM Mpamba</span>
                </div>
                <span>→</span>
              </button>

              {/* Airtel Money */}
              <button
                onClick={() => handlePayment('airtel')}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-4 px-6 rounded-lg transition duration-200 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3">
                    <span className="text-red-600 font-bold">A</span>
                  </div>
                  <span>Airtel Money</span>
                </div>
                <span>→</span>
              </button>

              {/* Bank Transfer */}
              <button
                onClick={() => handlePayment('bank')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-lg transition duration-200 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-bold">B</span>
                  </div>
                  <span>Bank Transfer</span>
                </div>
                <span>→</span>
              </button>
            </div>

            {/* Currency Notice */}
            <div className="mt-4 p-3 bg-green-900 bg-opacity-30 rounded-lg">
              <p className="text-green-400 text-sm text-center">
                💰 All prices in Malawi Kwacha (MWK)
              </p>
            </div>

            {/* Security Notice */}
            <div className="mt-4 p-3 bg-yellow-900 bg-opacity-30 rounded-lg">
              <p className="text-yellow-400 text-sm text-center">
                🔒 Secure Payment • Your transaction is protected
              </p>
            </div>

            {/* Installation Info */}
            <div className="mt-4 p-3 bg-blue-900 bg-opacity-30 rounded-lg">
              <p className="text-blue-400 text-sm text-center">
                🔧 Free installation included • Professional fitting service
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}