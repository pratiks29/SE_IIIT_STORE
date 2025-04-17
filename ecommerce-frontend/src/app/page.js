// src/app/page.js
import Link from 'next/link'

async function getProducts() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL
  if (!base) {
    throw new Error(
      'NEXT_PUBLIC_API_BASE_URL is not defined – check your .env.local and restart the server'
    )
  }
  const url = `${base.replace(/\/$/, '')}/products`

  let res
  try {
    res = await fetch(url, { cache: 'no-store' })
  } catch (err) {
    throw new Error(`Network error fetching products from ${url}: ${err.message}`)
  }

  if (res.ok) {
    return res.json()
  }

  if (res.status === 400) {
    const body = await res.json().catch(() => null)
    if (body?.message?.includes('No products in catalog')) {
      return []
    }
  }

  const text = await res.text().catch(() => '')
  throw new Error(`Failed to fetch products: ${res.status} ${res.statusText} – ${text}`)
}

export default async function HomePage() {
  const products = await getProducts()

  return (
    <div>
      <h1
  className="text-5xl sm:text-6xl font-extrabold mb-12 text-center tracking-tight bg-gradient-to-r from-black via-gray-800 to-gray-600 bg-clip-text text-transparent"
>
  Featured Products
</h1>


      {products.length === 0 ? (
        <p className="text-gray-600 text-lg">No products available at the moment.</p>
      ) : (
        <div className="h-[85vh] overflow-y-auto px-6 space-y-10">
  {products.map((product) => (
    <Link
      key={product.productId}
      href={`/products/${product.productId}`}
      className="block border rounded-3xl p-12 bg-white shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all min-h-[40vh]"
    >
      <h2 className="text-3xl font-bold">{product.productName}</h2>
      <p className="text-gray-700 text-xl mt-6">
        ₹{product.price.toFixed(2)}
      </p>
    </Link>
  ))}
</div>

      
      )}
    </div>
  )
}
