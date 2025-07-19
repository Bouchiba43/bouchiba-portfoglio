import { NextResponse } from 'next/server'
import { db } from '@/app/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

export async function GET() {
  try {
    const avatarDoc = doc(db, 'profile', 'avatar')
    const docSnap = await getDoc(avatarDoc)
    
    if (!docSnap.exists()) {
      return NextResponse.json(
        { error: 'Avatar not found' },
        { status: 404 }
      )
    }

    const avatarData = docSnap.data()
    const dataUrl = `data:${avatarData.contentType};base64,${avatarData.data}`

    return NextResponse.json({ 
      imageUrl: dataUrl,
      filename: avatarData.filename,
      uploadedAt: avatarData.uploadedAt
    })

  } catch (error) {
    console.error('Avatar fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch avatar' },
      { status: 500 }
    )
  }
} 