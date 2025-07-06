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
    const file = formData.get('image') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type (images only)
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 })
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const base64 = Buffer.from(bytes).toString('base64')
    
    // Generate unique filename
    const timestamp = Date.now()
    const extension = file.name.split('.').pop() || 'jpg'
    const filename = `project_${timestamp}.${extension}`

    // Store in Firestore as base64
    const imageDoc = doc(db, 'project-images', filename)
    await setDoc(imageDoc, {
      filename,
      data: base64,
      contentType: file.type,
      size: file.size,
      uploadedAt: new Date()
    })

    // Return the data URL that can be used as image source
    const dataUrl = `data:${file.type};base64,${base64}`

    return NextResponse.json({ 
      message: 'Image uploaded successfully',
      filename,
      imageUrl: dataUrl
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    )
  }
}