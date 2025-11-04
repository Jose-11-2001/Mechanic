"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Tyre {
  id: string;
  size: string;
  brand: string;
  type: string;
  price: number;
  quantity: number;
}

interface User {
  id: string;
  name: string;
  email: string;
}

export default function Tyres() {
  const [tyres, setTyres] = useState<Tyre[]>([]);
  const [selectedTyre, setSelectedTyre] = useState<Tyre | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // Format price as Malawi Kwacha
  const formatPrice = (price: number) => {
    return `MK ${price.toLocaleString('en-MW')}`;
  };

  useEffect(() => {
    loadTyres();
    checkCurrentUser();
  }, []);

  const checkCurrentUser = () => {
    try {
      const userData = localStorage.getItem('currentUser');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.log('No user logged in');
    }
  };

  const getDefaultTyres = (): Tyre[] => {
    return [
      { id: '1', size: '165/70R14', brand: 'Michelin', type: 'All Season', price: 85000, quantity: 50 },
      { id: '2', size: '185/65R15', brand: 'Bridgestone', type: 'Touring', price: 95000, quantity: 30 },
      { id: '3', size: '205/55R16', brand: 'Goodyear', type: 'Performance', price: 120000, quantity: 25 },
      { id: '4', size: '225/45R17', brand: 'Pirelli', type: 'Sport', price: 150000, quantity: 20 },
      { id: '5', size: '235/40R18', brand: 'Continental', type: 'Premium', price: 180000, quantity: 15 },
      { id: '6', size: '265/35R20', brand: 'Yokohama', type: 'SUV', price: 220000, quantity: 10 },
    ];
  };

  const loadTyres = () => {
    try {
      setLoading(true);
      const storedTyres = localStorage.getItem('tyres');
      if (storedTyres) {
        setTyres(JSON.parse(storedTyres));
      } else {
        setTyres(getDefaultTyres());
      }
    } catch (error) {
      console.error('Error loading tyres:', error);
      setTyres(getDefaultTyres());
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = (tyre: Tyre) => {
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
      const orderId = 'ORD' + Date.now();
      
      // Update tyre stock locally
      const updatedTyres = tyres.map(tyre => 
        tyre.id === selectedTyre.id 
          ? { ...tyre, quantity: tyre.quantity - quantity }
          : tyre
      );
      
      setTyres(updatedTyres);
      processPayment(paymentMethod, totalAmount, selectedTyre, orderId);

    } catch (error) {
      console.error('Error creating order:', error);
      alert('Error processing order. Please try again.');
    }
  };

  const processPayment = (paymentMethod: string, totalAmount: number, tyre: Tyre, orderId: string) => {
    alert(`Redirecting to ${paymentMethod} payment...\n\nProduct: ${tyre.size} ${tyre.brand}\nQuantity: ${quantity}\nTotal: ${formatPrice(totalAmount)}\nOrder ID: ${orderId}`);
    
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
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Loading tyres...</div>
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
              <h1 className="text-3xl font-bold text-white">Tyres Collection</h1>
              <p className="text-white/80">Premium quality tyres in all sizes</p>
            </div>

            <div className="w-10"></div> {/* Spacer for balance */}
          </div>
        </header>

        {/* Tyres Grid */}
        <main className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tyres.map((tyre) => (
              <div 
                key={tyre.id} 
                className={`bg-white/10 backdrop-blur-md rounded-2xl p-6 border transition duration-300 ${
                  tyre.quantity === 0 
                    ? 'border-red-400/50 opacity-70' 
                    : 'border-white/20 hover:border-blue-400/50'
                }`}
              >
                <div className="text-center mb-4">
                  <div className="text-3xl mb-2">🛞</div>
                  <h3 className="text-xl font-bold text-white">{tyre.size}</h3>
                  <p className="text-white/80">{tyre.brand} - {tyre.type}</p>
                  <p className={`mt-2 ${
                    tyre.quantity === 0 
                      ? 'text-red-300' 
                      : tyre.quantity < 5 
                        ? 'text-orange-300' 
                        : 'text-green-300'
                  }`}>
                    {tyre.quantity === 0 ? 'Out of Stock' : `In Stock: ${tyre.quantity}`}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-green-300 font-bold text-lg">{formatPrice(tyre.price)}</span>
                  <button 
                    onClick={() => handleBuyNow(tyre)}
                    disabled={tyre.quantity === 0}
                    className={`px-4 py-2 rounded-lg transition duration-200 ${
                      tyre.quantity === 0
                        ? 'bg-gray-600 cursor-not-allowed text-gray-400'
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg'
                    }`}
                  >
                    {tyre.quantity === 0 ? 'Out of Stock' : 'Buy Now'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Payment Modal */}
        {showPaymentModal && selectedTyre && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 w-full max-w-md border border-white/20">
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
                <h3 className="text-lg font-bold text-white mb-2">{selectedTyre.size} {selectedTyre.brand}</h3>
                <p className="text-white/80">Type: {selectedTyre.type}</p>
                <p className="text-blue-300">Unit Price: {formatPrice(selectedTyre.price)}</p>
                
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
                      onClick={() => setQuantity(Math.min(selectedTyre.quantity, quantity + 1))}
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
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-4 px-6 rounded-lg transition duration-200 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10  rounded-full flex items-center justify-center mr-3">
                        <Image 
                      src="/Mpamba.png" 
                      alt="TNM MPAMBA" 
                      width={24} 
                      height={24}
                      className="object-contain"
                    />
                      <div className="text-purple-600 font-bold text-sm">MP</div>
                    </div>
                    <div className="text-left">
                      <div className="font-bold">TNM Mpamba</div>
                      <div className="text-sm text-purple-200">*444# • Fast & Secure</div>
                    </div>
                  </div>
                  <span>→</span>
                </button>

                {/* Airtel Money */}
                <button
                  onClick={() => handlePayment('airtel')}
                  className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white py-4 px-6 rounded-lg transition duration-200 flex items-center justify-between"
                >
                   
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3">
                        <Image 
                      src="/Airtel.jpg" 
                      alt="Airtel Money" 
                      width={24} 
                      height={24}
                      className="object-contain"
                    />
                      <div className="text-red-600 font-bold text-sm"></div>
                    </div>
                    <div className="text-left">
                      <div className="font-bold">Airtel Money</div>
                      <div className="text-sm text-red-200">*211# • Quick & Easy</div>
                    </div>
                  </div>
                  <span>→</span>
                </button>

                {/* Bank Transfer */}
                <button
                  onClick={() => handlePayment('bank')}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white py-4 px-6 rounded-lg transition duration-200 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3">
                       <Image 
                      src="/NB.png" 
                      alt="BABK TRANSFER" 
                      width={24} 
                      height={24}
                      className="object-contain"
                    />
                      <div className="text-blue-600 font-bold text-sm"></div>
                    </div>
                    <div className="text-left">
                      <div className="font-bold">Bank Transfer</div>
                      <div className="text-sm text-blue-200">Direct Bank Payment</div>
                    </div>
                  </div>
                  <span>→</span>
                </button>

                {/* Back Button */}
                <div className="mt-6">
                  <button
                    onClick={handleBackFromPayment}
                    className="w-full bg-white/20 hover:bg-white/30 text-white py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Tyres
                  </button>
                </div>
              </div>

              {/* Notices */}
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

              <div className="mt-6 p-3 bg-green-900/30 rounded-lg border border-green-800">
                <p className="text-green-300 text-sm text-center">
                  💰 All prices in Malawi Kwacha (MWK)
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}