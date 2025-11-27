"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function Login() {
  const [formData, setFormData] = useState({
    loginId: '', // This can be username or email
    password: '',
    userType: 'user' // 'user' or 'admin'
  });
  
  const [errors, setErrors] = useState({
    loginId: '',
    password: '',
    userType: ''
  });
  
  const [touched, setTouched] = useState({
    loginId: false,
    password: false,
    userType: false
  });

  // Validation rules
  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'loginId':
        if (!value) return 'Username or Email is required';
        if (value.length < 3) return 'Must be at least 3 characters';
        if (value.length > 100) return 'Must be less than 100 characters';
        
        // If it contains @, validate as email, otherwise as username
        if (value.includes('@')) {
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
        } else {
          if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Username can only contain letters, numbers, and underscores';
        }
        return '';
      
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        if (value.length > 50) return 'Password must be less than 50 characters';
        return '';
      
      case 'userType':
        if (!value) return 'Please select user type';
        return '';
      
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    const newTouched = { 
      loginId: true, 
      password: true,
      userType: true
    };
    const newErrors = {
      loginId: validateField('loginId', formData.loginId),
      password: validateField('password', formData.password),
      userType: validateField('userType', formData.userType)
    };
    
    setTouched(newTouched);
    setErrors(newErrors);
    
    // Check if form is valid
    const isValid = !newErrors.loginId && !newErrors.password && !newErrors.userType;
    
    if (isValid) {
      // Determine if loginId is email or username
      const isEmail = formData.loginId.includes('@');
      const loginData = {
        loginId: formData.loginId,
        password: formData.password,
        userType: formData.userType,
        isEmail: isEmail
      };
      
      console.log('Login form is valid, submitting:', loginData);
      
      // Here you would typically send the data to your backend API
      // The backend should check the appropriate table based on userType
      
      // Simulate different redirects based on user type
      if (formData.userType === 'admin') {
        alert('Admin login successful! Redirecting to admin dashboard...');
        // Redirect to admin dashboard
        // window.location.href = '/admin/dashboard';
      } else {
        alert('User login successful! Redirecting to services...');
        // Redirect to user services page
        // window.location.href = '/services';
      }
      
      // Reset form after successful submission
      setFormData({
        loginId: '',
        password: '',
        userType: 'user'
      });
      setTouched({
        loginId: false,
        password: false,
        userType: false
      });
      
    } else {
      console.log('Form has errors');
    }
  };

  // Check if form has any errors
  const hasErrors = Object.values(errors).some(error => error !== '');
  // Check if all required fields are filled
  const allFieldsFilled = formData.loginId && formData.password && formData.userType;

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-4"
      style={{ backgroundImage: 'url("/Mechanic4.jpg")' }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>
      
      {/* Login Card */}
      <div className="relative z-10 bg-gray-900 bg-opacity-90 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-700">
        {/* Back Arrow */}
        <Link href="/">
          <button className="absolute top-4 left-4 text-gray-300 hover:text-white transition duration-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">BODE AUTOMOTIVES</h1>
          <p className="text-gray-300 mt-2">Welcome back</p>
          <p className="text-sm text-green-400 mt-1">Login as user or admin</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* User Type Selection */}
          <div>
            <label htmlFor="userType" className="block text-sm font-medium text-gray-300 mb-2">
              Login As *
            </label>
            <select
              id="userType"
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 bg-gray-800 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white transition duration-200 ${
                errors.userType && touched.userType 
                  ? 'border-red-500' 
                  : 'border-gray-600'
              }`}
            >
              <option value="user">User</option>
              <option value="admin">Administrator</option>
            </select>
            {errors.userType && touched.userType && (
              <p className="text-red-400 text-sm mt-1 flex items-center">
                <span className="mr-1">⚠</span>
                {errors.userType}
              </p>
            )}
          </div>

          {/* Username/Email Input */}
          <div>
            <label htmlFor="loginId" className="block text-sm font-medium text-gray-300 mb-2">
              {formData.userType === 'admin' ? 'Admin ID or Email *' : 'Username or Email *'}
            </label>
            <input
              type="text"
              id="loginId"
              name="loginId"
              value={formData.loginId}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={formData.userType === 'admin' ? 'Enter admin ID or email' : 'Enter your username or email'}
              className={`w-full px-4 py-3 bg-gray-800 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400 transition duration-200 ${
                errors.loginId && touched.loginId 
                  ? 'border-red-500' 
                  : 'border-gray-600'
              }`}
            />
            {errors.loginId && touched.loginId && (
              <p className="text-red-400 text-sm mt-1 flex items-center">
                <span className="mr-1">⚠</span>
                {errors.loginId}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              {formData.userType === 'admin' 
                ? 'Enter your administrator credentials' 
                : 'Enter the username or email you used to create your account'}
            </p>
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your password"
              className={`w-full px-4 py-3 bg-gray-800 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400 transition duration-200 ${
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
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-600 rounded bg-gray-800"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-300">
                Remember me
              </label>
            </div>
            
            <Link href="/forgot-password" className="text-sm text-green-400 hover:text-green-300">
              Forgot password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={hasErrors || !allFieldsFilled}
          >
            {formData.userType === 'admin' ? 'Login as Admin' : 'Login as User'}
          </button>
        </form>

        {/* Conditional redirect based on user type */}
        {formData.userType === 'user' && (
          <div className="text-center mt-6">
            <p className="text-sm text-gray-400">
              Don't have an account?{' '}
              <Link href="/SignUp" className="text-green-400 hover:text-green-300 font-semibold">
                Sign up here
              </Link>
            </p>
          </div>
        )}
        
        {formData.userType === 'admin' && (
          <div className="text-center mt-6">
            <p className="text-sm text-gray-400">
              Admin access requires proper authorization
            </p>
          </div>
        )}
      </div>
    </div>
  );
}