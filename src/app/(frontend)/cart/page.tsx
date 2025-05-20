'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { ShoppingCartIcon, TrashIcon } from '@heroicons/react/24/outline'
import toast, { Toaster } from 'react-hot-toast'

type CartProduct = {
  id: string
  quantity: number
  product?: {
    id?: string
    name?: string
    price?: number
    media?: { url: string }
  }
}

type Cart = {
  id: string
  user: { id: string }
  products: CartProduct[]
}

const CartPage = () => {
  const [carts, setCarts] = useState<Cart[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [showModal, setShowModal] = useState(false)
  const [shippingAddress, setShippingAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('card')

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/api/users/me', { withCredentials: true })
        setUserId(res.data.user.id)
      } catch (error) {
        toast.error('Failed to fetch user')
      }
    }

    const fetchCarts = async () => {
      try {
        const res = await axios.get('/api/cart', { withCredentials: true })
        setCarts(res.data.docs || [])
      } catch (error) {
        toast.error('Failed to fetch cart')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
    fetchCarts()
  }, [])

  const userCart = carts.find((cart) => cart.user.id === userId)
  const cartItems = userCart?.products || []

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  )

  const handleMinus = async (item: CartProduct) => {
    if (!userCart) return

    const updatedProducts = userCart.products
      .map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity > 1 ? cartItem.quantity - 1 : 0 }
          : cartItem
      )
      .filter((cartItem) => cartItem.quantity > 0)

    const updatedCart = { ...userCart, products: updatedProducts }

    try {
      await axios.patch(`/api/cart/${updatedCart.id}`, updatedCart, { withCredentials: true })
      setCarts((prevCarts) =>
        prevCarts.map((cart) => (cart.id === userCart.id ? updatedCart : cart))
      )
      toast.success('Quantity updated')
    } catch (error) {
      toast.error('Failed to update quantity')
    }
  }

  const handlePlus = async (item: CartProduct) => {
    if (!userCart) return

    const updatedProducts = userCart.products.map((cartItem) =>
      cartItem.id === item.id
        ? { ...cartItem, quantity: cartItem.quantity + 1 }
        : cartItem
    )

    const updatedCart = { ...userCart, products: updatedProducts }

    try {
      await axios.patch(`/api/cart/${updatedCart.id}`, updatedCart, { withCredentials: true })
      setCarts((prevCarts) =>
        prevCarts.map((cart) => (cart.id === userCart.id ? updatedCart : cart))
      )
      toast.success('Quantity increased')
    } catch (error) {
      toast.error('Failed to increase quantity')
    }
  }

  const handleDelete = async (item: CartProduct) => {
    if (!userCart) return

    const updatedProducts = userCart.products.filter((cartItem) => cartItem.id !== item.id)
    const updatedCart = { ...userCart, products: updatedProducts }

    try {
      await axios.patch(`/api/cart/${updatedCart.id}`, updatedCart, { withCredentials: true })
      setCarts((prevCarts) =>
        prevCarts.map((cart) => (cart.id === userCart.id ? updatedCart : cart))
      )
      toast.success('Product removed')
    } catch (error) {
      toast.error('Failed to remove product')
    }
  }

  const handleCheckout = async () => {
    if (!userCart || !userId) return

    if (!shippingAddress.trim()) {
      toast.error('Please enter a shipping address.')
      return
    }

    const orderItems = userCart.products.map((item) => ({
      product: item.product?.id,
      quantity: item.quantity,
      price: item.product?.price || 0,
    }))

    const newOrder = {
      user: userId,
      items: orderItems,
      total: totalPrice,
      shippingaddress: shippingAddress,
      status: 'pending',
    }

    try {
      await axios.post('/api/orders', newOrder, { withCredentials: true })
      const clearedCart = { ...userCart, products: [] }

      await axios.patch(`/api/cart/${userCart.id}`, clearedCart, { withCredentials: true })

      setCarts((prevCarts) =>
        prevCarts.map((cart) => (cart.id === userCart.id ? clearedCart : cart))
      )

      setShowModal(false)
      setShippingAddress('')
      setPaymentMethod('card')

      toast.success('Order placed successfully!')
    } catch (error) {
      toast.error('Failed to place order')
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-10 text-center flex items-center justify-center gap-2">
        <ShoppingCartIcon className="w-7 h-7 text-blue-600" />
        Your Cart
      </h1>

      {loading ? (
        <div className="text-center text-gray-500 text-lg">Loading your cart...</div>
      ) : cartItems.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">Your cart is empty.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-6 bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
              >
                <div className="w-24 h-24 bg-gray-100 flex items-center justify-center rounded-lg overflow-hidden">
                  <img
                    src={item.product?.media?.url || '/placeholder.png'}
                    alt={item.product?.name}
                    className="object-contain w-full h-full"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {item.product?.name || 'Unnamed Product'}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Quantity:
                    <button onClick={() => handleMinus(item)} className="p-3">-</button>
                    <strong className="mx-2">{item.quantity}</strong>
                    <button onClick={() => handlePlus(item)} className="p-3">+</button>
                  </p>
                  <p className="text-gray-700 mt-1">
                    Price: ₹{item.product?.price?.toFixed(2)} each
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">
                    ₹{((item.product?.price || 0) * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => handleDelete(item)}
                    className="text-red-500 hover:text-red-700 mt-2"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-md mt-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Order Summary</h2>
            <div className="flex justify-between text-gray-700 mb-2">
              <span>Total Items:</span>
              <span>{totalQuantity}</span>
            </div>
            <div className="flex justify-between text-gray-700 mb-4">
              <span>Total Price:</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="w-full bg-blue-600 text-white py-3 rounded-md font-medium text-lg hover:bg-blue-700 transition"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-4">
            <h2 className="text-xl font-semibold">Complete Your Order</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700">Shipping Address</label>
              <input
                type="text"
                className="w-full border rounded p-2 mt-1"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Enter your address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Payment Method</label>
              <select
                className="w-full border rounded p-2 mt-1"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="card">Card</option>
                <option value="cash">Cash on Delivery</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleCheckout}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CartPage
