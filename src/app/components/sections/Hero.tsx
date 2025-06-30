'use client'

import { motion } from 'framer-motion'
import { ChevronDownIcon, DownloadIcon } from 'lucide-react'
import Scene from '../3d/Scene'

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
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Scene />
      </div>
      
      {/* Terminal-style overlay */}
      <div className="absolute inset-0 bg-black/30 z-10" />
      
      {/* Content */}
      <div className="relative z-20 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="bg-gray-900/80 backdrop-blur-sm border border-green-500/30 rounded-lg p-8 font-mono max-w-4xl mx-auto"
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