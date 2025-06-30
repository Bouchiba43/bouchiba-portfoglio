import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/app/lib/firebase'
import { collection, addDoc } from 'firebase/firestore'

// Email validation function
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Input sanitization
const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '')
}

export async function POST(request: NextRequest) {
  try {
    console.log('Contact form API called')
    
    const { name, email, message } = await request.json()
    console.log('Received data:', { name, email: email?.substring(0, 5) + '...', messageLength: message?.length })

    // Validate required fields
    if (!name || !email || !message) {
      console.log('Missing required fields')
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name)
    const sanitizedEmail = sanitizeInput(email)
    const sanitizedMessage = sanitizeInput(message)

    // Server-side validation
    if (sanitizedName.length < 2) {
      console.log('Name too short:', sanitizedName.length)
      return NextResponse.json(
        { error: 'Name must be at least 2 characters' },
        { status: 400 }
      )
    }

    if (!validateEmail(sanitizedEmail)) {
      console.log('Invalid email format:', sanitizedEmail)
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      )
    }

    if (sanitizedMessage.length < 10) {
      console.log('Message too short:', sanitizedMessage.length)
      return NextResponse.json(
        { error: 'Message must be at least 10 characters' },
        { status: 400 }
      )
    }

    if (sanitizedMessage.length > 500) {
      console.log('Message too long:', sanitizedMessage.length)
      return NextResponse.json(
        { error: 'Message must be less than 500 characters' },
        { status: 400 }
      )
    }

    console.log('Validation passed, attempting to save to Firestore...')

    // Test Firebase connection
    if (!db) {
      console.error('Firebase db is not initialized')
      return NextResponse.json(
        { error: 'Database connection error' },
        { status: 500 }
      )
    }

    // Save contact message to Firestore
    const docData = {
      name: sanitizedName,
      email: sanitizedEmail,
      message: sanitizedMessage,
      createdAt: new Date(),
      status: 'new',
      userAgent: request.headers.get('user-agent') || 'unknown',
      clientIP: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    }

    console.log('Attempting to save document to Firestore...')
    const docRef = await addDoc(collection(db, 'contacts'), docData)
    console.log('Document saved successfully with ID:', docRef.id)

    console.log('Contact form submission saved:', {
      name: sanitizedName,
      email: sanitizedEmail,
      timestamp: new Date().toISOString(),
      docId: docRef.id
    })

    return NextResponse.json(
      { message: 'Message sent successfully!' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact form detailed error:', error)
    console.error('Error name:', error instanceof Error ? error.name : 'Unknown')
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error')
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    )
  }
}