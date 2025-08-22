import { NextRequest, NextResponse } from 'next/server'
import { PersonaService } from '@/services/persona-service'
import { createClient } from '@supabase/supabase-js'

// Helper to check admin role
async function checkAdminRole(request: NextRequest) {
  // In development, allow all requests for testing
  if (process.env.NODE_ENV === 'development') {
    return true
  }
  
  const authHeader = request.headers.get('authorization')
  if (!authHeader) {
    return false
  }

  const token = authHeader.replace('Bearer ', '')
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  )

  const { data: { user } } = await supabase.auth.getUser(token)
  return user?.user_metadata?.role === 'admin'
}

// GET /api/personas - Get all personas (admin) or active personas (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeInactive = searchParams.get('include_inactive') === 'true'
    const category = searchParams.get('category')
    const limit = searchParams.get('limit')

    let personas

    if (includeInactive) {
      // Admin-only: get all personas including inactive
      const isAdmin = await checkAdminRole(request)
      if (!isAdmin) {
        return NextResponse.json(
          { error: 'Admin access required' },
          { status: 403 }
        )
      }

      // Get all personas via direct Supabase query
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      )

      let query = supabase.from('personas').select('*')
      
      if (category) {
        query = query.eq('category', category)
      }
      
      if (limit) {
        query = query.limit(parseInt(limit))
      }

      query = query.order('category').order('name')

      const { data, error } = await query

      if (error) {
        throw error
      }

      personas = data || []
    } else {
      // Public: get only active personas
      personas = await PersonaService.getActivePersonas()
      
      if (category) {
        personas = personas.filter(p => p.category === category)
      }
      
      if (limit) {
        personas = personas.slice(0, parseInt(limit))
      }
    }

    return NextResponse.json(personas)
  } catch (error) {
    console.error('Error fetching personas:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/personas - Create new persona (admin only)
export async function POST(request: NextRequest) {
  try {
    const isAdmin = await checkAdminRole(request)
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['name', 'category', 'system_prompt', 'greeting']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Generate slug from name if not provided
    if (!body.slug) {
      body.slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
    }

    // Set defaults
    const personaData = {
      slug: body.slug,
      name: body.name,
      avatar_type: body.avatar_type || 'emoji',
      avatar_emoji: body.avatar_emoji || '🤖',
      avatar_url: body.avatar_url || null,
      category: body.category,
      description: body.description || '',
      system_prompt: body.system_prompt,
      greeting: body.greeting,
      voice_id: body.voice_id || null,
      response_style: body.response_style || {},
      is_active: body.is_active !== false, // Default to true
      is_default: body.is_default || false,
      metadata: body.metadata || {}
    }

    const persona = await PersonaService.createPersona(personaData)
    
    if (!persona) {
      return NextResponse.json(
        { error: 'Failed to create persona' },
        { status: 500 }
      )
    }

    return NextResponse.json(persona, { status: 201 })
  } catch (error) {
    console.error('Error creating persona:', error)
    
    // Handle unique constraint violations
    if ((error as { code?: string }).code === '23505') {
      return NextResponse.json(
        { error: 'Persona with this slug already exists' },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}