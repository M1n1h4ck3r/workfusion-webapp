'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ExternalLink, Copy, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'

export default function OAuthSetupPage() {
  const [copiedItem, setCopiedItem] = useState<string | null>(null)

  const copyToClipboard = (text: string, item: string) => {
    navigator.clipboard.writeText(text)
    setCopiedItem(item)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopiedItem(null), 2000)
  }

  const steps = [
    {
      title: "1. Create Google OAuth App",
      items: [
        "Go to Google Cloud Console",
        "Create a new project or select existing",
        "Enable Google+ API",
        "Create OAuth 2.0 credentials",
        "Add authorized redirect URI: https://your-supabase-url.supabase.co/auth/v1/callback"
      ],
      link: "https://console.cloud.google.com/",
      envVars: [
        { key: "GOOGLE_CLIENT_ID", value: "your_google_client_id_here" },
        { key: "GOOGLE_CLIENT_SECRET", value: "your_google_client_secret_here" }
      ]
    },
    {
      title: "2. Create GitHub OAuth App",
      items: [
        "Go to GitHub Settings > Developer settings",
        "Click 'New OAuth App'",
        "Set Homepage URL to your domain",
        "Set Authorization callback URL: https://your-supabase-url.supabase.co/auth/v1/callback"
      ],
      link: "https://github.com/settings/developers",
      envVars: [
        { key: "GITHUB_CLIENT_ID", value: "your_github_client_id_here" },
        { key: "GITHUB_CLIENT_SECRET", value: "your_github_client_secret_here" }
      ]
    },
    {
      title: "3. Configure Supabase",
      items: [
        "Go to Supabase Dashboard > Authentication > Providers",
        "Enable Google provider and add credentials",
        "Enable GitHub provider and add credentials",
        "Save the configuration"
      ],
      link: "https://app.supabase.com/",
      envVars: [
        { key: "NEXT_PUBLIC_SUPABASE_URL", value: "https://your-project.supabase.co" },
        { key: "NEXT_PUBLIC_SUPABASE_ANON_KEY", value: "your_anon_key_here" }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-dark py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/auth/login">
            <Button
              variant="outline"
              className="glass text-white border-white/20 hover:bg-white/10 mb-8"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
          </Link>

          <div className="glass-strong p-8 rounded-2xl">
            <div className="text-center mb-8">
              <Badge className="mb-4 bg-primary-yellow/20 text-primary-yellow border-primary-yellow/30">
                Setup Guide
              </Badge>
              <h1 className="text-3xl font-bold text-white mb-4">
                OAuth Authentication Setup
              </h1>
              <p className="text-white/80 max-w-2xl mx-auto">
                Follow these steps to enable Google and GitHub login for your WorkFusion instance
              </p>
            </div>

            <div className="space-y-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  className="glass p-6 rounded-xl"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <h2 className="text-xl font-semibold text-white mb-4">{step.title}</h2>
                  
                  <ul className="space-y-2 mb-4">
                    {step.items.map((item, idx) => (
                      <li key={idx} className="flex items-start text-white/80">
                        <CheckCircle className="h-5 w-5 text-primary-green mr-2 flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={step.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary-green hover:underline mb-4"
                  >
                    Open Console
                    <ExternalLink className="ml-1 h-4 w-4" />
                  </a>

                  {step.envVars && (
                    <div className="mt-4 p-4 bg-black/30 rounded-lg">
                      <p className="text-white/60 text-sm mb-3">Add to .env.local:</p>
                      <div className="space-y-2">
                        {step.envVars.map((envVar, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <code className="text-primary-green text-sm">
                              {envVar.key}={envVar.value}
                            </code>
                            <button
                              onClick={() => copyToClipboard(`${envVar.key}=${envVar.value}`, `${step.title}-${idx}`)}
                              className="p-1 hover:bg-white/10 rounded transition-colors"
                            >
                              {copiedItem === `${step.title}-${idx}` ? (
                                <CheckCircle className="h-4 w-4 text-primary-green" />
                              ) : (
                                <Copy className="h-4 w-4 text-white/60" />
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            <motion.div
              className="mt-8 p-6 bg-primary-green/10 border border-primary-green/30 rounded-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-lg font-semibold text-white mb-2">
                🎯 Demo Mode Available
              </h3>
              <p className="text-white/80 mb-4">
                While you set up OAuth, you can still test the application using email/password login. 
                Any valid email and password combination will work in demo mode.
              </p>
              <Link href="/auth/login">
                <Button className="btn-primary">
                  Try Demo Login
                </Button>
              </Link>
            </motion.div>

            <motion.div
              className="mt-6 p-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-lg font-semibold text-white mb-2">
                ⚠️ Important Notes
              </h3>
              <ul className="space-y-2 text-white/80">
                <li>• OAuth apps may take a few minutes to activate</li>
                <li>• Make sure redirect URIs match exactly</li>
                <li>• Keep your client secrets secure and never commit them to Git</li>
                <li>• Test in development before deploying to production</li>
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}