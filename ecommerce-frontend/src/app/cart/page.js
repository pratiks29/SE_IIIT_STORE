// src/app/cart/page.js
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CartPage() {
  const router = useRouter()
  const [cart, setCart] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  // Helper to read auth token from cookies
  const getCookie = (name) =>
    document.cookie
      .split('; ')
      .map(c => c.split('='))
      .find(([k]) => k === name)?.[1] || ''

  // Fetch cart on mount
  useEffect(() => {
    const fetchCart = async () => {
      const token = getCookie('token')
      if (!token) return router.push('/login/customer')
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/cart`,
          { headers: { token }, cache: 'no-store' }
        )
        if (!res.ok) throw new Error('Failed to load cart')
        setCart(await res.json())
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchCart()
  }, [router])

  // Remove one line item: look up its productId via GET /products
  const handleRemove = async (item) => {
    const token = getCookie('token')
    if (!token) return router.push('/login/customer')
    setError('')

    try {
      // 1. Fetch full product catalog
      const prodRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/products`,
        { cache: 'no-store' }
      )
      if (!prodRes.ok) throw new Error('Failed to fetch products')
      const allProds = await prodRes.json()

      // 2. Find the matching product by name
      const match = allProds.find(
        p => p.productName === item.cartProduct.productName
      )
      if (!match) {
        throw new Error(
          `Product "${item.cartProduct.productName}" not found in catalog.`
        )
      }
      const payload = {
        productId:   match.productId,
        productName: match.productName,
        price:       match.price,
        quantity:    item.cartItemQuantity,
      }

      // 3. Send DELETE /cart
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/cart`,
        {
          method:  'DELETE',
          headers: {
            'Content-Type': 'application/json',
            token,
          },
          body: JSON.stringify(payload),
        }
      )
      if (!res.ok) {
        const err = await res.json().catch(() => null)
        throw new Error(err?.message || `Error ${res.status}`)
      }
      setCart(await res.json())
    } catch (err) {
      setError(err.message)
    }
  }

  // Clear entire cart
  const handleClear = async () => {
    const token = getCookie('token')
    if (!token) return router.push('/login/customer')
    setError('')
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/cart/clear`,
        { method: 'DELETE', headers: { token } }
      )
      if (!res.ok) {
        const err = await res.json().catch(() => null)
        throw new Error(err?.message || `Error ${res.status}`)
      }
      setCart(await res.json())
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <div className="text-center mt-8">Loading…</div>
  if (error)   return <div className="text-red-600 text-center mt-8">{error}</div>

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 px-8 py-10 bg-white rounded-2xl shadow-xl">
  <h1 className="text-4xl font-extrabold mb-10 text-center tracking-tight bg-gradient-to-r from-black via-gray-800 to-gray-600 bg-clip-text text-transparent">
    Your Cart
  </h1>

  {cart.cartItems.length === 0 ? (
    <p className="text-center text-lg text-gray-600">Your cart is empty.</p>
  ) : (
    <>
      <div className="space-y-6">
        {cart.cartItems.map((item) => (
          <div
            key={item.cartItemId}
            className="flex justify-between items-center border border-gray-200 rounded-xl p-6 bg-gray-50 shadow-sm"
          >
            <div>
              <p className="text-xl font-semibold text-gray-900">
                {item.cartProduct.productName}
              </p>
              <p className="text-sm text-gray-600">
                Quantity: {item.cartItemQuantity}
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <p className="text-xl font-medium text-gray-800">
                ₹{(item.cartProduct.price * item.cartItemQuantity).toFixed(2)}
              </p>
              <button
                onClick={() => handleRemove(item)}
                className="text-red-600 font-semibold hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="flex space-x-4">
          <button
            onClick={handleClear}
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Clear Cart
          </button>
          <button
            onClick={() => alert('Buy Now coming soon!')}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Buy Now
          </button>
        </div>
        <div className="text-2xl font-bold text-right text-gray-900">
          Total: ₹{cart.cartTotal.toFixed(2)}
        </div>
      </div>
    </>
  )}
</div>

  )
}
