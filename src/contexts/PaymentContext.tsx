'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface Payment {
  id: string;
  orderId: string;
  amount: number;
  status: 'PENDING' | 'HELD' | 'RELEASED' | 'REFUNDED';
  createdAt: Date;
  updatedAt: Date;
  paymentMethod: 'BANK_TRANSFER' | 'CASH' | 'DIGITAL_WALLET';
  escrowReleaseDate?: Date;
}

interface PaymentContextType {
  payments: Payment[];
  createPayment: (orderId: string, amount: number, paymentMethod: Payment['paymentMethod']) => Promise<void>;
  releasePayment: (paymentId: string) => Promise<void>;
  refundPayment: (paymentId: string) => Promise<void>;
  getPaymentByOrder: (orderId: string) => Payment | undefined;
  getPaymentsByBuyer: (buyerId: string) => Payment[];
  getPaymentsBySeller: (sellerId: string) => Payment[];
}

const PaymentContext = createContext<PaymentContextType>({
  payments: [],
  createPayment: async () => {},
  releasePayment: async () => {},
  refundPayment: async () => {},
  getPaymentByOrder: () => undefined,
  getPaymentsByBuyer: () => [],
  getPaymentsBySeller: () => [],
});

// Demo payments
const demoPayments: Payment[] = [
  {
    id: '1',
    orderId: '1',
    amount: 125,
    status: 'RELEASED',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    paymentMethod: 'BANK_TRANSFER',
    escrowReleaseDate: new Date('2024-02-03'),
  },
];

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [payments, setPayments] = useState<Payment[]>(demoPayments);

  const createPayment = async (
    orderId: string,
    amount: number,
    paymentMethod: Payment['paymentMethod']
  ) => {
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newPayment: Payment = {
      id: (payments.length + 1).toString(),
      orderId,
      amount,
      status: 'HELD',
      createdAt: new Date(),
      updatedAt: new Date(),
      paymentMethod,
      // Set escrow release date to 2 days from now
      escrowReleaseDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    };

    setPayments([...payments, newPayment]);
  };

  const releasePayment = async (paymentId: string) => {
    setPayments(payments.map(payment =>
      payment.id === paymentId
        ? { ...payment, status: 'RELEASED', updatedAt: new Date() }
        : payment
    ));
  };

  const refundPayment = async (paymentId: string) => {
    setPayments(payments.map(payment =>
      payment.id === paymentId
        ? { ...payment, status: 'REFUNDED', updatedAt: new Date() }
        : payment
    ));
  };

  const getPaymentByOrder = (orderId: string) => {
    return payments.find(payment => payment.orderId === orderId);
  };

  const getPaymentsByBuyer = (buyerId: string) => {
    // In a real app, we'd have buyerId in the payment record
    // For demo, we'll just return all payments
    return payments;
  };

  const getPaymentsBySeller = (sellerId: string) => {
    // In a real app, we'd have sellerId in the payment record
    // For demo, we'll just return all payments
    return payments;
  };

  return (
    <PaymentContext.Provider
      value={{
        payments,
        createPayment,
        releasePayment,
        refundPayment,
        getPaymentByOrder,
        getPaymentsByBuyer,
        getPaymentsBySeller,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
}

export const usePayments = () => useContext(PaymentContext); 