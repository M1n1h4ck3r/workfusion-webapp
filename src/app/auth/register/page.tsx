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
import { toast } from 'sonner'
import { 
  Mail, 
  Lock, 
  User,
  ArrowRight, 
  Github, 
  Chrome,
  Sparkles,
  Eye,
  EyeOff,
  Check,
  X
} from 'lucide-react'
import { FloatingParticles } from '@/components/animations/FloatingParticles'

interface PasswordStrength {
  score: number
  message: string
  color: string
}

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  const checkPasswordStrength = (password: string): PasswordStrength => {
    let score = 0
    if (password.length >= 8) score++
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) score++
    if (password.match(/[0-9]/)) score++
    if (password.match(/[^a-zA-Z0-9]/)) score++

    const strengths = [
      { score: 0, message: 'Very Weak', color: 'text-red-500' },
      { score: 1, message: 'Weak', color: 'text-orange-500' },
      { score: 2, message: 'Fair', color: 'text-yellow-500' },
      { score: 3, message: 'Good', color: 'text-blue-500' },
      { score: 4, message: 'Strong', color: 'text-green-500' }
    ]

    return strengths[score]
  }

  const passwordStrength = checkPasswordStrength(formData.password)

  const passwordRequirements = [
    { met: formData.password.length >= 8, text: 'At least 8 characters' },
    { met: /[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password), text: 'Upper and lowercase letters' },
    { met: /[0-9]/.test(formData.password), text: 'At least one number' },
    { met: /[^a-zA-Z0-9]/.test(formData.password), text: 'At least one special character' }
  ]

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!acceptedTerms) {
      setError('Please accept the terms and conditions')
      return
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (passwordStrength.score < 2) {
      setError('Please choose a stronger password')
      return
    }

    setError('')
    setIsLoading(true)

    try {
      // Demo registration - accepts any valid data for testing
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Show success message
      toast.success('Account created successfully! Welcome to WorkFusion!')
      
      // Redirect to dashboard on success
      setTimeout(() => {
        router.push('/dashboard')
      }, 500)
    } catch {
      setError('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialRegister = async (provider: 'google' | 'github') => {
    setError('')
    setIsLoading(true)

    try {
      // TODO: Implement social authentication
      console.log('Register with:', provider)
      
      await new Promise(resolve => setTimeout(resolve, 1500))
      router.push('/dashboard')
    } catch {
      setError(`Failed to register with ${provider}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Feature Showcase */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-20" />
        <div className="absolute inset-0 mesh-gradient opacity-30" />
        
        <div className="relative z-10 flex items-center justify-center p-12 w-full">
          <motion.div 
            className="max-w-lg text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8">
              <Badge className="mb-4 bg-primary-green/20 text-primary-green border-primary-green/30">
                <Sparkles className="mr-1 h-3 w-3" />
                Limited Time Offer
              </Badge>
              
              <h3 className="text-4xl font-bold text-white mb-4">
                Join 10,000+ Users
              </h3>
              
              <p className="text-xl text-white/85">
                Start your AI journey today with 500 free tokens. 
                No credit card required.
              </p>
            </div>

            <div className="glass-strong p-8 rounded-2xl">
              <h4 className="text-white font-semibold mb-4">What you get:</h4>
              <div className="space-y-3 text-left">
                {[
                  '500 free tokens to start',
                  'Access to all AI tools',
                  'Expert AI assistants',
                  'WhatsApp automation',
                  'Text-to-speech technology',
                  '24/7 customer support',
                  'No credit card required'
                ].map((feature, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-center space-x-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Check className="h-5 w-5 text-primary-green flex-shrink-0" />
                    <span className="text-white/90">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Registration Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        <FloatingParticles />
        
        <motion.div 
          className="w-full max-w-md space-y-6 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo */}
          <div className="text-center">
            <Link href="/" className="inline-flex items-center justify-center mb-6">
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
              Create Your Account
            </h2>
            <p className="text-white/80">
              Join the AI revolution today
            </p>
            <div className="mt-2 p-3 bg-primary-green/10 border border-primary-green/30 rounded-lg">
              <p className="text-sm text-primary-green">
                🎯 Demo Mode: Registration will create a demo account
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

          {/* Social Registration */}
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full glass text-white border-white/20 hover:bg-white/10"
              onClick={() => handleSocialRegister('google')}
              disabled={isLoading}
            >
              <Chrome className="mr-2 h-5 w-5" />
              Sign up with Google
            </Button>
            
            <Button
              type="button"
              variant="outline"
              className="w-full glass text-white border-white/20 hover:bg-white/10"
              onClick={() => handleSocialRegister('github')}
              disabled={isLoading}
            >
              <Github className="mr-2 h-5 w-5" />
              Sign up with GitHub
            </Button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-dark-bg px-2 text-white/60">
                Or register with email
              </span>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-white/90">
                Full Name
              </Label>
              <div className="mt-1 relative">
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-glass pl-10"
                  placeholder="John Doe"
                  required
                  disabled={isLoading}
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-white/90">
                Email Address
              </Label>
              <div className="mt-1 relative">
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-glass pl-10"
                  placeholder="you@example.com"
                  required
                  disabled={isLoading}
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
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-glass pl-10 pr-10"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
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
              
              {formData.password && (
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/60">Password strength:</span>
                    <span className={`text-xs font-medium ${passwordStrength.color}`}>
                      {passwordStrength.message}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {passwordRequirements.map((req, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        {req.met ? (
                          <Check className="h-3 w-3 text-green-500" />
                        ) : (
                          <X className="h-3 w-3 text-white/40" />
                        )}
                        <span className={`text-xs ${req.met ? 'text-white/80' : 'text-white/40'}`}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-white/90">
                Confirm Password
              </Label>
              <div className="mt-1 relative">
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="input-glass pl-10"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
              </div>
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 rounded border-white/20 bg-white/10 text-primary-green focus:ring-primary-green"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-white/80">
                I agree to the{' '}
                <Link href="/terms" className="text-primary-green hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-primary-green hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full btn-primary"
              disabled={isLoading || !acceptedTerms}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>

          {/* Sign In Link */}
          <p className="text-center text-white/80">
            Already have an account?{' '}
            <Link 
              href="/auth/login" 
              className="text-primary-green hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}