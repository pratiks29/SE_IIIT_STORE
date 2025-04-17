// src/app/orders/page.js
import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function OrdersPage() {
  // 1. Get auth token from cookies
  const token = cookies().get('token')?.value
  if (!token) {
    // Redirect to customer login if not authenticated
    redirect('/login/customer')
  }

  // 2. Fetch the list of orders for the current customer
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/customer/orders`,
    {
      headers: { token },
      cache: 'no-store',
    }
  )
  if (!res.ok) {
    throw new Error('Failed to load orders')
  }
  const orders = await res.json()

  // 3. Render the orders list
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">My Orders</h1>

      {orders.length === 0 ? (
        <p>You have not placed any orders yet.</p>
      ) : (
        <ul className="divide-y">
          {orders.map((order) => (
            <li
              key={order.orderId}
              className="py-4 flex justify-between items-center"
            >
              <div>
                <Link
                  href={`/orders/${order.orderId}`}
                  className="text-lg font-semibold text-blue-600 hover:underline"
                >
                  Order #{order.orderId}
                </Link>
                <p className="text-sm text-gray-600">
                  {new Date(order.date).toLocaleDateString()} —{' '}
                  <span className="capitalize">{order.orderStatus.toLowerCase()}</span>
                </p>
              </div>
              <div className="font-medium">
                ₹{order.total.toFixed(2)}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
