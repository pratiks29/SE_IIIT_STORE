// src/app/customer/profile/page.js
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  // 1. Get the auth token from cookies
  const token = cookies().get('token')?.value
  if (!token) {
    // Redirect to login if not authenticated
    redirect('/login/customer')
  }

  // 2. Fetch current customer profile
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/customer/current`,
    {
      headers: { token },
      cache: 'no-store',
    }
  )
  if (!res.ok) {
    throw new Error('Failed to load customer profile')
  }
  const customer = await res.json()

  // 3. Render profile
  return (
    <div className="w-full max-w-7xl mx-auto mt-12 bg-white rounded-3xl shadow-xl px-[200px] py-10">
  <h1 className="text-4xl font-extrabold mb-10 text-center tracking-tight bg-gradient-to-r from-black via-gray-800 to-gray-600 bg-clip-text text-transparent">
    My Profile
  </h1>

  <div className="space-y-6 text-lg text-gray-800">
    <div className="flex justify-between border-b pb-3">
      <span className="font-semibold">Name:</span>
      <span>{customer.firstName} {customer.lastName}</span>
    </div>

    <div className="flex justify-between border-b pb-3">
      <span className="font-semibold">Email:</span>
      <span>{customer.emailId}</span>
    </div>

    <div className="flex justify-between border-b pb-3">
      <span className="font-semibold">Mobile:</span>
      <span>{customer.mobileNo}</span>
    </div>

    <div className="flex justify-between border-b pb-3">
      <span className="font-semibold">Member since:</span>
      <span>{new Date(customer.createdOn).toLocaleDateString()}</span>
    </div>

    {customer.creditCard && (
      <div className="flex justify-between border-b pb-3">
        <span className="font-semibold">Card:</span>
        <span>
          **** **** **** {customer.creditCard.cardNumber.slice(-4)} <br />
          <span className="text-sm text-gray-500">
            valid until {customer.creditCard.cardValidity}
          </span>
        </span>
      </div>
    )}

    {customer.address &&
      Object.entries(customer.address).map(([type, addr]) => (
        <div
          key={type}
          className="border border-gray-200 rounded-xl p-6 bg-gray-50"
        >
          <h2 className="font-semibold capitalize mb-2 text-gray-700">
            {type} Address
          </h2>
          <p className="text-gray-800">
            {addr.buildingName}, {addr.streetNo}, {addr.locality}
          </p>
          <p className="text-gray-800">
            {addr.city} – {addr.pincode}, {addr.state}
          </p>
        </div>
      ))}
  </div>
</div>

  
  )
}
