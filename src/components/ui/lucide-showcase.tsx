'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import {
  Brain, Sparkles, Zap, Target, Shield, Globe, 
  Bot, Code, Database, Heart, Star, Rocket,
  Cpu, Server, Cloud, Lock, Unlock, Key,
  TrendingUp, BarChart3, Activity, Users,
  Palette, Paintbrush, Sun, Moon, Settings,
  Play, Pause, Volume2, Headphones, Radio,
  Github, ExternalLink, Download, Upload
} from 'lucide-react'
import { getIconProps, type IconSize, ICON_SIZES } from '@/lib/icons'
import { toast } from 'sonner'

const ICON_CATEGORIES = {
  'AI & Tech': [Brain, Sparkles, Zap, Target, Shield, Globe, Bot, Code, Database],
  'Business': [TrendingUp, BarChart3, Activity, Users, Heart, Star, Rocket],
  'Infrastructure': [Cpu, Server, Cloud, Lock, Unlock, Key],
  'Media': [Play, Pause, Volume2, Headphones, Radio],
  'Design': [Palette, Paintbrush, Sun, Moon, Settings],
  'Social': [Github, ExternalLink, Download, Upload]
}

const DEMO_COLORS = [
  'text-blue-400',
  'text-green-400', 
  'text-purple-400',
  'text-pink-400',
  'text-yellow-400',
  'text-indigo-400',
  'text-red-400',
  'text-cyan-400'
]

interface LucideShowcaseProps {
  className?: string
}

export function LucideShowcase({ className }: LucideShowcaseProps) {
  const [selectedSize, setSelectedSize] = useState<IconSize>('lg')
  const [isAnimating, setIsAnimating] = useState(false)

  const handleSizeChange = (size: IconSize) => {
    setSelectedSize(size)
    toast.success(`Icon size changed to ${size} (${ICON_SIZES[size]}px)`)
  }

  const triggerAnimation = () => {
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 1000)
    toast.info('Icons animated with Lucide + Framer Motion!')
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-4xl font-bold text-white">
            Lucide.dev Integration
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto">
            Showcasing the latest Lucide icons with optimized tree-shaking, 
            customizable properties, and seamless React integration.
          </p>
          <Badge className="bg-primary-green/20 text-primary-green border-primary-green/30">
            Version 0.541.0 • 1633+ Icons
          </Badge>
        </motion.div>
        
        {/* Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <div className="flex items-center space-x-2">
            <span className="text-white/60 text-sm">Size:</span>
            {(['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as IconSize[]).map((size) => (
              <Button
                key={size}
                onClick={() => handleSizeChange(size)}
                variant={selectedSize === size ? 'default' : 'outline'}
                size="sm"
                className={selectedSize === size ? 'bg-primary-green' : 'glass text-white border-white/20'}
              >
                {size.toUpperCase()}
              </Button>
            ))}
          </div>
          <Button
            onClick={triggerAnimation}
            className="btn-primary"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Animate Icons
          </Button>
        </div>
      </div>

      {/* Icon Categories */}
      <div className="space-y-8">
        {Object.entries(ICON_CATEGORIES).map(([category, icons], categoryIndex) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.1 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold text-white flex items-center">
              <div className={`w-3 h-3 rounded-full mr-3 ${DEMO_COLORS[categoryIndex % DEMO_COLORS.length]?.replace('text-', 'bg-')}`} />
              {category}
              <Badge variant="outline" className="ml-3 text-white/60 border-white/20">
                {icons.length} icons
              </Badge>
            </h2>
            
            <div className="glass-strong p-6 rounded-2xl">
              <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-6">
                {icons.map((Icon, iconIndex) => {
                  const colorClass = DEMO_COLORS[(categoryIndex + iconIndex) % DEMO_COLORS.length]
                  const iconProps = getIconProps(selectedSize, `${colorClass} transition-all duration-300`)
                  
                  return (
                    <motion.div
                      key={iconIndex}
                      className="flex flex-col items-center space-y-2 p-3 rounded-lg hover:bg-white/5 transition-all cursor-pointer group"
                      whileHover={{ scale: 1.1 }}
                      animate={isAnimating ? {
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.2, 1],
                      } : {}}
                      transition={{
                        duration: 0.5,
                        delay: isAnimating ? iconIndex * 0.05 : 0
                      }}
                      onClick={() => {
                        const iconName = Icon.displayName || Icon.name || 'Unknown'
                        navigator.clipboard.writeText(`<${iconName} ${selectedSize !== 'md' ? `size={${ICON_SIZES[selectedSize]}} ` : ''}/>`)
                        toast.success(`Copied ${iconName} to clipboard!`)
                      }}
                    >
                      <Icon {...iconProps} />
                      <div className="text-xs text-white/40 opacity-0 group-hover:opacity-100 transition-opacity text-center">
                        {Icon.displayName || Icon.name || 'Icon'}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Features Highlight */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="glass-strong p-8 rounded-2xl"
      >
        <h2 className="text-2xl font-semibold text-white mb-6 text-center">
          Lucide.dev Features
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center space-y-3">
            <Zap className="h-12 w-12 text-yellow-400 mx-auto" />
            <h3 className="font-semibold text-white">Tree-Shakable</h3>
            <p className="text-white/60 text-sm">
              Import only the icons you need. Optimized bundle size.
            </p>
          </div>
          
          <div className="text-center space-y-3">
            <Palette className="h-12 w-12 text-purple-400 mx-auto" />
            <h3 className="font-semibold text-white">Customizable</h3>
            <p className="text-white/60 text-sm">
              Easy color, size, and stroke width customization.
            </p>
          </div>
          
          <div className="text-center space-y-3">
            <Code className="h-12 w-12 text-blue-400 mx-auto" />
            <h3 className="font-semibold text-white">React Native</h3>
            <p className="text-white/60 text-sm">
              Works seamlessly with React components.
            </p>
          </div>
          
          <div className="text-center space-y-3">
            <Users className="h-12 w-12 text-green-400 mx-auto" />
            <h3 className="font-semibold text-white">Community</h3>
            <p className="text-white/60 text-sm">
              Open-source with active community support.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-white/60 mb-4">
            Click any icon above to copy its JSX code to clipboard
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              ✓ Latest Version 0.541.0
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              ✓ Optimized Imports
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
              ✓ Tree-Shaking Enabled
            </Badge>
          </div>
        </div>
      </motion.div>
    </div>
  )
}