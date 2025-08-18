'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { TermsAcceptance } from '@/components/termsacceptance'
import { toast } from 'sonner'
import { LoadingSpinner } from '@/components/ui/loading'

export default function FirstTimeSetupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showTerms, setShowTerms] = useState(true)

  const handleTermsAccept = async (marketingConsent: boolean) => {
    setIsLoading(true)
    
    try {
      // Simulate API call to save user preferences
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Save to localStorage (in production, save to database)
      localStorage.setItem('termsAccepted', 'true')
      localStorage.setItem('termsAcceptedDate', new Date().toISOString())
      localStorage.setItem('marketingConsent', marketingConsent.toString())
      
      // Show success message
      toast.success('Welcome to WorkFusion! Your account is ready.')
      
      // Award initial tokens
      toast.success('🎁 500 free tokens have been added to your account!')
      
      // Redirect to dashboard
      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)
    } catch (error) {
      toast.error('Failed to save preferences. Please try again.')
      setIsLoading(false)
    }
  }

  const handleTermsDecline = () => {
    toast.warning('You need to accept the terms to use WorkFusion.')
    // Optionally redirect to homepage or show alternative content
    setTimeout(() => {
      router.push('/')
    }, 2000)
  }

  // Check if user has already accepted terms
  useEffect(() => {
    const termsAccepted = localStorage.getItem('termsAccepted')
    if (termsAccepted === 'true') {
      router.push('/dashboard')
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="text-white text-lg">Setting up your account...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-dark">
      <TermsAcceptance
        isOpen={showTerms}
        onAccept={handleTermsAccept}
        onDecline={handleTermsDecline}
      />
    </div>
  )
}