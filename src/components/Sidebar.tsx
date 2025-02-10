'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export function Sidebar() {
  const { user } = useAuth();

  const farmerLinks = [
    { href: '/dashboard', label: 'Overview' },
    { href: '/dashboard/products', label: 'My Products' },
    { href: '/dashboard/orders', label: 'Orders' },
  ];

  const businessLinks = [
    { href: '/dashboard', label: 'Overview' },
    { href: '/dashboard/marketplace', label: 'Marketplace' },
    { href: '/dashboard/orders', label: 'My Orders' },
  ];

  const adminLinks = [
    { href: '/dashboard', label: 'Overview' },
    { href: '/dashboard/quality', label: 'Quality Control' },
    { href: '/dashboard/users', label: 'Users' },
  ];

  const links = user?.role === 'FARMER' ? farmerLinks :
               user?.role === 'BUSINESS' ? businessLinks :
               user?.role === 'ADMIN' ? adminLinks : [];

  return (
    <aside className="w-64 bg-white shadow-sm min-h-screen">
      <nav className="mt-5 px-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="mt-1 group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
} 