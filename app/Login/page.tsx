"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  // Mock user database
  const mockUsers = [
    { email: 'admin@gmail.com', password: 'admin123', name: 'Admin User', role: 'admin' },
    { email: 'user@example.com', password: 'password123', name: 'Demo User', role: 'user' },
    { email: 'mechanic@gmail.com', password: 'mechanic123', name: 'John Mechanic', role: 'mechanic' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate input
    if (!formData.email.trim()) {
      setError('Please enter your email');
      setIsLoading(false);
      return;
    }

    if (!formData.password) {
      setError('Please enter your password');
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      console.log('🔐 Attempting login with:', {
        email: formData.email,
        password: '*'.repeat(formData.password.length)
      });

      // Mock authentication - find user
      const user = mockUsers.find(
        u => u.email.toLowerCase() === formData.email.toLowerCase() && 
             u.password === formData.password
      );

      if (!user) {
        throw new Error('Invalid email or password');
      }

      console.log('✅ Login successful!', { user: { ...user, password: '***' } });
      
      // Store mock authentication data
      const mockToken = btoa(`${user.email}:${Date.now()}`);
      const userData = {
        id: Date.now(),
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=10b981&color=fff`
      };

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('token', mockToken);
      storage.setItem('user', JSON.stringify(userData));
      storage.setItem('loginTime', new Date().toISOString());
      storage.setItem('isMockAuth', 'true'); // Flag to indicate mock auth
      
      console.log('🔑 Mock authentication data stored');

      // Show success message
      alert(`Welcome back, ${user.name}!`);

      // Redirect to dashboard
      router.push('/Dashboard');
      
    } catch (error: any) {
      console.error('❌ Login error:', error);
      
      let userFriendlyError = error.message || 'Login failed. Please try again.';
      
      // Specific error messages
      if (error.message.includes('Invalid email')) {
        userFriendlyError = 'Invalid email or password. Try: admin@gmail.com / admin123';
      }
      
      setError(userFriendlyError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const fillDemoCredentials = (type: 'admin' | 'user' | 'mechanic' = 'admin') => {
    let credentials;
    switch(type) {
      case 'admin':
        credentials = { email: 'admin@gmail.com', password: 'admin123' };
        break;
      case 'user':
        credentials = { email: 'user@example.com', password: 'password123' };
        break;
      case 'mechanic':
        credentials = { email: 'mechanic@gmail.com', password: 'mechanic123' };
        break;
      default:
        credentials = { email: 'admin@gmail.com', password: 'admin123' };
    }
    setFormData(credentials);
    alert(`Demo credentials filled: ${credentials.email} / ${credentials.password}`);
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-4"
      style={{ backgroundImage: 'url("/Mechanic4.jpg")' }}>
      
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>
      
      <div className="relative z-10 bg-gray-900 bg-opacity-90 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-700">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">BODE AUTOMOTIVES</h1>
          <p className="text-gray-300 mt-2">Login to your account</p>
          <p className="text-xs text-yellow-400 mt-1">Demo Mode: No backend required</p>
        </div>

        {/* Demo Credentials Buttons */}
        <div className="mb-6 grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => fillDemoCredentials('admin')}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs py-2 px-2 rounded transition"
          >
            Admin
          </button>
          <button
            type="button"
            onClick={() => fillDemoCredentials('user')}
            className="bg-purple-600 hover:bg-purple-700 text-white text-xs py-2 px-2 rounded transition"
          >
            User
          </button>
          <button
            type="button"
            onClick={() => fillDemoCredentials('mechanic')}
            className="bg-orange-600 hover:bg-orange-700 text-white text-xs py-2 px-2 rounded transition"
          >
            Mechanic
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Use demo credentials above"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400 transition duration-200"
              required
              disabled={isLoading}
              autoComplete="email"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Use demo credentials above"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400 transition duration-200 pr-12"
                required
                disabled={isLoading}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                disabled={isLoading}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
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

          {error && (
            <div className="bg-red-900/50 border border-red-500 rounded-lg p-3">
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
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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
      </div>
    </div>
  );
}