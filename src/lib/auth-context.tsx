'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface User {
  id: string
  email: string
  name: string
  avatar?: string
  tokens: number
  role: 'user' | 'admin'
  createdAt: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
  signInWithProvider: (provider: 'google' | 'github') => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Check if Supabase is configured
  const isSupabaseConfigured = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    return url && 
           url !== 'your_supabase_url_here' && 
           url !== 'https://placeholder.supabase.co' &&
           !url.includes('placeholder')
  }

  // Check for existing session on mount
  useEffect(() => {
    // Skip auth if Supabase is not configured
    if (!isSupabaseConfigured()) {
      setLoading(false)
      return
    }

    checkUser()
    
    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN') {
          await checkUser()
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
        }
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        // TODO: Fetch additional user data from your database
        const userData: User = {
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name || 'User',
          avatar: session.user.user_metadata?.avatar_url,
          tokens: 500, // Default tokens for new users
          role: 'user',
          createdAt: session.user.created_at
        }
        
        setUser(userData)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Error checking user:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    // Demo mode if Supabase is not configured
    if (!isSupabaseConfigured()) {
      // Basic email validation for demo
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address')
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters')
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Create demo user with admin privileges for testing
      const demoUser: User = {
        id: 'demo-user-' + Date.now(),
        email: email,
        name: 'Demo Admin',
        avatar: `https://ui-avatars.com/api/?name=Demo+Admin&background=4ADE80&color=fff`,
        tokens: 500,
        role: 'admin', // Grant admin access for demo
        createdAt: new Date().toISOString()
      }
      
      setUser(demoUser)
      router.push('/dashboard')
      return
    }

    // Real Supabase authentication
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error

    await checkUser()
    router.push('/dashboard')
  }

  const signUp = async (email: string, password: string, name: string) => {
    // Demo mode if Supabase is not configured
    if (!isSupabaseConfigured()) {
      // Basic validation for demo
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address')
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters')
      }
      
      if (!name.trim()) {
        throw new Error('Name is required')
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Create demo user with admin privileges for testing
      const demoUser: User = {
        id: 'demo-user-' + Date.now(),
        email: email,
        name: name,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4ADE80&color=fff`,
        tokens: 500,
        role: 'admin', // Grant admin access for demo
        createdAt: new Date().toISOString()
      }
      
      setUser(demoUser)
      router.push('/dashboard')
      return
    }

    // Real Supabase authentication
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          tokens: 500 // Give new users 500 free tokens
        }
      }
    })

    if (error) throw error

    // TODO: Create user profile in database
    
    await checkUser()
    router.push('/dashboard')
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    
    setUser(null)
    router.push('/auth/login')
  }

  const signInWithProvider = async (provider: 'google' | 'github') => {
    // Demo mode if Supabase is not configured
    if (!isSupabaseConfigured()) {
      // Simulate OAuth flow for demo
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Create demo user with admin privileges for testing
      const demoUser: User = {
        id: 'demo-user-' + Date.now(),
        email: `demo@${provider}.com`,
        name: `Demo ${provider.charAt(0).toUpperCase() + provider.slice(1)} Admin`,
        avatar: `https://ui-avatars.com/api/?name=Demo+Admin&background=4ADE80&color=fff`,
        tokens: 500,
        role: 'admin', // Grant admin access for demo
        createdAt: new Date().toISOString()
      }
      
      setUser(demoUser)
      router.push('/dashboard')
      return
    }

    // Real Supabase OAuth
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) throw error
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })

    if (error) throw error
  }

  const updateProfile = async (data: Partial<User>) => {
    if (!user) throw new Error('No user logged in')

    // TODO: Update user profile in database
    
    setUser({ ...user, ...data })
  }

  const refreshUser = async () => {
    await checkUser()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        signInWithProvider,
        resetPassword,
        updateProfile,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// HOC for protected routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  requireAdmin = false
) {
  return function ProtectedComponent(props: P) {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!loading) {
        if (!user) {
          router.replace('/auth/login')
        } else if (requireAdmin && user.role !== 'admin') {
          router.replace('/dashboard')
        }
      }
    }, [user, loading, router])

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/80">Loading...</p>
          </div>
        </div>
      )
    }

    if (!user || (requireAdmin && user.role !== 'admin')) {
      return null
    }

    return <Component {...props} />
  }
}