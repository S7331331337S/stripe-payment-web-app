'use client'

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

export type AppPanel = 'none' | 'cart' | 'chat'

interface AppUIContextValue {
  panel: AppPanel
  isCheckoutOpen: boolean
  openCart: () => void
  openChat: () => void
  closePanel: () => void
  openCheckout: () => void
  closeCheckout: () => void
}

const AppUIContext = createContext<AppUIContextValue | null>(null)

export function AppUIProvider({ children }: { children: ReactNode }) {
  const [panel, setPanel] = useState<AppPanel>('none')
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  const value = useMemo<AppUIContextValue>(
    () => ({
      panel,
      isCheckoutOpen,
      openCart: () => {
        setIsCheckoutOpen(false)
        setPanel('cart')
      },
      openChat: () => {
        setIsCheckoutOpen(false)
        setPanel('chat')
      },
      closePanel: () => setPanel('none'),
      openCheckout: () => {
        setPanel('none')
        setIsCheckoutOpen(true)
      },
      closeCheckout: () => setIsCheckoutOpen(false),
    }),
    [panel, isCheckoutOpen],
  )

  return <AppUIContext.Provider value={value}>{children}</AppUIContext.Provider>
}

export function useAppUI() {
  const context = useContext(AppUIContext)
  if (!context) {
    throw new Error('useAppUI must be used within AppUIProvider')
  }
  return context
}
