import React from 'react';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Expanded User interface for the platform
interface User {
  id: string;
  email: string;
  role: 'FARMER' | 'BUSINESS' | 'ADMIN' | 'PARTNER';
  name: string;
  businessName?: string;
  location?: string;
  phoneNumber?: string;
  verified?: boolean;
}

type Role = 'FARMER' | 'BUSINESS' | 'ADMIN' | 'PARTNER';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
  loading: boolean;
  isAuthenticated: boolean;
  isAuthorized: (roles: User['role'][]) => boolean;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: Role;
}

export const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Demo users for testing different roles
      const demoUsers = {
        'farmer@demo.com': {
          id: '1',
          email: 'farmer@demo.com',
          name: 'Demo Farmer',
          role: 'FARMER' as const,
          businessName: 'Green Fields Farm',
          location: 'Rural County',
          phoneNumber: '+1234567890',
          verified: true,
        },
        'business@demo.com': {
          id: '2',
          email: 'business@demo.com',
          name: 'Demo Business',
          role: 'BUSINESS' as const,
          businessName: 'Fresh Foods Market',
          location: 'City Center',
          phoneNumber: '+1987654321',
          verified: true,
        },
        'admin@demo.com': {
          id: '3',
          email: 'admin@demo.com',
          name: 'Demo Admin',
          role: 'ADMIN' as const,
          verified: true,
        },
      };

      // Demo authentication
      if (password === 'demo123' && email in demoUsers) {
        const userData = demoUsers[email as keyof typeof demoUsers];
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return;
      }
      throw new Error('Invalid credentials');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const isAuthorized = (roles: User['role'][]) => {
    return user ? roles.includes(user.role) : false;
  };

  const register = async (userData: RegisterData) => {
    // Implementation of register function
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        logout, 
        loading,
        isAuthenticated: !!user,
        isAuthorized,
        register
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 