'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useProducts } from '@/contexts/ProductContext';
import { useOrders } from '@/contexts/OrderContext';
import DashboardLayout from '@/components/DashboardLayout';
import ProductForm from '@/components/ProductForm';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FarmerDashboard() {
  const { user, isAuthorized } = useAuth();
  const { getProductsByFarmer } = useProducts();
  const { getOrdersBySeller, updateOrderStatus } = useOrders();
  const router = useRouter();
  const [showAddProduct, setShowAddProduct] = useState(false);

  useEffect(() => {
    if (!isAuthorized(['FARMER'])) {
      router.push('/login');
    }
  }, [isAuthorized, router]);

  const myProducts = user ? getProductsByFarmer(user.id) : [];
  const myOrders = user ? getOrdersBySeller(user.id) : [];

  const handleOrderStatus = async (orderId: string, newStatus: 'CONFIRMED' | 'SHIPPED' | 'DELIVERED') => {
    await updateOrderStatus(orderId, newStatus);
  };

  return (
    <DashboardLayout>
      <div className="grid gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">My Products</h2>
            <button
              onClick={() => setShowAddProduct(!showAddProduct)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              {showAddProduct ? 'Cancel' : 'Add New Product'}
            </button>
          </div>

          {showAddProduct ? (
            <ProductForm onSuccess={() => setShowAddProduct(false)} />
          ) : (
            <div className="grid gap-4">
              {myProducts.length > 0 ? (
                myProducts.map(product => (
                  <div
                    key={product.id}
                    className="border rounded p-4 flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-gray-500">
                        {product.quantity} {product.unit} • ${product.price}/{product.unit}
                      </p>
                      <p className="text-sm text-gray-500">Status: {product.status}</p>
                    </div>
                    {product.isUrgent && (
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                        Urgent Sale
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No products listed yet</p>
              )}
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
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
                        <p className="text-red-500 text-sm">Urgent Delivery Requested</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'SHIPPED' ? 'bg-purple-100 text-purple-800' :
                        order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.status}
                      </span>
                      {order.status === 'PENDING' && (
                        <button
                          onClick={() => handleOrderStatus(order.id, 'CONFIRMED')}
                          className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        >
                          Confirm Order
                        </button>
                      )}
                      {order.status === 'CONFIRMED' && (
                        <button
                          onClick={() => handleOrderStatus(order.id, 'SHIPPED')}
                          className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        >
                          Mark as Shipped
                        </button>
                      )}
                      {order.status === 'SHIPPED' && (
                        <button
                          onClick={() => handleOrderStatus(order.id, 'DELIVERED')}
                          className="text-sm bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600"
                        >
                          Mark as Delivered
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No orders received yet</p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 