'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, StarIcon } from 'lucide-react'
import { 
  DockerLogo, 
  KubernetesLogo, 
  AWSLogo, 
  JenkinsLogo, 
  HelmLogo, 
  GoLogo, 
  FastAPILogo, 
  LinuxLogo,
  NextJSLogo 
} from '../ui/TechLogos'

const skills = [
  { name: 'Docker', icon: DockerLogo, description: 'Containerization & microservices', proficiency: 95, color: 'bg-gradient-to-br from-blue-500 to-blue-700' },
  { name: 'Kubernetes', icon: KubernetesLogo, description: 'Container orchestration', proficiency: 90, color: 'bg-gradient-to-br from-blue-600 to-indigo-800' },
  { name: 'AWS', icon: AWSLogo, description: 'Cloud infrastructure & services', proficiency: 85, color: 'bg-gradient-to-br from-orange-500 to-orange-700' },
  { name: 'Jenkins', icon: JenkinsLogo, description: 'CI/CD automation & pipelines', proficiency: 88, color: 'bg-gradient-to-br from-red-600 to-red-800' },
  { name: 'Helm', icon: HelmLogo, description: 'Kubernetes package management', proficiency: 85, color: 'bg-gradient-to-br from-blue-500 to-cyan-600' },
  { name: 'Go', icon: GoLogo, description: 'Backend systems & APIs', proficiency: 82, color: 'bg-gradient-to-br from-slate-700 to-slate-900' },
  { name: 'FastAPI', icon: FastAPILogo, description: 'High-performance Python APIs', proficiency: 88, color: 'bg-gradient-to-br from-green-500 to-emerald-600' },
  { name: 'Linux', icon: LinuxLogo, description: 'System administration & servers', proficiency: 92, color: 'bg-gradient-to-br from-gray-700 to-gray-900' },
  { name: 'Next.js', icon: NextJSLogo, description: 'Modern React framework', proficiency: 80, color: 'bg-gradient-to-br from-gray-800 to-black' },
];

export default function Skills() {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  
  const cardsPerView = {
    mobile: 1,
    tablet: 2,
    desktop: 3
  }
  
  const maxIndex = Math.max(0, skills.length - cardsPerView.desktop)
  
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }
  
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
  }
  
  const goToSlide = (index: number) => {
    setCurrentIndex(Math.min(index, maxIndex))
  }

  return (
    <section id="skills" className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.1),transparent)] pointer-events-none"></div>
      
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="section-title">Technical Expertise</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Mastering the tools and technologies that power modern DevOps workflows
          </p>
          <div className="mt-4 font-mono text-sm text-green-400">
            <span className="text-gray-500">$</span> kubectl get skills --show-labels
          </div>
        </motion.div>
        
        <div className="relative max-w-7xl mx-auto">
          {/* Skills Carousel */}
          <div className="relative overflow-hidden">
            <motion.div
              className="flex transition-transform duration-500 ease-in-out"
              animate={{ 
                x: `${-currentIndex * (100 / cardsPerView.desktop)}%` 
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {skills.map((skill, index) => {
                const IconComponent = skill.icon;
                return (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.03, y: -5 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    onHoverStart={() => setHoveredSkill(skill.name)}
                    onHoverEnd={() => setHoveredSkill(null)}
                    className="flex-shrink-0 mx-4 group"
                    style={{ 
                      width: `calc(${100 / cardsPerView.desktop}% - 32px)`,
                      minWidth: '320px'
                    }}
                  >
                    <div className="glass-card-strong p-8 h-full text-white cursor-pointer transition-all duration-500 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20">
                      {/* Skill Icon */}
                      <div className="flex justify-center mb-6">
                        <motion.div 
                          className="relative"
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                        >
                          <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10 shadow-xl">
                            <IconComponent className="w-16 h-16 drop-shadow-lg" />
                          </div>
                        </motion.div>
                      </div>

                      {/* Skill Name */}
                      <h3 className="text-2xl font-bold text-center mb-4 group-hover:text-blue-400 transition-colors">
                        {skill.name}
                      </h3>
                      
                      {/* Proficiency Bar */}
                      {/* <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-400">Proficiency</span>
                          <span className="text-sm font-semibold text-blue-400">{skill.proficiency}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <motion.div
                            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.proficiency}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                          />
                        </div>
                      </div> */}

                      {/* Star Rating */}
                      <div className="flex justify-center mb-4">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon 
                            key={i} 
                            className={`w-4 h-4 ${i < Math.floor(skill.proficiency / 20) ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
                          />
                        ))}
                      </div>
                      
                      {/* Description */}
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{
                          opacity: hoveredSkill === skill.name ? 1 : 0.7,
                          height: hoveredSkill === skill.name ? 'auto' : 'auto'
                        }}
                        className="text-center"
                      >
                        <p className="text-sm text-gray-300 leading-relaxed">
                          {skill.description}
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
          
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 glass-card p-4 hover:bg-white/10 text-white rounded-full transition-all duration-300 hover:scale-110 shadow-lg"
            aria-label="Previous skills"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 glass-card p-4 hover:bg-white/10 text-white rounded-full transition-all duration-300 hover:scale-110 shadow-lg"
            aria-label="Next skills"
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
        
        {/* Skills Grid for Mobile */}
        <div className="block md:hidden mt-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {skills.map((skill, index) => {
              const IconComponent = skill.icon;
              return (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.03, y: -5 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onHoverStart={() => setHoveredSkill(skill.name)}
                  onHoverEnd={() => setHoveredSkill(null)}
                  className="glass-card-strong p-6 text-white cursor-pointer transition-all duration-500 hover:border-blue-500/50 hover:shadow-xl"
                >
                  <div className="flex justify-center mb-4">
                    <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                      <IconComponent className="w-12 h-12 drop-shadow-lg" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-center mb-2">{skill.name}</h3>
                  
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-400">Proficiency</span>
                      <span className="text-xs font-semibold text-blue-400">{skill.proficiency}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1.5">
                      <motion.div
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-1.5 rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.proficiency}%` }}
                        transition={{ duration: 1, delay: 0.3 }}
                      />
                    </div>
                  </div>
                  
                  <p className="text-center text-sm text-gray-300">
                    {skill.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  )
}