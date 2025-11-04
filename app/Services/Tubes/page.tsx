"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Tube {
  id: string;
  type: string;
  size: string;
  vehicle: string;
  warranty: string;
  price: number;
  quantity: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  profile?: {
    address: string;
  };
}

export default function Tubes() {
  const [tubes, setTubes] = useState<Tube[]>([]);
  const [selectedTube, setSelectedTube] = useState<Tube | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // Format price as Malawi Kwacha
  const formatPrice = (price: number) => {
    return `MK ${price.toLocaleString('en-MW')}`;
  };

  useEffect(() => {
    loadTubes();
    checkCurrentUser();
  }, []);

  const checkCurrentUser = () => {
    try {
      const userData = localStorage.getItem('currentUser');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.log('No user logged in - guest mode enabled');
    }
  };

  const getDefaultTubes = (): Tube[] => {
    return [
      { id: '1', type: 'Car Inner Tube', size: '13-15 inch', vehicle: 'Small Cars', warranty: '6 Months', price: 8500, quantity: 50 },
      { id: '2', type: 'SUV Inner Tube', size: '16-18 inch', vehicle: 'SUVs & 4x4', warranty: '1 Year', price: 12500, quantity: 35 },
      { id: '3', type: 'Truck Inner Tube', size: '19-22 inch', vehicle: 'Light Trucks', warranty: '1 Year', price: 18500, quantity: 20 },
      { id: '4', type: 'Motorcycle Tube', size: '17-19 inch', vehicle: 'Motorcycles', warranty: '6 Months', price: 6500, quantity: 60 },
      { id: '5', type: 'Bicycle Tube', size: '26-29 inch', vehicle: 'Bicycles', warranty: '3 Months', price: 3500, quantity: 100 },
      { id: '6', type: 'Heavy Duty Tube', size: '23-26 inch', vehicle: 'Heavy Trucks', warranty: '2 Years', price: 28500, quantity: 15 },
    ];
  };

  const loadTubes = () => {
    try {
      setLoading(true);
      const storedTubes = localStorage.getItem('tubes');
      if (storedTubes) {
        setTubes(JSON.parse(storedTubes));
      } else {
        setTubes(getDefaultTubes());
        localStorage.setItem('tubes', JSON.stringify(getDefaultTubes()));
      }
    } catch (error) {
      console.error('Error loading tubes:', error);
      setTubes(getDefaultTubes());
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = (tube: Tube) => {
    if (tube.quantity < 1) {
      alert('Sorry, this tube is out of stock');
      return;
    }

    setSelectedTube(tube);
    setShowPaymentModal(true);
    setQuantity(1);
  };

  const handlePayment = async (paymentMethod: string) => {
    if (!selectedTube) return;

    const totalAmount = selectedTube.price * quantity;

    try {
      const customerId = user ? user.id : `guest_${Date.now()}`;
      const orderId = `order_${Date.now()}`;
      
      // Update tube stock locally
      const updatedTubes = tubes.map(tube => 
        tube.id === selectedTube.id 
          ? { ...tube, quantity: tube.quantity - quantity }
          : tube
      );
      
      setTubes(updatedTubes);
      localStorage.setItem('tubes', JSON.stringify(updatedTubes));

      // Process payment
      processPayment(paymentMethod, totalAmount, selectedTube, orderId);

    } catch (error) {
      console.error('Error creating order:', error);
      alert('Error processing order. Please try again.');
    }
  };

  const processPayment = (paymentMethod: string, totalAmount: number, tube: Tube, orderId: string) => {
    alert(`Redirecting to ${paymentMethod} payment...\n\nProduct: ${tube.type}\nSize: ${tube.size}\nVehicle: ${tube.vehicle}\nQuantity: ${quantity}\nTotal: ${formatPrice(totalAmount)}\nOrder ID: ${orderId}`);
    
    switch (paymentMethod) {
      case 'mpamba':
        window.open(`tel:*444*1*1*${totalAmount}%23`, '_blank');
        break;
      case 'airtel':
        window.open(`tel:*211*1*1*${totalAmount}%23`, '_blank');
        break;
      case 'bank':
        alert(`Bank Transfer Details:\n\nBank: Standard Bank\nAccount: 910000000123\nBranch: 051\nAmount: ${formatPrice(totalAmount)}\nReference: TUBE${tube.id}-${orderId}`);
        break;
    }
    
    setShowPaymentModal(false);
    setSelectedTube(null);
  };

  const handleBackFromPayment = () => {
    setShowPaymentModal(false);
    setSelectedTube(null);
  };

  const totalAmount = selectedTube ? selectedTube.price * quantity : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading tubes...</div>
      </div>
    );
  }

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
            <Link href="/Services" className="flex items-center text-white hover:text-gray-300 transition duration-200">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Services
            </Link>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white">Vehicle Tubes</h1>
              <p className="text-white/80">Quality inner tubes for all vehicle types</p>
            </div>

            <div className="w-10"></div> {/* Spacer for balance */}
          </div>
        </header>

        {/* Guest Notice */}
        <div className="container mx-auto px-6 py-4">
          <div className="bg-green-900/30 border border-green-800 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-green-400 text-center">
              ✅ Guest checkout available - No login required!
            </p>
          </div>
        </div>

        {/* Tubes Grid */}
        <main className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tubes.map((tube) => (
              <div 
                key={tube.id} 
                className={`bg-white/10 backdrop-blur-md rounded-2xl p-6 border transition duration-300 ${
                  tube.quantity === 0 
                    ? 'border-red-400/50 opacity-70' 
                    : 'border-white/20 hover:border-blue-400/50'
                }`}
              >
                <div className="text-center mb-4">
                  <div className="text-3xl mb-2">🌀</div>
                  <h3 className="text-xl font-bold text-white">{tube.type}</h3>
                  <p className="text-white/80">Size: {tube.size}</p>
                  <p className="text-blue-300">Vehicle: {tube.vehicle}</p>
                  <p className="text-yellow-300">Warranty: {tube.warranty}</p>
                  <p className={`mt-2 ${
                    tube.quantity === 0 
                      ? 'text-red-300' 
                      : tube.quantity < 10 
                        ? 'text-orange-300' 
                        : 'text-green-300'
                  }`}>
                    {tube.quantity === 0 ? 'Out of Stock' : `In Stock: ${tube.quantity}`}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-green-300 font-bold text-lg">{formatPrice(tube.price)}</span>
                  <button 
                    onClick={() => handleBuyNow(tube)}
                    disabled={tube.quantity === 0}
                    className={`px-4 py-2 rounded-lg transition duration-200 ${
                      tube.quantity === 0
                        ? 'bg-gray-600 cursor-not-allowed text-gray-400'
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg'
                    }`}
                  >
                    {tube.quantity === 0 ? 'Out of Stock' : 'Buy Now'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Payment Modal */}
        {showPaymentModal && selectedTube && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 w-full max-w-md border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Complete Purchase</h2>
                <button 
                  onClick={() => setShowPaymentModal(false)}
                  className="text-gray-400 hover:text-white text-xl"
                >
                  ✕
                </button>
              </div>

              {/* Guest Notice */}
              {!user && (
                <div className="mb-3 p-2 bg-blue-900/30 rounded-lg border border-blue-800">
                  <p className="text-blue-300 text-sm text-center">
                    🛍️ Guest Checkout
                  </p>
                </div>
              )}

              {/* Product Info */}
              <div className="bg-white/10 rounded-lg p-4 mb-4 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-1">{selectedTube.type}</h3>
                <p className="text-white/80 text-sm">Size: {selectedTube.size}</p>
                <p className="text-blue-300 text-sm">Vehicle: {selectedTube.vehicle}</p>
                <p className="text-green-300 font-bold text-sm">Unit Price: {formatPrice(selectedTube.price)}</p>
                
                {/* Quantity Selector */}
                <div className="flex items-center justify-between mt-3">
                  <label className="text-white/80 text-sm">Quantity:</label>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="bg-white/20 hover:bg-white/30 text-white w-6 h-6 rounded text-sm transition duration-200"
                    >
                      -
                    </button>
                    <span className="text-white font-bold text-sm">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(Math.min(selectedTube.quantity, quantity + 1))}
                      className="bg-white/20 hover:bg-white/30 text-white w-6 h-6 rounded text-sm transition duration-200"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-3 pt-2 border-t border-white/20">
                  <span className="text-white/80 text-sm">Total Amount:</span>
                  <span className="text-green-300 font-bold">{formatPrice(totalAmount)}</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-white mb-3">Payment Method</h3>
                
                {/* TNM Mpamba */}
                <button
                  onClick={() => handlePayment('mpamba')}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-3 px-4 rounded-lg transition duration-200 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3">
                      <span className="text-purple-600 font-bold text-xs">MP</span>
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-sm">TNM Mpamba</div>
                      <div className="text-xs text-purple-200">*444# • Fast & Secure</div>
                    </div>
                  </div>
                  <span>→</span>
                </button>

                {/* Airtel Money */}
                <button
                  onClick={() => handlePayment('airtel')}
                  className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white py-3 px-4 rounded-lg transition duration-200 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3">
                      <span className="text-red-600 font-bold text-xs">AM</span>
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-sm">Airtel Money</div>
                      <div className="text-xs text-red-200">*211# • Quick & Easy</div>
                    </div>
                  </div>
                  <span>→</span>
                </button>

                {/* Bank Transfer */}
                <button
                  onClick={() => handlePayment('bank')}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white py-3 px-4 rounded-lg transition duration-200 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-bold text-xs">BK</span>
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-sm">Bank Transfer</div>
                      <div className="text-xs text-blue-200">Direct Bank Payment</div>
                    </div>
                  </div>
                  <span>→</span>
                </button>

                {/* Back Button */}
                <div className="mt-4">
                  <button
                    onClick={handleBackFromPayment}
                    className="w-full bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Tubes
                  </button>
                </div>
              </div>

              {/* Notices */}
              <div className="mt-4 space-y-2">
                <div className="p-2 bg-green-900/30 rounded border border-green-800">
                  <p className="text-green-300 text-xs text-center">
                    💰 All prices in Malawi Kwacha (MWK)
                  </p>
                </div>
                <div className="p-2 bg-yellow-900/30 rounded border border-yellow-800">
                  <p className="text-yellow-300 text-xs text-center">
                    🔒 Secure Payment Processing
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}