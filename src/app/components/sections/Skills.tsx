'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

const skills = [
  { name: 'Docker', icon: '🐳', description: 'Containerization expert', color: 'bg-blue-500' },
  { name: 'Kubernetes', icon: '☸️', description: 'Orchestration master', color: 'bg-blue-600' },
  { name: 'Terraform', icon: '🏗️', description: 'Infrastructure as Code', color: 'bg-purple-600' },
  { name: 'AWS', icon: '☁️', description: 'Cloud architecture', color: 'bg-orange-500' },
  { name: 'Jenkins', icon: '🤖', description: 'CI/CD automation', color: 'bg-red-500' },
  { name: 'ArgoCD', icon: '🚀', description: 'GitOps deployment', color: 'bg-green-500' },
  { name: 'Go (Golang)', icon: '🐹', description: 'Efficient backend systems', color: 'bg-cyan-700' },
  { name: 'FastAPI', icon: '⚡', description: 'Fast Python APIs', color: 'bg-yellow-500' },
  { name: 'Linux (Red Hat)', icon: '🐧', description: 'Server & OS expertise', color: 'bg-gray-700' },
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
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05, rotateY: 10 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onHoverStart={() => setHoveredSkill(skill.name)}
              onHoverEnd={() => setHoveredSkill(null)}
              className={`${skill.color} rounded-lg p-6 text-white cursor-pointer transform-gpu perspective-1000`}
            >
              <div className="text-4xl mb-4 text-center">{skill.icon}</div>
              <h3 className="text-xl font-bold text-center mb-2">{skill.name}</h3>
              
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{
                  opacity: hoveredSkill === skill.name ? 1 : 0,
                  height: hoveredSkill === skill.name ? 'auto' : 0
                }}
                className="text-center text-sm overflow-hidden"
              >
                {skill.description}
              </motion.p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}