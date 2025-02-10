'use client';

import { useProducts } from '@/contexts/ProductContext';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { Product } from '@prisma/client';

export default function QualityControlPage() {
  const { user } = useAuth();
  const { getProducts, updateProduct } = useProducts();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts() {
      if (!user) return;
      const data = await getProducts({ status: 'PENDING' });
      setProducts(data);
    }

    loadProducts();
  }, [user]);

  const handleApprove = async (productId: string) => {
    try {
      await updateProduct(productId, { status: 'APPROVED' });
      setProducts(products.filter(p => p.id !== productId));
    } catch (error) {
      console.error('Failed to approve product:', error);
    }
  };

  const handleReject = async (productId: string) => {
    try {
      await updateProduct(productId, { status: 'REJECTED' });
      setProducts(products.filter(p => p.id !== productId));
    } catch (error) {
      console.error('Failed to reject product:', error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Quality Control</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
            )}
            
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
              <p className="mt-1 text-sm text-gray-500">{product.description}</p>
              
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Price:</span> ${product.price.toFixed(2)}
                </div>
                <div>
                  <span className="font-medium">Quantity:</span> {product.quantity}
                </div>
                {product.expiryDate && (
                  <div className="col-span-2">
                    <span className="font-medium">Expires:</span>{' '}
                    {new Date(product.expiryDate).toLocaleDateString()}
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={() => handleReject(product.id)}
                  className="px-4 py-2 border border-red-600 text-red-600 rounded hover:bg-red-50"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleApprove(product.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {products.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No products pending approval
        </div>
      )}
    </div>
  );
} 