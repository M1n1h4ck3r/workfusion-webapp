'use client'

import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { motion } from 'framer-motion'
import { FileText, Shield, Gift, Sparkles, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface TermsAcceptanceProps {
  isOpen: boolean
  onAccept: (marketingConsent: boolean) => void
  onDecline?: () => void
}

export function TermsAcceptance({ 
  isOpen, 
  onAccept,
  onDecline 
}: TermsAcceptanceProps) {
  const [accepted, setAccepted] = useState({
    terms: false,
    privacy: false,
    marketing: false
  })

  const canProceed = accepted.terms && accepted.privacy // Marketing is optional

  const handleAccept = () => {
    if (canProceed) {
      onAccept(accepted.marketing)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto glass-strong border-white/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white flex items-center">
            <Sparkles className="h-6 w-6 text-primary-green mr-2" />
            Welcome to WorkFusion AI!
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white/80"
          >
            To get started with your AI journey, please review and accept our terms:
          </motion.div>

          {/* Free Tokens Offer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="glass p-6 rounded-xl border border-primary-green/30 bg-primary-green/5"
          >
            <div className="flex items-start">
              <Gift className="h-6 w-6 text-primary-green mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  🎆 Get 500 Free Tokens to Start!
                </h3>
                <div className="grid md:grid-cols-3 gap-3 text-sm">
                  <div className="glass p-3 rounded-lg">
                    <p className="text-primary-green font-semibold">25 AI Chats</p>
                    <p className="text-white/70">Expert AI assistants</p>
                  </div>
                  <div className="glass p-3 rounded-lg">
                    <p className="text-primary-green font-semibold">10 WhatsApp</p>
                    <p className="text-white/70">Automated messages</p>
                  </div>
                  <div className="glass p-3 rounded-lg">
                    <p className="text-primary-green font-semibold">10,000 TTS</p>
                    <p className="text-white/70">Text-to-speech chars</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Terms Checkboxes */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {/* Terms and Conditions */}
            <div className="glass p-4 rounded-lg hover:bg-white/5 transition-colors">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="terms"
                  checked={accepted.terms}
                  onCheckedChange={(checked) => 
                    setAccepted(prev => ({ ...prev, terms: checked as boolean }))
                  }
                  className="mt-0.5"
                />
                <label htmlFor="terms" className="cursor-pointer flex-1">
                  <div className="flex items-center mb-1">
                    <FileText className="h-4 w-4 text-primary-green mr-2" />
                    <span className="font-semibold text-white">
                      Terms and Conditions *
                    </span>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed">
                    I understand the token system, pricing, and usage policies. Tokens are non-refundable.
                  </p>
                  <Link 
                    href="/terms" 
                    target="_blank" 
                    className="text-primary-green hover:underline text-sm inline-flex items-center mt-1"
                  >
                    Read full terms →
                  </Link>
                </label>
              </div>
            </div>

            {/* Privacy Policy */}
            <div className="glass p-4 rounded-lg hover:bg-white/5 transition-colors">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="privacy"
                  checked={accepted.privacy}
                  onCheckedChange={(checked) => 
                    setAccepted(prev => ({ ...prev, privacy: checked as boolean }))
                  }
                  className="mt-0.5"
                />
                <label htmlFor="privacy" className="cursor-pointer flex-1">
                  <div className="flex items-center mb-1">
                    <Shield className="h-4 w-4 text-primary-green mr-2" />
                    <span className="font-semibold text-white">
                      Privacy Policy *
                    </span>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed">
                    I understand how my data is collected, used, and protected.
                  </p>
                  <Link 
                    href="/privacy" 
                    target="_blank" 
                    className="text-primary-green hover:underline text-sm inline-flex items-center mt-1"
                  >
                    Read privacy policy →
                  </Link>
                </label>
              </div>
            </div>

            {/* Marketing Communications */}
            <div className="glass p-4 rounded-lg hover:bg-white/5 transition-colors">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="marketing"
                  checked={accepted.marketing}
                  onCheckedChange={(checked) => 
                    setAccepted(prev => ({ ...prev, marketing: checked as boolean }))
                  }
                  className="mt-0.5"
                />
                <label htmlFor="marketing" className="cursor-pointer flex-1">
                  <div className="flex items-center mb-1">
                    <Sparkles className="h-4 w-4 text-yellow-500 mr-2" />
                    <span className="font-semibold text-white">
                      Marketing Communications (Optional)
                    </span>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Send me updates about new AI features, exclusive offers, tips, and industry insights. 
                    You can unsubscribe anytime.
                  </p>
                </label>
              </div>
            </div>
          </motion.div>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="glass p-4 rounded-lg border border-yellow-500/30 bg-yellow-500/5"
          >
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-white/80">
                  <strong className="text-yellow-500">Important:</strong> You must accept the Terms and Privacy Policy to use WorkFusion. 
                  Marketing communications are optional and you can change your preferences anytime in settings.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-3"
          >
            {onDecline && (
              <Button 
                onClick={onDecline}
                variant="outline"
                className="flex-1 glass text-white border-white/20 hover:bg-white/10"
              >
                Maybe Later
              </Button>
            )}
            <Button 
              onClick={handleAccept} 
              disabled={!canProceed}
              className={`flex-1 ${canProceed ? 'btn-primary' : 'glass text-white/50 border-white/20 cursor-not-allowed'}`}
            >
              {canProceed ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Accept & Get Started
                </>
              ) : (
                'Please accept required terms'
              )}
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  )
}