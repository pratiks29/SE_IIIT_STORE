// src/components/NavBar.js
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'

export default function NavBar() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [userType, setUserType] = useState(null)
  const pathname = usePathname()
  const router = useRouter()

  const getCookie = (name) => {
    return document.cookie
      .split('; ')
      .map(c => c.split('='))
      .find(([key]) => key === name)?.[1] || null
  }

  const handleLogout = async () => {
    const token = getCookie('token')
    if (token) {
      await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/logout/customer`, {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({ token, message: 'User requested logout' }),
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/logout/seller`, {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({ token, message: 'User requested logout' }),
        }),
      ]).catch(console.error)
      document.cookie = 'token=; path=/; max-age=0'
      document.cookie = 'userType=; path=/; max-age=0'
      localStorage.removeItem('token')
    }
    router.push('/')
  }

  useEffect(() => {
    const tok = getCookie('token')
    setLoggedIn(!!tok)
    setUserType(getCookie('userType'))
  }, [pathname])

  // 🚀 Crazy Beautiful & Professional Styles
  const navStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.75)',
    backdropFilter: 'blur(12px)',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
    position: 'sticky',
    top: '20px',
    zIndex: 1000,
    fontFamily: "'Poppins', sans-serif",
    border: '1px solid rgba(255,255,255,0.3)',
  }

  const logoStyle = {
    fontSize: '32px',
    fontWeight: 700,
    textDecoration: 'none',
    color: '#111',
    background: 'linear-gradient(90deg, #000, #555)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.5px',
  }

  const linkGroup = {
    display: 'flex',
    gap: '24px',
    alignItems: 'center',
    flexWrap: 'wrap',
  }

  const linkStyle = {
    color: '#333',
    textDecoration: 'none',
    fontWeight: 500,
    fontSize: '16px',
    position: 'relative',
    transition: 'color 0.2s ease',
  }

  const linkHover = {
    ...linkStyle,
    ':hover': { color: '#000' }
  }

  const buttonStyle = {
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #111 0%, #333 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 600,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  }

  const authBoxStyle = {
    padding: '10px 20px',
    border: '2px solid #333',
    borderRadius: '8px',
    textDecoration: 'none',
    color: '#111',
    fontWeight: 600,
    fontSize: '14px',
    backgroundColor: '#fff',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
  }

  return (
    <nav style={navStyle}>
      <Link href="/" style={logoStyle}>IIIT H‑Store</Link>
      <div style={linkGroup}>
        <Link href="/products" style={linkStyle}>Products</Link>
        <Link href="/cart" style={linkStyle}>Cart</Link>

        {loggedIn ? (
          <>
            {userType === 'seller' && (
              <Link href="/seller/dashboard" style={authBoxStyle}>
                Dashboard
              </Link>
            )}
            {userType === 'customer' && (
              <Link href="/customer/profile" style={authBoxStyle}>
                Profile
              </Link>
            )}
            <button onClick={handleLogout} style={buttonStyle}>Logout</button>
          </>
        ) : (
          <>
            <Link href="/login/customer" style={authBoxStyle}>
              Customer Login / Register
            </Link>
            <Link href="/login/seller" style={authBoxStyle}>
              Seller Login / Register
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
