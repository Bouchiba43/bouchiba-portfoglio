import { NextResponse } from 'next/server'
import { db } from '@/app/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'

export async function GET() {
  try {
    console.log('Testing Firebase connection...')
    
    // Test basic Firebase connection
    if (!db) {
      return NextResponse.json(
        { error: 'Firebase not initialized', status: 'error' },
        { status: 500 }
      )
    }

    // Try to read from Firestore (this will test permissions)
    const testCollection = collection(db, 'contacts')
    await getDocs(testCollection)
    
    return NextResponse.json(
      { message: 'Firebase connection successful', status: 'ok' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Firebase test error:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
        type: error instanceof Error ? error.constructor.name : 'Unknown'
      },
      { status: 500 }
    )
  }
}