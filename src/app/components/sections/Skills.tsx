'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
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
  { name: 'Docker', icon: DockerLogo, description: 'Containerization & microservices', color: 'bg-gradient-to-br from-blue-500 to-blue-700' },
  { name: 'Kubernetes', icon: KubernetesLogo, description: 'Container orchestration', color: 'bg-gradient-to-br from-blue-600 to-indigo-800' },
  { name: 'AWS', icon: AWSLogo, description: 'Cloud infrastructure & services', color: 'bg-gradient-to-br from-orange-500 to-orange-700' },
  { name: 'Jenkins', icon: JenkinsLogo, description: 'CI/CD automation & pipelines', color: 'bg-gradient-to-br from-red-600 to-red-800' },
  { name: 'Helm', icon: HelmLogo, description: 'Kubernetes package management', color: 'bg-gradient-to-br from-blue-500 to-cyan-600' },
  { name: 'Go', icon: GoLogo, description: 'Backend systems & APIs', color: 'bg-gradient-to-br from-slate-700 to-slate-900' },
  { name: 'FastAPI', icon: FastAPILogo, description: 'High-performance Python APIs', color: 'bg-gradient-to-br from-green-500 to-emerald-600' },
  { name: 'Linux', icon: LinuxLogo, description: 'System administration & servers', color: 'bg-gradient-to-br from-gray-700 to-gray-900' },
  { name: 'Next.js', icon: NextJSLogo, description: 'Modern React framework', color: 'bg-gradient-to-br from-gray-800 to-black' },
];

export default function Skills() {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)

  return (
    <section id="skills" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-bold text-center text-white mb-12 font-mono"
        >
          $ cat skills.yaml
        </motion.h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {skills.map((skill, index) => {
            const IconComponent = skill.icon;
            return (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05, rotateY: 5 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onHoverStart={() => setHoveredSkill(skill.name)}
                onHoverEnd={() => setHoveredSkill(null)}
                className={`${skill.color} rounded-xl p-6 text-white cursor-pointer transform-gpu shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/10`}
              >
                <div className="flex justify-center mb-4">
                  <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm shadow-inner border border-white/20">
                    <IconComponent className="w-14 h-14 drop-shadow-lg" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-center mb-2">{skill.name}</h3>
                
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{
                    opacity: hoveredSkill === skill.name ? 1 : 0,
                    height: hoveredSkill === skill.name ? 'auto' : 0
                  }}
                  className="text-center text-sm overflow-hidden text-white/90"
                >
                  {skill.description}
                </motion.p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  )
}