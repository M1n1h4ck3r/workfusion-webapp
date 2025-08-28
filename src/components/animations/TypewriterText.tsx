'use client'

import { motion, useAnimation, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

interface TypewriterTextProps {
  text: string
  className?: string
  delay?: number
  speed?: number
  showCursor?: boolean
  cursorColor?: string
  onComplete?: () => void
}

export function TypewriterText({ 
  text, 
  className = "", 
  delay = 0, 
  speed = 0.05,
  showCursor = true,
  cursorColor = "#4ADE80",
  onComplete
}: TypewriterTextProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const controls = useAnimation()
  const [displayText, setDisplayText] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (isInView) {
      let currentIndex = 0
      const timer = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayText(text.slice(0, currentIndex))
          currentIndex++
        } else {
          clearInterval(timer)
          setIsComplete(true)
          if (onComplete) {
            onComplete()
          }
        }
      }, speed * 1000)

      return () => clearInterval(timer)
    }
  }, [isInView, text, speed, onComplete])

  return (
    <motion.span
      ref={ref}
      className={`${className} relative`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.5 }}
    >
      {/* Enhanced text with clear visibility */}
      <motion.span
        className={`relative ${className}`}
        style={{
          textShadow: `0 2px 4px rgba(0, 0, 0, 0.3)`,
          filter: 'contrast(1.1) saturate(1.1)',
        }}
      >
        {displayText.split('').map((char, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              delay: delay + (index * speed),
              duration: 0.3,
              ease: "easeOut"
            }}
            className="inline-block"
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </motion.span>
      
      {/* Enhanced animated cursor */}
      {showCursor && (
        <motion.span
          animate={{ 
            opacity: isComplete ? [1, 0, 1] : [1, 0],
            scale: isComplete ? [1, 1.2, 1] : [1, 1],
          }}
          transition={{ 
            duration: isComplete ? 1.5 : 0.8, 
            repeat: Infinity, 
            repeatType: "reverse",
            ease: "easeInOut"
          }}
          className="inline-block w-1 ml-1 relative"
          style={{
            height: '1em',
            background: `linear-gradient(to bottom, ${cursorColor}, ${cursorColor}80)`,
            boxShadow: `0 0 10px ${cursorColor}80, 0 0 20px ${cursorColor}40`,
            borderRadius: '1px',
          }}
        />
      )}
      
      {/* Completion sparkle effect */}
      {isComplete && (
        <motion.span
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute -top-2 -right-2 text-yellow-400"
        >
          ✨
        </motion.span>
      )}
    </motion.span>
  )
}