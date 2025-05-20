'use client'

import axios from 'axios'
import React, { useEffect, useState } from 'react'

type OrderItem = {
  product: {
    id: string
    name: string
    media?: { url: string }
  }
  quantity: number
  price: number
}

type Order = {
  id: string
  items: OrderItem[]
  total: number
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled'
  shippingaddress: string
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  shipped: 'bg-blue-100 text-blue-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

const OrderPage = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/api/users/me', { withCredentials: true })
        setUserId(res.data.user.id)
      } catch (error) {
        console.error('User fetch error:', error)
      }
    }

    fetchUser()
  }, [])

  useEffect(() => {
    if (!userId) return

    const fetchOrders = async () => {
      try {
        const res = await axios.get(`/api/orders?where[user][equals]=${userId}`, {
          withCredentials: true,
        })
        setOrders(res.data.docs || [])
      } catch (error) {
        console.error('Order fetch error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [userId])

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-12">🧾 Order History</h1>

      {loading ? (
        <p className="text-center text-gray-500 text-lg">Loading your orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No orders found.</p>
      ) : (
        <ol className="relative border-l border-gray-300 space-y-10">
          {orders.map((order) => (
            <li key={order.id} className="ml-6">
             
              <span className="absolute w-4 h-4 bg-blue-600 rounded-full -left-2 top-1.5"></span>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-lg font-semibold text-gray-800">Order #{order.id}</h2>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${statusColors[order.status]}`}
                  >
                    {order.status}
                  </span>
                </div>

                <p className="text-sm text-gray-500 mt-1 mb-4">
                  <strong>Shipping:</strong> {order.shippingaddress}
                </p>

                <div className="space-y-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <img
                        src={item.product.media?.url || '/placeholder.png'}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover bg-gray-100 rounded"
                      />
                      <div>
                        <p className="font-medium text-gray-800">{item.product.name}</p>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity} • ₹{item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 text-right font-semibold text-blue-600">
                  Total: ₹{order.total.toFixed(2)}
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

export default OrderPage
