"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    console.log('🔄 Login process started...');

    // Simulate a short delay for "processing"
    setTimeout(() => {
      try {
        console.log('✅ Login successful!');
        console.log('📱 LocalStorage available:', typeof localStorage !== 'undefined');
        
        // Store a simple flag to indicate user is logged in
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('loginTime', new Date().toISOString());
          console.log('💾 Login data stored in localStorage');
        }
        
        console.log('🚀 Attempting to navigate to /Services');
        
        // Method 1: Try router.push first
        router.push('/Services');
        
        // Method 2: Fallback to window.location if router doesn't work
        setTimeout(() => {
          console.log('⏳ Router push may have failed, trying fallback...');
          window.location.href = '/Services';
        }, 1000);
        
      } catch (err: any) {
        console.error('❌ Navigation error:', err);
        setError(`Failed to redirect: ${err.message}`);
        setIsLoading(false);
      }
    }, 500);
  };

  const continueAsGuest = () => {
    console.log('👤 Continuing as guest...');
    
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('isGuest', 'true');
      localStorage.setItem('loginTime', new Date().toISOString());
    }
    
    router.push('/Services');
    
    // Fallback
    setTimeout(() => {
      window.location.href = '/Services';
    }, 1000);
  };

  // Test function to check if Services page exists
  const testServicesPage = async () => {
    try {
      const response = await fetch('/Services');
      if (response.ok) {
        console.log('✅ Services page exists at /Services');
        alert('Services page exists! Status: ' + response.status);
      } else {
        console.log('❌ Services page not found. Status:', response.status);
        alert('Services page returned status: ' + response.status);
      }
    } catch (err) {
      console.error('❌ Cannot reach Services page:', err);
      alert('Cannot reach Services page. Check if it exists.');
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-4"
      style={{ backgroundImage: 'url("/Mechanic4.jpg")' }}>
      
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>
      
      <div className="relative z-10 bg-gray-900 bg-opacity-90 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-700">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">BODE AUTOMOTIVES</h1>
          <p className="text-gray-300 mt-2">Welcome Back</p>
          
          {/* Debug button - remove in production */}
          <button
            onClick={testServicesPage}
            className="mt-2 text-xs bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded"
          >
            Test Services Page
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter email"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400 transition duration-200"
              disabled={isLoading}
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="Enter password"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400 transition duration-200"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-green-600 bg-gray-800 border-gray-600 rounded focus:ring-green-500"
                disabled={isLoading}
              />
              <span className="text-sm text-gray-300">Remember me</span>
            </label>
            
            <Link 
              href="/ForgetPassword" 
              className="text-sm text-green-400 hover:text-green-300 transition duration-200"
            >
              Forgot password?
            </Link>
          </div>
  
    <p className="text-sm text-gray-400">
              
              <Link 
                href="/Services" 
                className="text-green-400 hover:text-green-300 font-semibold transition duration-200"
              >
               <button>Login</button>
              </Link>
            </p>
 

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
          </div>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-700">
          <div className="text-center">
            <p className="text-sm text-gray-400">
              Don't have an account?{' '}
              <Link 
                href="/SignUp" 
                className="text-green-400 hover:text-green-300 font-semibold transition duration-200"
              >
                Sign up here
              </Link>
            </p>
            <p className="text-xs text-gray-500 mt-2">
              <Link 
                href="/Services" 
                className="text-green-400 hover:text-green-300"
              >
                Go directly to Services page →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}