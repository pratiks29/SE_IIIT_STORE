// src/app/products/page.js
import Link from 'next/link'

export const dynamic = 'force-dynamic'

async function fetchProducts() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL
  if (!base) {
    throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined – check your .env.local')
  }
  const url = `${base.replace(/\/$/, '')}/products`

  let res
  try {
    res = await fetch(url, { cache: 'no-store' })
  } catch (err) {
    throw new Error(`Network error fetching products: ${err.message}`)
  }

  if (res.ok) {
    return res.json()
  }

  // Treat 400 “No products in catalog” as an empty list
  if (res.status === 400) {
    const body = await res.json().catch(() => null)
    if (body?.message?.includes('No products in catalog')) {
      return []
    }
  }

  const text = await res.text().catch(() => '')
  throw new Error(
    `Failed to fetch products: ${res.status} ${res.statusText} – ${text}`
  )
}

export default async function ProductsPage() {
  const products = await fetchProducts()

  return (
    <div className="w-full max-w-[1600px] mx-auto bg-white rounded-[32px] px-6 md:px-12 py-12 shadow-md">
  <h1 className="text-5xl sm:text-6xl font-extrabold mb-12 text-center tracking-tight bg-gradient-to-r from-black via-gray-800 to-gray-600 bg-clip-text text-transparent">
    All Products
  </h1>

  {products.length === 0 ? (
    <p className="text-gray-600 text-center text-lg">
      No products available at the moment.
    </p>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
      {products.map((product) => (
        <Link
          key={product.productId}
          href={`/products/${product.productId}`}
          className="block bg-white border border-gray-200 rounded-3xl p-10 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all"
        >
          <h2 className="text-3xl font-bold mb-4 text-gray-900">
            {product.productName}
          </h2>
          <p className="text-xl text-gray-700 mb-2">
            ₹{product.price.toFixed(2)}
          </p>
          <p className="text-sm text-gray-500 capitalize">
            {product.category} • {product.status.toLowerCase()}
          </p>
        </Link>
      ))}
    </div>
  )}
</div>

  )
}
