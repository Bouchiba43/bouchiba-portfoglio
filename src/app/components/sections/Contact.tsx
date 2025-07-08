'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { 
  MailIcon, 
  LinkedinIcon, 
  GithubIcon, 
  MapPinIcon, 
  AlertCircleIcon, 
  ClockIcon, 
  SendIcon,
  CalendarIcon
} from 'lucide-react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success('Message sent successfully! I\'ll get back to you soon.')
        setFormData({ name: '', email: '', message: '' })
      } else {
        throw new Error('Failed to send message')
      }
    } catch (error) {
      console.error('Contact form error:', error)
      toast.error('Failed to send message. Please try again or contact me directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-24 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.1),transparent)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(16,185,129,0.1),transparent)] pointer-events-none"></div>
      
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="section-title">Let&apos;s Connect</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Ready to collaborate on your next DevOps project? Let&apos;s discuss how we can build something amazing together.
          </p>
          <div className="mt-4 font-mono text-sm text-green-400">
            <span className="text-gray-500">$</span> echo &quot;Let&apos;s connect and build the future&quot;
          </div>
        </motion.div>
        
        <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Professional Info Card */}
            <div className="glass-card-strong p-8 rounded-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <MailIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Get In Touch</h3>
                  <p className="text-gray-400">Available for new opportunities</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <MailIcon className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="text-white font-medium">Bouchibaahmed43@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <MapPinIcon className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-sm text-gray-400">Location</p>
                    <p className="text-white font-medium">Sousse, Tunisia</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <ClockIcon className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-sm text-gray-400">Response Time</p>
                    <p className="text-white font-medium">Within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="glass-card-strong p-8 rounded-xl">
              <h3 className="text-xl font-bold text-white mb-6">Connect on Social</h3>
              <div className="grid grid-cols-2 gap-4">
                <a
                  href="mailto:Bouchibaahmed43@gmail.com"
                  className="glass-card p-4 hover:bg-white/10 text-center rounded-lg transition-all duration-300 hover:scale-105 group"
                >
                  <MailIcon className="w-8 h-8 text-blue-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm text-gray-300 group-hover:text-white">Email</p>
                </a>
                
                <a
                  href="https://linkedin.com/in/bouchiba43"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card p-4 hover:bg-white/10 text-center rounded-lg transition-all duration-300 hover:scale-105 group"
                >
                  <LinkedinIcon className="w-8 h-8 text-blue-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm text-gray-300 group-hover:text-white">LinkedIn</p>
                </a>
                
                <a
                  href="https://github.com/Bouchiba43"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card p-4 hover:bg-white/10 text-center rounded-lg transition-all duration-300 hover:scale-105 group"
                >
                  <GithubIcon className="w-8 h-8 text-gray-300 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm text-gray-300 group-hover:text-white">GitHub</p>
                </a>
                
                <a
                  href="https://calendly.com/bouchiba43"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card p-4 hover:bg-white/10 text-center rounded-lg transition-all duration-300 hover:scale-105 group"
                >
                  <CalendarIcon className="w-8 h-8 text-green-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm text-gray-300 group-hover:text-white">Schedule</p>
                </a>
              </div>
            </div>

            {/* Terminal-style info */}
            <div className="glass-card-strong p-6 rounded-xl">
              <div className="bg-black/50 border border-green-500/30 rounded-lg p-4 font-mono text-sm">
                <div className="text-green-400 space-y-1">
                  <div><span className="text-gray-500">$</span> cat contact.yaml</div>
                  <div className="pl-4 space-y-1 text-gray-300">
                    <div><span className="text-blue-400">name:</span> &quot;Bouchiba Ahmed Seddik&quot;</div>
                    <div><span className="text-blue-400">role:</span> &quot;Passionate DevOps Engineer&quot;</div>
                    <div><span className="text-blue-400">status:</span> &quot;available&quot;</div>
                    <div><span className="text-blue-400">timezone:</span> &quot;GMT+1 (Tunisia)&quot;</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="glass-card-strong p-8 rounded-xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                  <SendIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Send Message</h3>
                  <p className="text-gray-400">I&apos;ll respond within 24 hours</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full glass-card border-2 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-all duration-300 ${
                      errors.name 
                        ? 'border-red-500 focus:border-red-400' 
                        : 'border-gray-600 focus:border-blue-500'
                    }`}
                    placeholder="Your full name"
                    maxLength={50}
                  />
                  {errors.name && (
                    <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                      <AlertCircleIcon size={16} />
                      {errors.name}
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full glass-card border-2 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-all duration-300 ${
                      errors.email 
                        ? 'border-red-500 focus:border-red-400' 
                        : 'border-gray-600 focus:border-blue-500'
                    }`}
                    placeholder="your.email@example.com"
                    maxLength={100}
                  />
                  {errors.email && (
                    <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                      <AlertCircleIcon size={16} />
                      {errors.email}
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Message</label>
                  <textarea
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    className={`w-full glass-card border-2 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-all duration-300 resize-vertical ${
                      errors.message 
                        ? 'border-red-500 focus:border-red-400' 
                        : 'border-gray-600 focus:border-blue-500'
                    }`}
                    placeholder="Tell me about your project or just say hello..."
                    maxLength={1000}
                  />
                  {errors.message && (
                    <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                      <AlertCircleIcon size={16} />
                      {errors.message}
                    </div>
                  )}
                  <div className="text-right text-gray-400 text-sm mt-2">
                    {formData.message.length}/1000
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white py-4 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <SendIcon size={20} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}