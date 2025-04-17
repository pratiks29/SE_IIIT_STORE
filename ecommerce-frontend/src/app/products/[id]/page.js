// src/app/products/[id]/page.js
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ProductDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [product, setProduct] = useState(null)
  const [error, setError] = useState('')

  // helper to read the token cookie
  const getCookie = (name) =>
    document.cookie
      .split('; ')
      .map(c => c.split('='))
      .find(([k]) => k === name)?.[1] || ''

  useEffect(() => {
    if (!id) {
      setError('No product ID in URL')
      return
    }

    ;(async () => {
      try {
        const base = process.env.NEXT_PUBLIC_API_BASE_URL
        if (!base) throw new Error('API base URL not set')

        const url = `${base.replace(/\/$/, '')}/product/${id}`
        console.log('Fetching from:', url)

        // include token if present
        const token = getCookie('token')
        const headers = token
          ? { 'Content-Type': 'application/json', token }
          : { 'Content-Type': 'application/json' }

        const res = await fetch(url, {
          method: 'GET',
          mode: 'cors',
          cache: 'no-store',
          headers,
        })

        // parse whatever body you get
        const data = await res.json()
        console.log('Raw response status:', res.status, data)

        // if the JSON looks like your product, use it
        if (data && data.productId) {
          setProduct(data)
        } else {
          throw new Error(
            data.message || `Unexpected response (status ${res.status})`
          )
        }
      } catch (err) {
        console.error(err)
        setError(err.message)
      }
    })()
  }, [id])

  if (error) {
    return (
      <div style={{ fontFamily: 'Arial', textAlign: 'center', marginTop: 40 }}>
        <h2 style={{ color: '#900' }}>Error loading product</h2>
        <pre style={{ color: '#900' }}>{error}</pre>
        <Link href="/products" style={{ color: '#00f', textDecoration: 'underline' }}>
          ← Back to products
        </Link>
      </div>
    )
  }

  if (!product) {
    return (
      <div style={{ fontFamily: 'Arial', textAlign: 'center', marginTop: 40 }}>
        Loading…
      </div>
    )
  }

 // inside ProductDetailPage component, replace handleAddToCart with:

const handleAddToCart = async () => {
  if (!product) return

  const token = getCookie('token')
  if (!token) {
    router.push('/login/customer')
    return
  }

  try {
    const payload = {
      productId: product.productId,
      productName: product.productName,
      price: product.price,
      quantity: 1,
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/cart/add`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token,
        },
        body: JSON.stringify(payload),
      }
    )

    const result = await res.json()
    if (!res.ok) {
      throw new Error(result.message || `Error ${res.status}`)
    }

    // success → go to cart page
    router.push('/cart')
  } catch (err) {
    setError(err.message)
  }
}


  return (
    <div style={{ maxWidth: 600, margin: '40px auto', fontFamily: 'Arial' }}>
      <h1 style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 16 }}>
        {product.productName}
      </h1>
      {product.description && (
        <p style={{ marginBottom: 16, lineHeight: 1.5 }}>
          {product.description}
        </p>
      )}
      <div style={{ lineHeight: 1.6, marginBottom: 24 }}>
        <p><strong>Price:</strong> ₹{product.price.toFixed(2)}</p>
        <p><strong>Manufacturer:</strong> {product.manufacturer}</p>
        <p><strong>Category:</strong> {product.category}</p>
        <p><strong>Status:</strong> {product.status}</p>
        <p><strong>In Stock:</strong> {product.quantity}</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <button
          onClick={handleAddToCart}
          style={{
            padding: '10px 20px',
            backgroundColor: '#000',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            fontSize: 16,
            cursor: 'pointer',
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}
