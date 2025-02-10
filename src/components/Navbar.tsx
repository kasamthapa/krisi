'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              Farmer Market
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span>{user.name}</span>
                <button 
                  onClick={logout}
                  className="text-sm text-gray-700 hover:text-gray-900"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                href="/login"
                className="text-sm text-gray-700 hover:text-gray-900"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 