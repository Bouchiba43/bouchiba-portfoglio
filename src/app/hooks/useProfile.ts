import { useState, useEffect } from 'react'

interface ProfileData {
  avatarUrl: string | null
  loading: boolean
}

export function useProfile() {
  const [profileData, setProfileData] = useState<ProfileData>({
    avatarUrl: null,
    loading: true
  })

  useEffect(() => {
    fetchProfileData()
  }, [])

  const fetchProfileData = async () => {
    try {
      const response = await fetch('/api/profile/avatar')
      if (response.ok) {
        const data = await response.json()
        setProfileData({
          avatarUrl: data.imageUrl,
          loading: false
        })
      } else {
        // If no avatar is found, use the default
        setProfileData({
          avatarUrl: '/uploads/ahmed-avatar.png',
          loading: false
        })
      }
    } catch (error) {
      console.error('Error fetching profile data:', error)
      // Fallback to default avatar
      setProfileData({
        avatarUrl: '/uploads/ahmed-avatar.png',
        loading: false
      })
    }
  }

  return {
    ...profileData,
    refetch: fetchProfileData
  }
} 