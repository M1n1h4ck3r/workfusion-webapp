'use client'

import { BuilderPage } from '@/components/builder/BuilderPage'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'
import { toast } from 'sonner'

export default function BuilderTestPage() {
  const [showBuilderEditor, setShowBuilderEditor] = useState(false)

  const handleSyncToBuilder = async () => {
    try {
      const response = await fetch('/api/builder/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'component-update',
          data: {
            name: 'Test Page from Workfusion',
            data: {
              title: 'Hello from Workfusion!',
              description: 'This page was created from the Workfusion platform'
            }
          }
        })
      })

      if (response.ok) {
        toast.success('Successfully synced to Builder.io!')
      } else {
        toast.error('Failed to sync to Builder.io')
      }
    } catch (error) {
      console.error('Sync error:', error)
      toast.error('Error syncing to Builder.io')
    }
  }

  if (showBuilderEditor) {
    return <BuilderPage model="page" url="/builder" />
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Builder.io Integration Test
          </h1>
          <p className="text-white/80 text-lg mb-6">
            Test the Builder.io integration with Workfusion components
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              Builder.io Ready
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              Components Registered
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
              Sync Enabled
            </Badge>
          </div>
        </div>

        {/* Component Showcase */}
        <div className="glass-strong p-8 rounded-2xl">
          <h2 className="text-2xl font-bold text-white mb-6">Available Components</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Button Components */}
            <div className="glass p-4 rounded-lg">
              <h3 className="text-white font-semibold mb-3">Buttons</h3>
              <div className="space-y-2">
                <Button className="w-full">Primary Button</Button>
                <Button variant="outline" className="w-full">Outline Button</Button>
                <Button variant="ghost" className="w-full">Ghost Button</Button>
              </div>
            </div>

            {/* Badge Components */}
            <div className="glass p-4 rounded-lg">
              <h3 className="text-white font-semibold mb-3">Badges</h3>
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
            </div>

            {/* Layout Components */}
            <div className="glass p-4 rounded-lg">
              <h3 className="text-white font-semibold mb-3">Layouts</h3>
              <div className="space-y-2">
                <div className="text-white/60 text-sm">Glass Card</div>
                <div className="text-white/60 text-sm">Grid Layout</div>
                <div className="text-white/60 text-sm">Gradient Background</div>
              </div>
            </div>
          </div>
        </div>

        {/* Builder Actions */}
        <div className="glass-strong p-8 rounded-2xl">
          <h2 className="text-2xl font-bold text-white mb-6">Builder.io Actions</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Development</h3>
              <div className="space-y-3">
                <Button 
                  onClick={() => setShowBuilderEditor(true)}
                  className="w-full bg-primary-blue hover:bg-primary-blue/90"
                >
                  Open Builder.io Editor
                </Button>
                <Button 
                  onClick={handleSyncToBuilder}
                  variant="outline"
                  className="w-full"
                >
                  Sync Test Content
                </Button>
                <Button 
                  onClick={() => window.open('https://builder.io', '_blank')}
                  variant="ghost"
                  className="w-full"
                >
                  Open Builder.io Dashboard
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Integration Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 glass rounded-lg">
                  <span className="text-white/80">API Connection</span>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    Connected
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 glass rounded-lg">
                  <span className="text-white/80">Components Registered</span>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    8 Components
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 glass rounded-lg">
                  <span className="text-white/80">Webhook Status</span>
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                    Pending Setup
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Setup Instructions */}
        <div className="glass-strong p-8 rounded-2xl">
          <h2 className="text-2xl font-bold text-white mb-6">Setup Instructions</h2>
          
          <div className="space-y-4 text-white/80">
            <div className="p-4 glass rounded-lg">
              <h3 className="font-semibold text-white mb-2">1. Environment Variables</h3>
              <p className="text-sm">Copy <code className="bg-white/10 px-2 py-1 rounded">.env.builder.example</code> to <code className="bg-white/10 px-2 py-1 rounded">.env.local</code> and add your Builder.io API keys.</p>
            </div>
            
            <div className="p-4 glass rounded-lg">
              <h3 className="font-semibold text-white mb-2">2. Builder.io Account Setup</h3>
              <p className="text-sm">Create a Builder.io account and get your API keys from the account settings.</p>
            </div>
            
            <div className="p-4 glass rounded-lg">
              <h3 className="font-semibold text-white mb-2">3. Webhook Configuration</h3>
              <p className="text-sm">Set up webhooks in Builder.io to point to <code className="bg-white/10 px-2 py-1 rounded">/api/builder/webhook</code> for real-time sync.</p>
            </div>
            
            <div className="p-4 glass rounded-lg">
              <h3 className="font-semibold text-white mb-2">4. Component Registration</h3>
              <p className="text-sm">All Workfusion components are automatically registered and available in the Builder.io editor.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}