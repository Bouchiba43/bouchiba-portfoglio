'use client'

import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'
import { useSpring, animated } from '@react-spring/web'

interface MorphingShapeProps {
  size?: number
  color?: string
  duration?: number
  delay?: number
  interactive?: boolean
  position?: 'fixed' | 'relative' | 'absolute'
  className?: string
}

const shapeVariants = {
  circle: {
    borderRadius: '50%',
    rotate: 0,
    scale: 1,
  },
  square: {
    borderRadius: '0%',
    rotate: 45,
    scale: 0.8,
  },
  diamond: {
    borderRadius: '0%',
    rotate: 45,
    scale: 1.2,
  },
  hexagon: {
    borderRadius: '20%',
    rotate: 60,
    scale: 0.9,
  },
  star: {
    borderRadius: '30%',
    rotate: 0,
    scale: 1.1,
  }
}

export default function MorphingShapes({ 
  size = 100, 
  color = '#3b82f6', 
  duration = 3,
  delay = 0,
  interactive = true,
  position = 'relative',
  className = ''
}: MorphingShapeProps) {
  const [currentShape, setCurrentShape] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const controls = useAnimation()
  const shapeRef = useRef<HTMLDivElement>(null)
  
  const shapes = Object.keys(shapeVariants)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-100, 100], [30, -30])
  const rotateY = useTransform(x, [-100, 100], [-30, 30])

  // Spring animation for smooth morphing
  const springProps = useSpring({
    transform: `scale(${isHovered ? 1.2 : 1}) rotate(${currentShape * 72}deg)`,
    config: { tension: 300, friction: 30 }
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentShape((prev) => (prev + 1) % shapes.length)
    }, duration * 1000)

    return () => clearInterval(interval)
  }, [duration, shapes.length])

  useEffect(() => {
    const currentShapeKey = shapes[currentShape] as keyof typeof shapeVariants
    controls.start(shapeVariants[currentShapeKey])
  }, [currentShape, controls, shapes])

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!interactive || !shapeRef.current) return
    
    const rect = shapeRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    x.set(event.clientX - centerX)
    y.set(event.clientY - centerY)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
  }

  return (
    <div 
      className={`${className}`}
      style={{ position }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        ref={shapeRef}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay, duration: 0.5 }}
        className="relative"
        style={{
          width: size,
          height: size,
          perspective: 1000,
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Main morphing shape */}
        <motion.div
          animate={controls}
          transition={{
            duration: 2,
            ease: "easeInOut",
            type: "spring",
            stiffness: 100,
            damping: 15
          }}
          style={{
            width: '100%',
            height: '100%',
            background: `linear-gradient(135deg, ${color}, ${color}88)`,
            boxShadow: `0 0 30px ${color}50`,
            rotateX,
            rotateY,
          }}
          className="absolute inset-0 backdrop-blur-sm"
        />

        {/* Animated inner core */}
        <animated.div
          style={{
            ...springProps,
            width: '60%',
            height: '60%',
            background: `radial-gradient(circle, ${color}ff, transparent)`,
            borderRadius: '50%',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            filter: 'blur(2px)',
            opacity: isHovered ? 0.8 : 0.4,
          }}
        />

        {/* Particle trails */}
        {isHovered && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: [0, (Math.cos(i * 45 * Math.PI / 180) * 50)],
                  y: [0, (Math.sin(i * 45 * Math.PI / 180) * 50)]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.1
                }}
                className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full"
                style={{
                  backgroundColor: color,
                  transform: 'translate(-50%, -50%)',
                  boxShadow: `0 0 10px ${color}`
                }}
              />
            ))}
          </div>
        )}

        {/* Glow effect */}
        <motion.div
          animate={{
            scale: isHovered ? 1.5 : 1,
            opacity: isHovered ? 0.3 : 0.1
          }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${color}40, transparent 70%)`,
            filter: 'blur(10px)',
          }}
        />
      </motion.div>
    </div>
  )
}

// Group component for multiple morphing shapes
export function MorphingShapeGroup({ count = 5, className = '' }: { count?: number, className?: string }) {
  const colors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444']
  
  return (
    <div className={`relative ${className}`}>
      {[...Array(count)].map((_, i) => (
        <MorphingShapes
          key={i}
          size={60 + i * 20}
          color={colors[i % colors.length]}
          duration={3 + i}
          delay={i * 0.5}
          position="absolute"
          className={`
            ${i === 0 ? 'top-10 left-10' : ''}
            ${i === 1 ? 'top-20 right-20' : ''}
            ${i === 2 ? 'bottom-32 left-16' : ''}
            ${i === 3 ? 'bottom-16 right-32' : ''}
            ${i === 4 ? 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' : ''}
          `}
        />
      ))}
    </div>
  )
}