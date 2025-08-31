// Firebase configuration with demo mode support
// Firebase imports are conditionally loaded to avoid errors in demo environments
import { demoAuth, demoFirestore, isDemoMode } from './demoAuth'

// Firebase types for TypeScript compatibility
type FirebaseApp = any
type Auth = any
type Firestore = any
type GoogleAuthProvider = any

const firebaseConfig = {
  // Demo configuration - replace with your Firebase project config
  apiKey: "demo-api-key-virtualbackroom",
  authDomain: "virtualbackroom-ai-demo.firebaseapp.com", 
  projectId: "virtualbackroom-ai-demo",
  storageBucket: "virtualbackroom-ai-demo.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456789012345678"
}

// Initialize Firebase (only in production with available dependencies)
let app: FirebaseApp = null
let auth: Auth = null
let db: Firestore = null
let googleProvider: GoogleAuthProvider = null

// Dynamically import Firebase only if available and not in demo mode
const initializeFirebase = async () => {
  if (isDemoMode()) return false
  
  try {
    // Try to dynamically import Firebase modules
    const { initializeApp } = await import('firebase/app')
    const { getAuth, GoogleAuthProvider } = await import('firebase/auth')
    const { getFirestore } = await import('firebase/firestore')
    
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)
    googleProvider = new GoogleAuthProvider()
    return true
  } catch (error) {
    console.warn('Firebase not available, using demo mode:', error)
    return false
  }
}

// Initialize Firebase on module load
initializeFirebase()

// Auth functions with demo mode fallback
export const signInWithGoogle = async () => {
  if (isDemoMode() || !auth) {
    return demoAuth.signInWithGoogle()
  }
  
  try {
    const { signInWithPopup } = await import('firebase/auth')
    const result = await signInWithPopup(auth, googleProvider)
    return { success: true, user: result.user }
  } catch (error: any) {
    console.error('Google sign-in error:', error)
    return { success: false, error: error.message }
  }
}

export const signInWithEmail = async (email: string, password: string) => {
  if (isDemoMode() || !auth) {
    return demoAuth.signInWithEmail(email, password)
  }
  
  try {
    const { signInWithEmailAndPassword } = await import('firebase/auth')
    const result = await signInWithEmailAndPassword(auth, email, password)
    return { success: true, user: result.user }
  } catch (error: any) {
    console.error('Email sign-in error:', error)
    return { success: false, error: error.message }
  }
}

export const registerWithEmail = async (email: string, password: string, displayName: string) => {
  if (isDemoMode() || !auth) {
    return demoAuth.registerWithEmail(email, password, displayName)
  }
  
  try {
    const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth')
    const result = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(result.user, { displayName })
    
    // Create user document in Firestore
    await createUserDocument(result.user)
    
    return { success: true, user: result.user }
  } catch (error: any) {
    console.error('Registration error:', error)
    return { success: false, error: error.message }
  }
}

export const logout = async () => {
  if (isDemoMode() || !auth) {
    return demoAuth.logout()
  }
  
  try {
    const { signOut } = await import('firebase/auth')
    await signOut(auth)
    return { success: true }
  } catch (error: any) {
    console.error('Logout error:', error)
    return { success: false, error: error.message }
  }
}

// Firestore functions with demo mode fallback
export const createUserDocument = async (user: any) => {
  if (isDemoMode() || !db) {
    return demoFirestore.createUserDocument(user)
  }
  
  try {
    const { doc, getDoc, setDoc } = await import('firebase/firestore')
    const userDoc = doc(db, 'users', user.uid)
    const userSnapshot = await getDoc(userDoc)
    
    if (!userSnapshot.exists()) {
      const { displayName, email, photoURL } = user
      const createdAt = new Date()
      
      await setDoc(userDoc, {
        displayName,
        email,
        photoURL,
        createdAt,
        preferences: {
          primaryStandards: [],
          notificationsEnabled: true,
          theme: 'professional',
          dashboardLayout: 'detailed',
          reminderFrequency: 'weekly'
        },
        stats: {
          auditSimulationsCompleted: 0,
          citationsManaged: 0,
          aiConversations: 0,
          standardsTracked: 0,
          goalsCompleted: 0,
          totalSectionsCompleted: 0
        },
        complianceProfile: {
          industry: '',
          companySize: '',
          primaryRegions: [],
          certificationGoals: [],
          riskTolerance: 'medium'
        }
      })
    }
  } catch (error) {
    console.error('Error creating user document:', error)
  }
}

export const getUserDocument = async (uid: string) => {
  if (isDemoMode() || !db) {
    return demoFirestore.getUserDocument(uid)
  }
  
  try {
    const { doc, getDoc } = await import('firebase/firestore')
    const userDoc = doc(db, 'users', uid)
    const userSnapshot = await getDoc(userDoc)
    return userSnapshot.exists() ? userSnapshot.data() : null
  } catch (error) {
    console.error('Error getting user document:', error)
    return null
  }
}

export const updateUserDocument = async (uid: string, data: any) => {
  if (isDemoMode() || !db) {
    return demoFirestore.updateUserDocument(uid, data)
  }
  
  try {
    const { doc, updateDoc } = await import('firebase/firestore')
    const userDoc = doc(db, 'users', uid)
    await updateDoc(userDoc, data)
    return { success: true }
  } catch (error: any) {
    console.error('Error updating user document:', error)
    return { success: false, error: error.message }
  }
}

// Auth state observer with demo mode fallback
export const onAuthStateChange = (callback: (user: any) => void) => {
  if (isDemoMode() || !auth) {
    return demoAuth.onAuthStateChanged(callback)
  }
  
  try {
    // Dynamically import Firebase auth observer
    import('firebase/auth').then(({ onAuthStateChanged }) => {
      return onAuthStateChanged(auth, callback)
    }).catch(error => {
      console.error('Firebase auth state observer error:', error)
      // Fallback to demo mode
      return demoAuth.onAuthStateChanged(callback)
    })
    
    // Return demo mode observer as fallback
    return demoAuth.onAuthStateChanged(callback)
  } catch (error) {
    console.error('Firebase auth state observer error:', error)
    // Return demo mode observer
    return demoAuth.onAuthStateChanged(callback)
  }
}

// Export for direct access if needed
export { auth, db }