'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AddProductForm() {
  const router = useRouter()
  const [productName, setProductName] = useState('')
  const [manufacturer, setManufacturer] = useState('')
  const [price, setPrice] = useState('')
  const [quantity, setQuantity] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('BOOKS')
  const [status, setStatus] = useState('AVAILABLE')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // read cookie helper
  const getCookie = (name) =>
    document.cookie
      .split('; ')
      .map(c => c.split('='))
      .find(([k]) => k === name)?.[1] || ''

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setSuccess('')

    const token = getCookie('token')
    if (!token) {
      setError('Not authenticated.')
      return
    }

    const payload = {
      productName,
      manufacturer,
      price: Number(price),
      quantity: Number(quantity),
      description,
      category,
      status,
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/products`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            token,
          },
          body: JSON.stringify(payload),
        }
      )
      if (!res.ok) {
        const errData = await res.json().catch(() => null)
        throw new Error(errData?.message || `Status ${res.status}`)
      }
      setSuccess('Product added successfully!')
      // clear form
      setProductName('')
      setManufacturer('')
      setPrice('')
      setQuantity('')
      setDescription('')
      setCategory('BOOKS')
      setStatus('AVAILABLE')
      // optionally refresh or redirect:
      // router.refresh()
    } catch (err) {
      setError(err.message)
    }
  }

  // inline high‑contrast styles
  const formStyle = {
    border: '2px solid #000',
    padding: '20px',
    borderRadius: '4px',
    backgroundColor: '#fff',
    color: '#000',
    maxWidth: '500px',
    margin: '20px auto',
    fontFamily: 'Arial, sans-serif',
  }
  const fieldStyle = { marginBottom: '12px' }
  const labelStyle = { display: 'block', marginBottom: '4px', fontWeight: 'bold' }
  const inputStyle = {
    width: '100%',
    padding: '8px',
    border: '1px solid #000',
    borderRadius: '2px',
    fontSize: '14px',
    backgroundColor: '#fff',
    color: '#000',
  }
  const selectStyle = { ...inputStyle }
  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#000',
    color: '#fff',
    border: 'none',
    borderRadius: '2px',
    fontSize: '16px',
    cursor: 'pointer',
  }
  const errorStyle = { color: '#900', marginBottom: '12px' }
  const successStyle = { color: '#090', marginBottom: '12px' }

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2 style={{ textAlign: 'center', marginBottom: '16px' }}>
        Add New Product
      </h2>
      {error && <div style={errorStyle}>{error}</div>}
      {success && <div style={successStyle}>{success}</div>}

      <div style={fieldStyle}>
        <label style={labelStyle}>Product Name</label>
        <input
          style={inputStyle}
          type="text"
          value={productName}
          onChange={e => setProductName(e.target.value)}
          required
        />
      </div>
      <div style={fieldStyle}>
        <label style={labelStyle}>Manufacturer</label>
        <input
          style={inputStyle}
          type="text"
          value={manufacturer}
          onChange={e => setManufacturer(e.target.value)}
          required
        />
      </div>
      <div style={fieldStyle}>
        <label style={labelStyle}>Price</label>
        <input
          style={inputStyle}
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={e => setPrice(e.target.value)}
          required
        />
      </div>
      <div style={fieldStyle}>
        <label style={labelStyle}>Quantity</label>
        <input
          style={inputStyle}
          type="number"
          min="0"
          value={quantity}
          onChange={e => setQuantity(e.target.value)}
          required
        />
      </div>
      <div style={fieldStyle}>
        <label style={labelStyle}>Description</label>
        <textarea
          style={{ ...inputStyle, height: '60px' }}
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>
      <div style={fieldStyle}>
        <label style={labelStyle}>Category</label>
        <select
          style={selectStyle}
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          {['BOOKS','FASHION','ELECTRONICS','FURNITURE','GROCERIES'].map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <div style={fieldStyle}>
        <label style={labelStyle}>Status</label>
        <select
          style={selectStyle}
          value={status}
          onChange={e => setStatus(e.target.value)}
        >
          {['AVAILABLE','OUTOFSTOCK'].map(st => (
            <option key={st} value={st}>{st}</option>
          ))}
        </select>
      </div>
      <div style={{ textAlign: 'center' }}>
        <button type="submit" style={buttonStyle}>
          Add Product
        </button>
      </div>
    </form>
  )
}
