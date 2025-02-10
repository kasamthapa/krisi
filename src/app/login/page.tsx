'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, user } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      const dashboardRoutes = {
        FARMER: '/dashboard/farmer',
        BUSINESS: '/dashboard/business',
        ADMIN: '/dashboard/admin',
        PARTNER: '/dashboard/partner',
      };
      router.push(dashboardRoutes[user.role]);
    } catch (error) {
      alert('Login failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md p-8 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">Login to Farmer Market Platform</h1>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Login
        </button>

        <div className="mt-4 text-sm text-gray-600">
          <p>Demo Accounts:</p>
          <ul className="list-disc pl-5 mt-2">
            <li>Farmer: farmer@demo.com</li>
            <li>Business: business@demo.com</li>
            <li>Admin: admin@demo.com</li>
            <li>Password for all: demo123</li>
          </ul>
        </div>
      </form>
    </div>
  );
} 