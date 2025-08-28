'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LoadingSpinner } from '@/components/ui/loading'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, Check } from 'lucide-react'
import { FloatingParticles } from '@/components/animations/FloatingParticles'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // TODO: Implement Supabase password reset
      console.log('Reset password for:', email)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setIsSuccess(true)
    } catch {
      setError('Failed to send reset email. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 relative">
        <FloatingParticles />
        
        <motion.div 
          className="w-full max-w-md relative z-10"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="glass-strong p-8 rounded-2xl text-center">
            <motion.div
              className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 200,
                damping: 10,
                delay: 0.2
              }}
            >
              <Check className="h-10 w-10 text-white" />
            </motion.div>
            
            <h2 className="text-2xl font-bold text-white mb-4">
              Check Your Email
            </h2>
            
            <p className="text-white/85 mb-6">
              We've sent a password reset link to:
            </p>
            
            <p className="text-primary-green font-medium mb-8">
              {email}
            </p>
            
            <p className="text-white/80 text-sm mb-8">
              If you don't see the email, check your spam folder or try again.
            </p>
            
            <div className="space-y-3">
              <Link href="/auth/login">
                <Button className="w-full btn-primary">
                  Back to Login
                </Button>
              </Link>
              
              <button
                onClick={() => {
                  setIsSuccess(false)
                  setEmail('')
                }}
                className="text-white/80 hover:text-white text-sm underline"
              >
                Try with a different email
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 relative">
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
            Reset Your Password
          </h2>
          <p className="text-white/80">
            Enter your email and we'll send you a reset link
          </p>
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

        {/* Reset Form */}
        <form onSubmit={handleResetPassword} className="space-y-6">
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
                disabled={isLoading}
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Sending reset link...
              </>
            ) : (
              'Send Reset Link'
            )}
          </Button>
        </form>

        {/* Back to Login */}
        <div className="text-center">
          <Link 
            href="/auth/login" 
            className="inline-flex items-center text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to login
          </Link>
        </div>

        {/* Additional Help */}
        <div className="glass p-6 rounded-xl">
          <h3 className="text-white font-semibold mb-3">
            Need help?
          </h3>
          <p className="text-white/80 text-sm mb-4">
            If you're having trouble resetting your password, contact our support team.
          </p>
          <Link href="/contact">
            <Button 
              variant="outline" 
              className="w-full glass text-white border-white/20 hover:bg-white/10"
            >
              Contact Support
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}