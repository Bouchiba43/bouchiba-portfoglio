import { NextResponse } from 'next/server'
import { storage } from '@/app/lib/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export async function GET() {
  try {
    // Test Firebase Storage connection
    const testRef = ref(storage, 'test/connection-test.txt')
    const testData = new Uint8Array([72, 101, 108, 108, 111]) // "Hello" in bytes
    
    console.log('Testing Firebase Storage connection...')
    console.log('Storage bucket:', process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET)
    
    const snapshot = await uploadBytes(testRef, testData)
    const downloadURL = await getDownloadURL(snapshot.ref)
    
    return NextResponse.json({ 
      success: true,
      message: 'Firebase Storage is working',
      downloadURL,
      bucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
    })
    
  } catch (error) {
    console.error('Firebase Storage test error:', error)
    
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      code: (error as { code?: string })?.code,
      status: (error as { status_?: string })?.status_,
      customData: (error as { customData?: unknown })?.customData,
      bucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
    }, { status: 500 })
  }
}