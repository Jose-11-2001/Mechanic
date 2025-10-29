"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: ''
  });
  
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    username: false,
    email: false,
    password: false
  });

  // Validation rules
  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'firstName':
        if (!value) return 'First name is required';
        if (value.length < 2) return 'First name must be at least 2 characters';
        if (value.length > 50) return 'First name must be less than 50 characters';
        if (!/^[a-zA-Z\s]+$/.test(value)) return 'First name can only contain letters and spaces';
        return '';
      
      case 'lastName':
        if (!value) return 'Last name is required';
        if (value.length < 2) return 'Last name must be at least 2 characters';
        if (value.length > 50) return 'Last name must be less than 50 characters';
        if (!/^[a-zA-Z\s]+$/.test(value)) return 'Last name can only contain letters and spaces';
        return '';
      
      case 'username':
        if (!value) return 'Username is required';
        if (value.length < 3) return 'Username must be at least 3 characters';
        if (value.length > 30) return 'Username must be less than 30 characters';
        if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Username can only contain letters, numbers, and underscores';
        return '';
      
      case 'email':
        // Email is now optional, but if provided, must be valid
        if (value && value.length > 100) return 'Email must be less than 100 characters';
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
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
    const newTouched = { 
      firstName: true, 
      lastName: true, 
      username: true, 
      email: true,
      password: true 
    };
    const newErrors = {
      firstName: validateField('firstName', formData.firstName),
      lastName: validateField('lastName', formData.lastName),
      username: validateField('username', formData.username),
      email: validateField('email', formData.email),
      password: validateField('password', formData.password)
    };
    
    setTouched(newTouched);
    setErrors(newErrors);
    
    // Check if form is valid (email is now optional)
    const isValid = !newErrors.firstName && !newErrors.lastName && 
                   !newErrors.username && !newErrors.password;
    
    if (isValid) {
      // Submit the form (add your API call here)
      const submitData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        email: formData.email || null, // Send null if email is empty
        password: formData.password
      };
      
      console.log('Form is valid, submitting:', submitData);
      alert('Account created successfully!');
      
      // Add your signup logic here
      
      // Reset form after successful submission
      setFormData({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: ''
      });
      setTouched({
        firstName: false,
        lastName: false,
        username: false,
        email: false,
        password: false
      });
    } else {
      console.log('Form has errors');
    }
  };

  // Check if form has any errors (excluding email since it's optional)
  const hasErrors = errors.firstName || errors.lastName || errors.username || errors.password;
  
  // Check if all required fields are filled (email is optional)
  const requiredFieldsFilled = formData.firstName && formData.lastName && formData.username && formData.password;

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-4"
      style={{ backgroundImage: 'url("/Mechanic4.jpg")' }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>
      
      {/* Signup Card */}
      <div className="relative z-10 bg-gray-900 bg-opacity-90 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-700">
        {/* Back Arrow */}
        <Link href="/Login">
          <button className="absolute top-4 left-4 text-gray-300 hover:text-white transition duration-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">BODE AUTOMOTIVES</h1>
          <p className="text-gray-300 mt-2">Create your account</p>
          <p className="text-sm text-green-400 mt-1">Use username or email to sign up</p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* First Name Input */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
              First Name *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your first name"
              className={`w-full px-4 py-3 bg-gray-800 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400 transition duration-200 ${
                errors.firstName && touched.firstName 
                  ? 'border-red-500' 
                  : 'border-gray-600'
              }`}
            />
            {errors.firstName && touched.firstName && (
              <p className="text-red-400 text-sm mt-1 flex items-center">
                <span className="mr-1">⚠</span>
                {errors.firstName}
              </p>
            )}
          </div>

          {/* Last Name Input */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
              Last Name *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your last name"
              className={`w-full px-4 py-3 bg-gray-800 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400 transition duration-200 ${
                errors.lastName && touched.lastName 
                  ? 'border-red-500' 
                  : 'border-gray-600'
              }`}
            />
            {errors.lastName && touched.lastName && (
              <p className="text-red-400 text-sm mt-1 flex items-center">
                <span className="mr-1">⚠</span>
                {errors.lastName}
              </p>
            )}
          </div>

          {/* Username Input */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
              Username *
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Choose a username"
              className={`w-full px-4 py-3 bg-gray-800 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400 transition duration-200 ${
                errors.username && touched.username 
                  ? 'border-red-500' 
                  : 'border-gray-600'
              }`}
            />
            {errors.username && touched.username && (
              <p className="text-red-400 text-sm mt-1 flex items-center">
                <span className="mr-1">⚠</span>
                {errors.username}
              </p>
            )}
            
          </div>

          {/* Email Input - Now Optional */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email Address <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your email (optional)"
              className={`w-full px-4 py-3 bg-gray-800 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400 transition duration-200 ${
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
              Password *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Create a password"
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
            <div className="mt-2 text-xs text-gray-400">
              <p>Password must be at least 6 characters long</p>
              <div className="flex items-center mt-1">
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      formData.password.length >= 6 ? 'bg-green-400' : 'bg-gray-500'
                    }`}
                    style={{ width: `${Math.min((formData.password.length / 6) * 100, 100)}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-xs text-gray-400">
                  {formData.password.length}/6
                </span>
              </div>
            </div>
          </div>

          {/* Create Account Button */}
          <Link href="\Login">
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-4"
            disabled={!!hasErrors || !requiredFieldsFilled}
          >
            Create Account
          </button>
          </Link>
        </form>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-400">
            Already have an account?{' '}
            <Link href="/Login" className="text-green-400 hover:text-green-300 font-semibold">
              Login here
            </Link>
          </p>
          <p className="text-xs text-gray-500 mt-2">
            You can login with your username or email
          </p>
        </div>
      </div>
    </div>
  );
}