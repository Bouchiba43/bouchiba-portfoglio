'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/app/lib/firebase'
import { EyeIcon, EyeOffIcon, LockIcon, UserPlusIcon } from 'lucide-react'
import toast from 'react-hot-toast'

interface AdminLoginProps {
  onLogin: () => void
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isSignupMode, setIsSignupMode] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isSignupMode) {
        // Create new admin user
        await createUserWithEmailAndPassword(auth, email, password)
        toast.success('Admin account created successfully!')
      } else {
        // Sign in existing user
        await signInWithEmailAndPassword(auth, email, password)
        toast.success('Login successful!')
      }
      onLogin()
    } catch (error: unknown) {
      const firebaseError = error as { code?: string }
      if (firebaseError.code === 'auth/email-already-in-use') {
        toast.error('Email already exists. Try logging in instead.')
        setIsSignupMode(false)
      } else if (firebaseError.code === 'auth/user-not-found') {
        toast.error('No admin account found. Create one first.')
        setIsSignupMode(true)
      } else if (firebaseError.code === 'auth/wrong-password') {
        toast.error('Invalid password')
      } else {
        toast.error(isSignupMode ? 'Failed to create account' : 'Invalid credentials')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900 border border-green-500 rounded-lg p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <LockIcon className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white font-mono">
            {isSignupMode ? 'Create Admin Account' : 'Admin Access'}
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            $ sudo {isSignupMode ? 'useradd' : 'login'}
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-300 mb-2 font-mono">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white focus:border-green-500 focus:outline-none font-mono"
              placeholder="admin@portfolio.dev"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2 font-mono">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white focus:border-green-500 focus:outline-none font-mono pr-10"
                placeholder="••••••••"
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white py-2 rounded transition-colors font-mono flex items-center justify-center gap-2"
          >
            {loading ? (
              'Processing...'
            ) : isSignupMode ? (
              <>
                <UserPlusIcon size={16} />
                Create Admin Account
              </>
            ) : (
              'Login'
            )}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsSignupMode(!isSignupMode)}
              className="text-blue-400 hover:text-blue-300 text-sm font-mono"
            >
              {isSignupMode 
                ? '← Back to Login' 
                : 'Need to create admin account? →'
              }
            </button>
          </div>
        </form>

        {isSignupMode && (
          <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded text-yellow-300 text-xs font-mono">
            ⚠️ This will create your first admin account. Keep these credentials safe!
          </div>
        )}
      </motion.div>
    </div>
  )
}