'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/ui/loading'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Github, 
  Chrome,
  Sparkles,
  Eye,
  EyeOff
} from 'lucide-react'
import { FloatingParticles } from '@/components/animations/FloatingParticles'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const { signIn, signInWithProvider, loading: authLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Basic validation
      if (!email || !password) {
        setError('Please enter both email and password')
        setIsLoading(false)
        return
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        setError('Please enter a valid email address')
        setIsLoading(false)
        return
      }
      
      // Use real Supabase authentication
      await signIn(email, password)
      toast.success('Welcome back! Redirecting to dashboard...')
      
    } catch (err: unknown) {
      console.error('Login error:', err)
      setError(err instanceof Error ? err.message : 'Invalid email or password')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setError('')
    setIsLoading(true)
    
    try {
      // Use OAuth authentication (handles both demo and real mode)
      await signInWithProvider(provider)
      toast.success(`Welcome back! Redirecting to dashboard...`)
      
    } catch (err: unknown) {
      console.error(`${provider} OAuth error:`, err)
      setError(err instanceof Error ? err.message : `Failed to login with ${provider}. Please try again.`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        <FloatingParticles />
        
        <motion.div 
          className="w-full max-w-md space-y-8 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo */}
          <div className="text-center">
            <Link href="/" className="inline-flex items-center justify-center mb-8">
              <Image
                src="/workfusionlogo.png"
                alt="Workfusion"
                width={60}
                height={60}
                className="w-15 h-15"
                priority
              />
            </Link>
            
            <h2 className="text-3xl font-bold text-white mb-2">
              Welcome Back
            </h2>
            <p className="text-white/80">
              Sign in to access your AI playground
            </p>
            <div className="mt-2 p-3 bg-primary-green/10 border border-primary-green/30 rounded-lg">
              <p className="text-sm text-primary-green">
                🎯 Demo Mode: OAuth and email login work with any credentials
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div 
              className="glass p-4 rounded-lg border-red-500/50 bg-red-500/10"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <p className="text-red-400 text-sm text-center">{error}</p>
            </motion.div>
          )}

          {/* Social Login */}
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full glass text-white border-white/20 hover:bg-white/10"
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading || authLoading}
            >
              <Chrome className="mr-2 h-5 w-5" />
              Continue with Google
            </Button>
            
            <Button
              type="button"
              variant="outline"
              className="w-full glass text-white border-white/20 hover:bg-white/10"
              onClick={() => handleSocialLogin('github')}
              disabled={isLoading || authLoading}
            >
              <Github className="mr-2 h-5 w-5" />
              Continue with GitHub
            </Button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-dark-bg px-2 text-white/60">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Email Login Form */}
          <form onSubmit={handleEmailLogin} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-white/90">
                  Email Address
                </Label>
                <div className="mt-1 relative">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-glass pl-10"
                    placeholder="you@example.com"
                    required
                    disabled={isLoading || authLoading}
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="text-white/90">
                  Password
                </Label>
                <div className="mt-1 relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-glass pl-10 pr-10"
                    placeholder="••••••••"
                    required
                    disabled={isLoading || authLoading}
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-white/20 bg-white/10 text-primary-green focus:ring-primary-green"
                />
                <span className="ml-2 text-sm text-white/80">
                  Remember me
                </span>
              </label>
              
              <Link 
                href="/auth/forgot-password" 
                className="text-sm text-primary-green hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full btn-primary"
              disabled={isLoading || authLoading}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-white/80">
            Don&apos;t have an account?{' '}
            <Link 
              href="/auth/register" 
              className="text-primary-green hover:underline font-medium"
            >
              Sign up for free
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Panel - Feature Showcase */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-20" />
        <div className="absolute inset-0 mesh-gradient opacity-30" />
        
        <div className="relative z-10 flex items-center justify-center p-12 w-full">
          <motion.div 
            className="max-w-lg text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="mb-8">
              <Badge className="mb-4 bg-primary-green/20 text-primary-green border-primary-green/30">
                <Sparkles className="mr-1 h-3 w-3" />
                AI Powered
              </Badge>
              
              <h3 className="text-4xl font-bold text-white mb-4">
                Start with 500 Free Tokens
              </h3>
              
              <p className="text-xl text-white/85">
                Experience the power of AI with our comprehensive suite of tools. 
                No credit card required.
              </p>
            </div>

            <div className="glass-strong p-8 rounded-2xl">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-white font-semibold">AI Chatbots</h4>
                    <p className="text-white/80 text-sm">4 Expert assistants ready to help</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-white font-semibold">WhatsApp Integration</h4>
                    <p className="text-white/80 text-sm">Automate messaging at scale</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-white font-semibold">Voice Technology</h4>
                    <p className="text-white/80 text-sm">Text-to-speech & phone calls</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-center space-x-8">
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">99.9%</div>
                <div className="text-white/80 text-sm">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">24/7</div>
                <div className="text-white/80 text-sm">Support</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">2s</div>
                <div className="text-white/80 text-sm">Response</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}