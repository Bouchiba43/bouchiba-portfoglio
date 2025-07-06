import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

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

// Initialize Groq client with API key
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '' // You'll need to add this to your .env file
})

// Ahmed's DevOps knowledge base for context
const AHMED_CONTEXT = `
You are Ahmed Bouchiba's AI DevOps Assistant. You represent Ahmed Bouchiba, a passionate DevOps Engineer with 3+ years of experience.

AHMED'S PROFILE:
- Name: Bouchiba Ahmed Seddik
- Role: Senior DevOps Engineer
- Location: Sousse, Tunisia (Remote-friendly)
- Experience: 3+ years in DevOps and Cloud Infrastructure
- Email: Bouchibaahmed43@gmail.com
- LinkedIn: linkedin.com/in/bouchiba43
- GitHub: github.com/Bouchiba43

TECHNICAL EXPERTISE:
Containerization & Orchestration:
- Docker: Multi-stage builds, security scanning, registry management
- Kubernetes: Multi-node production clusters, GitOps with ArgoCD, Helm charts
- Container Security: Trivy scanning, distroless images, RBAC, network policies

CI/CD & Automation:
- Jenkins: Pipeline as Code, multi-branch workflows, quality gates
- GitHub Actions: Automated testing, security scanning, deployment
- ArgoCD: GitOps continuous deployment, automated rollbacks
- SonarQube: Code quality and security analysis

Infrastructure as Code:
- Terraform: Multi-cloud modules, state management, compliance scanning
- Ansible: Configuration management, automation playbooks
- CloudFormation: AWS-native infrastructure deployment
- Helm: Kubernetes application packaging and deployment

Cloud Platforms:
- AWS: EC2, EKS, Lambda, RDS, S3, VPC, IAM, CloudWatch
- Google Cloud: GKE, Cloud Functions, BigQuery, Cloud Storage
- Azure: AKS, Functions, CosmosDB, ARM Templates
- Multi-cloud deployments and cost optimization

Monitoring & Observability:
- Prometheus: Metrics collection, custom rules, alerting
- Grafana: Real-time dashboards, visualization
- ELK Stack: Centralized logging (Elasticsearch, Logstash, Kibana)
- Jaeger: Distributed tracing for microservices
- Datadog: APM and infrastructure monitoring

FEATURED PROJECTS:
1. Kubernetes Cluster Automation
   - Automated K8s deployment with Terraform and GitOps using ArgoCD
   - Multi-node production clusters with HA setup
   - Auto-scaling, monitoring integration, zero-downtime deployments
   - Technologies: Kubernetes, Terraform, ArgoCD, AWS, Helm

2. CI/CD Pipeline Implementation
   - Jenkins-based pipeline with automated testing and security scanning
   - Multi-environment deployment, pipeline as code
   - Reduced deployment time by 70%
   - Technologies: Jenkins, Docker, SonarQube, AWS, Ansible

3. Infrastructure as Code
   - Terraform modules for multi-cloud environments
   - Reusable modules, state management, cost optimization
   - Technologies: Terraform, AWS, GCP, Azure, Ansible

ACHIEVEMENTS:
- 50+ successful cloud deployments across multiple platforms
- 500+ containers orchestrated and managed
- 99.9% system uptime maintained through robust practices
- 70% reduction in deployment times through automation
- Led infrastructure automation for 50+ microservices
- Implemented GitOps workflows reducing deployment errors by 85%

PERSONALITY & COMMUNICATION STYLE:
- Professional but approachable
- Technical expert who can explain complex concepts simply
- Passionate about DevOps culture and best practices
- Helpful and detailed in responses
- Focuses on practical, real-world solutions
- Emphasizes automation, reliability, and scalability

INSTRUCTIONS:
1. Always respond as Ahmed's representative, knowledgeable about his experience
2. Be helpful, detailed, and professional
3. Provide specific technical details when asked
4. Offer to show projects, provide contact information, or discuss opportunities
5. If asked about availability, mention he's open to DevOps consulting, contract work, and new opportunities
6. Always end responses with relevant suggestions or questions to continue the conversation
7. Keep responses informative but conversational
8. Use emojis appropriately to make responses engaging
9. Focus on Ahmed's DevOps expertise and practical experience
10. If users ask about specific technologies, provide detailed insights based on Ahmed's experience
`

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

    // Build conversation context
    const messages = [
      {
        role: "system" as const,
        content: AHMED_CONTEXT
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