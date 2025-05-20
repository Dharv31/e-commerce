"use client";
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

type Order = {
  id?: string;
  customerName?: string;
  status?: string;
  total?: number;
  items?: any[];
  createdAt?: string;
  user?: {
    name?: string;
  };
};

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/orders', {
        params: { limit: 100 },
        withCredentials: true,
      });
      setOrders(res.data.docs || []);
      toast.success("Orders loaded");
    } catch (error) {
      console.error('Order fetch error:', error);
      toast.error("Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const updateToast = toast.loading("Updating status...");
    try {
      await axios.patch(`/api/orders/${orderId}`, { status: newStatus }, { withCredentials: true });
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      toast.success("Status updated successfully!", { id: updateToast });
    } catch (error) {
      console.error('Failed to update order status:', error);
      toast.error("Error updating status.", { id: updateToast });
    }
  };

  const renderStatusDropdown = (order: Order) => {
    const options = ['pending', 'shipped', 'delivered', 'cancelled'];

    return (
      <select
        className="border rounded px-2 py-1 text-sm bg-white"
        value={order.status}
        onChange={(e) => updateOrderStatus(order.id!, e.target.value)}
      >
        {options.map((status) => (
          <option key={status} value={status}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </option>
        ))}
      </select>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-6 text-gray-800">📦 Orders</h1>

      <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
            <tr>
              <th className="px-6 py-3 text-left">#</th>
              <th className="px-6 py-3 text-left">Order ID</th>
              <th className="px-6 py-3 text-left">Customer</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Total Amount</th>
              <th className="px-6 py-3 text-left">Items</th>
              <th className="px-6 py-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {loading ? (
              <tr>
                <td className="px-6 py-4 text-center" colSpan={7}>Loading orders...</td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td className="px-6 py-4 text-center text-gray-500" colSpan={7}>
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order, index) => (
                <tr key={order.id || index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-gray-100"}>
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4">{order.id}</td>
                  <td className="px-6 py-4">{order.user?.name || 'N/A'}</td>
                  <td className="px-6 py-4">{renderStatusDropdown(order)}</td>
                  <td className="px-6 py-4">₹{order.total?.toFixed(2) || '0.00'}</td>
                  <td className="px-6 py-4">
                    {Array.isArray(order.items)
                      ? `${order.items.length} item(s)`
                      : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersPage;
