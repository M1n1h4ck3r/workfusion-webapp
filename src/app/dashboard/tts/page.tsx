'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/ui/loading'
import { 
  Mic, Volume2, Download, Play, Pause, RotateCcw,
  FileAudio, Clock, Settings, Zap, Upload, 
  Layers, Radio, Sliders, Copy, 
  FileText, Languages, Music, Repeat
} from 'lucide-react'
import { toast } from 'sonner'
import { useTokenStore } from '@/store/token-store'

export default function TTSPage() {
  const [text, setText] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedVoice, setSelectedVoice] = useState('alloy')
  const [speed, setSpeed] = useState(1.0)
  const [pitch, setPitch] = useState(1.0)
  const [volume, setVolume] = useState(1.0)
  const [generatedAudio, setGeneratedAudio] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('basic')
  const [ssmlEnabled, setSsmlEnabled] = useState(false)
  const [batchTexts, setBatchTexts] = useState([''])
  const [voiceCloneFile, setVoiceCloneFile] = useState<File | null>(null)
  const { balance } = useTokenStore()

  const voices = [
    { id: 'alloy', name: 'Alloy', gender: 'Neutral', accent: 'American', quality: 'Standard' },
    { id: 'echo', name: 'Echo', gender: 'Male', accent: 'American', quality: 'Standard' },
    { id: 'fable', name: 'Fable', gender: 'Male', accent: 'British', quality: 'Standard' },
    { id: 'onyx', name: 'Onyx', gender: 'Male', accent: 'American', quality: 'Standard' },
    { id: 'nova', name: 'Nova', gender: 'Female', accent: 'American', quality: 'Standard' },
    { id: 'shimmer', name: 'Shimmer', gender: 'Female', accent: 'American', quality: 'Standard' },
    { id: 'neural-1', name: 'Neural Voice 1', gender: 'Female', accent: 'American', quality: 'Neural' },
    { id: 'neural-2', name: 'Neural Voice 2', gender: 'Male', accent: 'British', quality: 'Neural' },
    { id: 'clone-custom', name: 'Custom Clone', gender: 'Custom', accent: 'Custom', quality: 'Cloned' }
  ]

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
    { code: 'pt', name: 'Portuguese', flag: '🇧🇷' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' }
  ]

  const presets = [
    {
      name: 'Welcome Message',
      text: 'Welcome to our service! We\'re excited to help you achieve your goals. How can we assist you today?'
    },
    {
      name: 'Phone Greeting',
      text: 'Hello, thank you for calling. My name is Alex, and I\'ll be helping you today. How may I assist you?'
    },
    {
      name: 'Meeting Reminder',
      text: 'This is a friendly reminder about your upcoming meeting scheduled for tomorrow at 2 PM. Please confirm your attendance.'
    },
    {
      name: 'Product Demo',
      text: 'Let me show you the key features of our platform that will help streamline your workflow and increase productivity.'
    }
  ]

  // Mock audio history
  const audioHistory = [
    {
      id: 1,
      text: 'Welcome to our new AI platform...',
      voice: 'Nova',
      duration: '0:45',
      created: '2024-01-15 14:30',
      tokens: 3
    },
    {
      id: 2,
      text: 'Thank you for choosing our service...',
      voice: 'Alloy',
      duration: '0:32',
      created: '2024-01-15 13:15',
      tokens: 2
    },
    {
      id: 3,
      text: 'Your appointment has been confirmed...',
      voice: 'Echo',
      duration: '0:28',
      created: '2024-01-15 12:00',
      tokens: 2
    }
  ]

  const calculateTokens = () => {
    return Math.ceil(text.length / 100)
  }

  const handleGenerate = () => {
    if (!text.trim()) {
      toast.error('Please enter some text to convert')
      return
    }

    const tokenCost = calculateTokens()
    if (balance < tokenCost) {
      toast.error('Insufficient tokens. Please recharge.')
      return
    }

    setIsGenerating(true)
    toast.info('Generating speech...')

    // Simulate TTS generation
    setTimeout(() => {
      setGeneratedAudio('demo-audio-url')
      setIsGenerating(false)
      toast.success(`Speech generated! -${tokenCost} tokens used`)
    }, 2000)
  }

  const handlePlay = () => {
    if (!generatedAudio) return
    
    setIsPlaying(!isPlaying)
    toast.info(isPlaying ? 'Paused' : 'Playing audio')
    
    // Simulate audio playback
    if (!isPlaying) {
      setTimeout(() => {
        setIsPlaying(false)
        toast.success('Playback completed')
      }, 3000)
    }
  }

  const handleDownload = () => {
    if (!generatedAudio) return
    toast.success('Audio file downloaded')
  }

  const loadPreset = (presetText: string) => {
    setText(presetText)
  }

  const handleVoiceCloneUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type.startsWith('audio/')) {
        setVoiceCloneFile(file)
        toast.success('Voice sample uploaded for cloning')
      } else {
        toast.error('Please upload an audio file')
      }
    }
  }

  const handleBatchGenerate = () => {
    const validTexts = batchTexts.filter(t => t.trim())
    if (validTexts.length === 0) {
      toast.error('Please add some texts to the batch')
      return
    }

    const tokenCost = validTexts.reduce((sum, t) => sum + Math.ceil(t.length / 100), 0)
    if (balance < tokenCost) {
      toast.error('Insufficient tokens for batch generation')
      return
    }

    setIsGenerating(true)
    toast.info(`Generating ${validTexts.length} audio files...`)

    setTimeout(() => {
      setIsGenerating(false)
      toast.success(`Batch generation completed! -${tokenCost} tokens used`)
    }, 3000)
  }

  const addBatchText = () => {
    setBatchTexts([...batchTexts, ''])
  }

  const removeBatchText = (index: number) => {
    setBatchTexts(batchTexts.filter((_, i) => i !== index))
  }

  const updateBatchText = (index: number, value: string) => {
    const newTexts = [...batchTexts]
    newTexts[index] = value
    setBatchTexts(newTexts)
  }

  const insertSSMLTag = (tag: string) => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = text.substring(start, end)
    
    let insertion = ''
    switch (tag) {
      case 'break':
        insertion = '<break time="1s"/>'
        break
      case 'emphasis':
        insertion = selectedText ? `<emphasis level="strong">${selectedText}</emphasis>` : '<emphasis level="strong">text</emphasis>'
        break
      case 'prosody':
        insertion = selectedText ? `<prosody rate="slow" pitch="low">${selectedText}</prosody>` : '<prosody rate="slow" pitch="low">text</prosody>'
        break
      case 'voice':
        insertion = selectedText ? `<voice name="en-US-Neural2">${selectedText}</voice>` : '<voice name="en-US-Neural2">text</voice>'
        break
    }

    const newText = text.substring(0, start) + insertion + text.substring(end)
    setText(newText)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Advanced Text to Speech</h1>
          <p className="text-white/80">Professional voice synthesis with neural AI</p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <Badge className="bg-primary-green/20 text-primary-green border-primary-green/30">
            <Zap className="mr-1 h-3 w-3" />
            {balance} Tokens
          </Badge>
          <Button variant="outline" className="glass text-white border-white/20">
            <Upload className="mr-2 h-4 w-4" />
            Import Text
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-white/5 rounded-xl p-1">
        {[
          { id: 'basic', label: 'Basic TTS', icon: Mic },
          { id: 'advanced', label: 'Advanced', icon: Sliders },
          { id: 'batch', label: 'Batch Processing', icon: Layers },
          { id: 'clone', label: 'Voice Clone', icon: Copy }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-primary-green text-white'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main TTS Interface */}
      <motion.div
        className="glass-strong p-6 rounded-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Input */}
          <div className="space-y-4">
            <div>
              <label className="text-white/80 text-sm mb-2 block">
                Text Input ({text.length} characters = {calculateTokens()} tokens)
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter the text you want to convert to speech..."
                className="input-glass w-full h-40 resize-none"
                maxLength={5000}
              />
              <p className="text-xs text-white/60 mt-1">
                Maximum 5000 characters. Cost: 1 token per 100 characters.
              </p>
            </div>

            {/* Voice Settings */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-white/80 text-sm mb-2 block">Voice</label>
                <select 
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="input-glass w-full"
                >
                  {voices.map((voice) => (
                    <option key={voice.id} value={voice.id}>
                      {voice.name} ({voice.gender}, {voice.accent})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-white/80 text-sm mb-2 block">Speed</label>
                <select 
                  value={speed}
                  onChange={(e) => setSpeed(parseFloat(e.target.value))}
                  className="input-glass w-full"
                >
                  <option value={0.75}>0.75x (Slow)</option>
                  <option value={1.0}>1.0x (Normal)</option>
                  <option value={1.25}>1.25x (Fast)</option>
                  <option value={1.5}>1.5x (Very Fast)</option>
                </select>
              </div>
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !text.trim() || balance < calculateTokens()}
              className="w-full btn-primary"
            >
              {isGenerating ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Generating Speech...
                </>
              ) : (
                <>
                  <Mic className="mr-2 h-4 w-4" />
                  Generate Speech ({calculateTokens()} tokens)
                </>
              )}
            </Button>
          </div>

          {/* Right Column - Preview & Controls */}
          <div className="space-y-4">
            {/* Audio Player */}
            <div className="glass p-6 rounded-xl text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Volume2 className="h-8 w-8 text-white" />
              </div>
              
              {generatedAudio ? (
                <>
                  <p className="text-white mb-4">Audio ready</p>
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <Button
                      onClick={handlePlay}
                      variant="outline"
                      className="glass text-white border-white/20 hover:bg-white/10"
                    >
                      {isPlaying ? (
                        <Pause className="h-4 w-4 mr-2" />
                      ) : (
                        <Play className="h-4 w-4 mr-2" />
                      )}
                      {isPlaying ? 'Pause' : 'Play'}
                    </Button>
                    <Button
                      onClick={handleDownload}
                      variant="outline"
                      className="glass text-white border-white/20 hover:bg-white/10"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </>
              ) : (
                <p className="text-white/60">Generate speech to preview</p>
              )}
            </div>

            {/* Quick Presets */}
            <div>
              <label className="text-white/80 text-sm mb-2 block">Quick Presets</label>
              <div className="space-y-2">
                {presets.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => loadPreset(preset.text)}
                    className="w-full glass p-3 rounded-lg text-left transition-all hover:bg-white/10"
                  >
                    <p className="text-white font-medium text-sm">{preset.name}</p>
                    <p className="text-white/60 text-xs">{preset.text.substring(0, 60)}...</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Audio History */}
      <motion.div
        className="glass-strong p-6 rounded-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold text-white mb-4">Recent Generations</h2>
        
        <div className="space-y-3">
          {audioHistory.map((item) => (
            <div key={item.id} className="glass p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary-green/20 rounded-full flex items-center justify-center">
                    <FileAudio className="h-5 w-5 text-primary-green" />
                  </div>
                  
                  <div>
                    <p className="text-white font-medium">{item.text.substring(0, 50)}...</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-white/60 text-sm">Voice: {item.voice}</span>
                      <span className="text-white/60 text-sm">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {item.duration}
                      </span>
                      <Badge className="bg-primary-yellow/20 text-primary-yellow border-primary-yellow/30">
                        <Zap className="mr-1 h-2 w-2" />
                        {item.tokens}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="glass text-white border-white/20 hover:bg-white/10"
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Play
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="glass text-white border-white/20 hover:bg-white/10"
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="grid md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="glass-strong p-6 rounded-xl text-center">
          <Mic className="h-8 w-8 text-primary-green mx-auto mb-3" />
          <p className="text-2xl font-bold text-white">47</p>
          <p className="text-white/60">Audio Files</p>
        </div>
        
        <div className="glass-strong p-6 rounded-xl text-center">
          <Clock className="h-8 w-8 text-primary-yellow mx-auto mb-3" />
          <p className="text-2xl font-bold text-white">12:34</p>
          <p className="text-white/60">Total Duration</p>
        </div>
        
        <div className="glass-strong p-6 rounded-xl text-center">
          <Zap className="h-8 w-8 text-primary-blue mx-auto mb-3" />
          <p className="text-2xl font-bold text-white">89</p>
          <p className="text-white/60">Tokens Used</p>
        </div>
      </motion.div>
    </div>
  )
}