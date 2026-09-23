import { productInitials, productMarkClass } from '@/lib/catalog'
import { cn } from '@/lib/utils'
import type { Product } from '@/lib/products'

export function ProductMark({
  product,
  size = 'md',
}: {
  product: Pick<Product, 'id' | 'name'>
  size?: 'sm' | 'md' | 'lg'
}) {
  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br font-semibold tracking-tight',
        productMarkClass(product.id),
        size === 'sm' && 'h-10 w-10 text-[11px]',
        size === 'md' && 'h-12 w-12 text-xs',
        size === 'lg' && 'h-16 w-16 text-sm',
      )}
    >
      {productInitials(product.name)}
    </span>
  )
}
