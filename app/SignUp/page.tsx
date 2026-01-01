"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUp() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'customer' // customer, mechanic, admin
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Basic validation
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      console.log('✅ Account created successfully!', formData);
      
      // Store user data (in a real app, this would come from backend)
      const userData = {
        id: Date.now(),
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        type: formData.userType,
        createdAt: new Date().toISOString()
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isLoggedIn', 'true');
      
      // Show success message
      alert(`Welcome ${formData.fullName}! Your account has been created.`);
      
      // Redirect to services page
      router.push('/Services');
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-4 py-8"
      style={{ backgroundImage: 'url("/Mechanic4.jpg")' }}>
      
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>
      
      <div className="relative z-10 bg-gray-900 bg-opacity-90 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-700">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
          <p className="text-gray-300 mt-2">Join BODE AUTOMOTIVES today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              className={`w-full px-4 py-3 bg-gray-800 border ${errors.fullName ? 'border-red-500' : 'border-gray-600'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400 transition duration-200`}
              disabled={isLoading}
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-400">{errors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className={`w-full px-4 py-3 bg-gray-800 border ${errors.email ? 'border-red-500' : 'border-gray-600'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400 transition duration-200`}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-400">{errors.email}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
              className={`w-full px-4 py-3 bg-gray-800 border ${errors.phone ? 'border-red-500' : 'border-gray-600'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400 transition duration-200`}
              disabled={isLoading}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-400">{errors.phone}</p>
            )}
          </div>

          {/* User Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              I am a *
            </label>
            <select
              name="userType"
              value={formData.userType}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white transition duration-200"
              disabled={isLoading}
            >
              <option value="customer">Customer</option>
              <option value="mechanic">Mechanic</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          {/* Password */}
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
                placeholder="Create a password (min. 6 characters)"
                className={`w-full px-4 py-3 bg-gray-800 border ${errors.password ? 'border-red-500' : 'border-gray-600'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400 transition duration-200 pr-12`}
                disabled={isLoading}
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
            {errors.password && (
              <p className="mt-1 text-sm text-red-400">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Confirm Password *
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                className={`w-full px-4 py-3 bg-gray-800 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-600'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400 transition duration-200 pr-12`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                disabled={isLoading}
              >
                {showConfirmPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              id="terms"
              className="mt-1 w-4 h-4 text-green-600 bg-gray-800 border-gray-600 rounded focus:ring-green-500"
              required
              disabled={isLoading}
            />
            <label htmlFor="terms" className="text-sm text-gray-300">
              I agree to the{' '}
              <Link href="/terms" className="text-green-400 hover:text-green-300">
                Terms & Conditions
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-green-400 hover:text-green-300">
                Privacy Policy
              </Link>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mt-4"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        {/* Already have account */}
        <div className="mt-6 pt-6 border-t border-gray-700">
          <div className="text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <Link 
                href="/Login" 
                className="text-green-400 hover:text-green-300 font-semibold transition duration-200"
              >
                Sign in here
              </Link>
            </p>
            <p className="text-xs text-gray-500 mt-2">
              * Required fields
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}