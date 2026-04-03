'use client'

import { useState, useEffect } from 'react'
import { subscribeToActiveTrips, subscribeToLineTrips } from '@/lib/realtimeDb'
import type { ActiveTrip } from '@/types'

/** Suscripción a todos los viajes activos visibles */
export function useActiveTrips(): { trips: ActiveTrip[]; loading: boolean } {
  const [trips, setTrips]     = useState<ActiveTrip[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = subscribeToActiveTrips((data) => {
      setTrips(data)
      setLoading(false)
    })
    return unsub
  }, [])

  return { trips, loading }
}

/** Suscripción filtrada por línea */
export function useLineTrips(lineNumber: string | null): { trips: ActiveTrip[]; loading: boolean } {
  const [trips, setTrips]     = useState<ActiveTrip[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!lineNumber) {
      setTrips([])
      setLoading(false)
      return
    }
    const unsub = subscribeToLineTrips(lineNumber, (data) => {
      setTrips(data)
      setLoading(false)
    })
    return unsub
  }, [lineNumber])

  return { trips, loading }
}
