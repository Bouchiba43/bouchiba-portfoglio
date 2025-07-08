'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
// import { StarIcon } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
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

  return (
    <section id="skills" className="py-16 md:py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.1),transparent)] pointer-events-none"></div>
      
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
            <span className="section-title">Technical Expertise</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
            Mastering the tools and technologies that power modern DevOps workflows
          </p>
          <div className="mt-4 font-mono text-sm text-green-400 hidden md:block">
            <span className="text-gray-500">$</span> kubectl get skills --show-labels
          </div>
        </motion.div>
        
        {/* Skills Carousel */}
        <div className="relative max-w-7xl mx-auto">
          <style jsx global>{`
            .skills-swiper .swiper-button-next,
            .skills-swiper .swiper-button-prev {
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
            
            .skills-swiper .swiper-button-next:hover,
            .skills-swiper .swiper-button-prev:hover {
              background: rgba(59, 130, 246, 0.2);
              transform: scale(1.1);
            }
            
            .skills-swiper .swiper-button-next:after,
            .skills-swiper .swiper-button-prev:after {
              font-size: 20px;
              font-weight: bold;
            }
            
            .skills-swiper .swiper-pagination-bullet {
              background: rgba(156, 163, 175, 0.5);
              opacity: 1;
              width: 12px;
              height: 12px;
              margin: 0 6px;
              transition: all 0.3s ease;
            }
            
            .skills-swiper .swiper-pagination-bullet-active {
              background: rgb(59 130 246);
              transform: scale(1.2);
              box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
            }
            
            .skills-swiper .swiper-pagination {
              bottom: -50px;
            }
            
            @media (max-width: 768px) {
              .skills-swiper .swiper-button-next,
              .skills-swiper .swiper-button-prev {
                width: 40px;
                height: 40px;
                margin-top: -20px;
              }
              
              .skills-swiper .swiper-button-next:after,
              .skills-swiper .swiper-button-prev:after {
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
              delay: 4000,
              disableOnInteraction: false,
            }}
            loop={true}
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
            className="skills-swiper pb-16"
          >
            {skills.map((skill, index) => {
              const IconComponent = skill.icon;
              return (
                <SwiperSlide key={skill.name}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.03, y: -5 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    onHoverStart={() => setHoveredSkill(skill.name)}
                    onHoverEnd={() => setHoveredSkill(null)}
                    className="group h-full"
                  >
                    <div className="glass-card-strong p-6 lg:p-8 h-full text-white cursor-pointer transition-all duration-500 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20 rounded-xl">
                      {/* Skill Icon */}
                      <div className="flex justify-center mb-6">
                        <motion.div 
                          className="relative"
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                        >
                          <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-4 lg:p-6 backdrop-blur-sm border border-white/10 shadow-xl">
                            <IconComponent className="w-12 h-12 lg:w-16 lg:h-16 drop-shadow-lg" />
                          </div>
                        </motion.div>
                      </div>

                      {/* Skill Name */}
                      <h3 className="text-xl lg:text-2xl font-bold text-center mb-4 group-hover:text-blue-400 transition-colors">
                        {skill.name}
                      </h3>

                      {/* Star Rating */}
                      {/* <div className="flex justify-center mb-4">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon 
                            key={i} 
                            className={`w-4 h-4 ${i < Math.floor(skill.proficiency / 20) ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
                          />
                        ))}
                      </div> */}

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
                            transition={{ duration: 1, delay: 0.3 }}
                          />
                        </div>
                      </div> */}
                      
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
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </section>
  )
}