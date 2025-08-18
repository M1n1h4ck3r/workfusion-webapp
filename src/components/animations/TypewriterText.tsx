'use client'

import { motion, useAnimation, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

interface TypewriterTextProps {
  text: string
  className?: string
  delay?: number
  speed?: number
}

export function TypewriterText({ 
  text, 
  className = "", 
  delay = 0, 
  speed = 0.05 
}: TypewriterTextProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const controls = useAnimation()
  const [displayText, setDisplayText] = useState('')

  useEffect(() => {
    if (isInView) {
      let currentIndex = 0
      const timer = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayText(text.slice(0, currentIndex))
          currentIndex++
        } else {
          clearInterval(timer)
        }
      }, speed * 1000)

      return () => clearInterval(timer)
    }
  }, [isInView, text, speed])

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.5 }}
    >
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        className="inline-block w-1 h-8 bg-primary-green ml-1"
      />
    </motion.span>
  )
}