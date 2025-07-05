import { NextResponse } from 'next/server'
import { db } from '@/app/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

export async function GET() {
  try {
    const resumeDoc = doc(db, 'resume', 'current')
    const docSnap = await getDoc(resumeDoc)
    
    if (!docSnap.exists()) {
      return NextResponse.json(
        { error: 'Resume not found' },
        { status: 404 }
      )
    }

    const resumeData = docSnap.data()
    const base64Data = resumeData.data
    const buffer = Buffer.from(base64Data, 'base64')

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="resume.pdf"',
        'Content-Length': buffer.length.toString(),
      },
    })

  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json(
      { error: 'Failed to download resume' },
      { status: 500 }
    )
  }
}