// src/app/orders/[id]/page.js
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function OrderDetailPage({ params }) {
  const { id } = params
  const token = cookies().get('token')?.value

  // Redirect to login if not authenticated
  if (!token) {
    redirect('/login/customer')
  }

  // Fetch order detail
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/${id}`,
    {
      headers: { token },
      cache: 'no-store',
    }
  )
  if (!res.ok) {
    throw new Error('Failed to load order details')
  }
  const order = await res.json()

  // Mask card number (show only last 4 digits)
  const card = order.cardNumber
  const maskedCard = card
    ? '**** **** **** ' + card.slice(-4)
    : 'N/A'

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">
        Order #{order.orderId}
      </h1>

      <div className="space-y-1">
        <p>
          <span className="font-semibold">Date:</span>{' '}
          {new Date(order.date).toLocaleDateString()}
        </p>
        <p>
          <span className="font-semibold">Status:</span>{' '}
          {order.orderStatus}
        </p>
        <p>
          <span className="font-semibold">Total:</span>{' '}
          ₹{order.total.toFixed(2)}
        </p>
        <p>
          <span className="font-semibold">Paid with:</span>{' '}
          {maskedCard}
        </p>
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-2">
          Items
        </h2>
        <ul className="divide-y">
          {order.ordercartItems.map((item) => (
            <li
              key={item.cartItemId}
              className="py-2 flex justify-between"
            >
              <span>
                {item.cartProduct.productName} x{' '}
                {item.cartItemQuantity}
              </span>
              <span className="font-medium">
                ₹
                {(
                  item.cartProduct.price *
                  item.cartItemQuantity
                ).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">
          Shipping Address
        </h2>
        <div className="border p-4 rounded">
          <p>
            {order.address.buildingName},{' '}
            {order.address.streetNo}, {order.address.locality}
          </p>
          <p>
            {order.address.city} – {order.address.pincode},{' '}
            {order.address.state}
          </p>
        </div>
      </section>
    </div>
  )
}
