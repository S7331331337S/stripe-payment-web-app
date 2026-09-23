import { streamText } from 'ai'
import { PRODUCTS } from '@/lib/products'

type ChatMessage = { role: 'user' | 'assistant'; content: string }

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { messages?: ChatMessage[] }
    const messages = Array.isArray(body.messages)
      ? body.messages
          .filter(
            (message): message is ChatMessage =>
              (message.role === 'user' || message.role === 'assistant') &&
              typeof message.content === 'string' &&
              message.content.trim().length > 0,
          )
          .slice(-8)
      : []

    if (messages.length === 0) {
      return Response.json({ error: 'Send a question about the catalog.' }, { status: 400 })
    }

    const catalog = PRODUCTS.map(
      (product) =>
        `${product.name} (id: ${product.id}, path: /products/${product.id}): ${product.description}; benefits: ${product.benefits}; price: $${(product.priceInCents / 100).toFixed(2)}; stock: ${product.stock}`,
    ).join('\n')

    const result = streamText({
      model: 'openai/gpt-5-mini',
      system: `You are the G's Stock product concierge. Answer only questions about this catalog and ordering process. Be concise, calm, clinical, and trustworthy. Never make medical claims, diagnose, recommend use, or invent details. Explain that all products are for research use only. When you mention a catalog item, include a markdown link to its detail page using the product path, for example [BPC157 10mg](/products/bpc157). Catalog:\n${catalog}`,
      messages,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error('Product concierge failed', error)
    return Response.json({ error: 'The product concierge is temporarily unavailable. Please try again shortly.' }, { status: 503 })
  }
}
