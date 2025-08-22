// Centralized motion management for better performance and consistency
// Following motion.dev best practices for the unified Motion library

import { type Variants, type Transition } from 'framer-motion'

// Animation Variants - Reusable animation patterns
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
}

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export const slideDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 }
}

export const slideLeft: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 }
}

export const slideRight: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 }
}

export const scaleOut: Variants = {
  hidden: { opacity: 1, scale: 1 },
  visible: { opacity: 0, scale: 0.8 }
}

export const rotateIn: Variants = {
  hidden: { opacity: 0, rotate: -10, scale: 0.95 },
  visible: { opacity: 1, rotate: 0, scale: 1 }
}

export const flipIn: Variants = {
  hidden: { opacity: 0, rotateX: -90 },
  visible: { opacity: 1, rotateX: 0 }
}

export const bounceIn: Variants = {
  hidden: { opacity: 0, scale: 0.3 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  }
}

// Stagger animations for lists
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

// Complex animations
export const typewriter: Variants = {
  hidden: { width: 0 },
  visible: { 
    width: "auto",
    transition: {
      duration: 2,
      ease: "easeInOut"
    }
  }
}

export const morphing: Variants = {
  initial: { 
    borderRadius: "10px",
    scale: 1
  },
  hover: { 
    borderRadius: "50px",
    scale: 1.05,
    transition: {
      type: "spring",
      stiffness: 300
    }
  }
}

export const floating: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

export const pulse: Variants = {
  initial: { scale: 1, opacity: 1 },
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

export const shake: Variants = {
  initial: { x: 0 },
  animate: {
    x: [-5, 5, -5, 5, 0],
    transition: {
      duration: 0.5
    }
  }
}

export const glitch: Variants = {
  initial: { x: 0, y: 0, scale: 1 },
  animate: {
    x: [0, -2, 2, 0],
    y: [0, -1, 1, 0],
    scale: [1, 0.98, 1.02, 1],
    transition: {
      duration: 0.3,
      repeat: 3,
      ease: "easeInOut"
    }
  }
}

// Transition presets
export const springTransition: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30
}

export const smoothTransition: Transition = {
  type: "tween",
  duration: 0.3,
  ease: "easeInOut"
}

export const fastTransition: Transition = {
  type: "tween",
  duration: 0.15,
  ease: "easeOut"
}

export const slowTransition: Transition = {
  type: "tween",
  duration: 0.8,
  ease: "easeInOut"
}

export const bounceTransition: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 10
}

export const elasticTransition: Transition = {
  type: "spring",
  stiffness: 100,
  damping: 15
}

// Layout animations
export const layoutTransition: Transition = {
  layout: {
    duration: 0.3,
    ease: "easeInOut"
  }
}

// Page transitions
export const pageVariants: Variants = {
  initial: { opacity: 0, x: -200, scale: 0.8 },
  in: { opacity: 1, x: 0, scale: 1 },
  out: { opacity: 0, x: 200, scale: 1.2 }
}

export const pageTransition: Transition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5
}

// Modal/Dialog animations
export const modalVariants: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8, 
    y: 50 
  },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25
    }
  }
}

export const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
}

// Card hover effects
export const cardHover: Variants = {
  rest: { 
    scale: 1, 
    y: 0,
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
  },
  hover: { 
    scale: 1.03, 
    y: -5,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: {
      type: "spring",
      stiffness: 300
    }
  }
}

// Button animations
export const buttonTap: Variants = {
  tap: { scale: 0.95 },
  hover: { scale: 1.05 }
}

export const buttonPress: Variants = {
  initial: { scale: 1 },
  tap: { 
    scale: 0.95,
    transition: { duration: 0.1 }
  }
}

// Loading animations
export const spinner: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear"
    }
  }
}

export const dots: Variants = {
  animate: {
    scale: [1, 1.2, 1],
    opacity: [1, 0.5, 1],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

// Text animations
export const textReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    skewY: 7
  },
  visible: {
    opacity: 1,
    y: 0,
    skewY: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
}

export const characterReveal: Variants = {
  hidden: { 
    opacity: 0, 
    y: 50,
    rotateX: -90
  },
  visible: { 
    opacity: 1, 
    y: 0,
    rotateX: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
}

// Utility functions for animation composition
export function createStaggerAnimation(
  baseVariant: Variants, 
  staggerDelay: number = 0.1
): Variants {
  return {
    hidden: baseVariant.hidden,
    visible: {
      ...baseVariant.visible,
      transition: {
        ...((baseVariant.visible as any)?.transition || {}),
        staggerChildren: staggerDelay
      }
    }
  }
}

export function createDelayedAnimation(
  baseVariant: Variants,
  delay: number = 0.2
): Variants {
  return {
    ...baseVariant,
    visible: {
      ...baseVariant.visible,
      transition: {
        ...((baseVariant.visible as any)?.transition || {}),
        delay
      }
    }
  }
}

// Performance optimized animations
export const performanceOptimized = {
  willChange: "transform, opacity",
  backfaceVisibility: "hidden" as const,
  perspective: "1000px"
}

// Accessibility-friendly reduced motion variants
export const reducedMotionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
}

// Animation duration constants
export const DURATION = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.6,
  verySlow: 1.0
} as const

// Easing constants
export const EASING = {
  easeOut: "easeOut",
  easeIn: "easeIn", 
  easeInOut: "easeInOut",
  circOut: "circOut",
  backOut: "backOut"
} as const