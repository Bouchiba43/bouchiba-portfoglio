'use client'

import { useState, useRef, useEffect } from 'react'
import { UploadIcon, FileIcon, DownloadIcon, TrashIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { auth } from '@/app/lib/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'

export default function ResumeManager() {
  const [uploading, setUploading] = useState(false)
  const [currentResume, setCurrentResume] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [user] = useAuthState(auth)

  // Check if resume exists on component mount
  useEffect(() => {
    checkResumeExists()
  }, [])

  const getAuthToken = async () => {
    if (!user) {
      throw new Error('Not authenticated')
    }
    return await user.getIdToken()
  }

  const checkResumeExists = async () => {
    try {
      const response = await fetch('/api/resume/check')
      if (response.ok) {
        const data = await response.json()
        setCurrentResume(data.filename)
      }
    } catch (error) {
      console.error('Error checking resume:', error)
    }
  }

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (file.type !== 'application/pdf') {
      toast.error('Please select a PDF file')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB')
      return
    }

    setUploading(true)
    
    try {
      const token = await getAuthToken()
      const formData = new FormData()
      formData.append('resume', file)

      const response = await fetch('/api/resume/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setCurrentResume(data.filename)
        toast.success('Resume uploaded successfully!')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to upload resume')
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload resume')
    } finally {
      setUploading(false)
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDeleteResume = async () => {
    if (!currentResume) return

    if (!confirm('Are you sure you want to delete the current resume?')) return

    try {
      const token = await getAuthToken()
      const response = await fetch('/api/resume/delete', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setCurrentResume(null)
        toast.success('Resume deleted successfully!')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to delete resume')
      }
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete resume')
    }
  }

  const handleDownloadResume = () => {
    if (currentResume) {
      window.open('/api/resume/download', '_blank')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold font-mono">Resume Management</h2>
      </div>

      {/* Current Resume Status */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-green-400">Current Resume</h3>
        
        {currentResume ? (
          <div className="flex items-center justify-between bg-gray-900 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <FileIcon className="w-8 h-8 text-red-500" />
              <div>
                <p className="font-medium text-white">{currentResume}</p>
                <p className="text-sm text-gray-400">PDF Document</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDownloadResume}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded transition-colors"
              >
                <DownloadIcon size={16} />
                Download
              </button>
              <button
                onClick={handleDeleteResume}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded transition-colors"
              >
                <TrashIcon size={16} />
                Delete
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <FileIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No resume uploaded yet</p>
          </div>
        )}
      </div>

      {/* Upload Section */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-green-400">
          {currentResume ? 'Update Resume' : 'Upload Resume'}
        </h3>
        
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            <UploadIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            
            <div className="space-y-2">
              <p className="text-lg font-medium">
                {currentResume ? 'Replace Current Resume' : 'Upload Your Resume'}
              </p>
              <p className="text-sm text-gray-400">
                PDF files only, max 5MB
              </p>
            </div>
            
            <button
              onClick={handleFileSelect}
              disabled={uploading}
              className="mt-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2 mx-auto"
            >
              <UploadIcon size={16} />
              {uploading ? 'Uploading...' : 'Select PDF File'}
            </button>
          </div>
          
          <div className="text-sm text-gray-400">
            <p className="mb-2">Requirements:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>File format: PDF only</li>
              <li>Maximum size: 5MB</li>
              <li>The uploaded resume will be available for download on your portfolio</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-300 mb-2">📋 Instructions</h4>
        <div className="text-sm text-yellow-200 space-y-1">
          <p>• Upload a PDF version of your resume</p>
          <p>• The resume will be automatically available for download on your portfolio</p>
          <p>• Visitors can download it using the &quot;Download Resume&quot; button</p>
          <p>• You can update or delete your resume anytime</p>
        </div>
      </div>
    </div>
  )
}