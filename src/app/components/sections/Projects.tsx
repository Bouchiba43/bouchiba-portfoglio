'use client'

import { motion } from 'framer-motion'
import { ExternalLinkIcon, GithubIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { useProjects } from '@/app/hooks/useProjects'
import Image from 'next/image'
import { useState } from 'react'

export default function Projects() {
  const { projects, loading } = useProjects()
  const [currentIndex, setCurrentIndex] = useState(0)
  
  // Number of cards to show at once (responsive)
  const cardsPerView = {
    mobile: 1,
    tablet: 2,
    desktop: 3
  }
  
  const maxIndex = Math.max(0, projects.length - cardsPerView.desktop)
  
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }
  
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
  }
  
  const goToSlide = (index: number) => {
    setCurrentIndex(Math.min(index, maxIndex))
  }

  if (loading) {
    return (
      <section id="projects" className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">Loading projects...</div>
        </div>
      </section>
    )
  }

  return (
    <section id="projects" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center text-white mb-12 font-mono"
        >
          $ docker ps --format &quot;table &#123;&#123;.Names&#125;&#125;&quot;
        </motion.h2>
        
        <div className="relative max-w-7xl mx-auto">
          {/* Carousel Container */}
          <div className="relative overflow-hidden">
            <motion.div
              className="flex transition-transform duration-500 ease-in-out"
              animate={{ 
                x: `${-currentIndex * (100 / cardsPerView.desktop)}%` 
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden flex-shrink-0 mx-4"
                  style={{ 
                    width: `calc(${100 / cardsPerView.desktop}% - 32px)`,
                    minWidth: '320px'
                  }}
                >
                  <div className="aspect-video bg-gray-800 relative">
                    <Image
                      src={project.imageUrl}
                      alt={project.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                    <p className="text-gray-300 mb-4">{project.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map(tech => (
                        <span
                          key={tech}
                          className="bg-blue-600 text-white px-2 py-1 rounded text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex gap-4">
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                      >
                        <GithubIcon size={16} />
                        Code
                      </a>
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <ExternalLinkIcon size={16} />
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
          
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-gray-800/80 hover:bg-gray-700/90 text-white p-3 rounded-full backdrop-blur-sm border border-white/20 transition-all duration-300 hover:scale-110 shadow-lg"
            aria-label="Previous projects"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-gray-800/80 hover:bg-gray-700/90 text-white p-3 rounded-full backdrop-blur-sm border border-white/20 transition-all duration-300 hover:scale-110 shadow-lg"
            aria-label="Next projects"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
          
          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: maxIndex + 1 }, (_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-blue-500 scale-125'
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        {/* Responsive Grid for Mobile/Tablet (fallback) */}
        <div className="block md:hidden mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden"
              >
                <div className="aspect-video bg-gray-800 relative">
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                  <p className="text-gray-300 mb-4">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map(tech => (
                      <span
                        key={tech}
                        className="bg-blue-600 text-white px-2 py-1 rounded text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex gap-4">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                    >
                      <GithubIcon size={16} />
                      Code
                    </a>
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <ExternalLinkIcon size={16} />
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}