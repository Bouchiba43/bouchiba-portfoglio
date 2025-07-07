'use client'

import { motion } from 'framer-motion'
import { ChevronDownIcon, DownloadIcon } from 'lucide-react'
import Scene from '../3d/Scene'
import Image from 'next/image'
// import ProfessionalScene from '../3d/ProfessionalScene' // Alternative professional version

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
      // Check if resume exists first
      const checkResponse = await fetch('/api/resume/check')
      const checkData = await checkResponse.json()
      
      if (!checkData.exists) {
        alert('Resume is not available for download at the moment.')
        return
      }
      
      // Trigger download
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
        {/* You can swap this with ProfessionalScene for the interactive data visualization version */}
      </div>
      
      {/* Improved gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/60 z-10" />
      
      {/* Kubernetes Logo - Top Left */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="absolute top-8 left-8 z-30"
      >
        <div className="flex items-center gap-3 bg-gray-900/80 backdrop-blur-sm border border-blue-500/30 rounded-lg px-4 py-2">
          <Image 
            src="/uploads/k8s-log.svg" 
            alt="Kubernetes Logo" 
            width={32} 
            height={32} 
            className="w-8 h-8"
          />
          <span className="text-blue-400 font-mono text-sm hidden sm:block">In a serious relationship with Kubernetes</span>
        </div>
      </motion.div>
      
      {/* Content */}
      <div className="relative z-20 text-center px-4">
        {/* Professional Avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: -30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mb-8"
        >
          <div className="relative mx-auto w-32 h-32 md:w-40 md:h-40">
            {/* Glowing ring around avatar */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 p-1 animate-pulse">
              <div className="w-full h-full rounded-full bg-gray-900"></div>
            </div>
            
            {/* Avatar image */}
            <motion.div
              animate={{ 
                y: [0, -8, 0],
                rotateY: [0, 5, 0, -5, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-1 rounded-full overflow-hidden border-2 border-gray-800"
            >
              <Image
                src="/uploads/ahmed-avatar.png"
                alt="Bouchiba Ahmed Seddik - DevOps Engineer"
                width={160}
                height={160}
                className="w-full h-full object-cover"
                priority
              />
            </motion.div>
            
            {/* Status indicator */}
            <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="bg-gray-900/90 backdrop-blur-md border border-green-500/40 rounded-lg p-8 font-mono max-w-4xl mx-auto shadow-2xl"
        >
          <motion.pre
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 1 }}
            className="text-green-400 text-sm mb-4"
          >
{`$ whoami
> Passionate DevOps Engineer
$ kubectl get skills
> Docker, Kubernetes, Terraform, AWS, CI/CD`}
          </motion.pre>
          
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="text-4xl md:text-6xl font-bold text-white mb-4"
          >
            Bouchiba Ahmed Seddik
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 2 }}
            className="text-xl text-gray-300 mb-8"
          >
            Building scalable infrastructure & automating the future
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.5 }}
            className="flex gap-4 justify-center flex-wrap"
          >
            <button 
              onClick={scrollToProjects}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
            >
              View Projects
            </button>
            <button 
              onClick={downloadResume}
              className="border border-green-500 text-green-400 hover:bg-green-500 hover:text-black px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
            >
              <DownloadIcon size={16} />
              Download Resume
            </button>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 3 }}
        onClick={scrollToAbout}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 cursor-pointer"
      >
        <ChevronDownIcon className="w-8 h-8 text-white animate-bounce" />
      </motion.button>
    </section>
  )
}