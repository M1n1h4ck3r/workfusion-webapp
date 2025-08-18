'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function DebugPage() {
  const [testState, setTestState] = useState('Ready')

  const testComponents = () => {
    setTestState('Testing...')
    setTimeout(() => {
      setTestState('All components working!')
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-dark-bg p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">
          Component Debug Page
        </h1>
        
        <div className="space-y-6">
          {/* Basic UI Components Test */}
          <div className="glass p-6 rounded-2xl">
            <h2 className="text-2xl font-semibold text-white mb-4">Basic Components</h2>
            <div className="flex items-center space-x-4">
              <Button onClick={testComponents} className="btn-primary">
                Test Components
              </Button>
              <Badge className="bg-primary-green/20 text-primary-green border-primary-green/30">
                {testState}
              </Badge>
            </div>
          </div>

          {/* Tailwind Classes Test */}
          <div className="glass p-6 rounded-2xl">
            <h2 className="text-2xl font-semibold text-white mb-4">Tailwind Classes</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-primary-green p-4 rounded-lg text-center">
                <span className="text-white font-semibold">Primary Green</span>
              </div>
              <div className="bg-primary-yellow p-4 rounded-lg text-center">
                <span className="text-dark-bg font-semibold">Primary Yellow</span>
              </div>
              <div className="bg-primary-orange p-4 rounded-lg text-center">
                <span className="text-white font-semibold">Primary Orange</span>
              </div>
            </div>
          </div>

          {/* Gradient Test */}
          <div className="glass p-6 rounded-2xl">
            <h2 className="text-2xl font-semibold text-white mb-4">Gradients</h2>
            <div className="bg-gradient-primary p-8 rounded-lg text-center">
              <span className="text-white font-bold text-2xl">Gradient Background</span>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-bold gradient-text">Gradient Text</span>
            </div>
          </div>

          {/* Console Log Test */}
          <div className="glass p-6 rounded-2xl">
            <h2 className="text-2xl font-semibold text-white mb-4">Console Check</h2>
            <p className="text-white/80 mb-4">
              Open browser console (F12) to check for JavaScript errors.
            </p>
            <Button 
              onClick={() => {
                console.log('✅ Console test working')
                console.log('Current URL:', window.location.href)
                console.log('User Agent:', navigator.userAgent)
              }}
              variant="outline" 
              className="glass text-white border-white/20"
            >
              Log to Console
            </Button>
          </div>

          {/* Server Info */}
          <div className="glass p-6 rounded-2xl">
            <h2 className="text-2xl font-semibold text-white mb-4">Server Information</h2>
            <div className="space-y-2 text-white/80">
              <p>Current URL: <span className="text-primary-green font-mono">{typeof window !== 'undefined' ? window.location.href : 'Loading...'}</span></p>
              <p>Environment: <span className="text-primary-yellow">Development</span></p>
              <p>Expected Port: <span className="text-primary-orange">3005</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}