// src/app/seller/products/page.js
import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function SellerProductsPage() {
  const token = cookies().get('token')?.value
  if (!token) redirect('/login/seller')

  // fetch seller to get sellerId
  const sellerRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/seller/current`,
    { headers: { token }, cache: 'no-store' }
  )
  if (!sellerRes.ok) throw new Error('Failed to load seller info')
  const seller = await sellerRes.json()

  // fetch this seller’s products
  const productsRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/seller/${seller.sellerId}`,
    { cache: 'no-store' }
  )
  if (!productsRes.ok) throw new Error('Failed to load products')
  const products = await productsRes.json()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Products</h1>
        <Link
          href="/seller/products/new"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add New Product
        </Link>
      </div>

      {products.length === 0 ? (
        <p>You have no products yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <div
              key={p.productId}
              className="border rounded-lg p-4 hover:shadow-md transition"
            >
              <h2 className="font-semibold text-lg">{p.productName}</h2>
              <p className="text-gray-600">₹{p.price.toFixed(2)}</p>
              <p className="text-sm text-gray-500 capitalize">
                {p.category}
              </p>
              <Link
                href={`/seller/products/${p.productId}`}
                className="mt-3 inline-block text-blue-600 hover:underline"
              >
                Edit Product
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
