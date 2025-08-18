'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingSpinner } from '@/components/ui/loading'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Mail, ArrowRight, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending')
  const [isResending, setIsResending] = useState(false)
  const [email, setEmail] = useState('')
  
  const message = searchParams.get('message')
  const error = searchParams.get('error')

  useEffect(() => {
    // Check URL parameters for verification status
    if (message === 'email_sent') {
      setVerificationStatus('pending')
    } else if (error) {
      setVerificationStatus('error')
    }
  }, [message, error])

  const handleResendEmail = async () => {
    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    setIsResending(true)
    
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Verification email sent! Please check your inbox.')
      } else {
        toast.error(data.error || 'Failed to send verification email')
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="glass-strong p-8 rounded-2xl">
          {verificationStatus === 'pending' && (
            <>
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="h-8 w-8 text-white" />
              </div>
              
              <h1 className="text-2xl font-bold text-white text-center mb-4">
                Verify Your Email
              </h1>
              
              <p className="text-white/80 text-center mb-6">
                We&apos;ve sent a verification email to your inbox. Please check your email and click the verification link to activate your account.
              </p>
              
              <div className="glass p-4 rounded-lg mb-6">
                <p className="text-white/60 text-sm text-center">
                  Didn&apos;t receive the email? Check your spam folder or request a new verification email below.
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="input-glass"
                  />
                </div>
                
                <Button
                  onClick={handleResendEmail}
                  disabled={isResending}
                  className="w-full glass text-white border-white/20 hover:bg-white/10"
                >
                  {isResending ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Resend Verification Email
                    </>
                  )}
                </Button>
                
                <Link href="/auth/login">
                  <Button
                    variant="outline"
                    className="w-full glass text-white border-white/20 hover:bg-white/10"
                  >
                    Back to Login
                  </Button>
                </Link>
              </div>
            </>
          )}

          {verificationStatus === 'success' && (
            <>
              <motion.div
                className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.5 }}
              >
                <CheckCircle className="h-8 w-8 text-white" />
              </motion.div>
              
              <h1 className="text-2xl font-bold text-white text-center mb-4">
                Email Verified!
              </h1>
              
              <p className="text-white/80 text-center mb-6">
                Your email has been successfully verified. You can now access all features of WorkFusion.
              </p>
              
              <Link href="/dashboard">
                <Button className="w-full btn-primary">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </>
          )}

          {verificationStatus === 'error' && (
            <>
              <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="h-8 w-8 text-white" />
              </div>
              
              <h1 className="text-2xl font-bold text-white text-center mb-4">
                Verification Failed
              </h1>
              
              <p className="text-white/80 text-center mb-6">
                {error === 'invalid_token' 
                  ? 'The verification link is invalid or has expired.'
                  : error === 'missing_token'
                  ? 'No verification token was provided.'
                  : 'An error occurred during verification. Please try again.'}
              </p>
              
              <div className="space-y-4">
                <div>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="input-glass"
                  />
                </div>
                
                <Button
                  onClick={handleResendEmail}
                  disabled={isResending}
                  className="w-full btn-primary"
                >
                  {isResending ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Request New Verification Email
                    </>
                  )}
                </Button>
                
                <Link href="/auth/login">
                  <Button
                    variant="outline"
                    className="w-full glass text-white border-white/20 hover:bg-white/10"
                  >
                    Back to Login
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}