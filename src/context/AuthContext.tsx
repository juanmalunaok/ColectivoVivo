'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from 'firebase/auth'
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { auth, firestore, googleProvider } from '@/lib/firebase'
import { cleanupUserTrips } from '@/lib/realtimeDb'
import type { AppUser, AuthContextType } from '@/types'

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]         = useState<User | null>(null)
  const [appUser, setAppUser]   = useState<AppUser | null>(null)
  const [loading, setLoading]   = useState(true)

  // Carga o crea el perfil del usuario en Firestore
  const syncAppUser = useCallback(async (firebaseUser: User) => {
    if (!firestore) return
    const userRef = doc(firestore, 'users', firebaseUser.uid)
    const snap    = await getDoc(userRef)

    if (snap.exists()) {
      const data = snap.data() as AppUser
      // Limpiar trips huérfanos de sesiones anteriores
      await cleanupUserTrips(firebaseUser.uid)
      // Si Firestore aún tiene un activeTrip registrado, limpiarlo también
      if (data.activeTrip) {
        await updateDoc(userRef, { activeTrip: null })
        data.activeTrip = null
      }
      setAppUser(data)
    } else {
      const newUser: AppUser = {
        uid:             firebaseUser.uid,
        email:           firebaseUser.email,
        displayName:     firebaseUser.displayName,
        createdAt:       Date.now(),
        consentAccepted: false,
        activeTrip:      null,
      }
      await setDoc(userRef, newUser)
      setAppUser(newUser)
    }
  }, [])

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return
    }
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        await syncAppUser(firebaseUser)
      } else {
        setAppUser(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [syncAppUser])

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }, [])

  const signUpWithEmail = useCallback(
    async (email: string, password: string, displayName: string) => {
      const credential = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(credential.user, { displayName })
    },
    [],
  )

  const signInWithGoogle = useCallback(async () => {
    await signInWithPopup(auth, googleProvider)
  }, [])

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth)
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, appUser, loading, signInWithEmail, signInWithGoogle, signUpWithEmail, signOut }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
