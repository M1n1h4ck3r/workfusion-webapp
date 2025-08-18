import { NextRequest, NextResponse } from 'next/server'
import { PersonaService } from '@/services/persona-service'
import { MinIOService } from '@/services/minio-service-server'

// POST /api/personas/[id]/avatar - Upload avatar
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Supported: JPEG, PNG, WebP, GIF' },
        { status: 400 }
      )
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size: 5MB' },
        { status: 400 }
      )
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // Upload to MinIO directly from API route
    const result = await MinIOService.uploadAvatar(
      params.id,
      buffer,
      file.name,
      {
        format: 'webp',
        generateThumbnail: true
      }
    )
    
    // Update persona in database
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    )
    
    await supabase
      .from('personas')
      .update({
        avatar_type: 'image',
        avatar_url: result.url,
        metadata: {
          thumbnailUrl: result.thumbnailUrl
        }
      })
      .eq('id', params.id)
    
    const avatarUrl = result.url
    
    if (!avatarUrl) {
      return NextResponse.json(
        { error: 'Failed to upload avatar' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      avatarUrl 
    })
  } catch (error) {
    console.error('Avatar upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/personas/[id]/avatar - Delete avatar
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get persona to find current avatar URL
    const persona = await PersonaService.getPersonaById(params.id)
    
    if (!persona) {
      return NextResponse.json(
        { error: 'Persona not found' },
        { status: 404 }
      )
    }

    if (!persona.avatar_url) {
      return NextResponse.json(
        { error: 'No avatar to delete' },
        { status: 400 }
      )
    }

    // Extract filename from URL
    const urlParts = persona.avatar_url.split('/')
    const filename = urlParts.slice(urlParts.indexOf('avatars')).join('/')
    
    // Delete from MinIO
    const success = await MinIOService.deleteAvatar(params.id, filename)
    
    if (success) {
      // Update persona in database
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      )
      
      await supabase
        .from('personas')
        .update({
          avatar_type: 'emoji',
          avatar_url: null,
          metadata: {}
        })
        .eq('id', params.id)
    }
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete avatar' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true 
    })
  } catch (error) {
    console.error('Avatar delete error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET /api/personas/[id]/avatar - Get avatar URL
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const persona = await PersonaService.getPersonaById(params.id)
    
    if (!persona) {
      return NextResponse.json(
        { error: 'Persona not found' },
        { status: 404 }
      )
    }

    const avatarDisplay = PersonaService.getAvatarDisplay(persona)
    
    return NextResponse.json(avatarDisplay)
  } catch (error) {
    console.error('Get avatar error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}