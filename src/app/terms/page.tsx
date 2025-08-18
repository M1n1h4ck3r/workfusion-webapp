'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, FileText, Shield, Scale, AlertCircle } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-dark py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Back Button */}
          <Link href="/">
            <Button
              variant="outline"
              className="glass text-white border-white/20 hover:bg-white/10 mb-8"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>

          {/* Header */}
          <div className="glass-strong p-8 rounded-2xl mb-8">
            <div className="flex items-center mb-4">
              <FileText className="h-8 w-8 text-primary-green mr-3" />
              <h1 className="text-4xl font-bold text-white">Terms and Conditions</h1>
            </div>
            <p className="text-white/80">Effective Date: January 1, 2024</p>
            <p className="text-white/80 mt-2">Last Updated: January 1, 2024</p>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Introduction */}
            <motion.div
              className="glass p-6 rounded-xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                <Shield className="h-6 w-6 text-primary-green mr-2" />
                1. Agreement to Terms
              </h2>
              <div className="text-white/80 space-y-3">
                <p>
                  By accessing or using WorkFusion AI Agency services (&ldquo;Service&rdquo;), you agree to be bound by these Terms and Conditions (&ldquo;Terms&rdquo;). If you disagree with any part of these terms, you may not access the Service.
                </p>
                <p>
                  These Terms apply to all visitors, users, and others who access or use the Service, including but not limited to AI chatbot services, WhatsApp automation, voice services, and any related features.
                </p>
              </div>
            </motion.div>

            {/* Service Description */}
            <motion.div
              className="glass p-6 rounded-xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-semibold text-white mb-4">2. Service Description</h2>
              <div className="text-white/80 space-y-3">
                <p>WorkFusion provides AI-powered business automation services including:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>AI Chatbot assistants with multiple personalities</li>
                  <li>WhatsApp messaging automation</li>
                  <li>Voice synthesis and phone call automation</li>
                  <li>Token-based usage system</li>
                  <li>Dashboard analytics and reporting</li>
                </ul>
              </div>
            </motion.div>

            {/* Account Registration */}
            <motion.div
              className="glass p-6 rounded-xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-semibold text-white mb-4">3. Account Registration</h2>
              <div className="text-white/80 space-y-3">
                <p>To use our Service, you must:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Be at least 18 years old or have parental consent</li>
                  <li>Provide accurate and complete registration information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Notify us immediately of any unauthorized access</li>
                  <li>Be responsible for all activities under your account</li>
                </ul>
              </div>
            </motion.div>

            {/* Token System */}
            <motion.div
              className="glass p-6 rounded-xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                <Scale className="h-6 w-6 text-primary-green mr-2" />
                4. Token System and Pricing
              </h2>
              <div className="text-white/80 space-y-3">
                <p><strong>4.1 Free Tokens:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>New users receive 500 free tokens upon registration</li>
                  <li>Free tokens are for evaluation purposes</li>
                  <li>No credit card required for free tokens</li>
                </ul>
                
                <p className="mt-4"><strong>4.2 Token Usage:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>AI Chat: 20 tokens per message</li>
                  <li>WhatsApp: 50 tokens per message</li>
                  <li>Voice calls: 100 tokens per minute</li>
                  <li>Text-to-speech: 1 token per 20 characters</li>
                </ul>
                
                <p className="mt-4"><strong>4.3 Token Purchases:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Tokens are non-refundable once purchased</li>
                  <li>Unused tokens do not expire</li>
                  <li>Pricing subject to change with 30 days notice</li>
                </ul>
              </div>
            </motion.div>

            {/* Acceptable Use */}
            <motion.div
              className="glass p-6 rounded-xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                <AlertCircle className="h-6 w-6 text-yellow-500 mr-2" />
                5. Acceptable Use Policy
              </h2>
              <div className="text-white/80 space-y-3">
                <p>You agree NOT to use the Service to:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Violate any laws or regulations</li>
                  <li>Send spam or unsolicited messages</li>
                  <li>Harass, abuse, or harm others</li>
                  <li>Distribute malware or harmful code</li>
                  <li>Attempt to gain unauthorized access</li>
                  <li>Interfere with service operations</li>
                  <li>Generate or distribute illegal content</li>
                  <li>Violate intellectual property rights</li>
                </ul>
              </div>
            </motion.div>

            {/* Data and Privacy */}
            <motion.div
              className="glass p-6 rounded-xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="text-2xl font-semibold text-white mb-4">6. Data and Privacy</h2>
              <div className="text-white/80 space-y-3">
                <p>
                  Your use of our Service is also governed by our Privacy Policy. Please review our Privacy Policy, which also governs the Site and informs users of our data collection practices.
                </p>
                <Link href="/privacy" className="text-primary-green hover:underline inline-flex items-center">
                  View Privacy Policy →
                </Link>
              </div>
            </motion.div>

            {/* Intellectual Property */}
            <motion.div
              className="glass p-6 rounded-xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h2 className="text-2xl font-semibold text-white mb-4">7. Intellectual Property</h2>
              <div className="text-white/80 space-y-3">
                <p>
                  The Service and its original content, features, and functionality are owned by WorkFusion and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                </p>
                <p>
                  You retain ownership of content you create using our Service, but grant us a license to use, store, and process such content to provide the Service.
                </p>
              </div>
            </motion.div>

            {/* Disclaimers */}
            <motion.div
              className="glass p-6 rounded-xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h2 className="text-2xl font-semibold text-white mb-4">8. Disclaimers and Limitations</h2>
              <div className="text-white/80 space-y-3">
                <p>
                  THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DO NOT GUARANTEE THAT THE SERVICE WILL BE ERROR-FREE, UNINTERRUPTED, OR SECURE.
                </p>
                <p>
                  IN NO EVENT SHALL WORKFUSION BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING FROM YOUR USE OF THE SERVICE.
                </p>
                <p>
                  AI-generated content may contain errors or inaccuracies. Users are responsible for reviewing and verifying all AI-generated content before use.
                </p>
              </div>
            </motion.div>

            {/* Termination */}
            <motion.div
              className="glass p-6 rounded-xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
            >
              <h2 className="text-2xl font-semibold text-white mb-4">9. Termination</h2>
              <div className="text-white/80 space-y-3">
                <p>
                  We may terminate or suspend your account immediately, without prior notice or liability, for any reason, including breach of these Terms.
                </p>
                <p>
                  Upon termination, your right to use the Service will cease immediately. Purchased tokens are non-refundable.
                </p>
              </div>
            </motion.div>

            {/* Governing Law */}
            <motion.div
              className="glass p-6 rounded-xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
            >
              <h2 className="text-2xl font-semibold text-white mb-4">10. Governing Law</h2>
              <div className="text-white/80 space-y-3">
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
                </p>
              </div>
            </motion.div>

            {/* Changes to Terms */}
            <motion.div
              className="glass p-6 rounded-xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 }}
            >
              <h2 className="text-2xl font-semibold text-white mb-4">11. Changes to Terms</h2>
              <div className="text-white/80 space-y-3">
                <p>
                  We reserve the right to modify these Terms at any time. We will notify users of any material changes via email or through the Service.
                </p>
                <p>
                  Your continued use of the Service after changes constitutes acceptance of the modified Terms.
                </p>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              className="glass p-6 rounded-xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 }}
            >
              <h2 className="text-2xl font-semibold text-white mb-4">12. Contact Information</h2>
              <div className="text-white/80 space-y-3">
                <p>For questions about these Terms, please contact us at:</p>
                <div className="ml-4 space-y-2">
                  <p>Email: legal@workfusion.pro</p>
                  <p>Phone: +1 (877) 450-3224</p>
                  <p>Address: WorkFusion AI Agency, United States</p>
                </div>
              </div>
            </motion.div>

            {/* Agreement Button */}
            <motion.div
              className="glass-strong p-6 rounded-xl text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
            >
              <p className="text-white/80 mb-4">
                By using WorkFusion services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
              </p>
              <Link href="/auth/register">
                <Button className="btn-primary">
                  I Agree - Create Account
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}