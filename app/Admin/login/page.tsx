"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Simple authentication - in real app, use secure authentication
    if (username === 'admin' && password === 'admin123') {
      try {
        // Ensure localStorage is available
        if (typeof window !== 'undefined') {
          localStorage.setItem('adminAuthenticated', 'true');
          // Add a small delay to ensure the value is set
          setTimeout(() => {
            router.push('/Admin/Dashboard');
          }, 100);
        }
      } catch (err) {
        setError('Failed to save authentication');
      }
    } else {
      setError('Invalid credentials');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
      <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-md border border-gray-700">
        <h1 className="text-3xl font-bold text-white text-center mb-6">Admin Login</h1>
         <Link href="/Services" className="text-blue-400 hover:text-blue-300 mb-2 inline-block">
                    ← Back to Services
        </Link>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
              placeholder="Enter username"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
              placeholder="Enter password"
              required
            />
          </div>
          
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="text-center mt-4">
          <p className="text-gray-400 text-sm">Default: admin / admin123</p>
        </div>
      </div>
    </div>
  );
}