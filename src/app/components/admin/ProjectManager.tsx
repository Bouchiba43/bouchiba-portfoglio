// components/admin/ProjectManager.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { PlusIcon, EditIcon, TrashIcon, SaveIcon, XIcon, LinkIcon, UploadIcon } from 'lucide-react'
import { useProjects } from '@/app/hooks/useProjects'
import type { Project } from '@/app/types'
import toast from 'react-hot-toast'
import Image from 'next/image'

export default function ProjectManager() {
  const { projects, loading, addProject, updateProject, deleteProject } = useProjects()
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [technologiesInput, setTechnologiesInput] = useState('')
  const [imageInputType, setImageInputType] = useState<'url' | 'upload'>('url')
  const [isUploading, setIsUploading] = useState(false)
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    description: '',
    technologies: [],
    githubUrl: '',
    liveUrl: '',
    imageUrl: ''
  })

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      technologies: [],
      githubUrl: '',
      liveUrl: '',
      imageUrl: ''
    })
    setTechnologiesInput('')
    setImageInputType('url')
    setIsEditing(null)
    setShowAddForm(false)
  }

  const handleImageUpload = async (file: File) => {
    setIsUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('image', file)
      
      // Get auth token from localStorage (assuming you have auth setup)
      const token = localStorage.getItem('adminToken') || 'dummy-token'
      
      const response = await fetch('/api/projects/upload-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Upload failed' }))
        const errorMessage = (errorData as { error?: string }).error || 'Upload failed'
        throw new Error(errorMessage)
      }
      
      const result = await response.json()
      
      // Update form data with the uploaded image URL
      setFormData(prev => ({ ...prev, imageUrl: result.imageUrl }))
      toast.success('Image uploaded successfully!')
      
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Parse technologies from input string
    const technologies = technologiesInput.split(',').map(tech => tech.trim()).filter(Boolean)
    
    try {
      if (isEditing) {
        await updateProject(isEditing, { ...formData, technologies })
        toast.success('Project updated successfully!')
      } else {
        await addProject({ ...formData, technologies } as Omit<Project, 'id'>)
        toast.success('Project added successfully!')
      }
      resetForm()
    } catch {
      toast.error('Failed to save project')
    }
  }

  const handleEdit = (project: Project) => {
    setFormData(project)
    setTechnologiesInput(project.technologies.join(', '))
    setIsEditing(project.id)
    setShowAddForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(id)
        toast.success('Project deleted successfully!')
      } catch {
        toast.error('Failed to delete project')
      }
    }
  }

  if (loading) {
    return (
      <div className="text-center text-white">
        <div className="font-mono">$ loading projects...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white font-mono">$ manage projects</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <PlusIcon size={16} />
          Add Project
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
              {isEditing ? '$ edit project' : '$ add project'}
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
                <label className="block text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Project Image</label>
                
                {/* Image Input Type Selector */}
                <div className="flex gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setImageInputType('url')}
                    className={`flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
                      imageInputType === 'url'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <LinkIcon size={14} />
                    URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageInputType('upload')}
                    className={`flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
                      imageInputType === 'upload'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <UploadIcon size={14} />
                    Upload
                  </button>
                </div>

                {/* URL Input */}
                {imageInputType === 'url' && (
                  <input
                    type="url"
                    value={formData.imageUrl || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                    className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                    placeholder="https://example.com/image.jpg"
                  />
                )}

                {/* File Upload */}
                {imageInputType === 'upload' && (
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          handleImageUpload(file)
                        }
                      }}
                      className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                      disabled={isUploading}
                    />
                    {isUploading && (
                      <div className="flex items-center gap-2 text-blue-400 text-sm">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                        Uploading image...
                      </div>
                    )}
                    {formData.imageUrl && imageInputType === 'upload' && (
                      <div className="text-green-400 text-sm">
                        ✓ Image uploaded successfully
                      </div>
                    )}
                  </div>
                )}

                {/* Image Preview */}
                {formData.imageUrl && (
                    <div className="mt-3">
                    <Image
                      src={formData.imageUrl}
                      alt="Project preview"
                      width={200}
                      height={128}
                      className="w-full max-w-xs h-32 object-cover rounded border border-gray-600"
                      onError={() => {
                      setFormData(prev => ({ ...prev, imageUrl: '' }))
                      toast.error('Failed to load image')
                      }}
                    />
                    </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Description</label>
              <textarea
                required
                rows={3}
                value={formData.description || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Technologies (comma-separated)</label>
              <input
                type="text"
                value={technologiesInput}
                onChange={(e) => setTechnologiesInput(e.target.value)}
                className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                placeholder="React, Node.js, Docker"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-2">GitHub URL</label>
                <input
                  type="url"
                  required
                  value={formData.githubUrl || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
                  className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Live URL (optional)</label>
                <input
                  type="url"
                  value={formData.liveUrl || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, liveUrl: e.target.value }))}
                  className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <SaveIcon size={16} />
                {isEditing ? 'Update' : 'Add'} Project
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

      {/* Projects List */}
      <div className="grid gap-4">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-800 border border-gray-600 rounded-lg p-4 flex justify-between items-start"
          >
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
              <p className="text-gray-300 mb-2">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {project.technologies.map(tech => (
                  <span
                    key={tech}
                    className="bg-blue-600 text-white px-2 py-1 rounded text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="text-sm text-gray-400">
                <div>GitHub: {project.githubUrl}</div>
                {project.liveUrl && <div>Live: {project.liveUrl}</div>}
              </div>
            </div>
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => handleEdit(project)}
                className="text-blue-400 hover:text-blue-300 p-2"
              >
                <EditIcon size={16} />
              </button>
              <button
                onClick={() => handleDelete(project.id)}
                className="text-red-400 hover:text-red-300 p-2"
              >
                <TrashIcon size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center text-gray-400 py-8">
          <div className="font-mono">$ ls projects/</div>
          <div className="mt-2">No projects found. Add your first project!</div>
        </div>
      )}
    </div>
  )
}