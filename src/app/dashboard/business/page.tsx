'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useProducts } from '@/contexts/ProductContext';
import { useOrders } from '@/contexts/OrderContext';
import DashboardLayout from '@/components/DashboardLayout';
import OrderForm from '@/components/OrderForm';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BusinessDashboard() {
  const { user, isAuthorized } = useAuth();
  const { getAvailableProducts } = useProducts();
  const { getOrdersByBuyer } = useOrders();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [orderingProduct, setOrderingProduct] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthorized(['BUSINESS'])) {
      router.push('/login');
    }
  }, [isAuthorized, router]);

  const availableProducts = getAvailableProducts();
  const myOrders = user ? getOrdersByBuyer(user.id) : [];
  
  const filteredProducts = availableProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getOrderStatusColor = (status: string) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      SHIPPED: 'bg-purple-100 text-purple-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <DashboardLayout>
      <div className="grid gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Available Products</h2>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border rounded-lg"
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="">All Categories</option>
                <option value="VEGETABLES">Vegetables</option>
                <option value="FRUITS">Fruits</option>
                <option value="GRAINS">Grains</option>
                <option value="DAIRY">Dairy</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map(product => (
              <div key={product.id} className="border rounded-lg p-4">
                {orderingProduct === product.id ? (
                  <OrderForm
                    productId={product.id}
                    sellerId={product.farmerId}
                    pricePerUnit={product.price}
                    availableQuantity={product.quantity}
                    unit={product.unit}
                    onSuccess={() => setOrderingProduct(null)}
                    onCancel={() => setOrderingProduct(null)}
                  />
                ) : (
                  <>
                    <div className="mb-4">
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-gray-500">{product.description}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">Price:</span> ${product.price}/{product.unit}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Available:</span> {product.quantity} {product.unit}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Location:</span> {product.location}
                      </p>
                      {product.isUrgent && (
                        <p className="text-red-500 text-sm font-medium">Urgent Sale!</p>
                      )}
                    </div>
                    <button
                      onClick={() => setOrderingProduct(product.id)}
                      className="mt-4 w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Place Order
                    </button>
                  </>
                )}
              </div>
            ))}
            {filteredProducts.length === 0 && (
              <p className="text-gray-500 col-span-full">No products available</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">My Orders</h2>
          <div className="grid gap-4">
            {myOrders.length > 0 ? (
              myOrders.map(order => (
                <div key={order.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">Order #{order.id}</p>
                      <p className="text-sm text-gray-500">
                        Quantity: {order.quantity} • Total: ${order.totalPrice}
                      </p>
                      <p className="text-sm text-gray-500">
                        Delivery to: {order.deliveryAddress}
                      </p>
                      {order.urgentDelivery && (
                        <p className="text-red-500 text-sm">Urgent Delivery</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`px-2 py-1 rounded-full text-xs ${getOrderStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <span className="text-sm text-gray-500 mt-1">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No orders placed yet</p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 