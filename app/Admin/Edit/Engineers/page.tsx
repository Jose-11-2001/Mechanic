"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Define the interface for engineering services
interface EngineerService {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
}

export default function Engineers() {
  const [items, setItems] = useState<EngineerService[]>([]);
  const [editingItem, setEditingItem] = useState<EngineerService | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const router = useRouter();
  const category = 'engineer';

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated');
    if (!isAuthenticated) {
      router.push('/Admin/login');
      return;
    }

    // Load items for this category
    const storedItems = localStorage.getItem(category);
    if (storedItems) {
      setItems(JSON.parse(storedItems));
    } else {
      // Set default engineering services if none exist
      const defaultServices: EngineerService[] = [
        { id: 1, name: 'Engine Repair', description: 'Complete engine diagnostics, repair and overhaul services', price: 150000, quantity: 0 },
        { id: 2, name: 'Tyre Fitting', description: 'Professional tyre fitting, balancing and wheel alignment', price: 25000, quantity: 0 },
        { id: 3, name: 'Body Repairing', description: 'Car body repair, dent removal and professional painting', price: 120000, quantity: 0 },
      ];
      setItems(defaultServices);
      localStorage.setItem(category, JSON.stringify(defaultServices));
    }
  }, [category, router]);

  const handleSave = () => {
    localStorage.setItem(category, JSON.stringify(items));
    setHasChanges(false);
    alert('Changes saved successfully!');
  };

  const handleEdit = (item: EngineerService) => {
    setEditingItem({ ...item });
  };

  const handleUpdate = () => {
    if (editingItem) {
      const updatedItems = items.map(item => 
        item.id === editingItem.id ? editingItem : item
      );
      setItems(updatedItems);
      setEditingItem(null);
      setHasChanges(true);
    }
  };

  const handleAddNew = () => {
    const newItem: EngineerService = {
      id: Date.now(),
      name: 'New Service',
      description: 'Service description',
      price: 0,
      quantity: 0,
    };
    setItems([...items, newItem]);
    setEditingItem(newItem);
    setHasChanges(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this service?')) {
      const updatedItems = items.filter(item => item.id !== id);
      setItems(updatedItems);
      setHasChanges(true);
    }
  };

  const renderField = (label: string, value: string | number, field: keyof EngineerService, type = 'text') => (
    <div>
      <label className="block text-sm font-medium text-white/90 mb-1">{label}</label>
      <input
        type={type}
        value={value || ''}
        onChange={(e) => {
          if (editingItem) {
            setEditingItem({
              ...editingItem,
              [field]: type === 'number' ? Number(e.target.value) : e.target.value
            });
            setHasChanges(true);
          }
        }}
        className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded text-white placeholder-white/60"
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    </div>
  );

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
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="max-w-6xl mx-auto relative z-10 w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <Link href="/Admin/Dashboard" className="text-blue-300 hover:text-blue-200 mb-2 inline-block transition duration-200">
              ← Back to Dashboard
            </Link>
            <div className="flex items-center space-x-3">
              <div className="text-3xl">🔧</div>
              <div>
                <h1 className="text-3xl font-bold text-white">Edit Engineering Services</h1>
                <p className="text-white/80">Manage service offerings and pricing</p>
                {hasChanges && (
                  <p className="text-yellow-300 text-sm mt-1">⚠️ You have unsaved changes</p>
                )}
              </div>
            </div>
          </div>
          <div className="space-x-2">
            <button
              onClick={handleAddNew}
              className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg transition duration-200 transform hover:scale-105 shadow-lg"
            >
              Add New Service
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className={`px-4 py-2 rounded-lg transition duration-200 transform hover:scale-105 shadow-lg ${
                hasChanges 
                  ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              Save All Changes
            </button>
          </div>
        </div>

        {/* Edit Form */}
        {editingItem && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-blue-400/50">
            <h3 className="text-xl font-bold text-white mb-4">
              {editingItem.id > 1000 ? 'Add New Service' : 'Edit Service'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {renderField('Service Name', editingItem.name, 'name')}
              {renderField('Description', editingItem.description, 'description')}
              {renderField('Price (MWK)', editingItem.price, 'price', 'number')}
              {renderField('Quantity', editingItem.quantity, 'quantity', 'number')}
            </div>

            <div className="flex space-x-2 mt-4">
              <button
                onClick={handleUpdate}
                className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg transition duration-200 transform hover:scale-105"
              >
                {editingItem.id > 1000 ? 'Add Service' : 'Update Service'}
              </button>
              <button
                onClick={() => setEditingItem(null)}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Services List */}
        <div className="grid grid-cols-1 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-blue-400/30 transition duration-300">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">🔧</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white">
                      {item.name}
                    </h3>
                    <p className="text-white/80">
                      {item.description}
                    </p>
                    <p className="text-green-300 font-bold">
                      Price: K{item.price.toLocaleString('en-MW')} • Available: {item.quantity === 0 ? 'Service Booking' : `${item.quantity} in stock`}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition duration-200 transform hover:scale-105"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition duration-200 transform hover:scale-105"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {items.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔧</div>
            <h3 className="text-xl font-bold text-white mb-2">No Services Found</h3>
            <p className="text-white/80 mb-4">Add your first engineering service to get started</p>
            <button
              onClick={handleAddNew}
              className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-lg transition duration-200 transform hover:scale-105 shadow-lg"
            >
              Add First Service
            </button>
          </div>
        )}

        {/* Help Text */}
        <div className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h3 className="text-lg font-bold text-white mb-2">💡 Engineering Services Guide</h3>
          <ul className="text-white/80 text-sm space-y-1">
            <li>• Set <strong>Quantity = 0</strong> for service-based offerings (no physical stock)</li>
            <li>• Set <strong>Quantity &gt; 0</strong> for products with physical inventory</li>
            <li>• Services with quantity 0 will show as "Service Booking"</li>
            <li>• Services with quantity &gt; 0 will show stock levels</li>
          </ul>
        </div>
      </div>
    </div>
  );
}