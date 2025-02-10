'use client';

import React from 'react';
import { createContext, useContext, useState, ReactNode } from 'react';
import { usePayments } from './PaymentContext';
import { useAuth } from './AuthContext';

interface Order {
  id: string;
  productId: string;
  buyerId: string;
  sellerId: string;
  quantity: number;
  total: number;
  totalPrice: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  paymentStatus: string;
  deliveryAddress: string;
  urgentDelivery: boolean;
}

interface OrderFilters {
  buyerId?: string;
  sellerId?: string;
  status?: string;
  id?: string;
}

interface OrderContextType {
  createOrder: (data: OrderData) => Promise<void>;
  updateOrderStatus: (id: string, status: string) => Promise<void>;
  getOrders: (filters?: OrderFilters) => Promise<Order[]>;
}

interface OrderData {
  productId: string;
  quantity: number;
  total: number;
}

const OrderContext = createContext<OrderContextType>({
  createOrder: async () => {},
  updateOrderStatus: async () => {},
  getOrders: async () => [],
});

// Demo orders
const demoOrders: Order[] = [
  {
    id: '1',
    productId: '1',
    buyerId: '2',
    sellerId: '1',
    quantity: 50,
    total: 125,
    totalPrice: 125,
    status: 'DELIVERED',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    paymentStatus: 'PAID',
    deliveryAddress: 'City Center Market',
    urgentDelivery: false,
  },
];

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(demoOrders);
  const { getPaymentByOrder, releasePayment } = usePayments();
  const { user } = useAuth();

  const createOrder = async (data: OrderData) => {
    const newOrder: Order = {
      ...data,
      id: (orders.length + 1).toString(),
      buyerId: user?.id ?? '',  // You'll need to get this from AuthContext
      sellerId: '',  // You'll need to get this from the product
      status: 'PENDING',
      totalPrice: data.total,
      createdAt: new Date(),
      updatedAt: new Date(),
      paymentStatus: 'PENDING',
      deliveryAddress: '',  // You'll need to get this from the order form
      urgentDelivery: false
    };
    setOrders([...orders, newOrder]);
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        // If order is delivered, release the payment from escrow
        if (status === 'DELIVERED') {
          const payment = getPaymentByOrder(orderId);
          if (payment) {
            releasePayment(payment.id);
          }
        }
        return { ...order, status };
      }
      return order;
    }));
  };

  const updatePaymentStatus = async (orderId: string, paymentStatus: Order['paymentStatus']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, paymentStatus } : order
    ));
  };

  const getOrdersByBuyer = (buyerId: string) => {
    return orders.filter(order => order.buyerId === buyerId);
  };

  const getOrdersBySeller = (sellerId: string) => {
    return orders.filter(order => order.sellerId === sellerId);
  };

  const getOrders = async (filters?: OrderFilters) => {
    // Implementation of getOrders function
    return orders;
  };

  return (
    <OrderContext.Provider 
      value={{
        createOrder,
        updateOrderStatus,
        getOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export const useOrders = () => useContext(OrderContext); 