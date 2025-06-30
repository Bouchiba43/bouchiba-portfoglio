// components/ui/TerminalAnimation.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const commands = [
  '$ kubectl get pods',
  'NAME                     READY   STATUS    RESTARTS   AGE',
  'webapp-5f4d6b7c8d-x9z2k   1/1     Running   0          2d',
  'api-server-7b8c9d6e5f-m4n3 1/1     Running   0          1d',
  '$ docker ps',
  'CONTAINER ID   IMAGE        COMMAND     STATUS      PORTS',
  'a1b2c3d4e5f6   nginx:latest "/docker..." Up 2 hours  80/tcp',
  '$ terraform plan',
  'Plan: 15 to add, 0 to change, 0 to destroy.',
  '$ helm list',
  'NAME      NAMESPACE  REVISION  STATUS    CHART',
  'monitoring default   1         deployed  prometheus-15.0.1',
  '$ git status',
  'On branch main',
  'Your branch is up to date with origin/main.',
  'nothing to commit, working tree clean'
]

export default function TerminalAnimation() {
  const [currentCommand, setCurrentCommand] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    if (currentCommand < commands.length) {
      setIsTyping(true)
      setDisplayedText('')
      
      const command = commands[currentCommand]
      let index = 0
      
      const typeInterval = setInterval(() => {
        if (index < command.length) {
          setDisplayedText(command.slice(0, index + 1))
          index++
        } else {
          clearInterval(typeInterval)
          setIsTyping(false)
          
          // Wait before showing next command
          setTimeout(() => {
            setCurrentCommand((prev) => (prev + 1) % commands.length)
          }, 1000)
        }
      }, 50)
      
      return () => clearInterval(typeInterval)
    }
  }, [currentCommand])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-black border border-gray-600 rounded-lg p-4 font-mono text-sm overflow-hidden"
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="flex gap-1">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <span className="text-gray-400">terminal</span>
      </div>
      
      <div className="h-48 overflow-y-auto">
        {commands.slice(0, currentCommand).map((cmd, index) => (
          <div key={index} className="mb-1">
            <span className={cmd.startsWith('$') ? 'text-green-400' : 'text-gray-300'}>
              {cmd}
            </span>
          </div>
        ))}
        
        {currentCommand < commands.length && (
          <div className="mb-1">
            <span className={commands[currentCommand].startsWith('$') ? 'text-green-400' : 'text-gray-300'}>
              {displayedText}
            </span>
            {isTyping && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="text-green-400"
              >
                |
              </motion.span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}