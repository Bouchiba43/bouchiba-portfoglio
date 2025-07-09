'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ReactNode, createContext, useContext, useState } from 'react'

interface PageTransitionContextType {
  isTransitioning: boolean
  triggerTransition: (callback: () => void) => void
  transitionType: 'fade' | 'slide' | 'scale' | 'rotate' | 'matrix'
  setTransitionType: (type: 'fade' | 'slide' | 'scale' | 'rotate' | 'matrix') => void
}

const PageTransitionContext = createContext<PageTransitionContextType | null>(null)

export const usePageTransition = () => {
  const context = useContext(PageTransitionContext)
  if (!context) {
    throw new Error('usePageTransition must be used within a PageTransitionProvider')
  }
  return context
}

interface PageTransitionProviderProps {
  children: ReactNode
}

export function PageTransitionProvider({ children }: PageTransitionProviderProps) {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionType, setTransitionType] = useState<'fade' | 'slide' | 'scale' | 'rotate' | 'matrix'>('fade')

  const triggerTransition = (callback: () => void) => {
    setIsTransitioning(true)
    setTimeout(() => {
      callback()
      setTimeout(() => setIsTransitioning(false), 300)
    }, 300)
  }

  return (
    <PageTransitionContext.Provider value={{
      isTransitioning,
      triggerTransition,
      transitionType,
      setTransitionType
    }}>
      {children}
    </PageTransitionContext.Provider>
  )
}

interface PageTransitionProps {
  children: ReactNode
  className?: string
}

const transitionVariants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  slide: {
    initial: { x: 100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -100, opacity: 0 }
  },
  scale: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 1.2, opacity: 0 }
  },
  rotate: {
    initial: { rotate: -180, opacity: 0 },
    animate: { rotate: 0, opacity: 1 },
    exit: { rotate: 180, opacity: 0 }
  },
  matrix: {
    initial: { 
      scale: 0,
      rotate: -180,
      filter: 'blur(10px)',
      opacity: 0
    },
    animate: { 
      scale: 1,
      rotate: 0,
      filter: 'blur(0px)',
      opacity: 1
    },
    exit: { 
      scale: 0,
      rotate: 180,
      filter: 'blur(10px)',
      opacity: 0
    }
  }
}

export default function PageTransition({ children, className = '' }: PageTransitionProps) {
  const { transitionType } = usePageTransition()
  const variants = transitionVariants[transitionType]

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={transitionType}
        initial={variants.initial}
        animate={variants.animate}
        exit={variants.exit}
        transition={{
          duration: 0.6,
          ease: [0.23, 1, 0.320, 1]
        }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// Section transition component for smooth scrolling effects
export function SectionTransition({ 
  children, 
  className = '',
  delay = 0,
  direction = 'up'
}: { 
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
}) {
  const directionVariants = {
    up: { y: 60 },
    down: { y: -60 },
    left: { x: 60 },
    right: { x: -60 }
  }

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        ...directionVariants[direction],
        filter: 'blur(10px)'
      }}
      whileInView={{ 
        opacity: 1, 
        x: 0, 
        y: 0,
        filter: 'blur(0px)'
      }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.23, 1, 0.320, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Stagger children animation
export function StaggerContainer({ 
  children, 
  className = '',
  staggerDelay = 0.1
}: { 
  children: ReactNode
  className?: string
  staggerDelay?: number
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ 
  children, 
  className = '',
  direction = 'up'
}: { 
  children: ReactNode
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right'
}) {
  const directionVariants = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 }
  }

  return (
    <motion.div
      variants={{
        hidden: { 
          opacity: 0,
          ...directionVariants[direction],
          filter: 'blur(5px)'
        },
        visible: { 
          opacity: 1,
          x: 0,
          y: 0,
          filter: 'blur(0px)',
          transition: {
            duration: 0.6,
            ease: [0.23, 1, 0.320, 1]
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}