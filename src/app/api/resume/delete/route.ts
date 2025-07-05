import { NextResponse } from 'next/server'
import { db } from '@/app/lib/firebase'
import { doc, deleteDoc, getDoc } from 'firebase/firestore'

export async function DELETE(request: Request) {
  try {
    // Simple token check - in a real production app, you'd want more robust auth
    const authHeader = request.headers.get('authorization')
    const idToken = authHeader?.replace('Bearer ', '')
    
    if (!idToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const resumeDoc = doc(db, 'resume', 'current')
    
    // Check if document exists first
    const docSnap = await getDoc(resumeDoc)
    if (!docSnap.exists()) {
      return NextResponse.json(
        { error: 'Resume not found' },
        { status: 404 }
      )
    }
    
    // Delete the document
    await deleteDoc(resumeDoc)
    
    return NextResponse.json({ 
      message: 'Resume deleted successfully'
    })

  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete resume' },
      { status: 500 }
    )
  }
}