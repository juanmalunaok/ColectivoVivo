/**
 * Firebase — inicialización segura para SSR.
 *
 * Durante el build / SSR (sin .env.local real), initializeApp lanza
 * auth/invalid-api-key. Lo capturamos y exportamos stubs null-as-any
 * para que el módulo pueda cargarse sin romper el servidor.
 * En el browser (o en producción con vars reales) todo funciona normal.
 */
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth'
import { getDatabase, type Database } from 'firebase/database'
import { getFirestore, type Firestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL:       process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

interface FirebaseServices {
  auth:          Auth
  db:            Database
  firestore:     Firestore
  googleProvider: GoogleAuthProvider
}

function initFirebase(): FirebaseServices {
  try {
    const app: FirebaseApp = getApps().length
      ? getApps()[0]
      : initializeApp(firebaseConfig)

    return {
      auth:          getAuth(app),
      db:            getDatabase(app),
      firestore:     getFirestore(app),
      googleProvider: new GoogleAuthProvider(),
    }
  } catch {
    // Durante SSR sin claves reales — los consumidores solo usan estos
    // valores en useEffect / callbacks que no corren en el servidor
    /* eslint-disable @typescript-eslint/no-explicit-any */
    return {
      auth:          null as any,
      db:            null as any,
      firestore:     null as any,
      googleProvider: null as any,
    }
  }
}

const { auth, db, firestore, googleProvider } = initFirebase()

export { auth, db, firestore, googleProvider }
