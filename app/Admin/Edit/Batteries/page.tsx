"use client";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function Batteries() {
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const router = useRouter();
  const params = useParams();
  const category = params.category as string;

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
    }
  }, [category, router]);

  const handleSave = () => {
    localStorage.setItem(category, JSON.stringify(items));
    alert('Changes saved successfully!');
  };

  const handleEdit = (item: any) => {
    setEditingItem({ ...item });
  };

  const handleUpdate = () => {
    if (editingItem) {
      const updatedItems = items.map((item: any) => 
        item.id === editingItem.id ? editingItem : item
      );
      setItems(updatedItems);
      setEditingItem(null);
    }
  };

  const handleAddNew = () => {
    const newItem = {
      id: Date.now(), // Simple ID generation
      name: 'New Item',
      price: 0,
      quantity: 0,
      // Add other default fields based on category
    };
    setItems([...items, newItem]);
    setEditingItem(newItem);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this item?')) {
      const updatedItems = items.filter((item: any) => item.id !== id);
      setItems(updatedItems);
    }
  };

  const renderField = (label: string, value: any, field: string, type = 'text') => (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => setEditingItem({
          ...editingItem,
          [field]: type === 'number' ? Number(e.target.value) : e.target.value
        })}
        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
      />
    </div>
  );

  if (!items) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <Link href="/Admin/Dashboard" className="text-blue-400 hover:text-blue-300 mb-2 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-white">Edit {category.charAt(0).toUpperCase() + category.slice(1)}</h1>
          </div>
          <div className="space-x-2">
            <button
              onClick={handleAddNew}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              Add New
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
              {editingItem.id > 1000 ? 'Add New Item' : 'Edit Item'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {category === 'tyres' && (
                <>
                  {renderField('Size', editingItem.size || '', 'size')}
                  {renderField('Brand', editingItem.brand || '', 'brand')}
                  {renderField('Type', editingItem.type || '', 'type')}
                </>
              )}
              
              {category === 'engineer' && (
                <>
                  {renderField('Service Name', editingItem.name || '', 'name')}
                  {renderField('Description', editingItem.description || '', 'description')}
                </>
              )}

              {renderField('Price', editingItem.price || 0, 'price', 'number')}
              {renderField('Quantity', editingItem.quantity || 0, 'quantity', 'number')}
            </div>

            <div className="flex space-x-2 mt-4">
              <button
                onClick={handleUpdate}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                {editingItem.id > 1000 ? 'Add Item' : 'Update Item'}
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

        {/* Items List */}
        <div className="grid grid-cols-1 gap-4">
          {items.map((item: any) => (
            <div key={item.id} className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white">
                    {item.name || item.size || item.type}
                  </h3>
                  <p className="text-gray-300">
                    {item.brand && `Brand: ${item.brand} • `}
                    {item.description && `Desc: ${item.description} • `}
                    Price: K{item.price} • Qty: {item.quantity}
                  </p>
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
      </div>
    </div>
  );
}