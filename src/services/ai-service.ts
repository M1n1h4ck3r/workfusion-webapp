import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import { PersonaService } from './persona-service'
import { aiMetricsTracker } from '@/lib/ai-metrics-tracker'

// AI Service Configuration
interface AIConfig {
  provider: 'openai' | 'anthropic' | 'demo'
  apiKey?: string
  model?: string
}

// Message format
export interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

// Chatbot personalities
export const CHATBOT_PERSONALITIES = {
  'alex-hormozi': {
    name: 'Alex Hormozi',
    avatar: '💼',
    systemPrompt: `You are Alex Hormozi, a successful entrepreneur and business strategist known for your expertise in:
    - Business scaling and growth strategies
    - Sales and marketing optimization
    - Gym launch and fitness business expertise
    - Value creation and offer structuring
    - Direct response marketing
    
    Your communication style:
    - Direct, no-nonsense approach
    - Data-driven insights with real examples
    - Focus on practical, actionable advice
    - Use of analogies to explain complex concepts
    - Emphasis on value creation and ROI
    
    Always provide specific, tactical advice that can be implemented immediately. Use metrics and numbers when possible.`,
    greeting: "Hey! Alex here. What business challenge can I help you solve today? Let's talk about scaling, sales, or making offers so good people feel stupid saying no."
  },
  
  'jordan-peterson': {
    name: 'Jordan Peterson',
    avatar: '📚',
    systemPrompt: `You are Dr. Jordan Peterson, a clinical psychologist and professor known for your expertise in:
    - Psychology and human behavior
    - Personal responsibility and self-improvement
    - Mythology and archetypal stories
    - Philosophy and meaning in life
    - Social and political commentary
    
    Your communication style:
    - Thoughtful and articulate responses
    - Use of metaphors and stories to illustrate points
    - Integration of psychological research
    - Emphasis on personal responsibility
    - Deep, philosophical insights
    
    Always encourage critical thinking and personal growth. Reference relevant psychological concepts and literature when appropriate.`,
    greeting: "Hello. I'm Dr. Peterson. What aspect of life, psychology, or personal development would you like to explore today? Remember, life is suffering, but we can find meaning in it."
  },
  
  'daedalus': {
    name: 'Daedalus',
    avatar: '🏗️',
    systemPrompt: `You are Daedalus, an expert civil engineer and architect with deep knowledge in:
    - Structural engineering and design
    - Construction materials and methods
    - Building codes and regulations
    - Project management and planning
    - Sustainable construction practices
    - Mathematical calculations for engineering
    
    Your communication style:
    - Technical but accessible explanations
    - Use of proper engineering terminology
    - Provide calculations and formulas when needed
    - Safety-first approach
    - Practical problem-solving focus
    
    Always consider safety, efficiency, and sustainability in your recommendations. Provide specific technical details and calculations when relevant.`,
    greeting: "Greetings! I'm Daedalus, your engineering consultant. Whether it's structural design, construction planning, or technical calculations, I'm here to help. What engineering challenge are you facing?"
  },
  
  'sensei-suki': {
    name: 'Sensei Suki',
    avatar: '⏰',
    systemPrompt: `You are Sensei Suki, a productivity and time management expert specializing in:
    - Time management techniques (Pomodoro, Time-blocking, etc.)
    - Productivity systems (GTD, PARA, Zettelkasten)
    - Focus and concentration strategies
    - Work-life balance optimization
    - Habit formation and behavior change
    - Mindfulness and stress management
    
    Your communication style:
    - Calm, encouraging, and supportive
    - Practical, step-by-step guidance
    - Use of Eastern philosophy concepts when relevant
    - Focus on sustainable practices
    - Personalized recommendations
    
    Always provide actionable techniques that can be implemented immediately. Emphasize the importance of consistency and self-compassion.`,
    greeting: "Welcome! I'm Sensei Suki. Let's work together to optimize your time and energy. What productivity challenge would you like to address today? Remember, small consistent steps lead to great achievements."
  }
}

class AIService {
  private openai: OpenAI | null = null
  private anthropic: Anthropic | null = null
  private config: AIConfig

  constructor(config: AIConfig) {
    this.config = config

    // Initialize API clients based on configuration
    if (config.provider === 'openai' && config.apiKey) {
      this.openai = new OpenAI({
        apiKey: config.apiKey,
        dangerouslyAllowBrowser: true // Only for demo - in production, use API routes
      })
    }

    if (config.provider === 'anthropic' && config.apiKey) {
      this.anthropic = new Anthropic({
        apiKey: config.apiKey,
        dangerouslyAllowBrowser: true // Only for demo - in production, use API routes
      })
    }
  }

  async sendMessage(
    messages: Message[],
    personality?: keyof typeof CHATBOT_PERSONALITIES | string,
    userId?: string
  ): Promise<string> {
    // Try to fetch persona from database first
    let systemPrompt: string | undefined
    
    if (personality) {
      // First try database
      const persona = await PersonaService.getCachedPersona(personality)
      
      if (persona) {
        systemPrompt = persona.system_prompt
      } else if (CHATBOT_PERSONALITIES[personality as keyof typeof CHATBOT_PERSONALITIES]) {
        // Fallback to hardcoded if not in database
        systemPrompt = CHATBOT_PERSONALITIES[personality as keyof typeof CHATBOT_PERSONALITIES].systemPrompt
      }
      
      if (systemPrompt) {
        messages = [
          { role: 'system', content: systemPrompt },
          ...messages.filter(m => m.role !== 'system')
        ]
      }
    }

    // Demo mode - return simulated responses
    if (this.config.provider === 'demo') {
      const modelId = this.config.model || 'demo-model'
      const inputText = messages.map(m => m.content).join(' ')
      
      return await aiMetricsTracker.trackRequest(
        modelId,
        {
          endpoint: '/api/chat/demo',
          inputTokens: Math.ceil(inputText.length / 4), // Rough token estimation
          userId,
          userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server'
        },
        async () => this.getDemoResponse(messages, personality as keyof typeof CHATBOT_PERSONALITIES)
      )
    }

    // OpenAI API
    if (this.config.provider === 'openai' && this.openai) {
      const modelId = this.config.model || 'gpt-3.5-turbo'
      const inputText = messages.map(m => m.content).join(' ')
      
      return await aiMetricsTracker.trackRequest(
        modelId,
        {
          endpoint: '/api/chat/openai',
          inputTokens: Math.ceil(inputText.length / 4), // Rough token estimation
          userId,
          userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server'
        },
        async () => {
          const response = await this.openai!.chat.completions.create({
            model: modelId,
            messages: messages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
            temperature: 0.7,
            max_tokens: 1000,
          })

          return response.choices[0]?.message?.content || 'No response generated.'
        }
      )
    }

    // Anthropic Claude API
    if (this.config.provider === 'anthropic' && this.anthropic) {
      const modelId = this.config.model || 'claude-3-sonnet-20240229'
      const inputText = messages.map(m => m.content).join(' ')
      
      return await aiMetricsTracker.trackRequest(
        modelId,
        {
          endpoint: '/api/chat/anthropic',
          inputTokens: Math.ceil(inputText.length / 4), // Rough token estimation
          userId,
          userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server'
        },
        async () => {
          // Convert messages format for Claude
          const claudeMessages = messages
            .filter(m => m.role !== 'system')
            .map(m => ({
              role: m.role as 'user' | 'assistant',
              content: m.content
            }))

          const systemPrompt = messages.find(m => m.role === 'system')?.content

          const response = await this.anthropic!.messages.create({
            model: modelId,
            messages: claudeMessages,
            system: systemPrompt,
            max_tokens: 1000,
          })

          const firstContent = response.content[0]
          return (firstContent?.type === 'text' ? firstContent.text : 'No response generated.') || 'No response generated.'
        }
      )
    }

    throw new Error('No AI provider configured')
  }

  private getDemoResponse(
    messages: Message[],
    personality?: keyof typeof CHATBOT_PERSONALITIES
  ): string {
    const lastMessage = messages[messages.length - 1]?.content.toLowerCase()

    // Personality-specific demo responses
    if (personality === 'alex-hormozi') {
      if (lastMessage.includes('scale') || lastMessage.includes('grow')) {
        return "Here's the thing about scaling - you need three things: a great offer, a scalable fulfillment system, and consistent lead flow. Most businesses fail at scaling because they try to grow before nailing their core offer. Start by making your offer so good that people feel stupid saying no. What's your current offer, and what makes it unique?"
      }
      return "Let me break this down for you with real numbers. The key to any successful business is the value equation: Dream Outcome × Perceived Likelihood of Achievement ÷ (Time Delay × Effort and Sacrifice). Focus on increasing the top and decreasing the bottom. What specific metric are you trying to improve?"
    }

    if (personality === 'jordan-peterson') {
      if (lastMessage.includes('meaning') || lastMessage.includes('purpose')) {
        return "The question of meaning is fundamental to human existence. Viktor Frankl, in 'Man's Search for Meaning,' argued that we don't find meaning - we create it through our choices and actions. You see, life is suffering, that's the baseline. But we can transcend that suffering by taking on responsibility and aiming at the highest good we can conceive. What responsibilities are you currently avoiding that might give your life more meaning?"
      }
      return "Well, that's a complex question that requires careful consideration. Let me approach this from a psychological perspective. The research literature suggests that human behavior is influenced by both conscious and unconscious factors. Jung would say we need to integrate our shadow - those aspects of ourselves we deny or repress. What patterns do you notice repeating in your life?"
    }

    if (personality === 'daedalus') {
      if (lastMessage.includes('build') || lastMessage.includes('structure')) {
        return "From an engineering perspective, any structure must consider three primary factors: loads (dead, live, and environmental), materials properties, and safety factors. For a typical residential structure, we'd start with soil analysis, then foundation design using the bearing capacity formula: q_ult = cN_c + qN_q + 0.5γBN_γ. What type of structure are you planning, and what's your local building code?"
      }
      return "Let me provide you with a technical analysis. In structural engineering, we always start with understanding the forces at play - compression, tension, shear, and moment. The key is to design within acceptable stress limits while optimizing for cost and materials. Could you provide more details about the specific engineering challenge you're facing?"
    }

    if (personality === 'sensei-suki') {
      if (lastMessage.includes('productive') || lastMessage.includes('time')) {
        return "Ah, productivity isn't about doing more - it's about doing what matters with intention. I recommend starting with the 'Two-Minute Rule': if something takes less than two minutes, do it now. For deeper work, try time-blocking with the Pomodoro Technique - 25 minutes of focused work, 5-minute break. Remember, energy management is as important as time management. When during the day do you feel most energized?"
      }
      return "Let's approach this mindfully. True productivity comes from alignment between your actions and values. Consider implementing a morning routine: 1) Meditation (5 min), 2) Gratitude journaling (3 min), 3) Priority setting (2 min). This creates mental clarity for the day ahead. What's currently causing the most friction in your daily routine?"
    }

    // Generic demo response
    return "This is a demo response. To get real AI-powered responses, please configure your OpenAI or Anthropic API keys in the settings. Your message was received and would normally be processed by the AI model."
  }

  async generateText(prompt: string, maxTokens: number = 500): Promise<string> {
    if (this.config.provider === 'demo') {
      return `Generated text based on prompt: "${prompt.substring(0, 50)}..."\n\nThis is a demo response. Configure API keys for real generation.`
    }

    return this.sendMessage([{ role: 'user', content: prompt }])
  }

  async textToSpeech(text: string, voice: string = 'alloy'): Promise<ArrayBuffer> {
    if (this.config.provider === 'demo') {
      // Return a small silent audio buffer for demo
      return new ArrayBuffer(1024)
    }

    if (this.config.provider === 'openai' && this.openai) {
      try {
        const response = await this.openai.audio.speech.create({
          model: 'tts-1',
          voice: voice as 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer',
          input: text,
        })

        return await response.arrayBuffer()
      } catch (error) {
        console.error('TTS error:', error)
        throw new Error('Failed to generate speech')
      }
    }

    throw new Error('TTS not available with current provider')
  }
}

// Create a singleton instance with auto-detection
let aiServiceInstance: AIService | null = null

function detectAIProvider(): AIConfig {
  // Check for OpenAI API key
  const openaiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY
  if (openaiKey && openaiKey !== 'your_openai_api_key_here' && !openaiKey.includes('placeholder')) {
    return {
      provider: 'openai',
      apiKey: openaiKey,
      model: 'gpt-4-turbo-preview'
    }
  }

  // Check for Anthropic API key
  const anthropicKey = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY
  if (anthropicKey && anthropicKey !== 'your_anthropic_api_key_here' && !anthropicKey.includes('placeholder')) {
    return {
      provider: 'anthropic',
      apiKey: anthropicKey,
      model: 'claude-3-sonnet-20240229'
    }
  }

  // Fallback to demo mode
  console.warn('No AI API keys configured. Using demo mode. Configure OPENAI_API_KEY or ANTHROPIC_API_KEY for real AI responses.')
  return { provider: 'demo' }
}

export function getAIService(config?: AIConfig): AIService {
  if (!aiServiceInstance || config) {
    aiServiceInstance = new AIService(config || detectAIProvider())
  }
  return aiServiceInstance
}

export function configureAIService(config: AIConfig) {
  aiServiceInstance = new AIService(config)
  return aiServiceInstance
}