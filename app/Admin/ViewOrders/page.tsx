// app/Admin/ViewOrders/page.tsx
"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  product: string;
  quantity: number;
  total: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  date: string;
}

export default function ViewOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState('all');
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated');
    if (!isAuthenticated) {
      router.push('/Admin/login');
      return;
    }

    // Load orders from localStorage (in a real app, this would be from an API)
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(storedOrders);
  }, [router]);

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'confirmed': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center p-8 relative"
      style={{
        backgroundImage: "url('/mechanic4.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="max-w-6xl mx-auto relative z-10 w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <Link href="/Admin/Dashboard" className="text-blue-300 hover:text-blue-200 mb-2 inline-block transition duration-200">
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-white">View Orders</h1>
            <p className="text-white/80">Manage customer orders and bookings</p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex space-x-2 mb-6">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg transition duration-200 ${
                filter === status 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)} ({status === 'all' ? orders.length : orders.filter(o => o.status === status).length})
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="grid grid-cols-1 gap-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <h3 className="text-lg font-bold text-white">{order.product}</h3>
                    <span className={`px-2 py-1 rounded text-xs text-white ${getStatusColor(order.status)}`}>
                      {order.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-white/80">
                    Customer: {order.customerName} • Phone: {order.customerPhone}
                  </p>
                  <p className="text-white/80">
                    Quantity: {order.quantity} • Total: K{order.total.toLocaleString('en-MW')}
                  </p>
                  <p className="text-white/60 text-sm">Order Date: {order.date}</p>
                </div>
                <div className="flex space-x-2">
                  {order.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'confirmed')}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-sm"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'cancelled')}
                        className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-sm"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {order.status === 'confirmed' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'completed')}
                      className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-bold text-white mb-2">No Orders Found</h3>
            <p className="text-white/80 mb-4">
              {filter === 'all' 
                ? 'No orders have been placed yet.' 
                : `No ${filter} orders found.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}