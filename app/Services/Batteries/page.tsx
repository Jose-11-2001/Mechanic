"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Batteries() {
  const [batteries, setBatteries] = useState([]);
  const [selectedBattery, setSelectedBattery] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Format price as Malawi Kwacha
  const formatPrice = (price: number) => {
    return `MK ${price.toLocaleString('en-MW')}`;
  };

  useEffect(() => {
    // Load batteries from localStorage
    const storedBatteries = localStorage.getItem('batteries');
    if (storedBatteries) {
      setBatteries(JSON.parse(storedBatteries));
    } else {
      // Fallback to default data in Malawi Kwacha
      setBatteries([
        { id: 1, type: 'Lead Acid Battery', capacity: '45Ah', warranty: '1 Year', price: 150000, quantity: 20 },
        { id: 2, type: 'Maintenance Free', capacity: '60Ah', warranty: '2 Years', price: 200000, quantity: 15 },
        { id: 3, type: 'Calcium Battery', capacity: '75Ah', warranty: '3 Years', price: 280000, quantity: 10 },
        { id: 4, type: 'AGM Battery', capacity: '100Ah', warranty: '4 Years', price: 420000, quantity: 8 },
        { id: 5, type: 'Gel Battery', capacity: '200Ah', warranty: '5 Years', price: 580000, quantity: 5 },
        { id: 6, type: 'Lithium Ion', capacity: '100Ah', warranty: '8 Years', price: 820000, quantity: 3 },
      ]);
    }
  }, []);

  const handleBuyNow = (battery: any) => {
    setSelectedBattery(battery);
    setShowPaymentModal(true);
    setQuantity(1);
  };

  const handlePayment = (paymentMethod: string) => {
    if (!selectedBattery) return;

    const totalAmount = selectedBattery.price * quantity;
    
    // Simulate payment processing
    alert(`Redirecting to ${paymentMethod} payment...\n\nProduct: ${selectedBattery.type}\nQuantity: ${quantity}\nTotal: ${formatPrice(totalAmount)}`);
    
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
        alert(`Bank Transfer Details:\n\nBank: Standard Bank\nAccount: 910000000123\nBranch: 051\nAmount: ${formatPrice(totalAmount)}\nReference: BATT${selectedBattery.id}`);
        break;
    }
    
    setShowPaymentModal(false);
    setSelectedBattery(null);
  };

  const totalAmount = selectedBattery ? selectedBattery.price * quantity : 0;

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
        <h1 className="text-4xl font-bold text-white mb-4">Car Batteries</h1>
        <p className="text-xl text-gray-300">Reliable batteries for all vehicle types</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {batteries.map((battery: any) => (
          <div key={battery.id} className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-blue-500 transition duration-300">
            <div className="text-center mb-4">
              <div className="text-3xl mb-2">🔋</div>
              <h3 className="text-xl font-bold text-white">{battery.type}</h3>
              <p className="text-gray-300">Capacity: {battery.capacity}</p>
              <p className="text-yellow-400">Warranty: {battery.warranty}</p>
              <p className="text-green-400 mt-2">In Stock: {battery.quantity}</p>
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-green-400 font-bold text-lg">{formatPrice(battery.price)}</span>
              <button 
                onClick={() => handleBuyNow(battery)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedBattery && (
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
              <h3 className="text-lg font-bold text-white mb-2">{selectedBattery.type}</h3>
              <p className="text-gray-300">Capacity: {selectedBattery.capacity}</p>
              <p className="text-yellow-400">Warranty: {selectedBattery.warranty}</p>
              <p className="text-blue-400">Unit Price: {formatPrice(selectedBattery.price)}</p>
              
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
                    onClick={() => setQuantity(Math.min(selectedBattery.quantity, quantity + 1))}
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
          </div>
        </div>
      )}
    </div>
  );
}