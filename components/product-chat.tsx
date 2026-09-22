'use client'

import { useEffect, useRef, useState } from 'react'
import { MessageCircle, Send, X } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const GREETING: Message = {
  role: 'assistant',
  content: 'Hello. I can answer questions about the catalog, product details, stock, and ordering.',
}

export function ProductChat() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([GREETING])
  const transcriptRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Keep the newest reply in view as the conversation grows.
  useEffect(() => {
    transcriptRef.current?.scrollTo({ top: transcriptRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (!open) return
    inputRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  async function sendMessage(event: React.FormEvent) {
    event.preventDefault()
    const question = input.trim()
    if (!question || loading) return

    const nextMessages: Message[] = [...messages, { role: 'user', content: question }]
    setMessages(nextMessages)
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/product-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      })
      const data = (await response.json().catch(() => null)) as
        | { message?: string; error?: string }
        | null

      // The route reports both successes and handled failures in `message`;
      // a non-2xx status means the text is an explanation, not an answer.
      if (!response.ok) {
        throw new Error(
          data?.error ?? data?.message ?? 'The product concierge is unavailable right now.',
        )
      }
      if (!data?.message) {
        throw new Error('I could not answer that just now.')
      }

      setMessages((current) => [...current, { role: 'assistant', content: data.message! }])
    } catch (error) {
      const content =
        error instanceof Error
          ? error.message
          : 'I could not connect right now. Please review the product detail sheets.'
      setMessages((current) => [...current, { role: 'assistant', content }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-40 sm:bottom-7 sm:right-7">
      {open && (
        <section
          aria-label="Product concierge"
          className="mb-3 flex h-[min(32rem,calc(100vh-7rem))] w-[min(22rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white/95 shadow-[0_24px_80px_-25px_rgba(15,23,42,.35)] backdrop-blur-xl"
        >
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.18em] text-indigo-700">
                G&apos;s Stock
              </p>
              <h2 className="mt-1 text-sm font-semibold text-slate-950">Product concierge</h2>
            </div>
            <button
              type="button"
              aria-label="Close chat"
              onClick={() => setOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={transcriptRef} aria-live="polite" className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((message, index) => (
              <p
                key={`${message.role}-${index}`}
                className={`max-w-[88%] rounded-2xl px-3 py-2 text-sm leading-6 ${
                  message.role === 'user'
                    ? 'ml-auto bg-slate-950 text-white'
                    : 'bg-indigo-50 text-slate-700'
                }`}
              >
                {message.content}
              </p>
            ))}
            {loading && (
              <p className="max-w-[88%] rounded-2xl bg-indigo-50 px-3 py-2 text-sm text-slate-500">
                Reviewing the catalog…
              </p>
            )}
          </div>

          <form onSubmit={sendMessage} className="flex gap-2 border-t border-slate-200 p-3">
            <input
              ref={inputRef}
              aria-label="Ask about products"
              value={input}
              disabled={loading}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about a product…"
              className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 text-base outline-none focus:border-indigo-500 disabled:bg-slate-50"
            />
            <button
              type="submit"
              aria-label="Send question"
              disabled={loading || !input.trim()}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-label={open ? 'Close product concierge' : 'Open product concierge'}
        className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-950 text-white shadow-lg transition-transform hover:scale-105"
      >
        <MessageCircle className="h-5 w-5" />
      </button>
    </div>
  )
}
