import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/lib/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Create the admin user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    
    return NextResponse.json({
      message: 'Admin user created successfully!',
      user: {
        uid: userCredential.user.uid,
        email: userCredential.user.email
      }
    })
  } catch (error: unknown) {
    console.error('Error creating admin user:', error)
    
    let errorMessage = 'Failed to create admin user'
    if (error instanceof Error && 'code' in error) {
      const firebaseError = error as { code: string }
      if (firebaseError.code === 'auth/email-already-in-use') {
        errorMessage = 'Email already exists'
      } else if (firebaseError.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak (minimum 6 characters)'
      } else if (firebaseError.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address'
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    )
  }
}