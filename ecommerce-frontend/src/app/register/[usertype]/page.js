// src/app/register/[usertype]/page.js
'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const params = useParams()
  const userType = params.usertype // "customer" or "seller"

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [registeredId, setRegisteredId] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const payload = {
      firstName,
      lastName,
      password,
      ...(userType === 'customer'
        ? { mobileNo: mobile, emailId: email }
        : { mobile, emailId: email }),
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/register/${userType}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      )
      if (!res.ok) {
        const errData = await res.json().catch(() => null)
        throw new Error(errData?.message || 'Registration failed')
      }

      // **Here’s the change**: parse the full Customer object
      const customer = await res.json()
      setRegisteredId(customer.customerId)

      // after showing the ID, redirect to login
      setTimeout(() => {
        router.push(`/login/${userType}`)
      }, 2000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // High-contrast black & white
  const container = {
    width: '100%',
    maxWidth: '600px',
    margin: '60px auto',
    padding: '24px 32px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
    border: '1px solid #e5e7eb',
    color: '#111',
    fontFamily: "'Inter', sans-serif",
  }
  
 const title ={
    textAlign: 'center',
    marginBottom: '24px',
    fontSize: '26px',
    fontWeight: '700',
    color: '#111',
    letterSpacing: '-0.5px',
  }
  
  const label = {
    display: 'block',
    marginBottom: '6px',
    fontWeight: 600,
    fontSize: '15px',
    color: '#333',
  }
  
  const input = {
    width: '100%',
    padding: '10px 14px',
    marginBottom: '16px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    color: '#111',
    fontSize: '15px',
    outline: 'none',
  }
  
  const button = {
    width: '100%',
    padding: '12px',
    backgroundColor: '#111',
    color: '#fff',
    fontSize: '15px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600,
    marginTop: '4px',
  }
  
  const errorStyle = {
    color: '#d93025',
    backgroundColor: '#fdecea',
    padding: '10px 12px',
    borderRadius: '8px',
    fontSize: '14px',
    marginBottom: '16px',
    textAlign: 'center',
    fontWeight: 500,
  }
  
  const successStyle = {
    color: '#0c8a00',
    backgroundColor: '#e7f8ec',
    padding: '10px 12px',
    borderRadius: '8px',
    fontSize: '14px',
    marginBottom: '16px',
    textAlign: 'center',
    fontWeight: 600,
  }
  
//  const title = { textAlign: 'center', marginBottom: '24px', fontSize: '20px' }

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
      <div style={container}>
        <h2 style={title}>
          Register as {userType.charAt(0).toUpperCase() + userType.slice(1)}
        </h2>

        {error && <div style={errorStyle}>{error}</div>}
        {registeredId !== null && (
          <div style={successStyle}>
            Success! Your {userType} ID is {registeredId}. Redirecting…
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label style={label}>First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            style={input}
            required
          />

          <label style={label}>Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            style={input}
            required
          />

          <label style={label}>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={input}
            required={userType === 'customer'}
          />

          <label style={label}>
            {userType === 'customer' ? 'Mobile No' : 'Mobile'}
          </label>
          <input
            type="text"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="9999999999"
            style={input}
            required
          />

          <label style={label}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={input}
            required
          />

          <button type="submit" style={button} disabled={loading || registeredId!==null}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  )
}
