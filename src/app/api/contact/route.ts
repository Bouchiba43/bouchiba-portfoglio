import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/app/lib/firebase'
import { collection, addDoc } from 'firebase/firestore'
import { Resend } from 'resend'
import { z } from 'zod'

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY)

// Validation schema with Zod
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Invalid email format').max(100, 'Email must be less than 100 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(500, 'Message must be less than 500 characters')
})

// Email verification using Mailboxlayer
async function verifyEmailExists(email: string): Promise<{ valid: boolean; deliverable: boolean; error?: string }> {
  try {
    const apiKey = process.env.MAILBOXLAYER_API_KEY
    if (!apiKey) {
      console.warn('Mailboxlayer API key not configured, skipping email verification')
      return { valid: true, deliverable: true }
    }

    const response = await fetch(
      `http://apilayer.net/api/check?access_key=${apiKey}&email=${encodeURIComponent(email)}&smtp=1&format=1`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      console.error('Mailboxlayer API error:', response.status)
      return { valid: true, deliverable: true } // Fallback to allow submission
    }

    const result = await response.json()
    
    // Check for API errors
    if (result.error) {
      console.error('Mailboxlayer error:', result.error)
      return { valid: true, deliverable: true } // Fallback to allow submission
    }

    return {
      valid: result.format_valid && result.mx_found,
      deliverable: result.smtp_check,
      error: !result.format_valid ? 'Invalid email format' : 
             !result.mx_found ? 'Email domain does not exist' :
             !result.smtp_check ? 'Email address is not deliverable' : undefined
    }
  } catch (error) {
    console.error('Email verification error:', error)
    return { valid: true, deliverable: true } // Fallback to allow submission
  }
}

// Send notification email to you
async function sendNotificationEmail(name: string, email: string, message: string): Promise<void> {
  const fromEmail = process.env.CONTACT_FROM_EMAIL || 'contact@ahmedbouchiba.com'
  const toEmail = process.env.CONTACT_TO_EMAIL || 'Bouchibaahmed43@gmail.com'

  await resend.emails.send({
    from: fromEmail,
    to: toEmail,
    subject: `New Contact Form Message from ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
          New Contact Form Submission
        </h2>
        
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #374151;">Contact Information</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
        </div>
        
        <div style="margin: 20px 0;">
          <h3 style="color: #374151;">Message</h3>
          <div style="background-color: #ffffff; border: 1px solid #e5e7eb; padding: 15px; border-radius: 6px; white-space: pre-wrap;">${message}</div>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
          <p>Reply directly to this email to respond to ${name}.</p>
        </div>
      </div>
    `,
    replyTo: email,
  })
}

// Send thank you email to the sender
async function sendThankYouEmail(name: string, email: string): Promise<void> {
  const fromEmail = process.env.CONTACT_FROM_EMAIL || 'contact@ahmedbouchiba.com'

  await resend.emails.send({
    from: fromEmail,
    to: email,
    subject: 'Thank you for reaching out! - Ahmed Bouchiba',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; text-align: center;">Thank You, ${name}!</h1>
        </div>
        
        <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <p style="font-size: 16px; line-height: 1.6; color: #374151;">
            Thank you for reaching out through my portfolio website! I've received your message and really appreciate you taking the time to connect.
          </p>
          
          <div style="background-color: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #0c4a6e; font-weight: 500;">
              💡 What's next?
            </p>
            <p style="margin: 10px 0 0 0; color: #075985;">
              I typically respond within 24-48 hours. I'll review your message carefully and get back to you with a thoughtful response.
            </p>
          </div>
          
          <p style="color: #374151; line-height: 1.6;">
            In the meantime, feel free to:
          </p>
          
          <ul style="color: #374151; line-height: 1.8;">
            <li>🔗 Connect with me on <a href="https://linkedin.com/in/bouchiba43" style="color: #2563eb; text-decoration: none;">LinkedIn</a></li>
            <li>💻 Check out my projects on <a href="https://github.com/Bouchiba43" style="color: #2563eb; text-decoration: none;">GitHub</a></li>
            <li>📄 View my latest resume and certifications on my portfolio</li>
          </ul>
          
          <div style="background-color: #fefce8; border: 1px solid #fde047; border-radius: 6px; padding: 15px; margin: 25px 0;">
            <p style="margin: 0; color: #a16207; font-size: 14px;">
              <strong>Quick tip:</strong> If your inquiry is urgent or project-related, please include your timeline and any specific requirements in your message. This helps me provide more targeted assistance!
            </p>
          </div>
          
          <p style="color: #374151; line-height: 1.6; margin-top: 25px;">
            Best regards,<br>
            <strong>Ahmed Bouchiba</strong><br>
            <span style="color: #6b7280; font-size: 14px;">DevOps & Site Reliability Engineer</span>
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px;">
          <p>This is an automated response. Please don't reply to this email directly.</p>
          <p>For urgent matters, contact me at: Bouchibaahmed43@gmail.com</p>
        </div>
      </div>
    `,
  })
}

// Input sanitization
const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '')
}

export async function POST(request: NextRequest) {
  try {
    console.log('Contact form API called')
    
    // Parse and validate request body
    const body = await request.json()
    const validationResult = contactSchema.safeParse(body)
    
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map(issue => issue.message).join(', ')
      console.log('Validation failed:', errors)
      return NextResponse.json(
        { error: `Validation failed: ${errors}` },
        { status: 400 }
      )
    }

    const { name, email, message } = validationResult.data
    
    // Sanitize inputs
    const sanitizedName = sanitizeInput(name)
    const sanitizedEmail = sanitizeInput(email)
    const sanitizedMessage = sanitizeInput(message)

    console.log('Received data:', { 
      name: sanitizedName, 
      email: sanitizedEmail.substring(0, 5) + '...', 
      messageLength: sanitizedMessage.length 
    })

    // Verify email exists and is deliverable
    console.log('Verifying email address...')
    const emailVerification = await verifyEmailExists(sanitizedEmail)
    
    if (!emailVerification.valid) {
      console.log('Email verification failed:', emailVerification.error)
      return NextResponse.json(
        { error: emailVerification.error || 'Invalid email address' },
        { status: 400 }
      )
    }

    if (!emailVerification.deliverable) {
      console.log('Email not deliverable:', sanitizedEmail)
      return NextResponse.json(
        { error: 'Email address is not deliverable. Please check your email address.' },
        { status: 400 }
      )
    }

    console.log('Email verification passed')

    // Save contact message to Firestore
    const docData = {
      name: sanitizedName,
      email: sanitizedEmail,
      message: sanitizedMessage,
      createdAt: new Date(),
      status: 'new',
      emailVerified: true,
      userAgent: request.headers.get('user-agent') || 'unknown',
      clientIP: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    }

    console.log('Attempting to save document to Firestore...')
    const docRef = await addDoc(collection(db, 'contacts'), docData)
    console.log('Document saved successfully with ID:', docRef.id)

    // Send emails concurrently for better performance
    console.log('Sending emails...')
    try {
      await Promise.all([
        sendNotificationEmail(sanitizedName, sanitizedEmail, sanitizedMessage),
        sendThankYouEmail(sanitizedName, sanitizedEmail)
      ])
      console.log('Both emails sent successfully')
    } catch (emailError) {
      console.error('Email sending error:', emailError)
      // Don't fail the request if emails fail, just log the error
      // The contact is still saved in Firestore
    }

    console.log('Contact form submission completed successfully:', {
      name: sanitizedName,
      email: sanitizedEmail,
      timestamp: new Date().toISOString(),
      docId: docRef.id
    })

    return NextResponse.json(
      { 
        message: 'Message sent successfully! Thank you for reaching out. I\'ll get back to you soon.',
        id: docRef.id 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact form detailed error:', error)
    console.error('Error name:', error instanceof Error ? error.name : 'Unknown')
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error')
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later or contact me directly at Bouchibaahmed43@gmail.com.' },
      { status: 500 }
    )
  }
}