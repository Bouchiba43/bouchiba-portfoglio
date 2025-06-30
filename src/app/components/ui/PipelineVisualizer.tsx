'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Circle, AlertCircle, Clock } from 'lucide-react'
import { useState, useEffect } from 'react'

interface PipelineStage {
  id: string
  name: string
  status: 'pending' | 'running' | 'success' | 'failed'
  duration?: string
}

const initialStages: PipelineStage[] = [
  { id: '1', name: 'Source', status: 'success', duration: '5s' },
  { id: '2', name: 'Build', status: 'success', duration: '2m 30s' },
  { id: '3', name: 'Test', status: 'running' },
  { id: '4', name: 'Security Scan', status: 'pending' },
  { id: '5', name: 'Deploy to Staging', status: 'pending' },
  { id: '6', name: 'Integration Tests', status: 'pending' },
  { id: '7', name: 'Deploy to Production', status: 'pending' }
]

export default function PipelineVisualizer() {
  const [stages, setStages] = useState<PipelineStage[]>(initialStages)
  const [isRunning, setIsRunning] = useState(true)

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setStages(prev => {
        const newStages = [...prev]
        const runningIndex = newStages.findIndex(stage => stage.status === 'running')
        
        if (runningIndex !== -1) {
          // Complete current running stage
          newStages[runningIndex] = {
            ...newStages[runningIndex],
            status: Math.random() > 0.1 ? 'success' : 'failed',
            duration: `${Math.floor(Math.random() * 5) + 1}m ${Math.floor(Math.random() * 60)}s`
          }
          
          // Start next stage if current succeeded
          if (newStages[runningIndex].status === 'success' && runningIndex < newStages.length - 1) {
            newStages[runningIndex + 1] = {
              ...newStages[runningIndex + 1],
              status: 'running'
            }
          } else if (newStages[runningIndex].status === 'failed') {
            setIsRunning(false)
          }
        }
        
        if (runningIndex === newStages.length - 1 && newStages[runningIndex].status === 'success') {
          setIsRunning(false)
        }
        
        return newStages
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [isRunning])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-400" />
      case 'failed':
        return <AlertCircle className="w-6 h-6 text-red-400" />
      case 'running':
        return <Clock className="w-6 h-6 text-blue-400 animate-spin" />
      default:
        return <Circle className="w-6 h-6 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'border-green-400 bg-green-400/10'
      case 'failed': return 'border-red-400 bg-red-400/10'
      case 'running': return 'border-blue-400 bg-blue-400/10'
      default: return 'border-gray-600 bg-gray-800'
    }
  }

  const resetPipeline = () => {
    setStages(initialStages)
    setIsRunning(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 border border-green-500 rounded-lg p-6 font-mono"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">CI/CD Pipeline</h3>
        <button
          onClick={resetPipeline}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
        >
          Restart
        </button>
      </div>
      
      <div className="space-y-4">
        {stages.map((stage, index) => (
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center gap-4 p-3 border rounded ${getStatusColor(stage.status)}`}
          >
            {getStatusIcon(stage.status)}
            <div className="flex-1">
              <div className="text-white font-medium">{stage.name}</div>
              {stage.duration && (
                <div className="text-sm text-gray-400">{stage.duration}</div>
              )}
            </div>
            <div className="text-sm text-gray-400">
              Stage {index + 1}
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-4 text-sm text-gray-400">
        Pipeline Status: {isRunning ? 'Running...' : 
          stages.some(s => s.status === 'failed') ? 'Failed' : 'Completed'}
      </div>
    </motion.div>
  )
}