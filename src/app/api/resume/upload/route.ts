import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/app/lib/firebase'
import { doc, setDoc } from 'firebase/firestore'

export async function POST(request: NextRequest) {
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

    const formData = await request.formData()
    const file = formData.get('resume') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 })
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const base64 = Buffer.from(bytes).toString('base64')

    // Store in Firestore as base64
    const resumeDoc = doc(db, 'resume', 'current')
    await setDoc(resumeDoc, {
      filename: 'resume.pdf',
      data: base64,
      contentType: 'application/pdf',
      size: file.size,
      uploadedAt: new Date()
    })

    return NextResponse.json({ 
      message: 'Resume uploaded successfully',
      filename: 'resume.pdf'
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload resume' },
      { status: 500 }
    )
  }
}