import { NextRequest, NextResponse } from 'next/server'
import { PersonaService } from '@/services/persona-service'
import { createClient } from '@supabase/supabase-js'

// Helper to check admin role
async function checkAdminRole(request: NextRequest) {
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

// GET /api/personas/[id] - Get persona by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const persona = await PersonaService.getPersonaById(id)
    
    if (!persona) {
      return NextResponse.json(
        { error: 'Persona not found' },
        { status: 404 }
      )
    }

    // Check if persona is active (unless admin)
    if (!persona.is_active) {
      const isAdmin = await checkAdminRole(request)
      if (!isAdmin) {
        return NextResponse.json(
          { error: 'Persona not found' },
          { status: 404 }
        )
      }
    }

    return NextResponse.json(persona)
  } catch (error) {
    console.error('Error fetching persona:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/personas/[id] - Update persona (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const isAdmin = await checkAdminRole(request)
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    
    // Remove non-updatable fields
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _id, created_at, updated_at, created_by, ...updates } = body

    // Update slug if name changed
    if (updates.name && !updates.slug) {
      updates.slug = updates.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
    }

    const persona = await PersonaService.updatePersona(id, updates)
    
    if (!persona) {
      return NextResponse.json(
        { error: 'Persona not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(persona)
  } catch (error) {
    console.error('Error updating persona:', error)
    
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

// DELETE /api/personas/[id] - Delete persona (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const isAdmin = await checkAdminRole(request)
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Check if persona exists
    const existingPersona = await PersonaService.getPersonaById(id)
    if (!existingPersona) {
      return NextResponse.json(
        { error: 'Persona not found' },
        { status: 404 }
      )
    }

    // Prevent deletion of default personas
    if (existingPersona.is_default) {
      return NextResponse.json(
        { error: 'Cannot delete default persona' },
        { status: 400 }
      )
    }

    // Delete avatar if exists
    if (existingPersona.avatar_url) {
      try {
        await fetch(`${request.nextUrl.origin}/api/personas/${id}/avatar`, {
          method: 'DELETE',
          headers: {
            'Authorization': request.headers.get('authorization') || ''
          }
        })
      } catch (error) {
        console.warn('Failed to delete avatar during persona deletion:', error)
      }
    }

    const success = await PersonaService.deletePersona(id)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete persona' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting persona:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}