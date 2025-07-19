'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { UploadIcon, UserIcon, CameraIcon, TrashIcon, DownloadIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { auth } from '@/app/lib/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import Image from 'next/image'

export default function ProfileManager() {
  const [uploading, setUploading] = useState(false)
  const [currentAvatar, setCurrentAvatar] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [user] = useAuthState(auth)

  // Check if avatar exists on component mount
  useEffect(() => {
    checkAvatarExists()
  }, [])

  const getAuthToken = async () => {
    if (!user) {
      throw new Error('Not authenticated')
    }
    return await user.getIdToken()
  }

  const checkAvatarExists = async () => {
    try {
      const response = await fetch('/api/profile/avatar')
      if (response.ok) {
        const data = await response.json()
        setCurrentAvatar(data.imageUrl)
      }
    } catch (error) {
      console.error('Error checking avatar:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
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
      formData.append('avatar', file)

      const response = await fetch('/api/profile/upload-avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setCurrentAvatar(data.imageUrl)
        toast.success('Profile photo updated successfully!')
        // Trigger a page refresh to update all components using the avatar
        window.location.reload()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to upload profile photo')
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload profile photo')
    } finally {
      setUploading(false)
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDeleteAvatar = async () => {
    if (!confirm('Are you sure you want to delete the current profile photo?')) {
      return
    }

    try {
      // For now, we'll just clear the local state
      // In a real app, you'd want to delete from Firestore
      setCurrentAvatar(null)
      toast.success('Profile photo removed!')
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to remove profile photo')
    }
  }

  if (loading) {
    return (
      <div className="text-center text-white">
        <div className="font-mono">$ loading profile...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold font-mono">Profile Management</h2>
      </div>

      {/* Current Avatar Status */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-green-400">Current Profile Photo</h3>
        
        {currentAvatar ? (
          <div className="flex items-center justify-between bg-gray-900 p-4 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Image
                  src={currentAvatar}
                  alt="Profile Photo"
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
                  <CameraIcon size={12} className="text-white" />
                </div>
              </div>
              <div>
                <p className="font-medium text-white">Profile Photo Active</p>
                <p className="text-sm text-gray-400">Your photo is displayed on the portfolio</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDeleteAvatar}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded transition-colors"
              >
                <TrashIcon size={16} />
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <UserIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No profile photo uploaded yet</p>
            <p className="text-sm mt-2">Upload a photo to personalize your portfolio</p>
          </div>
        )}
      </div>

      {/* Upload Section */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-green-400">
          {currentAvatar ? 'Update Profile Photo' : 'Upload Profile Photo'}
        </h3>
        
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            <UploadIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            
            <div className="space-y-2">
              <p className="text-lg font-medium">
                {currentAvatar ? 'Replace Current Photo' : 'Upload Your Profile Photo'}
              </p>
              <p className="text-sm text-gray-400">
                JPG, PNG, or GIF files only, max 5MB
              </p>
            </div>
            
            <button
              onClick={handleFileSelect}
              disabled={uploading}
              className="mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2 mx-auto"
            >
              <UploadIcon size={16} />
              {uploading ? 'Uploading...' : 'Select Image File'}
            </button>
          </div>
          
          <div className="text-sm text-gray-400">
            <p className="mb-2">Requirements:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>File format: JPG, PNG, or GIF</li>
              <li>Maximum size: 5MB</li>
              <li>Recommended: Square image (1:1 aspect ratio)</li>
              <li>The uploaded photo will be displayed on your portfolio</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-blue-400">Profile Photo Guidelines</h3>
        <div className="space-y-3 text-sm text-gray-300">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
            <p>Use a professional headshot or clear portrait photo</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
            <p>Ensure good lighting and a neutral background</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
            <p>Square images work best for the circular display format</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
            <p>Your photo will appear in the Hero section and About section of your portfolio</p>
          </div>
        </div>
      </div>
    </div>
  )
} 