'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { PlusIcon, EditIcon, TrashIcon, SaveIcon, XIcon, BriefcaseIcon, CalendarIcon, MapPinIcon } from 'lucide-react'
import { useExperiences } from '@/app/hooks/useExperiences'
import type { Experience } from '@/app/types'
import toast from 'react-hot-toast'
import Image from 'next/image'

export default function ExperienceManager() {
  const { experiences, loading, addExperience, updateExperience, deleteExperience } = useExperiences()
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [technologiesInput, setTechnologiesInput] = useState('')
  const [formData, setFormData] = useState<Partial<Experience>>({
    company: '',
    position: '',
    description: '',
    technologies: [],
    startDate: new Date(),
    endDate: null,
    isCurrentRole: false,
    location: '',
    companyUrl: '',
    logoUrl: ''
  })

  const resetForm = () => {
    setFormData({
      company: '',
      position: '',
      description: '',
      technologies: [],
      startDate: new Date(),
      endDate: null,
      isCurrentRole: false,
      location: '',
      companyUrl: '',
      logoUrl: ''
    })
    setTechnologiesInput('')
    setIsEditing(null)
    setShowAddForm(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Parse technologies from input string
    const technologies = technologiesInput.split(',').map(tech => tech.trim()).filter(Boolean)
    
    try {
      if (isEditing) {
        await updateExperience(isEditing, { ...formData, technologies })
        toast.success('Experience updated successfully!')
      } else {
        await addExperience({ ...formData, technologies } as Omit<Experience, 'id'>)
        toast.success('Experience added successfully!')
      }
      resetForm()
    } catch {
      toast.error('Failed to save experience')
    }
  }

  const handleEdit = (experience: Experience) => {
    setFormData({
      ...experience,
      startDate: new Date(experience.startDate),
      endDate: experience.endDate ? new Date(experience.endDate) : null
    })
    setTechnologiesInput(experience.technologies.join(', '))
    setIsEditing(experience.id)
    setShowAddForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this experience?')) {
      try {
        await deleteExperience(id)
        toast.success('Experience deleted successfully!')
      } catch {
        toast.error('Failed to delete experience')
      }
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    })
  }

  if (loading) {
    return (
      <div className="text-center text-white">
        <div className="font-mono">$ loading experiences...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white font-mono">$ manage experiences</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <PlusIcon size={16} />
          Add Experience
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 border border-gray-600 rounded-lg p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white font-mono">
              {isEditing ? '$ edit experience' : '$ add experience'}
            </h3>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-white"
            >
              <XIcon size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-2">Company *</label>
                <input
                  type="text"
                  required
                  value={formData.company || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Position *</label>
                <input
                  type="text"
                  required
                  value={formData.position || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                  className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Description *</label>
              <textarea
                required
                rows={4}
                value={formData.description || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                placeholder="Describe your role, achievements, and responsibilities..."
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Technologies (comma-separated)</label>
              <input
                type="text"
                value={technologiesInput}
                onChange={(e) => setTechnologiesInput(e.target.value)}
                className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                placeholder="React, Node.js, Docker, Kubernetes"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-2">Location *</label>
                <input
                  type="text"
                  required
                  value={formData.location || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  placeholder="San Francisco, CA or Remote"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Company URL</label>
                <input
                  type="url"
                  value={formData.companyUrl || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, companyUrl: e.target.value }))}
                  className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Company Logo URL</label>
              <input
                type="url"
                value={formData.logoUrl || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, logoUrl: e.target.value }))}
                className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-300 mb-2">Start Date *</label>
                <input
                  type="date"
                  required
                  value={formData.startDate ? formData.startDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: new Date(e.target.value) }))}
                  className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">End Date</label>
                <input
                  type="date"
                  disabled={formData.isCurrentRole}
                  value={formData.endDate && !formData.isCurrentRole ? formData.endDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    endDate: e.target.value ? new Date(e.target.value) : null 
                  }))}
                  className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none disabled:opacity-50"
                />
              </div>

              <div className="flex items-end">
                <label className="flex items-center text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isCurrentRole || false}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      isCurrentRole: e.target.checked,
                      endDate: e.target.checked ? null : prev.endDate
                    }))}
                    className="mr-2 w-4 h-4 text-blue-600 bg-gray-900 border-gray-600 rounded focus:ring-blue-500"
                  />
                  Current Role
                </label>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <SaveIcon size={16} />
                {isEditing ? 'Update' : 'Add'} Experience
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Experiences List */}
      <div className="grid gap-4">
        {experiences.map((experience) => (
          <motion.div
            key={experience.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-800 border border-gray-600 rounded-lg p-6"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                  {experience.logoUrl && (
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-white p-1">
                      <Image
                        src={experience.logoUrl}
                        alt={`${experience.company} logo`}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-bold text-white">{experience.position}</h3>
                    <div className="flex items-center gap-2 text-blue-400">
                      <BriefcaseIcon size={16} />
                      <span>{experience.company}</span>
                      {experience.isCurrentRole && (
                        <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs ml-2">
                          Current
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-gray-400 text-sm mb-3">
                  <div className="flex items-center gap-1">
                    <CalendarIcon size={14} />
                    <span>
                      {formatDate(experience.startDate)} - {' '}
                      {experience.isCurrentRole ? 'Present' : formatDate(experience.endDate!)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPinIcon size={14} />
                    <span>{experience.location}</span>
                  </div>
                </div>

                <p className="text-gray-300 mb-3 leading-relaxed">
                  {experience.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {experience.technologies.map(tech => (
                    <span
                      key={tech}
                      className="bg-blue-600 text-white px-2 py-1 rounded text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleEdit(experience)}
                  className="text-blue-400 hover:text-blue-300 p-2"
                >
                  <EditIcon size={16} />
                </button>
                <button
                  onClick={() => handleDelete(experience.id)}
                  className="text-red-400 hover:text-red-300 p-2"
                >
                  <TrashIcon size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {experiences.length === 0 && (
        <div className="text-center text-gray-400 py-8">
          <div className="font-mono">$ ls experiences/</div>
          <div className="mt-2">No experiences found. Add your first experience!</div>
        </div>
      )}
    </div>
  )
}