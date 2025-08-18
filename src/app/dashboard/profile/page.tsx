'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/ui/loading'
import { AvatarUpload } from '@/components/profile/AvatarUpload'
import { motion } from 'framer-motion'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Save,
  Shield,
  Bell,
  Globe,
  Trash2,
  Check,
  X
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { toast } from 'sonner'

export default function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    name: user?.name || 'John Doe',
    email: user?.email || 'john@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    bio: 'AI enthusiast and technology innovator.',
    website: 'https://example.com',
    company: 'Tech Corp',
    role: 'Product Manager'
  })

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    marketing: true,
    updates: true,
    alerts: true
  })

  const [privacy, setPrivacy] = useState({
    profilePublic: false,
    showEmail: false,
    showPhone: false,
    activityVisible: true
  })

  const handleSaveProfile = async () => {
    setIsSaving(true)
    try {
      // TODO: Implement actual profile update
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      await updateProfile({ name: formData.name })
      
      toast.success('Profile updated successfully')
      setIsEditing(false)
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // TODO: Implement account deletion
      toast.error('Account deletion is not available in demo mode')
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
          <p className="text-white/80">Manage your account information and preferences</p>
        </div>
        
        {!isEditing ? (
          <Button 
            onClick={() => setIsEditing(true)}
            className="btn-primary mt-4 sm:mt-0"
          >
            Edit Profile
          </Button>
        ) : (
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <Button
              onClick={() => {
                setIsEditing(false)
                setAvatarPreview(null)
              }}
              variant="outline"
              className="glass text-white border-white/20 hover:bg-white/10"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button
              onClick={handleSaveProfile}
              className="btn-primary"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Profile Information */}
      <motion.div
        className="glass-strong p-6 rounded-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-xl font-semibold text-white mb-6">Personal Information</h2>
        
        <div className="space-y-6">
          {/* Avatar Upload Section */}
          {isEditing ? (
            <AvatarUpload
              currentAvatar={avatarPreview || user?.avatar || ''}
              userName={formData.name}
              onAvatarChange={(newAvatar) => setAvatarPreview(newAvatar)}
              size="lg"
            />
          ) : (
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-white/10">
                  {(avatarPreview || user?.avatar) ? (
                    <img 
                      src={avatarPreview || user?.avatar} 
                      alt={formData.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-primary flex items-center justify-center text-white text-2xl font-bold">
                      {formData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white">{formData.name}</h3>
                <p className="text-white/60">{formData.email}</p>
                <Badge className="mt-2 bg-primary-green/20 text-primary-green border-primary-green/30">
                  Free Plan • 482 tokens
                </Badge>
              </div>
            </div>
          )}

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name" className="text-white/90">
                <User className="inline-block mr-2 h-4 w-4" />
                Full Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!isEditing}
                className="mt-1 input-glass"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-white/90">
                <Mail className="inline-block mr-2 h-4 w-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!isEditing}
                className="mt-1 input-glass"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-white/90">
                <Phone className="inline-block mr-2 h-4 w-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!isEditing}
                className="mt-1 input-glass"
              />
            </div>

            <div>
              <Label htmlFor="location" className="text-white/90">
                <MapPin className="inline-block mr-2 h-4 w-4" />
                Location
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                disabled={!isEditing}
                className="mt-1 input-glass"
              />
            </div>

            <div>
              <Label htmlFor="company" className="text-white/90">
                Company
              </Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                disabled={!isEditing}
                className="mt-1 input-glass"
              />
            </div>

            <div>
              <Label htmlFor="role" className="text-white/90">
                Role
              </Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                disabled={!isEditing}
                className="mt-1 input-glass"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="bio" className="text-white/90">
                Bio
              </Label>
              <textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                disabled={!isEditing}
                rows={3}
                className="mt-1 w-full input-glass resize-none"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="website" className="text-white/90">
                <Globe className="inline-block mr-2 h-4 w-4" />
                Website
              </Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                disabled={!isEditing}
                className="mt-1 input-glass"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Notification Settings */}
      <motion.div
        className="glass-strong p-6 rounded-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
          <Bell className="mr-2 h-5 w-5" />
          Notification Preferences
        </h2>
        
        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <label key={key} className="flex items-center justify-between">
              <span className="text-white/90 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <button
                onClick={() => setNotifications({ ...notifications, [key]: !value })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  value ? 'bg-primary-green' : 'bg-white/20'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </label>
          ))}
        </div>
      </motion.div>

      {/* Privacy Settings */}
      <motion.div
        className="glass-strong p-6 rounded-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
          <Shield className="mr-2 h-5 w-5" />
          Privacy Settings
        </h2>
        
        <div className="space-y-4">
          {Object.entries(privacy).map(([key, value]) => (
            <label key={key} className="flex items-center justify-between">
              <span className="text-white/90">
                {key.replace(/([A-Z])/g, ' $1').trim().replace(/^./, str => str.toUpperCase())}
              </span>
              <button
                onClick={() => setPrivacy({ ...privacy, [key]: !value })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  value ? 'bg-primary-green' : 'bg-white/20'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </label>
          ))}
        </div>
      </motion.div>

      {/* Account Information */}
      <motion.div
        className="glass-strong p-6 rounded-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-xl font-semibold text-white mb-6">Account Information</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
            <div>
              <p className="text-white/90">Account ID</p>
              <p className="text-white/60 text-sm font-mono">usr_2KxPqRt5mN8vW9Zx</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="glass text-white border-white/20 hover:bg-white/10"
              onClick={() => {
                navigator.clipboard.writeText('usr_2KxPqRt5mN8vW9Zx')
                toast.success('Account ID copied to clipboard')
              }}
            >
              Copy
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
            <div>
              <p className="text-white/90">Member Since</p>
              <p className="text-white/60 text-sm flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                January 15, 2024
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
            <div>
              <p className="text-white/90">Account Type</p>
              <p className="text-white/60 text-sm">Free Plan</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="glass text-primary-green border-primary-green/30 hover:bg-primary-green/10"
            >
              Upgrade
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        className="glass-strong p-6 rounded-2xl border-red-500/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-xl font-semibold text-white mb-6">Danger Zone</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-red-500/10 border border-red-500/20">
            <div>
              <p className="text-white/90">Delete Account</p>
              <p className="text-white/60 text-sm">
                Permanently delete your account and all associated data
              </p>
            </div>
            <Button
              variant="outline"
              className="text-red-400 border-red-400/30 hover:bg-red-400/10"
              onClick={handleDeleteAccount}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Account
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}