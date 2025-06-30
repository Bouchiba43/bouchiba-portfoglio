'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { MailIcon, LinkedinIcon, GithubIcon, MapPinIcon, AlertCircleIcon } from 'lucide-react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: ''
  })

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Form validation
  const validateForm = (): boolean => {
    const newErrors = { name: '', email: '', message: '' }
    let isValid = true

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
      isValid = false
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
      isValid = false
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
      isValid = false
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
      isValid = false
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
      isValid = false
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form before submission
    if (!validateForm()) {
      toast.error('Please fix the form errors before submitting')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Message sent successfully! I\'ll get back to you soon.')
        setFormData({ name: '', email: '', message: '' })
        setErrors({ name: '', email: '', message: '' })
      } else {
        toast.error(data.error || 'Failed to send message')
      }
    } catch {
      toast.error('Failed to send message. Please try again or contact me directly.')
    } finally {
      setLoading(false)
    }
  }

  // Handle input changes with real-time validation
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <section id="contact" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center text-white mb-12 font-mono"
        >
          $ echo &quot;Let&apos;s connect&quot;
        </motion.h2>
        
        <div className="grid md:grid-cols-2 gap-12">
          {/* Terminal-style contact info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-black border border-green-500 rounded-lg p-6 font-mono">
              <div className="text-green-400">
                <div className="mb-4">
                  <span className="text-gray-500">$</span> cat contact.yaml
                </div>
                <div className="pl-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <MailIcon size={16} />
                    <span className="text-blue-400">email:</span> Bouchibaahmed43@gmail.com
                  </div>
                  <div className="flex items-center gap-2">
                    <LinkedinIcon size={16} />
                    <span className="text-blue-400">linkedin:</span> /in/bouchiba43
                  </div>
                  <div className="flex items-center gap-2">
                    <GithubIcon size={16} />
                    <span className="text-blue-400">github:</span> /Bouchiba43
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPinIcon size={16} />
                    <span className="text-blue-400">location:</span> Sousse, Tunisia
                  </div>
                </div>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex gap-4 justify-center">
              <a
                href="mailto:Bouchibaahmed43@gmail.com"
                className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-colors"
              >
                <MailIcon size={20} />
              </a>
              <a
                href="https://linkedin.com/in/bouchiba43"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-colors"
              >
                <LinkedinIcon size={20} />
              </a>
              <a
                href="https://github.com/Bouchiba43"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-lg transition-colors"
              >
                <GithubIcon size={20} />
              </a>
            </div>
          </motion.div>
          
          {/* Contact form */}
          <motion.form
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div>
              <label className="block text-gray-300 mb-2">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full bg-gray-800 border rounded-lg px-4 py-2 text-white focus:outline-none transition-colors ${
                  errors.name 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-gray-600 focus:border-blue-500'
                }`}
                placeholder="Your full name"
              />
              {errors.name && (
                <div className="flex items-center gap-1 mt-1 text-red-400 text-sm">
                  <AlertCircleIcon size={14} />
                  {errors.name}
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full bg-gray-800 border rounded-lg px-4 py-2 text-white focus:outline-none transition-colors ${
                  errors.email 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-gray-600 focus:border-blue-500'
                }`}
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <div className="flex items-center gap-1 mt-1 text-red-400 text-sm">
                  <AlertCircleIcon size={14} />
                  {errors.email}
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Message</label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                className={`w-full bg-gray-800 border rounded-lg px-4 py-2 text-white focus:outline-none transition-colors resize-vertical ${
                  errors.message 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-gray-600 focus:border-blue-500'
                }`}
                placeholder="Tell me about your project or just say hello..."
              />
              {errors.message && (
                <div className="flex items-center gap-1 mt-1 text-red-400 text-sm">
                  <AlertCircleIcon size={14} />
                  {errors.message}
                </div>
              )}
              <div className="text-right text-gray-400 text-sm mt-1">
                {formData.message.length}/500
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-lg transition-colors font-medium"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending...
                </div>
              ) : (
                'Send Message'
              )}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  )
}