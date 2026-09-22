import { generateText } from 'ai'
import { PRODUCTS } from '@/lib/products'

export const runtime = 'nodejs'

const MAX_MESSAGES = 8
const MAX_MESSAGE_CHARS = 1_000
const RATE_LIMIT = { windowMs: 60_000, maxRequests: 12 }

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

/**
 * Per-instance rate limiter. Good enough to stop a single browser tab (or a
 * casual script) from burning through model credits; it does not coordinate
 * across serverless instances. Swap in a shared store such as Vercel KV or
 * Upstash before relying on it under real traffic.
 */
const hits = new Map<string, { count: number; resetAt: number }>()

function isRateLimited(key: string): boolean {
  const now = Date.now()
  const entry = hits.get(key)

  if (!entry || entry.resetAt <= now) {
    hits.set(key, { count: 1, resetAt: now + RATE_LIMIT.windowMs })
    if (hits.size > 5_000) {
      for (const [candidate, value] of hits) {
        if (value.resetAt <= now) hits.delete(candidate)
      }
    }
    return false
  }

  entry.count += 1
  return entry.count > RATE_LIMIT.maxRequests
}

/**
 * Failure responses carry the text under both `message` and `error`: the chat
 * client reads `error` first and falls back to `message`. Emitting both keeps
 * the panel showing the real reason instead of a generic fallback.
 */
function failure(text: string, status: number, headers?: HeadersInit) {
  return Response.json({ message: text, error: text }, { status, headers })
}

function parseMessages(value: unknown): ChatMessage[] {
  if (!Array.isArray(value)) return []
  const messages: ChatMessage[] = []
  for (const entry of value.slice(-MAX_MESSAGES)) {
    if (typeof entry !== 'object' || entry === null) continue
    const { role, content } = entry as { role?: unknown; content?: unknown }
    if (role !== 'user' && role !== 'assistant') continue
    if (typeof content !== 'string') continue
    const trimmed = content.trim()
    if (!trimmed) continue
    messages.push({ role, content: trimmed.slice(0, MAX_MESSAGE_CHARS) })
  }
  return messages
}

export async function POST(request: Request) {
  const clientKey =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'

  if (isRateLimited(clientKey)) {
    return failure(
      'You are sending questions a little quickly. Please wait a moment and try again.',
      429,
      { 'Retry-After': '60' },
    )
  }

  // The gateway is also satisfied by Vercel OIDC in production, so only treat a
  // missing key as fatal outside of Vercel.
  if (!process.env.AI_GATEWAY_API_KEY && !process.env.VERCEL) {
    return failure(
      'The product concierge is not configured on this deployment. Please browse the detail sheets in the meantime.',
      503,
    )
  }

  let messages: ChatMessage[]
  try {
    const body: unknown = await request.json()
    messages = parseMessages((body as { messages?: unknown })?.messages)
  } catch {
    return failure('That request could not be read.', 400)
  }

  if (messages.length === 0) {
    return failure('Please include a question.', 400)
  }

  const catalog = PRODUCTS.map(
    (product) =>
      `${product.name}: ${product.description}; benefits: ${product.benefits}; price: $${(
        product.priceInCents / 100
      ).toFixed(2)}; stock: ${product.stock}; detail page: /products/${product.id}`,
  ).join('\n')

  try {
    const result = await generateText({
      model: 'openai/gpt-5-mini',
      system: `You are the G's Stock product concierge. Answer only questions about this catalog and the ordering process. Be concise, calm, clinical, and trustworthy. Never make medical claims, diagnose, recommend a dose or a protocol, suggest human use, or invent details that are not in the catalog below. State that all products are for research use only, and point customers to the relevant internal detail page when useful. If a question falls outside the catalog and ordering, say so briefly. Catalog:\n${catalog}`,
      messages,
    })

    return Response.json({ message: result.text })
  } catch (error) {
    console.error('[product-chat] generation failed', error)
    return failure('I could not answer that just now. Please review the product detail sheets.', 502)
  }
}
