import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '@/app/lib/firebase'

// Type definitions for Groq API responses
interface GroqCompletion {
  choices: Array<{
    message?: {
      content?: string;
    };
  }>;
}

interface GroqError extends Error {
  status?: number;
  message: string;
}

// Portfolio data interfaces
interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  githubUrl: string
  liveUrl?: string
  imageUrl: string
  order: number
  createdAt: Date
}

interface Experience {
  id: string
  company: string
  position: string
  description: string
  technologies: string[]
  startDate: Date
  endDate?: Date | null
  isCurrentRole: boolean
  location: string
  companyUrl?: string
  logoUrl?: string
  createdAt: Date
}

// Initialize Groq client with API key
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '' // You'll need to add this to your .env file
})

// List of supported models to try in order of preference
const SUPPORTED_MODELS = [
  "llama-3.3-70b-versatile",     // Latest Llama 3.3
  "llama-3.2-90b-text-preview", // Llama 3.2 90B
  "llama-3.1-8b-instant",       // Llama 3.1 8B (smaller but fast)
  "mixtral-8x7b-32768",         // Mixtral alternative
  "gemma2-9b-it"                // Gemma 2 fallback
]

async function callGroqWithFallback(messages: { role: 'system' | 'user' | 'assistant'; content: string }[], retryCount = 0): Promise<{ completion: GroqCompletion; model: string }> {
  const model = SUPPORTED_MODELS[retryCount]
  
  if (!model || retryCount >= SUPPORTED_MODELS.length) {
    throw new Error('All models failed or unavailable')
  }

  try {
    console.log(`Trying model: ${model}`)
    
    const completion = await groq.chat.completions.create({
      messages,
      model,
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 0.9,
      stream: false
    })

    console.log(`Success with model: ${model}`)
    return { completion: completion as GroqCompletion, model }
    
  } catch (error: unknown) {
    const groqError = error as GroqError
    console.error(`Model ${model} failed:`, groqError.message)
    
    // If model is decommissioned or not found, try next model
    if (groqError.status === 400 || groqError.message.includes('decommissioned') || groqError.message.includes('not found')) {
      console.log(`Falling back to next model...`)
      return callGroqWithFallback(messages, retryCount + 1)
    }
    
    // For other errors, throw immediately
    throw error
  }
}

// Fetch portfolio data from Firebase
async function getPortfolioData() {
  try {
    // Fetch projects
    const projectsQuery = query(collection(db, 'projects'), orderBy('order', 'asc'))
    const projectsSnapshot = await getDocs(projectsQuery)
    const projects = projectsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      order: doc.data().order ?? 0
    })) as Project[]

    // Fetch experiences
    const experiencesQuery = query(collection(db, 'experiences'), orderBy('startDate', 'desc'))
    const experiencesSnapshot = await getDocs(experiencesQuery)
    const experiences = experiencesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      startDate: doc.data().startDate?.toDate() || new Date(),
      endDate: doc.data().endDate?.toDate() || null,
      createdAt: doc.data().createdAt?.toDate() || new Date()
    })) as Experience[]

    return { projects, experiences }
  } catch (error) {
    console.error('Error fetching portfolio data:', error)
    return { projects: [], experiences: [] }
  }
}

// Generate dynamic context with real portfolio data
async function generateAhmedContext() {
  const { projects, experiences } = await getPortfolioData()
  
  // Generate concise projects section
  const projectsContext = projects.length > 0 ? `
PROJECTS: ${projects.map(p => `${p.title} (${p.technologies.slice(0,3).join(', ')})`).join(' | ')}` : ''

  // Generate concise experiences section  
  const experiencesContext = experiences.length > 0 ? `
EXPERIENCE: ${experiences.map(exp => {
    const duration = exp.isCurrentRole ? 'Current' : 'Past'
    return `${exp.position} at ${exp.company} (${duration})`
  }).join(' | ')}` : ''

  return `
You are Ahmed Bouchiba's AI DevOps Assistant. Ahmed is a Senior DevOps Engineer with 3+ years experience.

PROFILE:
Name: Bouchiba Ahmed Seddik | Role: Senior DevOps Engineer | Location: Sousse, Tunisia
Email: Bouchibaahmed43@gmail.com | LinkedIn: linkedin.com/in/bouchiba43 | GitHub: github.com/Bouchiba43

SKILLS: Docker, Kubernetes, Jenkins, GitHub Actions, ArgoCD, Terraform, Ansible, AWS, GCP, Azure, Prometheus, Grafana, Go, Python, FastAPI, Next.js

${projectsContext}
${experiencesContext}

KEY PROJECTS:
• Ritual Growth: Go Gin backend, authentication system, PostgreSQL, Ginkgo/Gomega testing, Cobra data generator
• SpoutBreeze: Open source webinar platform based on BigBlueButton for large audiences

ACHIEVEMENTS: 50+ cloud deployments, 99.9% uptime, 70% faster deployments, 500+ containers managed

Be helpful, professional, and technical. Offer contact info and project details when relevant. Keep responses concise but informative.
`
}

// Update the POST function to use dynamic context that includes real portfolio data from the database
export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory = [] } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Check if Groq API key is configured
    if (!process.env.GROQ_API_KEY) {
      console.error('GROQ_API_KEY not configured')
      return NextResponse.json({
        response: "I'm temporarily unavailable. Please contact Ahmed directly at Bouchibaahmed43@gmail.com for immediate assistance with your DevOps needs.",
        quickReplies: ['Contact Ahmed directly', 'View projects', 'Check GitHub'],
        conversationId: `conv_${Date.now()}`,
        timestamp: new Date().toISOString()
      })
    }

    // Generate dynamic context with real portfolio data
    const dynamicContext = await generateAhmedContext()

    // Build conversation context
    const messages = [
      {
        role: "system" as const,
        content: dynamicContext
      },
      // Add conversation history
      ...conversationHistory.slice(-6).map((msg: { isBot: boolean; text: string }) => ({
        role: msg.isBot ? "assistant" as const : "user" as const,
        content: msg.text
      })),
      // Add current user message
      {
        role: "user" as const,
        content: message
      }
    ]

    // Call Groq API with model fallback
    const { completion, model } = await callGroqWithFallback(messages)

    const aiResponse = completion.choices[0]?.message?.content || "I'm having trouble processing that request. Could you please rephrase your question about Ahmed's DevOps experience?"

    // Generate intelligent quick replies based on the conversation
    const quickReplies = generateQuickReplies(message, aiResponse)

    return NextResponse.json({
      response: aiResponse,
      quickReplies,
      conversationId: `conv_${Date.now()}`,
      timestamp: new Date().toISOString(),
      model, // Return which model was used
      confidence: 0.95
    })

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Groq API error:', error.message)
    } else {
      console.error('Groq API error:', error)
    }
    
    // Provide helpful fallback response
    const fallbackResponse = generateFallbackResponse()
    
    return NextResponse.json({
      response: fallbackResponse.text,
      quickReplies: fallbackResponse.quickReplies,
      conversationId: `conv_${Date.now()}`,
      timestamp: new Date().toISOString(),
      error: 'AI_TEMPORARY_UNAVAILABLE'
    })
  }
}

function generateQuickReplies(userMessage: string, aiResponse: string): string[] {
  const message = userMessage.toLowerCase()
  const response = aiResponse.toLowerCase()

  // Smart quick reply generation based on context
  if (message.includes('kubernetes') || message.includes('k8s')) {
    return ['Tell me about GitOps with ArgoCD', 'Show Kubernetes monitoring setup', 'Kubernetes security practices', 'Contact about K8s project']
  }
  
  if (message.includes('ci/cd') || message.includes('jenkins') || message.includes('pipeline')) {
    return ['Pipeline security integration', 'Deployment strategies', 'Jenkins vs GitHub Actions', 'View CI/CD projects']
  }
  
  if (message.includes('cloud') || message.includes('aws') || message.includes('azure')) {
    return ['Multi-cloud architecture', 'Cost optimization strategies', 'Cloud security practices', 'Infrastructure as Code']
  }
  
  if (message.includes('terraform') || message.includes('infrastructure')) {
    return ['Terraform best practices', 'State management', 'Multi-cloud modules', 'IaC security']
  }
  
  if (message.includes('monitoring') || message.includes('prometheus') || message.includes('grafana')) {
    return ['Alerting strategies', 'Custom metrics setup', 'Grafana dashboards', 'Observability best practices']
  }
  
  if (message.includes('contact') || message.includes('hire') || message.includes('availability')) {
    return ['Send email now', 'View LinkedIn profile', 'Check GitHub projects', 'Download resume']
  }
  
  if (message.includes('project') || response.includes('project')) {
    return ['View GitHub repository', 'See implementation details', 'Discuss similar projects', 'Contact for collaboration']
  }
  
  if (message.includes('experience') || message.includes('background')) {
    return ['View detailed resume', 'See project portfolio', 'Discuss opportunities', 'Technical certifications']
  }

  // Default intelligent replies
  return [
    'Tell me more about this',
    'Show me related projects', 
    'What tools are used for this?',
    'How can I contact Ahmed?'
  ]
}

function generateFallbackResponse(): { text: string, quickReplies: string[] } {
  return {
    text: "🤖 I'm Ahmed's AI assistant, but I'm experiencing a temporary connection issue with the AI service. However, I can still help you!\n\n🔗 **Direct Contact Options:**\n• **Email:** Bouchibaahmed43@gmail.com\n• **LinkedIn:** linkedin.com/in/bouchiba43\n• **GitHub:** github.com/Bouchiba43\n\n📋 **What I can tell you about Ahmed:**\n• 3+ years DevOps experience\n• Kubernetes & Docker expert\n• CI/CD pipeline specialist\n• Multi-cloud infrastructure (AWS, GCP, Azure)\n• 99.9% uptime achieved across projects\n\n💡 **Try asking:** 'Show me his Kubernetes projects' or 'Tell me about his CI/CD experience'",
    quickReplies: [
      'Contact Ahmed directly',
      'View projects section', 
      'Check GitHub profile',
      'Download resume'
    ]
  }
}
