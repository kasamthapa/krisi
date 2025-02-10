'use client';

import { useState } from 'react';
import { usePayments } from '@/contexts/PaymentContext';

interface PaymentFormProps {
  orderId: string;
  amount: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function PaymentForm({
  orderId,
  amount,
  onSuccess,
  onCancel,
}: PaymentFormProps) {
  const { createPayment } = usePayments();
  const [paymentMethod, setPaymentMethod] = useState<'BANK_TRANSFER' | 'CASH' | 'DIGITAL_WALLET'>('BANK_TRANSFER');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createPayment(orderId, amount, paymentMethod);
      onSuccess?.();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Payment Details</h3>
        <p className="text-sm text-gray-500">Amount to pay: ${amount}</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Payment Method
        </label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value as typeof paymentMethod)}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          required
        >
          <option value="BANK_TRANSFER">Bank Transfer</option>
          <option value="CASH">Cash</option>
          <option value="DIGITAL_WALLET">Digital Wallet</option>
        </select>
      </div>

      <div className="text-sm text-gray-500">
        <p>Note: Payment will be held in escrow until order delivery is confirmed.</p>
      </div>

      <div className="flex space-x-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:bg-gray-400"
        >
          {loading ? 'Processing...' : 'Pay Now'}
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