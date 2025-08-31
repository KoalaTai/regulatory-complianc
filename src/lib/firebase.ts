// Firebase configuration with demo mode support
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from 'firebase/auth'
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { demoAuth, demoFirestore, isDemoMode } from './demoAuth'

const firebaseConfig = {
  // Demo configuration - replace with your Firebase project config
  apiKey: "demo-api-key-virtualbackroom",
  authDomain: "virtualbackroom-ai-demo.firebaseapp.com", 
  projectId: "virtualbackroom-ai-demo",
  storageBucket: "virtualbackroom-ai-demo.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456789012345678"
}

// Initialize Firebase (only in production)
let app: any = null
let auth: any = null
let db: any = null
let googleProvider: any = null

if (!isDemoMode()) {
  try {
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)
    googleProvider = new GoogleAuthProvider()
  } catch (error) {
    console.warn('Firebase initialization failed, using demo mode:', error)
  }
}

// Auth functions with demo mode fallback
export const signInWithGoogle = async () => {
  if (isDemoMode()) {
    return demoAuth.signInWithGoogle()
  }
  
  try {
    const result = await signInWithPopup(auth, googleProvider)
    return { success: true, user: result.user }
  } catch (error: any) {
    console.error('Google sign-in error:', error)
    return { success: false, error: error.message }
  }
}

export const signInWithEmail = async (email: string, password: string) => {
  if (isDemoMode()) {
    return demoAuth.signInWithEmail(email, password)
  }
  
  try {
    const result = await signInWithEmailAndPassword(auth, email, password)
    return { success: true, user: result.user }
  } catch (error: any) {
    console.error('Email sign-in error:', error)
    return { success: false, error: error.message }
  }
}

export const registerWithEmail = async (email: string, password: string, displayName: string) => {
  if (isDemoMode()) {
    return demoAuth.registerWithEmail(email, password, displayName)
  }
  
  try {
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
  if (isDemoMode()) {
    return demoAuth.logout()
  }
  
  try {
    await signOut(auth)
    return { success: true }
  } catch (error: any) {
    console.error('Logout error:', error)
    return { success: false, error: error.message }
  }
}

// Firestore functions with demo mode fallback
export const createUserDocument = async (user: any) => {
  if (isDemoMode()) {
    return demoFirestore.createUserDocument(user)
  }
  
  try {
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
  if (isDemoMode()) {
    return demoFirestore.getUserDocument(uid)
  }
  
  try {
    const userDoc = doc(db, 'users', uid)
    const userSnapshot = await getDoc(userDoc)
    return userSnapshot.exists() ? userSnapshot.data() : null
  } catch (error) {
    console.error('Error getting user document:', error)
    return null
  }
}

export const updateUserDocument = async (uid: string, data: any) => {
  if (isDemoMode()) {
    return demoFirestore.updateUserDocument(uid, data)
  }
  
  try {
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
  if (isDemoMode()) {
    return demoAuth.onAuthStateChanged(callback)
  }
  
  try {
    return onAuthStateChanged(auth, callback)
  } catch (error) {
    console.error('Firebase auth state observer error:', error)
    // Return a dummy unsubscribe function
    return () => {}
  }
}

// Export for direct access if needed
export { auth, db }