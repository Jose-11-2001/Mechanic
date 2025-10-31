// app/Admin/AddProduct/page.tsx
"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddProduct() {
  const [formData, setFormData] = useState({
    category: '',
    name: '',
    description: '',
    type: '',
    brand: '',
    size: '',
    capacity: '',
    warranty: '',
    grade: '',
    valve: '',
    price: 0,
    quantity: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const categories = [
    { value: 'tyres', label: 'Tyres', icon: '🛞' },
    { value: 'tubes', label: 'Tubes', icon: '🌀' },
    { value: 'batteries', label: 'Batteries', icon: '🔋' },
    { value: 'oil_change', label: 'Oil & Lubricants', icon: '🛢️' },
    { value: 'engineer', label: 'Engineering Services', icon: '🔧' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'quantity' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Get existing items from localStorage
      const existingItems = JSON.parse(localStorage.getItem(formData.category) || '[]');
      
      // Create new product object
      const newProduct = {
        id: Date.now(),
        name: formData.name,
        description: formData.description,
        type: formData.type,
        brand: formData.brand,
        size: formData.size,
        capacity: formData.capacity,
        warranty: formData.warranty,
        grade: formData.grade,
        valve: formData.valve,
        price: formData.price,
        quantity: formData.quantity
      };

      // Add to existing items
      const updatedItems = [...existingItems, newProduct];
      
      // Save back to localStorage
      localStorage.setItem(formData.category, JSON.stringify(updatedItems));
      
      alert('Product added successfully!');
      router.push('/Admin/Dashboard');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderField = (label: string, name: string, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-sm font-medium text-white/90 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={(formData as any)[name]}
        onChange={handleInputChange}
        className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded text-white placeholder-white/60"
        placeholder={placeholder}
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

      <div className="max-w-2xl mx-auto relative z-10 w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <Link href="/Admin/Dashboard" className="text-blue-300 hover:text-blue-200 mb-2 inline-block transition duration-200">
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-white">Add New Product</h1>
            <p className="text-white/80">Add a new product to your inventory</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          {/* Category Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white/90 mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded text-white"
              required
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {renderField('Product Name', 'name', 'text', 'Enter product name')}
            {renderField('Brand', 'brand', 'text', 'Enter brand name')}
          </div>

          {/* Category-specific Fields */}
          {formData.category === 'tyres' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {renderField('Size', 'size', 'text', 'e.g., 165/70R14')}
              {renderField('Type', 'type', 'text', 'e.g., All Season')}
            </div>
          )}

          {formData.category === 'batteries' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {renderField('Capacity', 'capacity', 'text', 'e.g., 45Ah')}
              {renderField('Warranty', 'warranty', 'text', 'e.g., 1 Year')}
            </div>
          )}

          {formData.category === 'oil_change' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {renderField('Oil Type', 'type', 'text', 'e.g., Petrol Engine Oil')}
              {renderField('Grade', 'grade', 'text', 'e.g., 5W-30 Synthetic')}
            </div>
          )}

          {formData.category === 'tubes' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {renderField('Size', 'size', 'text', 'e.g., 12-inch')}
              {renderField('Valve Type', 'valve', 'text', 'e.g., Schrader')}
            </div>
          )}

          {formData.category === 'engineer' && (
            <div className="mb-4">
              {renderField('Service Description', 'description', 'textarea', 'Describe the service')}
            </div>
          )}

          {/* Price and Quantity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {renderField('Price (MWK)', 'price', 'number', '0')}
            {renderField('Quantity', 'quantity', 'number', '0')}
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-lg transition duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50"
            >
              {isLoading ? 'Adding Product...' : 'Add Product'}
            </button>
            <Link href="/Admin/Dashboard">
              <button
                type="button"
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg transition duration-200"
              >
                Cancel
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}