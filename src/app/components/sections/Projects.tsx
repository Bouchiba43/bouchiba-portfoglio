'use client'

import { motion } from 'framer-motion'
import { ExternalLinkIcon, GithubIcon } from 'lucide-react'
import { useProjects } from '@/app/hooks/useProjects'
import Image from 'next/image'

export default function Projects() {
  const { projects, loading } = useProjects()

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
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
    </section>
  )
}