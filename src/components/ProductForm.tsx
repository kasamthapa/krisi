'use client';

import { useState } from 'react';
import { useProducts } from '@/contexts/ProductContext';
import { useAuth } from '@/contexts/AuthContext';

interface ProductFormProps {
  onSuccess?: () => void;
}

export default function ProductForm({ onSuccess }: ProductFormProps) {
  const { user } = useAuth();
  const { addProduct } = useProducts();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      await addProduct({
        farmerId: user.id,
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        price: parseFloat(formData.get('price') as string),
        quantity: parseInt(formData.get('quantity') as string),
        unit: formData.get('unit') as 'KG' | 'PIECE' | 'DOZEN',
        category: formData.get('category') as 'VEGETABLES' | 'FRUITS' | 'GRAINS' | 'DAIRY' | 'OTHER',
        expiryDate: new Date(formData.get('expiryDate') as string),
        images: [],
        isUrgent: formData.get('isUrgent') === 'true',
        location: user.location || '',
      });
      onSuccess?.();
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Product Name</label>
        <input
          type="text"
          name="name"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            name="price"
            step="0.01"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Quantity</label>
          <input
            type="number"
            name="quantity"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Unit</label>
          <select
            name="unit"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          >
            <option value="KG">Kilogram</option>
            <option value="PIECE">Piece</option>
            <option value="DOZEN">Dozen</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            name="category"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          >
            <option value="VEGETABLES">Vegetables</option>
            <option value="FRUITS">Fruits</option>
            <option value="GRAINS">Grains</option>
            <option value="DAIRY">Dairy</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
        <input
          type="date"
          name="expiryDate"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
        />
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            name="isUrgent"
            value="true"
            className="rounded border-gray-300"
          />
          <span className="ml-2 text-sm text-gray-700">Mark as Urgent Sale</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:bg-gray-400"
      >
        {loading ? 'Adding Product...' : 'Add Product'}
      </button>
    </form>
  );
} 