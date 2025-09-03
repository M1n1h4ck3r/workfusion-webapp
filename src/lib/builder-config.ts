import { builder } from '@builder.io/sdk'

// Initialize Builder with your API key (client-side only)
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_BUILDER_API_KEY) {
  try {
    builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY!)
  } catch (error) {
    console.warn('Builder.io initialization failed:', error)
  }
}

// Configure Builder.io settings
export const builderConfig = {
  apiKey: process.env.NEXT_PUBLIC_BUILDER_API_KEY!,
  privateKey: process.env.BUILDER_PRIVATE_KEY!,
  modelName: process.env.NEXT_PUBLIC_BUILDER_MODEL_NAME || 'page',
  spaceId: process.env.NEXT_PUBLIC_BUILDER_SPACE_ID!,
  webhookSecret: process.env.BUILDER_WEBHOOK_SECRET!,
  env: process.env.NEXT_PUBLIC_BUILDER_ENV || 'development'
}

// Design tokens for Builder.io
export const designTokens = {
  colors: {
    primary: {
      green: '#06D6A0',
      blue: '#118AB2',
      yellow: '#FFD23F',
      orange: '#FF8500',
      purple: '#7209B7'
    },
    neutral: {
      black: '#000000',
      white: '#FFFFFF',
      gray: {
        50: '#F9FAFB',
        100: '#F3F4F6',
        200: '#E5E7EB',
        300: '#D1D5DB',
        400: '#9CA3AF',
        500: '#6B7280',
        600: '#4B5563',
        700: '#374151',
        800: '#1F2937',
        900: '#111827'
      }
    }
  },
  spacing: {
    0: '0px',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    32: '8rem',
    40: '10rem',
    48: '12rem',
    56: '14rem',
    64: '16rem'
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem'
  },
  fontWeights: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900'
  },
  borderRadius: {
    none: '0px',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px'
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)'
  }
}

// Theme configuration for Builder.io
export const builderTheme = {
  breakpoints: {
    mobile: 768,
    tablet: 1024,
    desktop: 1280,
    wide: 1536
  },
  components: {
    button: {
      variants: {
        primary: {
          backgroundColor: designTokens.colors.primary.green,
          color: designTokens.colors.neutral.white,
          borderRadius: designTokens.borderRadius.lg,
          padding: `${designTokens.spacing[3]} ${designTokens.spacing[6]}`,
          fontSize: designTokens.fontSizes.base,
          fontWeight: designTokens.fontWeights.medium
        },
        secondary: {
          backgroundColor: 'transparent',
          color: designTokens.colors.primary.green,
          borderRadius: designTokens.borderRadius.lg,
          border: `1px solid ${designTokens.colors.primary.green}`,
          padding: `${designTokens.spacing[3]} ${designTokens.spacing[6]}`,
          fontSize: designTokens.fontSizes.base,
          fontWeight: designTokens.fontWeights.medium
        },
        ghost: {
          backgroundColor: 'transparent',
          color: designTokens.colors.neutral.gray[700],
          borderRadius: designTokens.borderRadius.lg,
          padding: `${designTokens.spacing[3]} ${designTokens.spacing[6]}`,
          fontSize: designTokens.fontSizes.base,
          fontWeight: designTokens.fontWeights.medium
        }
      }
    },
    card: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      borderRadius: designTokens.borderRadius['2xl'],
      border: '1px solid rgba(255, 255, 255, 0.2)',
      padding: designTokens.spacing[6]
    },
    input: {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: designTokens.borderRadius.lg,
      padding: `${designTokens.spacing[3]} ${designTokens.spacing[4]}`,
      fontSize: designTokens.fontSizes.base,
      color: designTokens.colors.neutral.white
    }
  }
}

export default builder