import { NextRequest, NextResponse } from 'next/server'
import { builderConfig } from '@/lib/builder-config'

// API route for syncing changes from codebase to Builder.io
export async function POST(request: NextRequest) {
  try {
    const { type, data, model = 'page' } = await request.json()

    switch (type) {
      case 'component-update':
        await syncComponentToBuilder(data)
        break
      
      case 'theme-update':
        await syncThemeToBuilder(data)
        break
      
      case 'model-update':
        await syncModelToBuilder(data, model)
        break
      
      default:
        return NextResponse.json(
          { error: 'Invalid sync type' },
          { status: 400 }
        )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Builder sync error:', error)
    return NextResponse.json(
      { error: 'Sync failed' },
      { status: 500 }
    )
  }
}

// Get Builder.io content
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const model = url.searchParams.get('model') || 'page'
    const contentUrl = url.searchParams.get('url') || '/'
    const limit = parseInt(url.searchParams.get('limit') || '10')

    const builderUrl = new URL('https://cdn.builder.io/api/v2/content/' + model)
    builderUrl.searchParams.set('apiKey', builderConfig.apiKey)
    builderUrl.searchParams.set('url', contentUrl)
    builderUrl.searchParams.set('limit', limit.toString())

    const response = await fetch(builderUrl.toString())
    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error('Builder content fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    )
  }
}

interface ComponentData {
  [key: string]: unknown
}

async function syncComponentToBuilder(componentData: ComponentData) {
  // Sync component changes to Builder.io
  const builderApiUrl = `https://builder.io/api/v1/write/page`
  
  try {
    const response = await fetch(builderApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${builderConfig.privateKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...componentData,
        published: 'published'
      })
    })

    if (!response.ok) {
      throw new Error(`Builder API error: ${response.statusText}`)
    }

    const result = await response.json()
    console.log('Component synced to Builder:', result)
    return result
  } catch (error) {
    console.error('Failed to sync component to Builder:', error)
    throw error
  }
}

interface ThemeData {
  [key: string]: unknown
}

async function syncThemeToBuilder(themeData: ThemeData) {
  // Sync theme updates to Builder.io
  const builderApiUrl = `https://builder.io/api/v1/spaces/${builderConfig.spaceId}/settings`
  
  try {
    const response = await fetch(builderApiUrl, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${builderConfig.privateKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        designTokens: themeData
      })
    })

    if (!response.ok) {
      throw new Error(`Builder API error: ${response.statusText}`)
    }

    const result = await response.json()
    console.log('Theme synced to Builder:', result)
    return result
  } catch (error) {
    console.error('Failed to sync theme to Builder:', error)
    throw error
  }
}

interface ModelData {
  [key: string]: unknown
}

async function syncModelToBuilder(modelData: ModelData, model: string) {
  // Sync model schema updates to Builder.io
  const builderApiUrl = `https://builder.io/api/v1/models/${model}`
  
  try {
    const response = await fetch(builderApiUrl, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${builderConfig.privateKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(modelData)
    })

    if (!response.ok) {
      throw new Error(`Builder API error: ${response.statusText}`)
    }

    const result = await response.json()
    console.log('Model synced to Builder:', result)
    return result
  } catch (error) {
    console.error('Failed to sync model to Builder:', error)
    throw error
  }
}