'use client';

import React from 'react';
import { useState } from 'react';
import { useOrders } from '@/contexts/OrderContext';
import { useAuth } from '@/contexts/AuthContext';
import PaymentForm from './PaymentForm';

interface OrderFormProps {
  productId: string;
  sellerId: string;
  pricePerUnit: number;
  availableQuantity: number;
  unit: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

type OrderStep = 'DETAILS' | 'PAYMENT';

export default function OrderForm({
  productId,
  sellerId,
  pricePerUnit,
  availableQuantity,
  unit,
  onSuccess,
  onCancel,
}: OrderFormProps) {
  const { user } = useAuth();
  const { createOrder } = useOrders();
  const [step, setStep] = useState<OrderStep>('DETAILS');
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState('');
  const [urgentDelivery, setUrgentDelivery] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const totalAmount = quantity * pricePerUnit;

  const handleSubmitDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const order = await createOrder({
        productId,
        sellerId,
        buyerId: user.id,
        quantity,
        totalPrice: totalAmount,
        deliveryAddress: address,
        urgentDelivery,
      });
      setOrderId(order.id);
      setStep('PAYMENT');
    } catch (error) {
      console.error('Order error:', error);
      alert('Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    onSuccess?.();
  };

  if (step === 'PAYMENT' && orderId) {
    return (
      <PaymentForm
        orderId={orderId}
        amount={totalAmount}
        onSuccess={handlePaymentSuccess}
        onCancel={onCancel}
      />
    );
  }

  return (
    <form onSubmit={handleSubmitDetails} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Quantity ({unit})</label>
        <input
          type="number"
          min="1"
          max={availableQuantity}
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Delivery Address</label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          required
        />
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={urgentDelivery}
            onChange={(e) => setUrgentDelivery(e.target.checked)}
            className="rounded border-gray-300"
          />
          <span className="ml-2 text-sm text-gray-700">Request Urgent Delivery</span>
        </label>
      </div>

      <div className="text-sm text-gray-600">
        <p>Total Price: ${totalAmount.toFixed(2)}</p>
      </div>

      <div className="flex space-x-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:bg-gray-400"
        >
          {loading ? 'Processing...' : 'Continue to Payment'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-100 text-gray-700 p-2 rounded hover:bg-gray-200"
        >
          Cancel
        </button>
      </div>
    </form>
  );
} 