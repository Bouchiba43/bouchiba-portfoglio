import { useState, useEffect } from 'react'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy, query } from 'firebase/firestore'
import { db } from '@/app/lib/firebase'
import type { BlogPost } from '@/app/types'

export function useBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const q = query(collection(db, 'blogPosts'), orderBy('publishedAt', 'desc'))
      const querySnapshot = await getDocs(q)
      const postsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        publishedAt: doc.data().publishedAt?.toDate() || new Date(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as BlogPost[]
      setPosts(postsData)
    } catch (error) {
      console.error('Error fetching blog posts:', error)
      // For demo purposes, return mock data if Firebase fails
      setPosts(getMockPosts())
    } finally {
      setLoading(false)
    }
  }

  const addPost = async (post: Omit<BlogPost, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'blogPosts'), {
        ...post,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      const newPost = { 
        ...post, 
        id: docRef.id, 
        createdAt: new Date(),
        updatedAt: new Date()
      }
      setPosts(prev => [newPost, ...prev])
    } catch (error) {
      console.error('Error adding blog post:', error)
      throw error
    }
  }

  const updatePost = async (id: string, updates: Partial<BlogPost>) => {
    try {
      await updateDoc(doc(db, 'blogPosts', id), {
        ...updates,
        updatedAt: new Date()
      })
      setPosts(prev => prev.map(post => 
        post.id === id ? { ...post, ...updates, updatedAt: new Date() } : post
      ))
    } catch (error) {
      console.error('Error updating blog post:', error)
      throw error
    }
  }

  const deletePost = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'blogPosts', id))
      setPosts(prev => prev.filter(post => post.id !== id))
    } catch (error) {
      console.error('Error deleting blog post:', error)
      throw error
    }
  }

  return {
    posts,
    loading,
    addPost,
    updatePost,
    deletePost,
    refetch: fetchPosts
  }
}

// Mock data for demo purposes
function getMockPosts(): BlogPost[] {
  return [
    {
      id: '1',
      title: 'Getting Started with Kubernetes on AWS',
      content: 'Learn how to set up a production-ready Kubernetes cluster on AWS...',
      excerpt: 'A comprehensive guide to deploying Kubernetes on AWS with best practices for security and scalability.',
      slug: 'kubernetes-aws-guide',
      tags: ['Kubernetes', 'AWS', 'DevOps', 'Cloud'],
      published: true,
      publishedAt: new Date('2024-01-20'),
      readTime: 8,
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20')
    },
    {
      id: '2',
      title: 'Docker Best Practices for Production',
      content: 'Essential Docker practices for building secure, efficient containers...',
      excerpt: 'Discover the most important Docker best practices that will make your containers production-ready.',
      slug: 'docker-production-best-practices',
      tags: ['Docker', 'Containers', 'Security', 'Production'],
      published: true,
      publishedAt: new Date('2024-02-15'),
      readTime: 6,
      createdAt: new Date('2024-02-15'),
      updatedAt: new Date('2024-02-15')
    },
    {
      id: '3',
      title: 'Infrastructure as Code with Terraform',
      content: 'Master Infrastructure as Code using Terraform for multi-cloud deployments...',
      excerpt: 'Learn how to manage infrastructure across multiple cloud providers using Terraform modules and best practices.',
      slug: 'terraform-infrastructure-as-code',
      tags: ['Terraform', 'IaC', 'Multi-Cloud', 'Automation'],
      published: true,
      publishedAt: new Date('2024-03-10'),
      readTime: 10,
      createdAt: new Date('2024-03-10'),
      updatedAt: new Date('2024-03-10')
    }
  ]
}