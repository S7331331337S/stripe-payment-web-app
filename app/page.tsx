'use client'

import { useState } from 'react'
import { Package } from 'lucide-react'
import { ProductCard } from '@/components/product-card'
import { CartDrawer } from '@/components/cart-drawer'
import { CheckoutModal } from '@/components/checkout-modal'
import { PRODUCTS } from '@/lib/products'
import type { Product } from '@/lib/products'

interface CartItem extends Product {
  quantity: number
}

export default function StorefrontPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId))
  }

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId)
      return
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity } : item)),
    )
  }

  const handleCheckout = () => {
    if (cartItems.length > 0) setIsCheckoutOpen(true)
  }

  const handleCloseCheckout = () => {
    setIsCheckoutOpen(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-primary p-2">
                <Package className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">G&apos;s Stock</h1>
                <p className="text-xs text-muted-foreground">Premium Peptides & Health</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 pb-24">
        {/* Hero Section */}
        <section className="mb-12 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 p-6 sm:p-8">
          <h2 className="mb-2 text-3xl font-bold text-foreground sm:text-4xl">
            Quality Peptides & Health Products
          </h2>
          <p className="mb-4 text-muted-foreground">
            Curated selection of premium peptides and wellness compounds for research purposes. All products sourced and tested for quality.
          </p>
          <div className="text-sm text-muted-foreground">
            <p>📦 Fast Shipping • 🔬 Research Grade • ✓ Verified Quality</p>
          </div>
        </section>

        {/* Products Grid */}
        <section>
          <h2 className="mb-6 text-2xl font-bold text-foreground">Our Catalog</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
            ))}
          </div>
        </section>

        {/* Info Section */}
        <section className="mt-12 grid gap-6 rounded-lg border border-border bg-card p-6 sm:grid-cols-3">
          <div>
            <h3 className="mb-2 font-semibold text-foreground">Research Grade</h3>
            <p className="text-sm text-muted-foreground">
              All products are for research purposes only and meet strict quality standards.
            </p>
          </div>
          <div>
            <h3 className="mb-2 font-semibold text-foreground">Secure Checkout</h3>
            <p className="text-sm text-muted-foreground">
              Powered by Stripe for safe and secure payment processing.
            </p>
          </div>
          <div>
            <h3 className="mb-2 font-semibold text-foreground">Expert Support</h3>
            <p className="text-sm text-muted-foreground">
              Questions about products? Check links for more detailed information.
            </p>
          </div>
        </section>
      </main>

      {/* Cart and Checkout */}
      <CartDrawer
        items={cartItems}
        onRemoveItem={handleRemoveItem}
        onUpdateQuantity={handleUpdateQuantity}
        onCheckout={handleCheckout}
      />
      <CheckoutModal
        items={cartItems.map(({ id, quantity }) => ({ productId: id, quantity }))}
        isOpen={isCheckoutOpen}
        onClose={handleCloseCheckout}
      />
    </div>
  )
}
