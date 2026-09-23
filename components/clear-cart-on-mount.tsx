'use client'

import { useEffect } from 'react'
import { useCart } from '@/components/cart-provider'

/**
 * Empties the cart once the order is confirmed. Rendered only on the successful
 * branch of /order/complete, so an abandoned or failed payment keeps the cart.
 */
export function ClearCartOnMount() {
  const { clearCart } = useCart()
  useEffect(() => {
    clearCart()
  }, [clearCart])
  return null
}
