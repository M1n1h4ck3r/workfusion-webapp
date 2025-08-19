import { NextRequest, NextResponse } from 'next/server'
import { builderConfig } from '@/lib/builder-config'
import crypto from 'crypto'

// Webhook handler for Builder.io content changes
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-builder-signature')
    
    // Verify webhook signature
    if (!verifyWebhookSignature(body, signature)) {
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      )
    }

    const event = JSON.parse(body)
    
    // Handle different webhook events
    switch (event.type) {
      case 'content.published':
        await handleContentPublished(event.data)
        break
      
      case 'content.unpublished':
        await handleContentUnpublished(event.data)
        break
      
      case 'content.archived':
        await handleContentArchived(event.data)
        break
      
      case 'model.updated':
        await handleModelUpdated(event.data)
        break
      
      default:
        console.log('Unhandled webhook event:', event.type)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Builder webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

function verifyWebhookSignature(body: string, signature: string | null): boolean {
  if (!signature || !builderConfig.webhookSecret) {
    return false
  }

  const expectedSignature = crypto
    .createHmac('sha256', builderConfig.webhookSecret)
    .update(body)
    .digest('hex')

  return signature === `sha256=${expectedSignature}`
}

async function handleContentPublished(data: any) {
  console.log('Content published:', data)
  
  // Trigger cache revalidation
  await revalidateContent(data.modelName, data.url)
  
  // Optional: Trigger deployment
  if (process.env.VERCEL_DEPLOY_HOOK) {
    await fetch(process.env.VERCEL_DEPLOY_HOOK, { method: 'POST' })
  }
  
  // Optional: Send notification
  if (process.env.SLACK_WEBHOOK_URL) {
    await sendSlackNotification(`Content published: ${data.name}`)
  }
}

async function handleContentUnpublished(data: any) {
  console.log('Content unpublished:', data)
  await revalidateContent(data.modelName, data.url)
}

async function handleContentArchived(data: any) {
  console.log('Content archived:', data)
  await revalidateContent(data.modelName, data.url)
}

async function handleModelUpdated(data: any) {
  console.log('Model updated:', data)
  
  // Sync model changes back to codebase if needed
  await syncModelToCodebase(data)
}

async function revalidateContent(modelName: string, url: string) {
  try {
    // Revalidate the specific page
    const revalidateUrl = new URL('/api/revalidate', process.env.NEXT_PUBLIC_SITE_URL)
    revalidateUrl.searchParams.set('path', url)
    revalidateUrl.searchParams.set('secret', process.env.REVALIDATE_SECRET!)
    
    await fetch(revalidateUrl.toString(), { method: 'POST' })
  } catch (error) {
    console.error('Revalidation failed:', error)
  }
}

async function syncModelToCodebase(data: any) {
  // This would sync component changes back to your codebase
  // Implementation depends on your specific requirements
  console.log('Syncing model to codebase:', data)
}

async function sendSlackNotification(message: string) {
  try {
    await fetch(process.env.SLACK_WEBHOOK_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: message })
    })
  } catch (error) {
    console.error('Slack notification failed:', error)
  }
}