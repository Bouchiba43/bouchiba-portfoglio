'use client'

import { useState, useEffect } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '@/app/lib/firebase'
import { User } from '@/app/types'
import AdminLogin from '@/app/components/admin/AdminLogin'
import ProjectManager from '@/app/components/admin/ProjectManager'
import ExperienceManager from '@/app/components/admin/ExperienceManager'
import ResumeManager from '@/app/components/admin/ResumeManager'
import { LogOutIcon, FolderIcon, FileTextIcon, BriefcaseIcon, FileIcon } from 'lucide-react'
import { Toaster } from 'react-hot-toast'
import toast from 'react-hot-toast'

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('projects')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName || undefined
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      toast.success('Logged out successfully!')
    } catch {
      toast.error('Failed to logout')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white font-mono">$ authenticating...</div>
      </div>
    )
  }

  if (!user) {
    return <AdminLogin onLogin={() => {}} />
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-700 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold font-mono">$ admin dashboard</h1>
            <p className="text-sm text-gray-400">Welcome, {user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
          >
            <LogOutIcon size={16} />
            Logout
          </button>
        </div>
      </header>

      <div className="container mx-auto p-4">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="bg-gray-900 border border-gray-700 rounded-lg p-4">
              <h2 className="text-lg font-bold mb-4 font-mono">Navigation</h2>
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab('projects')}
                  className={`w-full flex items-center gap-2 p-3 rounded transition-colors ${
                    activeTab === 'projects'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <FolderIcon size={16} />
                  Projects
                </button>
                <button
                  onClick={() => setActiveTab('experience')}
                  className={`w-full flex items-center gap-2 p-3 rounded transition-colors ${
                    activeTab === 'experience'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <BriefcaseIcon size={16} />
                  Experience
                </button>
                <button
                  onClick={() => setActiveTab('resume')}
                  className={`w-full flex items-center gap-2 p-3 rounded transition-colors ${
                    activeTab === 'resume'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <FileIcon size={16} />
                  Resume
                </button>
                <button
                  onClick={() => setActiveTab('blog')}
                  className={`w-full flex items-center gap-2 p-3 rounded transition-colors ${
                    activeTab === 'blog'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <FileTextIcon size={16} />
                  Blog Posts
                </button>
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              {activeTab === 'projects' && <ProjectManager />}
              {activeTab === 'experience' && <ExperienceManager />}
              {activeTab === 'resume' && <ResumeManager />}
              {activeTab === 'blog' && (
                <div className="text-center text-gray-400 py-8">
                  <FileTextIcon className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">Blog Management</h3>
                  <p>Blog post management coming soon...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}