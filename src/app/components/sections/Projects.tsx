'use client'

import { motion } from 'framer-motion'
import { ExternalLinkIcon, GithubIcon, ChevronLeftIcon, ChevronRightIcon, CodeIcon, RocketIcon } from 'lucide-react'
import { useProjects } from '@/app/hooks/useProjects'
import Image from 'next/image'
import { useState } from 'react'

export default function Projects() {
  const { projects, loading } = useProjects()
  const [currentIndex, setCurrentIndex] = useState(0)
  
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
      <section id="projects" className="py-24 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-700 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-700 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="projects" className="py-24 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(59,130,246,0.1),transparent)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.1),transparent)] pointer-events-none"></div>
      
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="section-title">Featured Projects</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Showcasing DevOps solutions and full-stack applications built with modern technologies
          </p>
          <div className="mt-4 font-mono text-sm text-green-400">
            <span className="text-gray-500">$</span> docker ps --format &quot;table &#123;&#123;.Names&#125;&#125;&quot;
          </div>
        </motion.div>
        
        <div className="relative max-w-7xl mx-auto">
          {/* Projects Carousel */}
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
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex-shrink-0 mx-4 group"
                  style={{ 
                    width: `calc(${100 / cardsPerView.desktop}% - 32px)`,
                    minWidth: '350px'
                  }}
                >
                  <div className="glass-card-strong rounded-xl overflow-hidden h-full hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500">
                    {/* Project Image */}
                    <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
                      <Image
                        src={project.imageUrl}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Project Status Badge */}
                      <div className="absolute top-4 right-4">
                        <div className="glass-card px-3 py-1 flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-green-400 font-medium">Live</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Project Content */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
                          {project.title}
                        </h3>
                        <div className="flex gap-2">
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="glass-card p-2 hover:bg-white/10 text-gray-300 hover:text-white transition-colors rounded-lg"
                          >
                            <GithubIcon size={18} />
                          </a>
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="glass-card p-2 hover:bg-white/10 text-gray-300 hover:text-white transition-colors rounded-lg"
                            >
                              <ExternalLinkIcon size={18} />
                            </a>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-gray-300 mb-6 leading-relaxed">
                        {project.description}
                      </p>
                      
                      {/* Technologies */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.technologies.map(tech => (
                          <span
                            key={tech}
                            className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 text-blue-300 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 glass-card border-2 border-gray-600 hover:border-blue-500 text-gray-300 hover:text-white px-4 py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group"
                        >
                          <CodeIcon size={16} />
                          <span className="font-medium">View Code</span>
                        </a>
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                          >
                            <RocketIcon size={16} />
                            <span className="font-medium">Live Demo</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
          
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 glass-card p-4 hover:bg-white/10 text-white rounded-full transition-all duration-300 hover:scale-110 shadow-lg"
            aria-label="Previous projects"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 glass-card p-4 hover:bg-white/10 text-white rounded-full transition-all duration-300 hover:scale-110 shadow-lg"
            aria-label="Next projects"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
          
          {/* Dots Indicator */}
          <div className="flex justify-center mt-12 space-x-3">
            {Array.from({ length: maxIndex + 1 }, (_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-blue-500 scale-125 shadow-lg shadow-blue-500/50'
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        {/* Mobile Grid View */}
        <div className="block md:hidden mt-12">
          <div className="grid grid-cols-1 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card-strong rounded-xl overflow-hidden hover:border-blue-500/50 hover:shadow-xl"
              >
                <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900">
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3">{project.title}</h3>
                  <p className="text-gray-300 mb-4">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map(tech => (
                      <span
                        key={tech}
                        className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 text-blue-300 px-2 py-1 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex gap-3">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 glass-card border border-gray-600 hover:border-blue-500 text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <GithubIcon size={16} />
                      <span>Code</span>
                    </a>
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <ExternalLinkIcon size={16} />
                        <span>Demo</span>
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Empty State */}
        {projects.length === 0 && (
          <div className="text-center py-16">
            <div className="glass-card-strong max-w-md mx-auto p-8">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-xl font-bold text-white mb-2">Projects Coming Soon</h3>
              <p className="text-gray-400">Currently building amazing DevOps solutions...</p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}