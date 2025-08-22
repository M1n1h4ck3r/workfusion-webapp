'use client'

import { motion, AnimatePresence, useAnimation, useScroll, useTransform } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useState, useRef, useEffect } from 'react'
import {
  Play, Pause, RotateCcw, Sparkles, Zap, Target, 
  Heart, Star, Rocket, Code, Database, Brain,
  ArrowRight, ArrowDown, RotateCw, Shuffle
} from 'lucide-react'
import { toast } from 'sonner'
import {
  fadeIn, slideUp, slideLeft, scaleIn, rotateIn, bounceIn,
  staggerContainer, staggerItem, floating, pulse, shake,
  glitch, cardHover, buttonTap, spinner, textReveal,
  springTransition, smoothTransition, bounceTransition,
  modalVariants, backdropVariants, DURATION
} from '@/lib/motion'

const ANIMATION_DEMOS = {
  'Basic Transitions': [
    { name: 'Fade In', variant: fadeIn, icon: Target },
    { name: 'Slide Up', variant: slideUp, icon: ArrowDown },
    { name: 'Slide Left', variant: slideLeft, icon: ArrowRight },
    { name: 'Scale In', variant: scaleIn, icon: Zap },
    { name: 'Rotate In', variant: rotateIn, icon: RotateCw },
    { name: 'Bounce In', variant: bounceIn, icon: Heart }
  ],
  'Advanced Effects': [
    { name: 'Floating', variant: floating, icon: Sparkles },
    { name: 'Pulse', variant: pulse, icon: Heart },
    { name: 'Shake', variant: shake, icon: Shuffle },
    { name: 'Glitch', variant: glitch, icon: Zap },
    { name: 'Text Reveal', variant: textReveal, icon: Code },
    { name: 'Spinner', variant: spinner, icon: RotateCcw }
  ]
}

interface MotionShowcaseProps {
  className?: string
}

export function MotionShowcase({ className }: MotionShowcaseProps) {
  const [activeDemo, setActiveDemo] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [staggerDemo, setStaggerDemo] = useState(false)
  const controls = useAnimation()
  const scrollRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({ 
    target: scrollRef,
    offset: ["start end", "end start"] 
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])

  const triggerAnimation = async (animationName: string) => {
    setActiveDemo(animationName)
    setIsPlaying(true)
    
    switch (animationName) {
      case 'Shake':
        await controls.start('animate')
        await controls.start('initial')
        break
      case 'Glitch':
        await controls.start('animate')
        await controls.start('initial')
        break
      default:
        await controls.start('visible')
        setTimeout(() => controls.start('hidden'), 1000)
        break
    }
    
    setIsPlaying(false)
    toast.success(`${animationName} animation completed!`)
  }

  const resetAnimations = () => {
    controls.start('initial')
    setActiveDemo(null)
    setIsPlaying(false)
    toast.info('All animations reset')
  }

  const toggleStagger = () => {
    setStaggerDemo(!staggerDemo)
    toast.success(`Stagger animation ${!staggerDemo ? 'enabled' : 'disabled'}`)
  }

  const items = ['React', 'JavaScript', 'Vue', 'TypeScript', 'Next.js', 'Motion']

  return (
    <div className={`space-y-12 ${className}`} ref={scrollRef}>
      {/* Header with Scroll-based Animation */}
      <motion.div
        style={{ y, opacity }}
        className="text-center space-y-4"
      >
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-2"
        >
          <h1 className="text-4xl font-bold text-white">
            Motion.dev Integration
          </h1>
          <p className="text-white/80 max-w-3xl mx-auto">
            Showcasing the unified Motion library (previously Framer Motion) with advanced animations, 
            performance optimizations, and cross-framework compatibility.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <Badge className="bg-primary-green/20 text-primary-green border-primary-green/30">
              Motion v12.23.12
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              Unified Library
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
              120fps GPU Accelerated
            </Badge>
          </div>
        </motion.div>
      </motion.div>

      {/* Control Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-strong p-6 rounded-2xl"
      >
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button
            onClick={resetAnimations}
            variant="outline"
            className="glass text-white border-white/20 hover:bg-white/10"
            disabled={isPlaying}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset All
          </Button>
          <Button
            onClick={toggleStagger}
            variant="outline"
            className="glass text-white border-white/20 hover:bg-white/10"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Toggle Stagger
          </Button>
          <Button
            onClick={() => setShowModal(true)}
            className="btn-primary"
          >
            <Star className="h-4 w-4 mr-2" />
            Show Modal Demo
          </Button>
        </div>
      </motion.div>

      {/* Animation Demos Grid */}
      <div className="space-y-8">
        {Object.entries(ANIMATION_DEMOS).map(([category, demos], categoryIndex) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + categoryIndex * 0.1 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-semibold text-white flex items-center">
              <div className={`w-3 h-3 rounded-full mr-3 ${
                categoryIndex === 0 ? 'bg-green-400' : 'bg-purple-400'
              }`} />
              {category}
            </h2>
            
            <div className="glass-strong p-6 rounded-2xl">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {demos.map((demo, index) => {
                  const Icon = demo.icon
                  const isActive = activeDemo === demo.name
                  
                  return (
                    <motion.div
                      key={demo.name}
                      className="flex flex-col items-center space-y-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer group"
                      whileHover="hover"
                      whileTap="tap"
                      variants={cardHover}
                      onClick={() => triggerAnimation(demo.name)}
                    >
                      <motion.div
                        className={`relative p-4 rounded-xl ${
                          isActive ? 'bg-primary-green/20' : 'bg-white/10'
                        }`}
                        animate={controls}
                        variants={demo.variant}
                        initial="initial"
                      >
                        <Icon 
                          className={`h-8 w-8 ${
                            isActive ? 'text-primary-green' : 'text-white'
                          }`} 
                        />
                        {isActive && isPlaying && (
                          <motion.div
                            className="absolute inset-0 border-2 border-primary-green rounded-xl"
                            initial={{ scale: 1, opacity: 1 }}
                            animate={{ scale: 1.2, opacity: 0 }}
                            transition={{ duration: 1, repeat: Infinity }}
                          />
                        )}
                      </motion.div>
                      
                      <div className="text-center">
                        <div className="text-white font-medium text-sm group-hover:text-primary-green transition-colors">
                          {demo.name}
                        </div>
                        <div className="text-white/60 text-xs mt-1">
                          Click to animate
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stagger Animation Demo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="glass-strong p-8 rounded-2xl"
      >
        <h2 className="text-2xl font-semibold text-white mb-6 text-center">
          Stagger Animation Demo
        </h2>
        
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
          variants={staggerDemo ? staggerContainer : {}}
          initial="hidden"
          animate="visible"
          key={staggerDemo ? 'stagger-on' : 'stagger-off'}
        >
          {items.map((item, index) => (
            <motion.div
              key={item}
              className="glass p-4 rounded-xl text-center font-medium text-white"
              variants={staggerDemo ? staggerItem : slideUp}
            >
              {item}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Performance Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="glass-strong p-8 rounded-2xl"
      >
        <h2 className="text-2xl font-semibold text-white mb-6 text-center">
          Motion.dev Features
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div 
            className="text-center space-y-3"
            whileHover={{ scale: 1.05 }}
            transition={springTransition}
          >
            <Rocket className="h-12 w-12 text-green-400 mx-auto" />
            <h3 className="font-semibold text-white">120fps Performance</h3>
            <p className="text-white/60 text-sm">
              GPU-accelerated animations with hybrid engine
            </p>
          </motion.div>
          
          <motion.div 
            className="text-center space-y-3"
            whileHover={{ scale: 1.05 }}
            transition={springTransition}
          >
            <Database className="h-12 w-12 text-blue-400 mx-auto" />
            <h3 className="font-semibold text-white">Tree-Shakable</h3>
            <p className="text-white/60 text-sm">
              Tiny footprint, import only what you need
            </p>
          </motion.div>
          
          <motion.div 
            className="text-center space-y-3"
            whileHover={{ scale: 1.05 }}
            transition={springTransition}
          >
            <Code className="h-12 w-12 text-purple-400 mx-auto" />
            <h3 className="font-semibold text-white">Multi-Framework</h3>
            <p className="text-white/60 text-sm">
              Works with React, JavaScript, and Vue
            </p>
          </motion.div>
          
          <motion.div 
            className="text-center space-y-3"
            whileHover={{ scale: 1.05 }}
            transition={springTransition}
          >
            <Brain className="h-12 w-12 text-yellow-400 mx-auto" />
            <h3 className="font-semibold text-white">TypeScript Ready</h3>
            <p className="text-white/60 text-sm">
              Fully typed with excellent IDE support
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Modal Demo */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              className="relative glass-strong p-8 rounded-3xl max-w-lg w-full text-center space-y-6"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <div className="space-y-4">
                <motion.div
                  animate={floating}
                  className="inline-block"
                >
                  <Star className="h-16 w-16 text-yellow-400 mx-auto" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white">Modal Animation</h3>
                <p className="text-white/80">
                  This modal demonstrates advanced entrance/exit animations 
                  with backdrop blur and spring physics.
                </p>
              </div>
              
              <motion.div
                whileHover="hover"
                whileTap="tap"
                variants={buttonTap}
              >
                <Button
                  onClick={() => setShowModal(false)}
                  className="btn-primary w-full"
                >
                  Close Modal
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}