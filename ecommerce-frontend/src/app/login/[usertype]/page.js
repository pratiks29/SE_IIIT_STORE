// src/app/login/[usertype]/page.js
'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const params = useParams()
  const userType = params.usertype // "customer" or "seller"

  const [mobileId, setMobileId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // build correct payload
    const body =
      userType === 'seller'
        ? { mobile: mobileId, password }
        : { mobileId, password }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/login/${userType}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      )
      if (!res.ok) {
        const errData = await res.json().catch(() => null)
        throw new Error(errData?.message || 'Login failed')
      }

      // parse session object
      const session = await res.json()
      const { token, sessionEndTime } = session

      // compute TTL
      let maxAge = 3600
      if (sessionEndTime) {
        const diff = Math.floor((new Date(sessionEndTime) - new Date()) / 1000)
        if (diff > 0) maxAge = diff
      }

      // store token cookie
      // after successful login and before redirect:
        document.cookie = `token=${token}; path=/; max-age=${maxAge}`
        document.cookie = `userType=${userType}; path=/; max-age=${maxAge}`


      // redirect
      if (userType === 'customer') {
        router.push('/customer/profile')
      } else {
        router.push('/seller/dashboard')
      }
    } catch (err) {
      setError(err.message)
    }
  }

  // high‑contrast inline styles
  const pageStyle = {
    background: 'linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 16px',
    fontFamily: "'Inter', sans-serif",
  }
  
  const containerStyle = {
    width: '100%',
    maxWidth: '600px', // 💥 wider
    padding: '24px 32px', // 💥 reduced vertical space
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
    border: '1px solid #e5e7eb',
    color: '#111',
  }
  
  const titleStyle = {
    textAlign: 'center',
    marginBottom: '16px',
    fontSize: '26px',
    fontWeight: '700',
    color: '#111',
    letterSpacing: '-0.5px',
  }
  
  const labelStyle = {
    display: 'block',
    marginBottom: '6px',
    fontWeight: 600,
    fontSize: '15px',
    color: '#333',
  }
  
  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    marginBottom: '16px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    fontSize: '15px',
    backgroundColor: '#f9f9f9',
    color: '#111',
    outline: 'none',
  }
  
  const buttonStyle = {
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
    marginBottom: '12px',
  }
  
  const registerButtonStyle = {
    width: '100%',
    padding: '12px',
    backgroundColor: '#fff',
    color: '#111',
    fontSize: '15px',
    border: '2px solid #111',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600,
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
  

  return (
    <div style={pageStyle}>
    <div style={containerStyle}>
      <h2 style={titleStyle}>
        {userType.charAt(0).toUpperCase() + userType.slice(1)} Login
      </h2>
      {error && <div style={errorStyle}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <label style={labelStyle}>Mobile Number</label>
        <input
          type="text"
          value={mobileId}
          onChange={(e) => setMobileId(e.target.value)}
          placeholder="e.g. 9999999999"
          style={inputStyle}
          required
        />
  
        <label style={labelStyle}>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
          required
        />
  
        <button type="submit" style={buttonStyle}>
          Log In
        </button>
      </form>
  
      <button
        type="button"
        style={registerButtonStyle}
        onClick={() => router.push(`/register/${userType}`)}
      >
        Register
      </button>
    </div>
  </div>
  
  )
}
