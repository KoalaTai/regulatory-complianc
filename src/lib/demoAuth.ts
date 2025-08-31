// Demo authentication for local development
import { useKV } from '@github/spark/hooks'

interface DemoUser {
  uid: string
  email: string
  displayName: string
  photoURL?: string
}

let demoAuthState: DemoUser | null = null
let authCallbacks: ((user: DemoUser | null) => void)[] = []

export const demoAuth = {
  // Simulate Firebase auth methods
  signInWithGoogle: async () => {
    const demoUser: DemoUser = {
      uid: 'demo-google-user',
      email: 'demo@virtualbackroom.ai',
      displayName: 'Demo Google User',
      photoURL: 'https://via.placeholder.com/40'
    }
    
    demoAuthState = demoUser
    authCallbacks.forEach(callback => callback(demoUser))
    
    return { success: true, user: demoUser }
  },

  signInWithEmail: async (email: string, password: string) => {
    // Simple demo validation
    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' }
    }
    
    const demoUser: DemoUser = {
      uid: `demo-email-${email.replace('@', '-').replace('.', '-')}`,
      email,
      displayName: email.split('@')[0],
    }
    
    demoAuthState = demoUser
    authCallbacks.forEach(callback => callback(demoUser))
    
    return { success: true, user: demoUser }
  },

  registerWithEmail: async (email: string, password: string, displayName: string) => {
    // Simple demo validation
    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' }
    }
    
    const demoUser: DemoUser = {
      uid: `demo-register-${email.replace('@', '-').replace('.', '-')}`,
      email,
      displayName,
    }
    
    demoAuthState = demoUser
    authCallbacks.forEach(callback => callback(demoUser))
    
    return { success: true, user: demoUser }
  },

  logout: async () => {
    demoAuthState = null
    authCallbacks.forEach(callback => callback(null))
    return { success: true }
  },

  onAuthStateChanged: (callback: (user: DemoUser | null) => void) => {
    authCallbacks.push(callback)
    
    // Call immediately with current state
    setTimeout(() => callback(demoAuthState), 0)
    
    return () => {
      authCallbacks = authCallbacks.filter(cb => cb !== callback)
    }
  },

  getCurrentUser: () => demoAuthState
}

// Demo Firestore functions
export const demoFirestore = {
  createUserDocument: async (user: DemoUser) => {
    console.log('Demo: Created user document for', user.email)
  },

  getUserDocument: async (uid: string) => {
    return {
      displayName: demoAuthState?.displayName || 'Demo User',
      email: demoAuthState?.email || 'demo@virtualbackroom.ai',
      photoURL: demoAuthState?.photoURL,
      preferences: {
        primaryStandards: ['FDA_QSR', 'ISO_13485'],
        notificationsEnabled: true,
        theme: 'professional',
        dashboardLayout: 'detailed',
        reminderFrequency: 'weekly'
      },
      stats: {
        auditSimulationsCompleted: 5,
        citationsManaged: 23,
        aiConversations: 12,
        standardsTracked: 8,
        goalsCompleted: 3,
        totalSectionsCompleted: 45
      },
      complianceProfile: {
        industry: 'Medical Devices',
        companySize: 'Medium (50-500 employees)',
        primaryRegions: ['United States', 'European Union'],
        certificationGoals: ['ISO 13485 Certification', 'FDA 510(k) Approval'],
        riskTolerance: 'medium'
      }
    }
  },

  updateUserDocument: async (uid: string, data: any) => {
    console.log('Demo: Updated user document', uid, data)
    return { success: true }
  }
}

// Check if we're in development/demo mode (defaults to true)
export const isDemoMode = () => {
  // Always use demo mode in Spark environment
  return true
}