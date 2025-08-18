// Client-side MinIO service (without Sharp)
// This file contains only the client-safe parts of MinIO service

export interface UploadResult {
  url: string
  thumbnailUrl?: string
}

// Client-side helper to upload avatar via API
export async function uploadPersonaAvatar(
  personaId: string,
  file: File
): Promise<UploadResult | null> {
  try {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await fetch(`/api/personas/${personaId}/avatar`, {
      method: 'POST',
      body: formData
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to upload avatar')
    }
    
    const { avatarUrl, thumbnailUrl } = await response.json()
    return { url: avatarUrl, thumbnailUrl }
  } catch (error) {
    console.error('Error uploading avatar:', error)
    return null
  }
}

// Delete avatar via API
export async function deletePersonaAvatar(personaId: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/personas/${personaId}/avatar`, {
      method: 'DELETE'
    })
    
    return response.ok
  } catch (error) {
    console.error('Error deleting avatar:', error)
    return false
  }
}

// Get avatar info via API
export async function getPersonaAvatar(personaId: string): Promise<{
  type: 'emoji' | 'image'
  value: string
  thumbnail?: string
} | null> {
  try {
    const response = await fetch(`/api/personas/${personaId}/avatar`)
    
    if (!response.ok) {
      return null
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error getting avatar:', error)
    return null
  }
}