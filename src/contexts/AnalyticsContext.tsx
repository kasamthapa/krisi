'use client';

import React from 'react';
import { createContext, useContext, ReactNode } from 'react';
import { useProducts } from './ProductContext';
import { useOrders } from './OrderContext';

interface Analytics {
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  totalRevenue: number;
  urgentSales: number;
  averageDeliveryTime: number; // in days
  productsByCategory: Record<string, number>;
  ordersByStatus: Record<string, number>;
  recentTransactions: Array<{
    id: string;
    type: 'ORDER' | 'PRODUCT';
    amount?: number;
    status: string;
    date: Date;
  }>;
}

interface AnalyticsContextType {
  getAnalytics: () => Analytics;
}

const AnalyticsContext = createContext<AnalyticsContextType>({
  getAnalytics: () => ({
    totalProducts: 0,
    activeProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    urgentSales: 0,
    averageDeliveryTime: 0,
    productsByCategory: {},
    ordersByStatus: {},
    recentTransactions: [],
  }),
});

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const { products } = useProducts();
  const { orders } = useOrders();

  const getAnalytics = (): Analytics => {
    const activeProducts = products.filter(p => p.status === 'APPROVED');
    const completedOrders = orders.filter(o => o.status === 'DELIVERED');

    // Calculate average delivery time
    const deliveryTimes = completedOrders.map(order => {
      const orderDate = new Date(order.createdAt);
      const deliveryDate = new Date(); // In real app, would use actual delivery date
      return (deliveryDate.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24);
    });

    const avgDeliveryTime = deliveryTimes.length
      ? deliveryTimes.reduce((a, b) => a + b, 0) / deliveryTimes.length
      : 0;

    // Group products by category
    const categoryCount = products.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Group orders by status
    const orderStatusCount = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Get recent transactions
    const recentTransactions = [
      ...products.map(p => ({
        id: p.id,
        type: 'PRODUCT' as const,
        status: p.status,
        date: p.createdAt,
      })),
      ...orders.map(o => ({
        id: o.id,
        type: 'ORDER' as const,
        amount: o.totalPrice,
        status: o.status,
        date: o.createdAt,
      })),
    ]
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 10);

    return {
      totalProducts: products.length,
      activeProducts: activeProducts.length,
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + order.totalPrice, 0),
      urgentSales: products.filter(p => p.isUrgent).length,
      averageDeliveryTime: avgDeliveryTime,
      productsByCategory: categoryCount,
      ordersByStatus: orderStatusCount,
      recentTransactions,
    };
  };

  return (
    <AnalyticsContext.Provider value={{ getAnalytics }}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export const useAnalytics = () => useContext(AnalyticsContext); 