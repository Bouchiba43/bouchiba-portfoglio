'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ReactNode, useRef, useState } from 'react'
import { useSpring as useReactSpring, animated } from '@react-spring/web'

interface InteractiveHoverProps {
  children: ReactNode
  className?: string
  hoverScale?: number
  hoverRotate?: number
  glowColor?: string
  particleCount?: number
  magnetStrength?: number
  enabled?: boolean
}

export default function InteractiveHover({
  children,
  className = '',
  hoverScale = 1.05,
  hoverRotate = 2,
  glowColor = '#3b82f6',
  particleCount = 6,
  magnetStrength = 0.2,
  enabled = true
}: InteractiveHoverProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-100, 100], [hoverRotate, -hoverRotate])
  const rotateY = useTransform(x, [-100, 100], [-hoverRotate, hoverRotate])
  
  const springX = useSpring(x, { stiffness: 400, damping: 30 })
  const springY = useSpring(y, { stiffness: 400, damping: 30 })

  // React Spring for smooth background effects
  const springProps = useReactSpring({
    scale: isHovered ? hoverScale : 1,
    boxShadow: isHovered 
      ? `0 20px 40px ${glowColor}30, 0 0 0 1px ${glowColor}20`
      : `0 2px 10px rgba(0,0,0,0.1), 0 0 0 1px transparent`,
    config: { tension: 300, friction: 30 }
  })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!enabled || !ref.current) return
    
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const mouseX = e.clientX - centerX
    const mouseY = e.clientY - centerY
    
    setMousePosition({ x: mouseX, y: mouseY })
    x.set(mouseX * magnetStrength)
    y.set(mouseY * magnetStrength)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setMousePosition({ x: 0, y: 0 })
    x.set(0)
    y.set(0)
  }

  return (
    <animated.div
      ref={ref}
      style={springProps}
      className={`relative cursor-pointer ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          x: springX,
          y: springY,
        }}
        className="relative z-10"
      >
        {children}
      </motion.div>

      {/* Magnetic particles */}
      {enabled && isHovered && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(particleCount)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                backgroundColor: glowColor,
                boxShadow: `0 0 6px ${glowColor}`,
              }}
              animate={{
                x: mousePosition.x * 0.1 + Math.cos(i * 60 * Math.PI / 180) * 20,
                y: mousePosition.y * 0.1 + Math.sin(i * 60 * Math.PI / 180) * 20,
                scale: [0, 1, 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeInOut"
              }}
              initial={{
                x: '50%',
                y: '50%',
                scale: 0,
                opacity: 0
              }}
            />
          ))}
        </div>
      )}

      {/* Ripple effect */}
      {enabled && isHovered && (
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x + 50}% ${mousePosition.y + 50}%, ${glowColor}20, transparent 70%)`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.1, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </animated.div>
  )
}

// Card hover effect with glass morphism
export function GlassCard({
  children,
  className = '',
  glowColor = '#3b82f6'
}: {
  children: ReactNode
  className?: string
  glowColor?: string
}) {
  return (
    <InteractiveHover
      className={`glass-card-strong ${className}`}
      hoverScale={1.02}
      hoverRotate={1}
      glowColor={glowColor}
      particleCount={4}
      magnetStrength={0.1}
    >
      {children}
    </InteractiveHover>
  )
}

// Button hover effect with energy pulse
export function EnergyButton({
  children,
  onClick,
  className = '',
  variant = 'primary'
}: {
  children: ReactNode
  onClick?: () => void
  className?: string
  variant?: 'primary' | 'secondary' | 'ghost'
}) {
  const [isClicked, setIsClicked] = useState(false)
  
  const baseStyles = {
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white',
    secondary: 'bg-gradient-to-r from-green-600 to-teal-600 text-white',
    ghost: 'bg-transparent border-2 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white'
  }

  const handleClick = () => {
    setIsClicked(true)
    setTimeout(() => setIsClicked(false), 300)
    onClick?.()
  }

  return (
    <InteractiveHover
      className={`relative px-6 py-3 rounded-lg font-medium transition-all duration-300 ${baseStyles[variant]} ${className}`}
      hoverScale={1.05}
      hoverRotate={1}
      glowColor={variant === 'secondary' ? '#10b981' : '#3b82f6'}
      particleCount={8}
      magnetStrength={0.15}
    >
      <button onClick={handleClick} className="w-full h-full">
        {children}
        
        {/* Click ripple effect */}
        {isClicked && (
          <motion.div
            className="absolute inset-0 rounded-lg"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)'
            }}
            animate={{
              scale: [0, 2],
              opacity: [0.6, 0]
            }}
            transition={{ duration: 0.3 }}
          />
        )}
      </button>
    </InteractiveHover>
  )
}

// Skill card with morphing background
export function SkillCard({
  children,
  className = '',
  skillColor = '#3b82f6'
}: {
  children: ReactNode
  className?: string
  skillColor?: string
}) {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <InteractiveHover
        className="h-full"
        hoverScale={1.03}
        hoverRotate={2}
        glowColor={skillColor}
        particleCount={6}
        magnetStrength={0.12}
      >
        {children}
        
        {/* Morphing background */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            background: isHovered
              ? `linear-gradient(45deg, ${skillColor}10, ${skillColor}20, ${skillColor}10)`
              : `linear-gradient(45deg, transparent, transparent, transparent)`,
            borderRadius: isHovered ? '16px' : '12px'
          }}
          transition={{ duration: 0.5 }}
        />
      </InteractiveHover>
    </div>
  )
}

// Project card with advanced hover effects
export function ProjectCard({
  children,
  className = '',
  imageUrl,
}: {
  children: ReactNode
  className?: string
  imageUrl?: string
  title?: string
}) {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <div 
      className={`relative overflow-hidden group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <InteractiveHover
        className="h-full"
        hoverScale={1.02}
        hoverRotate={1}
        glowColor="#3b82f6"
        particleCount={8}
        magnetStrength={0.08}
      >
        {children}
        
        {/* Parallax image effect */}
        {imageUrl && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              scale: isHovered ? 1.1 : 1,
              filter: isHovered ? 'blur(2px)' : 'blur(0px)'
            }}
            transition={{ duration: 0.6 }}
          />
        )}
        
        {/* Gradient overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            background: isHovered
              ? 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(16,185,129,0.1))'
              : 'transparent'
          }}
          transition={{ duration: 0.4 }}
        />
      </InteractiveHover>
    </div>
  )
}