'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Image from 'next/image'

export function LogoAnimation() {
  const [mounted, setMounted] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div 
      className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 mx-auto mb-8 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3D Container with enhanced perspective */}
      <div className="preserve-3d perspective-1000 relative">
        {/* Enhanced Main Logo with 3D depth */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ scale: 0, rotateY: -180, z: -100 }}
          animate={{ 
            scale: 1, 
            rotateY: 0,
            z: 0,
          }}
          transition={{
            duration: 1.5,
            ease: "easeOut",
            type: "spring",
            stiffness: 80,
            damping: 12
          }}
          whileHover={{
            rotateY: 25,
            rotateX: -20,
            scale: 1.1,
            z: 50,
            transition: { duration: 0.4 }
          }}
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {/* Logo with enhanced 3D effects */}
          <motion.div
            className="relative w-full h-full"
            initial={{ opacity: 0, z: -50 }}
            animate={{ opacity: 1, z: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Shadow/depth layer */}
            <motion.div
              className="absolute inset-0 translate-x-2 translate-y-2 opacity-30"
              style={{ transform: "translateZ(-20px)" }}
              animate={{
                rotateY: isHovered ? 5 : 0,
                rotateX: isHovered ? -5 : 0,
              }}
              transition={{ duration: 0.4 }}
            >
              <Image
                src="/workfusionlogo.png"
                alt="Logo Shadow"
                width={192}
                height={192}
                className="w-full h-full object-contain blur-sm"
                priority
                unoptimized
              />
            </motion.div>
            
            {/* Main logo */}
            <motion.div 
              className="relative z-10"
              style={{ transform: "translateZ(0px)" }}
              animate={{
                rotateY: isHovered ? -2 : 0,
                rotateX: isHovered ? 2 : 0,
              }}
              transition={{ duration: 0.4 }}
            >
              <Image
                src="/workfusionlogo.png"
                alt="Workfusion Logo"
                width={192}
                height={192}
                className="w-full h-full object-contain drop-shadow-2xl filter brightness-110"
                priority
                unoptimized
              />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Enhanced Orbiting Elements with 3D rings */}
        <motion.div
          className="absolute inset-0"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: isHovered ? 15 : 25,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* First orbital ring */}
          {[0, 120, 240].map((rotation, index) => (
            <motion.div
              key={`ring1-${index}`}
              className="absolute w-3 h-3 rounded-full"
              style={{
                top: "50%",
                left: "50%",
                transform: `rotate(${rotation}deg) translateX(80px) translateY(-50%) rotateX(20deg)`,
                background: "linear-gradient(45deg, #4ADE80, #FCD34D)",
                boxShadow: "0 0 15px rgba(74, 222, 128, 0.7)"
              }}
              animate={{
                scale: [1, 1.8, 1],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: index * 0.4,
              }}
            />
          ))}
        </motion.div>
        
        {/* Second orbital ring - counter rotation */}
        <motion.div
          className="absolute inset-0"
          animate={{
            rotate: -360,
          }}
          transition={{
            duration: isHovered ? 18 : 30,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {[60, 180, 300].map((rotation, index) => (
            <motion.div
              key={`ring2-${index}`}
              className="absolute w-2 h-2 rounded-full"
              style={{
                top: "50%",
                left: "50%",
                transform: `rotate(${rotation}deg) translateX(100px) translateY(-50%) rotateX(-15deg)`,
                background: "linear-gradient(45deg, #FB923C, #FCD34D)",
                boxShadow: "0 0 10px rgba(251, 146, 60, 0.6)"
              }}
              animate={{
                scale: [0.8, 1.3, 0.8],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: index * 0.5,
              }}
            />
          ))}
        </motion.div>

        {/* Enhanced Pulse Effect with 3D depth */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: "linear-gradient(135deg, rgba(74, 222, 128, 0.3), rgba(252, 211, 77, 0.2), rgba(251, 146, 60, 0.3))",
            transform: "translateZ(-10px)"
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 0, 0.4],
            rotateX: [0, 5, 0],
            rotateY: [0, -5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Enhanced Multi-layer Glow Effect */}
        <motion.div
          className="absolute inset-0 -z-10"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-full h-full bg-gradient-primary rounded-2xl blur-3xl opacity-60" />
        </motion.div>
        
        {/* Secondary glow layer */}
        <motion.div
          className="absolute inset-0 -z-20"
          animate={{
            scale: [1.2, 1.4, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          <div className="w-full h-full bg-gradient-to-r from-primary-green via-primary-yellow to-primary-orange rounded-full blur-[40px] opacity-30" />
        </motion.div>
      </div>
    </div>
  )
}