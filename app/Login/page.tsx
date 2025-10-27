"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });
  
  const [touched, setTouched] = useState({
    email: false,
    password: false
  });

  // Validation rules
  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'email':
        if (!value) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email';
        return '';
      
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        if (value.length > 50) return 'Password must be less than 50 characters';
        return '';
      
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validate field in real-time if it's been touched
    if (touched[name as keyof typeof touched]) {
      setErrors(prev => ({ 
        ...prev, 
        [name]: validateField(name, value) 
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ 
      ...prev, 
      [name]: validateField(name, value) 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched and validate
    const newTouched = { email: true, password: true };
    const newErrors = {
      email: validateField('email', formData.email),
      password: validateField('password', formData.password)
    };
    
    setTouched(newTouched);
    setErrors(newErrors);
    
    // Check if form is valid
    const isValid = !newErrors.email && !newErrors.password;
    
    if (isValid) {
      // Submit the form (add your API call here)
      console.log('Form is valid, submitting:', formData);
      alert('Login successful!');
      // Add your login logic here
    } else {
      console.log('Form has errors');
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-4"
      style={{ backgroundImage: 'url("/Mechanic4.jpg")' }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>
      
      {/* Login Card */}
      <div className="relative z-10 bg-gray-900 bg-opacity-90 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-700">
        {/* Back Arrow on the form */}
        <Link href="/Home">
          <button className="absolute top-4 left-4 text-gray-300 hover:text-white transition duration-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">BODE-AUTOMOTIVES</h1>
          <p className="text-gray-300 mt-2">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your email"
              className={`w-full px-4 py-3 bg-gray-800 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition duration-200 ${
                errors.email && touched.email 
                  ? 'border-red-500' 
                  : 'border-gray-600'
              }`}
            />
            {errors.email && touched.email && (
              <p className="text-red-400 text-sm mt-1 flex items-center">
                <span className="mr-1">⚠</span>
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your password"
              className={`w-full px-4 py-3 bg-gray-800 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition duration-200 ${
                errors.password && touched.password 
                  ? 'border-red-500' 
                  : 'border-gray-600'
              }`}
            />
            {errors.password && touched.password && (
              <p className="text-red-400 text-sm mt-1 flex items-center">
                <span className="mr-1">⚠</span>
                {errors.password}
              </p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-800"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-300">
                Remember me
              </label>
            </div>
            <Link href="ForgetPassword" className="text-sm text-blue-400 hover:text-blue-300">
              Forgot password?
            </Link>
          </div>

          {/* Login Button */}
          <Link href="Services"><button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={!!errors.email || !!errors.password}
          >
            Login
          </button>
</Link>
          
          {/* Divider */}
          <div className="relative flex items-center my-6">
            <div className="flex-grow border-t border-gray-600"></div>
            
            <div className="flex-grow border-t border-gray-600"></div>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-400">
            Don't have an account?{' '}
            <Link href="/SignUp" className="text-blue-400 hover:text-blue-300 font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}