import { generateText } from 'ai'
import { PRODUCTS } from '@/lib/products'

export async function POST(request: Request) {
  const body = await request.json() as { messages?: Array<{ role: 'user' | 'assistant'; content: string }> }
  const messages = Array.isArray(body.messages) ? body.messages.slice(-8) : []
  const catalog = PRODUCTS.map((product) => `${product.name}: ${product.description}; benefits: ${product.benefits}; price: $${(product.priceInCents / 100).toFixed(2)}; stock: ${product.stock}`).join('\n')
  const result = await generateText({
    model: 'openai/gpt-5-mini',
    system: `You are the G's Stock product concierge. Answer only questions about this catalog and ordering process. Be concise, calm, clinical, and trustworthy. Never make medical claims, diagnose, recommend use, or invent details. Explain that all products are for research use only and direct customers to the relevant internal detail page when useful. Catalog:\n${catalog}`,
    messages: messages.map((message) => ({ role: message.role, content: message.content })),
  })
  return Response.json({ message: result.text })
}
