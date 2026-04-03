'use client'

import { useState } from 'react'
import { AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps'
import { reportTrip } from '@/lib/realtimeDb'
import type { ActiveTrip } from '@/types'

interface Props {
  trip: ActiveTrip
  currentUserId?: string
}

export function BusMarker({ trip, currentUserId }: Props) {
  const [open, setOpen]           = useState(false)
  const [reported, setReported]   = useState(false)
  const [reporting, setReporting] = useState(false)

  const isOwn = trip.userId === currentUserId

  async function handleReport() {
    if (reported || reporting) return
    setReporting(true)
    try {
      await reportTrip(trip.tripId)
      setReported(true)
    } finally {
      setReporting(false)
      setOpen(false)
    }
  }

  const position = { lat: trip.lat, lng: trip.lng }

  return (
    <>
      <AdvancedMarker position={position} onClick={() => setOpen(true)}>
        <div
          className={`bus-marker ${reported ? 'reported' : ''}`}
          title={`Línea ${trip.lineNumber} — ${trip.branchName}`}
        >
          {trip.lineNumber}
        </div>
      </AdvancedMarker>

      {open && (
        <InfoWindow position={position} onCloseClick={() => setOpen(false)}>
          <div className="min-w-[160px] text-sm">
            <p className="font-bold text-blue-700 text-base">Línea {trip.lineNumber}</p>
            <p className="text-gray-600 mt-0.5">{trip.branchName}</p>

            {trip.speed != null && (
              <p className="text-gray-400 text-xs mt-1">{trip.speed} km/h</p>
            )}

            {!isOwn && (
              <button
                onClick={handleReport}
                disabled={reported || reporting}
                className="mt-3 w-full text-xs text-red-600 border border-red-200 rounded px-2 py-1 hover:bg-red-50 transition disabled:opacity-50"
              >
                {reported ? 'Reportado' : reporting ? 'Reportando...' : 'Reportar marcador'}
              </button>
            )}

            {isOwn && (
              <p className="mt-2 text-xs text-blue-500 font-medium">Este soy yo</p>
            )}
          </div>
        </InfoWindow>
      )}
    </>
  )
}
