import { NextResponse } from 'next/server'
import { existsSync, readFileSync } from 'fs'
import path from 'path'

export async function GET() {
  try {
    const resumePath = path.join(process.cwd(), 'public', 'uploads', 'resume.pdf')
    
    if (!existsSync(resumePath)) {
      return NextResponse.json(
        { error: 'Resume not found' },
        { status: 404 }
      )
    }

    const file = readFileSync(resumePath)
    
    return new NextResponse(file, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Bouchiba_Ahmed_Seddik_Resume.pdf"',
        'Content-Length': file.length.toString(),
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