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
  get,
  onDisconnect,
} from 'firebase/database'
import { db } from './firebase'
import type { ActiveTrip } from '@/types'

const TRIPS_PATH = 'activeTrips'
const REPORT_THRESHOLD = Number(process.env.NEXT_PUBLIC_REPORT_THRESHOLD ?? 3)
const MAX_TRIP_AGE_MS = 3 * 60 * 60 * 1000 // 3 horas — trips más viejos se ignoran

// ─── Crear un viaje activo ─────────────────────────────────────────────────

export async function createTrip(
  userId: string,
  lineNumber: string,
  branchId: string,
  branchName: string,
  lat: number,
  lng: number,
): Promise<string> {
  // 1. Eliminar cualquier viaje activo previo del mismo usuario
  //    Evita duplicados cuando la sesión anterior no terminó correctamente
  const existingQuery = query(ref(db, TRIPS_PATH), orderByChild('userId'), equalTo(userId))
  const existingSnap = await get(existingQuery)
  if (existingSnap.exists()) {
    await Promise.all(
      Object.keys(existingSnap.val()).map((key) => remove(ref(db, `${TRIPS_PATH}/${key}`))),
    )
  }

  // 2. Crear el nuevo viaje
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

  // 3. Auto-eliminar si el cliente se desconecta sin llamar stopTrip
  //    (cierra el navegador, pierde señal, se queda sin batería, etc.)
  onDisconnect(newTripRef).remove()

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

// ─── Limpiar todos los trips de un usuario (al iniciar sesión) ────────────

export async function cleanupUserTrips(userId: string): Promise<void> {
  if (!db) return
  const existingQuery = query(ref(db, TRIPS_PATH), orderByChild('userId'), equalTo(userId))
  const snap = await get(existingQuery)
  if (!snap.exists()) return
  await Promise.all(
    Object.keys(snap.val()).map((key) => remove(ref(db, `${TRIPS_PATH}/${key}`))),
  )
}

// ─── Terminar viaje ────────────────────────────────────────────────────────

export async function endTrip(tripId: string): Promise<void> {
  const tripRef = ref(db, `${TRIPS_PATH}/${tripId}`)
  // Cancelar el onDisconnect antes de eliminar manualmente
  await onDisconnect(tripRef).cancel()
  await remove(tripRef)
}

// ─── Reportar marcador ─────────────────────────────────────────────────────

export async function reportTrip(tripId: string): Promise<void> {
  const tripRef = ref(db, `${TRIPS_PATH}/${tripId}`)
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

    const now = Date.now()
    const all: ActiveTrip[] = Object.entries(data).map(([tripId, val]) => ({
      ...(val as Omit<ActiveTrip, 'tripId'>),
      tripId,
    }))

    // Filtrar invisibles por reportes y trips muy viejos (> 3 horas)
    const visible = all.filter(
      (t) => t.isVisible && (now - t.timestamp) < MAX_TRIP_AGE_MS,
    )

    // Deduplicar por userId: si un usuario tiene más de un trip activo
    // (sesión anterior no terminó bien), quedarse solo con el más reciente
    const byUser = new Map<string, ActiveTrip>()
    for (const t of visible) {
      const existing = byUser.get(t.userId)
      if (!existing || t.timestamp > existing.timestamp) {
        byUser.set(t.userId, t)
      }
    }

    callback(Array.from(byUser.values()))
  })

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

    const now = Date.now()
    const all: ActiveTrip[] = Object.entries(data).map(([tripId, val]) => ({
      ...(val as Omit<ActiveTrip, 'tripId'>),
      tripId,
    }))

    const visible = all.filter(
      (t) => t.isVisible && (now - t.timestamp) < MAX_TRIP_AGE_MS,
    )

    // Deduplicar por userId también en la query filtrada por línea
    const byUser = new Map<string, ActiveTrip>()
    for (const t of visible) {
      const existing = byUser.get(t.userId)
      if (!existing || t.timestamp > existing.timestamp) {
        byUser.set(t.userId, t)
      }
    }

    callback(Array.from(byUser.values()))
  })

  return () => off(lineQuery, 'value', listener)
}
