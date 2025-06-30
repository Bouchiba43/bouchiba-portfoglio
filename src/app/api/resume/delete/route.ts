import { NextResponse } from 'next/server'
import { existsSync, unlinkSync } from 'fs'
import path from 'path'

export async function DELETE() {
  try {
    const resumePath = path.join(process.cwd(), 'public', 'uploads', 'resume.pdf')
    
    if (!existsSync(resumePath)) {
      return NextResponse.json(
        { error: 'Resume not found' },
        { status: 404 }
      )
    }

    // Delete the file
    unlinkSync(resumePath)
    
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