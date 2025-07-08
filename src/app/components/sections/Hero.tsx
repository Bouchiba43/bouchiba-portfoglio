'use client'

import { motion } from 'framer-motion'
import { ChevronDownIcon, DownloadIcon, MapPinIcon, BriefcaseIcon } from 'lucide-react'
import Scene from '../3d/Scene'
import Image from 'next/image'

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
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Enhanced 3D Background */}
      <div className="absolute inset-0 z-0">
        <Scene />
      </div>
      
      {/* Professional gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/50 to-black/70 z-10" />
      
      {/* Status Badge - Top Right */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="absolute top-8 right-8 z-30"
      >
        <div className="glass-card px-4 py-3 flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-400 font-mono text-sm">Available for opportunities</span>
        </div>
      </motion.div>

      {/* Kubernetes Badge - Top Left */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="absolute top-8 left-8 z-30"
      >
        <div className="glass-card px-4 py-3 flex items-center gap-3">
          <Image 
            src="/uploads/k8s-log.svg" 
            alt="Kubernetes Logo" 
            width={24} 
            height={24} 
            className="w-6 h-6"
          />
          <span className="text-blue-400 font-mono text-sm hidden sm:block">Kubernetes Expert</span>
        </div>
      </motion.div>
      
      {/* Main Content */}
      <div className="relative z-20 text-center px-4 max-w-6xl mx-auto">
        {/* Professional Avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mb-8"
        >
          <div className="relative mx-auto w-40 h-40 md:w-48 md:h-48">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 p-1 animate-pulse-glow">
              <div className="w-full h-full rounded-full bg-gray-900"></div>
            </div>
            
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
                alt="Bouchiba Ahmed Seddik - DevOps Engineer"
                width={192}
                height={192}
                className="w-full h-full object-cover"
                priority
              />
            </motion.div>
            
            <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 rounded-full border-3 border-gray-900 flex items-center justify-center">
              <div className="w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="glass-card-strong p-8 md:p-12 max-w-5xl mx-auto shadow-2xl"
        >
          {/* Professional Header */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mb-6"
          >
            <div className="flex items-center justify-center gap-6 mb-4 text-sm text-gray-400">
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
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            <span className="section-title">Bouchiba Ahmed Seddik</span>
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
              Passionate DevOps Engineer
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Specializing in cloud infrastructure, container orchestration, and CI/CD automation. 
              Building scalable, reliable systems that power modern applications.
            </p>
          </motion.div>

          {/* Terminal Output */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.4 }}
            className="bg-black/80 border border-green-500/30 rounded-lg p-6 mb-8 font-mono text-left max-w-2xl mx-auto"
          >
            <div className="text-green-400 text-sm space-y-2">
              <div><span className="text-gray-500">$</span> kubectl get engineer --show-labels</div>
              <div className="pl-2 text-gray-300">
                NAME&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;READY&nbsp;&nbsp;&nbsp;STATUS&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;LABELS
              </div>
              <div className="pl-2">
                ahmed&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1/1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Running&nbsp;&nbsp;&nbsp;
                <span className="text-blue-400">k8s=expert,aws=proficient</span>
              </div>
            </div>
          </motion.div>
          
          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="flex gap-4 justify-center flex-wrap"
          >
            <button 
              onClick={scrollToProjects}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-lg transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <span className="font-semibold">Explore Projects</span>
            </button>
            <button 
              onClick={downloadResume}
              className="glass-card border-2 border-green-500 text-green-400 hover:bg-green-500 hover:text-black px-8 py-4 rounded-lg transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <DownloadIcon size={20} />
              <span className="font-semibold">Download Resume</span>
            </button>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        onClick={scrollToAbout}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 cursor-pointer group"
      >
        <div className="glass-card p-3 rounded-full group-hover:bg-white/10 transition-colors">
          <ChevronDownIcon className="w-6 h-6 text-white animate-bounce" />
        </div>
      </motion.button>
    </section>
  )
}