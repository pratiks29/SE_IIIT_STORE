// src/app/seller/products/[id]/page.js
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function EditSellerProductPage() {
  const router = useRouter()
  const { id } = useParams()

  const [productName, setProductName] = useState('')
  const [description, setDescription] = useState('')
  const [manufacturer, setManufacturer] = useState('')
  const [price, setPrice] = useState('')
  const [quantity, setQuantity] = useState('')
  const [category, setCategory] = useState('BOOKS')
  const [status, setStatus] = useState('AVAILABLE')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/${id}`,
          { cache: 'no-store' }
        )
        if (!res.ok) throw new Error('Failed to load product')
        const data = await res.json()
        setProductName(data.productName)
        setDescription(data.description || '')
        setManufacturer(data.manufacturer || '')
        setPrice(data.price.toString())
        setQuantity(data.quantity.toString())
        setCategory(data.category)
        setStatus(data.status)
      } catch (err) {
        setError(err.message)
      }
    }
    loadProduct()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/products`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            token,
          },
          body: JSON.stringify({
            productId: parseInt(id, 10),
            productName,
            description,
            manufacturer,
            price: parseFloat(price),
            quantity: parseInt(quantity, 10),
            category,
            status,
          }),
        }
      )
      if (!res.ok) {
        const err = await res.json().catch(() => null)
        throw new Error(err?.message || 'Failed to update product')
      }
      router.push('/seller/products')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) return
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/${id}`,
        {
          method: 'DELETE',
          headers: { token },
        }
      )
      if (!res.ok) throw new Error('Failed to delete product')
      router.push('/seller/products')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="max-w-lg mx-auto mt-12 p-6 bg-white rounded shadow space-y-4">
      <h1 className="text-2xl font-bold">Edit Product #{id}</h1>
      {error && <div className="text-red-600">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Product Name</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            rows={3}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Manufacturer</label>
          <input
            type="text"
            value={manufacturer}
            onChange={(e) => setManufacturer(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Price (₹)</label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="BOOKS">Books</option>
              <option value="FASHION">Fashion</option>
              <option value="ELECTRONICS">Electronics</option>
              <option value="FURNITURE">Furniture</option>
              <option value="GROCERIES">Groceries</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="AVAILABLE">Available</option>
              <option value="OUTOFSTOCK">Out of Stock</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Saving…' : 'Save Changes'}
        </button>
      </form>

      <button
        onClick={handleDelete}
        className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
      >
        Delete Product
      </button>
    </div>
  )
}
