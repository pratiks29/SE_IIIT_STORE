// app/layout.js or wherever RootLayout is used
import './globals.css'
import NavBar from '../components/Navbar'

export const metadata = {
  title: 'E‑Commerce Store',
  description: 'Shop the latest products in our E‑Commerce application',
}

export default function RootLayout({ children }) {
  const bodyStyle = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    margin: 0,
    background: 'linear-gradient(120deg, #f5f7fa 0%, #c3cfe2 100%)',
    color: '#111',
    fontFamily: "'Inter', sans-serif",
    scrollBehavior: 'smooth',
    WebkitFontSmoothing: 'antialiased',
  }

  const mainStyle = {
    flex: 1,
    maxWidth: '2600px', // 💥 increased from 1280px
    margin: '40px auto',
    padding: '40px 48px', // 💥 more internal spacing
    backgroundColor: '#fff',
    borderRadius: '24px', // 💥 smoother curves
    boxShadow: '0 12px 36px rgba(0, 0, 0, 0.08)', // 💥 deeper elevation
    transition: 'all 0.3s ease',
  }
  

  const footerStyle = {
    borderTop: '2px solid rgba(0,0,0,0.1)',
    padding: '20px 0',
    textAlign: 'center',
    fontSize: '14px',
    color: '#444',
    fontWeight: 500,
    background: 'rgba(255, 255, 255, 0.4)',
    backdropFilter: 'blur(8px)',
    boxShadow: '0 -2px 12px rgba(0,0,0,0.08)',
  }

  return (
    <html lang="en">
      <head />
      <body style={bodyStyle}>
        <header>
          <NavBar />
        </header>
        <main style={mainStyle}>{children}</main>
        <footer style={footerStyle}>
          &copy; {new Date().getFullYear()} E‑Store. All rights reserved.
        </footer>
      </body>
    </html>
  )
}
