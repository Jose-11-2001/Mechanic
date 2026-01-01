"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate a short delay for "processing"
    setTimeout(() => {
      console.log('✅ Login successful! Redirecting to services...');
      
      // Store a simple flag to indicate user is logged in
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('loginTime', new Date().toISOString());
      
      // Redirect to services page
      router.push('/Services');
    }, 500);
  };

  const continueAsGuest = () => {
    console.log('👤 Continuing as guest...');
    localStorage.setItem('isGuest', 'true');
    localStorage.setItem('loginTime', new Date().toISOString());
    router.push('/Services');
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-4"
      style={{ backgroundImage: 'url("/Mechanic4.jpg")' }}>
      
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>
      
      <div className="relative z-10 bg-gray-900 bg-opacity-90 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-700">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">BODE AUTOMOTIVES</h1>
          <p className="text-gray-300 mt-2">Welcome Back</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input - Just for show */}
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

          {/* Password Input - Just for show */}
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Redirecting to Services...</span>
              </>
            ) : (
              <span>Login</span>
            )}
          </button>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-400">OR</span>
            </div>
          </div>

          {/* Direct Services Link */}
          <div className="text-center">
            <button
              type="button"
              onClick={continueAsGuest}
              disabled={isLoading}
              className="w-full bg-transparent border border-gray-600 hover:border-gray-500 hover:bg-gray-800/50 text-gray-300 font-medium py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue as Guest
            </button>
            <p className="text-xs text-gray-500 mt-2">
              Browse services without creating an account
            </p>
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
                Browse all services →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}