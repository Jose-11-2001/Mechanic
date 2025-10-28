"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Tubes() {
  const [tubes, setTubes] = useState([]);
  const [selectedTube, setSelectedTube] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Format price as Malawi Kwacha
  const formatPrice = (price: number) => {
    return `MK ${price.toLocaleString('en-MW')}`;
  };

  useEffect(() => {
    loadTubes();
    checkCurrentUser();
  }, []);

  const checkCurrentUser = async () => {
    try {
      // You'll need to implement this based on your auth setup
      const userData = await getCurrentUser(); // Your user auth function
      setUser(userData);
    } catch (error) {
      console.log('No user logged in');
    }
  };

  const loadTubes = async () => {
    try {
      setLoading(true);
      const response = await databases.listDocuments(
        'main', // your database ID
        'tubes', // collection ID
        [Query.equal('isActive', true)] // only show active tubes
      );
      setTubes(response.documents);
    } catch (error) {
      console.error('Error loading tubes:', error);
      // Fallback to default data if Appwrite fails
      setTubes(getDefaultTubes());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultTubes = () => {
    return [
      { $id: '1', type: 'Car Inner Tube', size: '13-15 inch', vehicle: 'Small Cars', warranty: '6 Months', price: 8500, quantity: 50 },
      { $id: '2', type: 'SUV Inner Tube', size: '16-18 inch', vehicle: 'SUVs & 4x4', warranty: '1 Year', price: 12500, quantity: 35 },
      { $id: '3', type: 'Truck Inner Tube', size: '19-22 inch', vehicle: 'Light Trucks', warranty: '1 Year', price: 18500, quantity: 20 },
      { $id: '4', type: 'Motorcycle Tube', size: '17-19 inch', vehicle: 'Motorcycles', warranty: '6 Months', price: 6500, quantity: 60 },
      { $id: '5', type: 'Bicycle Tube', size: '26-29 inch', vehicle: 'Bicycles', warranty: '3 Months', price: 3500, quantity: 100 },
      { $id: '6', type: 'Heavy Duty Tube', size: '23-26 inch', vehicle: 'Heavy Trucks', warranty: '2 Years', price: 28500, quantity: 15 },
    ];
  };

  const handleBuyNow = (tube: any) => {
    if (!user) {
      alert('Please login to purchase tubes');
      return;
    }
    
    if (tube.quantity < 1) {
      alert('Sorry, this tube is out of stock');
      return;
    }

    setSelectedTube(tube);
    setShowPaymentModal(true);
    setQuantity(1);
  };

  const handlePayment = async (paymentMethod: string) => {
    if (!selectedTube || !user) return;

    const totalAmount = selectedTube.price * quantity;

    try {
      // Create order in Appwrite
      const order = await databases.createDocument(
        'main',
        'orders',
        ID.unique(),
        {
          customerId: user.$id,
          items: [{
            productId: selectedTube.$id,
            productType: 'tube',
            name: selectedTube.type,
            size: selectedTube.size,
            vehicle: selectedTube.vehicle,
            quantity: quantity,
            unitPrice: selectedTube.price,
            totalPrice: totalAmount
          }],
          totalAmount: totalAmount,
          status: 'pending',
          paymentMethod: paymentMethod,
          shippingAddress: user.profile?.address || 'To be confirmed',
          orderDate: new Date().toISOString()
        }
      );

      // Update tube stock
      const newQuantity = selectedTube.quantity - quantity;
      await databases.updateDocument(
        'main',
        'tubes',
        selectedTube.$id,
        {
          quantity: newQuantity
        }
      );

      // Refresh tubes list
      loadTubes();

      // Process payment
      processPayment(paymentMethod, totalAmount, selectedTube, order.$id);

    } catch (error) {
      console.error('Error creating order:', error);
      alert('Error processing order. Please try again.');
    }
  };

  const processPayment = (paymentMethod: string, totalAmount: number, tube: any, orderId: string) => {
    // Simulate payment processing
    alert(`Redirecting to ${paymentMethod} payment...\n\nProduct: ${tube.type}\nSize: ${tube.size}\nVehicle: ${tube.vehicle}\nQuantity: ${quantity}\nTotal: ${formatPrice(totalAmount)}\nOrder ID: ${orderId}`);
    
    // Payment gateway integration
    switch (paymentMethod) {
      case 'mpamba':
        window.open(`tel:*444*1*1*${totalAmount}%23`, '_blank');
        break;
      case 'airtel':
        window.open(`tel:*211*1*1*${totalAmount}%23`, '_blank');
        break;
      case 'bank':
        alert(`Bank Transfer Details:\n\nBank: Standard Bank\nAccount: 910000000123\nBranch: 051\nAmount: ${formatPrice(totalAmount)}\nReference: TUBE${tube.$id}-${orderId}`);
        break;
    }
    
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
        <h1 className="text-4xl font-bold text-white mb-4">Vehicle Tubes</h1>
        <p className="text-xl text-gray-300">Quality inner tubes for all vehicle types</p>
        {!user && (
          <div className="mt-4 p-3 bg-yellow-900 bg-opacity-50 rounded-lg max-w-md mx-auto">
            
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {tubes.map((tube: any) => (
          <div 
            key={tube.$id} 
            className={`bg-gray-800 rounded-2xl p-6 border transition duration-300 ${
              tube.quantity === 0 
                ? 'border-red-500 opacity-70' 
                : 'border-gray-700 hover:border-blue-500'
            }`}
          >
            <div className="text-center mb-4">
              <div className="text-3xl mb-2">🛞</div>
              <h3 className="text-xl font-bold text-white">{tube.type}</h3>
              <p className="text-gray-300">Size: {tube.size}</p>
              <p className="text-blue-300">Vehicle: {tube.vehicle}</p>
              <p className="text-yellow-400">Warranty: {tube.warranty}</p>
              <p className={`mt-2 ${
                tube.quantity === 0 
                  ? 'text-red-400' 
                  : tube.quantity < 10 
                    ? 'text-orange-400' 
                    : 'text-green-400'
              }`}>
                {tube.quantity === 0 ? 'Out of Stock' : `In Stock: ${tube.quantity}`}
              </p>
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-green-400 font-bold text-lg">{formatPrice(tube.price)}</span>
              <button 
                onClick={() => handleBuyNow(tube)}
                disabled={!user || tube.quantity === 0}
                className={`px-4 py-2 rounded-lg transition duration-200 ${
                  !user || tube.quantity === 0
                    ? 'bg-gray-600 cursor-not-allowed text-gray-400'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {!user ? 'Login to Buy' : tube.quantity === 0 ? 'Out of Stock' : 'Buy Now'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedTube && (
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
              <h3 className="text-lg font-bold text-white mb-2">{selectedTube.type}</h3>
              <p className="text-gray-300">Size: {selectedTube.size}</p>
              <p className="text-blue-300">Vehicle: {selectedTube.vehicle}</p>
              <p className="text-yellow-400">Warranty: {selectedTube.warranty}</p>
              <p className="text-blue-400">Unit Price: {formatPrice(selectedTube.price)}</p>
              
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
                    onClick={() => setQuantity(Math.min(selectedTube.quantity, quantity + 1))}
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

function getCurrentUser() {
  throw new Error('Function not implemented.');
}
