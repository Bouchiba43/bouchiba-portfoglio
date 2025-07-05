// lib/auth-admin.ts
import { initializeApp, getApps } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

// Initialize Firebase Admin SDK
if (!getApps().length) {
  // For development, we'll use a simpler approach
  // In production, you should use a service account key
  initializeApp({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  })
}

const adminAuth = getAuth()

export async function verifyAuthToken(idToken: string) {
  try {
    if (!idToken || idToken === 'null' || idToken === 'undefined') {
      throw new Error('No authentication token provided')
    }

    const decodedToken = await adminAuth.verifyIdToken(idToken)
    return { 
      valid: true, 
      uid: decodedToken.uid,
      email: decodedToken.email 
    }
  } catch (error) {
    console.error('Auth verification error:', error)
    return { 
      valid: false, 
      error: error instanceof Error ? error.message : 'Invalid token' 
    }
  }
}

export { adminAuth }