'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircleIcon, XIcon, SendIcon, BotIcon, UserIcon, SparklesIcon, MinimizeIcon } from 'lucide-react'

interface Message {
  id: string
  text: string
  isBot: boolean
  timestamp: Date
  quickReplies?: string[]
  typing?: boolean
}


export default function AdvancedChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [conversationId, setConversationId] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initialize conversation when chatbot opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initializeConversation()
    }
  }, [isOpen, messages.length])

  const initializeConversation = async () => {
    const welcomeMessage: Message = {
      id: 'welcome',
      text: "👋 Hello! I'm Ahmed's AI DevOps Assistant powered by Llama 3.1. I have deep knowledge about his expertise, projects, and experience.\n\nI can engage in natural conversations about:\n• Technical skills and DevOps tools\n• Kubernetes and containerization projects  \n• CI/CD pipeline implementations\n• Cloud infrastructure experience\n• Contact and collaboration opportunities\n\nFeel free to ask me anything about Ahmed's DevOps journey in natural language!",
      isBot: true,
      timestamp: new Date(),
      quickReplies: [
        'What makes Ahmed unique as a DevOps engineer?',
        'Tell me about his most challenging project', 
        'How experienced is he with Kubernetes?',
        'Is he available for new opportunities?'
      ]
    }
    setMessages([welcomeMessage])
  }

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return

    // Add user message immediately
    const userMessage: Message = {
      id: `user_${Date.now()}`,
      text: text.trim(),
      isBot: false,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)
    setIsTyping(true)

    try {
      // Call our real AI API with conversation history
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          conversationHistory: messages, // Pass full conversation context
          conversationId,
          userId: `user_${Date.now()}`
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      
      // Update conversation ID if new
      if (data.conversationId && !conversationId) {
        setConversationId(data.conversationId)
      }

      // Add bot response
      const botMessage: Message = {
        id: `bot_${Date.now()}`,
        text: data.response,
        isBot: true,
        timestamp: new Date(),
        quickReplies: data.quickReplies
      }

      setMessages(prev => [...prev, botMessage])

    } catch (error) {
      console.error('Chat error:', error)
      
      // Enhanced fallback error message
      const errorMessage: Message = {
        id: `error_${Date.now()}`,
        text: "🤖 I'm temporarily experiencing technical difficulties with the AI service, but I can still help you connect with Ahmed!\n\n📧 **Direct Contact:**\n• Email: Bouchibaahmed43@gmail.com\n• LinkedIn: linkedin.com/in/bouchiba43\n• GitHub: github.com/Bouchiba43\n\n🚀 **Quick Facts about Ahmed:**\n• 3+ years DevOps experience\n• Kubernetes expert with 500+ containers managed\n• 99.9% uptime achieved\n• Available for consulting and new opportunities\n\nPlease try again in a moment, or contact Ahmed directly for immediate assistance!",
        isBot: true,
        timestamp: new Date(),
        quickReplies: ['Try again', 'Contact Ahmed directly', 'View GitHub', 'Download resume']
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      setIsTyping(false)
    }
  }

  const handleQuickReply = async (reply: string) => {
    // Handle special actions
    switch (reply) {
      case 'Send email now':
      case 'Contact directly':
      case 'Use contact form':
      case 'Open contact form':
        document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
        setIsOpen(false)
        return
      case 'View LinkedIn profile':
        window.open('https://linkedin.com/in/bouchiba43', '_blank')
        return
      case 'Check GitHub projects':
      case 'View GitHub':
        window.open('https://github.com/Bouchiba43', '_blank')
        return
      case 'Download resume':
      case 'View detailed resume':
        window.open('/api/resume/download', '_blank')
        return
      case 'View all projects':
      case 'Show projects':
      case 'View project portfolio':
      case 'View projects section':
        document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })
        setIsOpen(false)
        return
      case 'See project portfolio':
      case 'View GitHub repository':
        window.open('https://github.com/Bouchiba43', '_blank')
        return
      default:
        // Send as regular message
        await sendMessage(reply)
    }
  }

  const formatMessage = (text: string) => {
    // Enhanced markdown formatting for AI responses
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-blue-600/20 text-blue-300 px-1 rounded">$1</code>')
      .replace(/^• (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/gs, '<ul class="list-disc list-inside space-y-1 ml-4">$1</ul>')
      .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
      .replace(/^#{1,3} (.+)$/gm, '<h3 class="font-bold text-blue-300 mt-2 mb-1">$1</h3>')
  }

  if (!isOpen) {
    return (
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
      >
        <div className="relative">
          <MessageCircleIcon size={24} />
          <SparklesIcon 
            size={12} 
            className="absolute -top-1 -right-1 text-yellow-300 animate-pulse" 
          />
        </div>
      </motion.button>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ 
          opacity: 1, 
          scale: 1, 
          y: 0,
          height: isMinimized ? 60 : 600
        }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        className="fixed bottom-6 right-6 z-40 w-96 bg-gradient-to-br from-gray-900 to-gray-800 border border-blue-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-sm"
        style={{ height: isMinimized ? '60px' : '600px' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700/50 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <BotIcon size={20} className="text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900"></div>
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">AI DevOps Assistant</h3>
              <p className="text-xs text-blue-300">Powered by Advanced AI</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-gray-400 hover:text-white transition-colors p-1 rounded"
            >
              <MinimizeIcon size={16} />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors p-1 rounded"
            >
              <XIcon size={16} />
            </button>
          </div>
        </div>

        {/* Messages */}
        {!isMinimized && (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-900/50 to-gray-800/50">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  {message.isBot && (
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <BotIcon size={14} className="text-white" />
                    </div>
                  )}
                  
                  <div className={`max-w-[85%] ${message.isBot ? 'order-2' : 'order-1'}`}>
                    <div
                      className={`p-3 rounded-2xl shadow-lg ${
                        message.isBot
                          ? 'bg-gradient-to-r from-gray-800 to-gray-700 text-gray-100 border border-blue-500/20'
                          : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      }`}
                    >
                      <div 
                        className="text-sm leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: formatMessage(message.text) }}
                      />
                    </div>
                    
                    {/* Quick Replies */}
                    {message.quickReplies && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {message.quickReplies.map((reply, index) => (
                          <motion.button
                            key={index}
                            onClick={() => handleQuickReply(reply)}
                            className="px-3 py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/40 hover:to-purple-600/40 text-blue-300 text-xs rounded-full transition-all duration-200 border border-blue-500/30 hover:border-blue-400/50"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {reply}
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </div>

                  {!message.isBot && (
                    <div className="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <UserIcon size={14} className="text-white" />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Enhanced Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 justify-start"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <BotIcon size={14} className="text-white" />
                  </div>
                  <div className="bg-gradient-to-r from-gray-800 to-gray-700 text-gray-100 p-3 rounded-2xl border border-blue-500/20">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-xs text-gray-400">AI thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Enhanced Input */}
            <div className="p-4 border-t border-gray-700/50 bg-gradient-to-r from-gray-800/80 to-gray-900/80">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputValue)}
                  placeholder="Ask me anything about Ahmed's DevOps expertise..."
                  className="flex-1 bg-gray-800/50 border border-gray-600/50 rounded-xl px-4 py-3 text-white text-sm focus:border-blue-500 focus:outline-none transition-all backdrop-blur-sm"
                  disabled={isLoading}
                />
                <motion.button
                  onClick={() => sendMessage(inputValue)}
                  disabled={isLoading || !inputValue.trim()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white p-3 rounded-xl transition-all duration-200 shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <SendIcon size={16} />
                </motion.button>
              </div>
              <div className="text-xs text-gray-500 mt-2 text-center">
                Powered by Llama 3.1 AI • Natural conversations enabled
              </div>
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  )
}