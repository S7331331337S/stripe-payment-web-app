'use client'

import { useRef, useEffect, useState } from 'react'
import { Send, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function ProductChat({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello. I can answer questions about the catalog, product details, stock, and ordering.',
    },
  ])
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading, open])

  async function sendMessage(event: React.FormEvent) {
    event.preventDefault()
    const question = input.trim()
    if (!question || loading) return

    const nextMessages = [...messages, { role: 'user' as const, content: question }]
    setMessages(nextMessages)
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/product-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      })
      const data = (await response.json().catch(() => null)) as { message?: string; error?: string } | null
      const reply = data?.message
      if (!response.ok || !reply) {
        throw new Error(data?.error ?? 'The product concierge is unavailable.')
      }

      setMessages((current) => [...current, { role: 'assistant', content: reply }])
    } catch (error) {
      const message = error instanceof Error ? error.message : 'I could not connect right now.'
      setMessages((current) => [...current, { role: 'assistant', content: message }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <section
      aria-label="Product concierge"
      aria-hidden={!open}
      inert={!open}
      className={cn(
        'fixed inset-x-0 z-[46] mx-auto flex w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-slate-200/80 bg-background shadow-[0_-18px_50px_-20px_rgba(15,23,42,0.35)] transition-transform duration-300 ease-out',
        'bottom-[calc(4.25rem+env(safe-area-inset-bottom))] h-[min(36rem,calc(100dvh-6.5rem-env(safe-area-inset-bottom)))]',
        open ? 'translate-y-0' : 'pointer-events-none translate-y-[120%]',
      )}
    >
      <div className="flex items-center justify-between px-5 pb-3 pt-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand">G&apos;s Stock</p>
          <h2 className="text-lg font-semibold tracking-tight">Ask the catalog</h2>
        </div>
        <button
          type="button"
          aria-label="Close chat"
          onClick={onClose}
          className="flex h-11 w-11 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div ref={listRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 pb-3" aria-live="polite">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={cn(
              'max-w-[88%] rounded-2xl px-3 py-2 text-sm leading-6',
              message.role === 'user' ? 'ml-auto bg-foreground text-background' : 'bg-brand-soft text-foreground',
            )}
          >
            {message.content}
          </div>
        ))}
        {loading && <div className="max-w-[88%] rounded-2xl bg-brand-soft px-3 py-2 text-sm text-muted-foreground">Reviewing the catalog...</div>}
      </div>
      <form onSubmit={sendMessage} className="flex gap-2 border-t border-slate-200/80 p-3">
        <input
          aria-label="Ask about products"
          disabled={loading}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask about a product..."
          className="min-h-11 min-w-0 flex-1 rounded-2xl border border-border bg-card px-3 text-base outline-none focus:border-brand disabled:bg-muted"
        />
        <button
          type="submit"
          aria-label="Send question"
          disabled={loading || !input.trim()}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </section>
  )
}
