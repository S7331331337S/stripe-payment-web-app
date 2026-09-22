'use client'

import { useState } from 'react'
import { ShoppingCart, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Product } from '@/lib/products'

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = () => {
    onAddToCart(product)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  const priceInDollars = (product.priceInCents / 100).toFixed(2)
  const stockStatus = product.stock > 0 ? 'In Stock' : 'Out of Stock'
  const stockColor = product.stock > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 transition-all hover:shadow-lg dark:border-border">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{product.name}</h3>
          <p className="text-sm text-muted-foreground">{product.description}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1">
        {product.benefits.split(',').map((benefit) => (
          <span
            key={benefit.trim()}
            className="inline-block rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
          >
            {benefit.trim()}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-primary">${priceInDollars}</span>
          <span className={`text-xs font-medium ${stockColor}`}>{stockStatus}</span>
        </div>
        <div className="text-xs text-muted-foreground">Stock: {product.stock}</div>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          variant={isAdded ? 'default' : 'outline'}
          className="flex-1"
          size="sm"
        >
          <ShoppingCart className="h-4 w-4" />
          {isAdded ? 'Added!' : 'Add to Cart'}
        </Button>
        {product.infoLink && (
          <a
            href={product.infoLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Learn more about ${product.name}`}
            className="inline-flex h-7 items-center justify-center rounded-lg border border-border bg-background px-2 text-sm transition-colors hover:bg-muted"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>
    </div>
  )
}
