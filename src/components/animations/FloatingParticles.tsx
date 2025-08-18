'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  color: string
  duration: number
  delay: number
  type: 'dot' | 'ring' | 'star' | 'triangle'
  opacity: number
  blur: number
}

export function FloatingParticles() {
  const [particles, setParticles] = useState<Particle[]>([])
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })

  useEffect(() => {
    const colors = [
      '#4ADE80', // green
      '#FCD34D', // yellow
      '#FB923C', // orange
      '#60A5FA', // blue
      '#A78BFA', // purple
      '#F472B6', // pink
    ]
    const types: Array<'dot' | 'ring' | 'star' | 'triangle'> = ['dot', 'ring', 'star', 'triangle']
    
    const newParticles = Array.from({ length: 35 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: Math.random() * 25 + 15,
      delay: Math.random() * 8,
      type: types[Math.floor(Math.random() * types.length)],
      opacity: Math.random() * 0.6 + 0.2,
      blur: Math.random() * 3 + 1,
    }))
    setParticles(newParticles)
    
    // Mouse tracking for particle interaction
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])
  
  const getParticleShape = (particle: Particle) => {
    const baseStyle = {
      width: particle.size,
      height: particle.size,
      filter: `blur(${particle.blur}px)`,
    }
    
    switch (particle.type) {
      case 'ring':
        return {
          ...baseStyle,
          border: `1px solid ${particle.color}`,
          borderRadius: '50%',
          background: 'transparent',
        }
      case 'star':
        return {
          ...baseStyle,
          background: particle.color,
          clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
        }
      case 'triangle':
        return {
          ...baseStyle,
          background: particle.color,
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
        }
      default: // dot
        return {
          ...baseStyle,
          background: `radial-gradient(circle, ${particle.color} 0%, transparent 70%)`,
          borderRadius: '50%',
        }
    }
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => {
        // Calculate distance from mouse for interaction effect
        const distanceFromMouse = Math.sqrt(
          Math.pow(particle.x - mousePosition.x, 2) + 
          Math.pow(particle.y - mousePosition.y, 2)
        )
        const interactionRadius = 20
        const isNearMouse = distanceFromMouse < interactionRadius
        const pushFactor = isNearMouse ? (interactionRadius - distanceFromMouse) / interactionRadius : 0
        
        return (
          <motion.div
            key={particle.id}
            className="absolute"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              ...getParticleShape(particle),
            }}
            animate={{
              y: [
                0, 
                -40 - (particle.size * 2), 
                -20, 
                -60 - (particle.size * 3), 
                0
              ],
              x: [
                0, 
                (particle.id % 2 === 0 ? 1 : -1) * (20 + particle.size),
                (particle.id % 2 === 0 ? -1 : 1) * (15 + particle.size),
                (particle.id % 2 === 0 ? 1 : -1) * (10 + particle.size),
                0
              ],
              opacity: [
                0, 
                particle.opacity * 0.7, 
                particle.opacity, 
                particle.opacity * 0.8,
                0
              ],
              scale: [
                0.5,
                1 + (isNearMouse ? pushFactor * 0.5 : 0),
                0.8,
                1.2 + (isNearMouse ? pushFactor * 0.3 : 0),
                0.5
              ],
              rotate: [
                0,
                particle.id % 3 === 0 ? 180 : -180,
                particle.id % 3 === 1 ? 360 : -360,
                particle.id % 3 === 2 ? 540 : -540,
                particle.id % 2 === 0 ? 720 : -720
              ],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
              times: [0, 0.2, 0.5, 0.8, 1],
            }}
          />
        )
      })}
      
      {/* Additional ambient particles that react to mouse */}
      {Array.from({ length: 8 }, (_, i) => (
        <motion.div
          key={`ambient-${i}`}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: `${(mousePosition.x + (i * 12) - 48) % 100}%`,
            top: `${(mousePosition.y + (i * 8) - 32) % 100}%`,
            background: `rgba(74, 222, 128, ${0.3 + (i * 0.1)})`,
            filter: 'blur(1px)',
          }}
          animate={{
            scale: [0.5, 1.5, 0.5],
            opacity: [0.2, 0.8, 0.2],
            x: [0, Math.sin(i) * 20, 0],
            y: [0, Math.cos(i) * 20, 0],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}