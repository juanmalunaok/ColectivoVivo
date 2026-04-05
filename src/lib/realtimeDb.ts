/**
 * Operaciones sobre Firebase Realtime Database.
 * Estructura: /activeTrips/{tripId}
 */
import {
  ref,
  set,
  remove,
  update,
  onValue,
  query,
  orderByChild,
  equalTo,
  off,
  push,
  serverTimestamp,
} from 'firebase/database'
import { db } from './firebase'
import type { ActiveTrip } from '@/types'

const TRIPS_PATH = 'activeTrips'
const REPORT_THRESHOLD = Number(process.env.NEXT_PUBLIC_REPORT_THRESHOLD ?? 3)

// ─── Crear un viaje activo ─────────────────────────────────────────────────

export async function createTrip(
  userId: string,
  lineNumber: string,
  branchId: string,
  branchName: string,
  lat: number,
  lng: number,
): Promise<string> {
  const tripsRef = ref(db, TRIPS_PATH)
  const newTripRef = push(tripsRef)
  const tripId = newTripRef.key!

  const trip: Omit<ActiveTrip, 'tripId'> = {
    userId,
    lineNumber,
    branchId,
    branchName,
    lat,
    lng,
    timestamp: Date.now(),
    reports: 0,
    isVisible: true,
  }

  await set(newTripRef, trip)
  return tripId
}

// ─── Actualizar posición GPS ───────────────────────────────────────────────

export async function updateTripLocation(
  tripId: string,
  lat: number,
  lng: number,
  heading?: number,
  speed?: number,
): Promise<void> {
  const tripRef = ref(db, `${TRIPS_PATH}/${tripId}`)
  await update(tripRef, {
    lat,
    lng,
    heading:   heading ?? null,
    speed:     speed ?? null,
    timestamp: Date.now(),
  })
}

// ─── Actualizar ocupación ──────────────────────────────────────────────────

export async function updateOccupancy(
  tripId: string,
  occupancy: import('@/types').Occupancy,
): Promise<void> {
  const tripRef = ref(db, `${TRIPS_PATH}/${tripId}`)
  await update(tripRef, { occupancy })
}

// ─── Terminar viaje ────────────────────────────────────────────────────────

export async function endTrip(tripId: string): Promise<void> {
  const tripRef = ref(db, `${TRIPS_PATH}/${tripId}`)
  await remove(tripRef)
}

// ─── Reportar marcador ─────────────────────────────────────────────────────

export async function reportTrip(tripId: string): Promise<void> {
  const tripRef = ref(db, `${TRIPS_PATH}/${tripId}`)
  // Leemos el valor actual y lo incrementamos de forma segura
  const { get } = await import('firebase/database')
  const snapshot = await get(tripRef)
  if (!snapshot.exists()) return

  const data = snapshot.val() as ActiveTrip
  const newReports = (data.reports ?? 0) + 1
  const isVisible = newReports < REPORT_THRESHOLD

  await update(tripRef, { reports: newReports, isVisible })
}

// ─── Suscripción a todos los viajes activos ─────────────────────────────────

export function subscribeToActiveTrips(
  callback: (trips: ActiveTrip[]) => void,
): () => void {
  if (!db) { callback([]); return () => {} }
  const tripsRef = ref(db, TRIPS_PATH)

  const listener = onValue(tripsRef, (snapshot) => {
    const data = snapshot.val()
    if (!data) {
      callback([])
      return
    }
    const trips: ActiveTrip[] = Object.entries(data).map(([tripId, val]) => ({
      ...(val as Omit<ActiveTrip, 'tripId'>),
      tripId,
    }))
    // Filtramos los ocultos por reportes
    callback(trips.filter((t) => t.isVisible))
  })

  // Devuelve función de cleanup
  return () => off(tripsRef, 'value', listener)
}

// ─── Suscripción a viajes de una línea específica ──────────────────────────

export function subscribeToLineTrips(
  lineNumber: string,
  callback: (trips: ActiveTrip[]) => void,
): () => void {
  if (!db) { callback([]); return () => {} }
  const tripsRef = ref(db, TRIPS_PATH)
  const lineQuery = query(tripsRef, orderByChild('lineNumber'), equalTo(lineNumber))

  const listener = onValue(lineQuery, (snapshot) => {
    const data = snapshot.val()
    if (!data) {
      callback([])
      return
    }
    const trips: ActiveTrip[] = Object.entries(data).map(([tripId, val]) => ({
      ...(val as Omit<ActiveTrip, 'tripId'>),
      tripId,
    }))
    callback(trips.filter((t) => t.isVisible))
  })

  return () => off(lineQuery, 'value', listener)
}
