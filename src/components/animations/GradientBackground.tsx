'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export function GradientBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="absolute inset-0 -z-20 overflow-hidden">
      {/* Enhanced Main gradient mesh with mouse interaction */}
      <motion.div 
        className="absolute inset-0 mesh-gradient"
        animate={{
          background: [
            `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, #4ADE80 0%, transparent 50%),
             radial-gradient(circle at 80% 20%, #FCD34D 0%, transparent 50%),
             radial-gradient(circle at 40% 40%, #FB923C 0%, transparent 50%),
             #0A0A0A`,
            `radial-gradient(circle at ${mousePosition.x + 10}% ${mousePosition.y + 10}%, #4ADE80 0%, transparent 50%),
             radial-gradient(circle at 70% 30%, #FCD34D 0%, transparent 50%),
             radial-gradient(circle at 30% 50%, #FB923C 0%, transparent 50%),
             #0A0A0A`
          ]
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />
      
      {/* Enhanced floating gradient orbs with depth */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(74, 222, 128, 0.25) 0%, rgba(74, 222, 128, 0.1) 40%, transparent 70%)",
          filter: "blur(40px)"
        }}
        animate={{
          x: [0, 150, -50, 0],
          y: [0, -120, 80, 0],
          scale: [1, 1.3, 0.9, 1],
          rotate: [0, 90, 180, 360],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(252, 211, 77, 0.3) 0%, rgba(252, 211, 77, 0.15) 35%, transparent 65%)",
          filter: "blur(35px)"
        }}
        animate={{
          x: [0, -120, 60, 0],
          y: [0, 100, -40, 0],
          scale: [1, 1.4, 0.8, 1],
          rotate: [0, -120, -240, -360],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute top-3/4 left-1/2 w-80 h-80 rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(251, 146, 60, 0.28) 0%, rgba(251, 146, 60, 0.12) 40%, transparent 70%)",
          filter: "blur(30px)"
        }}
        animate={{
          x: [0, 80, -80, 0],
          y: [0, -80, 80, 0],
          scale: [1, 1.2, 1.4, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Additional smaller orbs for more depth */}
      <motion.div
        className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full blur-2xl"
        style={{
          background: "radial-gradient(circle, rgba(74, 222, 128, 0.15) 0%, transparent 60%)",
          filter: "blur(25px)"
        }}
        animate={{
          x: [0, -60, 60, 0],
          y: [0, 60, -60, 0],
          scale: [0.8, 1.1, 0.9, 0.8],
          opacity: [0.3, 0.6, 0.4, 0.3],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
      
      <motion.div
        className="absolute bottom-1/3 left-2/3 w-48 h-48 rounded-full blur-2xl"
        style={{
          background: "radial-gradient(circle, rgba(252, 211, 77, 0.18) 0%, transparent 55%)",
          filter: "blur(20px)"
        }}
        animate={{
          x: [0, 40, -40, 0],
          y: [0, -40, 40, 0],
          scale: [0.9, 1.2, 0.8, 0.9],
          opacity: [0.4, 0.7, 0.3, 0.4],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
      />

      {/* Enhanced animated grid overlay */}
      <motion.div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(rgba(74, 222, 128, 0.15) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(74, 222, 128, 0.15) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
          opacity: [0.08, 0.15, 0.08],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      
      {/* Subtle noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  )
}