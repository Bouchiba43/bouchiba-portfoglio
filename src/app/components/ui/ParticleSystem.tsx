'use client'

import { useMemo, useEffect } from 'react'
import Particles from '@tsparticles/react'
import { loadBasic } from '@tsparticles/basic'
import { loadColorUpdater } from '@tsparticles/updater-color'
import { loadOpacityUpdater } from '@tsparticles/updater-opacity'
import { loadSizeUpdater } from '@tsparticles/updater-size'
import { loadOutModesUpdater } from '@tsparticles/updater-out-modes'
import { loadBaseMover } from '@tsparticles/move-base'
import { loadCircleShape } from '@tsparticles/shape-circle'
import { loadParticlesLinksInteraction } from '@tsparticles/interaction-particles-links'
import { tsParticles } from '@tsparticles/engine'
import type { ISourceOptions, Container } from '@tsparticles/engine'

interface ParticleSystemProps {
  theme?: 'default' | 'devops' | 'matrix' | 'cyber'
  density?: number
  interactive?: boolean
  showConnections?: boolean
  particlesLoaded?: (container?: Container) => Promise<void>
}

export default function ParticleSystem({ 
  theme = 'devops', 
  density = 50,
  interactive = true,
  showConnections = true,
  particlesLoaded
}: ParticleSystemProps) {
  // Initialize the engine once
  useEffect(() => {
    const initParticles = async () => {
      await loadBasic(tsParticles)
      await loadColorUpdater(tsParticles)
      await loadOpacityUpdater(tsParticles)
      await loadSizeUpdater(tsParticles)
      await loadOutModesUpdater(tsParticles)
      await loadBaseMover(tsParticles)
      await loadCircleShape(tsParticles)
      if (showConnections) {
        await loadParticlesLinksInteraction(tsParticles)
      }
    }
    
    initParticles()
  }, [showConnections])

  const particlesConfig = useMemo((): ISourceOptions => {
    const baseConfig: ISourceOptions = {
      background: {
        color: {
          value: "transparent",
        },
      },
      fpsLimit: 120,
      interactivity: {
        events: {
          onClick: {
            enable: interactive,
            mode: "push",
          },
          onHover: {
            enable: interactive,
            mode: "grab",
          },
          resize: {
            enable: true,
          },
        },
        modes: {
          push: {
            quantity: 4,
          },
          grab: {
            distance: 150,
            links: {
              opacity: 1
            }
          }
        },
      },
      particles: {
        color: {
          value: theme === 'devops' ? ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b"] : 
                theme === 'matrix' ? ["#00ff00", "#008000"] :
                theme === 'cyber' ? ["#00ffff", "#ff00ff", "#ffff00"] : "#ffffff",
        },
        links: {
          color: theme === 'devops' ? "#3b82f6" : 
                theme === 'matrix' ? "#00ff00" :
                theme === 'cyber' ? "#00ffff" : "#ffffff",
          distance: 150,
          enable: showConnections,
          opacity: 0.3,
          width: 1,
        },
        move: {
          direction: (theme === 'matrix' ? "bottom" : "none") as "bottom" | "none",
          enable: true,
          outModes: {
            default: "bounce",
          },
          random: false,
          speed: theme === 'matrix' ? 2 : theme === 'cyber' ? 3 : 1,
          straight: theme === 'matrix',
        },
        number: {
          density: {
            enable: true,
          },
          value: density,
        },
        opacity: {
          value: 0.5,
          animation: {
            enable: true,
            speed: 1,
            sync: false
          }
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 1, max: 5 },
          animation: {
            enable: true,
            speed: 2,
            sync: false
          }
        },
      },
      detectRetina: true,
    }

    return baseConfig
  }, [theme, density, interactive, showConnections])

  return (
    <div className="absolute inset-0 pointer-events-none">
      <Particles
        id={`particles-${theme}`}
        options={particlesConfig}
        particlesLoaded={particlesLoaded}
        className="absolute inset-0 z-0"
      />
    </div>
  )
}