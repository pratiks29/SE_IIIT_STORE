import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AddProductForm from '../../../components/AddProductForm'

export const dynamic = 'force-dynamic'

export default async function SellerDashboardPage() {
  // 1. Get auth token
  const token = cookies().get('token')?.value
  if (!token) redirect('/login/seller')

  // 2. Fetch seller profile
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/seller/current`,
    { headers: { token }, cache: 'no-store' }
  )
  if (!res.ok) throw new Error('Failed to load seller profile')
  const seller = await res.json()

  // 3. Render seller info + add-product form
  return (
    <div style={{
      maxWidth: '960px',
      margin: '60px auto',
      padding: '40px',
      backgroundColor: '#fff',
      borderRadius: '24px',
      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08)',
      fontFamily: "'Inter', sans-serif",
      color: '#111'
    }}>
      <h1 style={{
        textAlign: 'center',
        fontSize: '36px',
        fontWeight: '800',
        marginBottom: '40px',
        background: 'linear-gradient(to right, #000, #555)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        Welcome, {seller.firstName} {seller.lastName}
      </h1>
    
      <div>
        <AddProductForm />
      </div>
    </div>
    
  )
}
