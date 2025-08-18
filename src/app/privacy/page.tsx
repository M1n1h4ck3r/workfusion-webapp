'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Shield, Lock, Database, UserCheck, Globe, Mail } from 'lucide-react'

export default function PrivacyPage() {
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
              <Shield className="h-8 w-8 text-primary-green mr-3" />
              <h1 className="text-4xl font-bold text-white">Privacy Policy</h1>
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
              <h2 className="text-2xl font-semibold text-white mb-4">Introduction</h2>
              <div className="text-white/80 space-y-3">
                <p>
                  WorkFusion AI Agency (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service.
                </p>
                <p>
                  Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access the Service.
                </p>
              </div>
            </motion.div>

            {/* Information We Collect */}
            <motion.div
              className="glass p-6 rounded-xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                <Database className="h-6 w-6 text-primary-green mr-2" />
                1. Information We Collect
              </h2>
              <div className="text-white/80 space-y-3">
                <p><strong>1.1 Personal Information:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Name and contact information (email, phone number)</li>
                  <li>Account credentials and profile information</li>
                  <li>Billing and payment information</li>
                  <li>Company/organization details (if applicable)</li>
                </ul>
                
                <p className="mt-4"><strong>1.2 Usage Information:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>AI chat conversations and interactions</li>
                  <li>WhatsApp message content and metadata</li>
                  <li>Voice call recordings and transcriptions</li>
                  <li>Token usage and transaction history</li>
                  <li>Feature usage patterns and preferences</li>
                </ul>
                
                <p className="mt-4"><strong>1.3 Technical Information:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>IP address and device information</li>
                  <li>Browser type and version</li>
                  <li>Operating system</li>
                  <li>Cookies and similar tracking technologies</li>
                  <li>Log data and analytics</li>
                </ul>
              </div>
            </motion.div>

            {/* How We Use Information */}
            <motion.div
              className="glass p-6 rounded-xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                <UserCheck className="h-6 w-6 text-primary-green mr-2" />
                2. How We Use Your Information
              </h2>
              <div className="text-white/80 space-y-3">
                <p>We use collected information to:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Provide and maintain our AI services</li>
                  <li>Process transactions and manage billing</li>
                  <li>Improve and personalize user experience</li>
                  <li>Train and improve our AI models (with anonymized data)</li>
                  <li>Send service updates and notifications</li>
                  <li>Send marketing communications (with consent)</li>
                  <li>Provide customer support</li>
                  <li>Detect and prevent fraud or abuse</li>
                  <li>Comply with legal obligations</li>
                  <li>Analyze usage patterns and trends</li>
                </ul>
              </div>
            </motion.div>

            {/* Data Sharing */}
            <motion.div
              className="glass p-6 rounded-xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                <Globe className="h-6 w-6 text-primary-green mr-2" />
                3. Information Sharing and Disclosure
              </h2>
              <div className="text-white/80 space-y-3">
                <p>We may share your information with:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li><strong>Service Providers:</strong> AI providers (OpenAI, Anthropic), cloud hosting (AWS, Google Cloud), payment processors (Stripe, Asaas)</li>
                  <li><strong>Third-Party Integrations:</strong> WhatsApp Business API, voice service providers</li>
                  <li><strong>Legal Requirements:</strong> When required by law, court order, or government request</li>
                  <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
                  <li><strong>Consent:</strong> With your explicit consent for specific purposes</li>
                </ul>
                <p className="mt-4">
                  We do NOT sell, rent, or trade your personal information to third parties for marketing purposes.
                </p>
              </div>
            </motion.div>

            {/* Data Security */}
            <motion.div
              className="glass p-6 rounded-xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                <Lock className="h-6 w-6 text-primary-green mr-2" />
                4. Data Security
              </h2>
              <div className="text-white/80 space-y-3">
                <p>We implement industry-standard security measures including:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Secure HTTPS connections</li>
                  <li>Regular security audits and updates</li>
                  <li>Access controls and authentication</li>
                  <li>Secure data centers with physical security</li>
                  <li>Employee training on data protection</li>
                </ul>
                <p className="mt-4">
                  However, no method of electronic transmission or storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
                </p>
              </div>
            </motion.div>

            {/* Data Retention */}
            <motion.div
              className="glass p-6 rounded-xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="text-2xl font-semibold text-white mb-4">5. Data Retention</h2>
              <div className="text-white/80 space-y-3">
                <p>We retain your information for as long as necessary to:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Provide our services to you</li>
                  <li>Comply with legal obligations</li>
                  <li>Resolve disputes and enforce agreements</li>
                  <li>Maintain business records</li>
                </ul>
                <p className="mt-4">
                  Chat logs and AI interactions are retained for 90 days unless you request deletion. Account information is retained until account deletion.
                </p>
              </div>
            </motion.div>

            {/* Your Rights */}
            <motion.div
              className="glass p-6 rounded-xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h2 className="text-2xl font-semibold text-white mb-4">6. Your Privacy Rights</h2>
              <div className="text-white/80 space-y-3">
                <p>You have the right to:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li><strong>Access:</strong> Request a copy of your personal information</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                  <li><strong>Portability:</strong> Request your data in a portable format</li>
                  <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                  <li><strong>Restriction:</strong> Request restriction of processing</li>
                  <li><strong>Object:</strong> Object to certain processing activities</li>
                </ul>
                <p className="mt-4">
                  To exercise these rights, contact us at privacy@workfusion.pro
                </p>
              </div>
            </motion.div>

            {/* Cookies */}
            <motion.div
              className="glass p-6 rounded-xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h2 className="text-2xl font-semibold text-white mb-4">7. Cookies and Tracking</h2>
              <div className="text-white/80 space-y-3">
                <p>We use cookies and similar technologies to:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Maintain session state and authentication</li>
                  <li>Remember user preferences</li>
                  <li>Analyze usage patterns</li>
                  <li>Improve service performance</li>
                </ul>
                <p className="mt-4">
                  You can control cookies through your browser settings, but disabling cookies may limit functionality.
                </p>
              </div>
            </motion.div>

            {/* Children's Privacy */}
            <motion.div
              className="glass p-6 rounded-xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
            >
              <h2 className="text-2xl font-semibold text-white mb-4">8. Children&apos;s Privacy</h2>
              <div className="text-white/80 space-y-3">
                <p>
                  Our Service is not intended for children under 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
                </p>
              </div>
            </motion.div>

            {/* International Transfers */}
            <motion.div
              className="glass p-6 rounded-xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
            >
              <h2 className="text-2xl font-semibold text-white mb-4">9. International Data Transfers</h2>
              <div className="text-white/80 space-y-3">
                <p>
                  Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for international transfers in compliance with applicable laws.
                </p>
              </div>
            </motion.div>

            {/* California Privacy Rights */}
            <motion.div
              className="glass p-6 rounded-xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 }}
            >
              <h2 className="text-2xl font-semibold text-white mb-4">10. California Privacy Rights</h2>
              <div className="text-white/80 space-y-3">
                <p>
                  California residents have additional rights under the California Consumer Privacy Act (CCPA), including the right to know, delete, opt-out, and non-discrimination. To exercise these rights, contact us at privacy@workfusion.pro.
                </p>
              </div>
            </motion.div>

            {/* Updates to Policy */}
            <motion.div
              className="glass p-6 rounded-xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 }}
            >
              <h2 className="text-2xl font-semibold text-white mb-4">11. Changes to This Privacy Policy</h2>
              <div className="text-white/80 space-y-3">
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &ldquo;Last Updated&rdquo; date.
                </p>
                <p>
                  For material changes, we will provide additional notice via email or through the Service.
                </p>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              className="glass p-6 rounded-xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.3 }}
            >
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                <Mail className="h-6 w-6 text-primary-green mr-2" />
                12. Contact Us
              </h2>
              <div className="text-white/80 space-y-3">
                <p>For privacy-related questions or concerns, contact us at:</p>
                <div className="ml-4 space-y-2">
                  <p><strong>Email:</strong> privacy@workfusion.pro</p>
                  <p><strong>Phone:</strong> +1 (877) 450-3224</p>
                  <p><strong>Data Protection Officer:</strong> dpo@workfusion.pro</p>
                  <p><strong>Address:</strong> WorkFusion AI Agency, United States</p>
                </div>
              </div>
            </motion.div>

            {/* Acknowledgment */}
            <motion.div
              className="glass-strong p-6 rounded-xl text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
            >
              <p className="text-white/80 mb-4">
                By using WorkFusion services, you acknowledge that you have read and understood this Privacy Policy.
              </p>
              <div className="flex justify-center gap-4">
                <Link href="/terms">
                  <Button variant="outline" className="glass text-white border-white/20 hover:bg-white/10">
                    View Terms & Conditions
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="btn-primary">
                    Create Account
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}