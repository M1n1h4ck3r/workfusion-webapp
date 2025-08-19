import { Builder } from '@builder.io/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ChatInterface } from '@/components/chat/ChatInterface'
import { CollaborationPanel } from '@/components/collaboration/CollaborationPanel'
import { AvatarUpload } from '@/components/profile/AvatarUpload'
import { designTokens, builderTheme } from './builder-config'

// Register UI Components
Builder.registerComponent(Button, {
  name: 'WorkfusionButton',
  friendlyName: 'Workfusion Button',
  description: 'Customizable button component with Workfusion styling',
  image: 'https://tabler-icons.io/static/tabler-icons/icons-png/click.png',
  inputs: [
    {
      name: 'children',
      type: 'text',
      defaultValue: 'Click me',
      friendlyName: 'Button Text'
    },
    {
      name: 'variant',
      type: 'string',
      enum: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      defaultValue: 'default',
      friendlyName: 'Button Variant'
    },
    {
      name: 'size',
      type: 'string',
      enum: ['default', 'sm', 'lg', 'icon'],
      defaultValue: 'default',
      friendlyName: 'Button Size'
    },
    {
      name: 'disabled',
      type: 'boolean',
      defaultValue: false,
      friendlyName: 'Disabled'
    },
    {
      name: 'className',
      type: 'string',
      friendlyName: 'Custom CSS Classes'
    },
    {
      name: 'onClick',
      type: 'string',
      friendlyName: 'Click Handler (JavaScript)'
    }
  ]
})

Builder.registerComponent(Badge, {
  name: 'WorkfusionBadge',
  friendlyName: 'Workfusion Badge',
  description: 'Badge component for status indicators',
  image: 'https://tabler-icons.io/static/tabler-icons/icons-png/badge.png',
  inputs: [
    {
      name: 'children',
      type: 'text',
      defaultValue: 'Badge',
      friendlyName: 'Badge Text'
    },
    {
      name: 'variant',
      type: 'string',
      enum: ['default', 'secondary', 'destructive', 'outline'],
      defaultValue: 'default',
      friendlyName: 'Badge Variant'
    },
    {
      name: 'className',
      type: 'string',
      friendlyName: 'Custom CSS Classes'
    }
  ]
})

Builder.registerComponent(Progress, {
  name: 'WorkfusionProgress',
  friendlyName: 'Workfusion Progress',
  description: 'Progress bar component',
  image: 'https://tabler-icons.io/static/tabler-icons/icons-png/progress.png',
  inputs: [
    {
      name: 'value',
      type: 'number',
      defaultValue: 50,
      friendlyName: 'Progress Value (0-100)'
    },
    {
      name: 'className',
      type: 'string',
      friendlyName: 'Custom CSS Classes'
    }
  ]
})

// Register Complex Components
Builder.registerComponent(ChatInterface, {
  name: 'WorkfusionChatInterface',
  friendlyName: 'AI Chat Interface',
  description: 'Complete AI chat interface with persona support',
  image: 'https://tabler-icons.io/static/tabler-icons/icons-png/message-chatbot.png',
  inputs: [
    {
      name: 'personalityId',
      type: 'string',
      friendlyName: 'Personality ID'
    },
    {
      name: 'className',
      type: 'string',
      friendlyName: 'Custom CSS Classes'
    }
  ],
  noWrap: true
})

Builder.registerComponent(CollaborationPanel, {
  name: 'WorkfusionCollaborationPanel',
  friendlyName: 'Collaboration Panel',
  description: 'Real-time collaboration features',
  image: 'https://tabler-icons.io/static/tabler-icons/icons-png/users.png',
  inputs: [
    {
      name: 'className',
      type: 'string',
      friendlyName: 'Custom CSS Classes'
    }
  ],
  noWrap: true
})

Builder.registerComponent(AvatarUpload, {
  name: 'WorkfusionAvatarUpload',
  friendlyName: 'Avatar Upload',
  description: 'Avatar upload component with image processing',
  image: 'https://tabler-icons.io/static/tabler-icons/icons-png/photo-up.png',
  inputs: [
    {
      name: 'currentAvatar',
      type: 'string',
      friendlyName: 'Current Avatar URL'
    },
    {
      name: 'onUpload',
      type: 'string',
      friendlyName: 'Upload Handler (JavaScript)'
    },
    {
      name: 'className',
      type: 'string',
      friendlyName: 'Custom CSS Classes'
    }
  ]
})

// Register Custom Blocks
Builder.registerComponent(
  (props: { title: string; subtitle?: string; children: React.ReactNode }) => (
    <div className="glass-strong p-6 rounded-2xl">
      <h2 className="text-2xl font-bold text-white mb-2">{props.title}</h2>
      {props.subtitle && (
        <p className="text-white/80 mb-4">{props.subtitle}</p>
      )}
      <div>{props.children}</div>
    </div>
  ),
  {
    name: 'WorkfusionGlassCard',
    friendlyName: 'Workfusion Glass Card',
    description: 'Glass morphism card container',
    image: 'https://tabler-icons.io/static/tabler-icons/icons-png/layout-cards.png',
    inputs: [
      {
        name: 'title',
        type: 'string',
        required: true,
        friendlyName: 'Card Title'
      },
      {
        name: 'subtitle',
        type: 'string',
        friendlyName: 'Card Subtitle'
      }
    ],
    childRequirements: {
      message: 'You can add any content here'
    }
  }
)

Builder.registerComponent(
  (props: { gradient: string; children: React.ReactNode }) => (
    <div className={`min-h-screen ${props.gradient || 'mesh-gradient'}`}>
      {props.children}
    </div>
  ),
  {
    name: 'WorkfusionGradientBackground',
    friendlyName: 'Workfusion Gradient Background',
    description: 'Gradient background container',
    image: 'https://tabler-icons.io/static/tabler-icons/icons-png/palette.png',
    inputs: [
      {
        name: 'gradient',
        type: 'string',
        enum: ['mesh-gradient', 'bg-gradient-primary', 'bg-gradient-to-r from-primary-green to-primary-blue'],
        defaultValue: 'mesh-gradient',
        friendlyName: 'Gradient Type'
      }
    ],
    childRequirements: {
      message: 'Add content to display over the gradient'
    }
  }
)

// Register Layout Components
Builder.registerComponent(
  (props: { columns: number; gap: string; children: React.ReactNode }) => (
    <div 
      className={`grid gap-${props.gap || '6'}`}
      style={{
        gridTemplateColumns: `repeat(${props.columns || 1}, minmax(0, 1fr))`
      }}
    >
      {props.children}
    </div>
  ),
  {
    name: 'WorkfusionGrid',
    friendlyName: 'Workfusion Grid Layout',
    description: 'Responsive grid layout',
    image: 'https://tabler-icons.io/static/tabler-icons/icons-png/layout-grid.png',
    inputs: [
      {
        name: 'columns',
        type: 'number',
        defaultValue: 2,
        friendlyName: 'Number of Columns'
      },
      {
        name: 'gap',
        type: 'string',
        enum: ['2', '4', '6', '8', '12'],
        defaultValue: '6',
        friendlyName: 'Grid Gap'
      }
    ],
    childRequirements: {
      message: 'Add grid items here'
    }
  }
)

// Register Custom Inputs for Builder.io
Builder.register('insertMenu', {
  name: 'Workfusion Components',
  items: [
    { name: 'WorkfusionButton' },
    { name: 'WorkfusionBadge' },
    { name: 'WorkfusionProgress' },
    { name: 'WorkfusionGlassCard' },
    { name: 'WorkfusionGrid' },
    { name: 'WorkfusionGradientBackground' }
  ]
})

// Register Design System
Builder.register('editor.settings', {
  designTokens: designTokens,
  theme: builderTheme,
  styleGuide: {
    colors: Object.entries(designTokens.colors.primary).map(([name, value]) => ({
      name: `Primary ${name.charAt(0).toUpperCase() + name.slice(1)}`,
      value
    })),
    spacing: Object.entries(designTokens.spacing).map(([name, value]) => ({
      name: `Spacing ${name}`,
      value
    })),
    typography: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSizes: designTokens.fontSizes,
      fontWeights: designTokens.fontWeights
    }
  }
})

export { Builder }