'use client'

import { motion } from 'framer-motion'
import { Activity } from 'lucide-react'
import { useState, useEffect } from 'react'

const metrics = [
  { label: 'CPU Usage', value: '45%', color: 'text-green-400' },
  { label: 'Memory', value: '2.1GB', color: 'text-blue-400' },
  { label: 'Network I/O', value: '1.2MB/s', color: 'text-yellow-400' },
  { label: 'Disk Usage', value: '67%', color: 'text-red-400' }
]

interface Pod {
  name: string
  status: 'Running' | 'Pending' | 'Error'
  cpu: number
  memory: number
  restarts: number
}

const generateRandomPods = (): Pod[] => [
  {
    name: 'frontend-deployment-7d4f8b9c6d-x8k2m',
    status: 'Running',
    cpu: Math.random() * 100,
    memory: Math.random() * 100,
    restarts: Math.floor(Math.random() * 3)
  },
  {
    name: 'backend-api-5f6g7h8i9j-y9l3n',
    status: 'Running',
    cpu: Math.random() * 100,
    memory: Math.random() * 100,
    restarts: Math.floor(Math.random() * 2)
  },
  {
    name: 'database-statefulset-0',
    status: 'Running',
    cpu: Math.random() * 100,
    memory: Math.random() * 100,
    restarts: 0
  },
  {
    name: 'redis-cache-6k7l8m9n0o-z0m4p',
    status: Math.random() > 0.9 ? 'Error' : 'Running',
    cpu: Math.random() * 100,
    memory: Math.random() * 100,
    restarts: Math.floor(Math.random() * 5)
  }
]

export default function KubernetesDashboard() {
  const [pods, setPods] = useState<Pod[]>(generateRandomPods())

  useEffect(() => {
    const interval = setInterval(() => {
      setPods(generateRandomPods())
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 border border-blue-500 rounded-lg p-6 font-mono"
    >
      <div className="flex items-center gap-2 mb-6">
        <Activity className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-bold text-white">Kubernetes Dashboard</h3>
      </div>
      
      {/* Cluster Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-black border border-gray-700 rounded p-3 text-center"
          >
            <div className={`text-lg font-bold ${metric.color}`}>
              {metric.value}
            </div>
            <div className="text-xs text-gray-400">{metric.label}</div>
          </motion.div>
        ))}
      </div>
      
      {/* Pod Status */}
      <div className="space-y-2">
        <h4 className="text-sm font-bold text-gray-300 mb-3">Pod Status</h4>
        {pods.map((pod, index) => (
          <motion.div
            key={pod.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="flex items-center justify-between bg-black border border-gray-700 rounded p-2"
          >
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                pod.status === 'Running' ? 'bg-green-400' : 
                pod.status === 'Error' ? 'bg-red-400' : 'bg-yellow-400'
              }`}></div>
              <span className="text-sm text-white">{pod.name}</span>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className={`${
                pod.status === 'Running' ? 'text-green-400' : 
                pod.status === 'Error' ? 'text-red-400' : 'text-yellow-400'
              }`}>
                {pod.status}
              </span>
              <span className="text-gray-400">Restarts: {pod.restarts}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}