'use client'

import { motion } from 'framer-motion'
import { ExternalLinkIcon, GithubIcon, CodeIcon, RocketIcon } from 'lucide-react'
import { useProjects } from '@/app/hooks/useProjects'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

export default function Projects() {
  const { projects, loading } = useProjects()

  if (loading) {
    return (
      <section id="projects" className="py-16 md:py-24 bg-gradient-to-br from-black via-gray-900 to-black">
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
    <section id="projects" className="py-16 md:py-24 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(59,130,246,0.1),transparent)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.1),transparent)] pointer-events-none"></div>
      
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
            <span className="section-title">Featured Projects</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
            Showcasing DevOps solutions and full-stack applications built with modern technologies
          </p>
          <div className="mt-4 font-mono text-sm text-green-400 hidden md:block">
            <span className="text-gray-500">$</span> docker ps --format &quot;table &#123;&#123;.Names&#125;&#125;&quot;
          </div>
        </motion.div>
        
        {/* Projects Carousel */}
        <div className="relative max-w-7xl mx-auto">
          <style jsx global>{`
            .projects-swiper .swiper-button-next,
            .projects-swiper .swiper-button-prev {
              color: rgb(59 130 246);
              background: rgba(17, 24, 39, 0.8);
              backdrop-filter: blur(12px);
              border: 1px solid rgba(59, 130, 246, 0.3);
              width: 50px;
              height: 50px;
              border-radius: 50%;
              margin-top: -25px;
              transition: all 0.3s ease;
            }
            
            .projects-swiper .swiper-button-next:hover,
            .projects-swiper .swiper-button-prev:hover {
              background: rgba(59, 130, 246, 0.2);
              transform: scale(1.1);
            }
            
            .projects-swiper .swiper-button-next:after,
            .projects-swiper .swiper-button-prev:after {
              font-size: 20px;
              font-weight: bold;
            }
            
            .projects-swiper .swiper-pagination-bullet {
              background: rgba(156, 163, 175, 0.5);
              opacity: 1;
              width: 12px;
              height: 12px;
              margin: 0 6px;
              transition: all 0.3s ease;
            }
            
            .projects-swiper .swiper-pagination-bullet-active {
              background: rgb(59 130 246);
              transform: scale(1.2);
              box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
            }
            
            .projects-swiper .swiper-pagination {
              bottom: -50px;
            }
            
            @media (max-width: 768px) {
              .projects-swiper .swiper-button-next,
              .projects-swiper .swiper-button-prev {
                width: 40px;
                height: 40px;
                margin-top: -20px;
              }
              
              .projects-swiper .swiper-button-next:after,
              .projects-swiper .swiper-button-prev:after {
                font-size: 16px;
              }
            }
          `}</style>
          
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            loop={projects.length > 1}
            watchSlidesProgress={true}
            breakpoints={{
              640: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 40,
              },
            }}
            className="projects-swiper pb-16"
          >
            {projects.map((project, index) => (
              <SwiperSlide key={project.id}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group h-full"
                >
                  {/* Fixed height card with consistent sizing */}
                  <div className="glass-card-strong rounded-xl overflow-hidden h-[580px] hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 flex flex-col">
                    {/* Project Image - Fixed Height */}
                    <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden flex-shrink-0">
                      <Image
                        src={project.imageUrl}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Project Status Badge */}
                      {/* <div className="absolute top-4 right-4">
                        <div className="glass-card px-3 py-1 flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-green-400 font-medium">Live</span>
                        </div>
                      </div> */}
                    </div>
                    
                    {/* Project Content - Flexible container */}
                    <div className="p-6 flex flex-col flex-1">
                      {/* Header with title and action icons - Fixed Height */}
                      <div className="flex items-start justify-between mb-4 h-14">
                        <h3 className="text-xl lg:text-2xl font-bold text-white group-hover:text-blue-400 transition-colors flex-1 line-clamp-2 leading-tight">
                          {project.title}
                        </h3>
                        <div className="flex gap-2 flex-shrink-0 ml-4">
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
                      
                      {/* Description - Fixed Height with text truncation */}
                      <div className="mb-4 h-20 overflow-hidden">
                        <p className="text-gray-300 leading-relaxed text-sm lg:text-base line-clamp-3">
                          {project.description}
                        </p>
                      </div>
                      
                      {/* Technologies - Fixed Height with scroll if needed */}
                      <div className="mb-6 h-20 overflow-hidden">
                        <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
                          {project.technologies.map(tech => (
                            <span
                              key={tech}
                              className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 text-blue-300 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm flex-shrink-0 h-fit"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {/* Spacer to push buttons to bottom */}
                      <div className="flex-1"></div>
                      
                      {/* Action Buttons - Always at bottom with fixed height */}
                      <div className="flex gap-3 h-12">
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
              </SwiperSlide>
            ))}
          </Swiper>
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