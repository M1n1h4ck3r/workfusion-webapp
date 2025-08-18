'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown, MousePointer } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ScrollIndicator() {
  const [isVisible, setIsVisible] = useState(true)
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 200], [1, 0])
  
  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => {
      setIsVisible(latest < 100)
    })
    return () => unsubscribe()
  }, [scrollY])
  
  const scrollToNext = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    })
  }

  if (!isVisible) return null

  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer group"
      style={{ opacity }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 3, duration: 0.8 }}
      onClick={scrollToNext}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Glowing background */}
      <motion.div
        className="absolute inset-0 bg-gradient-primary rounded-2xl blur-xl opacity-30 -m-4"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="flex flex-col items-center space-y-3 relative z-10"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Enhanced text with glow */}
        <motion.span 
          className="text-white/70 text-sm font-medium tracking-wide"
          style={{
            textShadow: '0 0 10px rgba(74, 222, 128, 0.5)'
          }}
          animate={{
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          Scroll to explore
        </motion.span>
        
        {/* Enhanced mouse indicator */}
        <motion.div 
          className="relative w-7 h-12 border-2 border-white/40 rounded-full flex justify-center pt-2 bg-white/5"
          whileHover={{
            borderColor: 'rgba(74, 222, 128, 0.6)',
            backgroundColor: 'rgba(74, 222, 128, 0.1)',
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Scroll indicator dot */}
          <motion.div
            className="w-1.5 h-4 rounded-full"
            style={{
              background: 'linear-gradient(to bottom, rgba(74, 222, 128, 0.8), rgba(74, 222, 128, 0.4))',
              boxShadow: '0 0 8px rgba(74, 222, 128, 0.6)',
            }}
            animate={{ y: [0, 16, 0] }}
            transition={{ 
              duration: 1.8, 
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          {/* Glowing trail effect */}
          <motion.div
            className="absolute w-1 h-2 rounded-full bg-primary-green/30 blur-sm"
            style={{ top: '8px', left: '50%', transform: 'translateX(-50%)' }}
            animate={{ 
              y: [0, 16, 0],
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{ 
              duration: 1.8, 
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.2,
            }}
          />
        </motion.div>
        
        {/* Animated chevron with multiple layers */}
        <div className="relative">
          <motion.div
            animate={{ 
              y: [0, 5, 0],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <ChevronDown className="w-6 h-6 text-white/60" />
          </motion.div>
          
          {/* Second chevron for depth */}
          <motion.div
            className="absolute top-0 left-0"
            animate={{ 
              y: [2, 7, 2],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3,
            }}
          >
            <ChevronDown className="w-6 h-6 text-primary-green/40" />
          </motion.div>
        </div>
        
        {/* Ripple effect on hover */}
        <motion.div
          className="absolute inset-0 rounded-2xl border border-white/20"
          initial={{ scale: 1, opacity: 0 }}
          whileHover={{
            scale: [1, 1.5],
            opacity: [0, 0.3, 0],
          }}
          transition={{ duration: 0.6 }}
        />
      </motion.div>
    </motion.div>
  )
}