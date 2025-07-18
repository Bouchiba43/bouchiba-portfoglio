'use client'

import { motion } from 'framer-motion'
import { ChevronDownIcon, DownloadIcon, MapPinIcon, BriefcaseIcon } from 'lucide-react'
import Scene from '../3d/Scene'
import Image from 'next/image'
import ParticleSystem from '../ui/ParticleSystem'
import { MorphingShapeGroup } from '../ui/MorphingShapes'
import { EnergyButton, GlassCard } from '../ui/InteractiveHover'
import { SectionTransition } from '../ui/PageTransition'

export default function Hero() {
  const scrollToAbout = () => {
    const aboutSection = document.querySelector('#about')
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const scrollToProjects = () => {
    const projectsSection = document.querySelector('#projects')
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const downloadResume = async () => {
    try {
      const checkResponse = await fetch('/api/resume/check')
      const checkData = await checkResponse.json()

      if (!checkData.exists) {
        alert('Resume is not available for download at the moment.')
        return
      }

      window.open('/api/resume/download', '_blank')
    } catch (error) {
      console.error('Download error:', error)
      alert('Failed to download resume. Please try again later.')
    }
  }

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-30 pb-16">
      {/* Enhanced 3D Background */}
      <div className="absolute inset-0 z-0">
        <Scene />
      </div>

      {/* Advanced Particle System */}
      <ParticleSystem
        theme="devops"
        density={60}
        interactive={true}
        showConnections={true}
      />

      {/* Morphing Shapes Background */}
      <MorphingShapeGroup count={6} className="absolute inset-0 z-5 opacity-20" />

      {/* Professional gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/50 to-black/70 z-10" />

      {/* Status Badge - Top Right */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="absolute top-4 right-4 md:top-8 md:right-8 z-30"
      >
        <div className="glass-card px-3 py-2 md:px-4 md:py-3 flex items-center gap-2">
          <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-400 font-mono text-xs md:text-sm">Available</span>
        </div>
      </motion.div>

      {/* Kubernetes Badge - Top Left */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="absolute top-4 left-16 md:top-8 md:left-8 z-30"
      >
        <div className="glass-card px-3 py-2 md:px-4 md:py-3 flex items-center gap-2 md:gap-3">
          <Image 
            src="/uploads/k8s-log.svg" 
            alt="Kubernetes Logo" 
            width={20} 
            height={20} 
            className="w-5 h-5 md:w-6 md:h-6"
          />
          <span className="text-blue-400 font-mono text-xs md:text-sm hidden sm:block">in a serious relationship with kubernetes</span>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-20 text-center px-4 max-w-6xl mx-auto py-20 md:py-0">
        {/* Professional Avatar */}
        <SectionTransition delay={0.3} direction="up">
          <div className="mb-6 md:mb-8">
            <div className="relative mx-auto w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48">
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 p-1"
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <div className="w-full h-full rounded-full bg-gray-900"></div>
              </motion.div>

              <motion.div
                animate={{
                  y: [0, -6, 0],
                  rotateY: [0, 3, 0, -3, 0]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-1 rounded-full overflow-hidden border-2 border-gray-800"
              >
                <Image
                  src="/uploads/ahmed-avatar.png"
                  alt="Ahmed Seddik Bouchiba- DevOps Engineer"
                  width={192}
                  height={192}
                  className="w-full h-full object-cover"
                  priority
                />
              </motion.div>

              <motion.div
                className="absolute bottom-1 right-1 md:bottom-2 md:right-2 w-6 h-6 md:w-8 md:h-8 bg-green-500 rounded-full border-2 md:border-3 border-gray-900 flex items-center justify-center"
                animate={{
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    '0 0 0 0px rgba(34, 197, 94, 0.7)',
                    '0 0 0 10px rgba(34, 197, 94, 0)',
                    '0 0 0 0px rgba(34, 197, 94, 0)'
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="w-3 h-3 md:w-4 md:h-4 bg-green-400 rounded-full"></div>
              </motion.div>
            </div>
          </div>
        </SectionTransition>

        {/* Enhanced Info Card */}
        <SectionTransition delay={0.5} direction="up">
          <GlassCard className="p-6 md:p-8 lg:p-12 max-w-5xl mx-auto shadow-2xl">
            {/* Professional Header */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="mb-4 md:mb-6"
            >
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 mb-4 text-xs md:text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <MapPinIcon size={16} />
                  <span>Sousse, Tunisia</span>
                </div>
                <div className="flex items-center gap-2">
                  <BriefcaseIcon size={16} />
                  <span>3+ Years Experience</span>
                </div>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="text-3xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight"
            >
              <span className="section-title">Ahmed Seddik Bouchiba</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="mb-6 md:mb-8"
            >
              <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-white mb-3 md:mb-4">
                Passionate DevOps Engineer
              </h2>
              <p className="text-base md:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Specializing in cloud infrastructure, container orchestration, and CI/CD automation.
                Building scalable, reliable systems that power modern applications.
              </p>
            </motion.div>

            {/* Enhanced Terminal Output */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.4 }}
              className="bg-black/90 border border-green-500/30 rounded-lg p-4 md:p-6 mb-6 md:mb-8 font-mono text-left max-w-2xl mx-auto overflow-x-auto backdrop-blur-sm"
            >
              <div className="text-green-400 text-xs md:text-sm space-y-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1, delay: 1.6 }}
                >
                  <span className="text-gray-500">$</span> kubectl get engineer --show-labels
                </motion.div>
                <div className="pl-2 text-gray-300">
                  NAME&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;READY&nbsp;&nbsp;&nbsp;STATUS&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;LABELS
                </div>
                <motion.div
                  className="pl-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.8 }}
                >
                  ahmed&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1/1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Running&nbsp;&nbsp;&nbsp;
                  <span className="text-blue-400">k8s=expert,aws=proficient</span>
                </motion.div>
              </div>
            </motion.div>

            {/* Enhanced CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <EnergyButton
                onClick={scrollToProjects}
                variant="primary"
                className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 flex items-center justify-center rounded-xl border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
               >
                <span className="font-semibold">Explore Projects</span>
              </EnergyButton>

              <EnergyButton
                onClick={downloadResume}
                variant="secondary"
                className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 flex items-center justify-center rounded-xl border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <div className="flex items-center">
                  <DownloadIcon size={20} className="mr-2" />
                  <span className="font-semibold text-sm md:text-base">Download Resume</span>
                </div>
              </EnergyButton>


            </motion.div>
          </GlassCard>
        </SectionTransition>
      </div>

      {/* Enhanced Scroll indicator */}
      <SectionTransition delay={2} direction="up">
        <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <GlassCard glowColor="#ffffff">
            <motion.button
              onClick={scrollToAbout}
              className="p-3 rounded-full group transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <ChevronDownIcon className="w-6 h-6 text-white" />
              </motion.div>
            </motion.button>
          </GlassCard>
        </div>
      </SectionTransition>
    </section>
  )
}