'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Send, X } from 'lucide-react'
import { linkifyCatalogMentions } from '@/lib/catalog'
import { cn } from '@/lib/utils'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const SUGGESTED_PROMPTS = [
  'Which compounds support recovery?',
  'What is in stock for weight research?',
  'Compare Reta and Tirz',
  'What is Glow used for?',
]

export function ProductChat({ open, onClose, onNavigate }: { open: boolean; onClose: () => void; onNavigate?: () => void }) {
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

  async function sendMessage(question: string) {
    const trimmed = question.trim()
    if (!trimmed || loading) return

    const nextMessages = [...messages, { role: 'user' as const, content: trimmed }]
    setMessages(nextMessages)
    setInput('')
    setLoading(true)
    setMessages((current) => [...current, { role: 'assistant', content: '' }])

    try {
      const response = await fetch('/api/product-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      })

      if (!response.ok || !response.body) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null
        throw new Error(data?.error ?? 'The product concierge is unavailable.')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let reply = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        reply += decoder.decode(value, { stream: true })
        const nextReply = reply
        setMessages((current) => {
          const copy = [...current]
          copy[copy.length - 1] = { role: 'assistant', content: nextReply }
          return copy
        })
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'I could not connect right now.'
      setMessages((current) => {
        const copy = [...current]
        copy[copy.length - 1] = { role: 'assistant', content: message }
        return copy
      })
    } finally {
      setLoading(false)
    }
  }

  const showPrompts = messages.length === 1 && !loading

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
            {message.role === 'assistant' ? (
              <ChatRichText content={message.content} onNavigate={onNavigate} />
            ) : (
              message.content
            )}
          </div>
        ))}
        {showPrompts ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => sendMessage(prompt)}
                className="rounded-full border border-border bg-white px-3 py-2 text-left text-xs font-medium text-slate-700"
              >
                {prompt}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          void sendMessage(input)
        }}
        className="flex gap-2 border-t border-slate-200/80 p-3"
      >
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

function ChatRichText({ content, onNavigate }: { content: string; onNavigate?: () => void }) {
  if (!content) return <span className="text-muted-foreground">Reviewing the catalog...</span>

  return (
    <span className="whitespace-pre-wrap">
      {linkifyCatalogMentions(content).map((part, index) =>
        part.type === 'link' && part.href ? (
          <Link
            key={`${part.href}-${index}`}
            href={part.href}
            onClick={onNavigate}
            className="font-medium text-brand underline underline-offset-2"
          >
            {part.text}
          </Link>
        ) : (
          <span key={`${part.text}-${index}`}>{part.text}</span>
        ),
      )}
    </span>
  )
}
