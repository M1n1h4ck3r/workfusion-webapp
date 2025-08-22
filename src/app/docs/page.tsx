'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Book, 
  Code, 
  Terminal, 
  Globe, 
  Key, 
  Zap, 
  MessageSquare,
  Mic,
  Phone,
  Search,
  ExternalLink,
  Copy,
  CheckCircle,
  ArrowRight,
  Download,
  Github,
  Play,
  FileText,
  Shield,
  Clock,
  Webhook,
  Database,
  Settings,
  Users,
  BarChart3
} from 'lucide-react'
import { toast } from 'sonner'

interface DocumentationSection {
  id: string
  title: string
  description: string
  icon: any
  subsections: {
    id: string
    title: string
    description: string
    content?: string
    codeExample?: string
  }[]
}

export default function DocumentationPage() {
  const [activeSection, setActiveSection] = useState('getting-started')
  const [activeSubsection, setActiveSubsection] = useState('introduction')
  const [searchQuery, setSearchQuery] = useState('')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const documentation: DocumentationSection[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      description: 'Quick start guide and basic concepts',
      icon: Play,
      subsections: [
        {
          id: 'introduction',
          title: 'Introduction',
          description: 'Welcome to WorkFusion API',
          content: `# WorkFusion API Documentation

Welcome to the WorkFusion API! This powerful API allows you to integrate AI-powered features into your applications, including chat completions, text-to-speech, WhatsApp automation, and more.

## What can you build?

- **AI Chatbots**: Create intelligent conversational experiences
- **Voice Applications**: Convert text to natural speech
- **WhatsApp Automation**: Automate messaging at scale
- **Analytics Dashboards**: Track and analyze API usage
- **Multi-modal AI**: Combine text, voice, and messaging capabilities

## Base URL

All API requests should be made to:
\`\`\`
https://api.workfusion.pro/v1
\`\`\`

## Rate Limits

Our API implements rate limiting to ensure fair usage:
- Chat API: 100 requests/minute
- TTS API: 50 requests/minute  
- WhatsApp API: 30 requests/minute
- Analytics API: 200 requests/minute

## SDKs and Libraries

We provide official SDKs for popular programming languages:
- JavaScript/Node.js
- Python
- PHP
- Go
- Ruby`,
          codeExample: `// Example: Initialize WorkFusion API client
const WorkFusion = require('@workfusion/api');

const client = new WorkFusion({
  apiKey: 'your_api_key_here',
  baseURL: 'https://api.workfusion.pro/v1'
});`
        },
        {
          id: 'authentication',
          title: 'Authentication',
          description: 'API key setup and security',
          content: `# Authentication

The WorkFusion API uses API keys to authenticate requests. Your API keys carry many privileges, so be sure to keep them secure!

## Getting Your API Key

1. Log in to your WorkFusion dashboard
2. Navigate to the API section
3. Click "Generate New Key"
4. Select the appropriate permissions
5. Copy and securely store your key

## Making Authenticated Requests

Include your API key in the Authorization header of every request:

\`\`\`
Authorization: Bearer YOUR_API_KEY
\`\`\`

## API Key Scopes

When creating an API key, you can specify which endpoints it can access:

- **chat**: Access to chat completion endpoints
- **tts**: Text-to-speech generation
- **whatsapp**: WhatsApp messaging
- **analytics**: Usage analytics and monitoring
- **webhooks**: Webhook management
- **billing**: Billing and usage information

## Best Practices

- Store API keys as environment variables
- Use different keys for development and production
- Regularly rotate your API keys
- Monitor API key usage in the dashboard
- Revoke unused or compromised keys immediately`,
          codeExample: `// ✅ Good: Store in environment variables
const apiKey = process.env.WORKFUSION_API_KEY;

// ✅ Good: Include in Authorization header
const response = await fetch('https://api.workfusion.pro/v1/chat/completions', {
  headers: {
    'Authorization': \`Bearer \${apiKey}\`,
    'Content-Type': 'application/json'
  },
  method: 'POST',
  body: JSON.stringify({
    messages: [{ role: 'user', content: 'Hello!' }],
    model: 'gpt-4'
  })
});

// ❌ Bad: Hardcode API keys
// const apiKey = 'wf_sk_abc123...'; // Don't do this!`
        },
        {
          id: 'quick-start',
          title: 'Quick Start',
          description: 'Your first API call in 5 minutes',
          content: `# Quick Start Guide

Get up and running with the WorkFusion API in just 5 minutes!

## Step 1: Get Your API Key

1. Sign up for a WorkFusion account at [workfusion.pro](https://workfusion.pro)
2. Navigate to Dashboard → API
3. Create a new API key with \`chat\` permissions

## Step 2: Make Your First Request

Here's how to make your first API call to create a chat completion:

### Using cURL
\`\`\`bash
curl -X POST https://api.workfusion.pro/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "messages": [
      {"role": "user", "content": "Hello, World!"}
    ],
    "model": "gpt-4"
  }'
\`\`\`

### Using JavaScript
\`\`\`javascript
const response = await fetch('https://api.workfusion.pro/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    messages: [{ role: 'user', content: 'Hello, World!' }],
    model: 'gpt-4'
  })
});

const data = await response.json();
console.log(data.choices[0].message.content);
\`\`\`

### Using Python
\`\`\`python
import requests

response = requests.post(
    'https://api.workfusion.pro/v1/chat/completions',
    headers={
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
    },
    json={
        'messages': [{'role': 'user', 'content': 'Hello, World!'}],
        'model': 'gpt-4'
    }
)

data = response.json()
print(data['choices'][0]['message']['content'])
\`\`\`

## Step 3: Handle the Response

A successful response will look like this:

\`\`\`json
{
  "id": "chatcmpl-abc123",
  "object": "chat.completion",
  "created": 1677652288,
  "model": "gpt-4",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hello! How can I help you today?"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 9,
    "completion_tokens": 12,
    "total_tokens": 21
  }
}
\`\`\`

## What's Next?

- Explore the [Chat API](#chat-api) for advanced features
- Try the [Text-to-Speech API](#tts-api) to add voice to your app
- Set up [Webhooks](#webhooks) for real-time notifications
- Check out our [SDKs](#sdks) for your preferred language`,
          codeExample: `// Complete working example
const WorkFusion = require('@workfusion/api');

const client = new WorkFusion({
  apiKey: process.env.WORKFUSION_API_KEY
});

async function chatExample() {
  try {
    const completion = await client.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Explain quantum computing in simple terms.' }
      ],
      model: 'gpt-4',
      max_tokens: 150,
      temperature: 0.7
    });

    console.log(completion.choices[0].message.content);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

chatExample();`
        }
      ]
    },
    {
      id: 'chat-api',
      title: 'Chat API',
      description: 'AI-powered chat completions and conversations',
      icon: MessageSquare,
      subsections: [
        {
          id: 'chat-overview',
          title: 'Overview',
          description: 'Chat API fundamentals',
          content: `# Chat API

The Chat API allows you to create AI-powered conversational experiences. You can build chatbots, virtual assistants, content generators, and more.

## Features

- **Multiple AI Models**: GPT-4, GPT-3.5, Claude, and more
- **Custom Personalities**: Use pre-built personas or create your own
- **Streaming Responses**: Real-time message streaming
- **Function Calling**: Enable AI to call external functions
- **Message History**: Maintain conversation context
- **Fine-tuning**: Train models on your specific data

## Supported Models

| Model | Description | Context Length | Best For |
|-------|------------|----------------|----------|
| gpt-4 | Most capable model | 8,192 tokens | Complex reasoning, creative tasks |
| gpt-3.5-turbo | Fast and efficient | 4,096 tokens | General chat, quick responses |
| claude-2 | Constitutional AI | 100,000 tokens | Long-form content, analysis |
| custom-model | Your fine-tuned model | Varies | Domain-specific tasks |

## Rate Limits

- **Free Tier**: 100 requests/hour
- **Pro Tier**: 1,000 requests/hour  
- **Enterprise**: Custom limits

## Pricing

- GPT-4: $0.03 per 1K tokens
- GPT-3.5: $0.002 per 1K tokens
- Claude-2: $0.01 per 1K tokens`,
          codeExample: `// Basic chat completion
const completion = await client.chat.completions.create({
  model: 'gpt-4',
  messages: [
    {
      role: 'system',
      content: 'You are a helpful assistant specialized in explaining complex topics simply.'
    },
    {
      role: 'user', 
      content: 'What is machine learning?'
    }
  ],
  max_tokens: 150,
  temperature: 0.7
});

console.log(completion.choices[0].message.content);`
        },
        {
          id: 'chat-streaming',
          title: 'Streaming',
          description: 'Real-time streaming responses',
          content: `# Streaming Chat Completions

For a better user experience, you can stream chat completions as they're generated. This allows you to display partial results in real-time.

## How Streaming Works

1. Set \`stream: true\` in your request
2. The API returns Server-Sent Events (SSE)
3. Each event contains a partial response
4. The stream ends with a \`[DONE]\` message

## Benefits

- **Better UX**: Users see responses as they're generated
- **Lower Latency**: Start displaying content immediately
- **Perceived Performance**: Apps feel more responsive
- **Reduced Waiting**: Users don't wait for complete responses

## Handling Stream Events

Each streaming event contains:

- \`id\`: Unique identifier for the completion
- \`object\`: Always "chat.completion.chunk"
- \`created\`: Unix timestamp
- \`model\`: The model used
- \`choices\`: Array of choice objects with delta content

## Error Handling

- Connection errors: Retry with exponential backoff
- Rate limit errors: Respect rate limit headers
- Invalid requests: Check request format and parameters`,
          codeExample: `// Streaming chat completion
const stream = await client.chat.completions.create({
  model: 'gpt-4',
  messages: [
    { role: 'user', content: 'Write a short story about a robot.' }
  ],
  stream: true
});

for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content || '';
  process.stdout.write(content);
}

// With fetch API
const response = await fetch('https://api.workfusion.pro/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'gpt-4',
    messages: [{ role: 'user', content: 'Hello!' }],
    stream: true
  })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value);
  const lines = chunk.split('\\n');
  
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const data = line.slice(6);
      if (data === '[DONE]') return;
      
      try {
        const parsed = JSON.parse(data);
        const content = parsed.choices[0]?.delta?.content || '';
        console.log(content);
      } catch (e) {
        // Skip malformed JSON
      }
    }
  }
}`
        },
        {
          id: 'chat-functions',
          title: 'Function Calling',
          description: 'Enable AI to call external functions',
          content: `# Function Calling

Function calling allows the AI model to call external functions and APIs. This enables building powerful AI agents that can interact with external systems.

## Use Cases

- **API Integration**: Call external APIs for real-time data
- **Database Queries**: Search and retrieve information
- **Calculations**: Perform complex mathematical operations
- **Tool Usage**: Use calculators, converters, etc.
- **Workflow Automation**: Trigger external processes

## How It Works

1. Define functions in your request
2. AI determines when to call functions
3. AI generates function call with parameters
4. Your code executes the function
5. Return results to continue conversation

## Function Schema

Functions must be defined with a JSON schema:

\`\`\`json
{
  "name": "get_weather",
  "description": "Get current weather for a location",
  "parameters": {
    "type": "object",
    "properties": {
      "location": {
        "type": "string",
        "description": "City name or coordinates"
      },
      "units": {
        "type": "string",
        "enum": ["celsius", "fahrenheit"],
        "description": "Temperature units"
      }
    },
    "required": ["location"]
  }
}
\`\`\`

## Best Practices

- Provide clear function descriptions
- Use descriptive parameter names
- Handle function errors gracefully
- Validate function parameters
- Return structured data when possible`,
          codeExample: `// Function calling example
const completion = await client.chat.completions.create({
  model: 'gpt-4',
  messages: [
    { role: 'user', content: 'What\\'s the weather in London?' }
  ],
  functions: [
    {
      name: 'get_weather',
      description: 'Get current weather for a location',
      parameters: {
        type: 'object',
        properties: {
          location: {
            type: 'string',
            description: 'City name or coordinates'
          },
          units: {
            type: 'string',
            enum: ['celsius', 'fahrenheit'],
            description: 'Temperature units'
          }
        },
        required: ['location']
      }
    }
  ],
  function_call: 'auto'
});

const message = completion.choices[0].message;

if (message.function_call) {
  const functionName = message.function_call.name;
  const functionArgs = JSON.parse(message.function_call.arguments);
  
  // Execute the function
  let functionResult;
  if (functionName === 'get_weather') {
    functionResult = await getWeather(functionArgs.location, functionArgs.units);
  }
  
  // Continue conversation with function result
  const followUp = await client.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'user', content: 'What\\'s the weather in London?' },
      message,
      {
        role: 'function',
        name: functionName,
        content: JSON.stringify(functionResult)
      }
    ]
  });
  
  console.log(followUp.choices[0].message.content);
}

// Weather function implementation
async function getWeather(location, units = 'celsius') {
  const apiKey = process.env.WEATHER_API_KEY;
  const response = await fetch(
    \`https://api.openweathermap.org/data/2.5/weather?q=\${location}&appid=\${apiKey}&units=\${units === 'celsius' ? 'metric' : 'imperial'}\`
  );
  const data = await response.json();
  
  return {
    location: data.name,
    temperature: data.main.temp,
    description: data.weather[0].description,
    units: units
  };
}`
        }
      ]
    },
    {
      id: 'tts-api',
      title: 'Text-to-Speech',
      description: 'Convert text to natural speech',
      icon: Mic,
      subsections: [
        {
          id: 'tts-overview',
          title: 'Overview',
          description: 'TTS API fundamentals',
          content: `# Text-to-Speech API

The Text-to-Speech (TTS) API converts written text into natural-sounding speech. Perfect for voice assistants, accessibility features, and audio content creation.

## Features

- **Multiple Voices**: Choose from 50+ natural voices
- **Multiple Languages**: Support for 30+ languages
- **Custom Speed**: Adjust speech rate from 0.25x to 4x
- **SSML Support**: Advanced speech control with SSML
- **Multiple Formats**: MP3, WAV, OGG output formats
- **Voice Cloning**: Create custom voices (Enterprise)

## Voice Options

### English Voices
- **Alloy**: Neutral, versatile voice
- **Echo**: Male, professional tone
- **Fable**: Female, friendly tone
- **Nova**: Female, youthful tone
- **Onyx**: Male, deep tone
- **Shimmer**: Female, soft tone

### Other Languages
- Spanish, French, German, Italian, Portuguese
- Japanese, Korean, Chinese (Mandarin)
- Arabic, Hindi, Russian, and more

## Audio Formats

| Format | Quality | File Size | Use Case |
|--------|---------|-----------|----------|
| MP3 | Good | Small | Web, mobile apps |
| WAV | Excellent | Large | Professional audio |
| OGG | Good | Medium | Cross-platform |

## Rate Limits

- **Free Tier**: 50 requests/hour, 1MB audio/month
- **Pro Tier**: 500 requests/hour, 100MB audio/month
- **Enterprise**: Custom limits

## Pricing

- $0.015 per 1K characters
- $0.030 per 1K characters (premium voices)
- Voice cloning: Custom pricing`,
          codeExample: `// Basic TTS request
const audio = await client.audio.speech.create({
  model: 'tts-1',
  voice: 'alloy',
  input: 'Hello! Welcome to WorkFusion TTS API.'
});

// Save audio to file
const buffer = Buffer.from(await audio.arrayBuffer());
await fs.writeFile('speech.mp3', buffer);

// With custom parameters
const customAudio = await client.audio.speech.create({
  model: 'tts-1-hd', // Higher quality
  voice: 'nova',
  input: 'This is a custom voice example.',
  response_format: 'wav',
  speed: 1.2
});`
        },
        {
          id: 'tts-ssml',
          title: 'SSML Support',
          description: 'Advanced speech control with SSML',
          content: `# SSML (Speech Synthesis Markup Language)

SSML allows fine-grained control over speech synthesis including pronunciation, timing, emphasis, and more.

## Supported SSML Tags

### Basic Tags
- \`<speak>\`: Root element for SSML
- \`<p>\`: Paragraph breaks
- \`<s>\`: Sentence breaks
- \`<break>\`: Pause duration control

### Emphasis and Prosody
- \`<emphasis>\`: Emphasize words or phrases
- \`<prosody>\`: Control rate, pitch, and volume
- \`<phoneme>\`: Specify pronunciation

### Audio Control
- \`<audio>\`: Insert audio files
- \`<mark>\`: Insert markers for timing
- \`<sub>\`: Substitute pronunciation

## Examples

### Basic Emphasis
\`\`\`xml
<speak>
  This is <emphasis level="strong">very important</emphasis> information.
</speak>
\`\`\`

### Speed and Pitch Control
\`\`\`xml
<speak>
  <prosody rate="slow" pitch="low">
    This text is spoken slowly with a low pitch.
  </prosody>
  <break time="1s"/>
  <prosody rate="fast" pitch="high">
    This text is spoken quickly with a high pitch.
  </prosody>
</speak>
\`\`\`

### Pauses and Breaks
\`\`\`xml
<speak>
  First sentence.
  <break time="2s"/>
  Second sentence after a 2-second pause.
  <break strength="weak"/>
  Third sentence after a weak break.
</speak>
\`\`\`

## Best Practices

- Keep SSML simple and readable
- Test pronunciation with different voices
- Use breaks sparingly for natural flow
- Validate SSML before sending requests
- Consider voice-specific optimizations`,
          codeExample: `// SSML example
const ssmlText = \`
<speak>
  <p>Welcome to our <emphasis level="strong">premium</emphasis> service!</p>
  
  <p>
    <prosody rate="medium" pitch="medium">
      Here are today's highlights:
    </prosody>
  </p>
  
  <break time="500ms"/>
  
  <p>
    First: <prosody rate="slow">Our new AI features</prosody>
    <break time="300ms"/>
    Second: <emphasis level="moderate">Improved performance</emphasis>
    <break time="300ms"/> 
    Third: Enhanced security measures
  </p>
  
  <p>
    <prosody rate="fast" volume="loud">
      Don't miss out on these amazing updates!
    </prosody>
  </p>
</speak>
\`;

const audio = await client.audio.speech.create({
  model: 'tts-1-hd',
  voice: 'nova',
  input: ssmlText,
  response_format: 'mp3'
});

// Stream audio directly
const stream = audio.pipe(fs.createWriteStream('announcement.mp3'));`
        }
      ]
    },
    {
      id: 'whatsapp-api',
      title: 'WhatsApp API',
      description: 'Automate WhatsApp messaging at scale',
      icon: Phone,
      subsections: [
        {
          id: 'whatsapp-overview',
          title: 'Overview',
          description: 'WhatsApp API fundamentals',
          content: `# WhatsApp Business API

Integrate WhatsApp messaging into your applications to reach customers where they are. Send notifications, provide support, and automate conversations.

## Features

- **Message Templates**: Pre-approved message formats
- **Rich Media**: Send images, documents, videos
- **Interactive Messages**: Buttons, lists, quick replies
- **Webhook Integration**: Receive message events
- **Delivery Status**: Track message delivery and read status
- **Group Messaging**: Send to WhatsApp groups
- **Business Verification**: Verified business account

## Message Types

### Text Messages
Simple text messages with optional formatting.

### Template Messages
Pre-approved templates for notifications:
- Order confirmations
- Appointment reminders  
- Shipping updates
- Payment notifications

### Interactive Messages
- **Button Messages**: Up to 3 action buttons
- **List Messages**: Structured lists with options
- **Quick Replies**: Predefined response options

### Media Messages
- Images (JPEG, PNG)
- Documents (PDF, DOC, etc.)
- Videos (MP4, 3GP)
- Audio (MP3, OGG)

## Rate Limits

- **Conversations**: 1,000 per 24 hours (default)
- **Template Messages**: 250,000 per month
- **Business Initiated**: Rate increases with quality rating

## Pricing

- **Template Messages**: $0.005 - $0.09 per message
- **User Initiated**: Free for 24 hours after user message
- **Business Initiated**: $0.005 - $0.09 per conversation

## Requirements

- WhatsApp Business Account
- Phone number verification
- Business verification (recommended)
- Approved message templates`,
          codeExample: `// Send a text message
const message = await client.whatsapp.messages.create({
  to: '+1234567890',
  type: 'text',
  text: {
    body: 'Hello! Thank you for your order. We\\'ll keep you updated.'
  }
});

// Send a template message
const templateMessage = await client.whatsapp.messages.create({
  to: '+1234567890',
  type: 'template',
  template: {
    name: 'order_confirmation',
    language: { code: 'en' },
    components: [
      {
        type: 'body',
        parameters: [
          { type: 'text', text: 'John Doe' },
          { type: 'text', text: 'ORD-12345' }
        ]
      }
    ]
  }
});

// Send an image
const imageMessage = await client.whatsapp.messages.create({
  to: '+1234567890',
  type: 'image',
  image: {
    link: 'https://example.com/image.jpg',
    caption: 'Check out our latest product!'
  }
});`
        },
        {
          id: 'whatsapp-webhooks',
          title: 'Webhooks',
          description: 'Receive real-time message events',
          content: `# WhatsApp Webhooks

Webhooks allow you to receive real-time notifications about message events, delivery status, and user interactions.

## Event Types

### Message Events
- **message**: Incoming message from user
- **message_status**: Delivery/read status updates

### Account Events  
- **account_review_update**: Business account review status
- **phone_number_name_update**: Display name changes
- **phone_number_quality_update**: Quality rating changes

### Error Events
- **error**: API errors and failures

## Webhook Security

WhatsApp signs webhook requests with HMAC-SHA256:

1. Concatenate request body with your webhook secret
2. Generate HMAC-SHA256 hash
3. Compare with X-Hub-Signature-256 header

## Message Handling

### Incoming Messages
Handle different message types:
- Text messages
- Media messages (image, video, audio, document)
- Location messages
- Contact messages
- Interactive message responses

### Auto-Reply Setup
Implement automatic responses:
- Welcome messages
- Business hours notifications
- FAQ responses
- Escalation to human agents

## Best Practices

- Respond within 24 hours for free messaging
- Use message templates for proactive outreach
- Implement fallback for failed messages  
- Track conversation quality metrics
- Follow WhatsApp Commerce Policy`,
          codeExample: `// Webhook endpoint (Express.js)
app.post('/webhook/whatsapp', (req, res) => {
  // Verify webhook signature
  const signature = req.headers['x-hub-signature-256'];
  const payload = JSON.stringify(req.body);
  const expectedSignature = 'sha256=' + 
    crypto.createHmac('sha256', process.env.WEBHOOK_SECRET)
          .update(payload)
          .digest('hex');
  
  if (signature !== expectedSignature) {
    return res.status(401).send('Unauthorized');
  }
  
  const { entry } = req.body;
  
  entry.forEach(item => {
    item.changes.forEach(change => {
      if (change.field === 'messages') {
        const messages = change.value.messages || [];
        
        messages.forEach(async message => {
          if (message.type === 'text') {
            // Handle text message
            await handleTextMessage(message);
          } else if (message.type === 'image') {
            // Handle image message
            await handleImageMessage(message);
          }
        });
      }
    });
  });
  
  res.status(200).send('OK');
});

// Handle text messages
async function handleTextMessage(message) {
  const userMessage = message.text.body.toLowerCase();
  
  if (userMessage.includes('help')) {
    await client.whatsapp.messages.create({
      to: message.from,
      type: 'text',
      text: {
        body: 'I can help you with:\\n1. Order status\\n2. Product information\\n3. Support'
      }
    });
  } else if (userMessage.includes('order')) {
    // Handle order inquiry
    await handleOrderInquiry(message);
  }
}

// Auto-reply with business hours
async function checkBusinessHours(message) {
  const now = new Date();
  const hour = now.getHours();
  
  if (hour < 9 || hour > 17) {
    await client.whatsapp.messages.create({
      to: message.from,
      type: 'template',
      template: {
        name: 'business_hours',
        language: { code: 'en' }
      }
    });
  }
}`
        }
      ]
    },
    {
      id: 'webhooks',
      title: 'Webhooks',
      description: 'Real-time event notifications',
      icon: Webhook,
      subsections: [
        {
          id: 'webhook-overview',
          title: 'Overview',
          description: 'Webhook fundamentals',
          content: `# Webhooks

Webhooks provide real-time notifications about events in your WorkFusion account. Instead of polling our API, we'll send HTTP POST requests to your endpoint when events occur.

## Event Types

### User Events
- \`user.created\`: New user registration
- \`user.updated\`: User profile changes
- \`user.deleted\`: User account deletion

### Subscription Events  
- \`subscription.created\`: New subscription
- \`subscription.updated\`: Plan changes
- \`subscription.cancelled\`: Subscription cancellation
- \`subscription.payment_failed\`: Payment failures

### Usage Events
- \`usage.threshold_reached\`: API usage limits
- \`usage.quota_exceeded\`: Monthly quota exceeded
- \`usage.updated\`: Daily usage summaries

### API Events
- \`api.rate_limit_exceeded\`: Rate limit violations
- \`api.key_created\`: New API key generation
- \`api.key_revoked\`: API key revocation

## Webhook Format

All webhook payloads follow this structure:

\`\`\`json
{
  "id": "evt_1234567890",
  "object": "event",
  "type": "user.created",
  "created": 1623456789,
  "data": {
    "object": {
      "id": "user_abc123",
      "email": "user@example.com",
      "created": 1623456789
    }
  },
  "livemode": true,
  "request": {
    "id": "req_abc123",
    "idempotency_key": null
  }
}
\`\`\`

## Security

### Signature Verification
We sign webhook payloads with HMAC-SHA256:

1. Get the signature from the \`X-WorkFusion-Signature\` header
2. Create HMAC using your webhook secret
3. Compare signatures to verify authenticity

### IP Whitelisting
Webhook requests come from these IP ranges:
- 34.74.100.0/24
- 35.186.200.0/24
- 104.196.0.0/16

## Best Practices

- Respond with 2xx status codes quickly
- Implement idempotency using event IDs
- Verify webhook signatures
- Handle retries gracefully
- Log webhook events for debugging`,
          codeExample: `// Webhook endpoint example
const express = require('express');
const crypto = require('crypto');
const app = express();

app.use(express.raw({ type: 'application/json' }));

app.post('/webhook', (req, res) => {
  const signature = req.headers['x-workfusion-signature'];
  const payload = req.body;
  
  // Verify signature
  const expectedSignature = crypto
    .createHmac('sha256', process.env.WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');
  
  const providedSignature = signature.replace('sha256=', '');
  
  if (expectedSignature !== providedSignature) {
    return res.status(401).send('Invalid signature');
  }
  
  const event = JSON.parse(payload);
  
  // Handle different event types
  switch (event.type) {
    case 'user.created':
      handleUserCreated(event.data.object);
      break;
    case 'subscription.updated':
      handleSubscriptionUpdated(event.data.object);
      break;
    case 'usage.threshold_reached':
      handleUsageThreshold(event.data.object);
      break;
    default:
      console.log(\`Unhandled event type: \${event.type}\`);
  }
  
  res.status(200).send('OK');
});

function handleUserCreated(user) {
  console.log(\`New user created: \${user.email}\`);
  
  // Send welcome email
  sendWelcomeEmail(user);
  
  // Add to CRM
  addToCRM(user);
}

function handleSubscriptionUpdated(subscription) {
  console.log(\`Subscription updated: \${subscription.id}\`);
  
  // Update user permissions
  updateUserPermissions(subscription);
  
  // Send notification
  notifyUser(subscription);
}

// Idempotency handling
const processedEvents = new Set();

app.post('/webhook', (req, res) => {
  const event = JSON.parse(req.body);
  
  // Check if already processed
  if (processedEvents.has(event.id)) {
    return res.status(200).send('Already processed');
  }
  
  // Process event
  handleEvent(event);
  
  // Mark as processed
  processedEvents.add(event.id);
  
  res.status(200).send('OK');
});`
        }
      ]
    },
    {
      id: 'sdks',
      title: 'SDKs & Libraries',
      description: 'Official client libraries',
      icon: Code,
      subsections: [
        {
          id: 'javascript-sdk',
          title: 'JavaScript/Node.js',
          description: 'Official JavaScript SDK',
          content: `# JavaScript/Node.js SDK

The official WorkFusion JavaScript SDK for Node.js and browser environments.

## Installation

\`\`\`bash
npm install @workfusion/api
# or
yarn add @workfusion/api
\`\`\`

## Quick Start

\`\`\`javascript
const WorkFusion = require('@workfusion/api');

const client = new WorkFusion({
  apiKey: process.env.WORKFUSION_API_KEY
});
\`\`\`

## Features

- **TypeScript Support**: Full type definitions included
- **Automatic Retries**: Built-in retry logic with exponential backoff
- **Request/Response Interceptors**: Customize requests and responses
- **Streaming Support**: Stream chat completions and TTS audio
- **Error Handling**: Comprehensive error types and messages
- **Rate Limit Handling**: Automatic rate limit respect

## Configuration Options

\`\`\`javascript
const client = new WorkFusion({
  apiKey: 'your-api-key',
  baseURL: 'https://api.workfusion.pro/v1', // Custom base URL
  timeout: 30000, // Request timeout in ms
  maxRetries: 3, // Number of retries
  retryDelay: 1000, // Initial retry delay in ms
  headers: { // Custom headers
    'X-Custom-Header': 'value'
  }
});
\`\`\`

## Browser Usage

For browser environments, use the ES module build:

\`\`\`html
<script type="module">
  import WorkFusion from 'https://cdn.jsdelivr.net/npm/@workfusion/api@latest/dist/workfusion.esm.js';
  
  const client = new WorkFusion({
    apiKey: 'your-api-key'
  });
</script>
\`\`\`

## TypeScript

Full TypeScript support with type definitions:

\`\`\`typescript
import WorkFusion from '@workfusion/api';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const client = new WorkFusion({
  apiKey: process.env.WORKFUSION_API_KEY!
});

const completion = await client.chat.completions.create({
  model: 'gpt-4',
  messages: [
    { role: 'user', content: 'Hello!' }
  ]
});
\`\`\``,
          codeExample: `// Complete example with error handling
const WorkFusion = require('@workfusion/api');

const client = new WorkFusion({
  apiKey: process.env.WORKFUSION_API_KEY,
  maxRetries: 3,
  timeout: 30000
});

async function chatWithRetry(message) {
  try {
    const completion = await client.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: message }],
      max_tokens: 150,
      temperature: 0.7
    });

    return completion.choices[0].message.content;
  } catch (error) {
    if (error instanceof WorkFusion.APIError) {
      console.error('API Error:', error.status, error.message);
    } else if (error instanceof WorkFusion.RateLimitError) {
      console.error('Rate limited. Retry after:', error.retryAfter);
      // Wait and retry
      await new Promise(resolve => setTimeout(resolve, error.retryAfter * 1000));
      return chatWithRetry(message);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
}

// Streaming example
async function streamChat(message) {
  const stream = await client.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: message }],
    stream: true
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || '';
    process.stdout.write(content);
  }
  console.log('\\n--- Stream complete ---');
}

// TTS example
async function generateSpeech(text) {
  const audio = await client.audio.speech.create({
    model: 'tts-1',
    voice: 'alloy',
    input: text
  });

  const buffer = Buffer.from(await audio.arrayBuffer());
  require('fs').writeFileSync('speech.mp3', buffer);
  console.log('Audio saved to speech.mp3');
}`
        },
        {
          id: 'python-sdk',
          title: 'Python',
          description: 'Official Python SDK',
          content: `# Python SDK

The official WorkFusion Python SDK with support for Python 3.7+.

## Installation

\`\`\`bash
pip install workfusion
# or
poetry add workfusion
\`\`\`

## Quick Start

\`\`\`python
import workfusion

client = workfusion.WorkFusion(
    api_key="your-api-key"
)
\`\`\`

## Features

- **Type Hints**: Full type annotation support
- **Async Support**: Both sync and async clients
- **Pydantic Models**: Structured response objects
- **Automatic Retries**: Built-in retry logic
- **Streaming Support**: Stream responses in real-time
- **Error Handling**: Comprehensive exception hierarchy

## Async Client

\`\`\`python
import asyncio
import workfusion

async def main():
    client = workfusion.AsyncWorkFusion(
        api_key="your-api-key"
    )
    
    completion = await client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": "Hello!"}]
    )
    
    print(completion.choices[0].message.content)

asyncio.run(main())
\`\`\`

## Configuration

\`\`\`python
import workfusion

client = workfusion.WorkFusion(
    api_key="your-api-key",
    base_url="https://api.workfusion.pro/v1",
    timeout=30.0,
    max_retries=3,
    headers={"X-Custom-Header": "value"}
)
\`\`\`

## Error Handling

\`\`\`python
import workfusion

try:
    completion = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": "Hello!"}]
    )
except workfusion.RateLimitError as e:
    print(f"Rate limited. Retry after: {e.retry_after}")
except workfusion.APIError as e:
    print(f"API error: {e.status_code} - {e.message}")
except workfusion.WorkFusionError as e:
    print(f"WorkFusion error: {e}")
\`\`\`

## Streaming

\`\`\`python
stream = client.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "Tell me a story"}],
    stream=True
)

for chunk in stream:
    content = chunk.choices[0].delta.content or ""
    print(content, end="")
\`\`\``,
          codeExample: `# Complete Python example
import workfusion
import asyncio
from typing import List, Dict, Any

class ChatBot:
    def __init__(self, api_key: str):
        self.client = workfusion.WorkFusion(api_key=api_key)
        self.conversation_history: List[Dict[str, str]] = []
    
    def add_message(self, role: str, content: str):
        self.conversation_history.append({
            "role": role,
            "content": content
        })
    
    def chat(self, message: str) -> str:
        # Add user message to history
        self.add_message("user", message)
        
        try:
            completion = self.client.chat.completions.create(
                model="gpt-4",
                messages=self.conversation_history,
                max_tokens=150,
                temperature=0.7
            )
            
            response = completion.choices[0].message.content
            self.add_message("assistant", response)
            
            return response
            
        except workfusion.RateLimitError as e:
            return f"Rate limited. Please wait {e.retry_after} seconds."
        except workfusion.APIError as e:
            return f"API error: {e.message}"
    
    def stream_chat(self, message: str):
        self.add_message("user", message)
        
        stream = self.client.chat.completions.create(
            model="gpt-4",
            messages=self.conversation_history,
            stream=True
        )
        
        response_content = ""
        for chunk in stream:
            content = chunk.choices[0].delta.content or ""
            response_content += content
            yield content
        
        self.add_message("assistant", response_content)

# Usage
bot = ChatBot("your-api-key")

# Regular chat
response = bot.chat("What is machine learning?")
print(response)

# Streaming chat
print("Streaming response:")
for chunk in bot.stream_chat("Explain neural networks"):
    print(chunk, end="", flush=True)
print("\\n--- Complete ---")

# Text-to-speech
def generate_speech(text: str, voice: str = "alloy"):
    response = bot.client.audio.speech.create(
        model="tts-1",
        voice=voice,
        input=text
    )
    
    with open("speech.mp3", "wb") as f:
        f.write(response.content)
    
    print("Audio saved to speech.mp3")

generate_speech("Hello from WorkFusion!")

# WhatsApp integration
def send_whatsapp(phone: str, message: str):
    response = bot.client.whatsapp.messages.create(
        to=phone,
        type="text",
        text={"body": message}
    )
    
    return response.id

message_id = send_whatsapp("+1234567890", "Hello from WorkFusion API!")`
        }
      ]
    }
  ]

  const filteredSections = documentation.filter(section =>
    searchQuery === '' ||
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.subsections.some(sub =>
      sub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  const currentSection = documentation.find(section => section.id === activeSection)
  const currentSubsection = currentSection?.subsections.find(sub => sub.id === activeSubsection)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(id)
    toast.success('Code copied to clipboard!')
    setTimeout(() => setCopiedCode(null), 2000)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-green/20 via-primary-blue/20 to-primary-yellow/20">
          <div className="container mx-auto">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Book className="h-8 w-8 text-primary-green" />
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  API Documentation
                </h1>
              </div>
              
              <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
                Everything you need to integrate WorkFusion&apos;s AI-powered APIs into your applications. 
                From quick start guides to advanced features.
              </p>

              {/* Search */}
              <div className="max-w-md mx-auto relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search documentation..."
                  className="input-glass pl-10"
                />
              </div>

              {/* Quick Links */}
              <div className="flex flex-wrap justify-center gap-3 mt-8">
                <Button
                  onClick={() => {
                    setActiveSection('getting-started')
                    setActiveSubsection('quick-start')
                  }}
                  className="btn-primary"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Quick Start
                </Button>
                <Button
                  onClick={() => {
                    setActiveSection('chat-api')
                    setActiveSubsection('chat-overview')
                  }}
                  variant="outline"
                  className="glass text-white border-white/20 hover:bg-white/10"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Chat API
                </Button>
                <Button
                  onClick={() => {
                    setActiveSection('sdks')
                    setActiveSubsection('javascript-sdk')
                  }}
                  variant="outline"
                  className="glass text-white border-white/20 hover:bg-white/10"
                >
                  <Code className="mr-2 h-4 w-4" />
                  SDKs
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Documentation Content */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Sidebar Navigation */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-4">
                  {/* Section Navigation */}
                  <motion.div
                    className="glass-strong rounded-xl overflow-hidden"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="p-4 border-b border-white/10">
                      <h3 className="text-lg font-semibold text-white">Documentation</h3>
                    </div>
                    
                    <div className="p-2">
                      {filteredSections.map((section) => (
                        <div key={section.id} className="mb-2">
                          <button
                            onClick={() => {
                              setActiveSection(section.id)
                              setActiveSubsection(section.subsections[0].id)
                            }}
                            className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-all ${
                              activeSection === section.id
                                ? 'bg-primary-green text-white'
                                : 'text-white/70 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            <section.icon className="h-4 w-4" />
                            <div className="flex-1">
                              <div className="font-medium">{section.title}</div>
                              <div className="text-xs opacity-80">{section.description}</div>
                            </div>
                          </button>

                          {/* Subsection Navigation */}
                          {activeSection === section.id && (
                            <motion.div
                              className="ml-4 mt-2 space-y-1"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              transition={{ duration: 0.2 }}
                            >
                              {section.subsections.map((subsection) => (
                                <button
                                  key={subsection.id}
                                  onClick={() => setActiveSubsection(subsection.id)}
                                  className={`w-full text-left p-2 rounded text-sm transition-all ${
                                    activeSubsection === subsection.id
                                      ? 'text-primary-green bg-primary-green/10'
                                      : 'text-white/60 hover:text-white/80'
                                  }`}
                                >
                                  {subsection.title}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Quick Links */}
                  <motion.div
                    className="glass-strong rounded-xl p-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
                    <div className="space-y-2">
                      <a
                        href="/dashboard/api"
                        className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors"
                      >
                        <Key className="h-4 w-4" />
                        <span>API Keys</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                      <a
                        href="/playground"
                        className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors"
                      >
                        <Terminal className="h-4 w-4" />
                        <span>API Playground</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                      <a
                        href="https://github.com/workfusion/api-examples"
                        className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors"
                      >
                        <Github className="h-4 w-4" />
                        <span>Code Examples</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                <motion.div
                  className="glass-strong rounded-xl overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {currentSubsection && (
                    <div className="p-8">
                      {/* Breadcrumb */}
                      <div className="flex items-center space-x-2 text-sm text-white/60 mb-6">
                        <span>{currentSection?.title}</span>
                        <ArrowRight className="h-3 w-3" />
                        <span className="text-white">{currentSubsection.title}</span>
                      </div>

                      {/* Content */}
                      <div className="prose prose-invert max-w-none">
                        {currentSubsection.content && (
                          <div 
                            className="text-white/80 leading-relaxed"
                            dangerouslySetInnerHTML={{
                              __html: currentSubsection.content
                                .replace(/^# /gm, '<h1 class="text-3xl font-bold text-white mb-4">')
                                .replace(/^## /gm, '<h2 class="text-2xl font-semibold text-white mb-3 mt-8">')
                                .replace(/^### /gm, '<h3 class="text-xl font-medium text-white mb-2 mt-6">')
                                .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
                                .replace(/`([^`]+)`/g, '<code class="bg-white/10 text-primary-green px-1 py-0.5 rounded text-sm">$1</code>')
                                .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-black/20 border border-white/10 rounded-lg p-4 overflow-x-auto my-4"><code class="text-white/90 text-sm">$2</code></pre>')
                                .replace(/\n/g, '<br>')
                            }}
                          />
                        )}

                        {/* Code Example */}
                        {currentSubsection.codeExample && (
                          <div className="mt-8">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="text-lg font-medium text-white">Example</h3>
                              <Button
                                onClick={() => copyToClipboard(currentSubsection.codeExample!, currentSubsection.id)}
                                variant="outline"
                                size="sm"
                                className="glass text-white border-white/20 hover:bg-white/10"
                              >
                                {copiedCode === currentSubsection.id ? (
                                  <CheckCircle className="h-4 w-4 text-green-400" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                            
                            <div className="bg-black/40 border border-white/10 rounded-lg overflow-hidden">
                              <pre className="p-4 overflow-x-auto">
                                <code className="text-white/90 text-sm whitespace-pre">
                                  {currentSubsection.codeExample}
                                </code>
                              </pre>
                            </div>
                          </div>
                        )}

                        {/* Navigation */}
                        <div className="flex items-center justify-between mt-12 pt-8 border-t border-white/10">
                          <div>
                            {currentSection && currentSubsection && (
                              (() => {
                                const currentIndex = currentSection.subsections.findIndex(sub => sub.id === activeSubsection)
                                const prevSubsection = currentIndex > 0 ? currentSection.subsections[currentIndex - 1] : null
                                
                                return prevSubsection ? (
                                  <Button
                                    onClick={() => setActiveSubsection(prevSubsection.id)}
                                    variant="outline"
                                    className="glass text-white border-white/20 hover:bg-white/10"
                                  >
                                    ← {prevSubsection.title}
                                  </Button>
                                ) : null
                              })()
                            )}
                          </div>
                          
                          <div>
                            {currentSection && currentSubsection && (
                              (() => {
                                const currentIndex = currentSection.subsections.findIndex(sub => sub.id === activeSubsection)
                                const nextSubsection = currentIndex < currentSection.subsections.length - 1 
                                  ? currentSection.subsections[currentIndex + 1] 
                                  : null
                                
                                return nextSubsection ? (
                                  <Button
                                    onClick={() => setActiveSubsection(nextSubsection.id)}
                                    variant="outline"
                                    className="glass text-white border-white/20 hover:bg-white/10"
                                  >
                                    {nextSubsection.title} →
                                  </Button>
                                ) : null
                              })()
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}