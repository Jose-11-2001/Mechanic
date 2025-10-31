// app/Admin/Settings/page.tsx
"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SystemSetting() {
  const [settings, setSettings] = useState({
    companyName: 'BODE AUTOMOTIVES',
    contactEmail: 'info@bodeautomotive.com',
    contactPhone: '+265 123 456 789',
    address: 'Blantyre, Malawi',
    currency: 'MWK',
    taxRate: 16.5,
    lowStockThreshold: 10,
    enableSMS: true,
    enableEmail: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated');
    if (!isAuthenticated) {
      router.push('/Admin/login');
      return;
    }

    // Load settings from localStorage
    const storedSettings = localStorage.getItem('appSettings');
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
               type === 'number' ? Number(value) : value
    }));
  };

  const handleSave = () => {
    setIsLoading(true);
    // Save settings to localStorage
    localStorage.setItem('appSettings', JSON.stringify(settings));
    setTimeout(() => {
      setIsLoading(false);
      alert('Settings saved successfully!');
    }, 1000);
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
      // Clear all localStorage data
      const keys = ['tyres', 'tubes', 'engineer', 'batteries', 'oil_change', 'orders'];
      keys.forEach(key => localStorage.removeItem(key));
      alert('All data has been reset!');
      router.push('/Admin/Dashboard');
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

      <div className="max-w-4xl mx-auto relative z-10 w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <Link href="/Admin/Dashboard" className="text-blue-300 hover:text-blue-200 mb-2 inline-block transition duration-200">
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-white">System Settings</h1>
            <p className="text-white/80">Configure your automotive business settings</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          {/* Company Information */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Company Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-1">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={settings.companyName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/90 mb-1">Contact Email</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={settings.contactEmail}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/90 mb-1">Contact Phone</label>
                <input
                  type="text"
                  name="contactPhone"
                  value={settings.contactPhone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/90 mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={settings.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded text-white"
                />
              </div>
            </div>
          </div>

          {/* Business Settings */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Business Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-1">Currency</label>
                <select
                  name="currency"
                  value={settings.currency}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded text-white"
                >
                  <option value="MWK">Malawi Kwacha (MWK)</option>
                  <option value="USD">US Dollar (USD)</option>
                  <option value="ZAR">South African Rand (ZAR)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/90 mb-1">Tax Rate (%)</label>
                <input
                  type="number"
                  name="taxRate"
                  value={settings.taxRate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded text-white"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/90 mb-1">Low Stock Threshold</label>
                <input
                  type="number"
                  name="lowStockThreshold"
                  value={settings.lowStockThreshold}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded text-white"
                />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Notification Settings</h2>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="enableSMS"
                  checked={settings.enableSMS}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-white/90">Enable SMS Notifications</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="enableEmail"
                  checked={settings.enableEmail}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-white/90">Enable Email Notifications</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-4">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-lg transition duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save Settings'}
            </button>
            <button
              onClick={handleResetData}
              className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-lg transition duration-200"
            >
              Reset All Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}