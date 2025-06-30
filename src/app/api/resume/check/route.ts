import { NextResponse } from 'next/server'
import { existsSync } from 'fs'
import path from 'path'

export async function GET() {
  try {
    const resumePath = path.join(process.cwd(), 'public', 'uploads', 'resume.pdf')
    
    if (existsSync(resumePath)) {
      return NextResponse.json({ 
        exists: true,
        filename: 'resume.pdf'
      })
    } else {
      return NextResponse.json({ 
        exists: false,
        filename: null
      })
    }
  } catch (error) {
    console.error('Check resume error:', error)
    return NextResponse.json(
      { error: 'Failed to check resume status' },
      { status: 500 }
    )
  }
}