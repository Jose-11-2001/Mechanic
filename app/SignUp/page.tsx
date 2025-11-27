"use client";
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// API Configuration
const API_BASE_URL = 'http://localhost:3001';

// Updated Auth Service to match backend DTOs
const authService = {
  async register(userData: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Registration failed: ${response.status}`);
    }

    return await response.json();
  },

  // FIXED: Updated to match backend LoginDto which expects either username OR email
  async login(credentials: { username?: string; email?: string; password: string }) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || 'Invalid credentials');
    }

    return await response.json();
  },
};

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: ['', '', '', '', '', '']
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

  const [isLoading, setIsLoading] = useState(false);
  const [registrationError, setRegistrationError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const router = useRouter();

  // Refs for password inputs
  const passwordRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Initialize refs
  useEffect(() => {
    passwordRefs.current = passwordRefs.current.slice(0, 6);
  }, []);

  // Fixed ref callback function
  const setPasswordRef = (index: number) => (el: HTMLInputElement | null) => {
    passwordRefs.current[index] = el;
  };

  // Validation rules
  const validateField = (name: string, value: string | string[]) => {
    switch (name) {
      case 'firstName':
        if (!value) return 'First name is required';
        if ((value as string).length < 2) return 'First name must be at least 2 characters';
        if ((value as string).length > 50) return 'First name must be less than 50 characters';
        if (!/^[a-zA-Z\s\-']+$/.test(value as string)) return 'First name can only contain letters, spaces, hyphens, and apostrophes';
        return '';
      
      case 'lastName':
        if (!value) return 'Last name is required';
        if ((value as string).length < 2) return 'Last name must be at least 2 characters';
        if ((value as string).length > 50) return 'Last name must be less than 50 characters';
        if (!/^[a-zA-Z\s\-']+$/.test(value as string)) return 'Last name can only contain letters, spaces, hyphens, and apostrophes';
        return '';
      
      case 'username':
        if (!value) return 'Username is required';
        if ((value as string).length < 3) return 'Username must be at least 3 characters';
        if ((value as string).length > 30) return 'Username must be less than 30 characters';
        if (!/^[a-zA-Z0-9_]+$/.test(value as string)) return 'Username can only contain letters, numbers, and underscores';
        return '';
      
      case 'email':
        if (!value) return 'Email is required';
        if ((value as string).length > 100) return 'Email must be less than 100 characters';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value as string)) return 'Please enter a valid email address';
        return '';
      
      case 'password':
        const passwordString = Array.isArray(value) ? value.join('') : value;
        if (!passwordString) return 'Password is required';
        if (passwordString.length !== 6) return 'Password must be exactly 6 characters';
        return '';
      
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Auto-format fields
    let processedValue = value;
    if (name === 'username') {
      processedValue = value.toLowerCase().replace(/\s+/g, '');
    }
    if (name === 'email') {
      processedValue = value.toLowerCase().trim();
    }
    
    setFormData(prev => ({ ...prev, [name]: processedValue }));
    setRegistrationError('');
    
    if (touched[name as keyof typeof touched]) {
      setErrors(prev => ({ 
        ...prev, 
        [name]: validateField(name, processedValue) 
      }));
    }
  };

  // Handle password digit input
  const handlePasswordChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.charAt(0);
    }

    const newPassword = [...formData.password];
    newPassword[index] = value;
    
    setFormData(prev => ({ ...prev, password: newPassword }));
    setRegistrationError('');

    // Auto-focus next input
    if (value && index < 5) {
      passwordRefs.current[index + 1]?.focus();
    }

    // Validate password when all fields are filled
    if (newPassword.every(char => char !== '')) {
      setErrors(prev => ({ 
        ...prev, 
        password: validateField('password', newPassword) 
      }));
    }
  };

  // Handle backspace in password inputs
  const handlePasswordKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !formData.password[index] && index > 0) {
      passwordRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste in password inputs
  const handlePasswordPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    
    const newPassword = [...formData.password];
    for (let i = 0; i < Math.min(pastedData.length, 6); i++) {
      newPassword[i] = pastedData[i];
    }
    
    setFormData(prev => ({ ...prev, password: newPassword }));
    
    const nextEmptyIndex = newPassword.findIndex(char => char === '');
    if (nextEmptyIndex !== -1) {
      passwordRefs.current[nextEmptyIndex]?.focus();
    } else {
      passwordRefs.current[5]?.focus();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setRegistrationError('');
    setRegistrationSuccess(false);
    
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
    
    const isValid = !newErrors.firstName && !newErrors.lastName && 
                   !newErrors.username && !newErrors.email && !newErrors.password;
    
    if (isValid) {
      try {
        console.log('🚀 Starting registration process...');
        
        // Combine password array into string
        const passwordString = formData.password.join('');
        
        // Prepare data for backend
        const submitData = {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          username: formData.username.trim(),
          email: formData.email.trim(),
          password: passwordString
        };

        console.log('📤 Sending registration data:', {
          ...submitData,
          password: '*'.repeat(passwordString.length)
        });
        
        // Use the auth service for registration
        const registrationResult = await authService.register(submitData);
        
        console.log('✅ Registration successful:', registrationResult);
        
        // Show success message
        setRegistrationSuccess(true);
        setRegistrationError('');

        // FIXED: Auto-login using username (matches backend LoginDto)
        try {
          console.log('🔄 Attempting auto-login...');
          
          // Use username for login as per your backend LoginDto
          const loginResult = await authService.login({
            username: submitData.username, // Send username instead of usernameOrEmail
            password: submitData.password
          });
          
          console.log('✅ Auto-login successful:', loginResult);
          
          // Store authentication data
          if (loginResult.access_token) {
            localStorage.setItem('token', loginResult.access_token);
            console.log('🔑 Token stored in localStorage');
          }
          if (loginResult.user) {
            localStorage.setItem('user', JSON.stringify(loginResult.user));
            console.log('👤 User data stored');
          }

          // Store login timestamp
          localStorage.setItem('loginTime', new Date().toISOString());
          
          console.log('📍 Redirecting to dashboard...');
          setTimeout(() => {
            router.push('/dashboard');
          }, 2000);
          
        } catch (loginError: any) {
          console.log('⚠️ Auto-login failed, redirecting to login page:', loginError);
          setRegistrationError('Account created successfully! Please login with your username.');
          setTimeout(() => {
            router.push('/Login');
          }, 3000);
        }
        
        // Reset form after successful submission
        setTimeout(() => {
          setFormData({
            firstName: '',
            lastName: '',
            username: '',
            email: '',
            password: ['', '', '', '', '', '']
          });
          setTouched({
            firstName: false,
            lastName: false,
            username: false,
            email: false,
            password: false
          });
        }, 1000);
        
      } catch (error: any) {
        console.error('❌ Registration error:', error);
        
        // More specific error messages
        if (error.message.includes('Network error') || error.message.includes('Failed to fetch')) {
          setRegistrationError('Cannot connect to server. Please check if the backend is running on port 3001.');
        } else if (error.message.includes('409')) {
          if (error.message.toLowerCase().includes('username')) {
            setRegistrationError('Username already exists. Please choose a different username.');
          } else if (error.message.toLowerCase().includes('email')) {
            setRegistrationError('Email already exists. Please use a different email.');
          } else {
            setRegistrationError('Username or email already exists. Please choose different credentials.');
          }
        } else if (error.message.includes('400')) {
          setRegistrationError('Invalid data provided. Please check your information.');
        } else if (error.message.includes('422')) {
          setRegistrationError('Validation failed. Please check your input format.');
        } else {
          setRegistrationError(error.message || 'Registration failed. Please try again.');
        }
      }
    } else {
      setRegistrationError('Please fix the form errors above');
    }
    
    setIsLoading(false);
  };

  // Check if form has any errors
  const hasErrors = errors.firstName || errors.lastName || errors.username || errors.email || errors.password;
  
  // Check if all required fields are filled
  const requiredFieldsFilled = formData.firstName && formData.lastName && formData.username && formData.email && formData.password.every(char => char !== '');

  // Get current password as string for display
  const passwordString = formData.password.join('');

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
          <p className="text-sm text-green-400 mt-1">All fields are required</p>
        </div>

        {/* Success Message */}
        {registrationSuccess && (
          <div className="mb-4 bg-green-900/50 border border-green-500 rounded-lg p-3 animate-pulse">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-green-400 text-sm">
                Account created successfully! Redirecting...
              </p>
            </div>
          </div>
        )}

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
              disabled={isLoading}
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
              disabled={isLoading}
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
              placeholder="Choose a username (3-30 characters)"
              className={`w-full px-4 py-3 bg-gray-800 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400 transition duration-200 ${
                errors.username && touched.username 
                  ? 'border-red-500' 
                  : 'border-gray-600'
              }`}
              disabled={isLoading}
            />
            {errors.username && touched.username && (
              <p className="text-red-400 text-sm mt-1 flex items-center">
                <span className="mr-1">⚠</span>
                {errors.username}
              </p>
            )}
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your email address"
              className={`w-full px-4 py-3 bg-gray-800 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400 transition duration-200 ${
                errors.email && touched.email 
                  ? 'border-red-500' 
                  : 'border-gray-600'
              }`}
              disabled={isLoading}
            />
            {errors.email && touched.email && (
              <p className="text-red-400 text-sm mt-1 flex items-center">
                <span className="mr-1">⚠</span>
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Input - 6 Individual Digits */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password - Enter 6 characters *
            </label>
            <div className="flex space-x-2 justify-center mb-2">
              {formData.password.map((digit, index) => (
                <input
                  key={index}
                  ref={setPasswordRef(index)}
                  type={showPassword ? "text" : "password"}
                  value={digit}
                  onChange={(e) => handlePasswordChange(index, e.target.value)}
                  onKeyDown={(e) => handlePasswordKeyDown(index, e)}
                  onPaste={handlePasswordPaste}
                  className="w-12 h-12 text-center bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white text-xl font-semibold transition duration-200"
                  maxLength={1}
                  disabled={isLoading}
                  inputMode="text"
                  pattern="[0-9a-zA-Z]*"
                  title="Enter any character (letter or number)"
                />
              ))}
            </div>
            
            {/* Password visibility toggle */}
            <div className="flex items-center justify-center space-x-2 mt-2">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-white transition duration-200 text-sm flex items-center space-x-1"
                disabled={isLoading}
              >
                {showPassword ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m9.02 9.02l3.411 3.411M9.88 9.88l-3.41-3.41m9.02 9.02l-3.41 3.41" />
                    </svg>
                    <span>Hide Password</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>Show Password</span>
                  </>
                )}
              </button>
            </div>

            {/* Password Preview */}
            {passwordString && (
              <div className="mt-2 text-center">
                <p className="text-xs text-gray-400">
                  Your password: <span className="font-mono bg-gray-800 px-2 py-1 rounded">{showPassword ? passwordString : '••••••'}</span>
                </p>
              </div>
            )}

            {errors.password && touched.password && (
              <p className="text-red-400 text-sm mt-1 flex items-center justify-center">
                <span className="mr-1">⚠</span>
                {errors.password}
              </p>
            )}
            
            {/* Password Instructions */}
            <div className="mt-2 text-center">
              <p className="text-xs text-gray-400">
                Enter any 6 characters - numbers, letters, or both
              </p>
            </div>
          </div>

          {/* Registration Error */}
          {registrationError && !registrationSuccess && (
            <div className="bg-red-900/50 border border-red-500 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-400 text-sm">
                  {registrationError}
                </p>
              </div>
            </div>
          )}

          {/* Create Account Button */}
          <button
            type="submit"
            disabled={!!hasErrors || !requiredFieldsFilled || isLoading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-4 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-600"></div>
          <span className="px-3 text-gray-400 text-sm">OR</span>
          <div className="flex-1 border-t border-gray-600"></div>
        </div>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-sm text-gray-400">
            Already have an account?{' '}
            <Link href="/Login" className="text-green-400 hover:text-green-300 font-semibold transition duration-200">
              Login here
            </Link>
          </p>
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-50 rounded-2xl flex items-center justify-center">
            <div className="text-white text-center">
              <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-sm">Creating your account...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}