"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const API_BASE_URL = 'http://localhost:3001';

export default function ForgotPassword() {
  const [step, setStep] = useState<'identify' | 'verify' | 'success'>('identify');
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    resetCode: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const router = useRouter();

  // Step 1: Identify user and send reset code
  const handleIdentifyUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!formData.emailOrUsername.trim()) {
      setError('Please enter your email or username');
      setIsLoading(false);
      return;
    }

    try {
      console.log('🔐 Initiating password reset for:', formData.emailOrUsername);

      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailOrUsername: formData.emailOrUsername.trim()
        }),
      });

      console.log('📡 Response status:', response.status);
      
      const responseText = await response.text();
      console.log('📡 Raw response:', responseText);
      
      let responseData;
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch {
        throw new Error('Invalid response from server');
      }

      console.log('📡 Parsed response:', responseData);

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to send reset code');
      }

      console.log('✅ Reset code sent successfully');
      
      // Store the identifier for the next step
      setResetEmail(formData.emailOrUsername);
      
      // Show success message (backend doesn't reveal if user exists for security)
      setSuccess('If an account exists, a reset code has been sent.');
      
      // Move to verification step
      setTimeout(() => {
        setStep('verify');
        setSuccess('');
      }, 2000);
      
    } catch (error: any) {
      console.error('❌ Password reset initiation error:', error);
      setError(error.message || 'Failed to send reset code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify reset code and set new password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate passwords
    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (!formData.resetCode.trim()) {
      setError('Please enter the reset code');
      setIsLoading(false);
      return;
    }

    try {
      console.log('🔐 Resetting password for:', resetEmail);

      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailOrUsername: resetEmail,
          resetCode: formData.resetCode.trim(),
          newPassword: formData.newPassword
        }),
      });

      console.log('📡 Response status:', response.status);
      
      const responseText = await response.text();
      console.log('📡 Raw response:', responseText);
      
      let responseData;
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch {
        throw new Error('Invalid response from server');
      }

      console.log('📡 Parsed response:', responseData);

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error(responseData.message || 'Invalid or expired reset code');
        } else {
          throw new Error(responseData.message || 'Failed to reset password');
        }
      }

      console.log('✅ Password reset successful');
      
      setSuccess('Password reset successfully! Redirecting to login...');
      setStep('success');
      
      // Redirect to login after delay
      setTimeout(() => {
        router.push('/Login');
      }, 3000);
      
    } catch (error: any) {
      console.error('❌ Password reset error:', error);
      setError(error.message || 'Failed to reset password. Please try again.');
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
    // Clear errors when user starts typing
    if (error) setError('');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleBackToIdentify = () => {
    setStep('identify');
    setError('');
    setSuccess('');
    setFormData(prev => ({
      ...prev,
      resetCode: '',
      newPassword: '',
      confirmPassword: ''
    }));
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    const password = formData.newPassword;
    if (password.length === 0) return { strength: 0, text: '', color: 'bg-gray-500' };
    
    let strength = 0;
    let text = 'Very Weak';
    let color = 'bg-red-500';

    if (password.length >= 6) strength += 25;
    if (password.length >= 8) strength += 25;
    if (/(?=.*[a-z])/.test(password)) strength += 25;
    if (/(?=.*[A-Z])/.test(password)) strength += 10;
    if (/(?=.*\d)/.test(password)) strength += 25;
    if (/(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/.test(password)) strength += 15;

    strength = Math.min(strength, 100);

    if (strength < 40) {
      text = 'Weak';
      color = 'bg-red-500';
    } else if (strength < 70) {
      text = 'Fair';
      color = 'bg-yellow-500';
    } else if (strength < 90) {
      text = 'Good';
      color = 'bg-blue-500';
    } else {
      text = 'Strong';
      color = 'bg-green-500';
    }

    return { strength, text, color };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-4"
      style={{ backgroundImage: 'url("/Mechanic4.jpg")' }}>
      
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
          <p className="text-gray-300 mt-2">
            {step === 'identify' && 'Reset Your Password'}
            {step === 'verify' && 'Enter Reset Code'}
            {step === 'success' && 'Password Reset Successful'}
          </p>
          <div className="flex justify-center space-x-2 mt-4">
            <div className={`w-3 h-3 rounded-full ${step === 'identify' ? 'bg-green-500' : 'bg-gray-600'}`}></div>
            <div className={`w-3 h-3 rounded-full ${step === 'verify' ? 'bg-green-500' : 'bg-gray-600'}`}></div>
            <div className={`w-3 h-3 rounded-full ${step === 'success' ? 'bg-green-500' : 'bg-gray-600'}`}></div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-4 bg-green-900/50 border border-green-500 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-green-400 text-sm">
                {success}
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-900/50 border border-red-500 rounded-lg p-3">
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

        {/* Step 1: Identify User */}
        {step === 'identify' && (
          <form onSubmit={handleIdentifyUser} className="space-y-4">
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
              />
            </div>

            <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <svg className="w-5 h-5 text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-blue-400 text-sm font-semibold">Reset Code</p>
                  <p className="text-blue-300 text-xs mt-1">
                    A 6-digit reset code will be sent to your email. Check your inbox and spam folder.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending Reset Code...</span>
                </>
              ) : (
                <span>Send Reset Code</span>
              )}
            </button>
          </form>
        )}

        {/* Step 2: Verify Reset Code and Set New Password */}
        {step === 'verify' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Reset Code *
              </label>
              <input
                type="text"
                name="resetCode"
                value={formData.resetCode}
                onChange={handleInputChange}
                placeholder="Enter 6-digit code"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400 transition duration-200 text-center text-lg tracking-widest"
                required
                disabled={isLoading}
                maxLength={6}
              />
              <p className="text-gray-400 text-xs mt-1 text-center">
                Check your email for the 6-digit reset code
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                New Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="Enter new password"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400 transition duration-200 pr-12"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 focus:outline-none transition duration-200 p-1"
                  disabled={isLoading}
                >
                  {showPassword ? '🔒' : '👁️'}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {formData.newPassword && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Password strength:</span>
                    <span className={`${
                      passwordStrength.strength < 40 ? 'text-red-400' :
                      passwordStrength.strength < 70 ? 'text-yellow-400' :
                      passwordStrength.strength < 90 ? 'text-blue-400' : 'text-green-400'
                    }`}>
                      {passwordStrength.text}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${passwordStrength.strength}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm New Password *
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm new password"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400 transition duration-200"
                required
                disabled={isLoading}
              />
            </div>

            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handleBackToIdentify}
                disabled={isLoading}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Resetting...</span>
                  </>
                ) : (
                  <span>Reset Password</span>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Success */}
        {step === 'success' && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h3 className="text-xl font-semibold text-white">Password Reset Successful!</h3>
            <p className="text-gray-300">
              Your password has been reset successfully. You can now login with your new password.
            </p>
            
            <button
              onClick={() => router.push('/Login')}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 mt-4"
            >
              Go to Login
            </button>
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-50 rounded-2xl flex items-center justify-center">
            <div className="text-white text-center">
              <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-sm">
                {step === 'identify' ? 'Sending reset code...' : 'Resetting password...'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}