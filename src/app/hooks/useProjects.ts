// hooks/useProjects.ts
import { useState, useEffect } from 'react'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy, query } from 'firebase/firestore'
import { db } from '@/app/lib/firebase'
import type { Project } from '@/app/types'

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      console.log('Fetching projects from Firestore...')
      const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      const projectsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as Project[]
      console.log('Projects fetched successfully:', projectsData.length)
      setProjects(projectsData)
    } catch (error) {
      console.error('Error fetching projects:', error)
      // Use mock data if Firebase fails
      console.log('Using mock data as fallback')
      setProjects(getMockProjects())
    } finally {
      setLoading(false)
    }
  }

  const addProject = async (project: Omit<Project, 'id'>) => {
    try {
      console.log('Adding project to Firestore:', project.title)
      const projectData = {
        ...project,
        createdAt: new Date()
      }
      const docRef = await addDoc(collection(db, 'projects'), projectData)
      console.log('Project added successfully with ID:', docRef.id)
      
      const newProject = { ...projectData, id: docRef.id }
      setProjects(prev => [newProject, ...prev])
      return newProject
    } catch (error) {
      console.error('Error adding project:', error)
      // Provide more detailed error information
      if (error instanceof Error) {
        throw new Error(`Failed to add project: ${error.message}`)
      }
      throw error
    }
  }

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      console.log('Updating project:', id)
      await updateDoc(doc(db, 'projects', id), updates)
      setProjects(prev => prev.map(project => 
        project.id === id ? { ...project, ...updates } : project
      ))
      console.log('Project updated successfully')
    } catch (error) {
      console.error('Error updating project:', error)
      throw error
    }
  }

  const deleteProject = async (id: string) => {
    try {
      console.log('Deleting project:', id)
      await deleteDoc(doc(db, 'projects', id))
      setProjects(prev => prev.filter(project => project.id !== id))
      console.log('Project deleted successfully')
    } catch (error) {
      console.error('Error deleting project:', error)
      throw error
    }
  }

  return {
    projects,
    loading,
    addProject,
    updateProject,
    deleteProject,
    refetch: fetchProjects
  }
}

// Mock data for demo purposes
function getMockProjects(): Project[] {
  return [
    {
      id: 'mock-1',
      title: 'Kubernetes Cluster Automation',
      description: 'Automated Kubernetes cluster deployment with Terraform and GitOps using ArgoCD',
      technologies: ['Kubernetes', 'Terraform', 'ArgoCD', 'AWS', 'Helm'],
      githubUrl: 'https://github.com/yourusername/k8s-automation',
      liveUrl: 'https://k8s-dashboard.example.com',
      imageUrl: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=600&fit=crop',
      createdAt: new Date('2024-01-15')
    },
    {
      id: 'mock-2',
      title: 'CI/CD Pipeline with Jenkins',
      description: 'Comprehensive CI/CD pipeline setup with automated testing, security scanning, and deployment',
      technologies: ['Jenkins', 'Docker', 'SonarQube', 'AWS', 'Ansible'],
      githubUrl: 'https://github.com/yourusername/jenkins-pipeline',
      imageUrl: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&h=600&fit=crop',
      createdAt: new Date('2024-02-10')
    }
  ]
}