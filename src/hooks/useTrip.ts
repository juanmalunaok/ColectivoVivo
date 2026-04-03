'use client'

import { useState, useCallback, useRef } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { firestore } from '@/lib/firebase'
import { createTrip, updateTripLocation, endTrip } from '@/lib/realtimeDb'
import type { TripState } from '@/types'

const IDLE: TripState = {
  isActive:     false,
  tripId:       null,
  lineNumber:   null,
  branchId:     null,
  branchName:   null,
  consentGiven: false,
}

export function useTrip(userId: string | undefined) {
  const [trip, setTrip] = useState<TripState>(IDLE)
  const tripIdRef = useRef<string | null>(null)

  const startTrip = useCallback(
    async (
      lineNumber: string,
      branchId: string,
      branchName: string,
      lat: number,
      lng: number,
    ) => {
      if (!userId) throw new Error('Usuario no autenticado')

      const tripId = await createTrip(userId, lineNumber, branchId, branchName, lat, lng)
      tripIdRef.current = tripId

      // Marcamos en Firestore que el usuario tiene un viaje activo
      await updateDoc(doc(firestore, 'users', userId), { activeTrip: tripId })

      setTrip({
        isActive:     true,
        tripId,
        lineNumber,
        branchId,
        branchName,
        consentGiven: true,
      })
    },
    [userId],
  )

  const updateLocation = useCallback(
    async (lat: number, lng: number, heading: number | null, speedKmh: number | null) => {
      if (!tripIdRef.current) return
      await updateTripLocation(
        tripIdRef.current,
        lat,
        lng,
        heading ?? undefined,
        speedKmh ?? undefined,
      )
    },
    [],
  )

  const stopTrip = useCallback(async () => {
    if (!tripIdRef.current || !userId) return

    await endTrip(tripIdRef.current)
    await updateDoc(doc(firestore, 'users', userId), { activeTrip: null })

    tripIdRef.current = null
    setTrip(IDLE)
  }, [userId])

  return { trip, startTrip, updateLocation, stopTrip }
}
