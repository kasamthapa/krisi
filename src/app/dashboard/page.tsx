'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useProducts } from '@/contexts/ProductContext';
import { useOrders } from '@/contexts/OrderContext';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { getProducts } = useProducts();
  const { getOrders } = useOrders();
  
  const [stats, setStats] = useState({
    totalProducts: 0,
    pendingProducts: 0,
    activeOrders: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    async function loadStats() {
      if (!user) return;

      const products = await getProducts({ sellerId: user.id });
      const orders = await getOrders({ sellerId: user.id });

      setStats({
        totalProducts: products.length,
        pendingProducts: products.filter(p => p.status === 'PENDING').length,
        activeOrders: orders.filter(o => o.status !== 'DELIVERED').length,
        totalRevenue: orders
          .filter(o => o.status === 'DELIVERED')
          .reduce((sum, order) => sum + order.total, 0),
      });
    }

    loadStats();
  }, [user]);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Products" 
          value={stats.totalProducts} 
          description="Products listed" 
        />
        <StatCard 
          title="Pending Products" 
          value={stats.pendingProducts} 
          description="Awaiting approval" 
        />
        <StatCard 
          title="Active Orders" 
          value={stats.activeOrders} 
          description="Orders in progress" 
        />
        <StatCard 
          title="Total Revenue" 
          value={`$${stats.totalRevenue.toFixed(2)}`} 
          description="From completed orders" 
        />
      </div>
    </div>
  );
}

function StatCard({ 
  title, 
  value, 
  description 
}: { 
  title: string;
  value: string | number;
  description: string;
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
  );
} 