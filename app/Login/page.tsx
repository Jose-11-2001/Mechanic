"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const API_BASE_URL = 'http://localhost:3001';

export default function Login() {
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate input
    if (!formData.emailOrUsername.trim()) {
      setError('Please enter your email or username');
      setIsLoading(false);
      return;
    }

    if (!formData.password) {
      setError('Please enter your password');
      setIsLoading(false);
      return;
    }

    try {
      console.log('🔐 Attempting login with:', {
        emailOrUsername: formData.emailOrUsername,
        passwordLength: formData.password.length
      });

      // Determine if input is email or username and create proper payload
      const isEmail = formData.emailOrUsername.includes('@');
      const loginPayload = isEmail 
        ? { email: formData.emailOrUsername.trim(), password: formData.password }
        : { username: formData.emailOrUsername.trim(), password: formData.password };

      console.log('📤 Sending login data:', {
        ...loginPayload,
        password: '*'.repeat(loginPayload.password.length)
      });

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginPayload),
      });

      console.log('📡 Response status:', response.status);
      
      const responseText = await response.text();
      console.log('📡 Raw response:', responseText);
      
      let responseData;
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.error('❌ JSON Parse error:', parseError);
        throw new Error('Invalid response from server');
      }

      console.log('📡 Parsed response:', responseData);

      if (!response.ok) {
        // More detailed error logging
        console.error('❌ Server error details:', {
          status: response.status,
          statusText: response.statusText,
          data: responseData
        });

        if (response.status === 401) {
          throw new Error('Invalid email/username or password');
        } else if (response.status === 400) {
          throw new Error(responseData.message || 'Bad request');
        } else if (response.status === 404) {
          throw new Error('User not found. Please check your email or username.');
        } else if (response.status === 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          throw new Error(responseData.message || `Login failed with status: ${response.status}`);
        }
      }

      console.log('✅ Login successful!');
      
      // Store authentication data
      if (responseData.access_token) {
        if (rememberMe) {
          localStorage.setItem('token', responseData.access_token);
        } else {
          sessionStorage.setItem('token', responseData.access_token);
        }
        console.log('🔑 Token stored');
      }
      
      if (responseData.user) {
        const userStorage = rememberMe ? localStorage : sessionStorage;
        userStorage.setItem('user', JSON.stringify(responseData.user));
        console.log('👤 User data stored:', responseData.user);
      }

      // Store login timestamp
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('loginTime', new Date().toISOString());

      console.log('📍 Redirecting to dashboard...');
      // Redirect to dashboard
      router.push('/dashboard');
      
    } catch (error: any) {
      console.error('❌ Login error:', error);
      
      // User-friendly error messages
      let userFriendlyError = error.message || 'Login failed. Please try again.';
      
      if (error.message.includes('Network') || error.message.includes('fetch')) {
        userFriendlyError = 'Cannot connect to server. Please check if the backend is running on port 3001.';
      } else if (error.message.includes('JSON')) {
        userFriendlyError = 'Server error. Please try again later.';
      }
      
      setError(userFriendlyError);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleDemoLogin = () => {
    setFormData({
      emailOrUsername: 'demo@example.com',
      password: 'password123'
    });
  };

  // Test backend connection on component mount
  const testBackendConnection = async () => {
    try {
      console.log('🔄 Testing backend connection...');
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'GET',
      });
      console.log('🔌 Backend connection test:', response.status);
    } catch (error) {
      console.error('❌ Backend connection failed:', error);
    }
  };

  // Uncomment the line below to test backend connection when component loads
  // React.useEffect(() => { testBackendConnection(); }, []);

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-4"
      style={{ backgroundImage: 'url("/Mechanic4.jpg")' }}>
      
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>
      
      <div className="relative z-10 bg-gray-900 bg-opacity-90 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-700">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">BODE AUTOMOTIVES</h1>
          <p className="text-gray-300 mt-2">Login to your account</p>
          <p className="text-sm text-green-400 mt-1">Use email or username</p>
          <p className="text-xs text-yellow-400 mt-1">Backend: {API_BASE_URL}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email/Username Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email or Username *
            </label>
            <input
              type="text"
              name="emailOrUsername"
              value={formData.emailOrUsername}
              onChange={handleInputChange}
              placeholder="Enter your email or username"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400 transition duration-200"
              required
              disabled={isLoading}
              autoComplete="username"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400 transition duration-200 pr-12"
                required
                disabled={isLoading}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 focus:outline-none transition duration-200 p-1"
                disabled={isLoading}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m9.02 9.02l3.411 3.411M9.88 9.88l-3.41-3.41m9.02 9.02l-3.41 3.41" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-green-600 bg-gray-800 border-gray-600 rounded focus:ring-green-500 focus:ring-offset-gray-800"
                disabled={isLoading}
              />
              <span className="text-sm text-gray-300">Remember me</span>
            </label>
            
            <Link 
              href="/forgot-password" 
              className="text-sm text-green-400 hover:text-green-300 transition duration-200"
            >
              Forgot password?
            </Link>
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-500 rounded-lg p-3 animate-pulse">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-400 text-sm">
                  {error}
                </p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg transform hover:scale-105 disabled:hover:scale-100"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Logging in...</span>
              </>
            ) : (
              <span>Login</span>
            )}
          </button>

          {/* Demo Login Button */}
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center space-x-1"
          >
            <span>📧</span>
            <span>Use Demo Credentials</span>
          </button>

          {/* Debug Info */}
          <div className="text-xs text-gray-500 text-center">
            <p>Demo: demo@example.com / password123</p>
            <p>Backend: {API_BASE_URL}</p>
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
          </div>
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-50 rounded-2xl flex items-center justify-center">
            <div className="text-white text-center">
              <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-sm">Logging in...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}