// ─── Líneas y ramales ────────────────────────────────────────────────────────

export interface BusLine {
  number: string        // e.g. "109"
  name: string          // nombre de la empresa / línea
  branches: Branch[]
}

export interface Branch {
  id: string            // slug único, e.g. "109-plaza-italia-don-torcuato"
  name: string          // e.g. "Plaza Italia → Don Torcuato"
}

// ─── Viajes activos (Firebase Realtime Database) ─────────────────────────────

export interface ActiveTrip {
  tripId: string
  userId: string        // UID de Firebase Auth (no se muestra en el mapa)
  lineNumber: string    // "109"
  branchId: string
  branchName: string
  lat: number
  lng: number
  heading?: number      // dirección del movimiento en grados (0-360)
  speed?: number        // km/h
  timestamp: number     // epoch ms
  reports: number       // cantidad de reportes recibidos
  isVisible: boolean    // false si superó el umbral de reportes
}

// ─── Reportes (Firestore) ─────────────────────────────────────────────────────

export interface Report {
  reportId: string
  tripId: string
  reportedBy: string    // userId
  reason: 'incorrect_line' | 'not_moving' | 'suspicious' | 'other'
  timestamp: number
}

// ─── Usuario (Firestore) ──────────────────────────────────────────────────────

export interface AppUser {
  uid: string
  email: string | null
  displayName: string | null
  createdAt: number
  consentAccepted: boolean
  activeTrip?: string | null  // tripId activo si está viajando
}

// ─── Contexto de auth ─────────────────────────────────────────────────────────

export interface AuthContextType {
  user: import('firebase/auth').User | null
  appUser: AppUser | null
  loading: boolean
  signInWithEmail: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>
  signOut: () => Promise<void>
}

// ─── Estado de viaje activo ───────────────────────────────────────────────────

export interface TripState {
  isActive: boolean
  tripId: string | null
  lineNumber: string | null
  branchId: string | null
  branchName: string | null
  consentGiven: boolean
}
