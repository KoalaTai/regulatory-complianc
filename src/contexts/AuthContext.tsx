import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from 'firebase/auth'
import { onAuthStateChange, createUserDocument, getUserDocument } from '@/lib/firebase'
import { useKV } from '@github/spark/hooks'

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>
  syncUserData: () => Promise<void>
}

interface UserProfile {
  displayName: string
  email: string
  photoURL?: string
  preferences: {
    primaryStandards: string[]
    notificationsEnabled: boolean
    theme: string
  }
  stats: {
    auditSimulationsCompleted: number
    citationsManaged: number
    aiConversations: number
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // Local storage hooks for data migration
  const [localAuditSimulations] = useKV("audit-simulations", [])
  const [localCitations] = useKV("citations", [])
  const [localChatHistory] = useKV("chat-history", [])

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      setUser(firebaseUser)
      
      if (firebaseUser) {
        // User is signed in
        try {
          await createUserDocument(firebaseUser)
          const profile = await getUserDocument(firebaseUser.uid)
          if (profile) {
            setUserProfile(profile as UserProfile)
            // Sync local data to user account
            await syncLocalDataToUser(firebaseUser.uid)
          } else {
            // Create default profile for demo users or when Firestore is unavailable
            const defaultProfile: UserProfile = {
              displayName: firebaseUser.displayName || firebaseUser.email || 'User',
              email: firebaseUser.email || '',
              photoURL: firebaseUser.photoURL || undefined,
              preferences: {
                primaryStandards: [],
                notificationsEnabled: true,
                theme: 'professional'
              },
              stats: {
                auditSimulationsCompleted: 0,
                citationsManaged: 0,
                aiConversations: 0
              }
            }
            setUserProfile(defaultProfile)
          }
        } catch (error) {
          console.error('Error setting up user profile:', error)
          // Fallback to local profile for demo mode
          const defaultProfile: UserProfile = {
            displayName: firebaseUser.displayName || firebaseUser.email || 'User',
            email: firebaseUser.email || '',
            photoURL: firebaseUser.photoURL || undefined,
            preferences: {
              primaryStandards: [],
              notificationsEnabled: true,
              theme: 'professional'
            },
            stats: {
              auditSimulationsCompleted: localAuditSimulations.length,
              citationsManaged: localCitations.length,
              aiConversations: localChatHistory.length
            }
          }
          setUserProfile(defaultProfile)
        }
      } else {
        // User is signed out
        setUserProfile(null)
      }
      
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const syncLocalDataToUser = async (uid: string) => {
    try {
      // This would normally sync with Firestore, but for now we'll keep using useKV
      // with user-specific keys to simulate user-associated data
      console.log('Syncing user data for uid:', uid)
      
      // Update user stats based on local data
      if (userProfile) {
        const updatedStats = {
          auditSimulationsCompleted: localAuditSimulations.length,
          citationsManaged: localCitations.length,
          aiConversations: localChatHistory.length
        }
        
        setUserProfile(prev => prev ? {
          ...prev,
          stats: updatedStats
        } : null)
      }
    } catch (error) {
      console.error('Error syncing local data:', error)
    }
  }

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user || !userProfile) return

    try {
      const updatedProfile = { ...userProfile, ...data }
      setUserProfile(updatedProfile)
      
      // In a full implementation, this would update Firestore
      console.log('User profile updated:', updatedProfile)
    } catch (error) {
      console.error('Error updating user profile:', error)
    }
  }

  const syncUserData = async () => {
    if (!user) return
    
    try {
      // Refresh user profile from Firestore
      const profile = await getUserDocument(user.uid)
      if (profile) {
        setUserProfile(profile as UserProfile)
      }
    } catch (error) {
      console.error('Error syncing user data:', error)
    }
  }

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    updateUserProfile,
    syncUserData
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}