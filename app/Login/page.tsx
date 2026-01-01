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
      console.log('✅ Login successful! Redirecting to dashboard...');
      
      // Store a simple flag to indicate user is logged in
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('loginTime', new Date().toISOString());
      
      // Redirect to dashboard
      router.push('/Dashboard');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-4"
      style={{ backgroundImage: 'url("/Mechanic4.jpg")' }}>
      
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>
      
      <div className="relative z-10 bg-gray-900 bg-opacity-90 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-700">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">BODE AUTOMOTIVES</h1>
          <p className="text-gray-300 mt-2">Welcome Back</p>
          <p className="text-xs text-yellow-400 mt-1">No credentials needed for now</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input - Just for show */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter any email (optional)"
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
                placeholder="Enter any password (optional)"
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
              onClick={(e) => {
                e.preventDefault();
                alert('Password reset not implemented yet');
              }}
            >
              Forgot password?
            </Link>
          </div>

          <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-3 text-center">
            <p className="text-blue-300 text-sm">
              💡 No authentication required for now. Just click Login.
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Redirecting...</span>
              </>
            ) : (
              <span>Login</span>
            )}
          </button>
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
              Note: Authentication will be implemented when backend is ready
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}