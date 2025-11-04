"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Define the interface for battery items
interface BatteryItem {
  id: number;
  type: string;
  capacity: string;
  warranty: string;
  price: number;
  quantity: number;
}

export default function Batteries() {
  const [items, setItems] = useState<BatteryItem[]>([]);
  const [editingItem, setEditingItem] = useState<BatteryItem | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const router = useRouter();
  const category = 'batteries';

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated');
    if (!isAuthenticated) {
      router.push('/Admin/login');
      return;
    }
    loadItems();
  }, [category, router]);

  const loadItems = () => {
    const storedItems = localStorage.getItem(category);
    if (storedItems) {
      setItems(JSON.parse(storedItems));
    } else {
      const defaultBatteries: BatteryItem[] = [
        { id: 1, type: 'Lead Acid Battery', capacity: '45Ah', warranty: '1 Year', price: 150000, quantity: 20 },
        { id: 2, type: 'Maintenance Free', capacity: '60Ah', warranty: '2 Years', price: 200000, quantity: 15 },
        { id: 3, type: 'Calcium Battery', capacity: '75Ah', warranty: '3 Years', price: 280000, quantity: 10 },
        { id: 4, type: 'AGM Battery', capacity: '100Ah', warranty: '4 Years', price: 420000, quantity: 8 },
        { id: 5, type: 'Gel Battery', capacity: '200Ah', warranty: '5 Years', price: 580000, quantity: 5 },
        { id: 6, type: 'Lithium Ion', capacity: '100Ah', warranty: '8 Years', price: 820000, quantity: 3 },
      ];
      setItems(defaultBatteries);
      localStorage.setItem(category, JSON.stringify(defaultBatteries));
    }
    setHasChanges(false);
  };

  const handleSave = () => {
    localStorage.setItem(category, JSON.stringify(items));
    setHasChanges(false);
    alert('Changes saved successfully! They will now appear on the main Batteries page.');
    
    // Force a reload to see changes immediately
    loadItems();
  };

  const handleEdit = (item: BatteryItem) => {
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
    const newItem: BatteryItem = {
      id: Date.now(),
      type: 'New Battery Type',
      capacity: '00Ah',
      warranty: '1 Year',
      price: 0,
      quantity: 0,
    };
    setItems([...items, newItem]);
    setEditingItem(newItem);
    setHasChanges(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this battery?')) {
      const updatedItems = items.filter(item => item.id !== id);
      setItems(updatedItems);
      setHasChanges(true);
    }
  };

  const renderField = (label: string, value: string | number, field: keyof BatteryItem, type = 'text') => (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
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
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="max-w-6xl mx-auto relative z-10 w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <Link href="/Admin/Dashboard" className="text-blue-300 hover:text-blue-200 mb-2 inline-block transition duration-200">
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-white">Edit Car Batteries</h1>
            <p className="text-white/80">Manage battery inventory and pricing</p>
            {hasChanges && (
              <p className="text-yellow-300 text-sm mt-1">⚠️ You have unsaved changes</p>
            )}
          </div>
          <div className="space-x-2">
            <button
              onClick={handleAddNew}
              className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg transition duration-200 transform hover:scale-105 shadow-lg"
            >
              Add New Battery
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
              {editingItem.id > 1000 ? 'Add New Battery' : 'Edit Battery'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {renderField('Battery Type', editingItem.type, 'type')}
              {renderField('Capacity', editingItem.capacity, 'capacity')}
              {renderField('Warranty', editingItem.warranty, 'warranty')}
              {renderField('Price (MWK)', editingItem.price, 'price', 'number')}
              {renderField('Quantity', editingItem.quantity, 'quantity', 'number')}
            </div>

            <div className="flex space-x-2 mt-4">
              <button
                onClick={handleUpdate}
                className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg transition duration-200 transform hover:scale-105"
              >
                {editingItem.id > 1000 ? 'Add Battery' : 'Update Battery'}
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

        {/* Batteries List */}
        <div className="grid grid-cols-1 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-blue-400/30 transition duration-300">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">🔋</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white">
                      {item.type}
                    </h3>
                    <p className="text-white/80">
                      Capacity: {item.capacity} • Warranty: {item.warranty}
                    </p>
                    <p className="text-green-300 font-bold">
                      Price: K{item.price.toLocaleString('en-MW')} • In Stock: {item.quantity}
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
            <div className="text-6xl mb-4">🔋</div>
            <h3 className="text-xl font-bold text-white mb-2">No Batteries Found</h3>
            <p className="text-white/80 mb-4">Add your first battery to get started</p>
            <button
              onClick={handleAddNew}
              className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-lg transition duration-200 transform hover:scale-105 shadow-lg"
            >
              Add First Battery
            </button>
          </div>
        )}
      </div>
    </div>
  );
}