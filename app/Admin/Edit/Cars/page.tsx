"use client";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

// Define the interface for car items
interface CarItem {
  id: number;
  brand: string;
  model: string;
  fuelType: string;
  seats: number;
  price: number;
  quantity: number;
  year?: number;
  available?: boolean;
  description?: string;
}

export default function Cars() {
  const [items, setItems] = useState<CarItem[]>([]);
  const [editingItem, setEditingItem] = useState<CarItem | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const router = useRouter();
  const params = useParams();
  const category = 'cars';

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated');
    if (!isAuthenticated) {
      router.push('/Admin/login');
      return;
    }

    // Load items for this category
    const storedItems = localStorage.getItem(category);
    if (storedItems) {
      try {
        const parsedItems = JSON.parse(storedItems);
        setItems(Array.isArray(parsedItems) ? parsedItems : []);
      } catch (error) {
        console.error('Error parsing stored items:', error);
        setItems([]);
      }
    } else {
      // Initialize with default data if none exists
      const defaultItems: CarItem[] = [
        {
          id: 1,
          brand: 'Toyota',
          model: 'Corolla',
          fuelType: 'Petrol',
          seats: 5,
          price: 50000,
          quantity: 3,
          year: 2022,
          available: true,
          description: 'Compact sedan, great fuel efficiency'
        },
        {
          id: 2,
          brand: 'Honda',
          model: 'CR-V',
          fuelType: 'Petrol',
          seats: 7,
          price: 65000,
          quantity: 2,
          year: 2021,
          available: true,
          description: 'Spacious SUV with modern features'
        },
        {
          id: 3,
          brand: 'BMW',
          model: 'X5',
          fuelType: 'Diesel',
          seats: 5,
          price: 120000,
          quantity: 1,
          year: 2023,
          available: false,
          description: 'Luxury SUV with premium amenities'
        }
      ];
      setItems(defaultItems);
      localStorage.setItem(category, JSON.stringify(defaultItems));
    }
  }, [category, router]);

  const handleSave = () => {
    localStorage.setItem(category, JSON.stringify(items));
    setHasChanges(false);
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
      setHasChanges(true);
    }
  };

  const handleAddNew = () => {
    const newItem: CarItem = {
      id: Date.now(),
      brand: 'New Brand',
      model: 'New Model',
      fuelType: 'Petrol',
      seats: 5,
      price: 0,
      quantity: 0,
      year: new Date().getFullYear(),
      available: true,
      description: ''
    };
    setItems([...items, newItem]);
    setEditingItem(newItem);
    setHasChanges(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this car?')) {
      const updatedItems = items.filter(item => item.id !== id);
      setItems(updatedItems);
      setHasChanges(true);
    }
  };

  const toggleAvailability = (id: number) => {
    const updatedItems = items.map(item => 
      item.id === id ? { ...item, available: !item.available } : item
    );
    setItems(updatedItems);
    setHasChanges(true);
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
            setHasChanges(true);
          }
        }}
        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
        placeholder={`Enter ${label.toLowerCase()}`}
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
            setHasChanges(true);
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

  const renderNumberSelectField = (label: string, value: number, field: keyof CarItem, options: number[]) => (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => {
          if (editingItem) {
            setEditingItem({
              ...editingItem,
              [field]: Number(e.target.value)
            });
            setHasChanges(true);
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

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <Link href="/Admin/Dashboard" className="text-blue-300 hover:text-blue-200 mb-2 inline-block transition duration-200">
              ← Back to Dashboard
            </Link>
            <div className="flex items-center space-x-3">
              <div className="text-3xl">🚗</div>
              <div>
                <h1 className="text-3xl font-bold text-white">Manage Car Rental Fleet</h1>
                <p className="text-white/80">Add, edit, and manage your rental car inventory</p>
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
              Add New Car
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

        {/* Car Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <h3 className="text-white font-bold">Total Cars</h3>
            <p className="text-2xl text-blue-400">{items.length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <h3 className="text-white font-bold">Available</h3>
            <p className="text-2xl text-green-400">
              {items.filter(car => car.available).length}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <h3 className="text-white font-bold">Rented</h3>
            <p className="text-2xl text-red-400">
              {items.filter(car => !car.available).length}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <h3 className="text-white font-bold">Total Value</h3>
            <p className="text-2xl text-yellow-400">
              K{items.reduce((sum, car) => sum + car.price, 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Edit Form */}
        {editingItem && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-blue-400/50">
            <h3 className="text-xl font-bold text-white mb-4">
              {editingItem.id > 1000 ? 'Add New Car' : 'Edit Car'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {renderField('Brand', editingItem.brand || '', 'brand')}
              {renderField('Model', editingItem.model || '', 'model')}
              {renderSelectField('Fuel Type', editingItem.fuelType || 'Petrol', 'fuelType', [
                'Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG', 'LPG'
              ])}
              {renderNumberSelectField('Seats', editingItem.seats || 5, 'seats', [2, 4, 5, 7, 8, 9])}
              {renderField('Year', editingItem.year || new Date().getFullYear(), 'year', 'number')}
              {renderField('Price (MWK per day)', editingItem.price || 0, 'price', 'number')}
              {renderField('Quantity', editingItem.quantity || 0, 'quantity', 'number')}
              
              <div className="md:col-span-2 lg:col-span-3">
                {renderField('Description', editingItem.description || '', 'description')}
              </div>

              <div className="md:col-span-2 lg:col-span-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={editingItem.available || false}
                    onChange={(e) => {
                      if (editingItem) {
                        setEditingItem({
                          ...editingItem,
                          available: e.target.checked
                        });
                        setHasChanges(true);
                      }
                    }}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-white">Available for rental</span>
                </label>
              </div>
            </div>

            <div className="flex space-x-2 mt-4">
              <button
                onClick={handleUpdate}
                className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg transition duration-200 transform hover:scale-105"
              >
                {editingItem.id > 1000 ? 'Add Car' : 'Update Car'}
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

        {/* Cars List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map((car) => (
            <div 
              key={car.id} 
              className={`bg-white/10 backdrop-blur-md rounded-2xl p-6 border transition duration-300 ${
                car.available 
                  ? 'border-green-400/30 hover:border-green-400/50' 
                  : 'border-red-400/30 hover:border-red-400/50'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {car.brand} {car.model}
                  </h3>
                  <p className="text-white/80 text-sm">
                    Year: {car.year} • {car.fuelType}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  car.available 
                    ? 'bg-green-600 text-white' 
                    : 'bg-red-600 text-white'
                }`}>
                  {car.available ? 'Available' : 'Rented'}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Seats:</span>
                  <span className="text-white">{car.seats}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Daily Rate:</span>
                  <span className="text-green-300 font-bold">K{car.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">In Stock:</span>
                  <span className="text-white">{car.quantity}</span>
                </div>
              </div>

              {car.description && (
                <p className="text-white/60 text-sm mb-4 border-t border-white/20 pt-2">
                  {car.description}
                </p>
              )}

              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(car)}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg flex-1 transition duration-200 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => toggleAvailability(car.id)}
                  className={`px-3 py-2 rounded-lg flex-1 transition duration-200 text-sm ${
                    car.available
                      ? 'bg-yellow-600 hover:bg-yellow-500 text-white'
                      : 'bg-green-600 hover:bg-green-500 text-white'
                  }`}
                >
                  {car.available ? 'Mark Rented' : 'Mark Available'}
                </button>
                <button
                  onClick={() => handleDelete(car.id)}
                  className="bg-red-600 hover:bg-red-500 text-white px-3 py-2 rounded-lg transition duration-200 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {items.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🚗</div>
            <h3 className="text-xl font-bold text-white mb-2">No Cars in Fleet</h3>
            <p className="text-white/80 mb-4">Add your first rental car to get started</p>
            <button
              onClick={handleAddNew}
              className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-lg transition duration-200 transform hover:scale-105 shadow-lg"
            >
              Add First Car
            </button>
          </div>
        )}

        {/* Help Text */}
        <div className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h3 className="text-lg font-bold text-white mb-2">💡 Car Rental Management Tips</h3>
          <ul className="text-white/80 text-sm space-y-1">
            <li>• Set <strong>Quantity</strong> to the number of identical cars available</li>
            <li>• Use <strong>Available/Rented</strong> toggle to manage rental status</li>
            <li>• Include detailed descriptions to help customers choose the right car</li>
            <li>• Update pricing regularly based on market rates and demand</li>
            <li>• Set appropriate fuel types for accurate customer expectations</li>
          </ul>
        </div>
      </div>
    </div>
  );
}