'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Image from 'next/image'

export function LogoAnimation() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 mx-auto mb-8">
      {/* 3D Container */}
      <div className="preserve-3d perspective-1000">
        {/* Main Logo */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ scale: 0, rotateY: -180 }}
          animate={{ 
            scale: 1, 
            rotateY: 0,
          }}
          transition={{
            duration: 1.2,
            ease: "easeOut",
            type: "spring",
            stiffness: 100,
          }}
          whileHover={{
            rotateY: 15,
            rotateX: -15,
            scale: 1.05,
          }}
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          <motion.div
            className="relative w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Image
              src="/workfusionlogo.png"
              alt="Workfusion Logo"
              width={192}
              height={192}
              className="w-full h-full object-contain drop-shadow-2xl"
              priority
              unoptimized
            />
          </motion.div>
        </motion.div>

        {/* Orbiting Elements */}
        <motion.div
          className="absolute inset-0"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {/* Orbital dots */}
          {[0, 120, 240].map((rotation, index) => (
            <motion.div
              key={index}
              className="absolute w-3 h-3 bg-primary-yellow rounded-full"
              style={{
                top: "50%",
                left: "50%",
                transform: `rotate(${rotation}deg) translateX(80px) translateY(-50%)`,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.3,
              }}
            />
          ))}
        </motion.div>

        {/* Pulse Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-primary rounded-2xl opacity-30"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Glow Effect */}
        <motion.div
          className="absolute inset-0 -z-10"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-full h-full bg-gradient-primary rounded-2xl blur-3xl opacity-50" />
        </motion.div>
      </div>
    </div>
  )
}