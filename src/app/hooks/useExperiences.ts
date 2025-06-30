// hooks/useExperiences.ts
import { useState, useEffect } from 'react'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy, query } from 'firebase/firestore'
import { db } from '@/app/lib/firebase'
import type { Experience } from '@/app/types'

export function useExperiences() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchExperiences()
  }, [])

  const fetchExperiences = async () => {
    try {
      console.log('Fetching experiences from Firestore...')
      const q = query(collection(db, 'experiences'), orderBy('startDate', 'desc'))
      const querySnapshot = await getDocs(q)
      const experiencesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startDate: doc.data().startDate?.toDate() || new Date(),
        endDate: doc.data().endDate?.toDate() || null,
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as Experience[]
      console.log('Experiences fetched successfully:', experiencesData.length)
      setExperiences(experiencesData)
    } catch (error) {
      console.error('Error fetching experiences:', error)
      // Use mock data if Firebase fails
      console.log('Using mock data as fallback')
      setExperiences(getMockExperiences())
    } finally {
      setLoading(false)
    }
  }

  const addExperience = async (experience: Omit<Experience, 'id'>) => {
    try {
      console.log('Adding experience to Firestore:', experience.company)
      const experienceData = {
        ...experience,
        createdAt: new Date()
      }
      const docRef = await addDoc(collection(db, 'experiences'), experienceData)
      console.log('Experience added successfully with ID:', docRef.id)
      const newExperience = { ...experienceData, id: docRef.id }
      setExperiences(prev => [newExperience, ...prev].sort((a, b) => 
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      ))
      return newExperience
    } catch (error) {
      console.error('Error adding experience:', error)
      if (error instanceof Error) {
        throw new Error(`Failed to add experience: ${error.message}`)
      }
      throw error
    }
  }

  const updateExperience = async (id: string, updates: Partial<Experience>) => {
    try {
      console.log('Updating experience:', id)
      await updateDoc(doc(db, 'experiences', id), updates)
      setExperiences(prev => prev.map(experience =>
        experience.id === id ? { ...experience, ...updates } : experience
      ).sort((a, b) => 
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      ))
      console.log('Experience updated successfully')
    } catch (error) {
      console.error('Error updating experience:', error)
      throw error
    }
  }

  const deleteExperience = async (id: string) => {
    try {
      console.log('Deleting experience:', id)
      await deleteDoc(doc(db, 'experiences', id))
      setExperiences(prev => prev.filter(experience => experience.id !== id))
      console.log('Experience deleted successfully')
    } catch (error) {
      console.error('Error deleting experience:', error)
      throw error
    }
  }

  return {
    experiences,
    loading,
    addExperience,
    updateExperience,
    deleteExperience,
    refetch: fetchExperiences
  }
}

// Mock data for demo purposes
function getMockExperiences(): Experience[] {
  return [
    {
      id: 'mock-1',
      company: 'TechCorp Solutions',
      position: 'Senior DevOps Engineer',
      description: 'Led infrastructure automation initiatives, implemented CI/CD pipelines for 50+ microservices, and managed Kubernetes clusters serving 1M+ daily users. Reduced deployment time by 70% and achieved 99.9% uptime.',
      technologies: ['Kubernetes', 'Docker', 'Jenkins', 'AWS', 'Terraform', 'Ansible', 'Prometheus', 'Grafana'],
      startDate: new Date('2022-01-15'),
      endDate: null,
      isCurrentRole: true,
      location: 'San Francisco, CA',
      companyUrl: 'https://techcorp.com',
      logoUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop',
      createdAt: new Date('2024-01-10')
    },
    {
      id: 'mock-2',
      company: 'CloudNative Inc',
      position: 'DevOps Engineer',
      description: 'Designed and implemented cloud infrastructure on AWS and Azure. Built automated deployment pipelines and monitoring solutions. Collaborated with development teams to optimize application performance.',
      technologies: ['AWS', 'Azure', 'Docker', 'GitLab CI', 'Helm', 'ELK Stack', 'Python', 'Bash'],
      startDate: new Date('2020-03-01'),
      endDate: new Date('2021-12-31'),
      isCurrentRole: false,
      location: 'Remote',
      companyUrl: 'https://cloudnative.com',
      logoUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=100&h=100&fit=crop',
      createdAt: new Date('2024-01-10')
    },
    {
      id: 'mock-3',
      company: 'StartupTech',
      position: 'Junior DevOps Engineer',
      description: 'Started my DevOps journey by automating manual processes, setting up monitoring systems, and learning cloud technologies. Contributed to migrating legacy applications to containerized environments.',
      technologies: ['Docker', 'Jenkins', 'Linux', 'Git', 'MySQL', 'Nginx'],
      startDate: new Date('2019-06-01'),
      endDate: new Date('2020-02-29'),
      isCurrentRole: false,
      location: 'New York, NY',
      companyUrl: 'https://startuptech.com',
      logoUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=100&h=100&fit=crop',
      createdAt: new Date('2024-01-10')
    }
  ]
}