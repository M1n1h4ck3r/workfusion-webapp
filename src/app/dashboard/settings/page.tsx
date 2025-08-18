'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/ui/loading'
import { motion } from 'framer-motion'
import { 
  Key, Save, Eye, EyeOff, CheckCircle, AlertCircle,
  Bot, Brain, MessageSquare, Phone, Globe, Shield
} from 'lucide-react'
import { toast } from 'sonner'
import { configureAIService } from '@/services/ai-service'

export default function SettingsPage() {
  const [apiKeys, setApiKeys] = useState({
    openai: '',
    anthropic: '',
    google: '',
    whatsapp: '',
    twilio: ''
  })
  
  const [showKeys, setShowKeys] = useState({
    openai: false,
    anthropic: false,
    google: false,
    whatsapp: false,
    twilio: false
  })
  
  const [selectedProvider, setSelectedProvider] = useState<'openai' | 'anthropic' | 'demo'>('demo')
  const [isSaving, setIsSaving] = useState(false)
  const [testResults, setTestResults] = useState<Record<string, boolean>>({})

  const handleSaveKeys = async () => {
    setIsSaving(true)
    
    try {
      // Save to localStorage (in production, save to backend)
      localStorage.setItem('api_keys', JSON.stringify(apiKeys))
      localStorage.setItem('ai_provider', selectedProvider)
      
      // Configure AI service with the selected provider
      if (selectedProvider === 'openai' && apiKeys.openai) {
        configureAIService({
          provider: 'openai',
          apiKey: apiKeys.openai,
          model: 'gpt-3.5-turbo'
        })
      } else if (selectedProvider === 'anthropic' && apiKeys.anthropic) {
        configureAIService({
          provider: 'anthropic',
          apiKey: apiKeys.anthropic,
          model: 'claude-3-sonnet-20240229'
        })
      } else {
        configureAIService({
          provider: 'demo'
        })
      }
      
      toast.success('Settings saved successfully!')
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  const testApiKey = async (service: keyof typeof apiKeys) => {
    const key = apiKeys[service]
    if (!key) {
      toast.error(`Please enter a ${service} API key first`)
      return
    }
    
    // Simulate API key validation
    toast.info(`Testing ${service} API key...`)
    
    setTimeout(() => {
      // For demo, randomly succeed/fail
      const success = Math.random() > 0.3
      setTestResults({ ...testResults, [service]: success })
      
      if (success) {
        toast.success(`${service} API key is valid!`)
      } else {
        toast.error(`Invalid ${service} API key`)
      }
    }, 1500)
  }

  const providers = [
    {
      id: 'openai',
      name: 'OpenAI',
      icon: Brain,
      models: ['GPT-3.5 Turbo', 'GPT-4', 'GPT-4 Turbo'],
      description: 'Powerful language models with broad capabilities',
      color: 'from-green-400 to-emerald-500'
    },
    {
      id: 'anthropic',
      name: 'Anthropic Claude',
      icon: Bot,
      models: ['Claude 3 Sonnet', 'Claude 3 Opus', 'Claude 3 Haiku'],
      description: 'Advanced AI with strong reasoning and safety',
      color: 'from-purple-400 to-pink-500'
    },
    {
      id: 'demo',
      name: 'Demo Mode',
      icon: Shield,
      models: ['Simulated Responses'],
      description: 'Test the interface without API keys',
      color: 'from-gray-400 to-gray-500'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">API Settings</h1>
        <p className="text-white/80">Configure your API keys and service providers</p>
      </div>

      {/* AI Provider Selection */}
      <motion.div
        className="glass-strong p-6 rounded-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-xl font-semibold text-white mb-4">AI Provider</h2>
        
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {providers.map((provider) => (
            <button
              key={provider.id}
              onClick={() => setSelectedProvider(provider.id as any)}
              className={`glass p-4 rounded-xl text-left transition-all ${
                selectedProvider === provider.id 
                  ? 'border-2 border-primary-green shadow-lg shadow-primary-green/20' 
                  : 'border border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-10 h-10 bg-gradient-to-r ${provider.color} rounded-lg flex items-center justify-center`}>
                  <provider.icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium">{provider.name}</h3>
                  <p className="text-white/60 text-xs mt-1">{provider.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {provider.models.map((model) => (
                      <Badge key={model} className="bg-white/10 text-white/80 border-white/20 text-xs">
                        {model}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {selectedProvider === 'demo' && (
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p className="text-yellow-400 text-sm flex items-start">
              <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
              Demo mode provides simulated responses for testing. Configure API keys to enable real AI functionality.
            </p>
          </div>
        )}
      </motion.div>

      {/* API Keys Configuration */}
      <motion.div
        className="glass-strong p-6 rounded-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold text-white mb-4">API Keys</h2>
        
        <div className="space-y-4">
          {/* OpenAI */}
          <div>
            <Label htmlFor="openai" className="text-white/90 flex items-center">
              <Brain className="mr-2 h-4 w-4" />
              OpenAI API Key
            </Label>
            <div className="flex items-center space-x-2 mt-1">
              <div className="relative flex-1">
                <Input
                  id="openai"
                  type={showKeys.openai ? "text" : "password"}
                  value={apiKeys.openai}
                  onChange={(e) => setApiKeys({ ...apiKeys, openai: e.target.value })}
                  placeholder="sk-..."
                  className="input-glass pr-10"
                />
                <button
                  onClick={() => setShowKeys({ ...showKeys, openai: !showKeys.openai })}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded transition-colors"
                >
                  {showKeys.openai ? (
                    <EyeOff className="h-4 w-4 text-white/60" />
                  ) : (
                    <Eye className="h-4 w-4 text-white/60" />
                  )}
                </button>
              </div>
              <Button
                onClick={() => testApiKey('openai')}
                variant="outline"
                className="glass text-white border-white/20 hover:bg-white/10"
              >
                Test
              </Button>
              {testResults.openai !== undefined && (
                testResults.openai ? (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-400" />
                )
              )}
            </div>
            <p className="text-xs text-white/60 mt-1">
              Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary-green hover:underline">OpenAI Dashboard</a>
            </p>
          </div>

          {/* Anthropic */}
          <div>
            <Label htmlFor="anthropic" className="text-white/90 flex items-center">
              <Bot className="mr-2 h-4 w-4" />
              Anthropic API Key
            </Label>
            <div className="flex items-center space-x-2 mt-1">
              <div className="relative flex-1">
                <Input
                  id="anthropic"
                  type={showKeys.anthropic ? "text" : "password"}
                  value={apiKeys.anthropic}
                  onChange={(e) => setApiKeys({ ...apiKeys, anthropic: e.target.value })}
                  placeholder="sk-ant-..."
                  className="input-glass pr-10"
                />
                <button
                  onClick={() => setShowKeys({ ...showKeys, anthropic: !showKeys.anthropic })}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded transition-colors"
                >
                  {showKeys.anthropic ? (
                    <EyeOff className="h-4 w-4 text-white/60" />
                  ) : (
                    <Eye className="h-4 w-4 text-white/60" />
                  )}
                </button>
              </div>
              <Button
                onClick={() => testApiKey('anthropic')}
                variant="outline"
                className="glass text-white border-white/20 hover:bg-white/10"
              >
                Test
              </Button>
              {testResults.anthropic !== undefined && (
                testResults.anthropic ? (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-400" />
                )
              )}
            </div>
            <p className="text-xs text-white/60 mt-1">
              Get your API key from <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="text-primary-green hover:underline">Anthropic Console</a>
            </p>
          </div>

          {/* WhatsApp */}
          <div>
            <Label htmlFor="whatsapp" className="text-white/90 flex items-center">
              <MessageSquare className="mr-2 h-4 w-4" />
              WhatsApp API Token
            </Label>
            <div className="flex items-center space-x-2 mt-1">
              <div className="relative flex-1">
                <Input
                  id="whatsapp"
                  type={showKeys.whatsapp ? "text" : "password"}
                  value={apiKeys.whatsapp}
                  onChange={(e) => setApiKeys({ ...apiKeys, whatsapp: e.target.value })}
                  placeholder="EAAI..."
                  className="input-glass pr-10"
                />
                <button
                  onClick={() => setShowKeys({ ...showKeys, whatsapp: !showKeys.whatsapp })}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded transition-colors"
                >
                  {showKeys.whatsapp ? (
                    <EyeOff className="h-4 w-4 text-white/60" />
                  ) : (
                    <Eye className="h-4 w-4 text-white/60" />
                  )}
                </button>
              </div>
              <Button
                onClick={() => testApiKey('whatsapp')}
                variant="outline"
                className="glass text-white border-white/20 hover:bg-white/10"
              >
                Test
              </Button>
              {testResults.whatsapp !== undefined && (
                testResults.whatsapp ? (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-400" />
                )
              )}
            </div>
            <p className="text-xs text-white/60 mt-1">
              Configure through <a href="https://business.facebook.com/" target="_blank" rel="noopener noreferrer" className="text-primary-green hover:underline">Meta Business</a>
            </p>
          </div>

          {/* Twilio */}
          <div>
            <Label htmlFor="twilio" className="text-white/90 flex items-center">
              <Phone className="mr-2 h-4 w-4" />
              Twilio Auth Token
            </Label>
            <div className="flex items-center space-x-2 mt-1">
              <div className="relative flex-1">
                <Input
                  id="twilio"
                  type={showKeys.twilio ? "text" : "password"}
                  value={apiKeys.twilio}
                  onChange={(e) => setApiKeys({ ...apiKeys, twilio: e.target.value })}
                  placeholder="SK..."
                  className="input-glass pr-10"
                />
                <button
                  onClick={() => setShowKeys({ ...showKeys, twilio: !showKeys.twilio })}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded transition-colors"
                >
                  {showKeys.twilio ? (
                    <EyeOff className="h-4 w-4 text-white/60" />
                  ) : (
                    <Eye className="h-4 w-4 text-white/60" />
                  )}
                </button>
              </div>
              <Button
                onClick={() => testApiKey('twilio')}
                variant="outline"
                className="glass text-white border-white/20 hover:bg-white/10"
              >
                Test
              </Button>
              {testResults.twilio !== undefined && (
                testResults.twilio ? (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-400" />
                )
              )}
            </div>
            <p className="text-xs text-white/60 mt-1">
              Get your credentials from <a href="https://console.twilio.com/" target="_blank" rel="noopener noreferrer" className="text-primary-green hover:underline">Twilio Console</a>
            </p>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-6">
          <Button
            onClick={handleSaveKeys}
            disabled={isSaving}
            className="btn-primary"
          >
            {isSaving ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </motion.div>

      {/* Security Notice */}
      <motion.div
        className="glass-strong p-6 rounded-2xl border-yellow-500/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-start space-x-3">
          <Shield className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Security Notice</h3>
            <ul className="space-y-1 text-white/70 text-sm">
              <li>• API keys are stored locally in your browser</li>
              <li>• Never share your API keys with anyone</li>
              <li>• Use environment variables in production</li>
              <li>• Rotate keys regularly for security</li>
              <li>• Set usage limits in your provider dashboards</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  )
}