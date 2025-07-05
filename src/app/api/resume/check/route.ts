import { NextResponse } from 'next/server'
import { db } from '@/app/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

export async function GET() {
  try {
    const resumeDoc = doc(db, 'resume', 'current')
    const docSnap = await getDoc(resumeDoc)
    
    if (!docSnap.exists()) {
      return NextResponse.json({ 
        exists: false,
        filename: null
      })
    }

    const resumeData = docSnap.data()
    
    return NextResponse.json({ 
      exists: true,
      filename: resumeData.filename || 'resume.pdf'
    })

  } catch (error) {
    console.error('Check resume error:', error)
    return NextResponse.json(
      { error: 'Failed to check resume status' },
      { status: 500 }
    )
  }
}