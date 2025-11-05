"use client";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

// Define the interface for car items
interface CarItem {
  id: number;
  brand: string;
  fuelType: string;
  seats: number;
  price: number;
  quantity: number;
  description?: string;
}

export default function Cars() {
  const [items, setItems] = useState<CarItem[]>([]);
  const [editingItem, setEditingItem] = useState<CarItem | null>(null);
  const [category, setCategory] = useState<string>('');
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    // Set category from params once it's available
    if (params?.category) {
      setCategory(params.category as string);
    }
  }, [params]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated');
    if (!isAuthenticated) {
      router.push('/Admin/login');
      return;
    }

    // Load items for this category only when category is available
    if (category) {
      const storedItems = localStorage.getItem(category);
      if (storedItems) {
        setItems(JSON.parse(storedItems));
      }
    }
  }, [category, router]);

  const handleSave = () => {
    if (!category) return;
    localStorage.setItem(category, JSON.stringify(items));
    alert('Changes saved successfully!');
  };

  const handleEdit = (item: CarItem) => {
    setEditingItem({ ...item });
  };

  const handleUpdate = () => {
    if (editingItem) {
      const updatedItems = items.map(item => 
        item.id === editingItem.id ? editingItem : item
      );
      setItems(updatedItems);
      setEditingItem(null);
    }
  };

  const handleAddNew = () => {
    const newItem: CarItem = {
      id: Date.now(), // Simple ID generation
      brand: 'New Brand',
      fuelType: 'Petrol',
      seats: 5,
      price: 0,
      quantity: 0,
      description: ''
    };
    setItems([...items, newItem]);
    setEditingItem(newItem);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this car?')) {
      const updatedItems = items.filter(item => item.id !== id);
      setItems(updatedItems);
    }
  };

  const renderField = (label: string, value: string | number, field: keyof CarItem, type = 'text') => (
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
          }
        }}
        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
      />
    </div>
  );

  const renderSelectField = (label: string, value: string, field: keyof CarItem, options: string[]) => (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => {
          if (editingItem) {
            setEditingItem({
              ...editingItem,
              [field]: e.target.value
            });
          }
        }}
        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
      >
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );

  // Safely format category name for display
  const formatCategoryName = (cat: string) => {
    if (!cat) return 'Category';
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <Link href="/Admin/Dashboard" className="text-blue-400 hover:text-blue-300 mb-2 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-white">Manage {formatCategoryName(category)}</h1>
          </div>
          <div className="space-x-2">
            <button
              onClick={handleAddNew}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              Add New Car
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Save All Changes
            </button>
          </div>
        </div>

        {/* Edit Form */}
        {editingItem && (
          <div className="bg-gray-800 rounded-2xl p-6 mb-6 border border-blue-500">
            <h3 className="text-xl font-bold text-white mb-4">
              {editingItem.id > 1000 ? 'Add New Car' : 'Edit Car'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {renderField('Brand', editingItem.brand || '', 'brand')}
              
              {renderSelectField('Fuel Type', editingItem.fuelType || 'Petrol', 'fuelType', [
                'Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG', 'LPG'
              ])}
              
              {renderSelectField('Number of Seats', editingItem.seats.toString(), 'seats', [
                '2', '4', '5', '7', '8', '9'
              ])}
              
              {renderField('Price', editingItem.price || 0, 'price', 'number')}
              {renderField('Quantity', editingItem.quantity || 0, 'quantity', 'number')}
              
              <div className="md:col-span-2 lg:col-span-3">
                {renderField('Description', editingItem.description || '', 'description')}
              </div>
            </div>

            <div className="flex space-x-2 mt-4">
              <button
                onClick={handleUpdate}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                {editingItem.id > 1000 ? 'Add Car' : 'Update Car'}
              </button>
              <button
                onClick={() => setEditingItem(null)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Cars List */}
        <div className="grid grid-cols-1 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white">
                    {item.brand}
                  </h3>
                  <p className="text-gray-300">
                    Fuel: {item.fuelType} • Seats: {item.seats} • Price: K{item.price} • Qty: {item.quantity}
                  </p>
                  {item.description && (
                    <p className="text-gray-400 text-sm mt-1">{item.description}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400 text-lg">No cars added yet. Click "Add New Car" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}