'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LoadingSpinner } from '@/components/ui/loading'
import { 
  Camera, Upload, X, Check, User, Trash2
} from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

interface AvatarUploadProps {
  currentAvatar?: string
  userName: string
  onAvatarChange: (avatarUrl: string) => void
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function AvatarUpload({ 
  currentAvatar, 
  userName, 
  onAvatarChange,
  size = 'lg' 
}: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const sizeClasses = {
    sm: 'h-16 w-16',
    md: 'h-24 w-24',
    lg: 'h-32 w-32',
    xl: 'h-40 w-40'
  }

  const handleFileSelect = (file: File) => {
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, GIF, or WebP)')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileSelect(file)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleUpload = async () => {
    if (!previewUrl) return

    setIsUploading(true)
    
    try {
      // Simulate upload process
      // In production, you would upload to your backend or cloud storage
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Call the callback with the new avatar URL
      onAvatarChange(previewUrl)
      
      toast.success('Avatar updated successfully!')
      setPreviewUrl(null)
    } catch (error) {
      toast.error('Failed to update avatar. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveAvatar = () => {
    onAvatarChange('')
    setPreviewUrl(null)
    toast.success('Avatar removed')
  }

  const handleCancel = () => {
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Predefined avatar options
  const avatarPresets = [
    { id: 1, url: '/avatars/avatar1.png', name: 'Professional' },
    { id: 2, url: '/avatars/avatar2.png', name: 'Casual' },
    { id: 3, url: '/avatars/avatar3.png', name: 'Creative' },
    { id: 4, url: '/avatars/avatar4.png', name: 'Formal' },
    { id: 5, url: '/avatars/avatar5.png', name: 'Modern' },
    { id: 6, url: '/avatars/avatar6.png', name: 'Artistic' }
  ]

  return (
    <div className="space-y-6">
      {/* Main Avatar Display */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div
            className={`${sizeClasses[size]} relative rounded-full overflow-hidden ${
              isDragging ? 'ring-4 ring-primary-green ring-offset-4 ring-offset-dark-bg' : ''
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Avatar className={`${sizeClasses[size]} border-4 border-white/10`}>
              <AvatarImage 
                src={previewUrl || currentAvatar} 
                alt={userName} 
              />
              <AvatarFallback className="bg-gradient-primary text-white text-2xl">
                {userName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            {/* Upload Overlay */}
            {isDragging && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <Upload className="h-8 w-8 text-white animate-pulse" />
              </div>
            )}
          </div>

          {/* Edit Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 p-2 bg-primary-green rounded-full hover:bg-primary-green/80 transition-colors"
          >
            <Camera className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* User Name */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-white">{userName}</h3>
          <p className="text-white/60 text-sm">Click or drag to update avatar</p>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />

      {/* Preview Section */}
      <AnimatePresence>
        {previewUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass p-4 rounded-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-white font-medium">Preview</h4>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  size="sm"
                  className="glass text-white border-white/20 hover:bg-white/10"
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={isUploading}
                  size="sm"
                  className="btn-primary"
                >
                  {isUploading ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Apply
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src={previewUrl} alt="Preview" />
              </Avatar>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
          className="glass text-white border-white/20 hover:bg-white/10"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Image
        </Button>
        
        {currentAvatar && (
          <Button
            onClick={handleRemoveAvatar}
            variant="outline"
            className="glass text-red-400 border-red-400/20 hover:bg-red-400/10"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Remove Avatar
          </Button>
        )}
      </div>

      {/* Preset Avatars */}
      <div className="glass p-4 rounded-xl">
        <h4 className="text-white font-medium mb-3">Choose from presets</h4>
        <div className="grid grid-cols-6 gap-3">
          {avatarPresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => {
                setPreviewUrl(preset.url)
                toast.info(`Selected ${preset.name} avatar`)
              }}
              className="relative group"
            >
              <div className="w-full aspect-square rounded-lg overflow-hidden border-2 border-white/10 group-hover:border-primary-green transition-colors">
                <div className="w-full h-full bg-gradient-to-br from-primary-green/20 to-primary-blue/20 flex items-center justify-center">
                  <User className="h-8 w-8 text-white/40" />
                </div>
              </div>
              <span className="text-xs text-white/60 mt-1 block">{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Guidelines */}
      <div className="glass p-4 rounded-xl">
        <h4 className="text-white font-medium mb-2">Image Guidelines</h4>
        <ul className="space-y-1 text-sm text-white/60">
          <li>• Recommended size: 400x400 pixels</li>
          <li>• Maximum file size: 5MB</li>
          <li>• Supported formats: JPEG, PNG, GIF, WebP</li>
          <li>• Square images work best</li>
        </ul>
      </div>
    </div>
  )
}