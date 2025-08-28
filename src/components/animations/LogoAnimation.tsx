'use client'

import Image from 'next/image'

export function LogoAnimation() {
  return (
    <div className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 mx-auto mb-8 group">
      {/* Static 3D Logo Container */}
      <div className="relative w-full h-full preserve-3d perspective-1000">
        
        {/* Background Shadow for 3D depth */}
        <div 
          className="absolute inset-0 translate-x-3 translate-y-3 opacity-20 blur-sm"
          style={{
            transform: 'translateZ(-30px) rotateX(15deg) rotateY(-15deg)',
            filter: 'blur(2px) brightness(0.3)'
          }}
        >
          <Image
            src="/workfusionlogo.png"
            alt="Logo Shadow"
            width={192}
            height={192}
            className="w-full h-full object-contain"
            priority
          />
        </div>
        
        {/* Middle Shadow Layer for more depth */}
        <div 
          className="absolute inset-0 translate-x-1.5 translate-y-1.5 opacity-40"
          style={{
            transform: 'translateZ(-15px) rotateX(8deg) rotateY(-8deg)',
            filter: 'blur(1px) brightness(0.6)'
          }}
        >
          <Image
            src="/workfusionlogo.png"
            alt="Logo Middle Shadow"
            width={192}
            height={192}
            className="w-full h-full object-contain"
            priority
          />
        </div>
        
        {/* Main Logo with 3D Transform */}
        <div 
          className="relative z-10 transition-transform duration-300 group-hover:scale-105"
          style={{
            transform: 'translateZ(0px) rotateX(5deg) rotateY(-5deg)',
            filter: 'drop-shadow(0 10px 25px rgba(37, 99, 235, 0.3)) brightness(1.1)'
          }}
        >
          <Image
            src="/workfusionlogo.png"
            alt="Workfusion Logo"
            width={192}
            height={192}
            className="w-full h-full object-contain"
            priority
          />
        </div>
        
        {/* Static glow effect */}
        <div 
          className="absolute inset-0 -z-10 rounded-2xl opacity-60"
          style={{
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.4), rgba(16, 185, 129, 0.4))',
            transform: 'translateZ(-20px)',
            filter: 'blur(20px)'
          }}
        />
        
        {/* Outer glow */}
        <div 
          className="absolute inset-0 -z-20 rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(37, 99, 235, 0.3), rgba(16, 185, 129, 0.3), transparent)',
            transform: 'translateZ(-40px) scale(1.3)',
            filter: 'blur(30px)'
          }}
        />
        
        {/* Subtle highlight on hover */}
        <div 
          className="absolute inset-0 z-20 opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))',
            transform: 'translateZ(5px)'
          }}
        />
        
      </div>
    </div>
  )
}