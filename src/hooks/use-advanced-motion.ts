'use client'

import { useAnimation, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useState, RefObject } from 'react'

// Advanced motion hook for complex animations
export function useAdvancedMotion(ref?: RefObject<HTMLElement>) {
  const controls = useAnimation()
  const [isInView, setIsInView] = useState(false)
  
  const { scrollY, scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  // Transform values based on scroll
  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8])
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360])

  // Mouse position tracking
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  // Spring animations for mouse tracking
  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 })
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 })

  // Parallax transforms
  const parallaxY = useTransform(scrollY, [0, 1000], [0, -200])
  const parallaxScale = useTransform(scrollY, [0, 1000], [1, 0.8])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (ref?.current) {
        const rect = ref.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        
        mouseX.set((e.clientX - centerX) / 10)
        mouseY.set((e.clientY - centerY) / 10)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY, ref])

  // Intersection Observer for in-view animations
  useEffect(() => {
    if (!ref?.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
        if (entry.isIntersecting) {
          controls.start('visible')
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [controls, ref])

  // Animation sequences
  const sequenceAnimation = async (sequence: string[]) => {
    for (const animation of sequence) {
      await controls.start(animation)
    }
  }

  // Shake animation
  const shake = () => {
    return controls.start({
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.5 }
    })
  }

  // Bounce animation
  const bounce = () => {
    return controls.start({
      y: [0, -20, 0, -10, 0],
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    })
  }

  // Pulse animation
  const pulse = () => {
    return controls.start({
      scale: [1, 1.1, 1],
      transition: { 
        duration: 0.4,
        ease: "easeInOut"
      }
    })
  }

  // Rotate animation
  const rotateAnimation = (degrees: number = 360) => {
    return controls.start({
      rotate: degrees,
      transition: { 
        duration: 0.5,
        ease: "easeInOut"
      }
    })
  }

  // Morphing animation
  const morph = (scale: number = 1.2, borderRadius: string = "50%") => {
    return controls.start({
      scale,
      borderRadius,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    })
  }

  // Glitch effect
  const glitch = () => {
    return controls.start({
      x: [0, -5, 5, -5, 5, 0],
      y: [0, -2, 2, -2, 2, 0],
      skew: [0, -2, 2, -2, 2, 0],
      transition: { 
        duration: 0.3,
        repeat: 2
      }
    })
  }

  return {
    // Animation controls
    controls,
    isInView,
    
    // Scroll-based transforms
    scrollTransforms: {
      y,
      opacity,
      scale,
      rotate,
      parallaxY,
      parallaxScale
    },
    
    // Mouse tracking
    mouseTracking: {
      x: springX,
      y: springY,
      mouseX,
      mouseY
    },
    
    // Scroll values
    scrollY,
    scrollYProgress,
    
    // Animation functions
    animations: {
      sequenceAnimation,
      shake,
      bounce,
      pulse,
      rotate: rotateAnimation,
      morph,
      glitch
    }
  }
}

// Hook for stagger animations
export function useStaggerAnimation(itemCount: number, delay: number = 0.1) {
  const controls = useAnimation()

  const startStagger = () => {
    return controls.start(i => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * delay }
    }))
  }

  const resetStagger = () => {
    return controls.start({
      opacity: 0,
      y: 20
    })
  }

  return {
    controls,
    startStagger,
    resetStagger
  }
}

// Hook for page transitions
export function usePageTransition() {
  const [isExiting, setIsExiting] = useState(false)

  const exitPage = async () => {
    setIsExiting(true)
    // Trigger exit animation
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  const enterPage = () => {
    setIsExiting(false)
  }

  return {
    isExiting,
    exitPage,
    enterPage
  }
}

// Hook for gesture-based animations
export function useGestureAnimations() {
  const [isDragging, setIsDragging] = useState(false)
  const [dragConstraints, setDragConstraints] = useState({ top: 0, left: 0, right: 0, bottom: 0 })

  const handleDragStart = () => setIsDragging(true)
  const handleDragEnd = () => setIsDragging(false)

  const updateConstraints = (constraints: typeof dragConstraints) => {
    setDragConstraints(constraints)
  }

  return {
    isDragging,
    dragConstraints,
    dragHandlers: {
      onDragStart: handleDragStart,
      onDragEnd: handleDragEnd
    },
    updateConstraints
  }
}

// Hook for scroll-triggered animations
export function useScrollTrigger(threshold: number = 0.1) {
  const [hasTriggered, setHasTriggered] = useState(false)
  const [element, setElement] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggered) {
          setHasTriggered(true)
        }
      },
      { threshold }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [element, hasTriggered, threshold])

  const reset = () => setHasTriggered(false)

  return {
    hasTriggered,
    setRef: setElement,
    reset
  }
}