'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingSpinner } from '@/components/ui/loading'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Mail, ArrowRight, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending')
  const [isResending, setIsResending] = useState(false)
  const [email, setEmail] = useState('')
  
  const message = searchParams.get('message')
  const error = searchParams.get('error')
  const token = searchParams.get('token')

  useEffect(() => {
    // If there's a token in the URL, verify it automatically
    if (token) {
      verifyEmail(token)
    } else if (message) {
      setVerificationStatus('success')
    } else if (error) {
      setVerificationStatus('error')
    }
  }, [token, message, error])

  const verifyEmail = async (verificationToken: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Randomly succeed or fail for demo purposes
      if (Math.random() > 0.3) {
        setVerificationStatus('success')
        toast.success('Email verified successfully!')
      } else {
        setVerificationStatus('error')
        toast.error('Verification failed. Please try again.')
      }
    } catch (error) {
      setVerificationStatus('error')
      toast.error('An error occurred during verification.')
    }
  }

  const resendVerification = async () => {
    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    setIsResending(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success('Verification email sent! Please check your inbox.')
    } catch (error) {
      toast.error('Failed to resend verification email')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-green/20 mb-4">
            {verificationStatus === 'pending' && (
              <LoadingSpinner size="lg" />
            )}
            {verificationStatus === 'success' && (
              <CheckCircle className="h-10 w-10 text-primary-green" />
            )}
            {verificationStatus === 'error' && (
              <XCircle className="h-10 w-10 text-red-400" />
            )}
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">
            {verificationStatus === 'pending' && 'Verifying Email...'}
            {verificationStatus === 'success' && 'Email Verified!'}
            {verificationStatus === 'error' && 'Verification Failed'}
          </h1>

          <p className="text-white/80">
            {verificationStatus === 'pending' && 'Please wait while we verify your email address.'}
            {verificationStatus === 'success' && 'Your email has been successfully verified. You can now access all features.'}
            {verificationStatus === 'error' && 'We couldn\'t verify your email. The link may have expired or is invalid.'}
          </p>
        </div>

        <div className="glass-strong p-8 rounded-2xl space-y-6">
          {verificationStatus === 'success' ? (
            <div className="space-y-4">
              <p className="text-white/60 text-center">
                You can now log in to your account and start using WorkFusion AI.
              </p>
              <Link href="/auth/login" className="block">
                <Button className="btn-primary w-full">
                  Continue to Login
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          ) : verificationStatus === 'error' ? (
            <div className="space-y-4">
              <div className="space-y-4">
                <p className="text-white/60 text-sm">
                  Enter your email to receive a new verification link:
                </p>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-glass"
                />
                <Button
                  onClick={resendVerification}
                  disabled={isResending || !email}
                  className="btn-primary w-full"
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
              </div>

              <div className="pt-4 border-t border-white/10">
                <p className="text-white/60 text-sm text-center mb-3">
                  Already verified?
                </p>
                <Link href="/auth/login" className="block">
                  <Button variant="outline" className="glass w-full text-white border-white/20 hover:bg-white/10">
                    Go to Login
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <Mail className="h-12 w-12 text-white/40 mx-auto mb-4" />
              <p className="text-white/60 text-sm">
                This may take a few moments...
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <p className="text-white/60 text-sm">
            Need help?{' '}
            <Link href="/support" className="text-primary-green hover:underline">
              Contact Support
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}