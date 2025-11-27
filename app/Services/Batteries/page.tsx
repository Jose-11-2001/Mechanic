"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Define the Battery type
interface Battery {
  id: string;
  type: string;
  capacity: string;
  warranty: string;
  price: number;
  quantity: number;
}

export default function Batteries() {
  const [batteries, setBatteries] = useState<Battery[]>([]); // Add type annotation here
  const [selectedBattery, setSelectedBattery] = useState<Battery | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Format price as Malawi Kwacha
  const formatPrice = (price: number) => {
    return `MK ${price.toLocaleString('en-MW')}`;
  };

  useEffect(() => {
    loadBatteries();
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

  const loadBatteries = async () => {
    try {
      setLoading(true);
      // Use default batteries data directly
      setBatteries(getDefaultBatteries());
    } catch (error) {
      console.error('Error loading batteries:', error);
      // Fallback to default data
      setBatteries(getDefaultBatteries());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultBatteries = (): Battery[] => { // Add return type here
    return [
      { id: '1', type: 'Lead Acid Battery', capacity: '45Ah', warranty: '1 Year', price: 150000, quantity: 20 },
      { id: '2', type: 'Maintenance Free', capacity: '60Ah', warranty: '2 Years', price: 200000, quantity: 15 },
      { id: '3', type: 'Calcium Battery', capacity: '75Ah', warranty: '3 Years', price: 280000, quantity: 10 },
      { id: '4', type: 'AGM Battery', capacity: '100Ah', warranty: '4 Years', price: 420000, quantity: 8 },
      { id: '5', type: 'Gel Battery', capacity: '200Ah', warranty: '5 Years', price: 580000, quantity: 5 },
      { id: '6', type: 'Lithium Ion', capacity: '100Ah', warranty: '8 Years', price: 820000, quantity: 3 },
    ];
  };

  const handleBuyNow = (battery: Battery) => { // Use Battery type here
    if (battery.quantity < 1) {
      alert('Sorry, this battery is out of stock');
      return;
    }

    setSelectedBattery(battery);
    setShowPaymentModal(true);
    setQuantity(1);
  };

  const handlePayment = async (paymentMethod: string) => {
    if (!selectedBattery) return;

    const totalAmount = selectedBattery.price * quantity;

    try {
      // Simulate order creation (replace with your actual order creation logic)
      const orderId = 'ORD' + Date.now();
      
      // Update battery stock locally
      const updatedBatteries = batteries.map(battery => 
        battery.id === selectedBattery.id 
          ? { ...battery, quantity: battery.quantity - quantity }
          : battery
      );
      
      setBatteries(updatedBatteries);

      // Process payment
      processPayment(paymentMethod, totalAmount, selectedBattery, orderId);

    } catch (error) {
      console.error('Error creating order:', error);
      alert('Error processing order. Please try again.');
    }
  };

  const processPayment = (paymentMethod: string, totalAmount: number, battery: Battery, orderId: string) => {
    // Simulate payment processing
    alert(`Redirecting to ${paymentMethod} payment...\n\nProduct: ${battery.type}\nQuantity: ${quantity}\nTotal: ${formatPrice(totalAmount)}\nOrder ID: ${orderId}`);
    
    // Payment gateway integration
    switch (paymentMethod) {
      case 'mpamba':
        window.open(`tel:*444*1*1*${totalAmount}%23`, '_blank');
        break;
      case 'airtel':
        window.open(`tel:*211*1*1*${totalAmount}%23`, '_blank');
        break;
      case 'bank':
        alert(`Bank Transfer Details:\n\nBank: Standard Bank\nAccount: 910000000123\nBranch: 051\nAmount: ${formatPrice(totalAmount)}\nReference: BATT${battery.id}-${orderId}`);
        break;
    }
    
    setShowPaymentModal(false);
    setSelectedBattery(null);
  };

  const handleBackFromPayment = () => {
    setShowPaymentModal(false);
    setSelectedBattery(null);
  };

  const totalAmount = selectedBattery ? selectedBattery.price * quantity : 0;

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center relative"
        style={{
          backgroundImage: "url('/mechanic4.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="text-white text-xl relative z-10">Loading batteries...</div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-8 relative"
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

      <div className="text-center mb-12 relative z-10">
        <h1 className="text-4xl font-bold text-white mb-4">Car Batteries</h1>
        <p className="text-xl text-white/90">Reliable batteries for all vehicle types</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl relative z-10">
        {batteries.map((battery: Battery) => ( // Use Battery type here
          <div 
            key={battery.id} 
            className={`bg-white/10 backdrop-blur-md rounded-2xl p-6 border transition duration-300 transform hover:scale-105 ${
              battery.quantity === 0 
                ? 'border-red-400/50 opacity-70' 
                : 'border-white/20 hover:border-blue-400/50'
            }`}
          >
            <div className="text-center mb-4">
              <div className="text-3xl mb-2">🔋</div>
              <h3 className="text-xl font-bold text-white">{battery.type}</h3>
              <p className="text-white/80">Capacity: {battery.capacity}</p>
              <p className="text-yellow-300">Warranty: {battery.warranty}</p>
              <p className={`mt-2 ${
                battery.quantity === 0 
                  ? 'text-red-300' 
                  : battery.quantity < 5 
                    ? 'text-orange-300' 
                    : 'text-green-300'
              }`}>
                {battery.quantity === 0 ? 'Out of Stock' : `In Stock: ${battery.quantity}`}
              </p>
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-green-300 font-bold text-lg">{formatPrice(battery.price)}</span>
              <button 
                onClick={() => handleBuyNow(battery)}
                disabled={battery.quantity === 0}
                className={`px-4 py-2 rounded-lg transition duration-200 transform hover:scale-105 ${
                  battery.quantity === 0
                    ? 'bg-gray-600 cursor-not-allowed text-gray-400'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg'
                }`}
              >
                {battery.quantity === 0 ? 'Out of Stock' : 'Buy Now'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedBattery && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 w-full max-w-md border border-white/20 relative z-50">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Complete Your Purchase</h2>
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-white text-2xl transition duration-200"
              >
                ✕
              </button>
            </div>

            {/* Product Info */}
            <div className="bg-white/10 rounded-lg p-4 mb-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-2">{selectedBattery.type}</h3>
              <p className="text-white/80">Capacity: {selectedBattery.capacity}</p>
              <p className="text-yellow-300">Warranty: {selectedBattery.warranty}</p>
              <p className="text-blue-300">Unit Price: {formatPrice(selectedBattery.price)}</p>
              
              {/* Quantity Selector */}
              <div className="flex items-center justify-between mt-4">
                <label className="text-white/80">Quantity:</label>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="bg-white/20 hover:bg-white/30 text-white w-8 h-8 rounded transition duration-200"
                  >
                    -
                  </button>
                  <span className="text-white font-bold">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(selectedBattery.quantity, quantity + 1))}
                    className="bg-white/20 hover:bg-white/30 text-white w-8 h-8 rounded transition duration-200"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/20">
                <span className="text-white/80">Total Amount:</span>
                <span className="text-green-300 font-bold text-xl">{formatPrice(totalAmount)}</span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white mb-4">Choose Payment Method</h3>
              
              {/* TNM Mpamba */}
              <button
                onClick={() => handlePayment('mpamba')}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-4 px-6 rounded-lg transition duration-200 flex items-center justify-between group shadow-lg"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3 shadow-lg">
                    <Image 
                      src="/Mpamba.png" 
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
                className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white py-4 px-6 rounded-lg transition duration-200 flex items-center justify-between group shadow-lg"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3 shadow-lg">
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
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white py-4 px-6 rounded-lg transition duration-200 flex items-center justify-between group shadow-lg"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3 shadow-lg">
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
                  className="w-full bg-white/20 hover:bg-white/30 text-white py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center group shadow-lg"
                >
                  <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Batteries
                </button>
              </div>
            </div>

            {/* Payment Instructions */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center text-sm text-white/80">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                <span>Select your preferred payment method</span>
              </div>
              <div className="flex items-center text-sm text-white/80">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                <span>You'll be redirected to complete payment</span>
              </div>
              <div className="flex items-center text-sm text-white/80">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                <span>Order confirmation will be sent via SMS</span>
              </div>
            </div>

            {/* Currency Notice */}
            <div className="mt-6 p-3 bg-green-900 bg-opacity-30 rounded-lg border border-green-800">
              <p className="text-green-300 text-sm text-center flex items-center justify-center">
                <span className="mr-2">💰</span>
                All prices in Malawi Kwacha (MWK)
              </p>
            </div>

            {/* Security Notice */}
            <div className="mt-4 p-3 bg-yellow-900 bg-opacity-30 rounded-lg border border-yellow-800">
              <p className="text-yellow-300 text-sm text-center flex items-center justify-center">
                <span className="mr-2">🔒</span>
                Secure Payment • Your transaction is protected
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}