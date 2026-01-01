"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const API_BASE_URL = 'http://localhost:3001';

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [registrationError, setRegistrationError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({ ...prev, [name]: value }));
    setRegistrationError('');
    
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setRegistrationError('');
    setRegistrationSuccess(false);
    
    // Mark all fields as touched and validate
    const newTouched = { 
      firstName: true, 
      lastName: true, 
      email: true,
      password: true 
    };
    const newErrors = {
      firstName: validateField('firstName', formData.firstName),
      lastName: validateField('lastName', formData.lastName),
      email: validateField('email', formData.email),
      password: validateField('password', formData.password)
    };
    
    setTouched(newTouched);
    setErrors(newErrors);
    
    const isValid = !newErrors.firstName && !newErrors.lastName && 
                   !newErrors.email && !newErrors.password;
    
    if (isValid) {
      try {
        console.log('🚀 Starting registration process...');
        
        // Prepare data for backend - no normalization
        const submitData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email, // No normalization
          password: formData.password
        };

        console.log('📤 Sending registration data:', {
          ...submitData,
          password: '*'.repeat(submitData.password.length)
        });
        
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submitData),
        });

        const responseText = await response.text();
        let responseData;
        try {
          responseData = responseText ? JSON.parse(responseText) : {};
        } catch (parseError) {
          console.error('❌ JSON Parse error:', parseError);
          throw new Error('Invalid response from server');
        }

        if (!response.ok) {
          throw new Error(responseData.message || `Registration failed: ${response.status}`);
        }

        console.log('✅ Registration successful:', responseData);
        
        // Show success message
        setRegistrationSuccess(true);
        setRegistrationError('');

        // Auto-login after successful registration
        try {
          console.log('🔄 Attempting auto-login...');
          
          const loginResult = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: submitData.email, // No normalization
              password: submitData.password
            }),
          });

          if (!loginResult.ok) {
            throw new Error('Auto-login failed');
          }

          const loginData = await loginResult.json();
          
          console.log('✅ Auto-login successful:', loginData);
          
          // Store authentication data
          localStorage.setItem('token', loginData.access_token);
          localStorage.setItem('user', JSON.stringify(loginData.user));
          localStorage.setItem('loginTime', new Date().toISOString());
          
          console.log('📍 Redirecting to dashboard...');
          setTimeout(() => {
            router.push('/Dashboard');
          }, 2000);
          
        } catch (loginError: any) {
          console.log('⚠️ Auto-login failed, redirecting to login page:', loginError);
          setRegistrationError('Account created successfully! Please login with your email.');
          setTimeout(() => {
            router.push('/Login');
          }, 3000);
        }
        
      } catch (error: any) {
        console.error('❌ Registration error:', error);
        
        if (error.message.includes('Network error') || error.message.includes('Failed to fetch')) {
          setRegistrationError('Cannot connect to server. Please check if the backend is running on port 3001.');
        } else if (error.message.includes('409')) {
          setRegistrationError('Email already exists. Please use a different email.');
        } else if (error.message.includes('400')) {
          setRegistrationError('Invalid data provided. Please check your information.');
        } else {
          setRegistrationError(error.message || 'Registration failed. Please try again.');
        }
      }
    } else {
      setRegistrationError('Please fix the form errors above');
    }
    
    setIsLoading(false);
  };

  // Validation function
  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'firstName':
        if (!value) return 'First name is required';
        if (value.length < 2) return 'First name must be at least 2 characters';
        return '';
      
      case 'lastName':
        if (!value) return 'Last name is required';
        if (value.length < 2) return 'Last name must be at least 2 characters';
        return '';
      
      case 'email':
        if (!value) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
        return '';
      
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        return '';
      
      default:
        return '';
    }
  };

  // Check if all required fields are filled
  const requiredFieldsFilled = formData.firstName && formData.lastName && formData.email && formData.password;

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-4"
      style={{ backgroundImage: 'url("/Mechanic4.jpg")' }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>
      
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
          {/* Form fields remain the same as before, just removed normalization */}
          {/* ... rest of your form JSX ... */}
        </form>

        {/* Login Link */}
        <div className="text-center mt-6 pt-6 border-t border-gray-600">
          <p className="text-sm text-gray-400">
            Already have an account?{' '}
            <Link href="/Login" className="text-green-400 hover:text-green-300 font-semibold transition duration-200">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}