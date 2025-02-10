'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useProducts } from '@/contexts/ProductContext';
import { useAnalytics } from '@/contexts/AnalyticsContext';
import DashboardLayout from '@/components/DashboardLayout';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useNotifications } from '@/contexts/NotificationContext';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  expiryDate: Date;
  unit: string;
  // ... other fields from your schema
};

export default function AdminDashboard() {
  const { user, isAuthorized } = useAuth();
  const { getProducts, updateProduct } = useProducts();
  const { getAnalytics } = useAnalytics();
  const router = useRouter();
  const { sendSMS } = useNotifications();
  const [pendingProducts, setPendingProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [approvedProducts, setApprovedProducts] = useState(0);

  useEffect(() => {
    if (!isAuthorized(['ADMIN'])) {
      router.push('/login');
    }
  }, [isAuthorized, router]);

  useEffect(() => {
    async function loadData() {
      const pending = await getProducts({ status: 'PENDING' });
      const total = await getProducts({});
      const approved = await getProducts({ status: 'APPROVED' });
      
      setPendingProducts(pending);
      setTotalProducts(total.length);
      setApprovedProducts(approved.length);
    }
    loadData();
  }, [getProducts]);

  const analytics = getAnalytics();

  const handleApproval = async (productId: string, approved: boolean) => {
    await updateProduct(productId, {
      status: approved ? 'APPROVED' : 'REJECTED'
    });

    // Send notification to farmer
    const product = await getProducts({ id: productId });
    if (product.length > 0) {
      await sendSMS(
        product[0].farmerId,
        `Your product "${product[0].name}" has been ${approved ? 'approved' : 'rejected'}`
      );
    }
  };

  return (
    <DashboardLayout>
      <div className="grid gap-6 mb-8">
        {/* Analytics Overview */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
            <p className="text-2xl font-semibold">${analytics.totalRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Active Products</h3>
            <p className="text-2xl font-semibold">{analytics.activeProducts}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
            <p className="text-2xl font-semibold">{analytics.totalOrders}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Urgent Sales</h3>
            <p className="text-2xl font-semibold">{analytics.urgentSales}</p>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {analytics.recentTransactions.map(transaction => (
              <div key={transaction.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">
                    {transaction.type === 'ORDER' ? 'New Order' : 'New Product'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(transaction.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  {transaction.amount && (
                    <p className="font-medium">${transaction.amount}</p>
                  )}
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    transaction.status === 'APPROVED' || transaction.status === 'DELIVERED'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Quality Inspection Queue</h2>
          <div className="grid gap-4">
            {pendingProducts.length > 0 ? (
              pendingProducts.map(product => (
                <div key={product.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-gray-500">{product.description}</p>
                      <p className="text-sm text-gray-500">
                        Quantity: {product.quantity} {product.unit}
                      </p>
                      <p className="text-sm text-gray-500">
                        Price: ${product.price}/{product.unit}
                      </p>
                      <p className="text-sm text-gray-500">
                        Expiry: {new Date(product.expiryDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={() => handleApproval(product.id, true)}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleApproval(product.id, false)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No products pending approval</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">System Statistics</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded">
              <h3 className="text-sm font-medium text-gray-500">Total Products</h3>
              <p className="text-2xl font-semibold">{totalProducts}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded">
              <h3 className="text-sm font-medium text-gray-500">Pending Approval</h3>
              <p className="text-2xl font-semibold">{pendingProducts.length}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded">
              <h3 className="text-sm font-medium text-gray-500">Approved Products</h3>
              <p className="text-2xl font-semibold">{approvedProducts}</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 