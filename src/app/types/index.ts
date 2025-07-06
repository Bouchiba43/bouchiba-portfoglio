export interface Project {
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

export interface Experience {
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

export interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  slug: string
  tags: string[]
  published: boolean
  publishedAt: Date
  readTime: number
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  email: string
  displayName?: string
}