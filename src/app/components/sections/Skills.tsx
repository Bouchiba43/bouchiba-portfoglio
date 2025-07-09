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
import { SkillCard } from '../ui/InteractiveHover'
import { SectionTransition, StaggerItem } from '../ui/PageTransition'
import ParticleSystem from '../ui/ParticleSystem'
import MorphingShapes from '../ui/MorphingShapes'

const skills = [
  { name: 'Docker', icon: DockerLogo, description: 'Containerization & microservices', proficiency: 95, color: '#0db7ed' },
  { name: 'Kubernetes', icon: KubernetesLogo, description: 'Container orchestration', proficiency: 90, color: '#326ce5' },
  { name: 'AWS', icon: AWSLogo, description: 'Cloud infrastructure & services', proficiency: 85, color: '#ff9900' },
  { name: 'Jenkins', icon: JenkinsLogo, description: 'CI/CD automation & pipelines', proficiency: 88, color: '#d33833' },
  { name: 'Helm', icon: HelmLogo, description: 'Kubernetes package management', proficiency: 85, color: '#0f1689' },
  { name: 'Go', icon: GoLogo, description: 'Backend systems & APIs', proficiency: 82, color: '#00add8' },
  { name: 'FastAPI', icon: FastAPILogo, description: 'High-performance Python APIs', proficiency: 88, color: '#009688' },
  { name: 'Linux', icon: LinuxLogo, description: 'System administration & servers', proficiency: 92, color: '#fcc624' },
  { name: 'Next.js', icon: NextJSLogo, description: 'Modern React framework', proficiency: 80, color: '#000000' },
];

export default function Skills() {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)

  return (
    <section id="skills" className="py-16 md:py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.1),transparent)] pointer-events-none"></div>
      
      {/* Particle System */}
      <ParticleSystem 
        theme="cyber"
        density={40}
        interactive={true}
        showConnections={false}
      />

      {/* Morphing Shapes */}
      <MorphingShapes 
        size={120} 
        color="#3b82f6" 
        duration={4}
        position="absolute"
        className="top-20 right-20 opacity-20"
      />
      <MorphingShapes 
        size={80} 
        color="#10b981" 
        duration={5}
        position="absolute"
        className="bottom-32 left-16 opacity-20"
      />
      
      <div className="container mx-auto px-4">
        <SectionTransition delay={0} direction="up">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
              <span className="section-title">Technical Expertise</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
              Mastering the tools and technologies that power modern DevOps workflows
            </p>
            <div className="mt-4 font-mono text-sm text-green-400 hidden md:block">
              <span className="text-gray-500">$</span> kubectl get skills --show-labels
            </div>
          </div>
        </SectionTransition>
        
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
            {skills.map((skill) => {
              const IconComponent = skill.icon;
              return (
                <SwiperSlide key={skill.name}>
                  <StaggerItem direction="up" className="h-full">
                    <div
                      className="relative overflow-hidden h-full"
                      onMouseEnter={() => setHoveredSkill(skill.name)}
                      onMouseLeave={() => setHoveredSkill(null)}
                    >
                      <SkillCard
                        skillColor={skill.color}
                        className="h-full"
                      >
                        <div className="glass-card-strong p-6 lg:p-8 h-full text-white cursor-pointer transition-all duration-500 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20 rounded-xl">
                          {/* Skill Icon */}
                          <div className="flex justify-center mb-6">
                            <motion.div 
                              className="relative"
                              whileHover={{ 
                                rotate: 360,
                                scale: 1.1
                              }}
                              transition={{ duration: 0.6 }}
                            >
                              <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-4 lg:p-6 backdrop-blur-sm border border-white/10 shadow-xl relative overflow-hidden">
                                <IconComponent className="w-12 h-12 lg:w-16 lg:h-16 drop-shadow-lg relative z-10" />
                                
                                {/* Animated background */}
                                <motion.div
                                  className="absolute inset-0 rounded-2xl"
                                  animate={{
                                    background: hoveredSkill === skill.name
                                      ? `radial-gradient(circle, ${skill.color}30, transparent)`
                                      : 'transparent'
                                  }}
                                  transition={{ duration: 0.3 }}
                                />
                                
                                {/* Particle effect on hover */}
                                {hoveredSkill === skill.name && (
                                  <div className="absolute inset-0 pointer-events-none">
                                    {[...Array(6)].map((_, i) => (
                                      <motion.div
                                        key={i}
                                        className="absolute w-1 h-1 rounded-full"
                                        style={{
                                          backgroundColor: skill.color,
                                          left: '50%',
                                          top: '50%',
                                        }}
                                        animate={{
                                          x: [0, (Math.cos(i * 60 * Math.PI / 180) * 30)],
                                          y: [0, (Math.sin(i * 60 * Math.PI / 180) * 30)],
                                          opacity: [1, 0],
                                          scale: [1, 0]
                                        }}
                                        transition={{
                                          duration: 1,
                                          repeat: Infinity,
                                          delay: i * 0.1
                                        }}
                                      />
                                    ))}
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          </div>

                          {/* Skill Name */}
                          <h3 className="text-xl lg:text-2xl font-bold text-center mb-4 group-hover:text-blue-400 transition-colors">
                            {skill.name}
                          </h3>

                          {/* Proficiency Bar */}
                          {/* <div className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-gray-400">Proficiency</span>
                              <span className="text-sm font-semibold text-blue-400">{skill.proficiency}%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                              <motion.div
                                className="h-2 rounded-full"
                                style={{
                                  background: `linear-gradient(90deg, ${skill.color}, ${skill.color}88)`
                                }}
                                initial={{ width: 0 }}
                                whileInView={{ width: `${skill.proficiency}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.5, delay: 0.3 }}
                              />
                            </div>
                          </div> */}
                          
                          {/* Description */}
                          <motion.div
                            initial={{ opacity: 0.7 }}
                            animate={{
                              opacity: hoveredSkill === skill.name ? 1 : 0.7,
                              scale: hoveredSkill === skill.name ? 1.05 : 1
                            }}
                            transition={{ duration: 0.3 }}
                            className="text-center"
                          >
                            <p className="text-sm text-gray-300 leading-relaxed">
                              {skill.description}
                            </p>
                          </motion.div>

                          {/* Glow effect */}
                          <motion.div
                            className="absolute inset-0 rounded-xl pointer-events-none"
                            animate={{
                              boxShadow: hoveredSkill === skill.name
                                ? `0 0 30px ${skill.color}40`
                                : '0 0 0px transparent'
                            }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      </SkillCard>
                    </div>
                  </StaggerItem>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </section>
  )
}