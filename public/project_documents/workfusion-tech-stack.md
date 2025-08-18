# 🛠 Stack Tecnológica Completa - Workfusion.pro

## 🎨 Design System e Componentização

### Estrutura de Componentes
```
src/
├── components/
│   ├── ui/                    # Shadcn/UI base components
│   ├── animations/            # Framer Motion animations
│   │   ├── FadeIn.tsx
│   │   ├── SlideIn.tsx
│   │   ├── ParallaxSection.tsx
│   │   ├── FloatingElements.tsx
│   │   └── GradientOrb.tsx
│   ├── playground/            # AI Playground components
│   │   ├── ChatInterface.tsx
│   │   ├── TokenCounter.tsx
│   │   ├── ToolSelector.tsx
│   │   ├── WhatsAppQR.tsx
│   │   └── AudioPlayer.tsx
│   ├── dashboard/             # Dashboard components
│   │   ├── StatsCard.tsx
│   │   ├── UsageChart.tsx
│   │   ├── TokenBalance.tsx
│   │   └── ActivityFeed.tsx
│   └── layout/               # Layout components
│       ├── Header.tsx
│       ├── Footer.tsx
│       ├── Sidebar.tsx
│       └── MobileNav.tsx
```

### Animações e Interações
```typescript
// Configurações do Framer Motion
export const animations = {
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  },
  stagger: {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  },
  float: {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }
};
```

## 🚀 Frontend Stack Detalhado

### Core Dependencies
```json
{
  "dependencies": {
    // Framework
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "typescript": "^5.4.0",
    
    // UI & Styling
    "tailwindcss": "^3.4.0",
    "@radix-ui/react-*": "latest",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0",
    
    // Animations
    "framer-motion": "^11.0.0",
    "lottie-react": "^2.4.0",
    "@react-spring/web": "^9.7.0",
    
    // State Management
    "zustand": "^4.5.0",
    "@tanstack/react-query": "^5.28.0",
    
    // Forms & Validation
    "react-hook-form": "^7.50.0",
    "@hookform/resolvers": "^3.3.0",
    "zod": "^3.22.0",
    
    // Internationalization
    "next-i18next": "^15.2.0",
    "i18next": "^23.10.0",
    
    // Database & Auth
    "@supabase/supabase-js": "^2.42.0",
    "@supabase/auth-helpers-nextjs": "^0.10.0",
    
    // AI & APIs
    "openai": "^4.38.0",
    "@anthropic-ai/sdk": "^0.20.0",
    "@google/generative-ai": "^0.7.0",
    
    // Utilities
    "axios": "^1.6.0",
    "date-fns": "^3.6.0",
    "qrcode": "^1.5.3",
    "react-markdown": "^9.0.0",
    "recharts": "^2.12.0",
    
    // Payments
    "stripe": "^14.21.0",
    "@stripe/stripe-js": "^3.0.0",
    
    // Real-time
    "socket.io-client": "^4.7.0",
    "pusher-js": "^8.4.0",
    
    // Media
    "wavesurfer.js": "^7.7.0",
    "react-webcam": "^7.2.0"
  },
  "devDependencies": {
    "@types/node": "^20.11.0",
    "@types/react": "^18.2.0",
    "eslint": "^8.57.0",
    "prettier": "^3.2.0",
    "husky": "^9.0.0",
    "lint-staged": "^15.2.0"
  }
}
```

### Configuração do Tailwind com Animações Customizadas
```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          green: '#4ADE80',
          yellow: '#FCD34D',
          orange: '#FB923C',
        },
        dark: {
          bg: '#0A0A0A',
          surface: '#1A1A1A',
          border: '#2A2A2A',
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #4ADE80 0%, #FCD34D 50%, #FB923C 100%)',
        'gradient-radial': 'radial-gradient(circle at center, var(--tw-gradient-stops))',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'gradient-shift': 'gradient 8s ease infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'spin-slow': 'spin 10s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(74, 222, 128, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(74, 222, 128, 0.8)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('tailwindcss-animate'),
  ]
};
```

## 🗄 Backend & Database Architecture

### Supabase Schema
```sql
-- Users table (extends Supabase Auth)
CREATE TABLE users_profile (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE,
  full_name TEXT,
  company TEXT,
  phone TEXT,
  tokens_balance INTEGER DEFAULT 500,
  total_tokens_used INTEGER DEFAULT 0,
  subscription_tier TEXT DEFAULT 'free',
  subscription_expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Token transactions
CREATE TABLE token_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users_profile(id),
  type TEXT CHECK (type IN ('credit', 'debit', 'bonus')),
  amount INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  description TEXT,
  tool_used TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- AI Conversations
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users_profile(id),
  assistant_type TEXT NOT NULL,
  messages JSONB NOT NULL DEFAULT '[]',
  tokens_used INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tool Usage Analytics
CREATE TABLE tool_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users_profile(id),
  tool_name TEXT NOT NULL,
  tokens_consumed INTEGER NOT NULL,
  input_data JSONB,
  output_data JSONB,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Webhooks Configuration
CREATE TABLE webhook_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT UNIQUE NOT NULL,
  webhook_url TEXT NOT NULL,
  headers JSONB,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Blog Posts (from N8N)
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  category TEXT,
  tags TEXT[],
  author TEXT,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Payment History
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users_profile(id),
  payment_provider TEXT CHECK (payment_provider IN ('asaas', 'stripe')),
  payment_id TEXT UNIQUE,
  amount DECIMAL(10,2),
  currency TEXT DEFAULT 'BRL',
  tokens_purchased INTEGER,
  status TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE users_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Policies implementation
CREATE POLICY "Users can view own profile" ON users_profile
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users_profile
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own transactions" ON token_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own conversations" ON conversations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own conversations" ON conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### Edge Functions (Supabase Functions)
```typescript
// supabase/functions/process-ai-request/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { tool, input, userId } = await req.json()
    
    // Initialize clients
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    
    // Check user tokens
    const { data: profile } = await supabase
      .from('users_profile')
      .select('tokens_balance')
      .eq('id', userId)
      .single()
    
    const toolCosts = {
      chat: 20,
      whatsapp_text: 50,
      whatsapp_audio: 100,
      tts: 0.05
    }
    
    const cost = toolCosts[tool]
    if (profile.tokens_balance < cost) {
      throw new Error('Insufficient tokens')
    }
    
    // Process request based on tool
    let result
    switch(tool) {
      case 'chat':
        result = await processChat(input)
        break
      case 'whatsapp_text':
        result = await sendWhatsAppText(input)
        break
      case 'tts':
        result = await textToSpeech(input)
        break
    }
    
    // Deduct tokens
    await supabase.rpc('deduct_tokens', {
      user_id: userId,
      amount: cost,
      tool: tool
    })
    
    return new Response(
      JSON.stringify({ success: true, result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
```

## 🔌 API Integrations

### OpenAI Integration
```typescript
// lib/ai/openai.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function chatWithAssistant(
  assistant: 'hormozi' | 'peterson' | 'daedalus' | 'sensei',
  message: string
) {
  const systemPrompts = {
    hormozi: `You are Alex Hormozi, a successful entrepreneur and business strategist. 
              Speak with confidence about business growth, offers, and value creation.
              Use direct, no-nonsense language and focus on actionable advice.`,
    peterson: `You are Jordan Peterson, a clinical psychologist and professor.
               Provide thoughtful, philosophical insights about personal development.
               Use precise language and reference psychological concepts when relevant.`,
    daedalus: `You are Daedalus, an expert civil engineer with 30 years of experience.
               Provide technical advice about construction, materials, and engineering.
               Be precise with measurements and safety standards.`,
    sensei: `You are Sensei Suki Harada, a time management and productivity expert.
             Blend Eastern philosophy with modern productivity techniques.
             Provide practical tips for better time management and focus.`
  };

  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      { role: "system", content: systemPrompts[assistant] },
      { role: "user", content: message }
    ],
    temperature: 0.7,
    max_tokens: 500
  });

  return response.choices[0].message.content;
}
```

### WhatsApp Integration
```typescript
// lib/whatsapp/client.ts
export class WhatsAppClient {
  private webhookUrl: string;
  
  constructor() {
    this.webhookUrl = process.env.WHATSAPP_WEBHOOK_URL || '';
  }
  
  async sendTextMessage(phone: string, message: string, countryCode: string) {
    const fullNumber = `${countryCode}${phone.replace(/\D/g, '')}`;
    
    const response = await fetch(this.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: fullNumber,
        message: message,
        type: 'text'
      })
    });
    
    return response.json();
  }
  
  async sendAudioMessage(phone: string, audioUrl: string, countryCode: string) {
    const fullNumber = `${countryCode}${phone.replace(/\D/g, '')}`;
    
    const response = await fetch(this.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: fullNumber,
        audioUrl: audioUrl,
        type: 'audio'
      })
    });
    
    return response.json();
  }
  
  generateQRCode() {
    // Generate QR for WhatsApp Web connection
    return {
      qrData: 'whatsapp://...',
      sessionId: generateSessionId()
    };
  }
}
```

### Text-to-Speech Integration
```typescript
// lib/tts/service.ts
import { TextToSpeechClient } from '@google-cloud/text-to-speech';

const client = new TextToSpeechClient({
  keyFilename: 'path/to/service-account.json'
});

export async function generateSpeech(text: string, voice: string = 'pt-BR') {
  // Calculate cost
  const charCount = text.length;
  const baseCost = charCount * 0.00003; // $30 per 1M chars
  const finalCost = baseCost * 1.8; // 80% margin
  const tokenCost = Math.ceil(finalCost / 0.001); // Convert to tokens
  
  const request = {
    input: { text },
    voice: {
      languageCode: voice,
      name: voice === 'pt-BR' ? 'pt-BR-Wavenet-A' : 'en-US-Wavenet-D',
      ssmlGender: 'NEUTRAL'
    },
    audioConfig: {
      audioEncoding: 'MP3',
      speakingRate: 1.0,
      pitch: 0.0
    }
  };
  
  const [response] = await client.synthesizeSpeech(request);
  return {
    audioContent: response.audioContent,
    tokenCost: tokenCost
  };
}
```

## 🔐 Authentication & Security

### Supabase Auth Configuration
```typescript
// lib/auth/supabase-auth.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const supabase = createClientComponentClient();

export const authConfig = {
  providers: ['email', 'google', 'linkedin'],
  