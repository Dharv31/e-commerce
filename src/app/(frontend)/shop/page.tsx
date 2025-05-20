'use client'

import { Cart } from '@/payload-types'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  media?: {
    url: string
  }
}

interface ApiResponse {
  docs: Product[]
}

const categoriesList = ['Accessories', 'Tv', 'Ipads', 'Laptops', 'Watches', 'Phones']

const ShopPage: React.FC = () => {
  const [categories, setCategories] = useState<string>('Accessories')
  const [products, setProducts] = useState<Product[]>([])
  const [carts, setCarts] = useState<Cart[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/api/products', { params: { limit: 100 } })
        setProducts(res.data.docs || [])
      } catch (error) {
        toast.error('Failed to load products', { position: 'top-right' })
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/api/users/me', {
          headers: { 'Content-Type': 'application/json' },
        })
        setUserId(res.data?.user?.id || null)
      } catch (error) {
        toast.error('Failed to fetch user', { position: 'top-right' })
      }
    }

    fetchUser()
  }, [])

  const handleAddCart = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (!userId) {
      toast.error('You must be logged in to add to cart', { position: 'top-right' })
      return
    }

    const productId = event.currentTarget.getAttribute('data-id')
    if (!productId) return

    const product = products.find((p) => p.id === productId)
    if (!product) return

    try {
      const cartsResponse = await axios.get('/api/cart', {
        params: { user: userId, limit: 100 },
      })

      const userCart = cartsResponse.data.docs.find((cart: any) => cart.user.id === userId)

      if (userCart) {
        const existingProductIndex = userCart.products.findIndex(
          (item: any) => item.product.id === productId
        )

        if (existingProductIndex !== -1) {
          const updatedProducts = [...userCart.products]
          updatedProducts[existingProductIndex].quantity += 1

          await axios.patch(`/api/cart/${userCart.id}`, {
            user: userId,
            products: updatedProducts,
          })

          toast.success('Quantity updated in cart', { position: 'top-right' })
        } else {
          const newProduct = { product: productId, quantity: 1 }
          const updatedProducts = [...userCart.products, newProduct]

          await axios.patch(`/api/cart/${userCart.id}`, {
            user: userId,
            products: updatedProducts,
          })

          toast.success('Product added to cart', { position: 'top-right' })
        }
      } else {
        await axios.post('/api/cart', {
          user: userId,
          products: [{ product: productId, quantity: 1 }],
        })

        toast.success('Cart created and product added', { position: 'top-right' })
      }
    } catch (error) {
      toast.error('Failed to add product to cart', { position: 'top-right' })
    }
  }

  const filteredProducts = categories
    ? products.filter((product) => product.category === categories)
    : products

  return (
    <div className="px-6 md:px-12 py-10">
      <Toaster position="top-right" />
      <div className="flex flex-wrap gap-4 justify-center mb-10">
        {categoriesList.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategories(cat)}
            className={`px-4 py-2 rounded-md text-sm font-medium border transition ${
              categories === cat
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Loading products...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center text-gray-500">No products found in this category.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition bg-white"
            >
              <div className="w-full h-48 bg-gray-50 flex items-center justify-center">
                <img
                  src={product.media?.url || '/placeholder.png'}
                  alt={product.name}
                  className="max-h-full object-contain"
                />
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-1">{product.name}</h2>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {product.description || 'No description available.'}
                </p>
                <p className="text-blue-600 font-bold">₹{product.price.toFixed(2)}</p>
                <div className="flex justify-end">
                  <button
                    data-id={product.id}
                    onClick={handleAddCart}
                    className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow hover:bg-blue-700 transition duration-300"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 7h13l-1.5-7M7 13h10"
                      />
                    </svg>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ShopPage
