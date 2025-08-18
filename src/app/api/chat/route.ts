import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { CHATBOT_PERSONALITIES } from '@/services/ai-service'

// Rate limiting - simple in-memory store (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(identifier: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const windowMs = 60000 // 1 minute
  const maxRequests = 20 // 20 requests per minute

  const userLimit = rateLimitStore.get(identifier)
  
  if (!userLimit || now > userLimit.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs })
    return { allowed: true, remaining: maxRequests - 1 }
  }

  if (userLimit.count >= maxRequests) {
    return { allowed: false, remaining: 0 }
  }

  userLimit.count++
  return { allowed: true, remaining: maxRequests - userLimit.count }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages, personality } = body

    // Validate input
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 })
    }

    // Rate limiting
    const clientIp = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    const rateLimit = checkRateLimit(clientIp)
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }

    // Check for OpenAI API key
    const openaiKey = process.env.OPENAI_API_KEY
    if (!openaiKey || openaiKey === 'your_openai_api_key_here') {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    // Initialize OpenAI
    const openai = new OpenAI({ apiKey: openaiKey })

    // Get personality data
    const personalityData = personality ? CHATBOT_PERSONALITIES[personality as keyof typeof CHATBOT_PERSONALITIES] : null
    
    // Prepare messages with system prompt
    const systemMessage = personalityData 
      ? { role: 'system' as const, content: personalityData.systemPrompt }
      : { role: 'system' as const, content: 'You are a helpful AI assistant.' }

    const chatMessages = [systemMessage, ...messages]

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: chatMessages,
      max_tokens: 1000,
      temperature: 0.7,
      stream: false,
    })

    const response = completion.choices[0]?.message?.content || 'No response generated.'

    // Calculate tokens used (approximate)
    const tokensUsed = completion.usage?.total_tokens || 0

    return NextResponse.json({
      response,
      tokensUsed,
      remaining: rateLimit.remaining
    })

  } catch (error) {
    console.error('Chat API error:', error)
    
    if (error instanceof Error && error.message.includes('rate limit')) {
      return NextResponse.json(
        { error: 'OpenAI rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}